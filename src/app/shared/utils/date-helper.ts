export default class DateHelper {
  static formatDate(d: Date) {
    let minutes =
        d.getMinutes().toString().length == 1
          ? "0" + d.getMinutes()
          : d.getMinutes(),
      hours =
        d.getHours().toString().length == 1 ? "0" + d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? "pm" : "am",
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      months[d.getMonth()] +
      " " +
      d.getDate() +
      " " +
      d.getFullYear() +
      " " +
      hours +
      ":" +
      minutes +
      ampm
    );
  }
}
