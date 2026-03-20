import { useEditor, EditorContent } from '@tiptap/react'
import { Text } from '@tiptap/extension-text'
import TitlePageDocument from './nodes/TitlePageDocument'
import {
  TitleNode, CreditNode, AuthorNode,
  SourceNode, ContactNode, DateNode
} from './nodes/TitlePageNodes'
import PreventNodeDeletion from './extensions/preventNodeDeletion'
import { useEffect } from 'react'
import { TitlePageNodeNames } from './constants/titlePageNodeNames'
import { useEditorSettings } from './EditorContext'

interface TitlePageData {
  title: string
  credit: string
  author: string
  source: string
  contact: string
  date: string
}

function TitlePageEditor({ data }: { data: TitlePageData }) {
  const { setActiveNodeType } = useEditorSettings()

  const titlePageFields: [string, string][] = [
    [TitlePageNodeNames.TITLE, data.title],
    [TitlePageNodeNames.CREDIT, data.credit],
    [TitlePageNodeNames.AUTHOR, data.author],
    [TitlePageNodeNames.SOURCE, data.source],
    [TitlePageNodeNames.CONTACT, data.contact],
    [TitlePageNodeNames.DATE, data.date],
  ]

  const content = titlePageFields.map(([nodeType, value]) => ({
    type: nodeType,
    content: [{ type: 'text', text: value || ' ' }]
  }))

  const editor = useEditor({
    extensions: [
      TitlePageDocument,
      Text,
      TitleNode,
      CreditNode,
      AuthorNode,
      SourceNode,
      ContactNode,
      DateNode,
      PreventNodeDeletion,
    ],
    content: {
      type: 'doc',
      content: content
    },
    onUpdate({ editor }) {
      const type = editor.state.selection.$head.parent.type.name
      setActiveNodeType(type)
    },
    onSelectionUpdate({ editor }) {
      const type = editor.state.selection.$head.parent.type.name
      setActiveNodeType(type)
    }
  })

  useEffect(() => {
    if (!editor) return

    editor.commands.setContent({
      type: 'doc',
      content: content
    })
  }, [editor, data])

  return (
    <EditorContent editor={editor} spellCheck={false} />
  )
}

export default TitlePageEditor