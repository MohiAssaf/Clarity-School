import {
  FaHome,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBookOpen,
} from "react-icons/fa";
import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg w-64 h-screen fixed top-0 left-0 p-4 flex flex-col items-center">
      <div className="text-2xl font-extrabold text-blue-900 mb-10 mt-2">
        Clarity School
      </div>
      <ul className="w-full space-y-2">
        <li className="w-full">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-700 font-medium ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            <FaHome className="mr-3 text-lg" />
            Dashboard
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-700 font-medium ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            <FaChalkboardTeacher className="mr-3 text-lg" />
            Teachers
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-700 font-medium ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            <FaBookOpen className="mr-3 text-lg" />
            Subjects
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/schedules"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 text-gray-700 font-medium ${
                isActive ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
              }`
            }
          >
            <FaCalendarAlt className="mr-3 text-lg" />
            Schedules
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
