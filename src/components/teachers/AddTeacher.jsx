import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeacher } from "@/features/teachers/teachersSlice";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { motion } from "framer-motion";
import Select from "react-select";

const AddTeacher = ({ onClose }) => {
  const dispatch = useDispatch();
  const subjects = useSelector(selectSubjects);

  const [form, setForm] = useState({
    name: "",
    email: "",
    imageUrl: "",
    subjects: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedSubjectNames = form.subjects
      .map((id) => subjects.find((s) => s.id === id)?.name)
      .filter(Boolean);

    dispatch(
      addTeacher({
        name: form.name,
        email: form.email,
        imageUrl: form.imageUrl,
        subjects: selectedSubjectNames,
      })
    );

    onClose();
  };

  const subjectOptions = subjects.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-8"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Add New Teacher
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g., jane.doe@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* image url */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              id="imageUrl"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          {/* subjects with react-select */}
          <div>
            <label
              htmlFor="subjects"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subjects
            </label>
            <Select
              id="subjects"
              isMulti
              options={subjectOptions}
              value={subjectOptions.filter((opt) =>
                form.subjects.includes(opt.value)
              )}
              onChange={(selected) => {
                setForm({
                  ...form,
                  subjects: selected ? selected.map((opt) => opt.value) : [],
                });
              }}
              className="text-sm"
              classNamePrefix="react-select"
              placeholder="Select subjects..."
            />
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-6 py-3 text-gray-700 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Save Teacher
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTeacher;
