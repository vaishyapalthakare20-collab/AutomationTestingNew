/**
 * dataGenerator - lightweight, dependency-free random test-data generator.
 *
 * Real frameworks generate unique data per run (emails, names, numbers) so
 * tests don't collide. This mimics the essentials of libraries like Faker
 * without adding a dependency.
 */

const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Priya', 'Liam', 'Sara', 'Raj', 'Emma', 'Noah', 'Mia'];
const LAST_NAMES = ['Doe', 'Smith', 'Sharma', 'Brown', 'Khan', 'Patel', 'Jones', 'Lee', 'Verma'];
const DOMAINS = ['example.com', 'testmail.com', 'mailinator.com', 'qa-demo.io'];

/** Random integer between min and max (inclusive). */
export function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element from an array. */
export function randomFrom(array) {
  return array[randomInt(0, array.length - 1)];
}

/** Random alphanumeric string of a given length. */
export function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[randomInt(0, chars.length - 1)];
  }
  return result;
}

/** Random first name. */
export function firstName() {
  return randomFrom(FIRST_NAMES);
}

/** Random last name. */
export function lastName() {
  return randomFrom(LAST_NAMES);
}

/** Random full name. */
export function fullName() {
  return `${firstName()} ${lastName()}`;
}

/** Unique email address (timestamped to guarantee uniqueness). */
export function email(prefix = 'user') {
  return `${prefix}_${Date.now()}_${randomString(4).toLowerCase()}@${randomFrom(DOMAINS)}`;
}

/** Random numeric postal/zip code. */
export function postalCode(length = 5) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += randomInt(0, 9);
  }
  return code;
}

/** Random phone number (10 digits). */
export function phoneNumber() {
  return `9${postalCode(9)}`;
}

/**
 * Generate a complete random customer object (handy for checkout forms).
 * @returns {{firstName: string, lastName: string, email: string, postalCode: string, phone: string}}
 */
export function customer() {
  return {
    firstName: firstName(),
    lastName: lastName(),
    email: email(),
    postalCode: postalCode(),
    phone: phoneNumber(),
  };
}

export default {
  randomInt,
  randomFrom,
  randomString,
  firstName,
  lastName,
  fullName,
  email,
  postalCode,
  phoneNumber,
  customer,
};
