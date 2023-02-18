import { Button, Form, Input, Modal, InputNumber} from "antd";
import { useState } from "react";
import { SeasonButtonProps } from "../types/Season";
import { PlusOutlined } from '@ant-design/icons';
import '../../styles/popups/new-season.css';
import { moveToSeasonEditor } from "../../utils/season-handler";
import { NavigateFunction } from "react-router";
import { InternalNamePath } from "rc-field-form/es/interface";
import { sendNotification } from "../../utils/notification";

type NewSeasonProps = {
    seasons: SeasonButtonProps[]
    navigator: NavigateFunction
}

export const NewSeason = ({seasons, navigator}: NewSeasonProps) => {
    const [form] = Form.useForm<SeasonButtonProps>();
    const [show, setShow] = useState(false);

    const openPopup = () => {
        setShow(true);
        console.log("openPopup")
    }

    const closePopup = () => {
        setShow(false);
    }
    
    const onFail = (values: SeasonButtonProps, errorFields: {name: InternalNamePath, errors: string[];}[], outOfDate: boolean) => {
        
    }

    const createNewSeason = (values: SeasonButtonProps) => {
        if (seasons.find(season => season.year === values.year)) {
            form.resetFields();
        }
        closePopup();
        
        moveToSeasonEditor({name: values.name, year: values.year}, navigator);
    };


    return (
        <div className="new-season">
            <Button className="plusbutton" type="primary" size="large" icon={<PlusOutlined />} onClick={() => openPopup()} />
            <Modal
                title={"New Season"}
                open={show}
                onCancel={() => closePopup()} cancelText="Cancel"
                okText="Save" onOk={() => form.submit()}
                className="form"
                centered
                width={500}>

                <Form
                    form={form}
                    onFinish={(values) => {createNewSeason(values)}}
                    onFinishFailed={({values, errorFields, outOfDate}) => {onFail(values, errorFields, outOfDate)}}
                    layout={'horizontal'}
                >
                    
                    <Form.Item
                        name="name"
                        label="Season Name"
                        rules={[{ required: true, message: 'Please input a name for the season' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="year"
                        label="Year"
                        rules={[
                            { required: true, message: 'Please input the year of the season', type: 'number', min: 1, max: 9999999},
                            { validator: (rule, value, callback) => {
                                if (seasons.find(season => parseInt(season.year) === value)) {
                                    callback("A season with this year already exists");
                                } else {
                                    callback();
                                }
                            }}
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}