import React from 'react';
import { AppContextProvider } from './contexts/AppContextProvider';
import { TrainingContextProvider } from './contexts/TrainingContextProvider';
import { AppController } from './components/AppController';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  // IN MVC:
  // AppController IS THE CONTROLLER 
  // JSX Components ARE VIEWS
  // Contexts describe the MODEL

  return (
    <>
      < AppContextProvider >
        < TrainingContextProvider >
          < AppController />
        </TrainingContextProvider>
      </ AppContextProvider >
      < ToastContainer />
    </>
  )
}