import Layout from "@/components/common/Layout";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";

const Dashboard = () => {
  const { quesData } = useQuestionnaire();
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

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          School Setup
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Grades</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {grades.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Working Days</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {daysOfWeek.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Periods Per Week
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalPeriodsPerWeek}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Class Slots Per Week
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalClassSlots}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grades</h2>
          <div className="flex flex-wrap gap-2">
            {grades.map((grade) => (
              <span
                key={grade.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
              >
                {grade.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Periods
          </h2>
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
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
