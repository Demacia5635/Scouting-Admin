import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, deleteDoc, setDoc } from 'firebase/firestore/lite';
import { userToFirebase, User } from "../components/types/User";
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

export async function updateData(docPath: string, data: any) {
    await setDoc(doc(firestore, docPath), data);
}

export async function deleteDocument(docPath: string) {
    await deleteDoc(doc(firestore, docPath))
}

export async function getFieldValue(collectionName: any, fieldid: string): Promise<{ fieldid: string, fieldlvalue: string }[]> {
    const seasons = await getDocs(collection(firestore, collectionName));
    return seasons.docs.map((doc) => { return { fieldid: doc.id, fieldlvalue: doc.get(fieldid) } });
}

export async function getScouters(collectionName: any): Promise<{ key: string, firstname: string, lastname: string }[]> {
    const seasons = await getDocs(collection(firestore, collectionName));
    return seasons.docs.map((doc) => {
        return { key: doc.id + "", firstname: doc.get("firstname"), lastname: doc.get("lastname") }
    });
}

export async function getSeasons(): Promise<{ year: string, name: string }[]> {
    const seasons = await getDocs(collection(firestore, 'seasons'));
    return seasons.docs.map((doc) => { return { year: doc.id, name: doc.get('name') } });
}

export async function getAllParams(seasonYear: string) {
    console.log(`Loading data for ${seasonYear}`)
    return [
        await getParams(DataParamsModes.AUTONOMOUS, seasonYear),
        await getParams(DataParamsModes.TELEOP, seasonYear),
        await getParams(DataParamsModes.ENDGAME, seasonYear),
        await getParams(DataParamsModes.SUMMARY, seasonYear)
    ];
}

export async function getParams(mode: DataParamsModes, seasonYear: string) {
    const dataParams = await getDoc(doc(firestore, 'seasons', seasonYear, 'data-params', mode));
    const data = dataParams.data() as ParamItem[];
    let params = []
    for (const param in data) {
        params.push({ ...data[param], name: param });
    }
    params = params.filter((param) => param != null);
    return params;
    
}

export async function setParamInFirebase(param: ParamItem, mode: DataParamsModes, seasonYear: string) {
    await updateDoc(doc(firestore, 'seasons', seasonYear, 'data-params', mode), { [param.name]: param});
}

export async function getUsers(seasonYear: string){
    const users = await getDocs(collection(firestore, 'seasons', seasonYear, 'users'));
    return users.docs.map((doc) => { return { ...doc.data(), username: doc.id } as User });
}

export async function deleteUser(seasonYear: string, username: string){
    await deleteDoc(doc(firestore, 'seasons', seasonYear, 'users', username));
}

export async function updateUserInFirebase(seasonYear: string, user: User){
    await updateDoc(doc(firestore, 'seasons', seasonYear, 'users', user.username), userToFirebase(user));
}

export async function addUserToFirebase(seasonYear: string, user: User){
    await setDoc(doc(firestore, 'seasons', seasonYear, 'users', user.username), userToFirebase(user));
}