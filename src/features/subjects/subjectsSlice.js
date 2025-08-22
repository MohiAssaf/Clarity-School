import { createSlice, nanoid } from "@reduxjs/toolkit";

const DUMMY_SUBJECTS = [
  { id: 1, name: "Mathematics", description: "Numbers, algebra, and geometry" },
  { id: 2, name: "Physics", description: "The study of matter and energy" },
  { id: 3, name: "History", description: "Past events and civilizations" },
];

const subjectsSlice = createSlice({
  name: "subjects",
  initialState: {
    list: DUMMY_SUBJECTS,
  },
  reducers: {
    addSubject: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare({ name, description }) {
        return {
          payload: {
            id: nanoid(),
            name,
            description,
          },
        };
      },
    },
    removeSubject(state, action) {
      state.list = state.list.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSubject, removeSubject } = subjectsSlice.actions;
export const selectSubjects = (state) => state.subjects.list;
export default subjectsSlice.reducer;
