export class ParamItem {
    constructor(
        public name: string,
        public displayName: string,
        public type: ParamType,
        public color: string,
        public step?: number,
        public min?: number,
        public max?: number,
        public defaultValue?: number | string | boolean,
    ) { }

    update(item: ParamItem) {
        this.name = item.name;
        this.displayName = item.displayName;
        this.type = item.type;
        this.color = item.color;
        this.step = item.step;
        this.min = item.min;
        this.max = item.max;
        this.defaultValue = item.defaultValue;
    }
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

    fromFirestore: (snapshot: any) => {
        const data = snapshot.data();
        return new ParamItem(data.id, data.displayName, data.type, data.color, data.min, data.max, data.step, data.defaultValue);
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

export function createParamFromDocument(document: Document) {
    const name = document.querySelector('.param-name input') as HTMLInputElement;
    const displayName = document.querySelector('.param-display-name input') as HTMLInputElement;
    const type = document.querySelector('.param-type .ant-select-selection-item') as HTMLSelectElement;
    const color = document.querySelector('.param-color input') as HTMLInputElement;
    const step = document.querySelector('.param-step input') as HTMLInputElement;
    const minValue = document.querySelector('.param-min-value input') as HTMLInputElement;
    const maxValue = document.querySelector('.param-max-value input') as HTMLInputElement;
    const defaultValue = document.querySelector('.param-default-value input') as HTMLInputElement;
    return new ParamItem(
        name.value,
        displayName.value,
        type.value as ParamType,
        color.value,
        step.value ? parseFloat(step.value) : undefined,
        minValue.value ? parseFloat(minValue.value) : undefined,
        maxValue.value ? parseFloat(maxValue.value) : undefined,
        defaultValue.value ? parseFloat(defaultValue.value) : undefined
    );
}