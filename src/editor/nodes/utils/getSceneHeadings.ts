import { NodeNames } from "../../constants/nodeNames"
import type { SceneHeading } from "../../EditorContext"
import type { Editor } from '@tiptap/core'

const getSceneHeadings = (editor: Editor): SceneHeading[] => {
  const scenes: SceneHeading[] = []
  let sceneNumber = 0

  editor.state.doc.forEach((node, pos) => {
    if (node.type.name !== NodeNames.SCENE_HEADING) return
    scenes.push({
      type: 'scene',
      number: node.attrs.sceneNumber ?? ++sceneNumber,
      text: node.textContent,
      pos
    })
  })

  return scenes
}

export default getSceneHeadings