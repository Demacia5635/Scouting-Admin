import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { read, utils } from 'xlsx';
import { updateData } from '../utils/firebase';
import { QualsTableDataType, ScouterDataType } from './types/TableDataTypes';

type Props = {
    data: QualsTableDataType[]
    seasonPath: string
    tournementSubPath: string
    updateTable: () => void
}


export const QualsFileUploader = ({ data, seasonPath, tournementSubPath, updateTable }: Props) => {
    type scouterFullName = {
        firstName: string
        lastName: string
    }
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
        firstScouterFirstName: string
        firstScouterLastName: string
        secondScouterFirstName: string
        secondScouterLastName: string
        thirdScouterFirstName: string
        thirdScouterLastName: string
        fourthScouterFirstName: string
        fourthScouterLastName: string
        fifthScouterFirstName: string
        fifthScouterLastName: string
        sixthcouterFirstName: string
        sixthScouterLastName: string
    }
    const descriptionElement = (
        <code>
            Please upload an exel file (.xslx) in the following format:
            <br />
            First column (will include the first scouters first name) title: "scoutersnames"
            <br />
            Second column (will include the second scouters last name) title: "scouterslastname"
            <br />
            third column (will include the first scouters first name) title: "scoutersnames"
            <br />
            4th column (will include the second scouters last name) title: "scouterslastname"
            <br />
            5th column (will include the first scouters first name) title: "scoutersnames"
            <br />
            6th column (will include the second scouters last name) title: "scouterslastname"
            <br />
            7th column (will include the first scouters first name) title: "scoutersnames"
            <br />
            8th column (will include the second scouters last name) title: "scouterslastname"
            <br />
            9th column (will include the first scouters first name) title: "scoutersnames"
            <br />
            10th column (will include the second scouters last name) title: "scouterslastname"
            <br />
            11th column (will include the first scouters first name) title: "scoutersnames"
            <br />
            12th column (will include the second scouters last name) title: "scouterslastname"
        </code>
    )
    const updateFirebase = async (qualsnum: string, scouterkeys: scouterFullName[]) => {
        const filteredScouters = Object.assign({}, scouterkeys.map((scouter, index) => {
            if (scouter.firstName != "" && scouter.lastName != "") {
                return [
                    data[index].allScouters.find(function (scouter) {
                        return scouter.lastname === scouterkeys[index].lastName
                            && scouter.firstname === scouterkeys[index].firstName
                    })?.key,
                    scouter.firstName,
                    scouter.lastName
                ]
            } else {
                return [null, null, null]
            }
        }));
        await updateData(`${seasonPath}${tournementSubPath}/Quals/${qualsnum}`, filteredScouters, true);
    }

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
                        const fileReader = new FileReader();
                        fileReader.onload = (e) => {
                            const bufferArray = e.target?.result;
                            const workBook = read(bufferArray, { type: "buffer" })
                            const workSheet = workBook.Sheets[workBook.SheetNames[0]]
                            const scoutersdata = utils.sheet_to_json<Names>(workSheet)
                            let i = 0;

                            scoutersdata.map(async (dat, index) => {
                                updateFirebase(data[index].match, [
                                    { firstName: dat.firstScouterFirstName, lastName: dat.firstScouterLastName },
                                    { firstName: dat.secondScouterFirstName, lastName: dat.secondScouterLastName },
                                    { firstName: dat.thirdScouterFirstName, lastName: dat.thirdScouterLastName },
                                    { firstName: dat.fourthScouterFirstName, lastName: dat.fourthScouterLastName },
                                    { firstName: dat.fifthScouterFirstName, lastName: dat.fifthScouterLastName },
                                    { firstName: dat.sixthcouterFirstName, lastName: dat.sixthScouterLastName }
                                ])
                            })
                            updateTable()
                        }

                        fileReader.readAsArrayBuffer(file)
                        return false;
                    }


                    }
                >
                    <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>
                </Upload>)}
            {isFirstTime && (
                <Button onClick={showModal} icon={<UploadOutlined />}>Upload</Button>)}

        </div>
    )
}