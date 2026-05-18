import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageLoader from "@/components/common/PageLoader";
import RequireQues from "@/routes/RequireQues";
import { QuestionnaireProvider } from "@/context/QuestionnaireContext";
import { ToastContainer } from "react-toastify";

const Assignments = lazy(() => import("@/pages/Assignments"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Questionnaire = lazy(() => import("@/pages/Questionnaire"));
const Schedules = lazy(() => import("@/pages/Schedules"));
const Subjects = lazy(() => import("@/pages/Subjects"));
const Teachers = lazy(() => import("@/pages/Teachers"));
const Timetable = lazy(() => import("@/pages/Timetable"));

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questionnaire" element={<Questionnaire />} />

            <Route element={<RequireQues />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/timetable" element={<Timetable />} />
              <Route path="/subjects" element={<Subjects />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </QuestionnaireProvider>
  );
}

export default App;
