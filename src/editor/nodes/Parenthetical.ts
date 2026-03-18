import { Node } from '@tiptap/core';
import { createNodeHelpers } from '../utils/nodeHelpers';
import { NodeNames } from '../constants/nodeNames';

const Parenthetical = Node.create({
  name: NodeNames.PARENTHETICAL,
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: `p[data-type="${NodeNames.PARENTHETICAL}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': `${NodeNames.PARENTHETICAL}` }, 0]
  },

  addKeyboardShortcuts() {
    const { createNode } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.DIALOGUE)
    }
  }
});

export default Parenthetical;