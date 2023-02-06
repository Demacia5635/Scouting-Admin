import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { Fields } from "../components/types/Fields";
import { getfieldvalue, getSeasons } from "../utils/firebase";
import { resetSeason } from "../utils/season-handler";





export const ScoutersManager = () => {
    const [teams, setTeams] = useState<Array<Fields>>([]);

    async function name() {
        const teams = await getfieldvalue("seasons/2019/teams", "name")
        setTeams(teams)


    }
    name()

    const optionslist = teams.map((team) => {
        return (<Option key={team.fieldlvalue}>{team.fieldid}</Option>)
    })
    useEffect(() => {
        resetSeason();
    }, []);
    return (
        <div>
            <h1>Scouters Manager</h1>
            <Select
                defaultValue={{ value: 'demacia', label: '5635' }}
            >
                {optionslist}

            </Select>

        </div>
    );
}