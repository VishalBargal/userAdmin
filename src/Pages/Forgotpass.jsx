

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/forgotpass.css";

const Input = ({ val, placeholder, type, name, value, onChange }) => {
  return (
    <div className="form__group2 field">
      <input
        type={type}
        className="form__field"
        placeholder={placeholder}
        required
        name={name}
        value={value}
        onChange={onChange}
      />
      <label htmlFor={name} className="form__label">
        {val}
      </label>
    </div>
  );
};

const Forgotpass = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
  });

 
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(true);

  

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

const handleClick = async (e) => {
  e.preventDefault();

  const { email } = user;

  // const emailPattern = /@rptechnovelty\.com$/;
  // if (!emailPattern.test(email)) {
  //   toast.error("Please enter a valid @rptechnovelty.com email address.");
  //   return;
  // }

  try {
    if (!email) {
      throw new Error("Please fill in all required fields.");
    }

    const response = await fetch("http://localhost:3005/admin/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      toast.success(`The forgot password link is sent to your email. Please check the email.`);
      // window.location.assign("/login");

      setTimeout(() => {
        // Redirect to the login page after the delay
        window.location.assign("/login");
      }, 5000);
    } else {
      throw new Error(data.error || "Failed to initiate password reset.");
    }
  } catch (error) {
    toast.error(error.message || "An error occurred while processing your request.");
  }
};
  

  return (
    <>
    
   
        {showRegistrationPopup && (
         <>
          <div className="register_container">
      <div className="register_box">
        <div className="register_left">
          <h2>Forgot Password</h2>
          <form method="POST" className="form_here">
          
            <Input
              type="email"
              val="Email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
            <button onClick={handleClick} className="sub-button">
              Submit
            </button>
          </form>

          <div className="alreadyAcc">
            <p className="P_already">Already have Account?</p>
            <NavLink to="/login" className="login_Address">
              Login
            </NavLink>
          </div>
        </div>

        <ToastContainer />

        </div>
    </div>
         </>
        )}

     

    </>
  );
};

export default Forgotpass;