import type { Editor } from '@tiptap/core'
import { createContext, useContext, useState } from 'react'
import type { ScreenplayBlock } from './interfaces/ScreenplayBlock'
import type { TitlePageData } from './interfaces/TitlePageData'
import type { SceneHeading } from './interfaces/SceneHeading'

const defaultTitlePage: TitlePageData = {
    title: 'Title',
    credit: 'Written by',
    author: 'Author',
    source: 'Source',
    contact: 'Contact',
    date: 'Date',
}

interface EditorSettings {
  showSceneNumbers: boolean
  setShowSceneNumbers: (val: boolean) => void
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
  sceneHeadings: SceneHeading[]
  setSceneHeadings: React.Dispatch<React.SetStateAction<SceneHeading[]>>
  titlePage: TitlePageData
  setTitlePage: (val: TitlePageData) => void
  blocks: ScreenplayBlock[]
  setBlocks: (val: ScreenplayBlock[]) => void
}

const EditorContext = createContext<EditorSettings | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [showSceneNumbers, setShowSceneNumbers] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [sceneHeadings, setSceneHeadings] = useState<SceneHeading[]>([])
  const [blocks, setBlocks] = useState<ScreenplayBlock[]>([])
  const [titlePage, setTitlePage] = useState<TitlePageData>(defaultTitlePage)

  return (
    <EditorContext.Provider value={{
      showSceneNumbers, setShowSceneNumbers, 
      editor, setEditor, 
      sceneHeadings, setSceneHeadings,
      blocks, setBlocks,
      titlePage, setTitlePage
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditorSettings() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditorSettings must be used inside EditorProvider')
  return ctx
}