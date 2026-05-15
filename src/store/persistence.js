const APP_DATA_STORAGE_KEY = "claritySchoolAppData";

const hasLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const loadPersistedState = () => {
  if (!hasLocalStorage()) return undefined;

  try {
    const savedState = window.localStorage.getItem(APP_DATA_STORAGE_KEY);
    if (!savedState) return undefined;

    const parsedState = JSON.parse(savedState);
    const preloadedState = {};

    if (Array.isArray(parsedState?.teachers?.list)) {
      preloadedState.teachers = { list: parsedState.teachers.list };
    }

    if (Array.isArray(parsedState?.subjects?.list)) {
      preloadedState.subjects = { list: parsedState.subjects.list };
    }

    return Object.keys(preloadedState).length > 0 ? preloadedState : undefined;
  } catch {
    return undefined;
  }
};

export const savePersistedState = (state) => {
  if (!hasLocalStorage()) return;

  try {
    const stateToPersist = {
      teachers: {
        list: state.teachers.list,
      },
      subjects: {
        list: state.subjects.list,
      },
    };

    window.localStorage.setItem(
      APP_DATA_STORAGE_KEY,
      JSON.stringify(stateToPersist)
    );
  } catch {
    return;
  }
};
