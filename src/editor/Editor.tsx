import { Text } from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import '../style.css';
import './editor.css';
import Action from './nodes/Action';
import Character from './nodes/Character';
import Document from './nodes/Document';
import SceneHeading from './nodes/SceneHeading';
import Dialogue from './nodes/Dialogue';
import Parenthetical from './nodes/Parenthetical';
import Transition from './nodes/Transition';
import parseFdx from '../parser/parsefdx';
import Italic from '@tiptap/extension-italic';
import Bold from '@tiptap/extension-bold';
import Underline from '@tiptap/extension-underline';
import parseFountain from '../parser/parsefountain';

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
    <div className="editor-container">
      <EditorContent editor={editor} spellCheck={false} />
    </div>
  );
}

export default Editor;