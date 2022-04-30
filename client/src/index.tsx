import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import WrappedApolloProvider from './WrappedApolloProvider';
import Container from '@mui/material/Container';

const rootElement = document.getElementById('root');

render(
  <BrowserRouter>
    <React.StrictMode>
      <Box sx={{ backgroundColor: 'rgb(240, 240, 240)', minHeight: '100vh' }}>
        <CssBaseline />
        <WrappedApolloProvider>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <Container>
              <App />
            </Container>
          </LocalizationProvider>
        </WrappedApolloProvider>
      </Box>
    </React.StrictMode>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
