from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn


ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def create_app():
    app = FastAPI(
        title="Clarity School Scheduler API",
        description="Scheduler API scaffold for the school timetable generator.",
        version="0.1.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health_check():
        return {"status": "ok", "service": "clarity-school-scheduler"}

    @app.post("/api/schedules/generate")
    async def generate_schedule(request: Request):
        try:
            payload = await request.json()
        except ValueError:
            payload = None

        errors = validate_scheduler_payload(payload)

        if errors:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "errors": errors},
            )

        return {
            "status": "ok",
            "message": "Scheduler API scaffold connected. Real scheduling is not implemented yet.",
            "received": build_request_summary(payload),
        }

    return app


def validate_scheduler_payload(payload):
    errors = []

    if not isinstance(payload, dict):
        return ["Request body must be a JSON object."]

    school = payload.get("school")
    teachers = payload.get("teachers")
    subjects = payload.get("subjects")
    assignments = payload.get("assignments")

    if not isinstance(school, dict):
        errors.append("school must be an object.")
    if not isinstance(teachers, list) or len(teachers) == 0:
        errors.append("teachers must be a non-empty list.")
    if not isinstance(subjects, list) or len(subjects) == 0:
        errors.append("subjects must be a non-empty list.")
    if not isinstance(assignments, list) or len(assignments) == 0:
        errors.append("assignments must be a non-empty list.")

    if errors:
        return errors

    grades = school.get("grades")
    days = school.get("days")
    periods_per_day = school.get("periodsPerDay")

    if not isinstance(grades, list) or len(grades) == 0:
        errors.append("school.grades must be a non-empty list.")
    if not isinstance(days, list) or len(days) == 0:
        errors.append("school.days must be a non-empty list.")
    if not isinstance(periods_per_day, dict) or len(periods_per_day) == 0:
        errors.append("school.periodsPerDay must be a non-empty object.")

    if errors:
        return errors

    grade_ids = {grade.get("id") for grade in grades if isinstance(grade, dict)}
    teacher_ids = {
        teacher.get("id") for teacher in teachers if isinstance(teacher, dict)
    }
    subject_names = {
        normalize_text(subject.get("name"))
        for subject in subjects
        if isinstance(subject, dict)
    }

    for day in days:
        periods = periods_per_day.get(day)
        if not is_positive_int(periods):
            errors.append(f"school.periodsPerDay.{day} must be a positive integer.")

    total_class_slots = int_or_zero(school.get("totalClassSlots"))
    total_requested_periods = 0

    for index, assignment in enumerate(assignments, start=1):
        if not isinstance(assignment, dict):
            errors.append(f"assignments[{index}] must be an object.")
            continue

        teacher_id = assignment.get("teacherId")
        grade = assignment.get("grade")
        subject = normalize_text(assignment.get("subject"))
        frequency = assignment.get("frequency")

        if teacher_id not in teacher_ids:
            errors.append(f"assignments[{index}].teacherId does not match a teacher.")
        if grade not in grade_ids:
            errors.append(f"assignments[{index}].grade does not match a grade.")
        if subject not in subject_names:
            errors.append(f"assignments[{index}].subject does not match a subject.")
        if not is_positive_int(frequency):
            errors.append(f"assignments[{index}].frequency must be a positive integer.")
        else:
            total_requested_periods += frequency

    if total_class_slots > 0 and total_requested_periods > total_class_slots:
        errors.append("Total requested periods exceed available class slots.")

    return errors


def build_request_summary(payload):
    school = payload["school"]
    assignments = payload["assignments"]

    return {
        "grades": len(school["grades"]),
        "days": len(school["days"]),
        "teachers": len(payload["teachers"]),
        "subjects": len(payload["subjects"]),
        "assignments": len(assignments),
        "totalPeriodsPerWeek": school.get("totalPeriodsPerWeek"),
        "totalClassSlots": school.get("totalClassSlots"),
        "totalRequestedPeriods": sum(
            assignment.get("frequency", 0) for assignment in assignments
        ),
    }


def is_positive_int(value):
    return isinstance(value, int) and not isinstance(value, bool) and value > 0


def int_or_zero(value):
    return value if isinstance(value, int) and not isinstance(value, bool) else 0


def normalize_text(value):
    return str(value or "").strip().lower()


app = create_app()


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
