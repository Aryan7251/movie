export const validateMovie = (req, res, next) => {
  const { title, description, releaseYear, duration } = req.body;
  if (!title || title.length < 1 || title.length > 200) {
    return next(new Error('Validation Error: Title is required and must be between 1 and 200 characters'));
  }
  if (description && description.length > 5000) {
    return next(new Error('Validation Error: Description must be less than 5000 characters'));
  }
  if (releaseYear) {
    const year = parseInt(releaseYear);
    if (isNaN(year) || year < 1888 || year > new Date().getFullYear() + 1) {
      return next(new Error('Validation Error: Invalid release year'));
    }
  }
  if (duration) {
    const dur = parseInt(duration);
    if (isNaN(dur) || dur <= 0) {
      return next(new Error('Validation Error: Duration must be a positive number'));
    }
  }
  next();
};

export const validateAuth = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || username.length < 3 || username.length > 50) {
    return next(new Error('Validation Error: Username is required and must be 3-50 characters'));
  }
  if (!password || password.length < 6 || password.length > 100) {
    return next(new Error('Validation Error: Password is required and must be 6-100 characters'));
  }
  next();
};
