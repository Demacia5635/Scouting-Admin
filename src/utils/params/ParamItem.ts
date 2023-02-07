export interface ParamItem {
    name: string;
    displayName: string;
    type: ParamType;
    color: string;
    step?: number;
    min?: number;
    max?: number;
    defaultValue?: number | string | boolean
}

export const paramItemConverter = {
    toFirestore: (item: ParamItem) => {
        return {
            displayName: item.displayName,
            type: item.type,
            color: item.color,
            min: item.min,
            max: item.max,
            step: item.step,
            defaultValue: item.defaultValue,
        };
    },

    fromFirestore: (snapshot: any): ParamItem => {
        return snapshot.data();
    }
};

export enum ParamType {
    SLIDER = 'slider',
    TEXT = 'text',
    CHECKBOX = 'checkbox',
    NUMBER = 'number',
}

export enum SpecialVisibility {
    STEP = 'step',
    MIN = 'min',
    MAX = 'max',
}

export enum DataParamsModes {
    AUTONOMOUS = 'autonomous',
    TELEOP = 'teleop',
    ENDGAME = 'endgame',
    SUMMARY = 'summary'
}

export function dataOrder(mode: DataParamsModes) {
    switch (mode) {
        case DataParamsModes.AUTONOMOUS:
            return 0;
        case DataParamsModes.TELEOP:
            return 1;
        case DataParamsModes.ENDGAME:
            return 2;
        case DataParamsModes.SUMMARY:
            return 3;
        default:
            return 0;
    }
}

export const paramTypeSelectOptions = [
    { value: ParamType.TEXT, label: 'Text' },
    { value: ParamType.SLIDER, label: 'Slider' },
    { value: ParamType.CHECKBOX, label: 'Checkbox' },
    { value: ParamType.NUMBER, label: 'Number' },
];

export function typeVisibility(type: SpecialVisibility, paramType: ParamType | undefined) {
    if (!paramType) return 'none'
    switch (type) {
        case SpecialVisibility.STEP:
            return paramType === ParamType.SLIDER ? '' : 'none'
        case SpecialVisibility.MIN:
            return paramType === ParamType.SLIDER || paramType === ParamType.NUMBER ? '' : 'none'
        case SpecialVisibility.MAX:
            return paramType === ParamType.SLIDER || paramType === ParamType.NUMBER ? '' : 'none'
        default:
            return ''
    }
}

export function createParamFromDocument(document: Document): ParamItem {
    const name = (document.querySelector('.param-name input') as HTMLInputElement).value;
    const displayName = (document.querySelector('.param-display-name input') as HTMLInputElement).value;
    const type = (document.querySelector('.param-type .ant-select-selection-item') as HTMLSelectElement).value;
    const color = (document.querySelector('.param-color input') as HTMLInputElement).value;
    const step = (document.querySelector('.param-step input') as HTMLInputElement).value;
    const minValue = (document.querySelector('.param-min-value input') as HTMLInputElement).value;
    const maxValue = (document.querySelector('.param-max-value input') as HTMLInputElement).value;
    const defaultValue = (document.querySelector('.param-default-value input') as HTMLInputElement).value;
    return {
        name,
        displayName,
        type: type as ParamType,
        color,
        step: step ? parseFloat(step) : undefined,
        min: minValue ? parseFloat(minValue) : undefined,
        max: maxValue ? parseFloat(maxValue) : undefined,
        defaultValue: defaultValue ? parseFloat(defaultValue) : undefined
    }
}