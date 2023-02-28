import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, getFirestore, QueryDocumentSnapshot, setDoc, updateDoc } from 'firebase/firestore/lite';
import { ScouterDataType } from "../components/types/TableDataTypes";
import { User, userToFirebase } from "../components/types/User";
import { UserTags } from "../components/UsersManager";
import { CompetitionSchedule } from "../pages/TimetableManager";
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
const auth = getAuth(firebase);
signInAnonymously(auth).then((userCredential) => {
    console.log("Signed in anonymously");
}).catch((error) => {
    console.log(error);
});

export async function updateData(docPath: string, data: any, merge: boolean = false) {
    await setDoc(doc(firestore, docPath), data, { merge: merge });
}

export function getDocumentRef(docPath: string): DocumentReference {
    return doc(firestore, docPath)
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
        return { key: doc.id, firstname: doc.get("firstname"), lastname: doc.get("lastname") }
    });
}

function getScouterDataTypeFromDocRef(docRef: string[]): ScouterDataType {
    if (docRef[0] == null) return { key: "", firstname: "", lastname: ""}
    let data = { key: docRef[0], firstname: docRef[1], lastname: docRef[2]}
    return data
}
function getScouterDataTypeArrayFromDocumentSnapshot(doc: QueryDocumentSnapshot<DocumentData>): (ScouterDataType)[] {
    let scouters: ScouterDataType[] = []
    for (let index = 0; index < 6; index++) {
        const scouter = getScouterDataTypeFromDocRef(doc.get(index.toString()))
        scouters.push(scouter)
    }
    return scouters
}

export async function getquals(qualPath: any): Promise<{ qual: string, scouters: { key: string, firstname: string, lastname: string }[] }[]> {
    const seasons = await getDocs(collection(firestore, qualPath));
    return seasons.docs.map((doc) => {
        return {
            qual: doc.id + "", scouters: getScouterDataTypeArrayFromDocumentSnapshot(doc)
        }
    });
}


export async function getSeasons(): Promise<{ year: string, name: string }[]> {
    const seasons = await getDocs(collection(firestore, 'seasons'));
    return seasons.docs.map((doc) => { return { year: doc.id, name: doc.get('name') } });
}

export async function getSeason(seasonYear: string) {
    const season = await getDoc(doc(firestore, 'seasons', seasonYear));
    return { year: season.id, name: season.get('name') };
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
    await updateDoc(doc(firestore, 'seasons', seasonYear, 'data-params', mode), { [param.name]: param });
}

export async function getUsers(seasonYear: string) {
    const users = await getDocs(collection(firestore, 'seasons', seasonYear, 'users'));
    return users.docs.map((doc) => { return { ...doc.data(), username: doc.id } as User });
}

export async function getUserFromDB(seasonYear: string, username: string) {
    const user = await getDoc(doc(firestore, 'seasons', seasonYear, 'users', username));
    return { ...user.data(), username: user.id, seasonYear: seasonYear} as User;
}

export async function isUserExists(username: string, password: string) {
    const seasons = await getSeasons();
    for (const season of seasons) {
        const users = await getUsers(season.year);
        if (users.some((user) => user.username === username && user.password === password)) {
            return season.year;
        }
    }
    return undefined;
}

export async function getUsernames(seasonYear: string) {
    const users = getUsers(seasonYear);
    return (await users).map((user) => user.username);
}

export async function deleteUser(seasonYear: string, username: string) {
    await deleteDoc(doc(firestore, 'seasons', seasonYear, 'users', username));
}

export async function updateUserInFirebase(seasonYear: string, user: User) {
    await updateDoc(doc(firestore, 'seasons', seasonYear, 'users', user.username), userToFirebase(user));
}

export async function addUserToFirebase(seasonYear: string, user: User) {
    await setDoc(doc(firestore, 'seasons', seasonYear, 'users', user.username), userToFirebase(user));
    const scoutingTeams = await getScoutingTeams(seasonYear);
    
    if (!scoutingTeams.includes(user.teamNumber.toString())) {
        await addUserToScoutingTeams(seasonYear, user.teamNumber.toString(), user.teamName);
    }
}

async function getScoutingTeams(seasonYear: string) {
    const teams = await getDocs(collection(firestore, 'seasons', seasonYear, 'scouting-teams'));
    return teams.docs.map((doc) => { return doc.id });
}

async function addUserToScoutingTeams(seasonYear: string, teamNumber: string, teamName: string) {
    await setDoc(doc(firestore, 'seasons', seasonYear, 'scouting-teams', teamNumber), { name: teamName });
}

export async function createSeason(seasonYear: string, seasonName: string) {
    await setDoc(doc(firestore, 'seasons', seasonYear), { name: seasonName });
    await createSeasonEmptyDataParams(seasonYear);
    await createDefaultAdminUser(seasonYear);
    await createDefaultScoutingTeams(seasonYear);
}

async function createSeasonEmptyDataParams(seasonYear: string) {
    await setDoc(doc(firestore, 'seasons', seasonYear, 'data-params', DataParamsModes.AUTONOMOUS), {});
    await setDoc(doc(firestore, 'seasons', seasonYear, 'data-params', DataParamsModes.TELEOP), {});
    await setDoc(doc(firestore, 'seasons', seasonYear, 'data-params', DataParamsModes.ENDGAME), {});
    await setDoc(doc(firestore, 'seasons', seasonYear, 'data-params', DataParamsModes.SUMMARY), {});
}

async function createDefaultAdminUser(seasonYear: string) {
    const username = process.env.REACT_APP_DEFAULT_ADMIN_USERNAME!;
    const password = process.env.REACT_APP_DEFAULT_ADMIN_PASSWORD!;
    const teamNumber = process.env.REACT_APP_DEFAULT_ADMIN_TEAM_NUMBER!;
    const teamName = process.env.REACT_APP_DEFAULT_ADMIN_TEAM_NAME!;
    const tags = [UserTags.TEAM, UserTags.ADMIN];

    const user = { username, password, teamNumber, teamName, tags };
    await setDoc(doc(firestore, 'seasons', seasonYear, 'users', username), userToFirebase(user));
}

async function createDefaultScoutingTeams(seasonYear: string) {
    const defaultTeamNumber = process.env.REACT_APP_DEFAULT_ADMIN_TEAM_NUMBER!;
    const defaultTeamName = process.env.REACT_APP_DEFAULT_ADMIN_TEAM_NAME!;

    await setDoc(doc(firestore, 'seasons', seasonYear, 'scouting-teams', defaultTeamNumber), { name: defaultTeamName });
}

export async function getExistingCompetitions(seasonYear: string) {
    const competitions = await getDocs(collection(firestore, 'seasons', seasonYear, 'competitions'));
    return competitions.docs.map((doc) => { return doc.id });
}

export async function addCompetitionData(eventCode: string, seasonYear: string) {
    const partialURL = `http://localhost:3000/frcapi/v3.0/${seasonYear}/schedule/`
    const eventNameURL = `http://localhost:3000/frcapi/v3.0/${seasonYear}/events?eventCode=${eventCode}`
    const eventName = (await (await fetch(eventNameURL)).json()).Events[0].name

    const myHeaders = new Headers();
    myHeaders.append("If-Modified-Since", "");
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    } as RequestInit;
    const responseSchedule = await (await fetch(partialURL + eventCode + "?tournamentLevel=qual", requestOptions)).text()
    const dataSchedule: CompetitionSchedule = JSON.parse(responseSchedule)
    if (dataSchedule.Schedule.length === 0) {
        return false
    }
    await setDoc(doc(firestore, 'seasons', seasonYear, 'competitions', eventCode), { name: eventName })
    dataSchedule.Schedule.forEach(async qual => {
        const fbQual = await getDoc(doc(firestore, 'seasons', seasonYear, 'competitions', eventCode, 'Quals', `Qual${qual.matchNumber}`))
        if (!fbQual.exists()) {
            await updateData(`seasons/${seasonYear}/competitions/${eventCode}/Quals/Qual${qual.matchNumber}`, {
                0: [null, null, null],
                1: [null, null, null],
                2: [null, null, null],
                3: [null, null, null],
                4: [null, null, null],
                5: [null, null, null],
                ['0-path']: "",
                ['1-path']: "",
                ['2-path']: "",
                ['3-path']: "",
                ['4-path']: "",
                ['5-path']: "",
            }, true)
        }
    })
    return true
}