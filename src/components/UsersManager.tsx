import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Divider, Input, notification, Popconfirm, Space, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { addUserToFirebase, deleteUser, getUsers, updateUserInFirebase } from "../utils/firebase";
import { sendNotification } from "../utils/notification";
import { DataParamsModes } from "../utils/params/ParamItem";
import { UserEditor } from "./popups/UserEditor";
import { User } from "./types/User";

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

    const saveUser = (user: User, isNew: boolean) => {

        if (isNew) {
            addUserToFirebase(year, user).then(() => {
                sendNotification(api, 'success', 'User Added',
                                `User ${user.username} has been added to the database.`, 'bottomRight');
            }).catch((error) => {
                sendNotification(api, 'error', 'Error Adding User',
                                `There was an error adding user ${user.username} to the database. ${error}`, 'bottomRight');
            });
            setData([...data, {
                key: user.username,
                year: year,
                ...user,
            }]);
        } else {
            updateUserInFirebase(year, user).then(() => {
                sendNotification(api, 'success', 'User Updated',
                                `User ${user.username} has been updated in the database.`, 'bottomRight');
            }).catch((error) => {
                sendNotification(api, 'error', 'Error Updating User',
                                `There was an error updating user ${user.username} in the database. ${error}`, 'bottomRight');
            });
            updateUserList(user);
        }
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
                    <UserEditor userData={record} newUser={false} onSave={saveUser} seasonYear={year}/>
                </Space>
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (text: string, record: UsersDataType) => (
                <Space size="middle">
                    <Popconfirm
                        title="Delete this user"
                        description="Are you sure you want to delete this user?"
                        onConfirm={() => {
                            if (record.tags.includes(UserTags.ADMIN.toUpperCase())) {
                                sendNotification(api, 'error', 'Cannot Delete Admin User',
                                                'Remove the admin tag first or delete the user from the firebase console instead.',
                                                'bottomRight');
                                return;
                            }
                            deleteUser(year, record.username);
                            setData(data.filter((item) => item.key !== record.key));
                            sendNotification(api, 'success', 'User Deleted', `User ${record.username} has been deleted from the database.`,
                                            'bottomRight');
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
            {contextHolder}
            <Space>
                <UserEditor seasonYear={year} userData={
                    {
                        username: '',
                        password: '',
                        teamNumber: '',
                        teamName: '',
                        tags: [],
                        key: '',
                        year: year
                    }
                } newUser={true} onSave={saveUser} />
            </Space>
            <Divider />
            {loading ?
            <Spin size="large" /> :
            <Table columns={columns} dataSource={data}>

            </Table>}
            
        </div>
    );
};