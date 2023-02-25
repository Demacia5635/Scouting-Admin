import { EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Tag } from "antd";
import { InternalNamePath } from "antd/es/form/interface";
import { useEffect, useState } from "react";
import '../../styles/popups/user-editor.css';
import { getUsernames } from "../../utils/firebase";
import { User } from "../types/User";
import { UsersDataType, UserTags } from "../UsersManager";

type UserEditorProps = {
    userData: UsersDataType;
    onSave: (user: User, isNew: boolean) => void;
    newUser: boolean;
    seasonYear: string;
};

export const UserEditor = ({ userData, onSave: handleSave, newUser, seasonYear}: UserEditorProps) => {

    const [form] = Form.useForm<User>();
    const [user, setUser] = useState<User>(userData);
    const [oldUser, setOldUser] = useState<User>(userData);
    const [show, setShow] = useState(false);
    const [existingUsernames, setExistingUsernames] = useState<string[]>([]);

    useEffect(() => {
        async function fetchUsernames() {
            const usernames = await getUsernames(seasonYear);
            setExistingUsernames(usernames);
        }
        fetchUsernames();
    }, [seasonYear]);

    const openPopup = () => {
        setShow(true);
        setOldUser(user);
    }

    const closePopup = (save: boolean=true) => {
        if (!save) {
            form.setFieldsValue(oldUser!);
            setUser(oldUser);
        }

        setShow(false);
    }

    const onSave = (values: User) => {
        if (!values.username) values.username = user.username;
        setUser({...values});
        if (newUser) {
            form.resetFields();
        }

        handleSave(values, newUser);

        closePopup();
    }

    const onFail = (values: User, errorFields: {name: InternalNamePath, errors: string[];}[], outOfDate: boolean) => {
        
    }

    return (
        <div>
            <Button
                type="primary"
                shape="circle"
                size={newUser ? 'large' : 'middle'}
                icon={newUser ? <UserAddOutlined /> : <EditOutlined />} onClick={openPopup}
                style={{backgroundColor: newUser ? '#9002b3' : ''}} />
            <Modal
                title={newUser ? 'Add User' : 'Editing user: ' + user.username}
                open={show}
                onCancel={() => closePopup(false)} cancelText="Cancel"
                okText="Save" onOk={() => form.submit()}
                className="form"
                centered
                width={500}>

                <Form
                    form={form}
                    onFinish={(values) => {onSave(values)}}
                    onFinishFailed={({values, errorFields, outOfDate}) => {onFail(values, errorFields, outOfDate)}}
                    layout={'horizontal'}
                    initialValues={user}>

                    {newUser ?
                        <Form.Item
                            rules={[
                                { required: true, message: 'Please enter the username'},
                                { validator: (_, value) => {
                                    if (existingUsernames.includes(value)) {
                                        return Promise.reject('Username already exists');
                                    }
                                    return Promise.resolve();
                                }}
                            ]}
                            className="param-username"
                            name="username"
                            label="Username">
                            <Input />
                        </Form.Item>
                        : null
                    }

                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the team number', type: 'number', min: 1, max: 9999}]}
                        className="param-team-number"
                        name="teamNumber"
                        label="Team Number">
                        <InputNumber />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the team name'}]}
                        className="param-team-name"
                        name="teamName"
                        label="Team Name">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the password'}]}
                        className="param-password"
                        name="password"
                        label="Password">
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the tags'}]}
                        className="param-tags"
                        name="tags"
                        label="Tags">
                        <Select className="tags-select" mode="multiple">
                            <Select.Option value={UserTags.ADMIN}>
                                <Tag color="volcano">{UserTags.ADMIN}</Tag>
                            </Select.Option>
                            <Select.Option value={UserTags.TEAM}>
                                <Tag color="green">{UserTags.TEAM}</Tag>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}