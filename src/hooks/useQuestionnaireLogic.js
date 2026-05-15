import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";
import { toast } from "react-toastify";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MIN_GRADES = 1;
const MAX_GRADES = 12;
const MIN_PERIODS_PER_DAY = 1;
const MAX_PERIODS_PER_DAY = 12;

const useQuestionnaireLogic = () => {
  const navigate = useNavigate();
  const { completeQuestionnaire } = useQuestionnaire();

  const [currentStep, setCurrentStep] = useState(1);
  const [gradesCount, setGradesCount] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [periodsPerDay, setPeriodsPerDay] = useState({});

  const toggleDay = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (daysOfWeek.includes(day)) {
      setPeriodsPerDay((prev) => {
        const copy = { ...prev };
        delete copy[day];
        return copy;
      });
    }
  };

  const handlePeriodChange = (day, value) => {
    setPeriodsPerDay((prev) => ({
      ...prev,
      [day]: value === "" ? "" : Number(value),
    }));
  };

  const validateGradesCount = () => {
    const normalizedGradesCount = Number(gradesCount);

    if (
      !Number.isInteger(normalizedGradesCount) ||
      normalizedGradesCount < MIN_GRADES ||
      normalizedGradesCount > MAX_GRADES
    ) {
      toast.error(`Please enter between ${MIN_GRADES} and ${MAX_GRADES} grades.`);
      return false;
    }

    return true;
  };

  const validateDays = () => {
    if (daysOfWeek.length === 0) {
      toast.error("Please select at least one working day.");
      return false;
    }

    return true;
  };

  const validatePeriods = () => {
    for (const day of daysOfWeek) {
      const periods = Number(periodsPerDay[day]);

      if (
        !Number.isInteger(periods) ||
        periods < MIN_PERIODS_PER_DAY ||
        periods > MAX_PERIODS_PER_DAY
      ) {
        toast.error(
          `Please enter between ${MIN_PERIODS_PER_DAY} and ${MAX_PERIODS_PER_DAY} periods for ${day}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateGradesCount()) return;
    if (currentStep === 2 && !validateDays()) return;

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleComplete = () => {
    if (!validateGradesCount() || !validateDays() || !validatePeriods()) return;

    const normalizedGradesCount = Number(gradesCount);
    const normalizedPeriodsPerDay = Object.fromEntries(
      daysOfWeek.map((day) => [day, Number(periodsPerDay[day])])
    );
    const grades = Array.from({ length: normalizedGradesCount }, (_, i) => ({
      id: i + 1,
      name: `Grade ${i + 1}`,
    }));
    const totalPeriodsPerWeek = daysOfWeek.reduce(
      (total, day) => total + normalizedPeriodsPerDay[day],
      0
    );
    const totalClassSlots = normalizedGradesCount * totalPeriodsPerWeek;
    const data = {
      gradesCount: normalizedGradesCount,
      grades,
      daysOfWeek,
      periodsPerDay: normalizedPeriodsPerDay,
      totalPeriodsPerWeek,
      totalClassSlots,
    };

    completeQuestionnaire(data);
    navigate("/dashboard");
    toast.success("Successfully completed Questionnaire!");
  };

  return {
    currentStep,
    gradesCount,
    setGradesCount,
    daysOfWeek,
    toggleDay,
    periodsPerDay,
    handlePeriodChange,
    handleNext,
    handleBack,
    handleComplete,
    allDays,
    minGrades: MIN_GRADES,
    maxGrades: MAX_GRADES,
    minPeriodsPerDay: MIN_PERIODS_PER_DAY,
    maxPeriodsPerDay: MAX_PERIODS_PER_DAY,
  };
};

export default useQuestionnaireLogic;
