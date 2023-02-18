export interface ScouterDataType {
    key: string;
    firstname: string;
    lastname: string;
}

export interface QualsTableDataType {
    key: string
    match: string
    chosenScouters: ScouterDataType[]
    allScouters: ScouterDataType[]
}