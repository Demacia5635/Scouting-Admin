import { useState } from "react"

type SelectProps = {
    id: string
    options: { value: string, label: string }[]
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
} & React.ComponentProps<'select'>

export const Select = ({ value, placeholder: id, options, onChange, ...props }: SelectProps) => {
    const [textValue, setValue] = useState<string>(value?.toString() || '')

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(event.target.value)
        if (onChange) onChange(event)
    }

    return (
        <select {...props} id={id} value={textValue} onChange={handleChange}>
            {options.map((option) => (
                <option value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}