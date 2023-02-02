import { useState } from "react";
import "../../styles/popups/forms-popup.css";
import { createParamFromDocument, ParamItem, ParamType, paramTypeSelectOptions, SpecialVisibility, typeVisibility } from "../../utils/params/ParamItem";
import { Input } from "../html/Input";
import { Select } from "../html/Select";

type ItemParamPopupProps = {
    param?: ParamItem;
}

export const ItemParamPopup = ({ param }: ItemParamPopupProps) => {
    const [show, setShow] = useState('none');
    const [backdropDisplay, setBackdropDisplay] = useState('none');
    const [params, setParams] = useState<ParamItem[]>([]);

    const openPopup = () => {
        setShow('block');
        setBackdropDisplay('block');
    }

    const saveParam = () => {
        const param = createParamFromDocument(document);
        setParams([...params, param]);
        closePopup();
    }

    const closePopup = () => {
        setShow('none');
        setBackdropDisplay('none');
    }

    return (
        <div>
            <button type="button" onClick={openPopup}>Open Form</button>
            <div className="form" style={{ display: show }}>
                <table className="form-table">
                    <tr className="param-title">
                        <th>
                            Title
                        </th>
                        <th>
                            <Input value={param?.color}></Input>
                        </th>
                    </tr>
                    <tr className="param-type">
                        <th>
                            Type
                        </th>
                        <th>
                            <Select id="param-type-list" options={paramTypeSelectOptions} onChange={
                                (event) => {
                                    const value = event.target.value as ParamType;
                                    const stepRow = document.querySelector('.param-step');
                                    const minValueRow = document.querySelector('.param-min-value');
                                    const maxValueRow = document.querySelector('.param-max-value');
                                    if (stepRow) stepRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.STEP, value)}`);
                                    if (minValueRow) minValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MIN, value)}`);
                                    if (maxValueRow) maxValueRow.setAttribute('style', `display: ${typeVisibility(SpecialVisibility.MAX, value)}`);
                                }
                            }></Select>
                        </th>
                    </tr>
                    <tr className="param-color">
                        <th>
                            Color
                        </th>
                        <th>
                            <Input value={param?.color}></Input>
                        </th>
                    </tr>
                    <tr className="param-step" style={{ display: typeVisibility(SpecialVisibility.STEP, param?.type) }}>
                        <th>
                            Step
                        </th>
                        <th>
                            <Input value={param?.step}></Input>
                        </th>
                    </tr>
                    <tr className="param-min-value" style={{ display: typeVisibility(SpecialVisibility.STEP, param?.type) }}>
                        <th>
                            Min Value
                        </th>
                        <th>
                            <Input value={param?.min}></Input>
                        </th>
                    </tr>
                    <tr className="param-max-value" style={{ display: typeVisibility(SpecialVisibility.STEP, param?.type) }}>
                        <th>
                            Max Value
                        </th>
                        <th>
                            <Input value={param?.max}></Input>
                        </th>
                    </tr>
                    <tr className="param-default-value">
                        <th>
                            Default Value
                        </th>
                        <th>
                            <Input value={param?.defaultValue?.toString()}></Input>
                        </th>
                    </tr>
                </table>
                <button className="save" onClick={saveParam}>Save</button>
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