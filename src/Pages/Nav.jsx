import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Styles/EmpListOfTask.css";
import headerimg from "../assets/rptn1.png";


export default function Nav() {
    const [employeeNames, setEmployeeNames] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // Step 1: Retrieve userid from sessionStorage
      const userid = sessionStorage.getItem("userid");

      if (!userid) {
        // Handle the case when the userid is not found in sessionStorage
        console.error("Userid not found in sessionStorage.");
        return;
      }

      // Step 2: Make the API call to the backend with the retrieved userid
      const result = await axios.get(
        `http://localhost:3005/admin/empinfo/${userid}`
      );

      // Step 3: Set the employeeNames state with the retrieved value
      setEmployeeNames(result.data);
      // console.log(result.data);
    } catch (error) {
      // Step 4: Handle errors, if any
      console.error("Error fetching user data:", error);
    }
  };

  const [editPopupupdate, setEditPopupupdate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userid, setUserid] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleEditClickupdate = (id, name, email, profile_image) => {
    setUserid(id);
    setEmail(email);
    setName(name);
    setProfileImageFile(profile_image);
    setEditPopupupdate(true);
  };

  const handleFile1Change = (event) => {
    const file = event.target.files[0];
    setProfileImageFile(file);
  };

  const handleSaveEdit = () => {
    // Create a FormData object to handle file uploads
    const formData = new FormData();

    // Append other data to the form data
    formData.append("userid", userid);
    formData.append("name", name);
    formData.append("email", email);

    // Check if a new profile image was selected
    if (profileImageFile) {
      formData.append("profile_image", profileImageFile);
    }

    // Send data to the backend through Axios POST request
    axios
      .post("http://localhost:3005/admin/edit_profile", formData)
      .then((response) => {
        // Handle success
        window.location.reload();
      })
      .catch((error) => {
        // Handle error
        console.error("Edit failed", error);
      });

    // Close the edit popup after submitting the form
    setEditPopupupdate(false);
  };

  const handleCancelEdit = () => {
    // Close the edit popup without saving changes
    setEditPopupupdate(false);
  };

  return (
  <>
  
  <div className="main-nav">
          <div className="innerNavDiv">
            <div className="logo-div">
              <img src={headerimg} alt="logos" className="logoImg" />
            </div>
            <div className="user-logout-btn">
              {employeeNames.map((value, index) => (
                <>
                  <div style={{}}>
                    <img
                      alt=""
                      src={`http://localhost:3005/uploads/${value.profile_image}`}
                      className=""
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                    <Icon
                      icon="material-symbols:edit-outline"
                      onClick={() =>
                        handleEditClickupdate(
                          value.id,
                          value.name,
                          value.email,
                          value.profile_image
                        )
                      }
                      style={{ cursor: "pointer",float:"right", marginTop:"-10px"}}
                      className="editIcon myedit"
                    />
                  </div>
                  <div style={{}}>
                    <p className="text-white">
                      Name : {value.name} <br /> E-mail : {value.email}
                    </p>
                  </div>
                </>
              ))}
              <div className="log-btn">
                <NavLink to="/logout">
                  <button
                    className="button logoutBtn"
                    style={{ marginTop: 0, width: "104px" }}
                  >
                    Logout
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {editPopupupdate && (
        <>
          <div className="overlay"></div>
          <div className="edit-popup">
            <div className="hoursEditDiv">
              <label className="EditPoplabel">Name :</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="hoursInpEdit"
              />
            </div>
            <div className="hoursEditDiv">
              <label className="EditPoplabel">email :</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hoursInpEdit"
              />
            </div>

            <div className="hoursEditDiv">
              <label className="EditPoplabel">Profile Image :</label>
              {profileImageFile && (
                <img
                  alt=""
                  src={`http://localhost:3005/uploads/${profileImageFile}`}
                  className=""
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/jpeg"
                onChange={handleFile1Change}
                className="hoursInpEdit"
              />
            </div>

            <div className="actionpopButtons">
              <button onClick={handleSaveEdit} className="saveCancelBtn">
                Save
              </button>
              <button onClick={handleCancelEdit} className="saveCancelBtn">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
  </>
  )
}
