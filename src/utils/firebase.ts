import { initializeApp } from "firebase/app";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const firebase = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebase);

export async function updateData(docPath: string, data: any) {
    await setDoc(doc(firestore, docPath), data);
}
export async function deleteDocument(docPath: string) {
    await deleteDoc(doc(firestore, docPath))
}

export async function getSeasons(): Promise<{ year: string, name: string }[]> {
    const seasons = await getDocs(collection(firestore, 'seasons'));
    return seasons.docs.map((doc) => { return { year: doc.id, name: doc.get('name') } });
}
export async function getFieldValue(collectionName: any, fieldid: string): Promise<{ fieldid: string, fieldlvalue: string }[]> {
    const seasons = await getDocs(collection(firestore, collectionName));
    return seasons.docs.map((doc) => { return { fieldid: doc.id, fieldlvalue: doc.get(fieldid) } });
}

export async function getscouters(collectionName: any): Promise<{ key: string, firstname: string, lastname: string }[]> {
    const seasons = await getDocs(collection(firestore, collectionName));
    return seasons.docs.map((doc) => {
        return { key: doc.id + "", firstname: doc.get("firstname"), lastname: doc.get("lastname") }
    });
}


