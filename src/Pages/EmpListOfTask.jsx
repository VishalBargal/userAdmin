import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { NavLink, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Styles/EmpListOfTask.css";
import headerimg from "../assets/rptn1.png";

const EmpListOfTask = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editPopup, setEditPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Initialize formData state
  const [formData, setFormData] = useState({
    taskDetails: "",
    date: "",
    expectedHr: "",
  });

  const tableData = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: 4, name: "Alice Williams", email: "alice.williams@example.com" },
    // Add more data as needed
  ];

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) => {
      if (typeof value === "string" || value instanceof String) {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const toggleEditPopup = (userId) => {
    setEditPopup(!editPopup);
    setSelectedUserId(userId);
  };

  const [user, setUser] = useState([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    loaduser();
  }, [nameFilter]);

  useEffect(() => {
    loaduser();
  });

  const loaduser = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const result = await axios.get(
        `http://localhost:3005/admin/allemployee?nameFilter=${nameFilter}&currentDate=${currentDate}`
      );
      setUser(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the changed input is the date input
    if (name === "date") {
      // Parse the selected date and current date for comparison
      const selectedDate = new Date(value);
      const currentDate = new Date();
  
      // Check if the selected date is less than the current date (excluding today)
      if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
        // Show a toast message and prevent updating the state
        toast.error("Date cannot be less than the current date.");
        return;
      }
    }
  
    // Update the form data when input values change
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  

  const handleFormSubmit = async () => {
    try {
      // Validate form data as needed

      // Modify the API endpoint as needed
      await axios.post(
        `http://localhost:3005/admin/addTask/${selectedUserId}`,
        formData
      );
      toast.success("Task added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setEditPopup(false);
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Error adding task. Please try again.");
    }
  };


  const handleEditClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.post(
          "http://localhost:3005/admin/delete_user",
          {
            id,
          }
        );

        if (response.status === 200) {
          // Item deleted successfully, you can update your UI as needed
          console.log("Item deleted successfully");
          toast.message(response.data.message);

          // Reload the page after a short delay (e.g., 500 milliseconds)
          // setTimeout(() => {
          window.location.reload();
          // }, 500);
        } else {
          // Handle other status codes or errors
          console.error("Error deleting item:", response.data.error);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error.message);
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

  const handleSaveEdit = () => {
      // Email validation
  // const emailPattern = /@rptechnovelty\.com$/;
  // if (!emailPattern.test(email)) {
  //   toast.error("Please enter a valid @rptechnovelty.com email address.");
  //   return;
  // }


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
          <div className="naviDiv1">
            <a
              href="/"
              style={{
                fontSize: "20px",
                color: "black",
                textDecoration: "none",
              }}
            >
              All Users
            </a>
            <div className="searchEmp">
              <input
                type="text"
                className="searchInp"
                placeholder="Search..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
             
            </div>
          </div>
          <table className="responsive" style={{ marginTop: "3%" }}>
            <thead>
              <tr className="tabrow">
                <th scope="col" style={{ borderTopLeftRadius: "15px" }}>
                  Sr.No
                </th>
                <th scope="col">Name</th>
                <th scope="col">Email </th>
                <th scope="col">Registed Date / Time</th>
                <th scope="col" style={{ borderTopRightRadius: "15px" }}>
                  Add Tasks
                </th>
               
              </tr>
            </thead>
            <tbody>
              {user.length === 0 ? (
                <>
                  <tr>
                    <td colspan={5} style={{ color: "red" }}>
                      Record not found
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {user.map((item, index) => (
                    <tr key={item.id}>
                      <td data-table-header="Sr.No">
                        {index + 1}
                    
                      </td>
                      <td data-table-header="Name">
                        <img
                          alt=""
                          src={`http://localhost:3005/uploads/${item.profile_image}`}
                          className=""
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            float: "left",
                          }}
                        />
                        {item.name}
                      </td>
                      <td data-table-header="Email">{item.email}</td>
                      <td data-table-header="View Tasks">
                      {item.date}
                       
                      </td>
                      <td data-table-header="View Tasks">
                      <Link to={`/userDetails/${item.id}`}>
                          <button className="button-view">View More</button>
                        </Link>
                       
                      </td>

                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
          {editPopup && (
            <>
              <div className="overlay"></div>
              <div className="edit-popup editPop1">
                <div className="hoursEditDiv">
                  <label className="EditPoplabel">Task Details</label>
                  <textarea
                    type="text"
                    style={{ height: "100px" }}
                    className="hoursInpEdit"
                    name="taskDetails"
                    required
                    value={formData.taskDetails}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="hoursEditDiv">
                  <label className="EditPoplabel">Date</label>
                  <input
                    type="date"
                    required
                    name="date" // Added name attribute
                    className="hoursInpEdit"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="giveReasonDiv">
                  <label className="EditPoplabel">Expected Hr:</label>
                  <input
                    type="int"
                    required
                    className="reasonInpEdit"
                    name="expectedHr" // Added name attribute
                    value={formData.expectedHr}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="actionpopButtons">
                  <button className="saveCancelBtn" onClick={handleFormSubmit}>
                    Save
                  </button>
                  <button
                    className="saveCancelBtn"
                    onClick={() => setEditPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
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
  );
};

export default EmpListOfTask;
