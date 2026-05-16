import { createSlice, nanoid } from "@reduxjs/toolkit";

const DUMMY_SUBJECTS = [
  { id: 1, name: "Arabic", description: "Language and literature studies" },
  { id: 2, name: "Bulgarian", description: "Bulgarian language and culture" },
  { id: 3, name: "Science", description: "Exploration of the natural world" },
  { id: 4, name: "Mathematics", description: "Numbers, algebra, and geometry" },
  {
    id: 5,
    name: "Chemistry",
    description: "Study of substances and reactions",
  },
  { id: 6, name: "English", description: "English language and literature" },
  { id: 7, name: "Physics", description: "The study of matter and energy" },
  { id: 8, name: "Religion", description: "Faith, ethics, and beliefs" },
  {
    id: 9,
    name: "Physical Education",
    description: "Exercise, sports, and fitness",
  },
  {
    id: 10,
    name: "Arts",
    description: "Creative expression through visual arts",
  },
  {
    id: 11,
    name: "Technology",
    description: "Practical applications of science",
  },
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
