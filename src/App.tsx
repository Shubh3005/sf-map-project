import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WestgateDemo from "./routes/WestgateDemo.tsx";
import GoalsManagement from "./routes/GoalsManagement.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<WestgateDemo />} />
          <Route path="/goals" element={<GoalsManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;