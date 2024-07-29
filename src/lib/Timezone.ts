export const formatISOForTimeZone = (date: Date, timeZone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    'en-US',
    options,
  );
  const formatted: string = formatter.format(date);

  const utcDate = new Date(`${formatted}`);
  return utcDate.toISOString();
};

export const formatDateForTimeZone = (date: Date, timeZone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    'en-US',
    options,
  );
  return formatter.format(date);
};

export const formatTimeForTimeZone = (date: Date, timeZone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    'en-US',
    options,
  );
  return formatter.format(date);
};