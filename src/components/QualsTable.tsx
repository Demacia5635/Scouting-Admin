import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, Table } from "antd";
import { StoreValue } from "antd/es/form/interface";
import { Option } from "antd/es/mentions";
import { ColumnsType } from "antd/es/table";
import arrayShuffle from 'array-shuffle';
import { useEffect, useState } from "react";
import { addMatch, getFieldValue, getquals, getScouters, updateData } from "../utils/firebase";
import { QualsFileUploader } from "./QualsFileUploader";
import { QualsTableDataType, ScouterDataType } from "./types/TableDataTypes";
import Search from "antd/es/input/Search";

type QualTableProps = {
    seasonYear: string
    tournament: string
    Tournmentlvl: string
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

export const QualsTable = ({ seasonYear, tournament, Tournmentlvl }: QualTableProps) => {
    const [data, setdata] = useState<QualsTableDataType[]>([]);
    const [tournamentLevel, setTournamentLevel] = useState<string>("Practices")
    const [initialValues, setInitialValues] = useState<any>([]);
    const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)
    const [form] = Form.useForm<QualsTableDataType>();
    const [newmatchform] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reLoadData, setReLoadData] = useState<boolean>(false)
    const seasonPath = `seasons/${seasonYear}`
    const tournementSubPath = `/competitions/${tournament}`
    const workpls = Tournmentlvl
    const updateTable = () => {
        setReLoadData(!reLoadData)
    }


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        let firstteamnum = "" + newmatchform.getFieldValue("team1")
        let secondteamnum = "" + newmatchform.getFieldValue("team2")
        let thirdeamnum = "" + newmatchform.getFieldValue("team3")
        let fourthteamnum = "" + newmatchform.getFieldValue("team4")
        let fifthteamnum = "" + newmatchform.getFieldValue("team5")
        let sixthteamnum = "" + newmatchform.getFieldValue("team6")
        let teamnum = "" + newmatchform.getFieldValue("matchNum")
        if (tournamentLevel == "Quals") {
            teamnum = "Qual" + teamnum
        } else if (tournamentLevel == "Playoffs") {
            teamnum += "Match" + teamnum
        } else if (tournamentLevel == "Practices") {
            teamnum += "Practice" + teamnum
        }
        // switch (tournamentLevel) {
        //     case "Quals": {
        //         teamnum = "Qual" + teamnum
        //     }
        //     case "Playoffs": {
        //         teamnum += "Match" + teamnum
        //     }
        //     case "Practices": {
        //         teamnum += "Practice" + teamnum
        //     }
        // }
        await addMatch(tournament, seasonYear, [firstteamnum, secondteamnum, thirdeamnum, fourthteamnum, fifthteamnum, sixthteamnum]
            , tournamentLevel, teamnum)


        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const updateFirebase = async (qualsnum: string, scouterkeys: string[]) => {
        const filteredScouters = Object.assign({}, scouterkeys.map((scouter, index) => {
            if (scouter != "") {
                return [
                    scouter,
                    data[index].allScouters.find(function (scouter) { return scouter.key === scouterkeys[index] })?.firstname,
                    data[index].allScouters.find(function (scouter) { return scouter.key === scouterkeys[index] })?.lastname
                ]
            } else {
                return [null, null, null]
            }
        }));
        await updateData(`${seasonPath}${tournementSubPath}/${Tournmentlvl}/${qualsnum}`, filteredScouters, true);
    }

    const finishHandler = () => {
        data.forEach((qualsTableData) => {
            let scouterKeys: string[] = []
            for (let i = 0; i < 6; i++) {
                const value = form.getFieldValue([`${qualsTableData.key}-${i}`])
                scouterKeys.push(value == " " || value == undefined ? "" : value)
            }
            updateFirebase(qualsTableData.key, scouterKeys)
        })
    }

    const resetValues = (scouterKey: string, valueToChane: string) => {
        form.setFieldsValue({
            [scouterKey]: valueToChane
        })
    }

    const onSearch = (value: String) => {
        function doesContain(qual: QualsTableDataType) {
            let doesContain = false
            qual.chosenScouters.forEach(scouter => {
                let scouterFullName = scouter.firstname + " " + scouter.lastname
                if (scouterFullName.toLowerCase().includes(value.toLowerCase())) {
                    doesContain = true;
                }
            })
            return doesContain;
        }
        let filteredData = data.filter(doesContain)
        setdata(filteredData);

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
            let scouters: ScouterDataType[] = []
            teams.forEach(async (team) => {
                let teamScouters = await getScouters(`${seasonPath}/scouting-teams/${team.fieldid}/scouters`)
                scouters = scouters.concat(teamScouters)
            })

            let matches = await getquals(`${seasonPath}${tournementSubPath}/${Tournmentlvl}`)
            let tableData = matches.map((match) => {
                return ({ key: match.qual, match: match.qual, chosenScouters: match.scouters, allScouters: scouters })
            })
            console.log(tableData)
            console.log(tableData[0].allScouters)
            tableData.sort((a, b) => parseInt(a.key.replace(/\D/g, '')) - parseInt(b.key.replace(/\D/g, '')))
            setdata(tableData)
            updateInitialValues(tableData)
        }

        async function updateInitialValues(data: QualsTableDataType[]) {
            let initialValues: any = {}
            data.forEach((qualsTableData) => {
                for (let i = 0; i < 6; i++) {
                    const scouter = qualsTableData.chosenScouters[i]
                    // const value = {
                    //     key: 
                    //     // label: scouter ? `${scouter.firstname} ${scouter.lastname}` : null,
                    //     // value: scouter ? scouter.key : null
                    // }
                    initialValues[`${qualsTableData.key}-${i}`] = scouter ? scouter.key : null
                }
            })
            setInitialValues(initialValues)
        }

        getScoutes()
    }, [tournementSubPath, Tournmentlvl]);

    useEffect(() => {
        if (data.length !== 0) {
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
                                <Search placeholder="input search text" onSearch={onSearch} enterButton />
                                <Button type="primary" onClick={showModal}> new match</Button>
                                <Modal title="Basic Modal" open={isModalOpen} okText={"submit"} onOk={handleOk} onCancel={handleCancel}>
                                    <Form
                                        form={newmatchform}
                                        name="newmatch"
                                        autoComplete="off">
                                        <Select
                                            placeholder="please choose tournement level"
                                            onChange={(value: string) => {
                                                setTournamentLevel(value)
                                            }}>

                                            <Option value="Quals">Quals</Option>
                                            <Option value="Practices">Practices</Option>
                                            <Option value="Playoffs">Playoffs</Option>
                                        </Select>
                                        <Form.Item
                                            name={"matchNum"}>
                                            <Input placeholder="enter Match Number" />;
                                        </Form.Item>
                                        <p>please enter first team number</p>
                                        <Form.Item
                                            name={"team1"}>
                                            <InputNumber />;
                                        </Form.Item>
                                        <p>please enter second team number</p>
                                        <Form.Item
                                            name={"team2"}>
                                            <InputNumber />;
                                        </Form.Item>
                                        <p>please enter third team number</p>
                                        <Form.Item
                                            name={"team3"}>
                                            <InputNumber />;
                                        </Form.Item>
                                        <p>please enter fourth team number</p>
                                        <Form.Item
                                            name={"team4"}>
                                            <InputNumber />;
                                        </Form.Item>
                                        <p>please enter fifth team number</p>
                                        <Form.Item
                                            name={"team5"}>
                                            <InputNumber />;
                                        </Form.Item>
                                        <p>please enter sixth team number</p>
                                        <Form.Item
                                            name={"team6"}>
                                            <InputNumber />;
                                        </Form.Item>
                                    </Form>

                                </Modal>
                            </Form.Item>
                            <Button onClick={clickHandler}>shuffle</Button>
                            <QualsFileUploader tournementLvl={Tournmentlvl} data={data} seasonPath={seasonPath} tournementSubPath={tournementSubPath} updateTable={updateTable} />
                        </Space>
                        <Table dataSource={data} columns={columns} />
                    </Form>
                </>
                : <div style={{ marginTop: '10px' }}><Spin /></div>
            }
        </div>)

}
