import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import { Text } from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect, useRef } from 'react'
import { PaginationPlus } from 'tiptap-pagination-plus'
import '../style.css'
import { NodeNames } from './constants/nodeNames'
import './editor.css'
import { useEditorSettings, type NavigatorItem, type SceneHeading as SceneHeadingType } from './EditorContext'
import SceneProcessing from './extensions/sceneProcessing'
import type { ScreenplayBlock } from './interfaces/screenplayBlock'
import Action from './nodes/Action'
import Character from './nodes/Character'
import Dialogue from './nodes/Dialogue'
import Document from './nodes/Document'
import Parenthetical from './nodes/Parenthetical'
import SceneHeading from './nodes/SceneHeading'
import Transition from './nodes/Transition'
import inchesToPixels from './nodes/utils/inchesToPixels'

interface EditorProps {
  blocks: ScreenplayBlock[]
}

function Editor({ blocks }: EditorProps) {
  const { showSceneNumbers, setNavigatorItems, navigatorItems, setEditor } = useEditorSettings()
  const previousSceneCount = useRef(0)

  const navigatorItemsRef = useRef(navigatorItems)
  useEffect(() => {
    navigatorItemsRef.current = navigatorItems
  }, [navigatorItems])

  const handleScenesUpdated = (scenes: SceneHeadingType[]) => {
    setNavigatorItems((prev: NavigatorItem[]) => {
      const result: NavigatorItem[] = []
      let sceneIndex = 0

      prev.forEach((item: NavigatorItem) => {
        if (item.type === 'divider') {
          result.push(item)
        } else {
          const freshScene = scenes[sceneIndex]
          if (freshScene) result.push(freshScene)
          sceneIndex++
        }
      })

      while (sceneIndex < scenes.length) {
        result.push(scenes[sceneIndex++])
      }

      return result
    })
  }

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      SceneHeading,
      Action,
      Character,
      Dialogue,
      Parenthetical,
      Transition,
      Bold,
      Italic,
      Underline,
      SceneProcessing.configure({ onScenesUpdated: handleScenesUpdated }),
      PaginationPlus.configure({
        pageHeight: inchesToPixels(11),
        pageWidth: inchesToPixels(8.5),
        marginLeft: 0,
        marginRight: 0,
        marginTop: inchesToPixels(0.5),
        contentMarginTop: inchesToPixels(0.5),
        contentMarginBottom: inchesToPixels(1),
        headerRight: "<div style='margin-right: 0.5in; cursor: default;'>{page}.</div>",
        footerRight: "",
        pageGap: 50,
        pageGapBorderSize: 1,
        pageGapBorderColor: "#e5e5e5",
        pageBreakBackground: "#242424",
      })
    ],
    content: {
      type: 'doc',
      content: []
    },
    editorProps: {
      handleKeyDown(_, event) {
        if (event.key === 'Tab') {
          event.preventDefault()
        }
        return false
      }
    },
    onUpdate({ editor }) {
      const currentScenes = editor.state.doc.content.content.filter(
        node => node.type.name === NodeNames.SCENE_HEADING
      )

      previousSceneCount.current = currentScenes.length
    }
  })

  useEffect(() => {
    setEditor(editor)
  }, [editor])

  useEffect(() => {
    if (!editor || blocks.length === 0) return
    editor.commands.setContent({
      type: 'doc',
      content: blocks.map(block => ({
        type: block.type,
        attrs: { sceneNumber: block.sceneNumber },
        content: block.content
      }))
    })
  }, [editor, blocks])

  useEffect(() => {
    if (!editor) return
    editor.commands.setSceneNumbering(showSceneNumbers)
  }, [editor, showSceneNumbers])

  return (
    <EditorContent editor={editor} spellCheck={false} />
  )
}

export default Editor