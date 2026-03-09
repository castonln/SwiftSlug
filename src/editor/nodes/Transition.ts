import { Node } from '@tiptap/core';

const Transition = Node.create({
  name: 'transition',
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p[data-type="transition"]' }]
  },

  renderHTML() {
    return ['p', { 'data-type': 'transition' }, 0]
  },
});

export default Transition;