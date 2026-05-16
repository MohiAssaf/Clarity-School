import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeacher,
  editTeacher,
} from "@/features/teachers/teachersSlice";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { toast } from "react-toastify";

const AddEditTeacher = ({ onClose, isEdit, teacher }) => {
  const { quesData } = useQuestionnaire();
  const dispatch = useDispatch();
  const subjects = useSelector(selectSubjects);

  const [form, setForm] = useState({
    name: "",
    email: "",
    imageUrl: "",
    availability: "flexible",
    maxWeeklyHours: 30,
    assignments: [],
  });

  const totalPeriodsPerWeek = useMemo(
    () =>
      Object.values(quesData?.periodsPerDay || {}).reduce(
        (total, periods) => total + Number(periods || 0),
        0
      ),
    [quesData]
  );

  const assignedWeeklyLoad = useMemo(
    () =>
      form.assignments.reduce(
        (total, assignment) => total + Number(assignment.frequency || 0),
        0
      ),
    [form.assignments]
  );

  const maxWeeklyHours = Number(form.maxWeeklyHours || 0);
  const isOverMaxLoad = maxWeeklyHours > 0 && assignedWeeklyLoad > maxWeeklyHours;
  const gradesCount = Number(quesData?.gradesCount || 0);

  useEffect(() => {
    if (isEdit && teacher) {
      setForm({
        name: teacher.name || "",
        email: teacher.email || "",
        imageUrl: teacher.imageUrl || "",
        availability: teacher.availability || "flexible",
        maxWeeklyHours: teacher.maxWeeklyHours || 30,
        assignments: teacher.assignments
          ? teacher.assignments.map((a) => ({
              grade: a.grade || "",
              subject: a.subject || "",
              frequency: a.frequency || 1,
            }))
          : [],
      });
    }
  }, [isEdit, teacher]);

  const handleAddAssignment = () => {
    setForm((prev) => ({
      ...prev,
      assignments: [
        ...prev.assignments,
        { grade: "", subject: "", frequency: 1 },
      ],
    }));
  };

  const handleRemoveAssignment = (index) => {
    const updated = form.assignments.filter((_, i) => i !== index);
    setForm({ ...form, assignments: updated });
  };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...form.assignments];
    updated[index][field] = value;
    setForm({ ...form, assignments: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedTeacher = validateTeacherForm();
    if (!normalizedTeacher) return;

    if (isEdit) {
      dispatch(editTeacher({ id: teacher.id, updatedData: normalizedTeacher }));
      toast.success(`Teacher ${normalizedTeacher.name} updated`);
    } else {
      dispatch(addTeacher(normalizedTeacher));
      toast.success(`Teacher ${normalizedTeacher.name} added`);
    }

    onClose();
  };

  const validateTeacherForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const imageUrl = form.imageUrl.trim();
    const maxHours = Number(form.maxWeeklyHours);

    if (!name) {
      toast.error("Teacher name is required.");
      return null;
    }

    if (!email) {
      toast.error("Teacher email is required.");
      return null;
    }

    if (!Number.isInteger(maxHours) || maxHours <= 0) {
      toast.error("Max weekly hours must be a positive whole number.");
      return null;
    }

    const seenAssignments = new Set();
    const normalizedAssignments = [];

    for (const [index, assignment] of form.assignments.entries()) {
      const grade = Number(assignment.grade);
      const subject = assignment.subject.trim();
      const frequency = Number(assignment.frequency);

      if (!grade || !subject || !Number.isInteger(frequency) || frequency <= 0) {
        toast.error(`Assignment ${index + 1} needs a grade, subject, and valid weekly frequency.`);
        return null;
      }

      if (totalPeriodsPerWeek > 0 && frequency > totalPeriodsPerWeek) {
        toast.error(
          `Assignment ${index + 1} cannot exceed ${totalPeriodsPerWeek} periods per week.`
        );
        return null;
      }

      const assignmentKey = `${grade}-${subject.toLowerCase()}`;
      if (seenAssignments.has(assignmentKey)) {
        toast.error(`Assignment ${index + 1} duplicates another assignment.`);
        return null;
      }

      seenAssignments.add(assignmentKey);
      normalizedAssignments.push({ grade, subject, frequency });
    }

    const normalizedWeeklyLoad = normalizedAssignments.reduce(
      (total, assignment) => total + assignment.frequency,
      0
    );

    if (normalizedWeeklyLoad > maxHours) {
      toast.error(
        `Assigned weekly load (${normalizedWeeklyLoad}) exceeds max weekly hours (${maxHours}).`
      );
      return null;
    }

    return {
      name,
      email,
      imageUrl,
      availability: form.availability,
      maxWeeklyHours: maxHours,
      assignments: normalizedAssignments,
    };
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative z-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] transform scale-95"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isEdit ? "Edit Teacher ✏️" : "Add New Teacher 👩‍🏫"}
            </h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Max Weekly Hours
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.maxWeeklyHours}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxWeeklyHours:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={form.availability}
                  onChange={(e) =>
                    setForm({ ...form, availability: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="flexible">Flexible</option>
                  <option value="early">Early (1-3)</option>
                  <option value="late">Late (4-7)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6 border-gray-200">
              <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Teaching Assignments
                </label>
                <div
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    isOverMaxLoad
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-blue-100 bg-blue-50 text-blue-700"
                  }`}
                >
                  Weekly load: {assignedWeeklyLoad} / {maxWeeklyHours || "-"}
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {form.assignments.map((assignment, idx) => (
                  <motion.div
                    key={idx}
                    className="grid grid-cols-4 gap-4 mb-3 items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                  >
                    <select
                      value={assignment.grade}
                      onChange={(e) =>
                        handleAssignmentChange(
                          idx,
                          "grade",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="p-3 border rounded-lg appearance-none bg-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select grade</option>
                      {Array.from({ length: gradesCount }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Grade {i + 1}
                        </option>
                      ))}
                    </select>

                    <select
                      value={assignment.subject}
                      onChange={(e) =>
                        handleAssignmentChange(idx, "subject", e.target.value)
                      }
                      className="p-3 border rounded-lg appearance-none bg-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select subject</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Times/week"
                      min="1"
                      max={totalPeriodsPerWeek || undefined}
                      value={assignment.frequency}
                      onChange={(e) =>
                        handleAssignmentChange(
                          idx,
                          "frequency",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="p-3 border rounded-lg focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAssignment(idx)}
                      className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove assignment"
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={handleAddAssignment}
                className="cursor-pointer flex items-center justify-center w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors mt-2"
              >
                <FaPlus className="mr-2" /> Add Assignment
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 py-3 text-gray-700 font-medium rounded-lg border-2 border-blue-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                {isEdit ? "Save Changes" : "Save Teacher"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEditTeacher;
