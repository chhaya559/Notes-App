import * as yup from "yup";
export const changeNotePasswordSchema = yup.object({
  currentPassword: yup.string().required("This is a required field"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
