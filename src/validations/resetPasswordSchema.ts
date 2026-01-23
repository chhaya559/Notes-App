import * as yup from "yup";
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required("This is a required field")
    .min(8, "Password must be atleast 8 characters")
    .matches(/[a-z]/, "Password must contain atleast one lowercase character")
    .matches(/[A-Z]/, "Password must contain atleast one uppercase character")
    .matches(/[!@#$%^&*.]+/, "Password must contain atleast one symbol"),
  confirmPassword: yup
    .string()
    .required("This is a required password")
    .oneOf([yup.ref("password")], "Passwords don't match"),
});
