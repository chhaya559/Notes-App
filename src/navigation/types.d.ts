export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  ForgotPassword: {
    name?: string;
  };
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
    filePaths?: any;
  };

  ChangePassword: undefined;
  ResetPassword: undefined;
  ViewProfile: undefined;
  EditProfile: undefined;
  GuestConversion: undefined;
  NotesPassword: {
    noteID: string;
  };
  ChangeNotePassword: undefined;

  Notifications: undefined;
};
