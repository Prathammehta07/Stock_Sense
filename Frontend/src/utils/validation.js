export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isValidRequired = (val) => {
  return val !== null && val !== undefined && String(val).trim().length > 0;
};
