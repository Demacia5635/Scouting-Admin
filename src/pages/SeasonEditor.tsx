import { Button, Input } from "antd";
import { DocumentData } from "firebase/firestore/lite";
import { ReactElement, useEffect, useState } from "react";
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
        async function updateParams() {
            let param: DocumentData = allParams[dataOrder(mode)]!;
            let list = []
            for (const data in param) {
                const paramData = param[data]
                const paramItem = new ParamItem(data, paramData.displayName, paramData.type, paramData.color, paramData.step, paramData.min, paramData.max, paramData.defaultValue);
                list.push(<ItemParamPopup param={paramItem}></ItemParamPopup>);
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

            <table className="params-table">
                <thead>
                    <tr>
                        <th>
                            <Button onClick={() => setMode(DataParamsModes.AUTONOMOUS)}>Autonomous</Button>
                        </th>
                        <th>
                            <Button onClick={() => setMode(DataParamsModes.TELEOP)}>Teleop</Button>
                        </th>
                        <th>
                            <Button onClick={() => setMode(DataParamsModes.ENDGAME)}>End Game</Button>
                        </th>
                        <th>
                            <Button onClick={() => setMode(DataParamsModes.SUMMARY)}>Summary</Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4} className="search-bar">
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
                {selectedParams}
            </div>
        </div >
    );
};