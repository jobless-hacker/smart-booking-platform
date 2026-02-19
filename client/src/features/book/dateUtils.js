export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function toDateKey(dateValue) {
  return new Date(dateValue).toISOString().slice(0, 10);
}

export function toDisplayDate(dateKey) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export function toMonthLabel(monthCursor) {
  return monthCursor.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
}

function toDateTimeParts(dateValue, startTime) {
  const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(String(dateValue)) ? String(dateValue) : toDateKey(dateValue);
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hoursText = "0", minutesText = "0"] = String(startTime || "00:00").split(":");
  const hours = Number.parseInt(hoursText, 10);
  const minutes = Number.parseInt(minutesText, 10);

  return new Date(
    year,
    month - 1,
    day,
    Number.isNaN(hours) ? 0 : hours,
    Number.isNaN(minutes) ? 0 : minutes
  );
}

export function toAppointmentDateTimeLabel(dateValue, startTime) {
  const dateTime = toDateTimeParts(dateValue, startTime);

  const dayLabel = dateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const timeLabel = dateTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  return `${dayLabel}, at ${timeLabel}`;
}

export function buildMonthCells(monthCursor) {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lead = first.getDay();
  const cells = [];

  for (let i = 0; i < lead; i += 1) {
    cells.push({ type: "empty", key: `lead-${i}` });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cellDate = new Date(year, month, day);
    cells.push({
      type: "day",
      key: toDateKey(cellDate),
      day
    });
  }

  return cells;
}
