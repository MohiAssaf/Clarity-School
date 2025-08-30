import { motion } from "framer-motion";

const Step3_Periods = ({ daysOfWeek, periodsPerDay, handlePeriodChange }) => (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      How many periods are there on each teaching day?
    </h2>
    <div className="space-y-4">
      {daysOfWeek.map((day) => (
        <div key={day} className="flex items-center gap-4">
          <span className="w-24 font-medium text-gray-700">{day}</span>
          <input
            type="number"
            min="1"
            placeholder="Periods"
            value={periodsPerDay[day] || ""}
            onChange={(e) => handlePeriodChange(day, e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      ))}
    </div>
  </motion.div>
);

export default Step3_Periods;
