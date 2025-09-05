export const convertTemp = (temp: number, isCelsius: boolean): string => {
  return isCelsius
    ? `${Math.round(temp)}`
    : `${Math.round(temp * 9/5 + 32)}`;
};