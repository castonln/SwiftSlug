import { useState } from 'react'
import Editor from './editor/Editor'
import type { ScreenplayBlock } from './editor/interfaces/screenplayBlock'
import TitlePageEditor from './editor/TitlePageEditor'
import parseFountain from './parser/parsefountain'
import Navigator from './navigator/Navigator'

interface TitlePageData {
    title: string
    credit: string
    author: string
    source: string
    contact: string
    date: string
}

const defaultTitlePage: TitlePageData = {
    title: 'Title',
    credit: 'Written by',
    author: 'Author',
    source: 'Source',
    contact: 'Contact',
    date: 'Date',
}

const App = () => {
    const [titlePage, setTitlePage] = useState<TitlePageData>(defaultTitlePage)
    const [blocks, setBlocks] = useState<ScreenplayBlock[]>([])

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
    }

    return (
        <>
            {/* File import */}
            <div className="fixed top-4 left-4 z-50">
                <input
                    type="file"
                    accept=".fountain"
                    onChange={handleFileUpload}
                    className="text-white text-sm"
                />
            </div>

            {/* Document */}
            <div className='editor-container'>
                <Navigator />
                <div style={{ marginTop: '50px', marginBottom: '100px' }}>
                    <TitlePageEditor data={titlePage} />
                    <Editor blocks={blocks} />
                </div>
            </div>
        </>
    )
}

export default App