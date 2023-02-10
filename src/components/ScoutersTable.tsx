import React, { useEffect, useState } from 'react';
import { Button, Divider, Radio, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { async } from '@firebase/util';
import { deleteDocument, getscouters } from '../utils/firebase';
import { currentteam } from './types/CurrentTeam';
import { FileUploader } from './FileUploader';
import { Console } from 'console';
import { DeleteOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { deleteDoc } from 'firebase/firestore/lite';
import NewScouterForm from './NewScouterForm';


interface DataType {
    key: React.Key;
    firstname: string;
    lastname: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'FirstName',
        dataIndex: 'firstname',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'LastName',
        dataIndex: 'lastname',
    },

];



const ScoutersTable = ({ currenteamnum }: currentteam) => {
    const [data, setdata] = useState<DataType[]>();
    const [scoutersNum, setscoutersNum] = useState<number>(0)
    const [selcetdScouters, setSelelcetdScouters] = useState<string[]>([])
    console.log(currenteamnum + " numrecived")
    const updateScoutersNum = (num: number) => {
        setscoutersNum(num)
    }
    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            let selectedString: Array<string> = []
            selectedRowKeys.map((selectedRowKey) => {
                selectedString.push(selectedRowKey + "")
            })
            setSelelcetdScouters(selectedString)
            console.log('selected keys', selcetdScouters)
        },

    };
    useEffect(() => {
        async function setscouters() {
            const scouters = await getscouters("seasons/2019/teams/" + currenteamnum + "/scouters")
            setdata(scouters)

            console.log("setting length")
            setscoutersNum(data?.length || 0)
        }
        setscouters();

    }, [currenteamnum, scoutersNum]);

    return (
        <div>
            <Divider />
            <Space>
                <NewScouterForm docPathToAdd={"seasons/2019/teams/" + currenteamnum + "/scouters/"} updateNumberOfScouts={updateScoutersNum}
                    numOfScouters={currenteamnum} chosenScouters={selcetdScouters} />
                <FileUploader scouterDocPath={"seasons/2019/teams/" + currenteamnum + "/scouters/"} numOfScouters={scoutersNum} updateNumberOfScouts={updateScoutersNum} scoutersToBeDeleted={selcetdScouters} />
                <Button icon={<DeleteOutlined />} onClick={() => {

                    selcetdScouters.map((selcetedScouter) => {
                        deleteDocument("seasons/2019/teams/" + currenteamnum + "/scouters/" + selcetedScouter)
                    })
                    setscoutersNum(scoutersNum - selcetdScouters.length)

                }}></Button></Space>
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