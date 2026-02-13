import * as yup from "yup";
export const NotesSchema = yup.object({
  //   currentPassword: yup
  //     .string()
  //     .required("This is a required field")
  //     .min(8, "Password must be atleast 8 characters")
  //     .matches(/[a-z]/, "Password must contain atleast one lowercase character")
  //     .matches(/[A-Z]/, "Password must contain atleast one uppercase character")
  //     .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
