export function disambiguateLabel(key, value) {
  switch (key) {
    case "type":
      return value.map((val) => `type: ${val}`).join(", ");
    case "tone":
      return value.map((val) => `tone: ${val}`).join(", ");
    default:
      return value;
  }
}

// Function to check if a value is empty (for filter logic)
export function isEmpty(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "" || value == null;
  }
}

// Helper function for simulating asynchronous operations
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
