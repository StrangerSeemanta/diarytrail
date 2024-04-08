import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  or,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirebaseApp } from "../firebase/app_fiebase";
import { UserData_public } from "./Public_UserDataDB";

const db = getFirestore(FirebaseApp);
// Interface for conversation data
export interface Message {
  text: string;
  sender: UserData_public;
  timestamp: Date;
}
export interface Conversation {
  conversationId: string;
  MetaData: {
    participants: {
      sender_dtid: string;
      receiver_dtid: string;
    };
    // Array of user IDs participating in the conversation
    createdAt: Date; // Timestamp of when the conversation was created
    sender: UserData_public;
    receiver: UserData_public;
  };
  lastMessage: Message;
  messages: Message[];
}

// Function to create a new conversation

export async function createRoom(
  {
    sender,
    receiver,
  }: {
    sender: Conversation["MetaData"]["sender"];
    receiver: Conversation["MetaData"]["receiver"];
  },
  lastMsg: string
): Promise<void> {
  try {
    // Generate conversation ID based on sender and receiver IDs
    const conversationId = [sender.dtid, receiver.dtid].sort().join("");

    // Create conversation data
    const conversationData: Conversation = {
      conversationId: conversationId,
      MetaData: {
        sender,
        receiver,
        participants: {
          sender_dtid: sender.dtid,
          receiver_dtid: receiver.dtid,
        },
        createdAt: new Date(),
      },

      lastMessage: {
        sender: sender,
        text: lastMsg,
        timestamp: new Date(),
      },
      messages: [],
    };

    // Create a reference to the conversation document
    const conversationRef = doc(db, "conversation_rooms", conversationId);
    const snapshot = await getDoc(conversationRef);
    if (!snapshot.exists()) {
      await setDoc(conversationRef, conversationData);
    }
    // Use a transaction to ensure atomicity and consistency
  } catch (error) {
    throw new Error(`Error creating conversation: ${error}`);
  }
}

// Function to retrieve conversations for a user

// Function to retrieve the conversation document for a user
export async function getConversationForUser(
  currentUser_dtid: string
): Promise<Conversation[] | null> {
  try {
    // Create a query to find conversation documents where the user's dtid matches either sender_dtid or receiver_dtid

    const senderWhere = where(
      "MetaData.participants.sender_dtid",
      "==",
      currentUser_dtid
    );
    const receiverWhere = where(
      "MetaData.participants.receiver_dtid",
      "==",
      currentUser_dtid
    );

    // Combine the where clauses using the query function
    const q = query(
      collection(db, "conversation_rooms"),
      or(senderWhere, receiverWhere)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if any matching conversation documents were found
    if (!querySnapshot.empty) {
      // Return the first conversation document found (assuming there's only one)
      return querySnapshot.docs.map((doc) => doc.data()) as Conversation[];
    } else {
      // No matching conversation document found
      return null;
    }
  } catch (error) {
    console.error("Error getting conversation for user:", error);
    throw error;
  }
}

export async function deleteRoom({
  sender,
  receiver,
}: {
  sender: Conversation["MetaData"]["sender"];
  receiver: Conversation["MetaData"]["receiver"];
}): Promise<void> {
  try {
    // Generate conversation ID based on sender and receiver IDs
    const conversationId = [sender.dtid, receiver.dtid].sort().join("");

    // Create conversation data

    // Create a reference to the conversation document
    const conversationRef = doc(db, "conversation_rooms", conversationId);
    const snapshot = await getDoc(conversationRef);
    if (snapshot.exists()) {
      await deleteDoc(conversationRef);
    }
    // Use a transaction to ensure atomicity and consistency
  } catch (error) {
    throw new Error(`Error deleting conversation: ${error}`);
  }
}
// Function to update the last message in a conversation
export async function updateLastMessage(
  {
    sender,
    receiver,
  }: {
    sender: Conversation["MetaData"]["sender"];
    receiver: Conversation["MetaData"]["receiver"];
  },
  lastMessage: string
): Promise<void> {
  const conversationId = [sender.dtid, receiver.dtid].sort().join("");

  try {
    const conversationRef = doc(db, "conversation_rooms", conversationId);

    await updateDoc(conversationRef, {
      ["lastMessage"]: {
        sender: sender, // Initialize with empty values
        text: lastMessage,
        timestamp: new Date(), // Initialize with the epoch (1970-01-01T00:00:00Z)
      },
    });
  } catch (error) {
    throw new Error(
      `Error updating last message for conversation ${conversationId}: ${error}`
    );
  }
}

export async function updateMessages(
  conversationId: string,
  newMessage: Message
): Promise<void> {
  try {
    // Create a reference to the conversation document
    const conversationRef = doc(db, "conversation_rooms", conversationId);

    // Use a transaction to ensure atomicity and consistency
    await runTransaction(db, async (transaction) => {
      const conversationDoc = await transaction.get(conversationRef);
      if (conversationDoc.exists()) {
        const conversationData = conversationDoc.data() as Conversation;

        // Update the messages array with the new message
        const updatedMessages = [...conversationData.messages, newMessage];

        // Update the conversation document with the new messages
        transaction.update(conversationRef, { messages: updatedMessages });
      } else {
        throw new Error("Conversation not found.");
      }
    });
  } catch (error) {
    throw new Error(`Error updating messages: ${error}`);
  }
}
export async function getMessages(
  currentUser_dtid: string,
  msgWith_dtid: string
): Promise<Message[]> {
  try {
    // Create a query to find conversation documents where the user's dtid matches either sender_dtid or receiver_dtid
    const conversationId = [currentUser_dtid, msgWith_dtid].sort().join("");
    const conversationRef = doc(db, "conversation_rooms", conversationId);
    const snapshot = await getDoc(conversationRef);
    if (snapshot.exists()) {
      const conversation = snapshot.data() as Conversation;
      return conversation["messages"];
    } else {
      // No matching conversation document found
      return [];
    }
  } catch (error) {
    console.error("Error getting conversation for user:", error);
    throw error;
  }
}

// Real Time Update

export async function listenToNewMessages(
  currentUser_dtid: string,
  msgWith_dtid: string,
  onNewMessage: (message: Message[]) => void,
  onError: (error: string) => void
) {
  try {
    const conversationId = [currentUser_dtid, msgWith_dtid].sort().join("");
    const conversationRef = doc(db, "conversation_rooms", conversationId);

    // Listen to changes in the conversation document
    const unsubscribe = onSnapshot(conversationRef, async (snapshot) => {
      const conversationData = snapshot.data() as Conversation;
      if (conversationData) {
        const messages = conversationData.messages;
        // Check if messages array exists and handle new messages
        if (Array.isArray(messages)) {
          // Handle each new message
          onNewMessage(messages);
        }
      }
    });

    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  } catch (error) {
    // Handle errors
    onError(String(error));
    // Return null to indicate failure
    return null;
  }
}

// Example usage:
// To stop listening:
// unsubscribe();
