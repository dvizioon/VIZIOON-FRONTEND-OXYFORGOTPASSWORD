import React from 'react';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

const App: React.FC = () => {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;