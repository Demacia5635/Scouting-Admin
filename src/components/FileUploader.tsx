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
    numOfScouters: number
    scoutersToBeDeleted: string[]
    updateNumberOfScouts: (num: number) => void
}


export const FileUploader = ({ scouterDocPath, numOfScouters, updateNumberOfScouts, scoutersToBeDeleted }: numberOfScouters) => {
    const [isFirstTime, setFirstTime] = useState(false);
    const [isModelOpened, setIsModalOpen] = useState(false)
    useEffect(() => {
        setFirstTime(true)
    }, [])

    const showModal = () => {
        setIsModalOpen(isFirstTime);
        setFirstTime(false)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    interface Names {
        scoutersnames: string;
        scouterslastname: string;
    }
    const descriptionElement = (
        <code>
            Please upload an exel file (.xslx) in the following format:
            <br />
            First column (will include the scouters first name) title: "scoutersnames"
            <br />
            Second column (will include the scouters last name) title: "scouterslastname"

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
            {!isFirstTime && (
                <Upload
                    accept=".xlsx, .xls"
                    listType="text"
                    maxCount={1}
                    beforeUpload={file => {
                        console.log("started")
                        const fileReader = new FileReader();
                        fileReader.onload = (e) => {
                            const bufferArray = e.target?.result;
                            const workBook = read(bufferArray, { type: "buffer" })
                            console.log("read file")
                            const workSheet = workBook.Sheets[workBook.SheetNames[0]]
                            const data = utils.sheet_to_json<Names>(workSheet)
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
                        fileReader.readAsArrayBuffer(file)
                        return false;
                    }

                        // const testcell:CellObject = ws['B1']

                    }
                >
                    <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>
                </Upload>)}
            {isFirstTime && (
                <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>)}

        </div>

    )

}