import AngerDecoder from './pages/AngerDecoder';
import DeepListeningLab from './pages/DeepListeningLab';
import PerspectiveSwitcher from './pages/PerspectiveSwitcher';

export const module3Routes = [
  { path: '/module3/anger-decoder', element: <AngerDecoder />, name: 'Anger Decoder' },
  { path: '/module3/deep-listening', element: <DeepListeningLab />, name: 'Deep Listening Lab' },
  { path: '/module3/perspective-switcher', element: <PerspectiveSwitcher />, name: 'Perspective Switcher' }
];
