const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6 text-center">
        <img
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
          src={teacher.imageUrl || "/images/default.jpg"}
          alt={`${teacher.name}'s profile`}
        />

        <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
        <p className="text-sm text-gray-500">{teacher.email}</p>

        <div className="mt-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
          <div className="mt-4 text-left">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Teaching Assignments
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
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
