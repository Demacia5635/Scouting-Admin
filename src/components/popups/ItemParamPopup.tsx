import { BgColorsOutlined, EditFilled } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { getOpositeColor } from "../../utils/colors";
import { isSpecialRequired, ParamItem, ParamType, paramTypeSelectOptions, SpecialVisibility } from "../../utils/params/ParamItem";
import "../../styles/popups/forms-popup.css";
import { InternalNamePath } from "antd/es/form/interface";

type ItemParamPopupProps = {
    param?: ParamItem;
    handleChange?: (event?: any) => void;
}

export const ItemParamPopup = ({ param, handleChange }: ItemParamPopupProps) => {
    const [form] = Form.useForm<ParamItem>();
    const [buttonTitle, setButtonTitle] = useState(param ? param.displayName : 'Add New Param');
    const [buttonBackground, setButtonBackground] = useState(param ? param.color : '#FFFFFF');
    const [show, setShow] = useState(false);

    const [paramItem, setParamItem] = useState<ParamItem | undefined>(param);
    const [oldParamItem, setOldParamItem] = useState<ParamItem | undefined>(paramItem);
    const [stepRequired, setStepRequired] = useState(paramItem?.type === ParamType.SLIDER);
    const [minRequired, setMinRequired] = useState(paramItem?.type === ParamType.SLIDER || paramItem?.type === ParamType.NUMBER)
    const [maxRequired, setMaxRequired] = useState(paramItem?.type === ParamType.SLIDER || paramItem?.type === ParamType.NUMBER)


    const [colorPicker, setColorPicker] = useState(false);

    useEffect(() => {
        if (paramItem) {
            setParamItem(lastParam  => ({ 
                ...lastParam as ParamItem,
                step: lastParam?.step || 0,
                min: lastParam?.min || 0,
                max: lastParam?.max || 0,
                defaultValue: lastParam?.defaultValue || '',
            }));
        } else {
            resetParam();
        }
    }, [show]);

    const openPopup = () => {
        setShow(true);
        setOldParamItem(paramItem);
    }

    const closePopup = (save: boolean=true) => {
        if (!save) {
            form.setFieldsValue(oldParamItem!);
            setParamItem(oldParamItem);
            setStepRequired(isSpecialRequired(oldParamItem?.type, SpecialVisibility.STEP));
            setMinRequired(isSpecialRequired(oldParamItem?.type, SpecialVisibility.MIN));
            setMaxRequired(isSpecialRequired(oldParamItem?.type, SpecialVisibility.MAX));
        }

        setShow(false);
    }

    const resetParam = () => {
        form.setFieldsValue({
            name: '',
            displayName: '',
            type: ParamType.TEXT,
            color: '#FFFFFF',
            step: 0,
            min: 0,
            max: 0,
            defaultValue: '',
        });
    }

    const onSave = (values: ParamItem) => {
        setParamItem(values);
        setButtonTitle(values.displayName);
        setButtonBackground(values.color);

        closePopup();
    }

    const onFail = (values: ParamItem, errorFields: {name: InternalNamePath, errors: string[];}[], outOfDate: boolean) => {
        
    }


    return (
        <div className="popup">
            <Space style={{}}>
                <Button onChange={handleChange} style={{backgroundColor: buttonBackground, border: '0px'}}>{buttonTitle}</Button>
                <EditFilled className="edit-button" onClick={openPopup}></EditFilled>
            </Space>
            <Modal
                title="Parameter"
                open={show}
                onCancel={() => closePopup(false)} cancelText="Cancel"
                okText="Save" onOk={() => form.submit()}
                className="form"
                centered
                width={500}
            >
                <Form
                    form={form}
                    onFinish={(values) => {onSave(values)}}
                    onFinishFailed={({values, errorFields, outOfDate}) => {onFail(values, errorFields, outOfDate)}}
                    layout={'horizontal'}
                    initialValues={paramItem}
                >
                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the name'}]}
                        className="param-name"
                        label="Name" name="name"
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true, message: 'Please enter the display name'}]}
                        className="param-display-name"
                        label="Display Name" name="displayName"
                    >
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: true, message: 'Please select type'}]}
                        className="param-type"
                        label="Type" name="type"
                    >
                        <Select className="type-select" maxTagCount={1} placeholder="Select param type" id="param-type-list" options={paramTypeSelectOptions} onChange={
                            (value) => {
                                const newType = value as ParamType;
                                setParamItem({...paramItem!, type: newType});
                                setStepRequired(isSpecialRequired(newType, SpecialVisibility.STEP));
                                setMinRequired(isSpecialRequired(newType, SpecialVisibility.MIN));
                                setMaxRequired(isSpecialRequired(newType, SpecialVisibility.MAX));
                            }
                        }></Select>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            { required: true, message: 'Please enter the color'},
                            { pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, message: 'Please enter a valid color'}
                        ]}
                        className="param-color"
                        label="Color" name="color"
                    >
                        <Space>
                            <Form.Item name="color"noStyle>
                                <Input className="color-picker-input" style={{ backgroundColor: paramItem?.color, color: getOpositeColor(paramItem?.color!) }} value={paramItem?.color}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (value.length > 7) value = value.slice(0, 7);
                                        if (value[0] !== '#') value = '#' + value;
                                        form.setFieldsValue({color: value});
                                        setParamItem({...paramItem!, color: value});
                                    }}
                                ></Input>
                            </Form.Item>
                            <Button className="color-picker-button" onClick={() => setColorPicker(!colorPicker)} icon={<BgColorsOutlined/>}></Button>
                        </Space>
                        <HexColorPicker className="color-picker" color={paramItem?.color} onChange={
                                (color) => {
                                    form.setFieldsValue({color: color});
                                    setParamItem({...paramItem!, color: color});
                                }
                        } style={{ display: colorPicker ? 'inline-flex' : 'none' }} />
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: stepRequired, message: 'Please enter the amount of steps'}]}
                        className="param-step"
                        style={{ display: stepRequired ? 'block' : 'none' }}
                        label="Step" name="step"
                    >
                        <InputNumber min={0}></InputNumber>
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: minRequired, message: 'Please enter the minimum value'}]}
                        className="param-min-value"
                        style={{ display: minRequired ? 'block' : 'none' }}
                        label="Min Value" name="min"
                    >
                        <InputNumber min={0}></InputNumber>
                    </Form.Item>
                    <Form.Item
                        rules={[{ required: maxRequired, message: 'Please enter the maximum value'}]}
                        className="param-max-value"
                        style={{ display: maxRequired ? 'block' : 'none' }}
                        label="Max Value" name="max"
                    >
                        <InputNumber min={0}></InputNumber>
                    </Form.Item>
                    <Form.Item
                        className="param-default-value"
                        label="Default Value" name="defaultValue"
                    >
                        <Input></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}