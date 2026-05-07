export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-');
};
