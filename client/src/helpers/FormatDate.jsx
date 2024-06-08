export default function FormatDate(toFormat) {
  const splitted = toFormat.split("T");

  const date = splitted[0];
  const time = splitted[1].split(".")[0];

  return date + " " + time;
}
