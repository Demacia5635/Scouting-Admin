import { Form, Input, Modal } from "antd";
import { useState, useEffect } from "react";
import '../styles/popups/login-popup.css';
import { getUserFromDB, isUserExists } from "../utils/firebase";
import { isLoggedIn, login } from "../utils/user-handler";

type LoginProps = {
    loggedIn: boolean
}

export const Login = ({ loggedIn }: LoginProps) => {
    const [form] = Form.useForm();
    const [show, setShow] = useState(!loggedIn);

    const onLogin = async (values: any) => {
        const seasonYear = await isUserExists(values.username, values.password);

        if (seasonYear) {
            const user = await getUserFromDB(seasonYear, values.username);
            login(user);
            setShow(false);
        }
        else {
            form.setFields([
                {
                    name: 'username',
                    errors: ['Username or password is incorrect']
                }
            ])
        }
    }

    const onFail = (values: any, errorFields: any, outOfDate: boolean) => {
    }

    useEffect(() => {
        setShow(!loggedIn);
    }, [loggedIn])


    return (
        <Modal
            width={500}
            open={show}
            closable={false}
            centered
            className="login-form"
            title="Login"
            okText="Save" onOk={() => form.submit()}
            cancelButtonProps={{style: {display: 'none'}}}
        >
            <Form
                form={form}
                onFinish={(values) => {onLogin(values)}}
                onFinishFailed={({values, errorFields, outOfDate}) => {onFail(values, errorFields, outOfDate)}}
                layout={'horizontal'}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: 'Please enter the username'},
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: 'Please enter the password'},
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    )
}