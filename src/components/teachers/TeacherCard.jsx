import { MdDelete, MdModeEdit } from "react-icons/md";

const TeacherCard = ({ teacher, onEditTeacher, onDeleteTeacher }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden transform">
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

        <div className="mt-2 sm:mt-3">
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
        </div>

        {teacher.assignments?.length > 0 && (
          <div className="mt-3 sm:mt-4 text-left">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Teaching Assignments
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
              {teacher.assignments.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    Grade {a.grade} - {a.subject}
                  </span>
                  <span className="font-medium">{a.frequency} / week</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;
