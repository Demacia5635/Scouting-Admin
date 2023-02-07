import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { Fields } from "../components/types/Fields";
import { getFieldValue, try1, updateData, } from "../utils/firebase";
import "../utils/firebase"
import { resetSeason } from "../utils/season-handler";
import ScoutersTable from "../components/ScoutersTable";





export const ScoutersManager = () => {
    const [teams, setTeams] = useState<Array<Fields>>([]);

    async function name() {
        const teams = await getFieldValue("seasons/2019/teams", "name")
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
            <h1 onClick={() => {
                console.log(try1())
            }}>Scouters Manager</h1>
            <Select
                defaultValue={{ value: 'demacia', label: '5635' }}
            >
                {optionslist}

            </Select>
            <ScoutersTable />
        </div>
    );
}