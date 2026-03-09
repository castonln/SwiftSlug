import { TextStyleKit } from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import FontFamily from '@tiptap/extension-text-style/font-family'
import '../style.css'
import StarterKit from '@tiptap/starter-kit'

function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyleKit,  
      FontFamily.configure({
      types: ['textStyle'],
    }),
    ], // define your extension array
    content: '<p>Hello World!</p>', // initial content
    onCreate({ editor }) {
      editor.commands.setFontFamily('Courier')
    },

  })


  return (
    <>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
    </>
  )
}

export default Editor
