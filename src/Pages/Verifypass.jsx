

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Styles/register.css";

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

const Verifypass = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();

  const [user, setUser] = useState({
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(true);

  
  const [otpCountdown, setOtpCountdown] = useState(60);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

const handleClick = async (e) => {
  e.preventDefault();

  const { password, confirmPassword } = user;

  try {
    // Validate password strength
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      throw new Error("Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character, and be at least 8 characters long.");
    }

    if (!password || !confirmPassword) {
      throw new Error("Please fill in all required fields.");
    }

    if (password !== confirmPassword) {
      throw new Error("Password and Confirm Password do not match.");
    }

    // Send a request to the backend to initiate OTP generation and registration
    const response = await fetch(`http://localhost:3005/admin/resetpassword/${id}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // Show success message and open OTP popup
      toast.success(`Your password has been updated successfully.`);
      setTimeout(() => {
        // Redirect to the login page after the delay
        window.location.assign("/login");
      }, 5000);
    } else {
      // Display error message for failed registration
      throw new Error(data.error || "Failed to reset password");
    }
  } catch (error) {
    // Handle errors
    toast.error(error.message);
  }
};
  
  


  return (
    <>
    
   
        {showRegistrationPopup && (
         <>
          <div className="register_container">
      <div className="register_box">
        <div className="register_left">
          <h2>Register</h2>
          <form method="POST" className="form_here">
           
            <Input
              type="password"
              val="Password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
            />
            <Input
              type="password"
              val="Confirm Password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
            />

            <button onClick={handleClick} className="sub-button">
              Submit
            </button>
          </form>

          {/* <div className="alreadyAcc">
            <p className="P_already">Already have Account?</p>
            <NavLink to="/login" className="login_Address">
              Login
            </NavLink>
          </div> */}
        </div>

        <ToastContainer />

        </div>
    </div>
         </>
        )}



      
      
     

    </>
  );
};

export default Verifypass;