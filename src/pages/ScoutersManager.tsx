import { Select } from "antd";
import { useEffect, useState } from "react";
import ScoutersTable from "../components/ScoutersTable";
import { Fields } from "../components/types/Fields";
import "../utils/firebase";
import { getFieldValue } from "../utils/firebase";
import { getSelectedSeason } from "../utils/season-handler";


export const ScoutersManager = () => {
    const { year: seasonYear, name: seasonName } = getSelectedSeason();
    const [teams, setTeams] = useState<Array<Fields>>([]);
    const [currentTeamNum, setCurrentTeamNum] = useState<string>("5635")
    const [optionsList, setOptionsList] = useState<{ value: string, label: string }[]>([])

    useEffect(() => {
        async function name() {
            const teams = await getFieldValue(`seasons/${seasonYear}/scouting-teams`, "name")
            setTeams(teams)
            const optionslist = teams.map((team) => {
                return { value: team.fieldid, label: team.fieldid }
            })
            setOptionsList(optionslist)
        }
        name()
    }, []);
    return (
        <div>
            <h1>Scouters Manager</h1>
            <Select
                onChange={value => {
                    setCurrentTeamNum(`${value}`)
                }}
                defaultValue={{ value: '5635', label: '5635' }}
                options={optionsList}
            />
            <ScoutersTable currenteamnum={currentTeamNum} seasonYear={seasonYear} seasonName={seasonName} />
        </div>
    );
}