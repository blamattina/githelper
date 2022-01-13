export const diffDateString = (a: string, b: string): string => {
  if (!a || !b) return '';
  const diffInMilies = new Date(a).getTime() - new Date(b).getTime();
  const inDays = diffInMilies / 1000 / 60 / 60;
  return inDays.toFixed(2);
};
