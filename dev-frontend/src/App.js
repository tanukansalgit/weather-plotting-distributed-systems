
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {LoginContext} from './Context/LoginContext';
import React, { useState } from 'react';

import SignIn from './Designedpage/Login';
import Signup from './Designedpage/Signup';
import History from './Designedpage/History';
import Profiles from './Designedpage/Profiles';





function App()
{
    const [username, setUsername] = useState("");
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("")
    const [logs, setLogs] = useState("");
    const [defaultDate, setDefaultDate] = useState("");
    const [defaultTime, setDefaultTime] = useState("");
    const [selectRadar, setSelectRadar] = useState("");

    
    return (
        <div >

            <LoginContext.Provider value = {{username, setUsername, auth, setAuth, token, setToken, userId, setUserId, logs, setLogs, defaultDate, setDefaultDate, selectRadar, setSelectRadar, defaultTime, setDefaultTime}}>
                <Router>
                  <Routes>
                    {auth && <Route exact path="/profiles" element={<Profiles/>} />}
                    {auth && <Route exact path="/history" element={<History/>} />}
                    <Route exact path="/register" element={<Signup />} />
                    <Route exact path="/signup" element={<Signup/>} />
                    <Route exact path="/" element={<SignIn/>} />
                    <Route exact path="*" element={<SignIn />} />
                    
                  </Routes>
                </Router>
            </LoginContext.Provider>
        </div>
  );
}

export default App;