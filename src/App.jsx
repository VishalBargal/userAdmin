// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Protected from "./Protected";
import Task from "./Pages/Task";

import LoginPage from "./Pages/Login";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import EmpListOfTask from "./Pages/EmpListOfTask";
import TaskDetails from "./Pages/TaskDetails";
import Login from "./Pages/Login";
import CurrentDayTaskDetails from "./Pages/CurrentDayTaskDetails";
import Forgotpass from "./Pages/Forgotpass";
import Verifypass from "./Pages/Verifypass";
import Nav from "./Pages/Nav";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userid");

    if (storedUserId) {
      setIsLogin(true);
    }
  }, []);
  return (
    <BrowserRouter>
      {/* {isLogin && (
        <>
          <Nav />
        </>
      )} */}

      <Routes>
        <Route path="*" element={<div>Rerror 404 Page Not Found</div>} />
        <Route path="/login" element={<Protected Component={Login} />} />
        <Route path="/forgotPassword" element={<Forgotpass />} />
        <Route path="/reset-password/:id/:token" element={<Verifypass />} />
        <Route path="/task" element={<Protected Component={Task} />} />
        <Route path="/logout" element={<Protected Component={Logout} />} />
        <Route path="/" element={<Protected Component={EmpListOfTask} />} />
        <Route
          path="/userDetails/:id"
          element={<Protected Component={TaskDetails} />}
        />
        <Route
          path="/todaysTaskDetails"
          element={<Protected Component={CurrentDayTaskDetails} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
