import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Teachers from "@/pages/Teachers";
import Schedules from "@/pages/Schedules";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Subjects from "@/pages/Subjects";
import RequireQues from "@/routes/RequireQues";
import Questionnaire from "@/pages/Questionnaire";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <QuestionnaireProvider>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />

          <Route element={<RequireQues />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/subjects" element={<Subjects />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QuestionnaireProvider>
  );
}

export default App;
