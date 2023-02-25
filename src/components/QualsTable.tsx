import { Button, Form, Select, Space, Spin, Table } from "antd";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import arrayShuffle from 'array-shuffle';
import { useEffect, useState } from "react";
import { getquals, getScouters, updateData } from "../utils/firebase";
import { QualsTableDataType, ScouterDataType } from "./types/TableDataTypes";

type QualTableProps = {
    seasonPath: string
    tournmentsSubPath: string
    scoutersSubPath: string
}


function getScoutersSelectOptions(scouters: ScouterDataType[]): any[] {
    const options = scouters.map((scouter) => {
        return (<Option key={scouter.key} value={scouter.key}>{scouter.firstname + " " + scouter.lastname}</Option>)
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
                    name={record.key + "0"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[0].firstname + " " + record.chosenScouters[0].lastname}
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
                    name={record.key + "1"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[1].firstname + " " + record.chosenScouters[1].lastname}
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
                    name={record.key + "2"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[2].firstname + " " + record.chosenScouters[2].lastname}
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
                    name={record.key + "3"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[3].firstname + " " + record.chosenScouters[3].lastname}
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
                    name={record.key + "4"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[4].firstname + " " + record.chosenScouters[4].lastname}
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
                    name={record.key + "5"}
                >
                    <Select
                        showSearch
                        style={{ width: "200px" }}
                        defaultValue={record.chosenScouters[5].firstname + " " + record.chosenScouters[5].lastname}
                        optionFilterProp="children"

                    >
                        {getScoutersSelectOptions(record.allScouters)}
                    </Select></Form.Item>
            </>
        )
    }

];

export const QualsTable = ({ seasonPath, tournmentsSubPath, scoutersSubPath }: QualTableProps) => {
    const [data, setdata] = useState<QualsTableDataType[]>([]);
    const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)
    const [form] = Form.useForm();

    const updateFirebase = async (qualsnum: string, scouterkeys: string[]) => {
        await updateData(seasonPath + tournmentsSubPath + "/" + qualsnum, {
            0: [scouterkeys[0],
            data[0].allScouters.find(function (scouter) { return scouter.key === scouterkeys[0] })?.firstname,
            data[0].allScouters.find(function (scouter) { return scouter.key === scouterkeys[0] })?.lastname],
            1: [scouterkeys[1],
            data[1].allScouters.find(function (scouter) { return scouter.key === scouterkeys[1] })?.firstname,
            data[1].allScouters.find(function (scouter) { return scouter.key === scouterkeys[1] })?.lastname],
            2: [scouterkeys[2],
            data[2].allScouters.find(function (scouter) { return scouter.key === scouterkeys[2] })?.firstname,
            data[2].allScouters.find(function (scouter) { return scouter.key === scouterkeys[2] })?.lastname],
            3: [scouterkeys[3],
            data[3].allScouters.find(function (scouter) { return scouter.key === scouterkeys[3] })?.firstname,
            data[3].allScouters.find(function (scouter) { return scouter.key === scouterkeys[3] })?.lastname],
            4: [scouterkeys[4],
            data[4].allScouters.find(function (scouter) { return scouter.key === scouterkeys[4] })?.firstname,
            data[4].allScouters.find(function (scouter) { return scouter.key === scouterkeys[4] })?.lastname],
            5: [scouterkeys[0],
            data[5].allScouters.find(function (scouter) { return scouter.key === scouterkeys[5] })?.firstname,
            data[5].allScouters.find(function (scouter) { return scouter.key === scouterkeys[5] })?.lastname]
        })
    }

    const finishHandler = () => {
        data.forEach((qualsTableData) => {
            let scouterKeys: string[] = []
            for (let i = 0; i < 6; i++) {
                scouterKeys.push(form.getFieldValue([qualsTableData.key + i]))
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
                resetValues(qualsTableData.key + "" + i, shuffledArray[i].key)
            }
            shuffledArray = arrayShuffle(data[0].allScouters)
        })

    }

    useEffect(() => {
        setIsFinishedLoading(false)

        async function getScoutes() {
            const scouters = await getScouters(/*seasonPath + scoutersSubPath*/"seasons/2019/teams/6969/scouters")
            const matches = await getquals(seasonPath + tournmentsSubPath)
            let tableData = matches.map((match) => {
                return ({ key: match.qual, match: match.qual, chosenScouters: match.scouters, allScouters: scouters })
            })
            setdata(tableData)
        }
        getScoutes()
    }, [tournmentsSubPath]);

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
