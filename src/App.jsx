import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "@/pages/Dashboard";
import Teachers from "@/pages/Teachers";
import Schedules from "@/pages/Schedules";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Subjects from "@/pages/Subjects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
