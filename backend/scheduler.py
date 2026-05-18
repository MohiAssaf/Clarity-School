def generate_basic_schedule(payload):
    school = payload["school"]
    grades = [grade["id"] for grade in school["grades"]]
    days = school["days"]
    periods_per_day = school["periodsPerDay"]
    assignments = payload["assignments"]

    schedule = initialize_schedule(days, grades, periods_per_day)
    teacher_busy_slots = set()
    unplaced = []
    placed_count = 0

    lessons = expand_assignments(assignments)

    for lesson in lessons:
        slot = find_available_slot(
            lesson=lesson,
            schedule=schedule,
            days=days,
            periods_per_day=periods_per_day,
            teacher_busy_slots=teacher_busy_slots,
        )

        if slot is None:
            unplaced.append(
                {
                    "assignmentId": lesson["assignmentId"],
                    "teacherId": lesson["teacherId"],
                    "teacherName": lesson["teacherName"],
                    "grade": lesson["grade"],
                    "subject": lesson["subject"],
                    "occurrence": lesson["occurrence"],
                    "reason": "No grade and teacher free slot was available.",
                }
            )
            continue

        day, period = slot
        grade_key = str(lesson["grade"])
        period_key = str(period)
        schedule[day][grade_key][period_key] = {
            "assignmentId": lesson["assignmentId"],
            "teacherId": lesson["teacherId"],
            "teacherName": lesson["teacherName"],
            "subject": lesson["subject"],
            "grade": lesson["grade"],
        }
        teacher_busy_slots.add((lesson["teacherId"], day, period))
        placed_count += 1

    return {
        "schedule": schedule,
        "unplaced": unplaced,
        "metadata": {
            "requestedLessons": len(lessons),
            "placedLessons": placed_count,
            "unplacedLessons": len(unplaced),
        },
    }


def initialize_schedule(days, grades, periods_per_day):
    schedule = {}

    for day in days:
        schedule[day] = {}
        for grade in grades:
            schedule[day][str(grade)] = {
                str(period): None for period in range(1, periods_per_day[day] + 1)
            }

    return schedule


def expand_assignments(assignments):
    lessons = []
    teacher_loads = {}

    for assignment in assignments:
        teacher_id = assignment["teacherId"]
        teacher_loads[teacher_id] = (
            teacher_loads.get(teacher_id, 0) + assignment["frequency"]
        )

    for assignment_index, assignment in enumerate(assignments):
        for occurrence in range(1, assignment["frequency"] + 1):
            lessons.append(
                {
                    "assignmentId": assignment["id"],
                    "assignmentIndex": assignment_index,
                    "teacherId": assignment["teacherId"],
                    "teacherName": assignment["teacherName"],
                    "grade": assignment["grade"],
                    "subject": assignment["subject"],
                    "occurrence": occurrence,
                }
            )

    return sorted(
        lessons,
        key=lambda lesson: (
            -teacher_loads[lesson["teacherId"]],
            lesson["occurrence"],
            lesson["assignmentIndex"],
        ),
    )


def find_available_slot(
    lesson,
    schedule,
    days,
    periods_per_day,
    teacher_busy_slots,
):
    candidate_slots = build_candidate_slots(
        days=days,
        periods_per_day=periods_per_day,
        assignment_index=lesson["assignmentIndex"],
        occurrence=lesson["occurrence"],
    )

    for day, period in candidate_slots:
        grade_key = str(lesson["grade"])
        period_key = str(period)

        if schedule[day][grade_key][period_key] is not None:
            continue

        if (lesson["teacherId"], day, period) in teacher_busy_slots:
            continue

        return day, period

    return None


def build_candidate_slots(days, periods_per_day, assignment_index, occurrence):
    slots = [
        (day, period)
        for day in days
        for period in range(1, periods_per_day[day] + 1)
    ]

    if not slots:
        return []

    offset = (occurrence - 1 + assignment_index) % len(slots)
    return slots[offset:] + slots[:offset]
