import * as yup from "yup";

export const forgotSchema = yup.object({
  email: yup
    .string()
    .required("This is a required field")
    .email("Enter a valid email address"),
});
