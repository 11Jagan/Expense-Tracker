/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {Object} Object with isValid and message properties
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is strong'
  };
};

/**
 * Validate expense/income form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with isValid and errors properties
 */
export const validateTransactionForm = (formData) => {
  const errors = {};
  
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
    errors.amount = 'Amount must be a positive number';
  }
  
  if (!formData.date) {
    errors.date = 'Date is required';
  }
  
  if (!formData.category || formData.category.trim() === '') {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate user registration form
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object with isValid and errors properties
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!formData.email || !isValidEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};