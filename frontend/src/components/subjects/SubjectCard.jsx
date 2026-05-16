import { FaBook } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SubjectCard = ({ subject, usage, onDelSubject }) => {
  const assignmentCount = usage?.assignmentCount || 0;
  const assignedPeriods = usage?.assignedPeriods || 0;
  const isAssigned = assignmentCount > 0;

  return (
    <div className="relative bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="absolute top-3 right-3 flex items-center gap-2 sm:top-4 sm:right-4">
        <button
          type="button"
          onClick={() => onDelSubject({ id: subject.id, name: subject.name })}
          className="
            cursor-pointer p-1.5 sm:p-2 rounded-full bg-white shadow-md border border-gray-200 
            hover:bg-red-50 hover:border-red-400 transition-all duration-200
            active:scale-95
          "
          aria-label={`Delete ${subject.name}`}
        >
          <MdDelete className="text-red-600 hover:text-red-700" size={16} />
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div className="shrink-0 text-blue-500 text-3xl mr-4">
          <FaBook />
        </div>
        <h2 className="text-xl font-bold text-gray-800 wrap-break-words">
          {subject.name}
        </h2>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
            isAssigned
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isAssigned ? "Assigned" : "Unused"}
        </span>
        {isAssigned && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {assignedPeriods} periods/week
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm grow leading-relaxed">
        {subject.description || "No description added."}
      </p>
    </div>
  );
};

export default SubjectCard;
