import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaArrowRight,
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaClipboardList,
  FaCog,
  FaExclamationCircle,
} from "react-icons/fa";
import Layout from "@/components/common/Layout";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { selectSubjects } from "@/features/subjects/subjectsSlice";
import { selectTeachers } from "@/features/teachers/teachersSlice";
import { evaluateScheduleReadiness } from "@/utils/scheduleReadiness";

const Dashboard = () => {
  const { quesData } = useQuestionnaire();
  const subjects = useSelector(selectSubjects);
  const teachers = useSelector(selectTeachers);
  const grades =
    quesData?.grades ||
    Array.from({ length: Number(quesData?.gradesCount || 0) }, (_, i) => ({
      id: i + 1,
      name: `Grade ${i + 1}`,
    }));
  const daysOfWeek = quesData?.daysOfWeek || [];
  const periodsPerDay = quesData?.periodsPerDay || {};
  const totalPeriodsPerWeek =
    quesData?.totalPeriodsPerWeek ||
    daysOfWeek.reduce((total, day) => total + Number(periodsPerDay[day] || 0), 0);
  const totalClassSlots =
    quesData?.totalClassSlots || grades.length * totalPeriodsPerWeek;
  const readiness = evaluateScheduleReadiness({ quesData, teachers, subjects });
  const readyGrades = (readiness.summary.gradeCoverage || []).filter(
    (grade) => grade.status === "ready"
  ).length;
  const nextMessage =
    readiness.blockers[0] ||
    readiness.warnings[0] ||
    "Everything is ready for schedule generation.";
  const nextLink = readiness.isReady ? "/schedules" : getNextSetupLink(readiness);

  const summaryCards = [
    ["Grades", grades.length],
    ["Weekly Periods", totalPeriodsPerWeek],
    ["Class Slots", totalClassSlots],
    ["Assigned Periods", readiness.summary.totalRequestedPeriods],
  ];

  const workflowSteps = [
    {
      title: "School Setup",
      detail: `${daysOfWeek.length} days, ${grades.length} grades`,
      icon: FaCog,
      to: "/questionnaire",
      status:
        grades.length > 0 && daysOfWeek.length > 0 && totalPeriodsPerWeek > 0
          ? "complete"
          : "blocked",
    },
    {
      title: "Subjects",
      detail: `${subjects.length} subjects`,
      icon: FaBook,
      to: "/subjects",
      status: subjects.length > 0 ? "complete" : "blocked",
    },
    {
      title: "Teachers",
      detail: `${teachers.length} teachers`,
      icon: FaChalkboardTeacher,
      to: "/teachers",
      status: teachers.length > 0 ? "complete" : "blocked",
    },
    {
      title: "Assignments",
      detail: `${readyGrades} of ${grades.length} grades ready`,
      icon: FaClipboardList,
      to: "/assignments",
      status:
        readiness.summary.assignmentCount === 0
          ? "blocked"
          : readyGrades === grades.length
          ? "complete"
          : "warning",
    },
    {
      title: "Schedules",
      detail: readiness.isReady ? "Ready to generate" : "Needs setup",
      icon: FaCalendarAlt,
      to: "/schedules",
      status: readiness.isReady ? "complete" : "blocked",
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Setup progress for building a complete weekly timetable.
        </p>
      </div>

      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Workflow</h2>
          <Link
            to={nextLink}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continue <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            const statusClasses = getStatusClasses(step.status);

            return (
              <Link
                key={step.title}
                to={step.to}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-gray-100 p-3 text-gray-700">
                    <Icon />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClasses.badge}`}
                  >
                    {step.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{step.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            {readiness.isReady ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaExclamationCircle className="text-yellow-600" />
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              Schedule Readiness
            </h2>
          </div>
          <p className="text-sm font-medium text-gray-700">{nextMessage}</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full ${
                readiness.isReady ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{
                width: `${getCoveragePercentage(
                  readiness.summary.totalRequestedPeriods,
                  totalClassSlots
                )}%`,
              }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{readiness.summary.totalRequestedPeriods} assigned</span>
            <span>{totalClassSlots} required</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Week</h2>
          <ul className="divide-y divide-gray-100">
            {daysOfWeek.map((day) => (
              <li key={day} className="flex items-center justify-between py-3">
                <span className="font-medium text-gray-700">{day}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                  {periodsPerDay[day]} periods
                </span>
              </li>
            ))}
          </ul>
          {daysOfWeek.length === 0 && (
            <p className="text-sm font-medium text-gray-500">
              No working days configured.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
};

const getCoveragePercentage = (assigned, required) => {
  if (!required) return 0;
  return Math.min(Math.round((assigned / required) * 100), 100);
};

const getNextSetupLink = (readiness) => {
  const firstBlocker = readiness.blockers[0] || "";

  if (
    firstBlocker.includes("questionnaire") ||
    firstBlocker.includes("grade") ||
    firstBlocker.includes("working day") ||
    firstBlocker.includes("periods")
  ) {
    return "/questionnaire";
  }

  if (firstBlocker.includes("subject")) {
    return "/subjects";
  }

  if (firstBlocker.includes("teacher")) {
    return "/teachers";
  }

  return "/assignments";
};

const getStatusClasses = (status) => {
  if (status === "complete") {
    return { badge: "bg-green-100 text-green-700" };
  }

  if (status === "warning") {
    return { badge: "bg-yellow-100 text-yellow-700" };
  }

  return { badge: "bg-red-100 text-red-700" };
};

export default Dashboard;
