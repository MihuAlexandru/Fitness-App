export function formatDateDDMMMYYYY(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" })
    .format(date)
    .replace(".", "");
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
