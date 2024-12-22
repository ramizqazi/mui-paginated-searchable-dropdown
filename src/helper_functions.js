
export const getCamelCaseWord = (word) => {
  if (!word) {
    return "";
  }
  const safeWord = String(word) || "";

  if (safeWord?.includes("By AI")) {
    return safeWord;
  }

  return `${safeWord[0].toUpperCase()}${safeWord.slice(1).toLowerCase()}`?.replace('_', " ");
};
