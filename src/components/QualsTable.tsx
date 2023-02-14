import { Select, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getFieldValue, getquals, getscouters } from "../utils/firebase";
import { QualsTableDataType, ScouterDataType } from "./types/TableDataTypes";

type QulTableProps = {
    seasonPath: string
    tournmentsSubPath: string
    scoutersSubPath: string
}



function getScoutersOptions(scouters: ScouterDataType[]): JSX.Element[] {
    const options = scouters.map((scouter) => {
        console.log(scouter)
        if (scouter.key == undefined) {

            return (<option key="{scouter.key}" value="{scouter.key}">{"whyyyy"}</option>)
        } else {
            console.log("?????")
            return (<option key={scouter.key} value={scouter.key}>{scouter.firstname + " " + scouter.lastname}</option>)
        }
    })
    return options
}

const scoutersOptions = (scouters: ScouterDataType[]) => {
    scouters.map((scouter) => {
        return (<option key={scouter.key} value={scouter.key}>{scouter.firstname + " " + scouter.lastname}</option>)
    })
}

const columns: ColumnsType<QualsTableDataType> = [
    {
        title: 'Match number',
        dataIndex: 'match',
        key: 'match'
    },
    {
        title: 'First Scouter',
        dataIndex: 'allScouters',
        key: 'firstScouter',
        render: (_, record) => (

            <Select
                showSearch
                placeholder={"awdaweawedawer"}
                optionFilterProp="children"
                defaultValue={{ value: (record.chosenScouters[0].key), label: (record.chosenScouters[0].firstname + " " + record.chosenScouters[0].lastname) }}
                options={record.allScouters.map((scouter) => {
                    return (<option key={scouter.key} value={scouter.key} label={scouter.firstname + " " + scouter.lastname}></option>)
                })} />

        )
    },
    {
        title: 'Second Scouter',
        dataIndex: 'chosenScouters',
        key: 'secondScouter',
        render: (_, record) => {
            return (<Select
                showSearch
                defaultValue={{ value: record.chosenScouters[1].key, label: record.chosenScouters[1].firstname + " " + record.chosenScouters[1].lastname }}
                options={getScoutersOptions(record.allScouters)} />
            )
        }
    },
    {
        title: 'Third Scouter',
        dataIndex: 'chosenScouters',
        key: 'thirdScouter',
        render: (_, record) => {
            console.log(record)
            return (<Select
                showSearch
                defaultValue={{ value: record.chosenScouters[2].key, label: record.chosenScouters[2].firstname + " " + record.chosenScouters[2].lastname }}
                options={getScoutersOptions(record.allScouters)} />
            )
        }
    },
    {
        title: 'Fourth Scouter',
        dataIndex: 'chosenScouters',
        key: 'fourthScouter',
        render: (_, record) => {
            return (<Select
                showSearch
                defaultValue={{ value: record.chosenScouters[3].key, label: record.chosenScouters[3].firstname + " " + record.chosenScouters[3].lastname }}
                options={getScoutersOptions(record.allScouters)} />
            )
        }
    },
    {
        title: 'Fifth Scouter',
        dataIndex: 'chosenScouters',
        key: 'fifthScouter',
        render: (_, record) => {
            return (<Select
                showSearch
                defaultValue={{ value: record.chosenScouters[4].key, label: record.chosenScouters[4].firstname + " " + record.chosenScouters[4].lastname }}
                options={getScoutersOptions(record.allScouters)} />
            )
        }
    },
    {
        title: 'Sixth Scouter',
        dataIndex: 'chosenScouters',
        key: 'sixthScouter',
        render: (_, record) => {
            return (<Select
                showSearch
                defaultValue={{ value: record.chosenScouters[5].key, label: record.chosenScouters[5].firstname + " " + record.chosenScouters[5].lastname }}
                options={getScoutersOptions(record.allScouters)} />
            )
        }
    }

];

export const QualsTable = ({ seasonPath, tournmentsSubPath, scoutersSubPath }: QulTableProps) => {
    const [data, setdata] = useState<QualsTableDataType[]>([]);
    const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)
    useEffect(() => {
        async function getScoutes() {
            const scouters = await getscouters(/*seasonPath + scoutersSubPath*/"seasons/2019/teams/6969/scouters")
            const matches = await getquals(seasonPath + tournmentsSubPath)
            let tableData = matches.map((match) => {
                const workpls = match.scouters
                console.log(workpls)
                if (match.scouters == undefined) {
                    console.log("why????")
                }
                console.log(match)
                console.log(scouters)
                return ({ key: match.qual, match: match.qual, chosenScouters: workpls, allScouters: scouters })
            })
            console.log(tableData)
            setdata(tableData)
            console.log(data)
        }
        getScoutes()
    }, []);
    useEffect(() => {
        if (data.length != 0) {
            setIsFinishedLoading(true)
            if (data[0].chosenScouters[0] == undefined) {
                console.log("why????")
            }
        }
        console.log(data)
    }, [data])
    if (isFinishedLoading) {
        return (
            <Table dataSource={data} columns={columns} />
        )
    } else {

        return (<div style={{ marginTop: '10px' }}><Spin /></div>)
    }
}
