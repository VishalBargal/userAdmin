// NavBar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import headerimg from '../assets/rptn1.png';

const NavBar = ({ userEmail }) => {
  return (
    <div className="main-nav">
      <div className="innerNavDiv">
        <div className="logo-div">
          <img src={headerimg} alt="logos" className="logoImg" />
        </div>
        <div className="user-logout-btn">
          <p>{userEmail}</p>
          <div className="log-btn">
            <NavLink to="/logout">
              <button className="button logoutBtn" style={{ marginTop: 0, width: '104px' }}>
                Logout
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
