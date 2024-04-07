import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

export interface UserData_public {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  dtid: string;
}

export async function getAllUsers(): Promise<UserData_public[]> {
  try {
    const db = getFirestore();
    const userDetailsCollection = collection(db, "users");
    const snapshot = await getDocs(userDetailsCollection);
    const allUserData: UserData_public[] = [];
    snapshot.forEach((doc) => {
      if (doc.exists()) {
        const d = doc.data() as UserData_public;
        allUserData.push(d);
      }
    });
    return allUserData;
  } catch (error) {
    throw new Error(`Error fetching user count: ${error}`);
  }
}

export async function getUserData_public(
  dtid: string
): Promise<UserData_public | null> {
  try {
    const db = getFirestore();
    const userDetailsRef = doc(db, "users", dtid);

    const userDetailsSnapshot = await getDoc(userDetailsRef);

    if (userDetailsSnapshot.exists()) {
      return userDetailsSnapshot.data() as UserData_public;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Can't Fetch User Data public: ${error}`);
  }
}

export async function update_public_userData(
  dtid: string,
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
  const userDocRef = doc(db, "users", dtid); // Replace 'userID' with the actual ID of the user document

  try {
    // Update the specific field in the document
    await updateDoc(userDocRef, {
      [fieldName]: newValue,
    });
  } catch (error) {
    console.error("Error updating document field: ", error);
  }
}
