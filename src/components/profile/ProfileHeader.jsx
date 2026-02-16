import React from 'react';
import styles from '../../pages/Profile.module.css';

const ProfileHeader = ({ 
  userProfile, 
  userStats, 
  isEditing, 
  setIsEditing, 
  editForm, 
  setEditForm, 
  onSave, 
  t,
  onNavigateSettings
}) => {
  return (
    <>
      <button 
          onClick={onNavigateSettings}
          className={styles.settingsButton}
          title="Settings"
          aria-label="Open settings"
      >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"> 
            <path fillRule="evenodd" clipRule="evenodd" d="M5.07699 14.3816L3.59497 13.9054C3.24043 13.7915 3 13.4617 3 13.0894V10.9106C3 10.5383 3.24043 10.2085 3.59497 10.0946L5.07699 9.61845C5.52769 9.47366 5.77568 8.99091 5.63089 8.54021C5.60187 8.44991 5.55808 8.36505 5.50127 8.28908L4.86839 7.44272C4.61323 7.10148 4.64746 6.62461 4.94875 6.32332L6.32332 4.94875C6.62461 4.64746 7.10148 4.61323 7.44272 4.86839L8.28908 5.50127C8.6682 5.78476 9.20535 5.70724 9.48884 5.32812C9.54564 5.25216 9.58944 5.1673 9.61845 5.07699L10.0946 3.59497C10.2085 3.24043 10.5383 3 10.9106 3L13.0894 3C13.4617 3 13.7915 3.24043 13.9054 3.59497L14.3816 5.07699C14.5263 5.52769 15.0091 5.77568 15.4598 5.63089C15.5501 5.60187 15.635 5.55808 15.7109 5.50127L16.5573 4.86839C16.8985 4.61323 17.3754 4.64746 17.6767 4.94875L19.0512 6.32332C19.3525 6.62461 19.3868 7.10148 19.1316 7.44272L18.4987 8.28908C18.2152 8.6682 18.2928 9.20535 18.6719 9.48884C18.7478 9.54564 18.8327 9.58944 18.923 9.61845L20.405 10.0946C20.7596 10.2085 21 10.5383 21 10.9106V13.0894C21 13.4617 20.7596 13.7915 20.405 13.9054L18.923 14.3816C18.4723 14.5263 18.2243 15.0091 18.3691 15.4598C18.3981 15.5501 18.4419 15.635 18.4987 15.7109L19.1316 16.5573C19.3868 16.8985 19.3525 17.3754 19.0512 17.6767L17.6767 19.0512C17.3754 19.3525 16.8985 19.3868 16.5573 19.1316L15.7109 18.4987C15.3318 18.2152 14.7947 18.2928 14.5112 18.6719C14.4544 18.7478 14.4106 18.8327 14.3816 18.923L13.9054 20.405C13.7915 20.7596 13.4617 21 13.0894 21H10.9106C10.5383 21 10.2085 20.7596 10.0946 20.405L9.61845 18.923C9.47366 18.4723 8.99091 18.2243 8.54021 18.3691C8.44991 18.3981 8.36505 18.4419 8.28908 18.4987L7.44272 19.1316C7.10148 19.3868 6.62461 19.3525 6.32332 19.0512L4.94875 17.6767C4.64746 17.3754 4.61323 16.8985 4.86839 16.5573L5.50127 15.7109C5.78476 15.3318 5.70724 14.7947 5.32812 14.5112C5.25216 14.4544 5.1673 14.4106 5.07699 14.3816Z" stroke="var(--color-sage-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
            <path fillRule="evenodd" clipRule="evenodd" d="M14.1213 9.87868C12.9497 8.70711 11.0503 8.70711 9.87868 9.87868C8.70711 11.0503 8.70711 12.9497 9.87868 14.1213C11.0503 15.2929 12.9497 15.2929 14.1213 14.1213C15.2929 12.9497 15.2929 11.0503 14.1213 9.87868Z" stroke="var(--color-sage-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
          </svg>
      </button>

      {isEditing ? (
        <div className={styles.editForm}>
           <div className={styles.formGroup}>
             <label className={styles.label}>{t('profile.avatar')}</label>
             <input 
               type="text" 
               value={editForm.avatar} 
               onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
               className={styles.inputAvatar}
             />
           </div>
           <div className={styles.formGroup}>
             <label className={styles.label}>{t('profile.name')}</label>
             <input 
               type="text" 
               value={editForm.name} 
               onChange={(e) => setEditForm({...editForm, name: e.target.value})}
               className={styles.inputText}
             />
           </div>
           <div className={styles.formGroup}>
             <label className={styles.label}>{t('profile.age')}</label>
             <input 
               type="number" 
               value={editForm.age} 
               onChange={(e) => setEditForm({...editForm, age: e.target.value})}
               className={styles.inputText}
             />
           </div>
           <button className="primary-btn" onClick={onSave}>{t('profile.save')}</button>
        </div>
      ) : (
        <>
           <div onClick={() => setIsEditing(true)} className={styles.avatar} role="button" tabIndex={0} aria-label="Click to edit profile">
             {userProfile.avatar}
           </div>
           <h3 className={styles.name}>{userProfile.name} <span onClick={() => setIsEditing(true)} className={styles.editIcon} role="button" tabIndex={0} aria-label="Edit profile">✏️</span></h3>
           <div className={styles.metaInfo}>
              {userProfile.age ? `${userProfile.age} y/o` : ''} • Lv. {userStats.level} • {userStats.xp} XP
           </div>
        </>
      )}
    </>
  );
};

export default ProfileHeader;
