import { createSlice, nanoid } from "@reduxjs/toolkit";

const DUMMY_TEACHERS = [
  {
    id: 1,
    name: "Tom Mathew",
    email: "tom.mathew@mathew.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    subjects: ["Math", "Physics"],
  },
  {
    id: 2,
    name: "Ema Thomason",
    email: "ema.thomason@school.edu",
    imageUrl: "https://www.workitdaily.com/media-library/image.jpg?id=19296355",
    subjects: ["History", "Geography"],
  },
];

const teachersSlice = createSlice({
  name: "teachers",
  initialState: {
    list: DUMMY_TEACHERS,
  },
  reducers: {
    addTeacher: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare({ name, email, imageUrl, subjects }) {
        return {
          payload: {
            id: nanoid(),
            name,
            email,
            imageUrl: imageUrl || "",
            subjects: Array.isArray(subjects)
              ? subjects
              : String(subjects)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
          },
        };
      },
    },
    removeTeacher(state, action) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTeacher, removeTeacher } = teachersSlice.actions;
export const selectTeachers = (state) => state.teachers.list;
export default teachersSlice.reducer;
