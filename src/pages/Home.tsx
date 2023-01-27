// create a home page component
import { collection, doc, getDoc } from 'firebase/firestore/lite';
import React from 'react';
import { firebase, firestore } from '../utils/firebase';

function GetSeasonsList(){
    let Seasons: Array<HTMLDivElement>;
    let i:number;
    i=0;
    let isfalied:boolean
    isfalied = false
    while(!isfalied)
    {
        try {
            const getfieldvalue = async () => {
                let docsnap = await getDoc(doc(firestore,"seasons",(2023+i).toString()))
                return (docsnap.get("name"))
                
            }

        } catch (error) {
            isfalied = true
        }

    }

}


export const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};