import { Button } from "../components/html/Button";
import { Input } from "../components/html/Input";
import { ItemParamPopup } from "../components/popups/ItemParamPopup";
import "../styles/editor/seasoneditor.css";
import { getSelectedSeason } from "../utils/season-handler";

export const SeasonEditor = () => {
    const { year, name } = getSelectedSeason();

    return (
        <div>
            <link rel="stylesheet"
                href=
                "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            </link>

            <h1>Season: {year} {name}</h1>
            <ItemParamPopup />

            <table className="params-table">
                <thead>
                    <tr>
                        <th>
                            <Button>Autonomous</Button>
                        </th>
                        <th>
                            <Button>Teleop</Button>
                        </th>
                        <th>
                            <Button>End Game</Button>
                        </th>
                        <th>
                            <Button>Summary</Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={4} className="search-bar">
                            <i className="fa fa-search"></i>
                            <Input placeholder="Search..." onChange={
                                (event) => {
                                    console.log(event.target.value);
                                }
                            }></Input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Button>Autonomous</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
};