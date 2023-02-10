import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import ScoutersTable from "../components/ScoutersTable";
import { Fields } from "../components/types/Fields";
import "../utils/firebase";
import { getFieldValue } from "../utils/firebase";
import { resetSeason } from "../utils/season-handler";
import {v4 as uuid} from 'uuid'





export const ScoutersManager = () => {
    const [teams, setTeams] = useState<Array<Fields>>([]);
    const [currentTeamNum, setCurrentTeamNum] = useState<any>("5635")


    const handleChange = (value: { value: string; label: React.ReactNode }) => {
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    };
    const optionslist = teams.map((team) => {
        return (<Option key={team.fieldid}>{team.fieldid}</Option>)
    })
    useEffect(() => {
        resetSeason();
        async function name() {
            const teams = await getFieldValue("seasons/2019/teams", "name")
            setTeams(teams)


        }
        name()
    }, []);
    return (
        <div>
            <h1>Scouters Manager</h1>
            <Select
                onChange={(value: { value: string, label: string }) => {
                    console.log("team num chosen " + value)
                    setCurrentTeamNum(value)

                }}
                defaultValue={{ value: 'demacia', label: '5635' }}
            >
                {optionslist}

            </Select>
            <ScoutersTable currenteamnum={currentTeamNum} />
        </div>
    );
}