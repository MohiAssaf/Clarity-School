import { motion } from "framer-motion";

const Step1_Grades = ({ gradesCount, setGradesCount }) => (
  <motion.div
    key="step1"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      How many grades are there in your school?
    </h2>
    <input
      type="number"
      value={gradesCount}
      onChange={(e) => setGradesCount(parseInt(e.target.value))}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    />
  </motion.div>
);

export default Step1_Grades;
