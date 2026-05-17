import { MdDelete, MdModeEdit } from "react-icons/md";

const TeacherCard = ({ teacher, onEditTeacher, onDeleteTeacher }) => {
  const assignedWeeklyLoad =
    teacher.assignments?.reduce(
      (total, assignment) => total + Number(assignment.frequency || 0),
      0
    ) || 0;
  const maxWeeklyHours = Number(teacher.maxWeeklyHours || 30);
  const isOverloaded = assignedWeeklyLoad > maxWeeklyHours;
  const assignments = teacher.assignments || [];
  const visibleAssignments = assignments.slice(0, 4);
  const hiddenAssignmentCount = Math.max(assignments.length - visibleAssignments.length, 0);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      <div
        className="
          absolute top-3 right-3 flex items-center gap-2
          sm:top-4 sm:right-4
        "
      >
        <button
          type="button"
          aria-label="Edit-teacher"
          onClick={() => onEditTeacher(teacher)}
          className="
            cursor-pointer p-1.5 sm:p-2 rounded-full bg-white shadow-md border border-gray-200 
            hover:bg-blue-50 hover:border-blue-400 transition-all duration-200
            active:scale-95
          "
        >
          <MdModeEdit className="text-blue-600 hover:text-blue-700" size={16} />
          <span className="hidden sm:inline"></span>
        </button>

        <button
          type="button"
          onClick={() =>
            onDeleteTeacher({ id: teacher.id, name: teacher.name })
          }
          className="
            cursor-pointer p-1.5 sm:p-2 rounded-full bg-white shadow-md border border-gray-200 
            hover:bg-red-50 hover:border-red-400 transition-all duration-200
            active:scale-95
          "
          aria-label="Delete-teacher"
        >
          <MdDelete className="text-red-600 hover:text-red-700" size={16} />
        </button>
      </div>

      <div className="p-4 sm:p-6 text-center">
        <img
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-4 border-blue-100"
          src={teacher.imageUrl || "/images/default.jpg"}
          alt={`${teacher.name}'s profile`}
        />

        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {teacher.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{teacher.email}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:mt-3">
          <span
            className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
              teacher.availability === "flexible"
                ? "bg-green-100 text-green-700"
                : teacher.availability === "early"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {teacher.availability === "flexible"
              ? "Flexible"
              : teacher.availability === "early"
              ? "Early (1-3)"
              : "Late (4-7)"}
          </span>
          <span
            className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full ${
              assignments.length > 0
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {assignments.length > 0
              ? `${assignments.length} assignment${
                  assignments.length === 1 ? "" : "s"
                }`
              : "No assignments"}
          </span>
        </div>

        <div
          className={`mt-3 rounded-lg border px-3 py-2 text-xs sm:text-sm font-medium ${
            isOverloaded
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-blue-100 bg-blue-50 text-blue-700"
          }`}
        >
          Weekly load: {assignedWeeklyLoad} / {maxWeeklyHours}
        </div>

        {assignments.length > 0 ? (
          <div className="mt-3 sm:mt-4 text-left">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Teaching Assignments
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
              {visibleAssignments.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <span className="min-w-0 pr-3">
                    Grade {a.grade} - {a.subject}
                  </span>
                  <span className="shrink-0 font-medium">{a.frequency} / week</span>
                </li>
              ))}
            </ul>
            {hiddenAssignmentCount > 0 && (
              <p className="mt-2 text-xs font-medium text-gray-500">
                +{hiddenAssignmentCount} more
              </p>
            )}
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-yellow-50 px-3 py-2 text-left text-xs font-medium text-yellow-700 sm:text-sm">
            Add assignments so this teacher can be used by the scheduler.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;
