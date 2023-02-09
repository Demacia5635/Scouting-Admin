import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { Fields } from "../components/types/Fields";
import { getFieldValue, try1, updateData, } from "../utils/firebase";
import "../utils/firebase"
import { resetSeason } from "../utils/season-handler";
import ScoutersTable from "../components/ScoutersTable";
import { currentteam } from "../components/types/CurrentTeam";
import { FileUploader } from "../components/FileUploader";





export const ScoutersManager = () => {
    const [teams, setTeams] = useState<Array<Fields>>([]);
    const [currentTeam, setCurrentTeam] = useState<currentteam>({ currenteamnum: "5635", currentteamname: "demacia" })

    const handleChange = (value: { value: string; label: React.ReactNode }) => {
        console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    };
    const optionslist = teams.map((team) => {
        return (<Option key={team.fieldlvalue}>{team.fieldid}</Option>)
    })
    useEffect(() => {
        resetSeason();
        async function name() {
            const teams = await getFieldValue("seasons/2019/teams", "name")
            setTeams(teams)


        }
        // name()
    }, []);
    return (
        <div>
            <h1>Scouters Manager</h1>
            <FileUploader scouterDocPath='' />
            {/* <Select
                onChange={(optin: { value: string; label: string }) => {
                    const teamChosen: currentteam = { currenteamnum: optin.label, currentteamname: optin.value }
                    setCurrentTeam(teamChosen)
                }}
                defaultValue={{ value: 'demacia', label: '5635' }}
            >
                {optionslist}

            </Select>
            <ScoutersTable currenteamnum={currentTeam.currenteamnum} currentteamname={currentTeam.currenteamnum} /> */}
        </div>
    );
}