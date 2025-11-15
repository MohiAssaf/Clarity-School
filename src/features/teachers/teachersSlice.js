import { createSlice, nanoid } from "@reduxjs/toolkit";

const DUMMY_TEACHERS = [
  {
    id: 1,
    name: "Tom Mathew",
    email: "tom.mathew@mathew.edu",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    availability: "flexible",
    assignments: [
      { grade: 10, subject: "Mathematics", frequency: 5 },
      { grade: 10, subject: "Physics", frequency: 3 },
    ],
  },
  {
    id: 2,
    name: "Ema Thomason",
    email: "ema.thomason@school.edu",
    imageUrl: "https://www.workitdaily.com/media-library/image.jpg?id=19296355",
    availability: "early",
    assignments: [
      { grade: 8, subject: "History", frequency: 4 },
      { grade: 9, subject: "Geography", frequency: 6 },
    ],
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
      prepare({ name, email, imageUrl, availability, assignments }) {
        return {
          payload: {
            id: nanoid(),
            name,
            email,
            imageUrl: imageUrl || "",
            availability: availability || "flexible",
            assignments: Array.isArray(assignments) ? assignments : [],
          },
        };
      },
    },
    editTeacher(state, action) {
      const { id, updatedData } = action.payload;
      const existingTeacher = state.list.find((t) => t.id === id);
      if (existingTeacher) {
        Object.assign(existingTeacher, updatedData);
      }
    },
    removeTeacher(state, action) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTeacher, editTeacher, removeTeacher } = teachersSlice.actions;
export const selectTeachers = (state) => state.teachers.list;
export default teachersSlice.reducer;
