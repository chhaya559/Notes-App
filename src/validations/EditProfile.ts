import * as yup from "yup";

const usernameRegex = /^[a-zA-z0-9_.]+$/;
//* - matches 0 or more times and + - matches 1 or more times

export const EditSchema = yup.object({
  username: yup
    .string()
    .matches(usernameRegex, "No special characters allowed except .,_"),
  firstName: yup.string().matches(/^[a-zA-Z]*$/, "Only alphabets are allowed"),
  lastName: yup.string().matches(/^[a-zA-Z]*$/, "Only alphabets are allowed"),
  email: yup.string().email("Enter a valid email"),
});
