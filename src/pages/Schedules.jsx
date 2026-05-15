import { useMemo } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import Layout from "@/components/common/Layout";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { selectTeachers } from "@/features/teachers/teachersSlice";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { evaluateScheduleReadiness } from "@/utils/scheduleReadiness";

const Schedules = () => {
  const { quesData } = useQuestionnaire();
  const teachers = useSelector(selectTeachers);
  const subjects = useSelector(selectSubjects);
  const readiness = useMemo(
    () => evaluateScheduleReadiness({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const summaryItems = [
    ["Teachers", readiness.summary.teacherCount],
    ["Subjects", readiness.summary.subjectCount],
    ["Grades", readiness.summary.gradeCount],
    ["Assignments", readiness.summary.assignmentCount],
    ["Requested Periods", readiness.summary.totalRequestedPeriods],
    ["Available Class Slots", readiness.summary.totalClassSlots],
  ];

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Schedules</h1>
          <p className="mt-2 text-gray-600">
            Review whether the current setup is ready for timetable generation.
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 font-semibold ${
            readiness.isReady
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {readiness.isReady ? <FaCheckCircle /> : <FaTimesCircle />}
          {readiness.isReady ? "Ready to Generate" : "Needs Attention"}
        </div>
      </div>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {summaryItems.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FaTimesCircle className="text-red-500" />
            <h2 className="text-lg font-semibold text-gray-800">
              Blocking Issues
            </h2>
          </div>
          {readiness.blockers.length > 0 ? (
            <ul className="space-y-3">
              {readiness.blockers.map((issue) => (
                <li
                  key={issue}
                  className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              No blocking issues found.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800">Warnings</h2>
          </div>
          {readiness.warnings.length > 0 ? (
            <ul className="space-y-3">
              {readiness.warnings.map((warning) => (
                <li
                  key={warning}
                  className="rounded-lg border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-700"
                >
                  {warning}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              No warnings found.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Schedules;
