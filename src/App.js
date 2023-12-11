// Proj.js
import React, { useEffect } from 'react';
import './App.scss';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Dashboard from './Dashboard/Dashboard';
import LoginPage from './LoginPage/LoginPage';
import StartPage from './StartPage/StartPage';
import SignupPage from './SignupPage/SignupPage';
import NewCategory from './NewCategory/NewCategory';
import DeleteCategory from './DeleteCategory/DeleteCategory';
import { AuthProvider, useAuth } from './AuthProvider';

// PrivateRoute component
const PrivateRoute = ({ element, ...rest }) => {
  const { authenticated } = useAuth();
  if (authenticated === null) {
    // Wait until the authenticated state is initialized
    return null;
  }

  if (authenticated) {
    return element;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const { authenticated, setAuthenticated } = useAuth();

  useEffect(() => {
    // Log the authentication state when the component mounts
   
  }, [authenticated]);

  return (
    <Router>
      <div className="mainContainer">
        <Header />
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage  setAuthenticated={setAuthenticated} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/newcategory" element={<PrivateRoute element={<NewCategory />} />} />
          <Route path="/deletecategory" element={<PrivateRoute element={<DeleteCategory />} />} /> 
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

