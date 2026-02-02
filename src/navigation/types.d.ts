export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ForgotPassword: undefined;
  Reminders: undefined;
  Profile: undefined;
  CreateNote: {
    id?: string;
    title?: string;
    content?: string;
    updatedAt?: string;
    isPasswordProtected?: boolean;
    reminder?: string | null;
    unlockUntil?: any;
  };

  ChangePassword: undefined;
  ResetPassword: undefined;
  ViewProfile: undefined;
  EditProfile: undefined;
  GuestConversion: undefined;
  NotesPassword: {
    id: string;
  };
  ChangeNotePassword: undefined;
};
