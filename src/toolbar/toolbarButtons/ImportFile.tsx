import { useState } from "react"
import { useEditorSettings } from "../../editor/EditorContext"
import parseFountain from "../../parser/parsefountain"

const ImportFile = () => {
    const { setBlocks, setTitlePage } = useEditorSettings()
    const [fileName, setFileName] = useState<string | null>(null)

    function loadFountain(text: string) {
        const { titlePage, blocks } = parseFountain(text)
        setBlocks(blocks)
        setTitlePage({
            title: titlePage.title ?? '',
            credit: titlePage.credit ?? '',
            author: titlePage.author ?? '',
            source: titlePage.source ?? '',
            contact: titlePage.contact ?? '',
            date: titlePage.date ?? '',
        })
    }

    function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            if (file.name.endsWith('.fountain')) loadFountain(text)
        }
        reader.readAsText(file)
        setFileName(file.name)
    }

    return (
        <>
            <input
                id='file-upload'
                type="file"
                accept=".fountain"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
            <label
                htmlFor='file-upload'
                className='toolbar-btn import-btn toolbar-btn--text'>
                {fileName
                    ? fileName
                    : "Import"}
            </label>
        </>
    );
}

export default ImportFile;