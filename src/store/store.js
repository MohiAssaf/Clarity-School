import { configureStore } from "@reduxjs/toolkit";
import teachersReducer from "@/features/teachers/teachersSlice";
import subjectsReducer from "@/features/subjects/subjectsSlice";

export const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    subjects: subjectsReducer,
  },
});
