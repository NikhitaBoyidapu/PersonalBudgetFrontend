import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../Menu/Menu';
import HomePage from '../HomePage/HomePage';
import Footer from '../Footer/Footer';
const StartPage = () => {
  return (
    <div className='startup'>
      {/* <header>
        <img src="logo.png" alt="Logo" />
        <p>PB App</p>
      </header> */}

      <section className="side-by-side-sections">
        <div className="left-section">
          <h1 data-testid="cypress-title">Personal Budget App</h1>
          <p>A personal-budget management app</p>
          <div className="button-container">
            {/* Use the Link component to navigate to the login page */}
           <Menu/>
          </div>
        </div>
        <div className="right-section">
          <img src="sidepic.png" alt="Logo" />
        </div>
      </section>
      <HomePage/>
      {/* <Footer/> */}
    </div>
  );
}

export default StartPage;
