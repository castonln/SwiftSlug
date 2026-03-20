import type { Editor } from '@tiptap/core'
import type { TitlePageData } from '../editor/interfaces/TitlePageData'
import { NodeNames } from '../editor/constants/nodeNames'

export function exportFountain(editor: Editor, titlePage: TitlePageData): string {
  const lines: string[] = []

  // Title page
  if (titlePage.title)   lines.push(`Title: ${titlePage.title}`)
  if (titlePage.credit)  lines.push(`Credit: ${titlePage.credit}`)
  if (titlePage.author)  lines.push(`Author: ${titlePage.author}`)
  if (titlePage.source)  lines.push(`Source: ${titlePage.source}`)
  if (titlePage.date)    lines.push(`Draft date: ${titlePage.date}`)
  if (titlePage.contact) lines.push(`Contact: ${titlePage.contact}`)
  lines.push('', '')  // two blank lines end title page

  // Script content
  editor.state.doc.forEach(node => {
    const text = node.textContent

    switch (node.type.name) {
      case NodeNames.SCENE_HEADING:
        lines.push('', text.toUpperCase(), '')
        break
      case NodeNames.ACTION:
        lines.push('', text, '')
        break
      case NodeNames.CHARACTER:
        lines.push('', text.toUpperCase())
        break
      case NodeNames.DIALOGUE:
        lines.push(text)
        break
      case NodeNames.PARENTHETICAL:
        lines.push(text)
        break
      case NodeNames.TRANSITION:
        lines.push('', text.toUpperCase(), '')
        break
    }
  })

  return lines.join('\n')
}