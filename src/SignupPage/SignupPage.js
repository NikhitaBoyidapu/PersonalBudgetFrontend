import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupTimer, setPopupTimer] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
  
    axios.post('https://seashell-app-pjx64.ondigitalocean.app/api/signup', { email, password, username, name })
      .then(res => {
        if (res && res.data && res.data.success) {
          setPopupOpen(true);
  
          // Close the popup after a certain duration (e.g., 3 seconds)
          const timer = setTimeout(() => {
            setPopupOpen(false);
            
            // Navigate to login page after closing the popup
            navigate('/login');
          }, 3000);
  
          // Save the timer in state to clear it if needed
          setPopupTimer(timer);
        }
      })
      .catch(err => console.error(err));
  }
  

  // Clear the popup timer when the component is unmounted
  useEffect(() => {
    return () => {
      if (popupTimer) {
        clearTimeout(popupTimer);
      }
    };
  }, [popupTimer]);

  function handleBackToRoot() {
    navigate('/'); // Update the route to your dashboard route
  }

  return (
    <div className="login">
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <button className="back" onClick={handleBackToRoot}>
        <i className='bx bxs-left-arrow-alt' ></i>
        Back to HomePage
      </button>
      <section>
        <form onSubmit={handleSubmit} >
          <h1>Signup</h1>
          <div className="input-box">
            <input type="text" placeholder='Name' value={name} onChange={e => setName(e.target.value)} required />&nbsp;
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="text" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />&nbsp;
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />&nbsp;
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />&nbsp;
            <i className='bx bxs-lock-alt'></i>
          </div>
          <button id="login" type="submit" className="btn">Signup</button>
          <div className="createacc">
            Already have an account?&nbsp;
            <Link itemProp="url" to="/login">Login Here</Link>
          </div>
        </form>
      </section>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <p>Account has been created successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;
