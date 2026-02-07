import DraftBuilder from './pages/DraftBuilder';
import VocabularySwap from './pages/VocabularySwap';
import ApologyBuilder from './pages/ApologyBuilder';

export const module2Routes = [
  { path: '/module2/draft-builder', element: <DraftBuilder />, name: 'Draft Builder' },
  { path: '/module2/vocabulary-swap', element: <VocabularySwap />, name: 'Vocabulary Swap' },
  { path: '/module2/apology-builder', element: <ApologyBuilder />, name: 'Apology Builder' },
];
