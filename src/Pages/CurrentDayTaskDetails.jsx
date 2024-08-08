import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import NavBar from "./NavBar";
import { NavLink, Link } from "react-router-dom";
import "./Styles/currentDayTask.css";
import { Icon } from "@iconify/react";
import headerimg from "../assets/rptn1.png";


const CurrentDayTaskDetails = () => {
  const userEmail = "admin@gmail.com";

  useEffect(() => {
    loadworksheet();
  }, []);

  const [worksheetInfo, setWorksheetInfo] = useState([]);

  const loadworksheet = async () => {
    try {
      // Extract user_id and tdate from the URL parameters
      const user_id = new URLSearchParams(window.location.search).get("id");
      const tdate = new URLSearchParams(window.location.search).get(
        "task_date"
      );

      // Check if user_id and tdate are available
      if (!user_id || !tdate) {
        console.error("User_id or tdate not found in URL parameters.");
        return;
      }

      // Make the API call to the backend with user_id and tdate as parameters
      const result = await axios.get(
        `http://localhost:3005/admin/all_tasks_info/${user_id}/${tdate}`
      );

      // Check if result is empty
      if (result.data.length === 0) {
        // console.log("No records found.");
        // Handle the case when no records are found
        // For example, you can set an empty array to clear existing data
        setWorksheetInfo([]);
      } else {
        // Assuming the response contains worksheet data and you have a function setWorksheetInfo to update the state.
        setWorksheetInfo(result.data);
        // console.log(result.data);
      }
    } catch (error) {
      // Handle errors, if any
      console.error("Error fetching worksheet data:", error);
    }
  };

  const calculateTotalHours = (worksheetInfo) => {
    const totalSeconds = worksheetInfo.reduce((sum, value) => {
      return sum + (value.total_time ? convertToSeconds(value.total_time) : 0);
    }, 0);

    return formatSecondsToHHMMSS(totalSeconds);
  };

  const convertToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatSecondsToHHMMSS = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const truncateText = (text, maxLength) => {
    return text
      ? text.split(" ").slice(0, maxLength).join(" ") +
          (text.split(" ").length > maxLength ? " ..." : "")
      : "-";
  };


  
  // const handleEditClick = async (id, task_status ) => {
  //   const confirmDelete = window.confirm('Are you sure you want to delete this task ?');

  //   if (confirmDelete) {
  //     try {
  //       const response = await axios.post('http://localhost:3005/admin/delete_task', {
  //         id
  //       });

  //       if (response.status === 200) {
  //         // Item deleted successfully, you can update your UI as needed
  //         toast.success("Task deleted successfully!");


  //         // Reload the page after a short delay (e.g., 500 milliseconds)
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 4000);
  //       } else {
  //         // Handle other status codes or errors
  //         console.error('Error deleting item:', response.data.error);
  //       }
  //     } catch (error) {
  //       console.error('An unexpected error occurred:', error.message);
  //     }
  //   }
  // };
  
   
  const handleEditClick = async (id, task_status) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task ?');
  
    if (confirmDelete) {
      // Check if the task is complete (you might have a status property in your data)
      const isComplete = task_status === 'Complete'; // Modify this based on your data
  
      if (isComplete) {
        toast.error("Can't delete completed tasks.");
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:3005/admin/delete_task', {
          id
        });
  
        if (response.status === 200) {
          // Item deleted successfully, you can update your UI as needed
          toast.success("Task deleted successfully!");
  
          // Reload the page after a short delay (e.g., 500 milliseconds)
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } else {
          // Handle other status codes or errors
          console.error('Error deleting item:', response.data.error);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error.message);
      }
    }
  };
 
 


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

  const handleSaveEdits = () => {
         // Email validation
  const emailPattern = /@rptechnovelty\.com$/;
  if (!emailPattern.test(email)) {
    toast.error("Please enter a valid @rptechnovelty.com email address.");
    return;
  }
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

  const handleCancelEdits = () => {
    // Close the edit popup without saving changes
    setEditPopupupdate(false);
  };
 
  return (
    <>
      <ToastContainer />

      <div className="task-main-div">
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
        <div className="mainInnerDiv">
          <div className="naviDiv" style={{ marginTop: "15px" }}>
            <NavLink to="/">All Employees/</NavLink>
            <a href="/">Task Details</a> /
            <span style={{ fontSize: "20px" }}>All tasks</span>
          </div>
          <table className="responsive" style={{ marginTop: "3%" }}>
            <thead>
              <tr>
                <th scope="col" style={{ borderTopLeftRadius: "15px" }}>
                  Sr.No
                </th>
                <th scope="col">Task Details</th>
                <th scope="col">Start Time </th>
                <th scope="col">End Time </th>

                <th scope="col">
                  Time Difference
                </th>
                <th scope="col">
                  Expected Time
                </th>
                <th scope="col" >
                  Assign By
                </th>
                <th scope="col" style={{ borderTopRightRadius: "15px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {worksheetInfo.map((value, index) => (
                <>
                  <tr>
                    <td data-table-header="Sr.No">
                   
                    {value.task_status === "Running" ? (
                        <span
                          style={{
                            color: "green",
                            marginLeft: "5px",
                            fontSize: "1.5em",
                            float:"left"
                          }}
                        >
                          ●
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "red",
                            marginLeft: "5px",
                            fontSize: "1.5em",
                            float:"left"
                          }}
                        ></span>
                      )}
                      {index + 1}
                  
                    </td>
                    <td data-table-header="Task">
                      {truncateText(value.task_details, 5)}
                    </td>
                    <td data-table-header="Start">
                      {value.start_time ? (
                        value.start_time
                      ) : (
                        <span style={{ color: "red" }}>waiting ...</span>
                      )}
                    </td>
                    <td data-table-header="End">
                      {value.stop_time ? (
                        value.stop_time
                      ) : (
                        <span style={{ color: "red" }}>waiting ...</span>
                      )}
                    </td>
                    <td data-table-header="Time">
                      {value.total_time ? (
                        value.total_time
                      ) : (
                        <span style={{ color: "red" }}>waiting ...</span>
                      )}
                    </td>
                    <td data-table-header="Time">
                      {value.expected_hr ? (
                        value.expected_hr
                      ) : (
                        <span style={{ color: "red" }}>waiting ...</span>
                      )}
                    </td>
                    <td>{value.assignBy}</td>
                    <td>
                 
                        <button
                         className="saveCancelBtn"
                         onClick={() =>handleEditClick(value.id , value.task_status)}>
                          delete
                        </button>
                      {/* )} */}
                   
                    </td>
                  </tr>
                </>
              ))}
              {/* Additional row for displaying the sum */}
              <tr style={{ backgroundColor: "blue", color: "white" }}>
                <td colSpan="4">Total working hours:</td>

                <td>{calculateTotalHours(worksheetInfo)}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
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
              <button onClick={handleSaveEdits} className="saveCancelBtn">
                Save
              </button>
              <button onClick={handleCancelEdits} className="saveCancelBtn">
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CurrentDayTaskDetails;
