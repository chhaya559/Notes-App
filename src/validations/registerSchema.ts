import * as yup from "yup";

const usernameRegex = /^[a-zA-z0-9_.]+$/;
//* - matches 0 or more times and + - matches 1 or more times

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Username is a required field")
    .matches(usernameRegex, "No special characters allowed except .,_"),
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z]*$/, "No symbols/Number allowed"),
  lastName: yup
    .string()
    .required()
    .matches(/^[a-zA-Z]*$/, "Only alphabets are allowed"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(/[a-z]/, "Password must contain atleast one lowercase character")
    .matches(/[A-Z]/, "Password must contain atleast one uppercase character")
    .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  email: yup
    .string()
    .required("Email is a required field")
    .email("Enter a valid email"),
});
