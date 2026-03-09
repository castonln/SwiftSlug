import { Text } from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import '../style.css';
import './editor.css';
import Action from './nodes/Action';
import Character from './nodes/Character';
import Document from './nodes/Document';
import SceneHeading from './nodes/SceneHeading';
import Dialogue from './nodes/Dialogue';
import Parenthetical from './nodes/Parenthetical';
import Transition from './nodes/Transition';
import testParse from './testparse';

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
    ],
    content: {
      type: 'doc',
      content: testParse
    },
    editorProps: {
      handleKeyDown(_, event) {
        // Stop default tab behavior
        if (event.key === 'Tab') {
          event.preventDefault()
        }
        return false;
      }
    }
  });


  return (
    <div className="editor-container">
      <EditorContent editor={editor} spellCheck={false} />
    </div>
  );
}

export default Editor;
