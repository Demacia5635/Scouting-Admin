import { EditOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { getUsers } from "../utils/firebase";
import { DataParamsModes } from "../utils/params/ParamItem";
import { User } from "./types/User";

type UsersManagerProps = {
    year: string;
    mode: DataParamsModes;
};

enum UserTags {
    ADMIN = 'admin',
    TEAM = 'team'
}

interface UsersDataType extends User{
    key: string;
}

const columns: ColumnsType<UsersDataType> = [
    {
        title: 'Team',
        dataIndex: 'teamNumber',
        key: 'team',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        render: (text: string) => <a>{text}</a>,
    },
    {
        title: 'Password',
        dataIndex: 'password',
        key: 'password',
        render: (text: string) => (
            <Input.Password
                value={text}
                readOnly
                bordered={false}
                iconRender={(visible) =>
                    visible ? <EyeOutlined size={5}/> : <EyeInvisibleOutlined />
                }
                onChange={(e) => {
                    e.preventDefault();
                }}
            />
        )
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (tags: string[]) => (
            <>
                {tags.map(tag => {
                    let color;
                    console.log(tag)
                    if (tag === UserTags.ADMIN.toUpperCase()) {
                        color = 'volcano';
                    } else if (tag === UserTags.TEAM.toUpperCase()) {
                        color = 'green';
                    } else {
                        color = 'geekblue';
                    }
                    console.log(color)
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Edit',
        key: 'edit',
        render: (text: string, record: UsersDataType) => (
            <Space size="middle">
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
            </Space>
        ),
    },
    {
        title: 'Delete',
        key: 'delete',
        render: (text: string, record: UsersDataType) => (
            <Space size="middle">
                <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
            </Space>
        ),
    }
];

export const UsersManager = ({ year, mode }: UsersManagerProps) => {

    const [data, setData] = useState<UsersDataType[]>([]);
    
    useEffect(() => {
        async function getUsersData() {
            const users: User[] = await getUsers(year);
            console.log(users);
            const usersData: UsersDataType[] = users.map((user) => {
                return {
                    key: user.username,
                    ...user
                };
            });
            setData(usersData);
        }
        getUsersData();
    }, []);
    
    if (mode !== DataParamsModes.USERS) return <></>;
    return (
        <div>
            <Space>
                <Button style={{backgroundColor: '#9002b3'}} type="primary" shape="circle" size="large" icon={<UserAddOutlined />} />
            </Space>
            <Divider />
            <Table columns={columns} dataSource={data}>

            </Table>
        </div>
    );
};