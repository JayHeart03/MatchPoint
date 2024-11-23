import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
    BrowserRouter,
  } from "react-router-dom";
import ControlButton from './components/controlButton';
import { SpeechProvider } from '../src/components/SpeechContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
    <SpeechProvider>
      <App />
    </SpeechProvider>
  </BrowserRouter>,
);

