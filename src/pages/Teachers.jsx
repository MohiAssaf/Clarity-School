import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaSearch } from "react-icons/fa";
import Layout from "@/components/common/Layout";
import TeacherCard from "@/components/teachers/TeacherCard";
import {
  removeTeacher,
  selectTeachers,
} from "@/features/teachers/teachersSlice";
import AddEditTeacher from "@/components/teachers/AddEditTeacher";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import { toast } from "react-toastify";

const Teachers = () => {
  const dispatch = useDispatch();
  const teachers = useSelector(selectTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [teacherToEdit, setTeacherToEdit] = useState(null);

  const filteredTeachers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => t.name.toLowerCase().includes(q));
  }, [teachers, searchTerm]);

  return (
    <>
      <Layout>
        <h1 className="text-4xl font-bold mb-8">Teachers</h1>

        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search for a teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => setShowAddTeacher(true)}
            className="cursor-pointer py-3 px-4 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <FaPlus /> Add Teacher
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onEditTeacher={(teacherObj) => {
                setTeacherToEdit(teacherObj);
              }}
              onDeleteTeacher={(teacherObj) => {
                setTeacherToDelete(teacherObj);
              }}
            />
          ))}
        </div>
      </Layout>

      {(showAddTeacher || teacherToEdit) && (
        <AddEditTeacher
          onClose={() => {
            setShowAddTeacher(false);
            setTeacherToEdit(null);
          }}
          isEdit={!!teacherToEdit}
          teacher={teacherToEdit}
        />
      )}

      {teacherToDelete && (
        <ConfirmDeleteModal
          title="Delete Teacher?"
          message={
            teacherToDelete
              ? `Are you sure you want to delete ${teacherToDelete.name}? This action cannot be undone.`
              : ""
          }
          onCancel={() => {
            setTeacherToDelete(null);
          }}
          onConfirm={() => {
            dispatch(removeTeacher(teacherToDelete.id));
            toast.success(`Teacher ${teacherToDelete.name} removed`);
            setTeacherToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default Teachers;
