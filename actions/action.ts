'use server';

import { adminDb } from '@/firebase-admin';
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';

export async function createNewDocument() {
  // Validate the session
  const { userId, sessionClaims } = await auth();

  // Redirect unauthenticated users to the sign-in page
  if (!userId || !sessionClaims) {
    return (await auth()).redirectToSignIn();
  }

  const email = sessionClaims?.email;

  // Create a new document
  const docCollectionRef = adminDb.collection('documents');
  const docRef = await docCollectionRef.add({
    title: 'New Doc',
  });

  // Set user-specific data in the Firestore database
  await adminDb
    .collection('users')
    .doc(email)
    .collection('rooms')
    .doc(docRef.id)
    .set({
      userId: email,
      role: 'owner',
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth.protect();
  try {
    await adminDb.collection('documents').doc(roomId).delete();
    const query = await adminDb
      .collectionGroup('rooms')
      .where('roomId', '==', roomId)
      .get();
    const batch = adminDb.batch();
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth.protect();
  try {
    await adminDb
      .collection('users')
      .doc(email)
      .collection('rooms')
      .doc(roomId)
      .set({
        userId: email,
        role: 'editor',
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, email: string) {
  auth.protect();
  try {
    await adminDb
      .collection('users')
      .doc(email)
      .collection('rooms')
      .doc(roomId)
      .delete();
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}