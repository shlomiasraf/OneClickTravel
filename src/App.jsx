import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// עמודים
import Dashboard from "@/pages/Dashboard";
import Trips from "@/pages/Trips";
import CreateTrip from "@/pages/CreateTrip";
import MyProfile from "@/pages/MyProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="trips" element={<Trips />} />
          <Route path="createtrip" element={<CreateTrip />} />
          <Route path="myprofile" element={<MyProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </Router>
  );
}

export default App;
