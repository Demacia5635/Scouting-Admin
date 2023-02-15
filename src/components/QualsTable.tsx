import { Button, Select, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RefSelectProps } from 'antd/lib/select';
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import arrayShuffle from 'array-shuffle';
import { getFieldValue, getquals, getscouters } from "../utils/firebase";
import { QualsTableDataType, ScouterDataType } from "./types/TableDataTypes";
import { SELECTION_ALL } from "antd/es/table/hooks/useSelection";
import { TypeOfTag } from "typescript";

type QulTableProps = {
    seasonPath: string
    tournmentsSubPath: string
    scoutersSubPath: string
}



// function getScoutersOptions(scouters: ScouterDataType[]): JSX.Element[] {
//     const options = scouters.map((scouter) => {
//         if (scouter.key == undefined) {

//             return (<option key="{scouter.key}" value="{scouter.key}">{"whyyyy"}</option>)
//         } else {
//             return (<option key={scouter.key} value={scouter.key}>{scouter.firstname + " " + scouter.lastname}</option>)
//         }
//     })
//     return options
// }




export const QualsTable = ({ seasonPath, tournmentsSubPath, scoutersSubPath }: QulTableProps) => {
    const [data, setdata] = useState<QualsTableDataType[]>([]);
    const selectRef = useRef<RefSelectProps>(null)
    const [isFinishedLoading, setIsFinishedLoading] = useState<boolean>(false)
    const clearselected = () => {
        selectRef.relect
        // const nultipleSelect = <>document.getElementById("deez")
    }
    const clickHandler = () => {
        let shuffledarray = arrayShuffle(data[0].allScouters)
        const slices = shuffledarray.length;
        const newdata = data.map((qualTableType) => {
            shuffledarray = arrayShuffle(data[0].allScouters)
            return ({ key: qualTableType.key, match: qualTableType.match, chosenScouters: shuffledarray.slice((slices - 6), (slices + 1)), allScouters: qualTableType.allScouters })
        })
        setdata(newdata)
    }
    useEffect(() => {
        async function getScoutes() {
            const scouters = await getscouters(/*seasonPath + scoutersSubPath*/"seasons/2019/teams/6969/scouters")
            const matches = await getquals(seasonPath + tournmentsSubPath)
            let tableData = matches.map((match) => {
                if (match.scouters == undefined) {
                    console.log("why????")
                }
                console.log(match)
                console.log(scouters)
                return ({ key: match.qual, match: match.qual, chosenScouters: match.scouters, allScouters: scouters })
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
                    ref={selectRef}
                    placeholder={record.chosenScouters[0].firstname + " " + record.chosenScouters[0].lastname}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={record.allScouters.map((scouter) => {
                        return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
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
                    id="deez"
                    placeholder={record.chosenScouters[1].firstname + " " + record.chosenScouters[1].lastname}
                    options={record.allScouters.map((scouter) => {
                        return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
                    })} />
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
                    placeholder={record.chosenScouters[2].firstname + " " + record.chosenScouters[2].lastname}
                    options={record.allScouters.map((scouter) => {
                        return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
                    })} />
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
                    placeholder={record.chosenScouters[3].firstname + " " + record.chosenScouters[3].lastname}
                    options={record.allScouters.map((scouter) => {
                        return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
                    })} />
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
                    placeholder={record.chosenScouters[4].firstname + " " + record.chosenScouters[4].lastname}
                    options={record.allScouters.map((scouter) => {
                        return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
                    })} />
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
                    placeholder={record.chosenScouters[4].firstname + " " + record.chosenScouters[4].lastname}
                    defaultValue={{ value: (record.chosenScouters[5].key) }}
                    options={
                        record.allScouters.map((scouter) => {
                            return ({ value: (scouter.key), label: (scouter.firstname + " " + scouter.lastname) })
                        })
                    } />
                )
            }
        }

    ];


    return (
        <div>
            <Button onClick={clearselected}>deez</Button>
            {isFinishedLoading
                ? <>
                    <Button onClick={clickHandler}>shuffle</Button>
                    <Table dataSource={data} columns={columns} /></>
                : <div style={{ marginTop: '10px' }}><Spin /></div>


            }
        </div>)

}
