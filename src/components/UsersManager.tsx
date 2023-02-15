import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Divider, Input, notification, Popconfirm, Space, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { addUserToFirebase, deleteUser, getUsers, updateUserInFirebase } from "../utils/firebase";
import { DataParamsModes } from "../utils/params/ParamItem";
import { UserEditor } from "./popups/UserEditor";
import { User } from "./types/User";
import type { NotificationPlacement } from 'antd/es/notification/interface';

type UsersManagerProps = {
    year: string;
    mode: DataParamsModes;
};

export enum UserTags {
    ADMIN = 'ADMIN',
    TEAM = 'TEAM'
}

export interface UsersDataType extends User{
    key: string;
    year: string;
}

export const UsersManager = ({ year, mode }: UsersManagerProps) => {

    const [data, setData] = useState<UsersDataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [api, contextHolder] = notification.useNotification();

    const updateUserList = (user: User) => {
        setData(data.map((item) => {
            if (item.key === user.username) {
                return {
                    key: user.username,
                    year: year,
                    ...user,
                };
            }
            return item;
        }));
    }

    const columns: ColumnsType<UsersDataType> = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Team Number',
            dataIndex: 'teamNumber',
            key: 'team',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Team Name',
            dataIndex: 'teamName',
            key: 'teamName',
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
                        if (tag === UserTags.ADMIN.toUpperCase()) {
                            color = 'volcano';
                        } else if (tag === UserTags.TEAM.toUpperCase()) {
                            color = 'green';
                        } else {
                            color = 'geekblue';
                        }

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
                    <UserEditor userData={record} seasonYear={year} newUser={false} onSave={
                        (user: User, isNew: boolean) => {
                            console.log(user);
                            updateUserInFirebase(year, user);
                            updateUserList(user);
                        }
                    } />
                </Space>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (text: string, record: UsersDataType) => (
                <Space size="middle">
                    {contextHolder}
                    <Popconfirm
                        title="Delete this user"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => {
                            if (record.tags.includes(UserTags.ADMIN.toUpperCase())) {
                                api.error({
                                    message: 'Cannot delete an admin user',
                                    description: 'Remove the admin tag first or delete the user from the firebase console instead.',
                                    placement: 'top',
                                    duration: 5
                                });
                                return;
                            }
                            deleteUser(year, record.username);
                            setData(data.filter((item) => item.key !== record.key));
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        }
    ];
    
    useEffect(() => {
        async function getUsersData() {
            const users: User[] = await getUsers(year);
            const usersData: UsersDataType[] = users.map((user) => {
                return {
                    key: user.username,
                    year: year,
                    ...user
                };
            });
            setData(usersData);
            setLoading(false);
        }
        getUsersData();
    }, []);
    
    if (mode !== DataParamsModes.USERS) return <></>;
    return (
        <div>
            <Space>
                <UserEditor userData={
                    {
                        username: '',
                        password: '',
                        teamNumber: '',
                        teamName: '',
                        tags: [],
                        key: '',
                        year: year
                    }
                } newUser={true} seasonYear={year} onSave={
                    (user: User, isNew: boolean) => {
                        addUserToFirebase(year, user);
                        setData(data => [...data, {
                            key: user.username,
                            year: year,
                            ...user
                        }]);
                    }
                } />
            </Space>
            <Divider />
            {loading ?
            <Spin size="large" /> :
            <Table columns={columns} dataSource={data}>

            </Table>}
            
        </div>
    );
};