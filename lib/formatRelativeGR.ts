export function formatRelativeGR(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - inputDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return "μόλις τώρα";
  } else if (diffMin < 60) {
    return `${diffMin} λεπτά πριν`;
  } else if (diffHours < 24) {
    return `${diffHours} ώρες πριν`;
  } else if (diffDays < 7) {
    return `${diffDays} μέρες πριν`;
  } else {
    // For older dates, return a static format (e.g. "23 Ιουλίου")
    const day = inputDate.getDate();
    const month = inputDate.toLocaleString("el-GR", { month: "long" });
    return `${day} ${month}`;
  }
}
