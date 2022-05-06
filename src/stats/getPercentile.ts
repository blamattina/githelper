export function getPercentile(numberArray: number[], percentile: number) {
  percentile = percentile / 100;

  numberArray.sort(function (a, b) {
    return a - b;
  });

  var p = (numberArray.length - 1) * percentile;
  var b = Math.floor(p);
  var remainder = p - b;

  if (numberArray[b + 1] !== undefined) {
    return numberArray[b] + remainder * (numberArray[b + 1] - numberArray[b]);
  } else {
    return numberArray[b];
  }
}
