export interface User {
    teamNumber: string;
    teamName: string;
    username: string;
    password: string;
    tags: string[];
    seasonYear?: string;
}

export function userToFirebase(user: User): any {
    return {
        teamName: user.teamName,
        teamNumber: user.teamNumber,
        password: user.password,
        tags: user.tags
    };
}