import { FaBook } from "react-icons/fa";

const SubjectCard = ({ subject }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 text-blue-500 text-3xl mr-4">
          <FaBook />
        </div>
        <h2 className="text-xl font-bold text-gray-800 break-words">
          {subject.name}
        </h2>
      </div>
      <p className="text-gray-600 text-sm flex-grow leading-relaxed">
        {subject.description}
      </p>
    </div>
  );
};

export default SubjectCard;
