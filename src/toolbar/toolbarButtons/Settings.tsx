import { useEffect, useRef, useState } from "react"
import { useEditorSettings } from "../../editor/EditorContext"

const Settings = () => {
    const { showSceneNumbers, setShowSceneNumbers } = useEditorSettings()
    const [settingsMenuOpen, setsettingsMenuOpen] = useState(false)
    const settingsMenuRef = useRef<HTMLDivElement | null>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(e.target as Node)) {
                setsettingsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <div className='export-menu-container' ref={settingsMenuRef}>
            <button
                className='toolbar-btn toolbar-btn--text'
                onClick={() => setsettingsMenuOpen(o => !o)}
            >
                Settings ▾
            </button>
            {settingsMenuOpen && (
                <div className='export-menu'>
                    <button className='export-menu-item' onClick={() => {
                        showSceneNumbers
                        ? setShowSceneNumbers(false)
                        : setShowSceneNumbers(true)
                    }}>
                        Scene numbering: <strong>{ showSceneNumbers ? 'ON' : 'OFF'}</strong>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Settings;