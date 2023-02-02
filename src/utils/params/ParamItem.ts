export class ParamItem {
    constructor(
        public name: string,
        public type: ParamType,
        public color: string,
        public step?: number,
        public min?: number,
        public max?: number,
        public defaultValue?: number | string | boolean,
    ) { }
}

export const paramItemConverter = {
    toFirestore: (item: ParamItem) => {
        return {
            name: item.name,
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
        return new ParamItem(data.name, data.type, data.color, data.min, data.max, data.step, data.defaultValue);
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
    const title = document.querySelector('.param-title input') as HTMLInputElement;
    const type = document.querySelector('.param-type select') as HTMLSelectElement;
    const color = document.querySelector('.param-color input') as HTMLInputElement;
    const step = document.querySelector('.param-step input') as HTMLInputElement;
    const minValue = document.querySelector('.param-min-value input') as HTMLInputElement;
    const maxValue = document.querySelector('.param-max-value input') as HTMLInputElement;
    const defaultValue = document.querySelector('.param-default-value input') as HTMLInputElement;
    return new ParamItem(
        title.value,
        type.value as ParamType,
        color.value,
        step.value ? parseFloat(step.value) : undefined,
        minValue.value ? parseFloat(minValue.value) : undefined,
        maxValue.value ? parseFloat(maxValue.value) : undefined,
        defaultValue.value ? parseFloat(defaultValue.value) : undefined
    );
}