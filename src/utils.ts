export const getMedian = (arr: number[]): number => {
  const copy = [...arr].sort((a, b) => a - b);
  const midpoint = Math.floor(copy.length / 2);

  const median =
    copy.length % 2 === 1
      ? copy[midpoint]
      : (copy[midpoint - 1] + copy[midpoint]) / 2;

  return median;
};

export const toFixed = (num: number, precision: number): number => {
  return +num.toFixed(precision);
};
