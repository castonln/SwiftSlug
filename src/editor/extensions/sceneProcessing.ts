import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { NodeNames } from '../constants/nodeNames'
import type { SceneHeading } from '../EditorContext'

interface SceneProcessingOptions {
  enabled: boolean
  onScenesUpdated: (scenes: SceneHeading[]) => void
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sceneProcessing: {
      setSceneNumbering: (enabled: boolean) => ReturnType
    }
  }
}

const SceneProcessing = Extension.create<SceneProcessingOptions>({
  name: 'sceneProcessing',

  addOptions() {
    return {
      enabled: false,
      onScenesUpdated: () => { }
    }
  },

  addCommands() {
    return {
      setSceneNumbering: (enabled: boolean) => ({ tr, dispatch }) => {
        if (dispatch) tr.setMeta('sceneNumberingEnabled', enabled)
        return true
      }
    }
  },

  addProseMirrorPlugins() {
    const extension = this
    
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
            const decorations: Decoration[] = []
            const scenes: SceneHeading[] = []
            let sceneNumber = 0

            state.doc.forEach((node, pos) => {
              if (node.type.name !== NodeNames.SCENE_HEADING) return

              const number = node.attrs.sceneNumber ?? ++sceneNumber
              const text = node.textContent

              scenes.push({
                type: 'scene',
                id: String(pos),
                number,
                text,
                pos
              })

              if (enabled) {
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    'data-scene-number': String(number)
                  })
                )
              }
            })

            requestAnimationFrame(() => extension.options.onScenesUpdated(scenes))

            return DecorationSet.create(state.doc, decorations)
          }
        }
      })
    ]
  }
})

export default SceneProcessing