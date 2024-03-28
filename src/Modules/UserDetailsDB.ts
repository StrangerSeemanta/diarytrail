import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
export interface UserData {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  coverPhotoURL?: string;
  password: string | null;
  gender: string | null;
}
export async function createUserDetailsDatabase(
  user: User,
  userData: UserData
) {
  try {
    const db = getFirestore();
    const uid = user.uid;

    // Create a document in the "userDetails" collection with user information
    const userDetailsRef = doc(db, "userDetails", uid);

    await setDoc(userDetailsRef, {
      ...userData,
      provider: user.providerData[0].providerId,
      uid: user.uid,
    });
  } catch (error) {
    throw new Error(`Can't Update User Database: ${error}`);
  }
}

export async function getUserDetails(user: User): Promise<UserData | null> {
  try {
    const db = getFirestore();
    const userDetailsRef = doc(db, "userDetails", user.uid);

    const userDetailsSnapshot = await getDoc(userDetailsRef);

    if (userDetailsSnapshot.exists()) {
      return userDetailsSnapshot.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Can't Fetch User Details: ${error}`);
  }
}
export async function updateUserDetailsField(
  currentUser: User,
  {
    fieldName,
    newValue,
  }: {
    fieldName: string;
    newValue: string;
  }
) {
  const db = getFirestore();

  // Reference to the document you want to update
  const userDocRef = doc(db, "userDetails", currentUser.uid); // Replace 'userID' with the actual ID of the user document

  try {
    // Update the specific field in the document
    await updateDoc(userDocRef, {
      [fieldName]: newValue,
    });
  } catch (error) {
    console.error("Error updating document field: ", error);
  }
}
