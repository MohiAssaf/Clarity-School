const API_BASE_URL =
  import.meta.env.VITE_SCHEDULER_API_URL || "http://127.0.0.1:8000";

const parseResponseBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const requestScheduleGeneration = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/schedules/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await parseResponseBody(response);

  if (!response.ok) {
    const errors = data?.errors || data?.detail?.errors;
    const message = Array.isArray(errors)
      ? errors.join(" ")
      : data?.message || "The scheduler API rejected the request.";

    throw new Error(message);
  }

  return data;
};
