import { useEffect, useRef, useState } from 'react'
import { useEditorSettings } from '../editor/EditorContext'
import './navigator.css'
import SceneItem from './navigatorItems/SceneItem'
import type { SceneHeading } from '../editor/interfaces/SceneHeading'

const Navigator = () => {
    const { editor, sceneHeadings } = useEditorSettings()
    const [activePos, setActivePos] = useState<number | null>(null)
    const navigatorRef = useRef<HTMLDivElement | null>(null)
    const activeItemRef = useRef<HTMLDivElement | null>(null)
    const [navigatorIsAutoScrolling, setNavigatorIsAutoScrolling] = useState<boolean>(false)

    const jumpToScene = (scene: SceneHeading) => {
        if (!editor) return

        editor.commands.setTextSelection(scene.pos)
        const dom = editor.view.nodeDOM(scene.pos) as HTMLElement | null
        if (!dom) return

        setNavigatorIsAutoScrolling(true)
        dom.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const onScrollEnd = () => {
            setNavigatorIsAutoScrolling(false)
            window.removeEventListener('scrollend', onScrollEnd)
        }
        window.addEventListener('scrollend', onScrollEnd)
    }

    useEffect(() => {
        if (navigatorIsAutoScrolling) return
        const navigator = navigatorRef.current
        const activeItem = activeItemRef.current
        if (!navigator || !activeItem) return

        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [activePos])

    useEffect(() => {
        if (!editor) return

        const onScroll = () => {

            let activeScene: SceneHeading | null = null

            for (const scene of sceneHeadings) {
                const dom = editor.view.nodeDOM(scene.pos) as HTMLElement | null
                if (!dom) continue

                const rect = dom.getBoundingClientRect()
                if (rect.top <= 16 + 72) {  // scroll margin + lh
                    activeScene = scene
                }
            }

            if (activeScene) setActivePos(activeScene.pos)
        }
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [editor, sceneHeadings])

    return (
        <div className='navigator' ref={navigatorRef}>
            <div className="navigator-header">
                <span>Scenes</span>
            </div>
            {sceneHeadings.map((scene) => {
                const isActive = scene.pos === activePos
                return (
                    <SceneItem
                        key={scene.pos}
                        ref={isActive ? activeItemRef : null}
                        item={scene}
                        onJump={jumpToScene}
                        className={isActive ? 'active-scene-shortcut' : ''}
                    />
                )
            })}
        </div>
    )
}

export default Navigator