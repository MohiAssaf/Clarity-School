import { motion, AnimatePresence } from "framer-motion";
import { MdDelete } from "react-icons/md";

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-opacity-75 backdrop-blur-sm"
          onClick={onCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 mx-4 z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <MdDelete className="text-red-600" size={28} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600 text-sm mt-2">{message}</p>

            <div className="mt-6 flex gap-3 w-full">
              <button
                onClick={onCancel}
                className="cursor-pointer flex-1 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="cursor-pointer flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
