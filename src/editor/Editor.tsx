import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Text } from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import { PaginationPlus } from 'tiptap-pagination-plus';
import parseFountain from '../parser/parsefountain';
import '../style.css';
import './editor.css';
import Action from './nodes/Action';
import Character from './nodes/Character';
import Dialogue from './nodes/Dialogue';
import Document from './nodes/Document';
import Parenthetical from './nodes/Parenthetical';
import SceneHeading from './nodes/SceneHeading';
import Transition from './nodes/Transition';
import inchesToPixels from './nodes/utils/inchesToPixels';

function Editor() {
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
      PaginationPlus.configure({
        pageHeight: inchesToPixels(11),
        pageWidth: inchesToPixels(8.5),         // standard Letter paper dimensions
        marginLeft: 0,                          // offload this to each data-type CSS
        marginRight: 0,                         // offload this to each data-type CSS
        marginTop: inchesToPixels(0.5),         // margin before header (page number)
        contentMarginTop: inchesToPixels(0.5),  // margin after header (page number)
        contentMarginBottom: inchesToPixels(1),
        headerRight: "<div style='margin-right: 1in; cursor: default;'>{page}.</div>",
        footerRight: "",                        // this is set by default, so we empty it
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
        return false;
      }
    }
  });

  useEffect(() => {
    if (!editor) return;

    fetch('/script-srcs/Big-Fish.fountain')
      .then(res => res.text())
      .then(text => {
        console.log('Fetched text length:', text.length)          // is the file arriving?

        const { blocks } = parseFountain(text)
        console.log('Parsed blocks:', blocks.length)              // are blocks being produced?
        console.log('First block:', blocks[0])                    // does the shape look right?

        editor.commands.setContent({
          type: 'doc',
          content: blocks.map(block => ({
            type: block.type,
            attrs: { sceneNumber: block.sceneNumber },
            content: block.content
          }))
        })

        console.log('Editor JSON after setContent:', editor.getJSON())  // did TipTap accept it?
      })
      .catch(err => console.error('Failed to load Fountain:', err))

  }, [editor])  // runs once when editor is ready

  return (
    <EditorContent editor={editor} spellCheck={false} />
  );
}

export default Editor;