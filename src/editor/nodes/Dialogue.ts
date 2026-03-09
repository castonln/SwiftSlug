import { Node } from '@tiptap/core';

const Dialogue = Node.create({
  name: 'dialogue',
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p[data-type="dialogue"]' }]
  },

  renderHTML() {
    return ['p', { 'data-type': 'dialogue' }, 0]
  },
});

export default Dialogue;