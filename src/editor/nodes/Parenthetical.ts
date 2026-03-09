import { Node } from '@tiptap/core';

const Parenthetical = Node.create({
  name: 'parenthetical',
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'p[data-type="parenthetical"]' }]
  },

  renderHTML() {
    return ['p', { 'data-type': 'parenthetical' }, 0]
  },
});

export default Parenthetical;