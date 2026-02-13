import * as yup from "yup";

const usernameRegex = /^[a-zA-z0-9_.]+$/;
//* - matches 0 or more times and + - matches 1 or more times

export const registerSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(4, "Minimum length is 4 characters")
    .matches(usernameRegex, "No special characters allowed except .,_"),
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[a-zA-Z]*$/, "Only alphabets are allowed")
    .min(2, "Minimum length is 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[a-zA-Z]*$/, "Only alphabets are allowed")
    .min(2, "Minimum length is 2 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(/^\S*$/, "Password must not contain spaces")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase character")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  email: yup
    .string()
    .required("Email is a required")
    .email("Enter a valid email"),
});
