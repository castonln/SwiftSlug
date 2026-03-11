import { Node } from '@tiptap/core';
import { createNodeHelpers } from './utils/nodeHelpers';
import { NodeNames } from './utils/nodeNames';

const Character = Node.create({
  name: NodeNames.CHARACTER,
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: `p[data-type="${NodeNames.CHARACTER}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': `${NodeNames.CHARACTER}` }, 0]
  },

  addKeyboardShortcuts() {
    const { createNode } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.DIALOGUE)
    }
  }
});

export default Character;