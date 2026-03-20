import { Editor, InputRule } from '@tiptap/core'
import runIfNodeActive from './runIfNodeActive'

export const createNodeHelpers = (editor: Editor, targetNodeName: string) => {
  // runs defined action if node is active
  const run = (action: () => boolean) => runIfNodeActive({ editor, targetNodeName, action })

  // sets the current node to new nodeName
  const setNode = (nodeName: string, attrs?: Record<string, unknown>) =>
    run(() => editor.chain().setNode(nodeName, attrs).run())

  // splits the current node to where the cursor is now and creates a new nodeName
  const createNode = (nodeName: string) => run(() => {
    const { state } = editor
    const { $from } = state.selection
    const nodeType = state.schema.nodes[nodeName]
    if (!nodeType) return false
    // reset manualOverride on naturally created nodes
    const tr = state.tr.split($from.pos, 1, [{ type: nodeType, attrs: { manualOverride: false } }])
    editor.view.dispatch(tr)
    return true
  })

  // checks if the current node is empty
  const isEmpty = () => editor.state.selection.$head.parent.textContent === ''

  // creates a new input rule
  // set node to nodeName given regex find
  // skips if user has manually overridden the node type via toolbar
  const createInputRule = (find: RegExp, nodeName: string) => new InputRule({
    find,
    handler: ({ state, range, match }) => {
      const currentNode = state.selection.$head.parent
      if (currentNode.type.name !== targetNodeName) return null
      if (currentNode.attrs.manualOverride) return null
      const $from = state.doc.resolve(range.from)
      const blockStart = $from.start($from.depth)
      const blockEnd = $from.end($from.depth)
      const lastChar = match[0][match[0].length - 1]
      state.tr
        .setBlockType(blockStart, blockEnd, state.schema.nodes[nodeName])
        .insertText(lastChar)
    }
  })

  return { setNode, createNode, isEmpty, createInputRule }
}