import { Node } from '@tiptap/core';

const Character = Node.create({
  name: 'character',
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p[data-type="character"]' }]
  },

  renderHTML() {
    return ['p', { 'data-type': 'character' }, 0]
  },
});

export default Character;