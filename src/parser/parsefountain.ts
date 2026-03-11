import { NodeNames } from '../editor/nodes/utils/nodeNames'

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
  dual?: boolean
}

interface TitlePage {
  [key: string]: string
}

interface ParsedFountain {
  titlePage: TitlePage
  blocks: ScreenplayBlock[]
}

function parseEmphasis(text: string): TiptapTextNode[] {
  const nodes: TiptapTextNode[] = []
  const regex = /\\\*|\\_|\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|_(.+?)_/g

  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text' as const, text: text.slice(lastIndex, match.index) })
    }

    if (match[0] === '\\*' || match[0] === '\\_') {
      nodes.push({ type: 'text' as const, text: match[0][1] })
    } else if (match[1] !== undefined) {
      nodes.push({ type: 'text' as const, text: match[1], marks: [{ type: 'bold' }, { type: 'italic' }] })
    } else if (match[2] !== undefined) {
      nodes.push({ type: 'text' as const, text: match[2], marks: [{ type: 'bold' }] })
    } else if (match[3] !== undefined) {
      nodes.push({ type: 'text' as const, text: match[3], marks: [{ type: 'italic' }] })
    } else if (match[4] !== undefined) {
      nodes.push({ type: 'text' as const, text: match[4], marks: [{ type: 'underline' }] })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text' as const, text: text.slice(lastIndex) })
  }

  return nodes.filter(n => n.text.length > 0)
}

function extractSceneNumber(line: string): { heading: string; sceneNumber: string | null } {
  const match = line.match(/^(.*?)\s*#([A-Za-z0-9.\-]+)#\s*$/)
  if (match) return { heading: match[1].trim(), sceneNumber: match[2] }
  return { heading: line, sceneNumber: null }
}

function isSceneHeading(line: string, lines: string[], i: number): boolean {
  const nextBlank = !lines[i + 1]?.trim()
  if (!nextBlank) return false
  return /^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)[\.\s]/i.test(line)
}

function isTransition(line: string, lines: string[], i: number): boolean {
  const prevBlank = i === 0 || !lines[i - 1]?.trim()
  const nextBlank = !lines[i + 1]?.trim()
  return prevBlank && nextBlank && /^[A-Z\s]+TO:$/.test(line)
}

function isCharacter(line: string, lines: string[], i: number): boolean {
  const prevBlank = i === 0 || !lines[i - 1]?.trim()
  const nextNonBlank = !!lines[i + 1]?.trim()
  if (!prevBlank || !nextNonBlank) return false
  const cleaned = line.replace(/\s*\^$/, '').trim()
  return /[A-Z]/.test(cleaned) && /^[A-Z][A-Z0-9\s.()/\-']*$/.test(cleaned)
}

function parseDialogueBlock(lines: string[], i: number, blocks: ScreenplayBlock[]): number {
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) break

    if (/^\(.*\)$/.test(trimmed)) {
      blocks.push({ type: NodeNames.PARENTHETICAL, sceneNumber: null, content: parseEmphasis(trimmed) })
      i++
      continue
    }

    const dialogueLines: string[] = [trimmed]
    i++

    while (i < lines.length) {
      const next = lines[i]
      const nextTrimmed = next.trim()

      if (next === '  ') {
        dialogueLines.push('')
        i++
        continue
      }

      if (!nextTrimmed) break
      if (/^\(.*\)$/.test(nextTrimmed)) break
      if (isCharacter(nextTrimmed, lines, i)) break

      dialogueLines.push(nextTrimmed)
      i++
    }

    blocks.push({
      type: NodeNames.DIALOGUE,
      sceneNumber: null,
      content: parseEmphasis(dialogueLines.join('\n'))
    })
  }

  return i
}

const TITLE_PAGE_KEYS = new Set([
  'title', 'credit', 'author', 'authors', 'source',
  'draft date', 'date', 'contact', 'copyright', 'notes',
  'revision', 'watermark', 'font', 'format'
])

function parseTitlePage(text: string): { titlePage: TitlePage; rest: string } {
  const titlePage: TitlePage = {}
  const lines = text.split('\n')

  const firstKeyMatch = lines[0]?.trim().match(/^([A-Za-z][A-Za-z\s]*):\s*(.*)/)
  const firstKey = firstKeyMatch?.[1]?.toLowerCase().trim()
  if (!firstKey || !TITLE_PAGE_KEYS.has(firstKey)) {
    return { titlePage, rest: text }
  }

  let i = 0
  let currentKey = ''

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '' && (lines[i + 1]?.trim() ?? '') === '') {
      i += 2
      break
    }

    if (trimmed === '') { i++; continue }

    const keyMatch = line.match(/^([A-Za-z][A-Za-z\s]*):\s*(.*)/)
    if (keyMatch) {
      const key = keyMatch[1].toLowerCase().trim()
      if (!TITLE_PAGE_KEYS.has(key)) break
      currentKey = key
      titlePage[currentKey] = keyMatch[2].trim()
    } else if (/^(\s{3,}|\t)/.test(line) && currentKey) {
      titlePage[currentKey] = titlePage[currentKey]
        ? titlePage[currentKey] + '\n' + trimmed
        : trimmed
    } else {
      break
    }

    i++
  }

  return { titlePage, rest: lines.slice(i).join('\n') }
}

function parseFountain(text: string): ParsedFountain {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  text = text.replace(/\/\*[\s\S]*?\*\//g, '')
  text = text.replace(/\[\[[\s\S]*?\]\]/g, '')

  const { titlePage, rest } = parseTitlePage(text)
  const lines = rest.split('\n')
  const blocks: ScreenplayBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) { i++; continue }
    if (/^={3,}$/.test(trimmed)) { i++; continue }
    if (/^#+\s/.test(trimmed)) { i++; continue }
    if (/^=\s/.test(trimmed)) { i++; continue }

    if (/^>.*<$/.test(trimmed)) {
      blocks.push({ type: NodeNames.ACTION, sceneNumber: null, content: parseEmphasis(trimmed.slice(1, -1).trim()) })
      i++; continue
    }

    if (trimmed.startsWith('>') && !trimmed.endsWith('<')) {
      blocks.push({ type: NodeNames.TRANSITION, sceneNumber: null, content: parseEmphasis(trimmed.slice(1).trim()) })
      i++; continue
    }

    if (/^\.[A-Za-z]/.test(trimmed)) {
      const { heading, sceneNumber } = extractSceneNumber(trimmed.slice(1))
      blocks.push({ type: NodeNames.SCENE_HEADING, sceneNumber, content: parseEmphasis(heading) })
      i++; continue
    }

    if (trimmed.startsWith('!')) {
      const actionLines = [trimmed.slice(1)]
      i++
      while (i < lines.length && lines[i].trim()) {
        actionLines.push(lines[i])
        i++
      }
      blocks.push({ type: NodeNames.ACTION, sceneNumber: null, content: parseEmphasis(actionLines.join('\n')) })
      continue
    }

    if (trimmed.startsWith('@')) {
      const isDual = trimmed.endsWith('^')
      const charName = trimmed.slice(1).replace(/\s*\^$/, '').trim()
      blocks.push({ type: NodeNames.CHARACTER, sceneNumber: null, content: parseEmphasis(charName), dual: isDual })
      i++
      i = parseDialogueBlock(lines, i, blocks)
      continue
    }

    if (trimmed.startsWith('~')) {
      blocks.push({ type: NodeNames.ACTION, sceneNumber: null, content: parseEmphasis(trimmed.slice(1).trim()) })
      i++; continue
    }

    if (isSceneHeading(trimmed, lines, i)) {
      const { heading, sceneNumber } = extractSceneNumber(trimmed)
      blocks.push({ type: NodeNames.SCENE_HEADING, sceneNumber, content: parseEmphasis(heading) })
      i++; continue
    }

    if (isTransition(trimmed, lines, i)) {
      blocks.push({ type: NodeNames.TRANSITION, sceneNumber: null, content: parseEmphasis(trimmed) })
      i++; continue
    }

    if (isCharacter(trimmed, lines, i)) {
      const isDual = trimmed.endsWith('^')
      const charName = trimmed.replace(/\s*\^$/, '').trim()
      blocks.push({ type: NodeNames.CHARACTER, sceneNumber: null, content: parseEmphasis(charName), dual: isDual })
      i++
      i = parseDialogueBlock(lines, i, blocks)
      continue
    }

    const actionLines = [line]
    i++
    while (i < lines.length && lines[i].trim()) {
      actionLines.push(lines[i])
      i++
    }
    blocks.push({ type: NodeNames.ACTION, sceneNumber: null, content: parseEmphasis(actionLines.join('\n')) })
  }

  return { titlePage, blocks }
}

export default parseFountain