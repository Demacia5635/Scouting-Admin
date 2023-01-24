import { useState } from "react"
import { Button } from "./Button"
import { Input } from "./Input"


export const AddUser = () => {
    const [value, setValue] = useState<string>('')
    return (
        <div>
            <Input placeholder="Enter data" onChange={(event) => setValue(event.target.value)} />
            <Button handleClick={async () => {

            }}></Button>
        </div >
    )
}