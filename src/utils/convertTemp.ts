export const convertTemp = (temp: number, isCelsius: boolean): number => {
  return isCelsius
    ? temp
    : temp * 9/5 + 32;
};