import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { base64Encode } from "./tokenize";
import { UserData_public } from "./Public_UserDataDB";

export interface UserData {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  password: string | null;
  gender: string | null;
  bio?: string;
  coverPhotoURL?: string;
  dtid: string;
}
export async function createUserDetailsDatabase(
  user: User,
  userData: UserData
) {
  try {
    const db = getFirestore();
    const uid = user.uid;
    const dt_token = base64Encode(uid);
    // Create a document in the "userDetails" collection with user information
    const userDetailsRef = doc(db, "userDetails", uid);
    const usersDBREF = doc(db, "users", dt_token); // for public uses

    const documentUserDetails = await getDoc(userDetailsRef);
    const docUsersDb = await getDoc(usersDBREF);
    const public_userData: UserData_public = {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      dtid: dt_token,
    };
    if (!documentUserDetails.exists()) {
      await setDoc(userDetailsRef, {
        ...userData,
        provider: user.providerData[0].providerId,
        uid: user.uid,
        dtid: dt_token,
      });
    }

    if (!docUsersDb.exists()) {
      await setDoc(usersDBREF, public_userData);
    }

    // Update Auth.User.Token.dtid
  } catch (error) {
    throw new Error(`Can't Update User Details Database: ${error}`);
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
