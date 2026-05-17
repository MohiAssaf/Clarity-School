import { createSlice, nanoid } from "@reduxjs/toolkit";

const normalizeMaxWeeklyHours = (value, fallback = 30) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

const normalizeAssignments = (assignments) =>
  Array.isArray(assignments)
    ? assignments.map((assignment) => ({
        grade: Number(assignment.grade),
        subject: assignment.subject?.trim() || "",
        frequency: Number(assignment.frequency),
      }))
    : [];

const teachersSlice = createSlice({
  name: "teachers",
  initialState: {
    list: [],
  },
  reducers: {
    addTeacher: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare({
        name,
        email,
        imageUrl,
        availability,
        maxWeeklyHours,
        assignments,
      }) {
        return {
          payload: {
            id: nanoid(),
            name: name?.trim() || "",
            email: email?.trim() || "",
            imageUrl: imageUrl?.trim() || "",
            availability: availability || "flexible",
            maxWeeklyHours: normalizeMaxWeeklyHours(maxWeeklyHours),
            assignments: normalizeAssignments(assignments),
          },
        };
      },
    },
    editTeacher(state, action) {
      const { id, updatedData } = action.payload;
      const existingTeacher = state.list.find((t) => t.id === id);
      if (existingTeacher) {
        Object.assign(existingTeacher, {
          ...updatedData,
          name: updatedData.name?.trim() || existingTeacher.name,
          email: updatedData.email?.trim() || existingTeacher.email,
          imageUrl: updatedData.imageUrl?.trim() || "",
          availability: updatedData.availability || "flexible",
          maxWeeklyHours: normalizeMaxWeeklyHours(
            updatedData.maxWeeklyHours,
            existingTeacher.maxWeeklyHours || 30
          ),
          assignments: normalizeAssignments(updatedData.assignments),
        });
      }
    },
    removeTeacher(state, action) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
    replaceTeachers(state, action) {
      state.list = action.payload.map((teacher) => ({
        id: teacher.id,
        name: teacher.name?.trim() || "",
        email: teacher.email?.trim() || "",
        imageUrl: teacher.imageUrl?.trim() || "",
        availability: teacher.availability || "flexible",
        maxWeeklyHours: normalizeMaxWeeklyHours(teacher.maxWeeklyHours),
        assignments: normalizeAssignments(teacher.assignments),
      }));
    },
  },
});

export const { addTeacher, editTeacher, removeTeacher, replaceTeachers } =
  teachersSlice.actions;
export const selectTeachers = (state) => state.teachers.list;
export default teachersSlice.reducer;
