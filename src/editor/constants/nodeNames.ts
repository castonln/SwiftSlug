export const NodeNames = {
  ACTION:        'action',
  CHARACTER:     'character',
  DIALOGUE:      'dialogue',
  PARENTHETICAL: 'parenthetical',
  SCENE_HEADING: 'scene-heading',
  TRANSITION:    'transition',
} as const

export type NodeName = typeof NodeNames[keyof typeof NodeNames];