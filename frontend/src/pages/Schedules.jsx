import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPlay,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "@/components/common/Layout";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { selectTeachers } from "@/features/teachers/teachersSlice";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { evaluateScheduleReadiness } from "@/utils/scheduleReadiness";
import { buildSchedulerPayload } from "@/utils/schedulerPayload";
import { requestScheduleGeneration } from "@/utils/schedulerApi";

const getSelectedLessons = ({ schedule, day, gradeId, periodsCount }) => {
  if (!schedule || !day || !gradeId || periodsCount <= 0) return [];

  const gradeSchedule = schedule?.[day]?.[String(gradeId)] || {};

  return Array.from({ length: periodsCount }, (_, index) => {
    const period = index + 1;

    return {
      period,
      lesson: gradeSchedule[String(period)] || null,
    };
  });
};

const formatLabel = (value) =>
  String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

const Schedules = () => {
  const { quesData } = useQuestionnaire();
  const teachers = useSelector(selectTeachers);
  const subjects = useSelector(selectSubjects);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const readiness = useMemo(
    () => evaluateScheduleReadiness({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const schedulerPayload = useMemo(
    () => buildSchedulerPayload({ quesData, teachers, subjects }),
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
  const gradeCoverage = readiness.summary.gradeCoverage || [];
  const gradeOptions = schedulerPayload.school.grades;
  const dayOptions = schedulerPayload.school.days;
  const selectedPeriods = Number(
    schedulerPayload.school.periodsPerDay[selectedDay] || 0
  );
  const selectedLessons = getSelectedLessons({
    schedule: apiResult?.schedule,
    day: selectedDay,
    gradeId: selectedGradeId,
    periodsCount: selectedPeriods,
  });

  useEffect(() => {
    const selectedGradeExists = gradeOptions.some(
      (grade) => String(grade.id) === String(selectedGradeId)
    );

    if (gradeOptions.length > 0 && !selectedGradeExists) {
      setSelectedGradeId(String(gradeOptions[0].id));
    }

    if (dayOptions.length > 0 && !dayOptions.includes(selectedDay)) {
      setSelectedDay(dayOptions[0]);
    }
  }, [dayOptions, gradeOptions, selectedDay, selectedGradeId]);

  const handleGenerateClick = async () => {
    if (!readiness.isReady || isGenerating) return;

    setIsGenerating(true);
    setApiResult(null);
    setApiError("");

    try {
      const result = await requestScheduleGeneration(schedulerPayload);
      setApiResult(result);
      toast.success("Schedule generated.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not reach the scheduler API.";
      setApiError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Schedules</h1>
          <p className="mt-2 text-gray-600">
            Review whether the current setup is ready for timetable generation.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
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
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={!readiness.isReady || isGenerating}
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition-colors ${
              readiness.isReady && !isGenerating
                ? "cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <FaPlay />
            {isGenerating ? "Sending..." : "Generate Schedule"}
          </button>
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

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Grade Coverage
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {gradeCoverage.map((grade) => (
            <div
              key={grade.gradeId}
              className={`rounded-lg border p-4 ${
                grade.status === "ready"
                  ? "border-green-100 bg-green-50"
                  : grade.status === "missing"
                  ? "border-yellow-100 bg-yellow-50"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">
                  {grade.gradeName}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    grade.status === "ready"
                      ? "bg-green-100 text-green-700"
                      : grade.status === "missing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {grade.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-600">
                  <span>Assigned</span>
                  <span>
                    {grade.assignedPeriods} / {grade.requiredPeriods}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${
                      grade.status === "ready"
                        ? "bg-green-500"
                        : grade.status === "missing"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        grade.requiredPeriods > 0
                          ? Math.min(
                              (grade.assignedPeriods / grade.requiredPeriods) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  {grade.status === "ready" &&
                    "This grade has complete coverage."}
                  {grade.status === "missing" &&
                    `${grade.missingPeriods} periods still need assignments.`}
                  {grade.status === "excess" &&
                    `${grade.excessPeriods} periods must be removed.`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(apiResult || apiError) && (
        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            {apiResult ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaInfoCircle className="text-red-500" />
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              Backend Response
            </h2>
          </div>

          {apiResult ? (
            <>
              <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {apiResult.message}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Object.entries(apiResult.metadata || {}).map(
                  ([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      <p className="text-sm font-medium text-gray-500">
                        {formatLabel(label)}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {apiError}
            </div>
          )}
        </section>
      )}

      {apiResult?.schedule && (
        <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Generated Timetable
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View one grade and one day at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Grade
                </label>
                <select
                  value={selectedGradeId}
                  onChange={(event) => setSelectedGradeId(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name || `Grade ${grade.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-500">
                  Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(event) => setSelectedDay(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="text-left text-xs font-bold uppercase text-gray-500">
                  <th className="py-3 pr-4">Period</th>
                  <th className="py-3 pr-4">Subject</th>
                  <th className="py-3 pr-4">Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedLessons.map(({ period, lesson }) => (
                  <tr key={period} className="text-sm text-gray-700">
                    <td className="py-3 pr-4 font-semibold text-gray-900">
                      {period}
                    </td>
                    <td className="py-3 pr-4">
                      {lesson ? (
                        <span className="font-medium text-gray-900">
                          {lesson.subject}
                        </span>
                      ) : (
                        <span className="text-red-600">Empty</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {lesson?.teacherName || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {apiResult.unplaced?.length > 0 && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {apiResult.unplaced.length} lesson
              {apiResult.unplaced.length === 1 ? "" : "s"} could not be placed
              by the preview scheduler.
            </div>
          )}

          {apiResult.unplaced?.length === 0 && (
            <div className="mt-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              All requested lessons were placed by the preview scheduler.
            </div>
          )}
        </section>
      )}
    </Layout>
  );
};

export default Schedules;
