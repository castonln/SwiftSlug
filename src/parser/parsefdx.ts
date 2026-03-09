type MarkType = 'bold' | 'italic' | 'underline'

interface TiptapMark {
  type: MarkType
}

interface TiptapTextNode {
  type: 'text'
  text: string
  marks?: TiptapMark[]
}

interface ScreenplayBlock {
  type: string
  sceneNumber: string | null
  content: TiptapTextNode[]
}

interface TitlePage {
  [key: string]: string
}

interface ParsedFdx {
  titlePage: TitlePage
  blocks: ScreenplayBlock[]
}

const typeMap: Record<string, string> = {
  'Scene Heading': 'scene_heading',
  'Action': 'action',
  'Character': 'character',
  'Dialogue': 'dialogue',
  'Parenthetical': 'parenthetical',
  'Transition': 'transition',
  'General': 'action',
}

function parseTextNodes(paragraph: Element): TiptapTextNode[] {
  const textNodes = paragraph.querySelectorAll('Text')

  return Array.from(textNodes)
    .map(node => {
      const text = node.textContent ?? ''
      const style = node.getAttribute('Style') ?? ''
      const marks: TiptapMark[] = []

      if (style.includes('Underline')) marks.push({ type: 'underline' })
      if (style.includes('Bold')) marks.push({ type: 'bold' })
      if (style.includes('Italic')) marks.push({ type: 'italic' })

      return marks.length > 0
        ? { type: 'text' as const, text, marks }
        : { type: 'text' as const, text }
    })
    .filter(node => node.text.length > 0)
}

function parseTitlePage(xml: Document): TitlePage {
  const titlePage: TitlePage = {}
  const titlePageEl = xml.querySelector('TitlePage')
  if (!titlePageEl) return titlePage

  titlePageEl.querySelectorAll('Content > Paragraph').forEach(p => {
    const label = p.getAttribute('Label')?.toLowerCase()
    const text = p.querySelector('Text')?.textContent?.trim()
    if (label && text) titlePage[label] = text
  })

  return titlePage;
}

function parseFdx(xmlString: string): ParsedFdx {
  const xml = new DOMParser().parseFromString(xmlString, 'text/xml')

  const parserError = xml.querySelector('parsererror')
  if (parserError) {
    throw new Error('Invalid FDX file: ' + parserError.textContent)
  }

  const titlePage = parseTitlePage(xml)

  const content = xml.querySelector('Content')
  if (!content) throw new Error('FDX file has no Content element')

  const blocks: ScreenplayBlock[] = Array.from(content.querySelectorAll('Paragraph'))
    .filter(p => {
      const type = p.getAttribute('Type')
      return type && type !== 'Dual Dialogue'
    })
    .map(p => {
      const fdxType = p.getAttribute('Type') ?? ''
      const sceneNumber = p.getAttribute('Number') ?? null
      const content = parseTextNodes(p)

      const fullText = content.map(n => n.text).join('')
      if (!fullText.trim()) return null

      return {
        type: typeMap[fdxType] ?? 'action',
        sceneNumber,
        content,
      }
    })
    .filter((block): block is ScreenplayBlock => block !== null)

  return { titlePage, blocks }
}

export default parseFdx;