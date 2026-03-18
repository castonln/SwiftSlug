import type { ActDivider } from "../../editor/EditorContext"

interface DividerItemProps {
  item: ActDivider
  onLabelChange: (id: string, label: string) => void
  onRemove: (id: string) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  isDragging: boolean
}

function DividerItem({ item, onLabelChange, onRemove, onDragStart, onDragEnd, isDragging }: DividerItemProps) {
  return (
    <div className={`act-divider ${isDragging ? 'act-divider--dragging' : ''}`}>
      <span
        className="act-divider-handle"
        draggable
        onDragStart={() => onDragStart(item.id)}
        onDragEnd={onDragEnd}
      >⠿</span>
      <input
        className="act-divider-label"
        value={item.label}
        onChange={e => onLabelChange(item.id, e.target.value)}
      />
      <button
        className="act-divider-remove"
        onClick={() => onRemove(item.id)}
      >✖</button>
    </div>
  )
}

export default DividerItem;