export interface ValidationResult<T extends string> {
  isValid: boolean;
  errors: Partial<Record<T, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values: {
  email: string;
  password: string;
}): ValidationResult<'email' | 'password'> {
  const errors: Partial<Record<'email' | 'password', string>> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 9) {
    errors.password = 'Password must be at least 9 characters.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm(values: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): ValidationResult<'firstName' | 'lastName' | 'email' | 'password'> {
  const errors: Partial<Record<'firstName' | 'lastName' | 'email' | 'password', string>> = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  // Matches Nhost config: passwordMinLength = 9
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 9) {
    errors.password = 'Password must be at least 9 characters (Nhost policy).';
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = 'Password must include at least one letter and one number.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateProductForm(values: {
  title: string;
  brand: string;
  price: string;
  stock: string;
  description: string;
}): ValidationResult<'title' | 'brand' | 'price' | 'stock' | 'description'> {
  const errors: Partial<Record<'title' | 'brand' | 'price' | 'stock' | 'description', string>> = {};

  const trimmedTitle = values.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Piece title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Title must be 80 characters or less.';
  }

  if (!values.brand.trim()) {
    errors.brand = 'Atelier / Brand name is required.';
  }

  const parsedPrice = Number(values.price);
  if (!values.price.trim()) {
    errors.price = 'Price is required.';
  } else if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
    errors.price = 'Price must be a positive number.';
  } else if (parsedPrice > 10000) {
    errors.price = 'Price cannot exceed $10,000.';
  }

  const parsedStock = Number(values.stock);
  if (!values.stock.trim()) {
    errors.stock = 'Stock count is required.';
  } else if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    errors.stock = 'Stock must be a whole number (0 or more).';
  }

  if (!values.description.trim() || values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
