import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, setDoc, doc } from 'firebase/firestore/lite';
import { DataParamsModes } from "./params/ParamItem";

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

async function updateData(collectionName: any, docName: string, data: any) {
    await setDoc(doc(firestore, collectionName, docName), data);
}

export async function getSeasons(): Promise<{ year: string, name: string }[]> {
    const seasons = await getDocs(collection(firestore, 'seasons'));
    return seasons.docs.map((doc) => { return { year: doc.id, name: doc.get('name') } });
}

export async function getAllParams(seasonYear: string) {
    return [
        await getParams(DataParamsModes.AUTONOMOUS, seasonYear),
        await getParams(DataParamsModes.TELEOP, seasonYear),
        await getParams(DataParamsModes.ENDGAME, seasonYear),
        await getParams(DataParamsModes.SUMMARY, seasonYear)
    ];
}

export async function getParams(mode: DataParamsModes, seasonYear: string) {
    const dataParams = await getDoc(doc(firestore, 'seasons', seasonYear, 'data-params', mode));
    return dataParams.data();
}