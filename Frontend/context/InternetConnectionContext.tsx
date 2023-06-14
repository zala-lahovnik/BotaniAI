import React, { createContext } from 'react';

const InternetConnectionContext = createContext<{
  isConnected: boolean;
}>({
  isConnected: false,
});
export { InternetConnectionContext };
