// export const formatDateShort = (dt: number): string => {
//   const date = new Date(dt * 1000);

//   const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
//   const day = date.getDate();

//   const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

//   return `${capitalize(weekday)}, ${day}`;
// };

export const formatDateShort = (dt: number): string => {
  const date = new Date(dt * 1000);

  const weekday = date.toLocaleDateString("ru-RU", {
    weekday: "long",
  });

  const day = date.getDate();
  const month = date.toLocaleDateString("ru-RU", {
    month: "short",
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return `${capitalize(weekday)}, ${day} ${month}`;
}