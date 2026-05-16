import { FaBook } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SubjectCard = ({ subject, onDelSubject }) => {
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
          aria-label="delete-subject"
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
      <p className="text-gray-600 text-sm grow leading-relaxed">
        {subject.description}
      </p>
    </div>
  );
};

export default SubjectCard;
