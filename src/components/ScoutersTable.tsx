import { DeleteOutlined } from '@ant-design/icons';
import { Button, Divider, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { deleteDocument, getScouters } from '../utils/firebase';
import { FileUploader } from './FileUploader';
import NewScouterForm from './NewScouterForm';
import { currentteam } from './types/CurrentTeam';
import { ScouterDataType } from './types/TableDataTypes';




const columns: ColumnsType<ScouterDataType> = [
    {
        title: 'FirstName',
        dataIndex: 'firstname',
    },
    {
        title: 'LastName',
        dataIndex: 'lastname',
    },

];



const ScoutersTable = ({ currenteamnum }: currentteam) => {
    const [data, setdata] = useState<ScouterDataType[]>();
    const [scoutersNum, setScoutersNum] = useState<number>(0)
    const [selcetdScouters, setSelelcetdScouters] = useState<string[]>([])
    console.log(currenteamnum + " numrecived")
    const updateScoutersNum = (num: number) => {
        setScoutersNum(num)
    }
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: ScouterDataType[]) => {
            let selectedString: Array<string> = selectedRowKeys.map((selectedRowKey) => {
                return selectedRowKey + ""
            })

            setSelelcetdScouters(selectedString)
        },

    };

    useEffect(() => {
        async function setscouters() {
            const scouters = await getScouters("seasons/2019/teams/" + currenteamnum + "/scouters")
            setdata(scouters)

            console.log("setting length")
            setScoutersNum(data?.length || 0)
        }
        setscouters();

    }, [currenteamnum, scoutersNum, data?.length]);

    return (
        <div>
            <Divider />
            <Space>
                <NewScouterForm docPathToAdd={"seasons/2019/teams/" + currenteamnum + "/scouters/"} updateNumberOfScouts={updateScoutersNum}
                    numOfScouters={currenteamnum} chosenScouters={selcetdScouters} />
                <FileUploader scouterDocPath={"seasons/2019/teams/" + currenteamnum + "/scouters/"} numOfScouters={scoutersNum} updateNumberOfScouts={updateScoutersNum} scoutersToBeDeleted={selcetdScouters} />
                <Button icon={<DeleteOutlined />} onClick={() => {
                    for (const scouter of selcetdScouters) {
                        deleteDocument("seasons/2019/teams/" + currenteamnum + "/scouters/" + scouter)
                    }
                    setScoutersNum(scoutersNum - selcetdScouters.length)
                }}>
                </Button>
            </Space>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                pagination={
                    {
                        pageSize: 10
                    }
                }
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};

export default ScoutersTable;