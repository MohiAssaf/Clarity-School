import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSearch } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/common/Layout";
import {
  removeSubject,
  selectSubjects,
} from "@/features/subjects/subjectsSlice";
import { selectTeachers } from "@/features/teachers/teachersSlice";
import AddSubject from "@/components/subjects/AddSubject";
import SubjectCard from "@/components/subjects/SubjectCard";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const Subjects = () => {
  const dispatch = useDispatch();
  const subjects = useSelector(selectSubjects);
  const teachers = useSelector(selectTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subjectToDel, setSubjectToDel] = useState(null);

  const subjectUsage = useMemo(() => buildSubjectUsage(teachers), [teachers]);
  const assignedSubjectsCount = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          subjectUsage.get(normalizeSubjectKey(subject.name))?.assignmentCount > 0
      ).length,
    [subjects, subjectUsage]
  );

  const filteredSubjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((subject) =>
      [subject.name, subject.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [subjects, searchTerm]);

  const handleDeleteRequest = (subject) => {
    const usage = subjectUsage.get(normalizeSubjectKey(subject.name));

    if (usage?.assignmentCount > 0) {
      toast.warn(
        `${subject.name} is used in ${usage.assignmentCount} teacher assignment${
          usage.assignmentCount === 1 ? "" : "s"
        }. Remove those assignments before deleting it.`
      );
      return;
    }

    setSubjectToDel(subject);
  };

  return (
    <>
      <Layout>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Subjects</h1>
          <p className="mt-2 text-gray-600">
            Manage the subjects that teachers can assign to grades.
          </p>
        </div>

        <section className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Subjects</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {subjects.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Assigned</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {assignedSubjectsCount}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Unused</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {subjects.length - assignedSubjectsCount}
            </p>
          </div>
        </section>

        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search for a subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => setShowAddSubject(true)}
            className="cursor-pointer py-3 px-6 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            <FaPlus /> Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              usage={subjectUsage.get(normalizeSubjectKey(subject.name))}
              onDelSubject={handleDeleteRequest}
            />
          ))}
          {filteredSubjects.length === 0 && (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              No subjects found.
            </div>
          )}
        </div>
      </Layout>

      <AnimatePresence>
        {showAddSubject && (
          <AddSubject
            onClose={() => setShowAddSubject(false)}
            existingSubjects={subjects}
          />
        )}
      </AnimatePresence>

      {subjectToDel && (
        <ConfirmDeleteModal
          title="Delete Subject?"
          message={`Are you sure you want to delete the ${subjectToDel.name} subject? This action cannot be undone.`}
          onCancel={() => {
            setSubjectToDel(null);
          }}
          onConfirm={() => {
            dispatch(removeSubject(subjectToDel.id));
            toast.success(`${subjectToDel.name} removed`);
            setSubjectToDel(null);
          }}
        />
      )}
    </>
  );
};

const normalizeSubjectKey = (value) => String(value || "").trim().toLowerCase();

const buildSubjectUsage = (teachers) => {
  const usage = new Map();

  for (const teacher of teachers) {
    for (const assignment of teacher.assignments || []) {
      const subjectKey = normalizeSubjectKey(assignment.subject);
      if (!subjectKey) continue;

      const current = usage.get(subjectKey) || {
        assignmentCount: 0,
        assignedPeriods: 0,
      };

      usage.set(subjectKey, {
        assignmentCount: current.assignmentCount + 1,
        assignedPeriods:
          current.assignedPeriods + Number(assignment.frequency || 0),
      });
    }
  }

  return usage;
};

export default Subjects;
