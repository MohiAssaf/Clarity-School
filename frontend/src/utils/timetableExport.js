import {
  getSelectedGradeLessons,
  getSelectedTeacherLessons,
} from "@/utils/timetableView";

const DOCX_COLORS = {
  border: "CBD5E1",
  emptyFill: "F8FAFC",
  headerFill: "1F4E79",
  headerText: "FFFFFF",
  lessonText: "0F172A",
  mutedText: "475569",
  rowHeaderFill: "EAF2F8",
};
const DOCX_CELL_MARGINS = {
  top: 120,
  bottom: 120,
  left: 100,
  right: 100,
};
const DOCX_CONTENT_WIDTH = 15000;
const DOCX_ROW_HEADER_WIDTH = 1700;

export const exportTimetable = async ({
  timetable,
  scope,
  dayRange,
  format,
  viewMode,
  selectedDay,
  selectedGradeId,
  selectedTeacherId,
}) => {
  const exportData = buildTimetableExportData({
    timetable,
    scope,
    dayRange,
    viewMode,
    selectedDay,
    selectedGradeId,
    selectedTeacherId,
  });

  if (format === "docx") {
    await downloadTimetableDocx(exportData);
    return;
  }

  if (format === "pdf") {
    printTimetablePdf(exportData);
    return;
  }

  downloadTimetableExcel(exportData);
};

const buildTimetableExportData = ({
  timetable,
  scope,
  dayRange,
  viewMode,
  selectedDay,
  selectedGradeId,
  selectedTeacherId,
}) => {
  const school = timetable.school;
  const teachers = timetable.teachers || [];
  const schedule = timetable.result?.schedule;
  const days = dayRange === "all" ? school.days : [selectedDay];
  const groups = [];

  if (scope === "current") {
    if (viewMode === "teacher") {
      groups.push(
        buildTeacherGroup({
          school,
          teachers: teachers.filter(
            (teacher) => String(teacher.id) === String(selectedTeacherId)
          ),
          schedule,
          days,
        })
      );
    } else {
      groups.push(
        buildGradeGroup({
          school,
          grades: school.grades.filter(
            (grade) => String(grade.id) === String(selectedGradeId)
          ),
          schedule,
          days,
        })
      );
    }
  }

  if (scope === "allGrades" || scope === "everything") {
    groups.push(
      buildGradeGroup({
        school,
        grades: school.grades,
        schedule,
        days,
      })
    );
  }

  if (scope === "allTeachers" || scope === "everything") {
    groups.push(
      buildTeacherGroup({
        school,
        teachers,
        schedule,
        days,
      })
    );
  }

  const cleanGroups = groups.filter((group) => group.days.length > 0);

  return {
    title: "Clarity School Timetable",
    filename: buildExportFilename({ scope, dayRange, viewMode, selectedDay }),
    groups: cleanGroups,
  };
};

const buildGradeGroup = ({ school, grades, schedule, days }) => ({
  title: "Grade Timetables",
  rowHeader: "Grade",
  days: days.map((day) => {
    const periods = buildPeriods(school.periodsPerDay[day]);

    return {
      day,
      periods,
      rows: grades.map((grade) => {
        const gradeName = grade.name || `Grade ${grade.id}`;
        const lessons = getSelectedGradeLessons({
          schedule,
          day,
          gradeId: grade.id,
          periodsCount: periods.length,
        });

        return {
          label: gradeName,
          cells: lessons.map(({ lesson }) => ({
            grade: gradeName,
            teacher: lesson?.teacherName || "",
            subject: lesson?.subject || "",
            lines: lesson ? [lesson.teacherName, lesson.subject] : [],
          })),
        };
      }),
    };
  }),
});

const buildTeacherGroup = ({ school, teachers, schedule, days }) => ({
  title: "Teacher Timetables",
  rowHeader: "Teacher",
  days: days.map((day) => {
    const periods = buildPeriods(school.periodsPerDay[day]);

    return {
      day,
      periods,
      rows: teachers.map((teacher) => {
        const teacherName = teacher.name || `Teacher ${teacher.id}`;
        const lessons = getSelectedTeacherLessons({
          schedule,
          day,
          teacherId: teacher.id,
          periodsCount: periods.length,
          grades: school.grades,
        });

        return {
          label: teacherName,
          cells: lessons.map(({ lesson }) => ({
            grade: lesson?.gradeName || "",
            teacher: teacherName,
            subject: lesson?.subject || "",
            lines: lesson ? [lesson.gradeName, lesson.subject] : [],
          })),
        };
      }),
    };
  }),
});

const downloadTimetableDocx = async ({ title, filename, groups }) => {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    HeightRule,
    HeadingLevel,
    PageOrientation,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableLayoutType,
    TableRow,
    TextRun,
    VerticalAlignTable,
    WidthType,
  } = await import("docx");
  const document = new Document({
    title,
    creator: "Clarity School",
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: 720,
              right: 420,
              bottom: 720,
              left: 420,
            },
          },
        },
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
            keepNext: true,
            keepLines: true,
          }),
          new Paragraph({
            text: "Generated timetable export",
            keepNext: true,
            keepLines: true,
          }),
          ...buildDocxGroupChildren({
            groups,
            AlignmentType,
            BorderStyle,
            HeadingLevel,
            HeightRule,
            ShadingType,
            Table,
            TableCell,
            TableLayoutType,
            TableRow,
            TextRun,
            VerticalAlignTable,
            WidthType,
            Paragraph,
          }),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(document);

  downloadBlob({ blob, filename, extension: "docx" });
};

const printTimetablePdf = ({ title, filename, groups }) => {
  const html = buildTimetableHtmlDocument({
    title,
    groups,
    mode: "pdf",
  });
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    downloadBlob({
      blob: new Blob([html], { type: "text/html;charset=utf-8" }),
      filename: `${filename}-print`,
      extension: "html",
    });
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
  }, 300);
};

const downloadTimetableExcel = ({ title, filename, groups }) => {
  const html = buildTimetableHtmlDocument({
    title,
    groups,
    mode: "excel",
  });

  downloadBlob({
    blob: new Blob([`\uFEFF${html}`], {
      type: "application/vnd.ms-excel;charset=utf-8",
    }),
    filename,
    extension: "xls",
  });
};

const buildTimetableHtmlDocument = ({ title, groups, mode }) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page {
        size: A4 landscape;
        margin: 10mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #0f172a;
        font-family: Arial, Helvetica, sans-serif;
      }

      .document-title {
        margin: 0 0 14px;
        font-size: 22px;
        font-weight: 700;
      }

      .group-title {
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 700;
      }

      .day-title {
        margin: 0 0 8px;
        font-size: 14px;
        font-weight: 700;
      }

      .timetable-page {
        break-after: page;
        page-break-after: always;
        page-break-inside: avoid;
      }

      .timetable-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      thead {
        display: table-header-group;
      }

      tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      th,
      td {
        border: 1px solid #cbd5e1;
        padding: 6px 5px;
        text-align: center;
        vertical-align: middle;
        font-size: 10px;
        line-height: 1.25;
      }

      th {
        background: #1f4e79;
        color: #ffffff;
        font-weight: 700;
      }

      .row-header {
        width: 110px;
        background: #eaf2f8;
        color: #0f172a;
        font-weight: 700;
      }

      .lesson-cell {
        background: #ffffff;
      }

      .empty-cell {
        background: #f8fafc;
        color: #94a3b8;
      }

      .lesson-main {
        font-weight: 700;
      }

      .lesson-sub {
        margin-top: 2px;
        color: #475569;
      }

      ${mode === "excel" ? ".timetable-page { margin-bottom: 18px; }" : ""}
    </style>
  </head>
  <body>
    <h1 class="document-title">${escapeHtml(title)}</h1>
    ${groups.map(buildHtmlGroupTables).join("")}
  </body>
</html>`;

const buildHtmlGroupTables = (group) =>
  group.days
    .map(
      (dayTable) => `
        <section class="timetable-page">
          <h2 class="group-title">${escapeHtml(group.title)}</h2>
          <h3 class="day-title">${escapeHtml(dayTable.day)}</h3>
          ${buildHtmlDayTable({ dayTable, rowHeader: group.rowHeader })}
        </section>
      `
    )
    .join("");

const buildHtmlDayTable = ({ dayTable, rowHeader }) => `
  <table>
    <thead>
      <tr>
        <th class="row-header">${escapeHtml(rowHeader)}</th>
        ${dayTable.periods
          .map((period) => `<th>Period ${escapeHtml(period)}</th>`)
          .join("")}
      </tr>
    </thead>
    <tbody>
      ${dayTable.rows
        .map(
          (row) => `
            <tr>
              <td class="row-header">${escapeHtml(row.label)}</td>
              ${row.cells.map(buildHtmlLessonCell).join("")}
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

const buildHtmlLessonCell = (cell) => {
  if (!cell.lines.length) {
    return '<td class="empty-cell">&nbsp;</td>';
  }

  return `
    <td class="lesson-cell">
      <div class="lesson-main">${escapeHtml(cell.lines[0])}</div>
      <div class="lesson-sub">${escapeHtml(cell.lines[1] || "")}</div>
    </td>
  `;
};

const buildDocxGroupChildren = ({
  groups,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  HeightRule,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlignTable,
  WidthType,
  Paragraph,
}) =>
  groups.flatMap((group, groupIndex) => [
    new Paragraph({
      text: group.title,
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: groupIndex > 0,
      keepNext: true,
      keepLines: true,
      spacing: {
        before: groupIndex > 0 ? 0 : 180,
        after: 120,
      },
    }),
    ...group.days.flatMap((dayTable, dayIndex) => [
      new Paragraph({
        text: dayTable.day,
        heading: HeadingLevel.HEADING_2,
        pageBreakBefore: dayIndex > 0,
        keepNext: true,
        keepLines: true,
        spacing: {
          before: dayIndex > 0 ? 0 : 80,
          after: 100,
        },
      }),
      buildDocxMatrixTable({
        dayTable,
        rowHeader: group.rowHeader,
        AlignmentType,
        BorderStyle,
        HeightRule,
        ShadingType,
        Table,
        TableCell,
        TableLayoutType,
        TableRow,
        TextRun,
        VerticalAlignTable,
        WidthType,
        Paragraph,
      }),
      new Paragraph({
        text: "",
        keepLines: true,
        spacing: {
          after: 80,
        },
      }),
    ]),
  ]);

const buildDocxMatrixTable = ({
  dayTable,
  rowHeader,
  AlignmentType,
  BorderStyle,
  HeightRule,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlignTable,
  WidthType,
  Paragraph,
}) => {
  const periodWidth = Math.floor(
    (DOCX_CONTENT_WIDTH - DOCX_ROW_HEADER_WIDTH) /
      Math.max(dayTable.periods.length, 1)
  );
  const border = buildDocxTableBorder(BorderStyle);

  return new Table({
    style: "TableGrid",
    layout: TableLayoutType.FIXED,
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        cantSplit: true,
        tableHeader: true,
        height: {
          value: 420,
          rule: HeightRule.ATLEAST,
        },
        children: [
          buildDocxCell({
            lines: [rowHeader],
            bold: true,
            fill: DOCX_COLORS.headerFill,
            textColor: DOCX_COLORS.headerText,
            width: DOCX_ROW_HEADER_WIDTH,
            AlignmentType,
            ShadingType,
            TableCell,
            TextRun,
            VerticalAlignTable,
            WidthType,
            Paragraph,
          }),
          ...dayTable.periods.map((period) =>
            buildDocxCell({
              lines: [`Period ${period}`],
              bold: true,
              fill: DOCX_COLORS.headerFill,
              textColor: DOCX_COLORS.headerText,
              width: periodWidth,
              AlignmentType,
              ShadingType,
              TableCell,
              TextRun,
              VerticalAlignTable,
              WidthType,
              Paragraph,
            })
          ),
        ],
      }),
      ...dayTable.rows.map(
        (row) =>
          new TableRow({
            cantSplit: true,
            height: {
              value: 520,
              rule: HeightRule.ATLEAST,
            },
            children: [
              buildDocxCell({
                lines: [row.label],
                bold: true,
                fill: DOCX_COLORS.rowHeaderFill,
                width: DOCX_ROW_HEADER_WIDTH,
                AlignmentType,
                ShadingType,
                TableCell,
                TextRun,
                VerticalAlignTable,
                WidthType,
                Paragraph,
              }),
              ...row.cells.map((cell) =>
                buildDocxCell({
                  lines: cell.lines,
                  emphasizeFirstLine: true,
                  fill: cell.lines.length
                    ? "FFFFFF"
                    : DOCX_COLORS.emptyFill,
                  width: periodWidth,
                  AlignmentType,
                  ShadingType,
                  TableCell,
                  TextRun,
                  VerticalAlignTable,
                  WidthType,
                  Paragraph,
                })
              ),
            ],
          })
      ),
    ],
  });
};

const buildDocxCell = ({
  lines,
  bold = false,
  emphasizeFirstLine = false,
  fill = "FFFFFF",
  textColor = DOCX_COLORS.lessonText,
  width,
  AlignmentType,
  ShadingType,
  TableCell,
  TextRun,
  VerticalAlignTable,
  WidthType,
  Paragraph,
}) =>
  new TableCell({
    margins: DOCX_CELL_MARGINS,
    shading: {
      type: ShadingType.CLEAR,
      fill,
      color: "auto",
    },
    verticalAlign: VerticalAlignTable.CENTER,
    ...(width
      ? {
          width: {
            size: width,
            type: WidthType.DXA,
          },
        }
      : {}),
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 40,
          after: 40,
        },
        children: buildDocxTextRuns({
          lines,
          bold,
          emphasizeFirstLine,
          textColor,
          TextRun,
        }),
      }),
    ],
  });

const buildDocxTextRuns = ({
  lines,
  bold,
  emphasizeFirstLine,
  textColor,
  TextRun,
}) => {
  if (!lines?.length) {
    return [new TextRun("")];
  }

  return lines.map(
    (line, index) =>
      new TextRun({
        text: String(line || ""),
        bold: bold || (emphasizeFirstLine && index === 0),
        color: index === 0 ? textColor : DOCX_COLORS.mutedText,
        size: index === 0 ? 18 : 17,
        ...(index > 0 ? { break: 1 } : {}),
      })
  );
};

const buildDocxTableBorder = (BorderStyle) => ({
  style: BorderStyle.SINGLE,
  color: DOCX_COLORS.border,
  size: 4,
});

const buildPeriods = (periodsCount) =>
  Array.from({ length: Number(periodsCount || 0) }, (_, index) => index + 1);

const downloadBlob = ({ blob, filename, extension }) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFilename(filename)}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const buildExportFilename = ({ scope, dayRange, viewMode, selectedDay }) =>
  [
    "timetable",
    scope === "current" ? viewMode : scope,
    dayRange === "all" ? "all-days" : selectedDay,
  ].join("-");

const sanitizeFilename = (value) =>
  String(value || "timetable")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
