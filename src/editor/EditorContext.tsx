import { createContext, useContext, useState } from 'react'
import type { Editor } from '@tiptap/core'

export interface SceneHeading {
  type: 'scene'
  number: number
  text: string
  pos: number
}

interface EditorSettings {
  showSceneNumbers: boolean
  setShowSceneNumbers: (val: boolean) => void
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
  sceneHeadings: SceneHeading[]
  setSceneHeadings: React.Dispatch<React.SetStateAction<SceneHeading[]>>
}

const EditorContext = createContext<EditorSettings | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [showSceneNumbers, setShowSceneNumbers] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [sceneHeadings, setSceneHeadings] = useState<SceneHeading[]>([])

  return (
    <EditorContext.Provider value={{
      showSceneNumbers, setShowSceneNumbers, 
      editor, setEditor, 
      sceneHeadings, setSceneHeadings
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