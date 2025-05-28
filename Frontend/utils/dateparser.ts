

export const parseDate = (date: string): string => {
  const dateObj = new Date(date);
  const months = [
    "Tammikuuta",
    "Helmikuuta",
    "Maaliskuuta",
    "Huhtikuuta",
    "Toukokuuta",
    "Kesäkuuta",
    "Heinäkuuta",
    "Elokuuta",
    "Syyskuuta",
    "Lokakuuta",
    "Marraskuuta",
    "Joulukuuta",
  ];

  return `${dateObj.getDate()}. ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
};

export const getDateAndWeekday = (date: string): string => {
  const dateObj = new Date(date);
  const weekdays = [
    "su",
    "ma",
    "ti",
    "ke",
    "to",
    "pe",
    "la",
  ];
  return `${weekdays[dateObj.getDay()]} ${dateObj.getDate()}.${dateObj.getMonth() + 1}.`;
};


export const parseGameTime = (time: string): string => {
  const date = new Date(time);  
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.getDate()}.${date.getMonth() + 1} klo: ${date.getHours()}:${minutes}`;
};

export const formatDate = (date: Date): string => {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};


export const parseDateString = (date: string): string => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  return `${day}.${month}.${dateObj.getFullYear()}`;
};

export const parseTime = (date: string): string => {
  const dateObj = new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatInstagramDate = (timestamp: number): string => {
   const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);
  return date.toLocaleString("fi-FI", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  });
};
