import { createSlice, nanoid } from "@reduxjs/toolkit";

const normalizeText = (value) => String(value || "").trim();

const subjectsSlice = createSlice({
  name: "subjects",
  initialState: {
    list: [],
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
            name: normalizeText(name),
            description: normalizeText(description),
          },
        };
      },
    },
    removeSubject(state, action) {
      state.list = state.list.filter((s) => s.id !== action.payload);
    },
    replaceSubjects(state, action) {
      state.list = action.payload.map((subject) => ({
        id: subject.id,
        name: normalizeText(subject.name),
        description: normalizeText(subject.description),
      }));
    },
  },
});

export const { addSubject, removeSubject, replaceSubjects } =
  subjectsSlice.actions;
export const selectSubjects = (state) => state.subjects.list;
export default subjectsSlice.reducer;
