import { useEffect, useRef, useState } from "react"
import { useEditorSettings } from "../../editor/EditorContext"
import { exportFountain } from "../../parser/exportfountain"

const ExportFile = () => {
    const { editor, titlePage } = useEditorSettings()
    const [exportMenuOpen, setExportMenuOpen] = useState(false)
    const exportMenuRef = useRef<HTMLDivElement | null>(null)

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
    
    return (
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
    );
}

export default ExportFile;