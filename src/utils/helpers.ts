export const abbreviateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "…";
  }
  return text;
};

export const formatDateValue = (value: any): string | null => {
  if (value instanceof Date) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return value.toLocaleDateString("en-US", options);
  }
  return null;
};
