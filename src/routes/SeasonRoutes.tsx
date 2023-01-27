import { Outlet, Navigate } from "react-router-dom";

function checkSelectedSeason() {
    return sessionStorage.getItem("seasonYear") && sessionStorage.getItem("seasonName");
}

export const SeasonRoutes = () => {
    return (
        checkSelectedSeason() ? (
            <Outlet />
        ) : (
            <Navigate to="/" />
        )
    );
};