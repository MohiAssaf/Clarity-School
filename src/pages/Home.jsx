import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import HeroIcons from "@/components/home/HeroIcons";
import FeatureCard from "@/components/home/FeatureCard";
import { FaCalendarPlus, FaChartLine, FaUsers } from "react-icons/fa";
import { useQuestionnaire } from "@/context/QuestionnaireContext";

const Home = () => {
  const { quesData } = useQuestionnaire();
  const navigate = useNavigate();

  const featureListVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gray-50 font-sans text-gray-900">
      <HeroIcons />
      <div className="relative z-10">
        <motion.header
          className="sticky top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center bg-white/70 backdrop-blur-md z-50 shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">
            Clarity School
          </div>

          <motion.button
            onClick={() => navigate(quesData ? "/dashboard" : "questionnaire")}
            className="rounded-full bg-gradient-to-r from-blue-700 to-indigo-800 px-8 py-2 text-lg font-semibold text-white shadow-lg cursor-pointer transition-all duration-300 hover:from-blue-800 hover:to-indigo-900 transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {quesData ? "Dashboard" : "Get Started"}
          </motion.button>
        </motion.header>

        <motion.div
          className="px-6 py-24 sm:py-32 lg:px-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Simplify School Scheduling.
          </motion.h1>
          <motion.p
            className="mt-6 text-base sm:text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            A seamless solution for administrators to generate, manage, and
            analyze class schedules with ease and precision.
          </motion.p>
        </motion.div>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-base font-semibold leading-7 text-blue-600">
                Features
              </h2>
              <p className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Everything you need to manage your school's timetable.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-4xl"
              variants={featureListVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-y-16">
                <FeatureCard
                  icon={FaCalendarPlus}
                  title="Automated Scheduling"
                  description="Generate complex schedules for all grades and teachers with a single click, saving hours of manual work."
                />
                <FeatureCard
                  icon={FaUsers}
                  title="Teacher Management"
                  description="Keep a centralized directory of all staff, their subjects, and contact information."
                />
                <FeatureCard
                  icon={FaChartLine}
                  title="Data Analytics"
                  description="Gain valuable insights into class utilization, teacher workloads, and resource allocation with visual dashboards."
                />
              </dl>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
