import { UploadOutlined } from "@ant-design/icons"
import { Alert, Button, Modal, Upload } from "antd"
import { rejects } from "assert"
import { resolve } from "path"
import { useEffect, useState } from "react"
import { CellObject, read, utils } from "xlsx"
import { deleteDocument, updateData } from "../utils/firebase"
import {v4 as uuid} from 'uuid'

type numberOfScouters = {
    scouterDocPath: string
    numOfScouters: number | undefined
    scoutersToBeDeleted: string[]
    updateNumberOfScouts: (num: number | undefined) => void
}

const handleonchange = (e: InputEvent) => { }

export const FileUploader = ({ scouterDocPath, numOfScouters, updateNumberOfScouts, scoutersToBeDeleted }: numberOfScouters) => {
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
            {!isFirsttime && (
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
                            let i = 0;
                            if (numOfScouters != undefined) {
                                i = numOfScouters;
                            }
                            data.map(async (dat) => {
                                await updateData(scouterDocPath + "scouter" + uuid(), { firstname: dat.scoutersnames, lastname: dat.scouterslastname })
                            })

                            scoutersToBeDeleted.map(async (scouter) => {
                                console.log("scouter: " + scouter)
                                console.log("scouter path: " + scouterDocPath)
                                await deleteDocument(scouterDocPath + scouter)
                            })
                            i -= scoutersToBeDeleted.length
                            updateNumberOfScouts((i - 1))
                        }
                        filereader.readAsArrayBuffer(file)
                        return false;
                    }

                        // const testcell:CellObject = ws['B1']

                    }
                >

                    <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>
                </Upload>)}
            {isFirsttime && (
                <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>)}

        </div>

    )

}