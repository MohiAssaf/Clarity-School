def generate_basic_schedule(payload):
    school = payload["school"]
    grades = [grade["id"] for grade in school["grades"]]
    days = school["days"]
    periods_per_day = school["periodsPerDay"]
    assignments = payload["assignments"]
    lessons = expand_assignments(assignments)

    distributed_result = build_schedule(
        lessons=lessons,
        days=days,
        grades=grades,
        periods_per_day=periods_per_day,
        prefer_distribution=True,
    )
    fallback_result = build_schedule(
        lessons=lessons,
        days=days,
        grades=grades,
        periods_per_day=periods_per_day,
        prefer_distribution=False,
    )

    if len(distributed_result["unplaced"]) <= len(fallback_result["unplaced"]):
        return distributed_result

    return fallback_result


def build_schedule(lessons, days, grades, periods_per_day, prefer_distribution):
    schedule = initialize_schedule(days, grades, periods_per_day)
    teacher_busy_slots = set()
    unplaced = []
    placed_count = 0

    for lesson in lessons:
        slot = find_available_slot(
            lesson=lesson,
            schedule=schedule,
            days=days,
            periods_per_day=periods_per_day,
            teacher_busy_slots=teacher_busy_slots,
            prefer_distribution=prefer_distribution,
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
    prefer_distribution,
):
    candidate_slots = build_candidate_slots(
        days=days,
        periods_per_day=periods_per_day,
        assignment_index=lesson["assignmentIndex"],
        occurrence=lesson["occurrence"],
    )

    scored_slots = []

    for slot_index, (day, period) in enumerate(candidate_slots):
        grade_key = str(lesson["grade"])
        period_key = str(period)

        if schedule[day][grade_key][period_key] is not None:
            continue

        if (lesson["teacherId"], day, period) in teacher_busy_slots:
            continue

        if not prefer_distribution:
            return day, period

        scored_slots.append(
            (
                score_slot(
                    lesson=lesson,
                    schedule=schedule,
                    day=day,
                    period=period,
                ),
                slot_index,
                day,
                period,
            )
        )

    if scored_slots:
        _, _, day, period = min(scored_slots)
        return day, period

    return None


def score_slot(lesson, schedule, day, period):
    grade_key = str(lesson["grade"])
    subject_repeats_on_day = count_grade_subject_on_day(
        schedule=schedule,
        day=day,
        grade_key=grade_key,
        subject=lesson["subject"],
    )
    teacher_lessons_on_day = count_teacher_lessons_on_day(
        schedule=schedule,
        day=day,
        teacher_id=lesson["teacherId"],
    )
    grade_lessons_on_day = count_grade_lessons_on_day(
        schedule=schedule,
        day=day,
        grade_key=grade_key,
    )

    return (
        subject_repeats_on_day * 1000
        + teacher_lessons_on_day * 20
        + grade_lessons_on_day * 5
        + period
    )


def count_grade_subject_on_day(schedule, day, grade_key, subject):
    return sum(
        1
        for lesson in schedule[day][grade_key].values()
        if lesson is not None and lesson["subject"] == subject
    )


def count_teacher_lessons_on_day(schedule, day, teacher_id):
    return sum(
        1
        for grade_schedule in schedule[day].values()
        for lesson in grade_schedule.values()
        if lesson is not None and lesson["teacherId"] == teacher_id
    )


def count_grade_lessons_on_day(schedule, day, grade_key):
    return sum(
        1 for lesson in schedule[day][grade_key].values() if lesson is not None
    )


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
