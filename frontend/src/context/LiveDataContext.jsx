// File: src/context/LiveDataContext.jsx
// Mounted once in App.jsx, wrapping everything. Any component anywhere in
// the tree reads the same live values via useLiveData() — nobody else calls
// useLiveAnalytics() directly, so there's only ever one live connection.
import React, { createContext, useContext } from 'react';
import { useLiveAnalytics } from '../hooks/useLiveAnalytics';

const LiveDataContext = createContext(null);

export function LiveDataProvider({ children }) {
  const liveData = useLiveAnalytics({ historyLength: 20 });
  return <LiveDataContext.Provider value={liveData}>{children}</LiveDataContext.Provider>;
}

export function useLiveData() {
  const ctx = useContext(LiveDataContext);
  if (!ctx) {
    throw new Error('useLiveData() must be called within a <LiveDataProvider>.');
  }
  return ctx;
}
