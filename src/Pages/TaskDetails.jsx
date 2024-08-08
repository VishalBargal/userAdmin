import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import headerimg from "../assets/rptn1.png";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Styles/EmpListOfTask.css";

const TaskDetails = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showTable, setShowTable] = useState(false);

  const [editPopup, setEditPopup] = useState(false);
  const [editedHours, setEditedHours] = useState(9);
  const [editedReason, setEditedReason] = useState("");

  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [defaultHours, setDefaultHours] = useState(9);
  const [reasons, setReasons] = useState(Array.from({ length: 31 }, () => "-"));

  

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

 
  const getDayName = (date) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex];
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setShowTable(false);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setShowTable(false);
  };

  const handleShowTable = () => {
    setShowTable(true);
  };

  

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const displayMonth =
    selectedMonth !== "" ? parseInt(selectedMonth) : currentMonth;
  const displayYear =
    selectedYear !== "" ? parseInt(selectedYear) : currentYear;

  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    loadworksheet();
  }, [monthFilter, yearFilter]);

  const [worksheetInfo, setWorksheetInfo] = useState([]);
  const loadworksheet = async () => {
    const url = window.location.href;
    const urlParts = url.split("/");
    const userid = urlParts[urlParts.length - 1];
    if (!userid) {
      // Handle the case when the userid is not found in sessionStorage
      console.error("Userid not found in sessionStorage.");
      return;
    }

    try {
      // Step 2: Make the API call to the backend with the retrieved userid
      const result = await axios.get(
        `http://localhost:3005/admin/worksheet_info/${userid}`
      );

      // Assuming the response contains user data and you have a function setUsers to update the state.
      setWorksheetInfo(result.data);
      // console.log(result.data);
    } catch (error) {
      // Handle errors, if any
      console.error("Error fetching user data:", error);
    }
  };

  // Function to get the day name from a date string
  const getDayNamenew = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  };

  // const [editPopup, setEditPopup] = useState(false);
  const [editedTaskId, setEditedTaskId] = useState(null);
  // const [editedHours, setEditedHours] = useState('');
  // const [editedReason, setEditedReason] = useState('');
  const [hoursError, setHoursError] = useState("");

  const handleEditClick = (taskId, hours, reason) => {
    setEditedTaskId(taskId);
    setEditedHours(hours);
    setEditedReason(reason);
    setHoursError("");
    setEditPopup(true);
  };

  const handleSaveEdit = () => {
    // Validate editedHours format
    const hoursRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!editedHours.match(hoursRegex)) {
      setHoursError("Enter hours like HH:MM:SS");
      return;
    }

    // Send data to the backend through Axios POST request
    // Include the editedTaskId, editedHours, and editedReason
    axios
      .post("http://localhost:3005/admin/edit_task", {
        id: editedTaskId,
        editedHours: editedHours,
        editedReason: editedReason,
      })
      .then((response) => {
      toast.success("Updated successfully!");

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      })
      .catch((error) => {
        // Handle error
        console.error("Edit failed", error);
        // Additional error handling if needed
      });

    // Close the edit popup after submitting the form
    setEditPopup(false);
  };

  const handleCancelEdit = () => {
    // Close the edit popup without saving changes
    setEditPopup(false);
  };

  const months = [
    "-- Select Month --",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Array of years from 2020 to 2030
  const years = [
    "-- Select Year --",
    ...Array.from({ length: 11 }, (_, index) => 2020 + index),
  ];
  // Function to handle month selection
  const handleMonthSelection = (selectedMonth) => {
    setMonthFilter(selectedMonth);
  };

  // Function to handle year selection
  const handleYearSelection = (selectedYear) => {
    setYearFilter(selectedYear);
  };

  // Function to calculate the total hours from worksheetInfo
  const calculateTotalHours = (worksheetInfo) => {
    const totalSeconds = worksheetInfo.reduce((sum, value) => {
      return (
        sum + (value.today_hours ? convertToSeconds(value.today_hours) : 0)
      );
    }, 0);

    return formatSecondsToHHMMSS(totalSeconds);
  };

  // Function to convert HH:MM:SS time format to seconds
  const convertToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Function to format seconds to HH:MM:SS time format
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
            <p>
                <small>developed by</small>
              </p>
              <p className="developedby">
                <b>bargalvishal@gmail.com</b>
              </p>
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
          <div className="naviCrumbles">
            <div className="naviDiv" style={{ width: "50%" }}>
              <NavLink to="/">All Users</NavLink>/
              <span style={{ fontSize: "20px" }}>User Details</span>
            </div>

            {/* <div
              className="sortByDate"
              style={{ display: "flex", gap: "10px" }}
            >
              <label className="monthFilters">
                Select Month:
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="selectTagsSort text-center"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index === 0 ? "" : index}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>

              <label className="yearFilter">
                Select Year:
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="selectTagsSort"
                >
                  {years.map((year, index) => (
                    <option key={index} value={index === 0 ? "" : year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div> */}
          </div>

          {worksheetInfo.map((value, index) => (
                      <>
                       <div className="profile-div">
                         <div>
                  <img
                    className="profimg"
                    src={`http://localhost:3005/uploads/${value.profile_image}`}
                  ></img>
               
                </div>
                <div className="pro-info">
                  <div className="info-right">
                    <h2>Name :</h2>
                    <br />
                    <h2>E-mail :</h2>
                    <br />
                    <h2>Mobile :</h2>
                    <br />
                    <h2>Address :</h2>
                  </div>
                  <div className="info-left">
                    <h2>
                      {" "}
                      <small> {value.name}</small>
                    </h2>
                    <br />
                    <h2>
                      <small>{value.email}</small>
                    </h2>
                    <br />
                    <h2>
                      <small> {value.mobile} </small>
                    </h2>
                    <br />
                    <h2>
                      <small>{value.address}</small>
                    </h2>
                  </div>
                </div>
                </div>
                   
                      </>
                    ))}
          
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

export default TaskDetails;
