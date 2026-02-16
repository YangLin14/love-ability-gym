import React from 'react';
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </BrowserRouter>
  );
};

/**
 * Custom render that wraps with all providers and waits for
 * async provider initialization (AuthProvider, StorageService.init, etc.)
 */
const customRender = async (ui, options) => {
  let result;
  await act(async () => {
    result = render(ui, { wrapper: AllTheProviders, ...options });
  });
  return result;
};

export * from '@testing-library/react';
export { customRender as render };
