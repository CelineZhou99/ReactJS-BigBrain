import React, { createContext, useState } from 'react';

export const StoreContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default ({ children }) => {
  const [alertMsg, setAlertMsg] = useState('');
  const [alertState, setAlertState] = useState('none');
  const [successState, setSuccessState] = useState('none');

  const store = {
    alertMsg: [alertMsg, setAlertMsg],
    alertState: [alertState, setAlertState],
    successState: [successState, setSuccessState],
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
