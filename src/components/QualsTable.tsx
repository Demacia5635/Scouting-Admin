import { Button, Form, Select, Space, Spin, Table } from "antd";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import arrayShuffle from 'array-shuffle';
import { useEffect, useState } from "react";
import { getFieldValue, getquals, getScouters, updateData } from "../utils/firebase";
import { QualsTableDataType, ScouterDataType } from "./types/TableDataTypes";

type QualTableProps = {
    seasonYear: string
    tournament: string
}


function getScoutersSelectOptions(scouters: ScouterDataType[]): any[] {
    const options = scouters.map((scouter) => {
        return <Select.Option key={scouter.key} value={scouter.key}>{scouter.firstname + " " + scouter.lastname}</Select.Option>
    })
    return options
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
            <>
                <Form.Item
                    name={record.key + "-0"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[0].key != "" ? 
                        //     `${record.chosenScouters[0].firstname} ${record.chosenScouters[0].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    },
    {
        title: 'Second Scouter',
        dataIndex: 'chosenScouters',
        key: 'secondScouter',
        render: (_, record) => (
            <>
                <Form.Item
                    name={record.key + "-1"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[1].key != "" ? 
                        //     `${record.chosenScouters[1].firstname} ${record.chosenScouters[1].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    },
    {
        title: 'Third Scouter',
        dataIndex: 'chosenScouters',
        key: 'thirdScouter',
        render: (_, record) => (
            <>
                <Form.Item
                    name={record.key + "-2"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[2].key != "" ? 
                        //     `${record.chosenScouters[2].firstname} ${record.chosenScouters[2].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    },
    {
        title: 'Fourth Scouter',
        dataIndex: 'chosenScouters',
        key: 'fourthScouter',
        render: (_, record) => (
            <>
                <Form.Item
                    name={record.key + "-3"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[3].key != "" ? 
                        //     `${record.chosenScouters[3].firstname} ${record.chosenScouters[3].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    },
    {
        title: 'Fifth Scouter',
        dataIndex: 'chosenScouters',
        key: 'fifthScouter',
        render: (_, record) => (
            <>
                <Form.Item
                    name={record.key + "-4"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[4].key != "" ? 
                        //     `${record.chosenScouters[4].firstname} ${record.chosenScouters[4].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    },
    {
        title: 'Sixth Scouter',
        dataIndex: 'chosenScouters',
        key: 'sixthScouter',
        render: (_, record) => (
            <>
                <Form.Item
                    name={record.key + "-5"}
                >
                    <Select
                        showSearch
                        allowClear
                        style={{ width: "200px" }}
                        // defaultValue={
                        //     record.chosenScouters[5].key != "" ? 
                        //     `${record.chosenScouters[5].firstname} ${record.chosenScouters[5].lastname}` 
                        //     : null
                        // }
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    }

];

export const QualsTable = ({ seasonYear, tournament}: QualTableProps) => {
    const [data, setdata] = useState<QualsTableDataType[]>([]);
    const [initialValues, setInitialValues] = useState<any>([]);
    const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)
    const [form] = Form.useForm<QualsTableDataType>();
    const seasonPath = `seasons/${seasonYear}`
    const tournementSubPath = `/competitions/${tournament}`

    const updateFirebase = async (qualsnum: string, scouterkeys: string[]) => {
        const filteredScouters = Object.assign({}, scouterkeys.map((scouter, index) => {
            if (scouter) {
                return [
                    scouter,
                    data[index].allScouters.find(function (scouter) { return scouter.key === scouterkeys[index] })?.firstname,
                    data[index].allScouters.find(function (scouter) { return scouter.key === scouterkeys[index] })?.lastname
                ]
            } else {
                return [null, null, null, null]
            }
        }));
        await updateData(`${seasonPath}${tournementSubPath}/Quals/${qualsnum}`, filteredScouters)
    }

    const finishHandler = () => {
        data.forEach((qualsTableData) => {
            let scouterKeys: string[] = []
            for (let i = 0; i < 6; i++) {
                scouterKeys.push(form.getFieldValue([`${qualsTableData.key}-${i}`]))
            }
            updateFirebase(qualsTableData.key, scouterKeys)
        })
    }

    const resetValues = (scouterKey: string, valueToChane: string) => {
        form.setFieldsValue({
            [scouterKey]: valueToChane
        })
    }

    const clickHandler = () => {
        let shuffledArray = arrayShuffle(data[0].allScouters)
        const slices = shuffledArray.length;
        data.forEach((qualsTableData) => {
            for (let i = 0; i < 6; i++) {
                if (shuffledArray[i].key != null) {
                    resetValues(`${qualsTableData.key}-${i}`, shuffledArray[i].key!)
                }
            }
            shuffledArray = arrayShuffle(data[0].allScouters)
        })

    }

    useEffect(() => {
        setIsFinishedLoading(false)

        async function getScoutes() {
            const teams = await getFieldValue(`seasons/${seasonYear}/scouting-teams`, "name")
            let scouters: { key: string, firstname: string, lastname: string }[] = []
            teams.forEach(async (team) => {
                let teamScouters = await getScouters(`${seasonPath}/scouting-teams/${team.fieldid}/scouters`)
                scouters = scouters.concat(teamScouters)
            })
            const matches = await getquals(`${seasonPath}${tournementSubPath}/Quals`)
            let tableData = matches.map((match) => {
                return ({ key: match.qual, match: match.qual, chosenScouters: match.scouters, allScouters: scouters })
            })
            tableData.sort((a, b) => parseInt(a.key.replace(/\D/g, '')) - parseInt(b.key.replace(/\D/g, '')))
            setdata(tableData)
            updateInitialValues(tableData)
        }

        async function updateInitialValues(data: QualsTableDataType[]) {
            let initialValues: any = {}
            data.forEach((qualsTableData) => {
                for (let i = 0; i < 6; i++) {
                    initialValues[`${qualsTableData.key}-${i}`] = qualsTableData.chosenScouters[i].key
                }
            })
            setInitialValues(initialValues)
        }

        getScoutes()
    }, [tournementSubPath]);

    useEffect(() => {
        if (data.length != 0) {
            setIsFinishedLoading(true)
        }
    }, [data])


    return (
        <div>
            {isFinishedLoading
                ? <>
                    <Form
                        form={form}
                        name="basic"
                        autoComplete="off"
                        onFinish={finishHandler}
                        initialValues={initialValues}
                    >
                        <Space>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item><Button onClick={clickHandler}>shuffle</Button>
                        </Space>
                        <Table dataSource={data} columns={columns} />
                    </Form>
                </>
                : <div style={{ marginTop: '10px' }}><Spin /></div>
            }
        </div>)

}
