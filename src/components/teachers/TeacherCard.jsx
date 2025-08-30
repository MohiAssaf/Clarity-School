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
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {teacher.subjects.map((subject, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
