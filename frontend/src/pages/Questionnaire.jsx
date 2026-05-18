import { AnimatePresence, motion } from "framer-motion";
import useQuestionnaireLogic from "@/hooks/useQuestionnaireLogic";
import Step1_Grades from "@/components/questionnaire/Step1_Grades";
import Step2_Days from "@/components/questionnaire/Step2_Days";
import Step3_Periods from "@/components/questionnaire/Step3_Periods";
import HeroIcons from "@/components/home/HeroIcons";
import { FaArrowLeft } from "react-icons/fa";

const Questionnaire = () => {
  const {
    currentStep,
    gradesCount,
    setGradesCount,
    daysOfWeek,
    toggleDay,
    periodsPerDay,
    handlePeriodChange,
    handleBack,
    handleExitSetup,
    handleNext,
    handleComplete,
    canExitSetup,
    isEditingSetup,
    allDays,
    minGrades,
    maxGrades,
    minPeriodsPerDay,
    maxPeriodsPerDay,
  } = useQuestionnaireLogic();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Grades
            gradesCount={gradesCount}
            setGradesCount={setGradesCount}
            minGrades={minGrades}
            maxGrades={maxGrades}
          />
        );
      case 2:
        return (
          <Step2_Days
            daysOfWeek={daysOfWeek}
            toggleDay={toggleDay}
            allDays={allDays}
          />
        );
      case 3:
        return (
          <Step3_Periods
            daysOfWeek={daysOfWeek}
            periodsPerDay={periodsPerDay}
            handlePeriodChange={handlePeriodChange}
            minPeriodsPerDay={minPeriodsPerDay}
            maxPeriodsPerDay={maxPeriodsPerDay}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <HeroIcons />

      {canExitSetup && (
        <button
          type="button"
          onClick={handleExitSetup}
          className="cursor-pointer absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-100 sm:left-6 sm:top-6"
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>
      )}

      <motion.div
        className="relative z-10 w-full max-w-lg mx-auto rounded-xl shadow-2xl p-8"
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800 text-center">
            School Setup
          </h1>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        <div className="flex justify-between gap-3 mt-8">
          {currentStep > 1 && (
            <motion.button
              type="button"
              onClick={handleBack}
              className="border-3 border-gray-300 cursor-pointer px-6 py-3 text-gray-700  rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Back
            </motion.button>
          )}
          {currentStep < 3 && (
            <motion.button
              type="button"
              onClick={handleNext}
              className="ml-auto cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Next
            </motion.button>
          )}
          {currentStep === 3 && (
            <motion.button
              type="button"
              onClick={handleComplete}
              className="ml-auto cursor-pointer px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isEditingSetup ? "Save Changes" : "Complete"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Questionnaire;
