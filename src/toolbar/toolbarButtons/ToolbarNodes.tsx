import { useEditorSettings } from '../../editor/EditorContext'
import { NODE_TRANSITIONS } from '../../editor/constants/transitionMap'
import { NodeNames } from '../../editor/constants/nodeNames'
import CharacterSvg from '../icon/CharacterSvg'
import DialogueSvg from '../icon/DialogueSvg'
import { useEffect } from 'react'

const ToolbarNodes = () => {
    const { activeNodeType, editor } = useEditorSettings()

    useEffect(() => {
        console.log(activeNodeType)
    }, [activeNodeType])

    const transitions = activeNodeType ? NODE_TRANSITIONS[activeNodeType] ?? {} : {}

    const shortcut = (nodeType: string) => transitions[nodeType] ?? null
    const isActive = (nodeType: string) => activeNodeType === nodeType
    const setNode = (nodeType: string) => {
        if (!editor) return
        editor.chain().focus().setNode(nodeType, { manualOverride: true }).run()
    }

    const toolbarNodes = [
        {
            node: NodeNames.SCENE_HEADING,
            label: <>INT./EXT.</>
        },
        {
            node: NodeNames.ACTION,
            label: <>Action</>
        },
        {
            node: NodeNames.CHARACTER,
            label: <CharacterSvg width={16} height={16} fill="#555" />
        },
        {
            node: NodeNames.DIALOGUE,
            label: <DialogueSvg width={16} height={16} fill="#555" />
        },
        {
            node: NodeNames.PARENTHETICAL,
            label: <>()</>
        },
        {
            node: NodeNames.TRANSITION,
            label: <>TO:</>
        },
    ]

    return (

        <div className='toolbar-nodes'>
            {toolbarNodes.map(({ node, label }) => {
                return (
                    <button
                        key={node}
                        className={`toolbar-btn ${isActive(node) ? 'toolbar-btn--active' : ''}`}
                        title={node}
                        onClick={() => setNode(node)}>
                        <div>{label}</div>
                        {shortcut(node) && (
                            <div className='toolbar-btn__shortcut-label'>{shortcut(node)}</div>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default ToolbarNodes