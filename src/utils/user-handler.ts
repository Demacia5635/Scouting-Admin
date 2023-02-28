import { User } from "../components/types/User";

const MAX_TAGS = 2;

export function login(user: User) {
    sessionStorage.setItem('username', user.username)
    sessionStorage.setItem('password', user.password)
    sessionStorage.setItem('teamNumber', user.teamNumber)
    sessionStorage.setItem('teamName', user.teamName)
    sessionStorage.setItem('seasonYear', user.seasonYear || "")
    user.tags.forEach((tag, index) => {
        sessionStorage.setItem(`user-tag${index}`, tag)
    })
}

export function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('teamNumber');
    sessionStorage.removeItem('teamName');
    sessionStorage.removeItem('seasonYear');
    for (let i = 0; i < MAX_TAGS; i++) {
        try {
            sessionStorage.removeItem(`user-tag${i}`);
        } catch (e) {}
    }
}

export function isLoggedIn() {
    return (sessionStorage.getItem('username') && sessionStorage.getItem('password')) ? true : false;
}

export function getUser(): User {
    return {
        username: sessionStorage.getItem("username")!,
        password: sessionStorage.getItem("password")!,
        teamNumber: sessionStorage.getItem("teamNumber")!,
        teamName: sessionStorage.getItem("teamName")!,
        tags: getUserTags(),
        seasonYear: sessionStorage.getItem("seasonYear")!,
    }
}

function getUserTags(): string[] {
    const tags: string[] = [];
    for (let i = 0; i < MAX_TAGS; i++) {
        const tag = sessionStorage.getItem(`user-tag${i}`);
        if (tag) {
            tags.push(tag);
        }
    }
    return tags;
}

export function isUserAdmin() {
    return getUser().tags.includes("ADMIN");
}