import { Editor } from '@tiptap/core';

interface RunIfNodeActiveProps {
  editor: Editor
  targetNodeName: string
  action: () => boolean
}

const runIfNodeActive = ({ editor, targetNodeName, action }: RunIfNodeActiveProps) => {
  const { state } = editor
  const currentNode = state.selection.$head.parent
  if (currentNode.type.name !== targetNodeName) return false
  return action()
}

export default runIfNodeActive