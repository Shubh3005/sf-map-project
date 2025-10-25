import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import WestgateDemo from "./routes/WestgateDemo.tsx";
import GoalsManagement from "./routes/GoalsManagement.tsx";

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-4 left-4 z-50">
      <div className="flex gap-2">
        <Link
          to="/"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
          }`}
        >
          Map Explorer
        </Link>
        <Link
          to="/goals"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === '/goals' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
          }`}
        >
          Goals Management
        </Link>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <Routes>
          <Route path="/" element={<WestgateDemo />} />
          <Route path="/goals" element={<GoalsManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;