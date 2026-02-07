import React from 'react';
import SpotlightJournal from './pages/SpotlightJournal';
import TimeCapsule from './pages/TimeCapsule';
import VisionBoard from './pages/VisionBoard';

export const module5Routes = [
  { path: '/module5/spotlight-journal', element: <SpotlightJournal />, name: 'Spotlight Journal' },
  { path: '/module5/time-capsule', element: <TimeCapsule />, name: 'Time Capsule' },
  { path: '/module5/vision-board', element: <VisionBoard />, name: 'Vision Board' }
];
