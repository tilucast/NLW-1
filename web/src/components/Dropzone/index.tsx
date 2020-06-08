import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {FiUpload} from 'react-icons/fi'
import './styles.css'

interface Props {
    onFileUpload: (file: File) => void
}

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {
    

    const [selectedFileUrl, SetSelectedFileUrl] = useState('')

    const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    SetSelectedFileUrl(fileUrl)
        onFileUpload(file)
    }, [onFileUpload])

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
    <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} accept="image/*"/>

        { selectedFileUrl
        ? <img src={selectedFileUrl} alt="imagem escolhida" />
        : (
            <p>
                <FiUpload />
                Imagem do estabelecimento
            </p>
        )
        }

    </div>
    )
}

export default Dropzone