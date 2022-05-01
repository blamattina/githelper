import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Application from './Application';
import reportWebVitals from './reportWebVitals';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const rootElement = document.getElementById('root');

render(
  <BrowserRouter>
    <React.StrictMode>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Application />
      </LocalizationProvider>
    </React.StrictMode>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
