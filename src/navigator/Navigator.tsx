import { useEffect, useRef, useState } from 'react'
import { useEditorSettings, type ActDivider, type NavigatorItem, type SceneHeading } from '../editor/EditorContext'
import './navigator.css'
import SceneItem from './navigatorItems/SceneItem'
import DividerItem from './navigatorItems/DividerItem'

const Navigator = () => {
    const { editor, navigatorItems, setNavigatorItems } = useEditorSettings()
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const navigatorRef = useRef<HTMLDivElement | null>(null)
    const lastDividerRef = useRef<HTMLDivElement | null>(null)

    // check for new dividers added and scroll to them
    useEffect(() => {
        const navigator = navigatorRef.current
        const divider = lastDividerRef.current
        if (!navigator || !divider) return

        const navigatorTop = navigator.getBoundingClientRect().top
        const dividerTop = divider.getBoundingClientRect().top
        const offset = dividerTop - navigatorTop

        navigator.scrollTo({
            top: navigator.scrollTop + offset,
            behavior: 'smooth'
        })
    }, [navigatorItems])

    const lastDividerIndex = navigatorItems.reduceRight(
        (previousValue: number, currentValue: NavigatorItem, currentIndex: number) =>
            previousValue === -1 && currentValue.type === 'divider'
                ? currentIndex
                : previousValue, -1
    )

    const jumpToScene = (scene: SceneHeading) => {
        if (!editor) return
        editor.commands.setTextSelection(scene.pos)
        const dom = editor.view.nodeDOM(scene.pos) as HTMLElement | null
        dom?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const addDivider = () => {
        const newDivider: ActDivider = {
            type: 'divider',
            id: crypto.randomUUID(),
            label: `Act ${navigatorItems.filter(i => i.type === 'divider').length + 1}`
        }
        setNavigatorItems([...navigatorItems, newDivider])
    }

    const updateDividerLabel = (id: string, label: string) => {
        setNavigatorItems(navigatorItems.map(item =>
            item.type === 'divider' && item.id === id ? { ...item, label } : item
        ))
    }

    const removeDivider = (id: string) => {
        setNavigatorItems(navigatorItems.filter(item => item.id !== id))
    }

    const onDragStart = (id: string) => {
        setDraggingId(id)
    }

    const onDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const onDrop = (dropIndex: number) => {
        if (!draggingId) return

        const fromIndex = navigatorItems.findIndex(item => item.id === draggingId)
        if (fromIndex === -1) return

        const updated = [...navigatorItems]
        const [removed] = updated.splice(fromIndex, 1)
        const adjustedIndex = fromIndex < dropIndex ? dropIndex - 1 : dropIndex
        updated.splice(adjustedIndex, 0, removed)

        setNavigatorItems(updated)
        setDraggingId(null)
        setDragOverIndex(null)
    }

    const onDragEnd = () => {
        setDraggingId(null)
        setDragOverIndex(null)
    }

    return (
        <div className='navigator' ref={navigatorRef}>
            <div className="navigator-header">
                <span>Scenes</span>
                <button className="add-divider-btn" onClick={addDivider}>+ Act</button>
            </div>

            {navigatorItems.map((item, index) => {
                const isLastDivider = item.type === 'divider' && lastDividerIndex === index

                return (
                    <div
                        key={item.id}
                        ref={isLastDivider ? lastDividerRef : null}
                        onDragOver={e => onDragOver(e, index)}
                        onDragLeave={() => setDragOverIndex(null)}
                        onDrop={() => onDrop(index)}
                    >
                        <div className={`drop-zone ${dragOverIndex === index ? 'drop-zone--active' : ''}`} />

                        {item.type === 'divider' ? (
                            <DividerItem
                                item={item}
                                onLabelChange={updateDividerLabel}
                                onRemove={removeDivider}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                isDragging={draggingId === item.id}
                            />
                        ) : (
                            <SceneItem
                                item={item}
                                onJump={jumpToScene}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default Navigator