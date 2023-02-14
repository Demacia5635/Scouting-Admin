import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore/lite';
import { DataParamsModes, ParamItem } from "./params/ParamItem";

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

export async function getSeasons(): Promise<{ year: string, name: string }[]> {
    const seasons = await getDocs(collection(firestore, 'seasons'));
    return seasons.docs.map((doc) => { return { year: doc.id, name: doc.get('name') } });
}

export async function getAllParams(seasonYear: number) {
    console.log(`Loading data for ${seasonYear}`)
    return [
        await getParams(DataParamsModes.AUTONOMOUS, seasonYear),
        await getParams(DataParamsModes.TELEOP, seasonYear),
        await getParams(DataParamsModes.ENDGAME, seasonYear),
        await getParams(DataParamsModes.SUMMARY, seasonYear)
    ];
}

export async function getParams(mode: DataParamsModes, seasonYear: number) {
    const dataParams = await getDoc(doc(firestore, 'seasons', seasonYear.toString(), 'data-params', mode));
    const data = dataParams.data() as ParamItem[];
    let params = []
    for (const param in data) {
        params.push({ ...data[param], name: param });
    }
    params = params.filter((param) => param != null);
    return params;
    
}

export async function setParamInFirebase(param: ParamItem, mode: DataParamsModes, seasonYear: number) {
    await updateDoc(doc(firestore, 'seasons', seasonYear.toString(), 'data-params', mode), { [param.name]: param});
}