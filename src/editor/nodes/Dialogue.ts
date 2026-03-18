import { Node } from '@tiptap/core';
import { createNodeHelpers } from '../utils/nodeHelpers';
import { NodeNames } from '../constants/nodeNames';

const Dialogue = Node.create({
  name: NodeNames.DIALOGUE,
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: `p[data-type="${NodeNames.DIALOGUE}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': `${NodeNames.DIALOGUE}` }, 0]
  },

  addInputRules() {
    const { createInputRule } = createNodeHelpers(this.editor, this.name);

    return [
      createInputRule(/^\(/, NodeNames.PARENTHETICAL),
    ]
  },

  addKeyboardShortcuts() {
    const { createNode } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.ACTION)
    }
  }
});

export default Dialogue;