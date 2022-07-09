import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Connect from 'Connect';

export const worker = new SharedWorker('/sh-worker.js');

worker.port.start();

navigator.serviceWorker.register('/service-worker.js').then(
  (registration) => {
    if (registration.installing) {
      registration.installing.postMessage(
        'SW has been installed!',
      );
    }
  },
  (err) => {
    console.error('Installing the worker failed!', err);
  },
);

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Connect />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root'),
);
