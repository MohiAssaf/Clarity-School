import { Navigate, Outlet } from "react-router-dom";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";

const RequireQues = () => {
  const { quesData, loading } = useQuestionnaire();

  if (loading) return;

  return quesData ? <Outlet /> : <Navigate to="/questionnaire" replace />;
};

export default RequireQues;
