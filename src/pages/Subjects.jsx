import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSearch } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/common/Layout";
import {
  removeSubject,
  selectSubjects,
} from "@/features/subjects/subjectsSlice";
import AddSubject from "@/components/subjects/AddSubject";
import SubjectCard from "@/components/subjects/SubjectCard";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const Subjects = () => {
  const dispatch = useDispatch();
  const subjects = useSelector(selectSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [subjectToDel, setSubjectToDel] = useState(null);

  const filteredSubjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjects, searchTerm]);

  return (
    <>
      <Layout>
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Subjects</h1>

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
              onDelSubject={(subjObj) => setSubjectToDel(subjObj)}
            />
          ))}
        </div>
      </Layout>

      <AnimatePresence>
        {showAddSubject && (
          <AddSubject onClose={() => setShowAddSubject(false)} />
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

export default Subjects;
