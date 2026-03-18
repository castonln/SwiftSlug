import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { NodeNames } from '../constants/nodeNames'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sceneNumbers: {
      setSceneNumbering: (enabled: boolean) => ReturnType
    }
  }
}

const SceneNumbers = Extension.create({
  name: 'sceneNumbers',

  addCommands() {
    return {
      setSceneNumbering: (enabled: boolean) => ({ tr, dispatch }) => {
        if (dispatch) tr.setMeta('sceneNumberingEnabled', enabled)
        return true
      }
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('sceneProcessing'),

        state: {
          init: () => false,
          apply(tr, value) {
            const meta = tr.getMeta('sceneNumberingEnabled')
            return meta !== undefined ? meta : value
          }
        },

        props: {
          decorations(state) {
            const enabled = this.getState(state)
            if (!enabled) return DecorationSet.empty

            const decorations: Decoration[] = []
            let sceneNumber = 0

            state.doc.forEach((node, pos) => {
              if (node.type.name !== NodeNames.SCENE_HEADING) return
              const number = node.attrs.sceneNumber ?? ++sceneNumber
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  'data-scene-number': String(number)
                })
              )
            })

            return DecorationSet.create(state.doc, decorations)
          }
        }
      })
    ]
  }
})

export default SceneNumbers