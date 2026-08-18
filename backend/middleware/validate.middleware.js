export const validate = (schema) => (req, res, next) => {
  // basic validation wrapper if needed, or we can use custom logic in controllers
  next();
};
