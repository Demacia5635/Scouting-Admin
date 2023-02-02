import { useState } from "react"

type InputProps = {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & React.ComponentProps<'input'>

export const Input = ({ value, placeholder, onChange, ...props }: InputProps) => {
    const [textValue, setValue] = useState<string>(value?.toString() || '')
    const type = props.type || 'text'

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        if (onChange) onChange(event)
    }

    return (
        <input {...props} type={type} placeholder={placeholder} value={textValue} onChange={handleChange} />
    )
}