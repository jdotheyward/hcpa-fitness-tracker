// Calendar helpers. All dates are local-time "YYYY-MM-DD" strings so stored
// history is independent of timezone and locale formatting.

const pad = (n) => String(n).padStart(2, "0");

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isISODate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseISO(value).getTime());
}

export function addDays(iso, days) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

// 0 = Monday … 6 = Sunday
export function weekdayIndex(iso) {
  return (parseISO(iso).getDay() + 6) % 7;
}

export function startOfWeek(iso) {
  return addDays(iso, -weekdayIndex(iso));
}

export function daysBetween(fromIso, toIso) {
  // Round to absorb DST hour shifts.
  return Math.round((parseISO(toIso) - parseISO(fromIso)) / 86400000);
}

// 1-based program week for a date; values below 1 are before the program started.
export function programWeek(programStart, iso) {
  return Math.floor(daysBetween(startOfWeek(programStart), startOfWeek(iso)) / 7) + 1;
}

export function todayISO() {
  return toISO(new Date());
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatShort(iso) {
  const d = parseISO(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatLong(iso) {
  const d = parseISO(iso);
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatWeekRange(weekStart) {
  return `${formatShort(weekStart)} – ${formatShort(addDays(weekStart, 6))}`;
}
