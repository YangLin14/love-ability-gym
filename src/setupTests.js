import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Fix "matchMedia not present"
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
// Mock Supabase Client globally if needed, or per test file
// But since StorageService imports 'supabase' constant, we need to mock the module
vi.mock('./services/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnValue({
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    })),
  }
}));
