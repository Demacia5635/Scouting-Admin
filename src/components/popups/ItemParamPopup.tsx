import { BgColorsOutlined, EditFilled } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { getOpositeColor } from "../../utils/colors";
import { createParamFromDocument, ParamItem, ParamType, paramTypeSelectOptions, SpecialVisibility, typeVisibility } from "../../utils/params/ParamItem";
import "../../styles/popups/forms-popup.css";

type ItemParamPopupProps = {
    param?: ParamItem;
    handleChange?: (event?: any) => void;
}

export const ItemParamPopup = ({ param, handleChange }: ItemParamPopupProps) => {
    const [form] = Form.useForm<ParamItem>();
    const [buttonTitle, setButtonTitle] = useState(param ? param.displayName : 'Add New Param');
    const [show, setShow] = useState('none');
    const [backdropDisplay, setBackdropDisplay] = useState('none');

    const [paramItem, setParamItem] = useState<ParamItem | undefined>(param);

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
        setShow('block');
        setBackdropDisplay('block');
    }

    const saveParam = () => {
        const newParam = createParamFromDocument(document);
        setParamItem(newParam);
        setButtonTitle(newParam.displayName);
        closePopup();
    }

    const closePopup = (save: boolean=true) => {
        if (!save) resetParam();
        else setParamItem({...paramItem!, displayName: ''});

        setShow('none');
        setBackdropDisplay('none');
    }

    const resetParam = () => {
        setParamItem({
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
        closePopup();
    }

    const onFail


    return (
        <div className="popup">
            <div className="open" onClick={openPopup}>
                <Button onChange={handleChange}>{buttonTitle}</Button>
                <EditFilled className="edit-button" onClick={openPopup}></EditFilled>
            </div>
            <div className="form" style={{ display: show }}>
                <Form form={form} style={{ display: show , width: '350px'}} onFinish={(values) => {onSave(values)}}>
                    <Form.Item required className="param-name" label="Name" name="name">
                        <Input defaultValue={paramItem?.name}></Input>
                    </Form.Item>
                    <Form.Item className="param-display-name" label="Display Name" name="displayName">
                        <Input defaultValue={paramItem?.displayName}></Input>
                    </Form.Item>
                    <Form.Item className="param-type" label="Type" name="type">
                        <Select className="type-select" defaultValue={paramItem?.type} maxTagCount={1} placeholder="Select param type" id="param-type-list" options={paramTypeSelectOptions} onChange={
                            (value) => {
                                const stepRow = document.querySelector('.param-step');
                                const minValueRow = document.querySelector('.param-min-value');
                                const maxValueRow = document.querySelector('.param-max-value');
                                if (stepRow) stepRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.STEP, value)}`);
                                if (minValueRow) minValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MIN, value)}`);
                                if (maxValueRow) maxValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MAX, value)}`);
                                setParamItem({...paramItem!, type: value as ParamType});
                            }
                        }></Select>
                    </Form.Item>
                    <Form.Item className="param-color" label="Color" name="color">
                        <Input className="color-picker-input" style={{ backgroundColor: paramItem?.color, color: getOpositeColor(paramItem?.color!) }} value={paramItem?.color}
                            onChange={(e) => {
                                if (e.target.value.length > 7) e.target.value = e.target.value.slice(0, 7);
                                if (e.target.value[0] !== '#') e.target.value = '#' + e.target.value;
                                setParamItem({...paramItem!, color: e.target.value});
                            }}
                        ></Input>
                        <Button className="color-picker-button" onClick={() => setColorPicker(!colorPicker)} icon={<BgColorsOutlined/>}></Button>
                        <HexColorPicker className="color-picker" color={paramItem?.color} onChange={
                            (color) => {
                                setParamItem({...paramItem!, color: color});
                            }
                        } style={{ display: colorPicker ? 'inline-flex' : 'none' }} />
                    </Form.Item>
                    <Form.Item className="param-step" label="Step" style={{ display: typeVisibility(SpecialVisibility.STEP, param?.type) }} name="step">
                        <InputNumber min={0} defaultValue={paramItem?.step}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-min-value" label="Min Value" style={{ display: typeVisibility(SpecialVisibility.MIN, param?.type) }} name="min">
                        <InputNumber min={0} defaultValue={paramItem?.min}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-max-value" label="Max Value" style={{ display: typeVisibility(SpecialVisibility.MAX, param?.type) }} name="max">
                        <InputNumber min={0} defaultValue={paramItem?.max}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-default-value" label="Default Value" name="defaultValue">
                        <Input defaultValue={paramItem?.defaultValue?.toString()}></Input>
                    </Form.Item>
                    <Form.Item className="buttons">
                        <Button className="cancel" type="primary" onClick={() => closePopup(false)}>Cancel</Button>
                        <Button className="save" htmlType="submit" type="primary">Save</Button>
                    </Form.Item>
                </Form>
            </div>
            <div
                style={{
                    display: backdropDisplay,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1
                }}
            />
        </div >
    );
}