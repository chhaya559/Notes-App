import * as yup from "yup";
export const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .required("Currentd Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(/[a-z]/, "Password must contain atleast one lowercase character")
    .matches(/[A-Z]/, "Password must contain atleast one uppercase character")
    .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(/^\S*$/, "Password must not contain spaces")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[a-z]/, "Password must contain at least one lowercase character")
    .matches(/[A-Z]/, "Password must contain at least one uppercase character")
    .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
