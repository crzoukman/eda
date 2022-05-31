import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Connect from 'Connect';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Connect />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root'),
);
