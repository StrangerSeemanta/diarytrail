import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FirebaseApp } from "./app_fiebase";

export const auth = getAuth(FirebaseApp);

export const getUser = async () => {
  const auth = getAuth(FirebaseApp);
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve(user);
    });
    return () => unsubscribe();
  });
};
export const logout = async () => {
  const auth = getAuth(FirebaseApp);
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Problem Occured During Log Out: ${error}`);
  }
};
