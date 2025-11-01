import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionnaire } from "@/context/QuestionnaireContext";
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
      [day]: parseInt(value) || 0,
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleComplete = () => {
    if (daysOfWeek.length === 0) {
      toast.error("Please select at least one working day.");
      return;
    }
    for (const day of daysOfWeek) {
      if (!periodsPerDay[day] || periodsPerDay[day] <= 0) {
        toast.error(`Please specify a valid number of periods for ${day}.`);
        return;
      }
    }

    const totalPeriodsPerWeek = Object.values(periodsPerDay).reduce(
      (a, b) => a + b,
      0
    );
    const totalClassSlots = gradesCount * totalPeriodsPerWeek;
    const data = { gradesCount, daysOfWeek, periodsPerDay, totalClassSlots };

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
  };
};

export default useQuestionnaireLogic;
