export const downloadTimetableCsv = ({ filename, headers, rows }) => {
  const csv = [headers, ...rows]
    .map((row) => row.map(formatCsvValue).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFilename(filename)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const buildGradeCsvRows = ({ lessons, day, gradeName }) =>
  lessons.map(({ period, lesson }) => [
    period,
    day,
    gradeName,
    lesson?.subject || "",
    lesson?.teacherName || "",
  ]);

export const buildTeacherCsvRows = ({ lessons, day, teacherName }) =>
  lessons.map(({ period, lesson }) => [
    period,
    day,
    teacherName,
    lesson?.gradeName || "",
    lesson?.subject || "",
  ]);

const formatCsvValue = (value) => {
  const text = String(value ?? "");

  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
};

const sanitizeFilename = (value) =>
  String(value || "timetable")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
