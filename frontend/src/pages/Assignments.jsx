import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
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
  const schedulerPayload = useMemo(
    () => buildSchedulerPayload({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const readiness = useMemo(
    () => evaluateScheduleReadiness({ quesData, teachers, subjects }),
    [quesData, teachers, subjects]
  );
  const assignments = schedulerPayload.assignments;
  const totalAssignedPeriods = assignments.reduce(
    (total, assignment) => total + assignment.frequency,
    0
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
    ["Grades Ready", getReadyGradeCount(readiness.summary.gradeCoverage || [])],
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
        <h2 className="text-lg font-semibold text-gray-800">Grade Coverage</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-bold uppercase text-gray-500">
                <th className="py-3 pr-4">Grade</th>
                <th className="py-3 pr-4">Assigned</th>
                <th className="py-3 pr-4">Remaining</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(readiness.summary.gradeCoverage || []).map((grade) => (
                <tr key={grade.gradeId} className="text-sm text-gray-700">
                  <td className="py-3 pr-4 font-medium text-gray-900">
                    {grade.gradeName}
                  </td>
                  <td className="py-3 pr-4">
                    {grade.assignedPeriods} / {grade.requiredPeriods}
                  </td>
                  <td className="py-3 pr-4">
                    {grade.status === "excess"
                      ? `-${grade.excessPeriods}`
                      : grade.missingPeriods}
                  </td>
                  <td className="py-3 pr-4">
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
                  </td>
                </tr>
              ))}
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

const getReadyGradeCount = (gradeCoverage) =>
  gradeCoverage.filter((grade) => grade.status === "ready").length;

export default Assignments;
