const formatTime = (dateString: string, timeZone: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
    timeZoneName: "short", // Optional: includes the time zone abbreviation (e.g., EST, GMT)
  };

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const formatDate = (dateString: string, timeZone: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone,
    timeZoneName: "short", // Optional: includes the time zone abbreviation (e.g., EST, GMT)
  };

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const timeZoneMap: Record<string, string> = {
  EST: "America/New_York",
  HONDURAS: "America/Tegucigalpa",
  PHILIPPINES: "Asia/Manila",
};

const convertToISO = (dateTime: string, timeZone: string): string => {
  const date = new Date(dateTime);
  const dateInTimeZone = new Date(date.toLocaleString("en-US", { timeZone: timeZoneMap[timeZone] }));
  return dateInTimeZone.toISOString();
};

export { formatTime, formatDate, timeZoneMap, convertToISO };


