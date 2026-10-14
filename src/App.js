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
import FormGenerator from "./components/FormGenerator";
import DocumentScanner from "./components/DocumentScanner";
import Profile from "./components/Profile";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import UserManagement from "./components/UserManagement";
import AdminLegalAwareness from "./components/AdminLegalAwareness";
import AdminLegalKnowledge from "./components/AdminLegalKnowledge";
import AdminRecentActivity from "./components/AdminRecentActivity";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/know-my-rights" element={<KnowMyRights />} />
        <Route path="/Know-my-rights" element={<KnowMyRights />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/location" element={<Location />} />
        <Route path="/forms" element={<FormGenerator />} />
        <Route path="/forms/:formType" element={<FormGenerator />} />
        <Route path="/scanner" element={<DocumentScanner />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/legal-awareness" element={<AdminLegalAwareness />} />
        <Route path="/admin/ai-legal-knowledge" element={<AdminLegalKnowledge />} />
        <Route path="/admin/recent-activity" element={<AdminRecentActivity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;