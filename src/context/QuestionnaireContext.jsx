import { createContext, useContext, useState, useEffect } from "react";

const QuestionnaireContext = createContext();

export const QuestionnaireProvider = ({ children }) => {
  const [quesData, setQuesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("quesDone");
    if (saved) {
      setQuesData(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const completeQuestionnaire = (data) => {
    setQuesData(data);
    localStorage.setItem("quesDone", JSON.stringify(data));
  };

  return (
    <QuestionnaireContext.Provider
      value={{ quesData, completeQuestionnaire, loading }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
};

export const useQuestionnaire = () => useContext(QuestionnaireContext);
