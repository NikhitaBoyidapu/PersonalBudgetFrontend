import React from 'react';
import {
   Link
} from "react-router-dom";


function Menu() {
  return (
    <nav role="navigation" aria-label="Navigation Tab">
        <Link itemProp="url" to="/login">
          <button className='menu-btn'>Login</button>
        </Link>
        <Link itemProp="url" to="/signup">
          <button className='menu-btn'>Signup</button>
        </Link>
</nav>


  );
}

export default Menu;
