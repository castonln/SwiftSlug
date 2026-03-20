import { NodeNames } from "./nodeNames";

type TransitionMap = Record<string, Partial<Record<string, string>>>

const Enter = '[Enter]'
const Tab = '[Tab]'
const Type = 'Type'

export const NODE_TRANSITIONS: TransitionMap = {
  [NodeNames.SCENE_HEADING]: {
    [NodeNames.ACTION]:         Enter,
  },
  [NodeNames.ACTION]: {
    [NodeNames.ACTION]:         Enter,
    [NodeNames.CHARACTER]:      Tab,
    [NodeNames.TRANSITION]:     Type,
    [NodeNames.SCENE_HEADING]:  Type,
  },
  [NodeNames.CHARACTER]: {
    [NodeNames.DIALOGUE]:       Enter,
  },
  [NodeNames.DIALOGUE]: {
    [NodeNames.ACTION]:         Enter,
    [NodeNames.PARENTHETICAL]:  Type,
  },
  [NodeNames.PARENTHETICAL]: {
    [NodeNames.DIALOGUE]:       Enter,
  },
  [NodeNames.TRANSITION]: {
    [NodeNames.SCENE_HEADING]:  Enter,
  },
}