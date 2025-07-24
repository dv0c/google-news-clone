const greekDays = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];

const greekMonths = [
  "Ιανουαρίου",
  "Φεβρουαρίου",
  "Μαρτίου",
  "Απριλίου",
  "Μαΐου",
  "Ιουνίου",
  "Ιουλίου",
  "Αυγούστου",
  "Σεπτεμβρίου",
  "Οκτωβρίου",
  "Νοεμβρίου",
  "Δεκεμβρίου",
];

export function formatDateGR(dateInput?: Date | string): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const dayName = greekDays[date.getDay()];
  const day = date.getDate();
  const monthName = greekMonths[date.getMonth()];

  return `${dayName} ${day} ${monthName}`;
}
