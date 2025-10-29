export const defaultAvatarByName = (name: string): string => {
  const init = name.split(" ");
  const firstChar = init[init.length - 1].charAt(0) || "U";

  return firstChar.toUpperCase();
};
