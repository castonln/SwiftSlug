import { Node } from '@tiptap/core'
import { TitlePageNodeNames } from '../constants/titlePageNodeNames'

const createTitlePageNode = (name: string) => Node.create({
  name,
  group: 'title_block',
  content: 'inline*',
  defining: true,

  parseHTML() {
    return [{ tag: `p[data-type="${name}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': name }, 0]
  },

  // no deleting any nodes here
  addKeyboardShortcuts() {
    return {
      Enter: () => true, 
      Backspace: () => {
        const { $head } = this.editor.state.selection
        return $head.parentOffset === 0
      },
    }
  }
})

export const TitleNode    = createTitlePageNode(TitlePageNodeNames.TITLE)
export const CreditNode   = createTitlePageNode(TitlePageNodeNames.CREDIT)
export const AuthorNode   = createTitlePageNode(TitlePageNodeNames.AUTHOR)
export const SourceNode   = createTitlePageNode(TitlePageNodeNames.SOURCE)
export const ContactNode  = createTitlePageNode(TitlePageNodeNames.CONTACT)
export const DateNode     = createTitlePageNode(TitlePageNodeNames.DATE)