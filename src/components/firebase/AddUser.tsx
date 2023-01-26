import { useState } from "react"
import { Button } from "../html/Button"
import { Input } from "../html/Input"


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