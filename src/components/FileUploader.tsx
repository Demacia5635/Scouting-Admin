import { UploadOutlined } from "@ant-design/icons"
import { Button, Upload } from "antd"
import { rejects } from "assert"
import { resolve } from "path"
import { CellObject, read, utils } from "xlsx"

const handleonchange = (e: InputEvent) => { }

export const FileUploader = () => {

    interface names {
        name: string;
        famname: string;
    }
    return (
        <Upload
            accept="xslx"
            listType="text"
            maxCount={1}
            beforeUpload={file => {
                // return new Promise((resolve, reject) => {
                console.log("started")
                const filereader = new FileReader();
                filereader.onload = (e) => {
                    const bufferarray = e.target?.result;
                    const wb = read(bufferarray, { type: "buffer" })
                    console.log("read file")
                    const ws = wb.Sheets[wb.SheetNames[0]]
                    const data = utils.sheet_to_json<names>(ws)
                    data.map((dat) => {
                        console.log(dat.famname)
                        console.log(dat.name)
                    })
                }
                filereader.readAsArrayBuffer(file)
                return false;
            }

                // const testcell:CellObject = ws['B1']

            }
        >
            <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
        </Upload>

    )

}