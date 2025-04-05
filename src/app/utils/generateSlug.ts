/* eslint-disable no-useless-escape */
export const generateSlug = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[:,.\/\\'"]/g, '') 
    .replace(/\s+/g, '-');
};
