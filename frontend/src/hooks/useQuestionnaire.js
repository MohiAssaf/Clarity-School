import { useContext } from "react";
import { QuestionnaireContext } from "@/context/questionnaireContextValue";

export const useQuestionnaire = () => useContext(QuestionnaireContext);
