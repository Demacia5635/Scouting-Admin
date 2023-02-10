import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState, createContext } from "react";
import { Fields } from "../components/types/Fields";
import { getFieldValue, try1, updateData, } from "../utils/firebase";
import "../utils/firebase"
import { resetSeason } from "../utils/season-handler";
import ScoutersTable from "../components/ScoutersTable";
import { currentteam } from "../components/types/CurrentTeam";
import { FileUploader } from "../components/FileUploader";
import { create } from "domain";
import { render } from "@testing-library/react";





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