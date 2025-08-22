import { configureStore } from "@reduxjs/toolkit";
import subjectsReducer from "@/features/subjects/subjectsSlice";

export const store = configureStore({
  reducer: {
    subjects: subjectsReducer,
  },
});
