export const MAX_ACCEPTABLE_TRAVEL_MINUTES = 45;

/** Adds minutes to a "HH:mm" time string, returns "HH:mm". */
export function addMinutes(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/** Extracts the hour (0-23) from a "HH:mm" string. */
export function hourOf(time) {
  return Number(time.split(":")[0]);
}

/** True if [openHour, closeHour) fully contains the visit at `time` for `durationMin`. */
export function isOpenDuring(place, time, durationMin) {
  const startHour = hourOf(time);
  const endTime = addMinutes(time, durationMin);
  const endHour = hourOf(endTime) === 0 ? 24 : hourOf(endTime);
  return startHour >= place.openHour && endHour <= place.closeHour;
}
