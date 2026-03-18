import { type Ref } from 'react'
import type { SceneHeading } from "../../editor/EditorContext"

interface SceneItemProps {
  item: SceneHeading
  onJump: (scene: SceneHeading) => void
  className?: string
  ref?: Ref<HTMLDivElement>
}

function SceneItem({ item, onJump, className, ref }: SceneItemProps) {
  return (
    <div
      ref={ref}
      className={`scene-shortcut ${className ?? ''}`}
      onClick={() => onJump(item)}
    >
      <strong>{item.number}.</strong> {item.text}
    </div>
  )
}

export default SceneItem