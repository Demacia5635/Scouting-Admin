import { Select } from "antd";
import { useEffect, useState } from "react";
import ScoutersTable from "../components/ScoutersTable";
import { Fields } from "../components/types/Fields";
import "../utils/firebase";
import { getFieldValue } from "../utils/firebase";
import { resetSeason } from "../utils/season-handler";


export const ScoutersManager = () => {
    const [teams, setTeams] = useState<Array<Fields>>([]);
    const [currentTeamNum, setCurrentTeamNum] = useState<string>("5635")

    const optionslist = teams.map((team) => {
        return (<option key={team.fieldid} label={team.fieldid} value={team.fieldid}></option>)
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
                    setCurrentTeamNum(value.value)

                }}
                defaultValue={{ value: 'demacia', label: '5635' }}
            >
                {optionslist}

            </Select>
            <ScoutersTable currenteamnum={currentTeamNum} />
        </div>
    );
}