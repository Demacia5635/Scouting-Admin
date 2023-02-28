import { Outlet, Navigate } from "react-router-dom";
import { isSeasonSaved } from "../utils/season-handler";
import { isLoggedIn } from "../utils/user-handler";

export const SeasonRoutes = () => {
    return (
        isSeasonSaved() && isLoggedIn() ? (
            <Outlet />
        ) : (
            <Navigate to="/" />
        )
    );
};