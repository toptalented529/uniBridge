import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Bridge from 'views/Bridge';
import Headers from "components/Header"
import { store } from '../app/store.js'
import { Provider } from 'react-redux'

const BridgePage = () => {
  return (
    <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <Headers />
      <Bridge />
    </LocalizationProvider>
    </Provider>
    );
};

export default BridgePage;
