import React, { useState } from 'react';
import { Divider, Radio, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { async } from '@firebase/util';
import { getscouters } from '../utils/firebase';
import { currentteam } from './types/CurrentTeam';



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

// const data: DataType[] = [
//     {
//         key: '1',
//         firstname: 'John',
//         lastname: "Brown",
//     },
//     {
//         key: '2',
//         firstname: 'Jim',
//         lastname: "Green",
//     },
//     {
//         key: '3',
//         firstname: 'Joe Black',
//         lastname: "Black",
//     },
//     {
//         key: '4',
//         firstname: 'Disabled User',
//         lastname: 'Sydney No. 1 Lake Park',
//     },
// ];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },

};

const ScoutersTable = ({ currenteamnum, currentteamname }: currentteam) => {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [data, setdata] = useState<DataType[]>()
    async function setscouters() {
        const scouters = await getscouters("seasons/2019/teams/" + currenteamnum + "/scouters")
        setdata(scouters)
    }
    setscouters();
    return (
        <div>

            <h1>{currentteamname}s scouters </h1>
            <Divider />

            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
};

export default ScoutersTable;