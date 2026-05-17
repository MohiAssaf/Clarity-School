import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import Layout from "@/components/common/Layout";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { selectTeachers } from "@/features/teachers/teachersSlice";
import { buildSchedulerPayload } from "@/utils/schedulerPayload";
import { evaluateScheduleReadiness } from "@/utils/scheduleReadiness";

const Assignments = () => {
  const { quesData } = useQuestionnaire();
  const teachers = useSelector(selectTeachers);
  const subjects = useSelector(selectSubjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [coverageFilter, setCoverageFilter] = useState("all");
  const schedulerPayload = useMemo(
    () => buildSchedulerPayload({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const readiness = useMemo(
    () => evaluateScheduleReadiness({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const assignments = schedulerPayload.assignments;
  const gradeCoverage = useMemo(
    () => readiness.summary.gradeCoverage || [],
    [readiness.summary.gradeCoverage]
  );
  const totalAssignedPeriods = assignments.reduce(
    (total, assignment) => total + assignment.frequency,
    0
  );
  const filteredGradeCoverage = useMemo(() => {
    if (coverageFilter === "all") return gradeCoverage;
    return gradeCoverage.filter((grade) => grade.status === coverageFilter);
  }, [coverageFilter, gradeCoverage]);
  const coverageCounts = useMemo(
    () => ({
      all: gradeCoverage.length,
      ready: gradeCoverage.filter((grade) => grade.status === "ready").length,
      missing: gradeCoverage.filter((grade) => grade.status === "missing").length,
      excess: gradeCoverage.filter((grade) => grade.status === "excess").length,
    }),
    [gradeCoverage]
  );
  const filteredAssignments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const sortedAssignments = [...assignments].sort(
      (a, b) =>
        a.grade - b.grade ||
        a.subject.localeCompare(b.subject) ||
        a.teacherName.localeCompare(b.teacherName)
    );

    if (!q) return sortedAssignments;

    return sortedAssignments.filter((assignment) =>
      [
        assignment.teacherName,
        assignment.subject,
        `grade ${assignment.grade}`,
        String(assignment.frequency),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [assignments, searchTerm]);

  const summaryItems = [
    ["Assignments", assignments.length],
    ["Assigned Periods", totalAssignedPeriods],
    ["Required Periods", readiness.summary.totalClassSlots],
    ["Grades Ready", coverageCounts.ready],
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Assignments</h1>
        <p className="mt-2 text-gray-600">
          Teaching workload by teacher, grade, subject, and weekly frequency.
        </p>
      </div>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Grade Coverage
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Each grade must match the required weekly periods before schedule
              generation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "ready", "missing", "excess"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setCoverageFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  coverageFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status} ({coverageCounts[status]})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-gray-500">
                <th className="py-3 pr-4">Grade</th>
                <th className="py-3 pr-4">Coverage</th>
                <th className="py-3 pr-4">Difference</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredGradeCoverage.map((grade) => (
                <tr key={grade.gradeId} className="text-sm text-gray-700">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {grade.gradeName}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="min-w-40">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span>
                          {grade.assignedPeriods} / {grade.requiredPeriods}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {getCoveragePercentage(
                            grade.assignedPeriods,
                            grade.requiredPeriods
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            grade.status === "ready"
                              ? "bg-green-500"
                              : grade.status === "missing"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${getCoveragePercentage(
                              grade.assignedPeriods,
                              grade.requiredPeriods
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {getGradeDifferenceLabel(grade)}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusBadgeClasses(
                        grade.status
                      )}`}
                    >
                      {grade.status === "ready" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaExclamationTriangle />
                      )}
                      {grade.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredGradeCoverage.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-sm font-medium text-gray-500"
                  >
                    No grades match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Teaching Assignments
          </h2>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-gray-500">
                <th className="py-3 pr-4">Grade</th>
                <th className="py-3 pr-4">Subject</th>
                <th className="py-3 pr-4">Teacher</th>
                <th className="py-3 pr-4">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="text-sm text-gray-700">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    Grade {assignment.grade}
                  </td>
                  <td className="py-3 pr-4">{assignment.subject}</td>
                  <td className="py-3 pr-4">{assignment.teacherName}</td>
                  <td className="py-3 pr-4 font-medium">
                    {assignment.frequency} / week
                  </td>
                </tr>
              ))}
              {filteredAssignments.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-6 text-center text-sm font-medium text-gray-500"
                  >
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

const getCoveragePercentage = (assigned, required) => {
  if (!required) return 0;
  return Math.min(Math.round((assigned / required) * 100), 100);
};

const getGradeDifferenceLabel = (grade) => {
  if (grade.status === "ready") return "Complete";
  if (grade.status === "excess") {
    return `${grade.excessPeriods} over`;
  }

  return `${grade.missingPeriods} missing`;
};

const getStatusBadgeClasses = (status) => {
  if (status === "ready") return "bg-green-100 text-green-700";
  if (status === "missing") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

export default Assignments;
