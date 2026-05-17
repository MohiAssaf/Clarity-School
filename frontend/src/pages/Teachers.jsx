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

  const getTeacherWeeklyLoad = (teacher) =>
    (teacher.assignments || []).reduce(
      (total, assignment) => total + Number(assignment.frequency || 0),
      0,
    );

  const teacherStats = useMemo(() => {
    const assignedTeachers = teachers.filter(
      (teacher) => teacher.assignments?.length > 0,
    );
    const overloadedTeachers = teachers.filter((teacher) => {
      const assignedWeeklyLoad = getTeacherWeeklyLoad(teacher);
      const maxWeeklyHours = Number(teacher.maxWeeklyHours || 0);

      return maxWeeklyHours > 0 && assignedWeeklyLoad > maxWeeklyHours;
    });
    const totalAssignedPeriods = teachers.reduce(
      (total, teacher) => total + getTeacherWeeklyLoad(teacher),
      0,
    );

    return {
      assignedTeachersCount: assignedTeachers.length,
      overloadedTeachersCount: overloadedTeachers.length,
      totalAssignedPeriods,
    };
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const sortedTeachers = [...teachers].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    if (!q) return sortedTeachers;

    return sortedTeachers.filter((teacher) =>
      [
        teacher.name,
        teacher.email,
        teacher.availability,
        ...(teacher.assignments || []).flatMap((assignment) => [
          assignment.subject,
          `grade ${assignment.grade}`,
          String(assignment.frequency),
        ]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [teachers, searchTerm]);

  const summaryCards = [
    ["Teachers", teachers.length],
    ["With Assignments", teacherStats.assignedTeachersCount],
    ["Assigned Periods", teacherStats.totalAssignedPeriods],
    ["Overloaded", teacherStats.overloadedTeachersCount],
  ];

  return (
    <>
      <Layout>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Teachers</h1>
          <p className="mt-2 text-gray-600">
            Manage teacher details, weekly limits, and teaching assignments.
          </p>
        </div>

        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search teachers, subjects, or grades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={() => setShowAddTeacher(true)}
            className="cursor-pointer py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700"
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
          {filteredTeachers.length === 0 && (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              No teachers found.
            </div>
          )}
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
          message={`Are you sure you want to delete ${teacherToDelete.name}? This action cannot be undone.`}
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
