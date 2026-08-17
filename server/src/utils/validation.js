const ALLOWED_INTERESTS = [
  "nature",
  "culture",
  "adventure",
  "food",
];

const ALLOWED_TRIGGERS = [
  "weather",
  "closure",
  "travel-time",
  "budget",
  "add-place",
  "delay",
  "auto",
];

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateGenerateBody(body) {
  const errors = [];

  const {
    destination,
    days,
    people,
    budget,
    interests,
  } = body || {};

  // Required destination
  if (typeof destination !== "string" || !destination.trim()) {
    errors.push("destination must be a non-empty string.");
  }

  // Days: 1-14
  if (!Number.isInteger(days) || days < 1 || days > 14) {
    errors.push("days must be an integer between 1 and 14.");
  }

  // People: 1-20
  if (!Number.isInteger(people) || people < 1 || people > 20) {
    errors.push("people must be an integer between 1 and 20.");
  }

  // Budget: greater than 0
  if (!isNumber(budget) || budget <= 0) {
    errors.push("budget must be a number greater than 0.");
  }

  // Interests
  if (interests !== undefined) {
    if (!Array.isArray(interests)) {
      errors.push("interests must be an array.");
    } else {
      const invalidInterests = interests.filter(
        (interest) =>
          typeof interest !== "string" ||
          !ALLOWED_INTERESTS.includes(interest)
      );

      if (invalidInterests.length > 0) {
        errors.push(
          `invalid interests: ${invalidInterests.join(", ")}. Allowed interests: ${ALLOWED_INTERESTS.join(", ")}.`
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateReplanBody(body) {
  const errors = [];

  const {
    itinerary,
    places,
    weather,
    people,
    budget,
    trigger,
  } = body || {};

  // Itinerary
  if (!Array.isArray(itinerary)) {
    errors.push("itinerary must be an array.");
  }

  // Optional places
  if (places !== undefined && !Array.isArray(places)) {
    errors.push("places must be an array.");
  }

  // Optional weather
  if (weather !== undefined && !Array.isArray(weather)) {
    errors.push("weather must be an array.");
  }

  // People
  if (
    people !== undefined &&
    (!Number.isInteger(people) || people < 1 || people > 20)
  ) {
    errors.push("people must be an integer between 1 and 20.");
  }

  // Budget
  if (
    budget !== undefined &&
    (!isNumber(budget) || budget < 0)
  ) {
    errors.push("budget must be a number greater than or equal to 0.");
  }

  // Trigger
  if (!trigger || typeof trigger !== "object") {
    errors.push("trigger is required and must be an object.");
  } else {
    const triggerType = trigger.type;

    if (!ALLOWED_TRIGGERS.includes(triggerType)) {
      errors.push(
        `invalid trigger.type. Allowed values: ${ALLOWED_TRIGGERS.join(", ")}.`
      );
    }

    // Closure requires closedPlaceId
    if (triggerType === "closure") {
      if (
        typeof trigger.closedPlaceId !== "string" ||
        !trigger.closedPlaceId.trim()
      ) {
        errors.push(
          "closedPlaceId is required for closure trigger."
        );
      }
    }

    // Add-place requires newPlace
    if (triggerType === "add-place") {
      if (
        !trigger.newPlace ||
        typeof trigger.newPlace !== "object"
      ) {
        errors.push(
          "newPlace is required for add-place trigger."
        );
      }
    }

    // Delay requires dayNumber and delayMinutes
    if (triggerType === "delay") {
      if (
        !Number.isInteger(trigger.dayNumber) ||
        trigger.dayNumber < 1
      ) {
        errors.push(
          "dayNumber must be a positive integer for delay trigger."
        );
      }

      if (
        !Number.isInteger(trigger.delayMinutes) ||
        trigger.delayMinutes <= 0
      ) {
        errors.push(
          "delayMinutes must be a positive integer for delay trigger."
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}