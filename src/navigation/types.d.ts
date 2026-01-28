export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ForgotPassword: undefined;
  Reminders: undefined;
  Profile: undefined;
  CreateNote: {
    title?: string;
    id?: number;
    content?: string;
  };
  ChangePassword: undefined;
  ResetPassword: undefined;
  ViewProfile: undefined;
  EditProfile: undefined;
  GuestConversion: undefined;
};
