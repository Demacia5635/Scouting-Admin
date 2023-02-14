import { Button, Input, Space } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ItemParamPopup } from "../components/popups/ItemParamPopup";
import "../styles/editor/seasoneditor.css";
import { getAllParams } from "../utils/firebase";
import { dataOrder, DataParamsModes, ParamItem } from "../utils/params/ParamItem";
import { getSelectedSeason } from "../utils/season-handler";

export const SeasonEditor = () => {
    const { year, name } = getSelectedSeason();

    const [allParams, setAllParams] = useState<(ParamItem[])[]>([]);
    const [params, setParams] = useState<(ReactElement | null | undefined)[]>([]);
    const [selectedParams, setSelectedParams] = useState<(ReactElement | null | undefined)[]>([]);

    const [mode, setMode] = useState(DataParamsModes.AUTONOMOUS);
    const [loadingData, setLoadingData] = useState(true);
    const [showLoading, setShowLoading] = useState('block');
    
    const createParamElement = (param: ParamItem | undefined, mode: DataParamsModes) => {
        if (param) {
            return <ItemParamPopup key={uuidv4()} param={param} mode={mode} onSave={
                (param: ParamItem, justCreated: boolean, mode: DataParamsModes) => {
                    const index = dataOrder(mode);
                    if (!justCreated) {
                        setAllParams((prev) => {
                            const newParams = prev[index];
                            const paramIndex = newParams.findIndex((paramItem) => paramItem.name === param.name);
                            newParams[paramIndex] = param;
                            return prev;
                        });
                    }
                }
            }/>;
        } else {
            return <ItemParamPopup key={uuidv4()} mode={mode} onSave={
                (param: ParamItem, justCreated: boolean, mode: DataParamsModes) => {
                    const index = dataOrder(mode);
                    if (justCreated) {
                        setAllParams((prev) => {
                            const newParams = prev[index];
                            newParams.push(param);
                            return prev;
                        });
                        updateParams();
                    }
                }
            }/>;
        }
    }

    const updateParams = () => {
        const params = allParams[dataOrder(mode)];
        const elementList = params ? params.map((param) => createParamElement(param, mode)) : [];

        if (elementList && elementList.length === 0) {
            setLoadingData(false);
            setShowLoading('block');
        } else {
            setLoadingData(false);
            setShowLoading('none');
        }
        setParams(elementList);
        setSelectedParams(elementList);
    }
    
    useEffect(() => {
        function updateActiveButton(activeId: string) {
            const buttons = document.getElementsByClassName('active');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
            }
            const button = document.getElementsByClassName(activeId)[0];
            button.classList.add('active');
        }
        updateParams();

        switch (mode) {
            case DataParamsModes.AUTONOMOUS:
                updateActiveButton('autonomous-button');
                break;
            case DataParamsModes.TELEOP:
                updateActiveButton('teleop-button');
                break;
            case DataParamsModes.ENDGAME:
                updateActiveButton('endgame-button');
                break;
            case DataParamsModes.SUMMARY:
                updateActiveButton('summary-button');
                break;
        }
    }, [mode]);

    useEffect(() => {
        updateParams();
    }, [allParams]);

    useEffect(() => {
        async function loadParams() {
            setLoadingData(true);
            const allParams = await getAllParams(year);
            setAllParams(allParams);
        }
        loadParams();
    }, []);

    return (
        <div>
            <link rel="stylesheet"
                href=
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </link>

            <h1>Season: {year} {name}</h1>

            <Space direction="vertical" style={{marginTop: '20px'}}>
                <Space className="params-mode-buttons">
                    <Button className="autonomous-button mode-button" onClick={() => setMode(DataParamsModes.AUTONOMOUS)}>Autonomous</Button>
                    <Button className="teleop-button mode-button" onClick={() => setMode(DataParamsModes.TELEOP)}>Teleop</Button>
                    <Button className="endgame-button mode-button" onClick={() => setMode(DataParamsModes.ENDGAME)}>End Game</Button>
                    <Button className="summary-button mode-button" onClick={() => setMode(DataParamsModes.SUMMARY)}>Summary</Button>
                </Space>
                <Space className="params-search-bar">
                    <i className="fa fa-search"></i>
                    <Input placeholder="Search..." onChange={
                        (event) => {
                            const value = event.target.value;
                            if (value === "") {
                                setSelectedParams(params);
                            } else {
                                const filteredParams = params.filter((param) => {
                                    if (param != null) {
                                        const paramItem = param.props.param;
                                        return paramItem.displayName.toLowerCase().includes(value.toLowerCase());
                                    }
                                    return false;
                                });
                                setSelectedParams(filteredParams);
                            }
                        }
                    }></Input>
                </Space>
            </Space>

            <div className="params-list">
                <h2 className="no-data" style={{ display: showLoading }}>{loadingData ? "Loading Data..." : "No Data"}</h2>
                <Space direction="vertical">
                    {selectedParams}
                    {createParamElement(undefined, mode)}
                </Space>
            </div>
        </div >
    );
};