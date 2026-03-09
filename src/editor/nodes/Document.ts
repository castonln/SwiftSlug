import { Node } from '@tiptap/core';

// Only allows custom nodes in Doc
const Document = Node.create({
  name: 'doc',
  topNode: true,
  content: 'screenplay_block*',
})

export default Document;