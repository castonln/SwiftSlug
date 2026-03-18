import type { SceneHeading } from "../../editor/EditorContext";

interface SceneItemProps {
  item: SceneHeading
  onJump: (scene: SceneHeading) => void
}

function SceneItem({ item, onJump }: SceneItemProps) {
  return (
    <div className="scene-shortcut" onClick={() => onJump(item)}>
      <strong>{item.number}.</strong> {item.text}
    </div>
  )
}

export default SceneItem;