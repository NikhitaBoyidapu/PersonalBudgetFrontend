import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setAuthenticated } ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  function decodingJWT(token) {
    try {
        const base64payload = (token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64payload).split('').map(function(c) {
             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return {};
        }
    }
  function handleSubmit(event) {
    event.preventDefault();
    axios.post('https://seashell-app-pjx64.ondigitalocean.app/api/login', { email, password })
      .then(res => {
        console.log(res.data);
        console.log( res.data.success)
        if (res && res.data && res.data.success) {
          const token = res.data.token;
          const username = res.data.username;
          localStorage.setItem('jwt', token);
          localStorage.setItem('username', username);          
          setAuthenticated(true);
          navigate('/dashboard');
        }
      })
      .catch(err => console.error(err));
  }
  function handleBackToRoot() {
    navigate('/'); // Update the route to your dashboard route
  }
  return (
  <div className='login'>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <button className="back" onClick={handleBackToRoot}>
        <i className='bx bxs-left-arrow-alt' ></i>
        Back to HomePage
      </button>
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder='Email' onChange={e => setEmail(e.target.value)} required />&nbsp;
            <i className='bx bxs-envelope'></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} required />&nbsp;
            <i className='bx bxs-lock-alt'></i>
          </div>
         <button id="login" type="submit" className="btn">Login</button>

          <div className="createacc">
            Don't have an account?&nbsp;
            <Link itemProp="url" to="/signup">Register Here</Link>
          </div>
        </form>
      </section>
      
    </div>
    
  );
}

export default LoginPage;
