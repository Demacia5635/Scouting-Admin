import { BgColorsOutlined, EditFilled } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { getOpositeColor } from "../../utils/colors";
import { createParamFromDocument, ParamItem, ParamType, paramTypeSelectOptions, SpecialVisibility, typeVisibility } from "../../utils/params/ParamItem";
import "../../styles/popups/forms-popup.css";

type ItemParamPopupProps = {
    param?: ParamItem;
}

export const ItemParamPopup = ({ param }: ItemParamPopupProps) => {
    const button = <Button>{param?.displayName}</Button>;
    const [show, setShow] = useState('none');
    const [backdropDisplay, setBackdropDisplay] = useState('none');

    const [name, setName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [type, setType] = useState(ParamType.TEXT);
    const [color, setColor] = useState('#FFFFFF');
    const [step, setStep] = useState(0);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [defaultValue, setDefaultValue] = useState('');

    const [colorPicker, setColorPicker] = useState(false);

    useEffect(() => {
        if (param) {
            setName(param.name);
            setDisplayName(param.displayName);
            setType(param.type);
            setColor(param.color);
            param.step ? setStep(param.step) : setStep(0);
            param.min ? setMinValue(param.min) : setMinValue(0);
            param.max ? setMaxValue(param.max) : setMaxValue(0);
            param.defaultValue ? setDefaultValue(param.defaultValue.toString()) : setDefaultValue('');
        }
    }, [show]);

    const openPopup = () => {
        setShow('block');
        setBackdropDisplay('block');
    }

    const saveParam = () => {
        const newParam = createParamFromDocument(document);
        console.log(newParam);
        param ? param.update(newParam) : param = newParam;
        closePopup();
    }

    const closePopup = () => {
        setShow('none');
        setBackdropDisplay('none');
    }


    return (
        <div className="popup">
            <div className="open" onClick={openPopup}>
                {button}
                <EditFilled className="edit-button" onClick={openPopup}></EditFilled>
            </div>
            <div className="form" style={{ display: show }}>
                <Form style={{ display: show , width: '350px'}}>
                    <Form.Item className="param-name" label="Name">
                        <Input value={name} onChange={(e) => setName(e.target.value)}></Input>
                    </Form.Item>
                    <Form.Item className="param-display-name" label="Display Name">
                        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)}></Input>
                    </Form.Item>
                    <Form.Item className="param-type" label="Type">
                        <Select className="type-select" value={type} maxTagCount={1} placeholder="Select param type" id="param-type-list" options={paramTypeSelectOptions} onChange={
                            (value) => {
                                const stepRow = document.querySelector('.param-step');
                                const minValueRow = document.querySelector('.param-min-value');
                                const maxValueRow = document.querySelector('.param-max-value');
                                if (stepRow) stepRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.STEP, value)}`);
                                if (minValueRow) minValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MIN, value)}`);
                                if (maxValueRow) maxValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MAX, value)}`);
                                setType(value);
                            }
                        }></Select>
                    </Form.Item>
                    <Form.Item className="param-color" label="Color">
                        <Input className="color-picker-input" style={{ backgroundColor: color, color: getOpositeColor(color) }} value={color}
                            onChange={(e) => {
                                if (e.target.value.length > 7) e.target.value = e.target.value.slice(0, 7);
                                if (e.target.value[0] !== '#') e.target.value = '#' + e.target.value;
                                setColor(e.target.value);
                            }}
                        ></Input>
                        <Button className="color-picker-button" onClick={() => setColorPicker(!colorPicker)} icon={<BgColorsOutlined/>}></Button>
                        <HexColorPicker className="color-picker" color={color} onChange={setColor} style={{ display: colorPicker ? 'inline-flex' : 'none' }} />
                    </Form.Item>
                    <Form.Item className="param-step" label="Step" style={{ display: typeVisibility(SpecialVisibility.STEP, param?.type) }}>
                        <InputNumber min={0} value={step} onChange={(e) => setStep(parseFloat(e?.toString()!))}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-min-value" label="Min Value" style={{ display: typeVisibility(SpecialVisibility.MIN, param?.type) }}>
                        <InputNumber min={0} value={minValue} onChange={(e) => setMinValue(parseFloat(e?.toString()!))}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-max-value" label="Max Value" style={{ display: typeVisibility(SpecialVisibility.MAX, param?.type) }}>
                        <InputNumber min={0} value={maxValue} onChange={(e) => setMaxValue(parseFloat(e?.toString()!))}></InputNumber>
                    </Form.Item>
                    <Form.Item className="param-default-value" label="Default Value">
                        <Input value={defaultValue?.toString()} onChange={(e) => setDefaultValue(e.target.value)}></Input>
                    </Form.Item>
                    <Form.Item className="buttons">
                        <Button className="cancel" type="primary" onClick={closePopup}>Cancel</Button>
                        <Button className="save" type="primary" onClick={saveParam}>Save</Button>
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