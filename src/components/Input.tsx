import { useState } from "react"

type InputProps = {
    value?: string
    placeholder?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = ({ value, placeholder, onChange }: InputProps) => {
    const [textValue, setValue] = useState<string>(value || '')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
        onChange(event)
    }

    return (
        <input type="text" placeholder={placeholder} value={textValue} onChange={handleChange} />
    )
}