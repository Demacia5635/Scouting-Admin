import { Button, Input, Space } from "antd";
import { DocumentData } from "firebase/firestore/lite";
import { ReactElement, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ItemParamPopup } from "../components/popups/ItemParamPopup";
import "../styles/editor/seasoneditor.css";
import { getAllParams } from "../utils/firebase";
import { dataOrder, DataParamsModes, ParamItem } from "../utils/params/ParamItem";
import { getSelectedSeason } from "../utils/season-handler";

export const SeasonEditor = () => {
    const { year, name } = getSelectedSeason();
    const [allParams, setAllParams] = useState<(DocumentData | undefined)[]>([]);
    const [params, setParams] = useState<(ReactElement | null | undefined)[]>([]);
    const [selectedParams, setSelectedParams] = useState<(ReactElement | null | undefined)[]>([]);
    const [mode, setMode] = useState(DataParamsModes.AUTONOMOUS);
    const [loadingData, setLoadingData] = useState(true);
    const [showLoading, setShowLoading] = useState('block');

    useEffect(() => {
        function updateActiveButton(activeId: string) {
            const buttons = document.getElementsByClassName('active');
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove('active');
            }
            const button = document.getElementsByClassName(activeId)[0];
            button.classList.add('active');
        }

        async function updateParams() {
            let param: DocumentData = allParams[dataOrder(mode)]!;
            let list = []
            for (const data in param) {
                const paramItem = param[data] as ParamItem;
                paramItem.name = data;
                list.push(<ItemParamPopup key={uuidv4()} param={paramItem}></ItemParamPopup>);
            }
            list = list.filter((param) => param != null);
            if (list.length === 0) {
                setLoadingData(false);
                setShowLoading('block');
            } else {
                setLoadingData(false);
                setShowLoading('none');
            }
            setParams(list);
            setSelectedParams(list);
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
    }, [mode, allParams]);

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

            <Space direction="vertical" style={{marginTop: '20px', width: '100%', justifyContent: 'left'}}>
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

            <table className="params-table">
                <thead>
                    <tr>
                        
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4} className="">
                            
                        </td>
                    </tr>
                    <tr>
                        <td>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="params-list">
                <h2 className="no-data" style={{ display: showLoading }}>{loadingData ? "Loading Data..." : "No Data"}</h2>
                <Space direction="vertical">
                    {selectedParams}
                    <ItemParamPopup></ItemParamPopup>
                </Space>
            </div>
        </div >
    );
};