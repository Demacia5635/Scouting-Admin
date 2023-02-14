import { ItemParamPopup } from "../../components/popups/ItemParamPopup";
import { v4 as uuidv4 } from 'uuid';

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

export function isSpecialRequired(type: ParamType | undefined, inputType: SpecialVisibility): boolean {
    if (!type) return false
    switch (inputType) {
        case SpecialVisibility.STEP:
            return type === ParamType.SLIDER
        case SpecialVisibility.MIN:
            return type === ParamType.SLIDER || type === ParamType.NUMBER
        case SpecialVisibility.MAX:
            return type === ParamType.SLIDER || type === ParamType.NUMBER
        default:
            return false
    }
}