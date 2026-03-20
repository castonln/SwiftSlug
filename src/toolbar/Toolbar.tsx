import { useState, useRef, useEffect } from 'react'
import './toolbar.css'
import dialogueSvg from '../assets/speech-bubbles-chat-symbol-svgrepo-com.svg'
import characterSvg from '../assets/person-svgrepo-com.svg'
import Icon from './icon/Icon'
import parseFountain from '../parser/parsefountain'
import { useEditorSettings } from '../editor/EditorContext'
import { exportFountain } from '../parser/exportfountain'

const Toolbar = () => {
    const { setBlocks, setTitlePage, editor, titlePage } = useEditorSettings()
    const [exportMenuOpen, setExportMenuOpen] = useState(false)
    const exportMenuRef = useRef<HTMLDivElement | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                setExportMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function downloadFountain(content: string, filename: string) {
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${filename}.fountain`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleFountainExport = () => {
        if (!editor) return
        const content = exportFountain(editor, titlePage)
        downloadFountain(content, titlePage.title || 'screenplay')
        setExportMenuOpen(false)
    }

    const handlePdfExport = () => {
        window.print()
        setExportMenuOpen(false)
    }

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
        <div className='toolbar'>
            <div className='toolbar-group'>
                <button className='toolbar-btn'>
                    <Icon fill='#682860' height={25} width={25} />
                </button>
                <input
                    id='file-upload'
                    type="file"
                    accept=".fountain"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <label 
                    htmlFor='file-upload' 
                    className='toolbar-btn toolbar-btn--text'>
                    {fileName
                    ? fileName
                    : "Import"}
                </label>

                {/* Export dropdown */}
                <div className='export-menu-container' ref={exportMenuRef}>
                    <button
                        className='toolbar-btn toolbar-btn--text'
                        onClick={() => setExportMenuOpen(o => !o)}
                    >
                        Export ▾
                    </button>
                    {exportMenuOpen && (
                        <div className='export-menu'>
                            <button className='export-menu-item' onClick={handleFountainExport}>
                                Export .fountain
                            </button>
                            <button className='export-menu-item' onClick={handlePdfExport}>
                                Export PDF
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className='toolbar-nodes'>
                <button className='toolbar-btn' title='Scene Heading'>
                    <span className='toolbar-btn__label'><strong>INT./EXT.</strong></span>
                </button>
                <button className='toolbar-btn' title='Action'>
                    <span className='toolbar-btn__label'>Action</span>
                </button>
                <button className='toolbar-btn toolbar-btn--icon' title='Character'>
                    <img src={characterSvg} width={16} height={16} alt='Character' />
                </button>
                <button className='toolbar-btn toolbar-btn--icon' title='Dialogue'>
                    <img src={dialogueSvg} width={16} height={16} alt='Dialogue' />
                </button>
                <button className='toolbar-btn' title='Parenthetical'>
                    <span className='toolbar-btn__label'>()</span>
                </button>
                <button className='toolbar-btn' title='Transition'>
                    <span className='toolbar-btn__label'>TO:</span>
                </button>
            </div>
        </div>
    )
}

export default Toolbar