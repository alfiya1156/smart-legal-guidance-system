import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AIAssistant from "./components/AIAssistant";
import KnowMyRights from "./components/KnowMyRights";
import Emergency from "./components/Emergency";
import Location from "./components/Location";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/Know-my-rights" element={<KnowMyRights />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/location" element={<Location />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
