import { Outlet, Navigate } from "react-router-dom";
import { isSeasonSaved } from "../utils/season-handler";

export const SeasonRoutes = () => {
    return (
        isSeasonSaved() ? (
            <Outlet />
        ) : (
            <Navigate to="/" />
        )
    );
};