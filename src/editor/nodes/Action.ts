import { Node } from '@tiptap/core';

const Action = Node.create({
  name: 'action',
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p[data-type="action"]' }]
  },

  renderHTML() {
    return ['p', { 'data-type': 'action' }, 0]
  },
});

export default Action;