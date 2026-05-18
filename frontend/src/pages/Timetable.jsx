import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";
import Layout from "@/components/common/Layout";
import { loadGeneratedTimetable } from "@/utils/generatedTimetableStorage";
import { exportTimetable } from "@/utils/timetableExport";
import {
  formatLabel,
  getSelectedGradeLessons,
  getSelectedTeacherLessons,
} from "@/utils/timetableView";

const GradeTimetable = ({ lessons }) => (
  <table className="min-w-full divide-y divide-gray-100">
    <thead>
      <tr className="text-left text-xs font-bold uppercase text-gray-500">
        <th className="py-3 pr-4">Period</th>
        <th className="py-3 pr-4">Subject</th>
        <th className="py-3 pr-4">Teacher</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {lessons.map(({ period, lesson }) => (
        <tr key={period} className="text-sm text-gray-700">
          <td className="py-3 pr-4 font-semibold text-gray-900">{period}</td>
          <td className="py-3 pr-4">
            {lesson ? (
              <span className="font-medium text-gray-900">
                {lesson.subject}
              </span>
            ) : (
              <span className="text-red-600">Empty</span>
            )}
          </td>
          <td className="py-3 pr-4">{lesson?.teacherName || "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const TeacherTimetable = ({ lessons }) => (
  <table className="min-w-full divide-y divide-gray-100">
    <thead>
      <tr className="text-left text-xs font-bold uppercase text-gray-500">
        <th className="py-3 pr-4">Period</th>
        <th className="py-3 pr-4">Grade</th>
        <th className="py-3 pr-4">Subject</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {lessons.map(({ period, lesson }) => (
        <tr key={period} className="text-sm text-gray-700">
          <td className="py-3 pr-4 font-semibold text-gray-900">{period}</td>
          <td className="py-3 pr-4">{lesson?.gradeName || "-"}</td>
          <td className="py-3 pr-4">
            {lesson ? (
              <span className="font-medium text-gray-900">
                {lesson.subject}
              </span>
            ) : (
              <span className="text-gray-400">Free</span>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Timetable = () => {
  const [timetable] = useState(() => loadGeneratedTimetable());
  const [viewMode, setViewMode] = useState("grade");
  const [selectedGradeId, setSelectedGradeId] = useState(() =>
    String(timetable?.school?.grades?.[0]?.id || "")
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState(() =>
    String(timetable?.teachers?.[0]?.id || "")
  );
  const [selectedDay, setSelectedDay] = useState(
    () => timetable?.school?.days?.[0] || ""
  );
  const [exportScope, setExportScope] = useState("current");
  const [exportDayRange, setExportDayRange] = useState("current");
  const [exportFormat, setExportFormat] = useState("docx");
  const [isExporting, setIsExporting] = useState(false);

  const result = timetable?.result;
  const school = timetable?.school || { grades: [], days: [], periodsPerDay: {} };
  const teachers = timetable?.teachers || [];
  const selectedPeriods = Number(school.periodsPerDay[selectedDay] || 0);
  const selectedGrade = school.grades.find(
    (grade) => String(grade.id) === String(selectedGradeId)
  );
  const selectedTeacher = teachers.find(
    (teacher) => String(teacher.id) === String(selectedTeacherId)
  );
  const gradeLessons = useMemo(
    () =>
      getSelectedGradeLessons({
        schedule: result?.schedule,
        day: selectedDay,
        gradeId: selectedGradeId,
        periodsCount: selectedPeriods,
      }),
    [result, selectedDay, selectedGradeId, selectedPeriods]
  );
  const teacherLessons = useMemo(
    () =>
      getSelectedTeacherLessons({
        schedule: result?.schedule,
        day: selectedDay,
        teacherId: selectedTeacherId,
        periodsCount: selectedPeriods,
        grades: school.grades,
      }),
    [result, selectedDay, selectedTeacherId, selectedPeriods, school.grades]
  );

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      await exportTimetable({
        timetable,
        scope: exportScope,
        dayRange: exportDayRange,
        format: exportFormat,
        viewMode,
        selectedDay,
        selectedGradeId,
        selectedTeacherId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!timetable) {
    return (
      <Layout>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-yellow-700">
            <FaExclamationTriangle />
            <h1 className="text-2xl font-bold">No Timetable Generated</h1>
          </div>
          <p className="text-sm font-medium text-yellow-800">
            Generate a schedule first, then come back here to view the timetable.
          </p>
          <Link
            to="/schedules"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Go to Schedules
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Timetable</h1>
          <p className="mt-2 text-gray-600">
            Generated timetable viewer for grades and teachers.
          </p>
          {timetable.generatedAt && (
            <p className="mt-1 text-sm text-gray-500">
              Generated {new Date(timetable.generatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewMode("grade")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
              viewMode === "grade"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaCalendarAlt />
            Grade View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("teacher")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
              viewMode === "teacher"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaChalkboardTeacher />
            Teacher View
          </button>
        </div>
      </div>

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
              Export
            </label>
            <select
              value={exportScope}
              onChange={(event) => setExportScope(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current view</option>
              <option value="allGrades">All grades</option>
              <option value="allTeachers">All teachers</option>
              <option value="everything">Everything</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
              Days
            </label>
            <select
              value={exportDayRange}
              onChange={(event) => setExportDayRange(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="current">Current day</option>
              <option value="all">All days</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
              Format
            </label>
            <select
              value={exportFormat}
              onChange={(event) => setExportFormat(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="docx">Word (.docx)</option>
              <option value="pdf">PDF</option>
              <option value="excel">Excel (.xls)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <FaDownload />
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(result.metadata || {}).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">
              {formatLabel(label)}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {viewMode === "grade" ? (
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                Grade
              </label>
              <select
                value={selectedGradeId}
                onChange={(event) => setSelectedGradeId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {school.grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name || `Grade ${grade.id}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                Teacher
              </label>
              <select
                value={selectedTeacherId}
                onChange={(event) => setSelectedTeacherId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
              Day
            </label>
            <select
              value={selectedDay}
              onChange={(event) => setSelectedDay(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {school.days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <div className="flex items-center gap-2">
              <FaCheckCircle />
              {result.unplaced?.length === 0
                ? "All lessons placed"
                : `${result.unplaced?.length || 0} unplaced lessons`}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {viewMode === "grade"
              ? `${selectedGrade?.name || "Selected Grade"} - ${selectedDay}`
              : `${selectedTeacher?.name || "Selected Teacher"} - ${selectedDay}`}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {viewMode === "grade" ? (
            <GradeTimetable lessons={gradeLessons} />
          ) : (
            <TeacherTimetable lessons={teacherLessons} />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Timetable;
