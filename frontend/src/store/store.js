import { configureStore } from "@reduxjs/toolkit";
import teachersReducer from "@/features/teachers/teachersSlice";
import subjectsReducer from "@/features/subjects/subjectsSlice";
import { loadPersistedState, savePersistedState } from "@/store/persistence";

export const store = configureStore({
  reducer: {
    teachers: teachersReducer,
    subjects: subjectsReducer,
  },
  preloadedState: loadPersistedState(),
});

store.subscribe(() => {
  savePersistedState(store.getState());
});
