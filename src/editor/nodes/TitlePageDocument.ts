import { Node } from '@tiptap/core'

const TitlePageDocument = Node.create({
  name: 'doc',
  topNode: true,
  content: 'title_block+',
})

export default TitlePageDocument