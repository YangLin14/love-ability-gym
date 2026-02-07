import AttributionShift from './pages/AttributionShift';
import EmotionScan from './pages/EmotionScan';
import StoryBuster from './pages/StoryBuster';
import TimeTravel from './pages/TimeTravel';
import HappinessScale from './pages/HappinessScale';
import RapidAwareness from './pages/RapidAwareness';

export const module1Routes = [
  { path: '/module1/attribution', element: <AttributionShift />, name: 'Attribution Shift' },
  { path: '/module1/emotion-scan', element: <EmotionScan />, name: 'Emotion Scan' },
  { path: '/module1/story-buster', element: <StoryBuster />, name: 'Story Buster' },
  { path: '/module1/time-travel', element: <TimeTravel />, name: 'Time Travel' },
  { path: '/module1/happiness-scale', element: <HappinessScale />, name: 'Happiness Scale' },
  { path: '/module1/rapid-awareness', element: <RapidAwareness />, name: 'Rapid Awareness' }
];
