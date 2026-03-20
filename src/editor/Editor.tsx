import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import { Text } from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { PaginationPlus } from 'tiptap-pagination-plus'
import '../style.css'
import './editor.css'
import { useEditorSettings } from './EditorContext'
import SceneNumbers from './extensions/sceneProcessing'
import type { ScreenplayBlock } from './interfaces/ScreenplayBlock'
import Action from './nodes/Action'
import Character from './nodes/Character'
import Dialogue from './nodes/Dialogue'
import Document from './nodes/Document'
import Parenthetical from './nodes/Parenthetical'
import SceneHeading from './nodes/SceneHeading'
import Transition from './nodes/Transition'
import { NodeNames } from './constants/nodeNames'
import inchesToPixels from './utils/inchesToPixels'
import getSceneHeadings from './utils/getSceneHeadings'

interface EditorProps {
  blocks: ScreenplayBlock[]
}

function EditorComponent({ blocks }: EditorProps) {
  const { showSceneNumbers, setEditor, setSceneHeadings } = useEditorSettings()

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
      SceneNumbers,
      PaginationPlus.configure({
        pageHeight: inchesToPixels(11),
        pageWidth: inchesToPixels(8.5),
        marginLeft: 0,
        marginRight: 0,
        marginTop: inchesToPixels(0.5),         
        contentMarginTop: inchesToPixels(0.5) - 16,   // minus line height since page numbers
        contentMarginBottom: inchesToPixels(1) - 20,  // i dont have an explaination for this one LMAO
        headerRight: "<div style='margin-right: 0.5in; cursor: default;'>{page}.</div>",
        footerRight: "",
        pageGap: 50,
        pageGapBorderSize: 1,
        pageGapBorderColor: "#e5e5e5",
        pageBreakBackground: "rgb(248, 250, 253)",
      })
    ],
    content: {
      type: 'doc',
      content: [{ type: NodeNames.SCENE_HEADING, text: '' }]
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
      setSceneHeadings(getSceneHeadings(editor))
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
    setSceneHeadings(getSceneHeadings(editor))
  }, [editor, blocks])

  useEffect(() => {
    if (!editor) return
    editor.commands.setSceneNumbering(showSceneNumbers)
  }, [editor, showSceneNumbers])

  return (
    <EditorContent editor={editor} spellCheck={false} />
  )
}

export default EditorComponent