import { PlusSquareOutlined } from "@ant-design/icons"
import { Button, Form, Input, Modal } from "antd"
import { useState } from "react"
import { deleteDocument, updateData } from "../utils/firebase"
import { v4 as uuid } from 'uuid'

type Item = {
    firstname: string
    lastname: string
}
type DocProps = {
    docPathToAdd: string
    updateNumberOfScouts: (num: number) => void
    numOfScouters: number
    chosenScouters: string[]
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const NewScouterForm = ({ docPathToAdd, updateNumberOfScouts, numOfScouters, chosenScouters }: DocProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = (values: Item) => {
        let newNumOfScouters = numOfScouters + 1;
        updateData(docPathToAdd + "scouter" + uuid(), { firstname: values.firstname, lastname: values.lastname })

        chosenScouters.map(async (scouter) => {
            await deleteDocument(docPathToAdd + scouter)
        })

        newNumOfScouters -= chosenScouters.length
        updateNumberOfScouts(newNumOfScouters)
        setIsModalOpen(false);
    };

    return (
        <>
            <Button onClick={showModal} icon={<PlusSquareOutlined />}></Button>
            <Modal
                onCancel={handleCancel}
                open={isModalOpen}
                footer={[]}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="FirstName"
                        name="firstname"
                        rules={[{ required: true, message: 'Please input the scouter`s firstname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="LastName"
                        name="lastname"
                        rules={[{ required: true, message: 'Please input the scouter`s lastname!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default NewScouterForm