import * as yup from "yup";

const usernameRegex = /^[a-zA-z0-9_.]+$/;

export const loginSchema = yup.object({
  //test : what to check, failed error, how to check
  identifier: yup
    .string()
    .required("Email/Username is required")
    .test("username/email", "Invalid email or username format", (value) => {
      if (!value) return;
      const isEmail = yup.string().email().isValidSync(value);
      const isName = usernameRegex.test(value);

      return isEmail || isName;
    }),
  password: yup.string().required("Password is required"),
});
