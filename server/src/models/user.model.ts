export interface UserDoc {
  uid: string;
  phoneNumber: string;
  name: string | null;
  preferredLanguage: 'en' | 'te';
  isAdmin: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  lastLogin: FirebaseFirestore.Timestamp;
}

export const USERS_COLLECTION = 'users';
