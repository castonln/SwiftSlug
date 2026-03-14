import { Node } from '@tiptap/core';
import { NodeNames } from '../constants/nodeNames';
import { createNodeHelpers } from './utils/nodeHelpers';

const Transition = Node.create({
  name: NodeNames.TRANSITION,
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: `p[data-type="${NodeNames.TRANSITION}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': `${NodeNames.TRANSITION}` }, 0]
  },

  addKeyboardShortcuts() {
    const { createNode } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.SCENE_HEADING)
    }
  }
});

export default Transition;