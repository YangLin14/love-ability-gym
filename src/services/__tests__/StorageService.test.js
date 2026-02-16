import { describe, it, expect, vi, beforeEach } from 'vitest';
import StorageService from '../StorageService';
import { supabase } from '../supabaseClient';

describe('StorageService', () => {
    beforeEach(() => {
        // Clear both localStorage AND the internal cache
        StorageService.clearAllData();
        vi.restoreAllMocks();
    });

    it('saves a log entry correctly', () => {
        const moduleName = 'module1';
        const data = { emotion: 'Happy', intensity: 5 };
        
        const result = StorageService.saveLog(moduleName, data);
        
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('emotion', 'Happy');
        expect(result).toHaveProperty('intensity', 5);

        // Verify localStorage
        const stored = JSON.parse(localStorage.getItem('love_gym_module1_logs'));
        expect(stored).toHaveLength(1);
        expect(stored[0]).toEqual(result);
    });

    it('retrieves logs for a module', () => {
        const moduleName = 'module2';
        const log1 = { id: 1, createdAt: '2023-01-01T10:00:00Z', emotion: 'Sad' };
        const log2 = { id: 2, createdAt: '2023-01-02T10:00:00Z', emotion: 'Joy' };
        
        localStorage.setItem(`love_gym_${moduleName}_logs`, JSON.stringify([log2, log1]));

        const logs = StorageService.getLogs(moduleName);
        expect(logs).toHaveLength(2);
        expect(logs[0]).toEqual(log2); 
    });

    it('returns empty array if no logs exist', () => {
        const logs = StorageService.getLogs('nonexistent');
        expect(logs).toEqual([]);
    });

    it('clears logs for a specific module', () => {
        const moduleName = 'module3';
        StorageService.saveLog(moduleName, { test: 'data' });
        
        expect(StorageService.getLogs(moduleName)).toHaveLength(1);
        
        StorageService.clearLogs(moduleName);
        
        expect(StorageService.getLogs(moduleName)).toHaveLength(0);
        expect(localStorage.getItem(`love_gym_${moduleName}_logs`)).toBeNull();
    });

    it('getAllLogs retrieves logs from all known modules sorted by date', () => {
        StorageService.clearAllData(); // Double ensure clear state
        
        const logOlder = { id: 1, createdAt: '2023-01-01T10:00:00Z', func: 'old' };
        const logNewer = { id: 2, createdAt: '2023-01-02T10:00:00Z', func: 'new' };
        
        // Use spyOn to ensure we aren't using cached getLogs if clearAllData didn't clear it
        // But since we fixed beforeEach, we can just save directly to localStorage OR use saveLog
        // Using localStorage directly mimics "pre-existing data" scenario
        localStorage.setItem('love_gym_module1_logs', JSON.stringify([logOlder]));
        localStorage.setItem('love_gym_module2_logs', JSON.stringify([logNewer]));

        const allLogs = StorageService.getAllLogs();
        
        expect(allLogs).toHaveLength(2);
        // Sorted new to old
        expect(allLogs[0]).toMatchObject({ func: 'new', module: 'module2' });
        expect(allLogs[1]).toMatchObject({ func: 'old', module: 'module1' });
    });

    it('getStats calculates usage statistics', () => {
        StorageService.clearAllData();
        
        const logs1 = [
            { tool: 'Tool A', createdAt: '2023-01-01' },
            { tool: 'Tool A', createdAt: '2023-01-02' }
        ];
        const logs2 = [
            { tool: 'Tool B', createdAt: '2023-01-03' }
        ];

        localStorage.setItem('love_gym_module1_logs', JSON.stringify(logs1));
        localStorage.setItem('love_gym_module2_logs', JSON.stringify(logs2));

        const stats = StorageService.getStats();
        
        expect(stats).toEqual({
            'Tool A': 2,
            'Tool B': 1
        });
    });

    it('clears all data', () => {
        StorageService.saveLog('module1', { a: 1 });
        StorageService.saveLog('module2', { b: 2 });
        
        expect(Object.keys(localStorage).length).toBeGreaterThan(0);
        
        StorageService.clearAllData();
        
        expect(localStorage.length).toBe(0);
        expect(StorageService.getLogs('module1')).toHaveLength(0);
    });

    it('handles storage errors gracefully', () => {
        // With IndexedDB as primary store, saveLog succeeds even when localStorage throws.
        // The localStorage write is wrapped in try-catch, so it's a non-fatal fallback failure.
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceeded');
        });
        
        const result = StorageService.saveLog('module1', { data: 'test' });
        
        // saveLog should still succeed (writes to cache + IndexedDB)
        expect(result).not.toBeNull();
        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('data', 'test');
        
        setItemSpy.mockRestore();
    }); 

    it('handles corrupted JSON data gracefully', () => {
        // Mock invalid JSON
        localStorage.setItem('love_gym_module1_logs', '{ invalid: json }');
        
        // Should return empty array and not crash
        const logs = StorageService.getLogs('module1');
        
        expect(logs).toEqual([]);
    });

    it('handles null or undefined storage values', () => {
        localStorage.setItem('love_gym_module1_logs', null);
        
        const logs = StorageService.getLogs('module1');
        
        expect(logs).toEqual([]);
    });

    describe('Cloud Sync (Profile & Stats)', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            StorageService.clearAllData();
        });

        it('saveProfile saves to local and syncs to cloud', async () => {
            const profile = { name: 'TestUser', avatar: '😎' };
            const userId = 'user-123';
            
            // Mock Supabase Auth
            supabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } } });
            
            // Mock Supabase Upsert
            const upsertMock = vi.fn().mockResolvedValue({ error: null });
            supabase.from.mockReturnValue({ upsert: upsertMock });

            await StorageService.saveProfile(profile);

            // Verify Local
            expect(JSON.parse(localStorage.getItem('love_ability_profile'))).toEqual(profile);

            // Verify Cloud
            expect(supabase.from).toHaveBeenCalledWith('user_logs');
            expect(upsertMock).toHaveBeenCalledWith(expect.objectContaining({
                user_id: userId,
                module_name: 'profile',
                data: profile,
                client_id: 'user_profile_data'
            }), { onConflict: 'client_id' });
        });

        it('saveStats saves to local and syncs to cloud', async () => {
            const stats = { xp: 100, level: 2 };
            const userId = 'user-123';
            
            supabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } } });
            const upsertMock = vi.fn().mockResolvedValue({ error: null });
            supabase.from.mockReturnValue({ upsert: upsertMock });

            await StorageService.saveStats(stats);

            // Verify Local
            expect(JSON.parse(localStorage.getItem('love_ability_stats'))).toEqual(stats);

            // Verify Cloud
            expect(upsertMock).toHaveBeenCalledWith(expect.objectContaining({
                module_name: 'stats',
                data: stats,
                client_id: 'user_stats_data'
            }), { onConflict: 'client_id' });
        });

        it('syncGlobalData fetches from cloud and updates localStorage', async () => {
            const userId = 'user-123';
            const cloudData = [
                { module_name: 'profile', data: { name: 'CloudUser' } },
                { module_name: 'stats', data: { xp: 500 } }
            ];

            // Mock User
            supabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } } });

            // Mock Select
            const selectMock = vi.fn().mockReturnValue({
                in: vi.fn().mockResolvedValue({ data: cloudData, error: null })
            });
            supabase.from.mockReturnValue({ select: selectMock });

            const result = await StorageService.syncGlobalData();

            expect(result.profile).toEqual(cloudData[0].data);
            expect(result.stats).toEqual(cloudData[1].data);

            // Verify Local Storage Updated
            expect(JSON.parse(localStorage.getItem('love_ability_profile'))).toEqual(cloudData[0].data);
            expect(JSON.parse(localStorage.getItem('love_ability_stats'))).toEqual(cloudData[1].data);
        });

        it('syncGlobalData handles offline/no-user gracefully', async () => {
            // Mock No User
            supabase.auth.getUser.mockResolvedValue({ data: { user: null } });

            const result = await StorageService.syncGlobalData();

            expect(result).toBeNull();
            expect(supabase.from).not.toHaveBeenCalled();
        });
    });
});
