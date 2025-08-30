import { motion } from "framer-motion";

const Step2_Days = ({ daysOfWeek, toggleDay, allDays }) => (
  <motion.div
    key="step2"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Which days are working days?
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {allDays.map((day) => (
        <div
          key={day}
          onClick={() => toggleDay(day)}
          className={`p-4 rounded-lg text-center font-medium cursor-pointer transition-colors duration-200 ${
            daysOfWeek.includes(day)
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  </motion.div>
);

export default Step2_Days;
