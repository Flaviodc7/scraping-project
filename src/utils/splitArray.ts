export const splitArray = (array: string[], size: number) => {
  const arrayWithNoDuplicates = Array.from(new Set(array));
  const splitedArray = [];
  for (let i = 0; i < arrayWithNoDuplicates.length; i += size) {
    splitedArray.push(arrayWithNoDuplicates.slice(i, i + size));
  }
  return splitedArray;
};
