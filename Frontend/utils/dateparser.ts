

export const parseDate = (date: Date): string => {
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

  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

