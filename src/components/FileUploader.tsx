import { UploadOutlined } from "@ant-design/icons"
import { Alert, Button, Modal, Upload } from "antd"
import { rejects } from "assert"
import { resolve } from "path"
import { useEffect, useState } from "react"
import { CellObject, read, utils } from "xlsx"
import { updateData } from "../utils/firebase"

type numberOfScouters = {
    scouterDocPath: string
}

const handleonchange = (e: InputEvent) => { }

export const FileUploader = ({ scouterDocPath }: numberOfScouters) => {
    const [isFirsttime, setfirsttime] = useState(false);
    const [isModelOpened, setIsModalOpen] = useState(false)
    useEffect(() => {
        setfirsttime(true)
    }, [])

    const showModal = () => {
        setIsModalOpen(isFirsttime);
        setfirsttime(false)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    interface names {
        scoutersnames: string;
        scouterslastname: string;
    }
    const descriptionElement = (
        <code>
            please upload an exel file (.xslx) in the following format:
            <br />
            name the first row of the collum you want to put your scouters first and middel names: scoutersnames
            <br />
            name the first row of the collum you want to put your scouters last names: scouterslastname

        </code>
    )
    return (
        <div>

            <Modal open={isModelOpened} onOk={handleOk} onCancel={handleCancel}>
                <Alert
                    description={descriptionElement}
                    type="info"
                    showIcon
                />
            </Modal>

            <Upload
                accept=".xlsx, .xls"
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
                            updateData(scouterDocPath, { firstname: dat.scoutersnames, lastname: dat.scouterslastname })
                        })
                    }
                    filereader.readAsArrayBuffer(file)
                    return false;
                }

                    // const testcell:CellObject = ws['B1']

                }
            >

                <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>
            </Upload>
        </div>

    )

}