import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppProvider';
import { useAuth } from '../context/AuthContext';
import StorageService from '../services/StorageService';

const Settings = () => {
  const { t, deferredPrompt, isIos, isStandalone, installPWA } = useApp();
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  // Auth State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const { error } = await signUp({ email, password });
        if (error) throw error;

        alert(t('settings.check_email'));
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    await StorageService.syncWithCloud();
    setIsSyncing(false);

    alert(t('settings.sync_success'));
  };

  const handleReset = () => {
      if (window.confirm(t('profile.reset_confirm') || "Are you sure you want to delete all data? This cannot be undone.")) {
         localStorage.clear();
         window.location.reload();
      }
  };

  return (
    <div className="page-container" style={{paddingTop: '20px'}}>
      
      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
        <button onClick={() => navigate(-1)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0 10px 0 0'}}>
          ←
        </button>
        <h2 style={{margin: 0}}>{t('settings.title')}</h2>
      </div>

      {/* Cloud Sync Section */}
      <div style={{
        background: 'var(--color-sage-light)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {!user ? (
          <div>
             <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '15px'}}>
                <div style={{
                    width: '40px', height: '40px', background: 'white', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                }}>☁️</div>
                <div>
                    <div style={{fontWeight: '600', fontSize: '16px', color: 'var(--color-sage-dark)'}}>{t('settings.cloud_sync')}</div>
                    <div style={{fontSize: '13px', color: 'var(--color-text-secondary)'}}>{t('settings.cloud_desc')}</div>
                </div>
            </div>
             
             {authError && <div style={{color: '#c62828', fontSize: '12px', marginBottom: '10px', background: '#ffcdd2', padding: '8px', borderRadius: '8px'}}>{authError}</div>}
             
             <form onSubmit={handleAuth} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
               <input 
                 type="email" 
                 name="email"
                 id="email"
                 aria-label={t('settings.email_placeholder')}
                 placeholder={t('settings.email_placeholder')} 
                 autoComplete="username"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 style={{
                    padding: '12px', borderRadius: '12px', border: '1px solid white', 
                    background: 'rgba(255,255,255,0.8)', fontSize: '14px', outline: 'none'
                 }}
                 required
               />
               <input 
                 type="password" 
                 name="password"
                 id="password"
                 aria-label={t('settings.password_placeholder')}
                 placeholder={t('settings.password_placeholder')} 
                 autoComplete="current-password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 style={{
                    padding: '12px', borderRadius: '12px', border: '1px solid white', 
                    background: 'rgba(255,255,255,0.8)', fontSize: '14px', outline: 'none'
                 }}
                 required
               />
               <div style={{display: 'flex', gap: '10px', marginTop: '5px'}}>
                 <button type="submit" style={{
                   flex: 1, 
                   padding: '12px', 
                   background: 'var(--color-sage-dark)', 
                   color: 'white', 
                   border: 'none', 
                   borderRadius: '12px',
                   cursor: 'pointer',
                   fontWeight: '600',
                   fontSize: '14px'
                 }}>
                   {authMode === 'login' ? t('settings.login_btn') : t('settings.signup_btn')}
                 </button>
               </div>
               <div style={{textAlign: 'center', marginTop: '5px'}}>
                 <span onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} style={{
                    color: 'var(--color-sage-dark)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline'
                 }}>
                   {authMode === 'login' ? t('settings.create_account') : t('settings.have_account')}
                 </span>
               </div>
             </form>
          </div>
        ) : (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{
                    width: '40px', height: '40px', background: 'white', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                }}>☁️</div>
                <div>
                    <div style={{fontWeight: '600', fontSize: '14px', color: 'var(--color-sage-dark)'}}>{t('settings.logged_in')}</div>
                    <div style={{fontSize: '12px', color: 'var(--color-text-secondary)'}}>{user.email}</div>
                </div>
             </div>
             <div style={{display: 'flex', gap: '8px'}}>
               <button 
                 onClick={handleSync}
                 disabled={isSyncing}
                 style={{
                   background: isSyncing ? '#a5d6a7' : 'var(--color-sage-dark)',
                   color: 'white',
                   border: 'none',
                   padding: '8px 16px',
                   borderRadius: '20px',
                   cursor: 'pointer',
                   fontWeight: '500',
                   fontSize: '13px',
                   display: 'flex', alignItems: 'center', gap: '5px',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                 }}
               >
                 {isSyncing ? '...' : <span>↻ {t('settings.sync_btn')}</span>}
               </button>
               <button 
                 onClick={() => signOut()}
                 style={{
                   background: 'white',
                   color: '#78909c',
                   border: '1px solid #cfd8dc',
                   padding: '8px 12px',
                   borderRadius: '20px',
                   cursor: 'pointer',
                   fontSize: '12px'
                 }}
                 title="Log Out"
               >
                 ➜
               </button>
             </div>
          </div>
        )}
      </div>

       {/* PWA Install */}
       {((deferredPrompt) || (isIos && !isStandalone)) && (
        <div 
            onClick={installPWA}
            style={{
                background: 'var(--color-sage-light)', 
                borderRadius: '16px', 
                padding: '16px', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)'
            }}
        >
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{
                    width: '40px', height: '40px', background: 'white', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
                }}>🌿</div>
                <div>
                    <div style={{fontWeight: '600', fontSize: '16px', color: 'var(--color-sage-dark)'}}>{t('pwa.install_title') || 'Install App'}</div>
                    <div style={{fontSize: '13px', color: 'var(--color-text-secondary)'}}>{t('pwa.install_desc') || 'Add to Home Screen'}</div>
                </div>
            </div>
            <div style={{
                background: 'var(--color-moss-dark)', 
                color: 'white',
                padding: '8px 16px', 
                borderRadius: '20px', 
                fontSize: '13px', 
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(94, 107, 92, 0.2)'
            }}>
                {isIos ? 'Show Guide' : 'Install'}
            </div>
        </div>
      )}

      {/* Danger Zone */}
      <div style={{marginTop: '40px'}}>
        <h3 style={{fontSize: '14px', color: '#c62828', marginBottom: '10px'}}>{t('settings.danger_zone')}</h3>
        <button 
          onClick={handleReset}
          style={{
            width: '100%',
            background: '#ffebee',
            border: '1px solid #ffcdd2',
            color: '#c62828',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {t('profile.reset_btn') || "Reset All Data"}
        </button>
      </div>

    </div>
  );
};

export default Settings;
