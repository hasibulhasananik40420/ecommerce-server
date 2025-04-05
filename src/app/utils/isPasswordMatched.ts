

import bcrypt from 'bcrypt';

export const isPasswordMatched = (
  oldPassword: string,
  hashPassword: string,
) => {
  bcrypt.compare(oldPassword, hashPassword);
};
