import { createContext, useContext, useState } from 'react'
import type { Editor } from '@tiptap/core'

export interface SceneHeading {
  type: 'scene'
  id: string        // use pos as string id
  number: number
  text: string
  pos: number
}

export interface ActDivider {
  type: 'divider'
  id: string
  label: string
}

export type NavigatorItem = SceneHeading | ActDivider

interface EditorSettings {
  showSceneNumbers: boolean
  setShowSceneNumbers: (val: boolean) => void
  navigatorItems: NavigatorItem[]
  setNavigatorItems: React.Dispatch<React.SetStateAction<NavigatorItem[]>>
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
}

const EditorContext = createContext<EditorSettings | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [showSceneNumbers, setShowSceneNumbers] = useState(false)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [navigatorItems, setNavigatorItems] = useState<NavigatorItem[]>([])

  return (
    <EditorContext.Provider value={{
      showSceneNumbers, setShowSceneNumbers, 
      editor, setEditor, 
      navigatorItems, setNavigatorItems
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