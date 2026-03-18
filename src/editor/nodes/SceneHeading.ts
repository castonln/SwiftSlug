import { Node } from '@tiptap/core';
import { NodeNames } from '../constants/nodeNames';
import { createNodeHelpers } from '../utils/nodeHelpers';

const SceneHeading = Node.create({
  name: NodeNames.SCENE_HEADING,
  group: 'screenplay_block',
  content: 'inline*',

  addAttributes() {
    return { sceneNumber: { default: null } }
  },

  parseHTML() {
    return [{ tag: `p[data-type="${NodeNames.SCENE_HEADING}"]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', { 'data-type': `${NodeNames.SCENE_HEADING}`, ...HTMLAttributes }, 0]
  },

  addKeyboardShortcuts() {
    const { createNode } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.ACTION)
    }
  }
});

export default SceneHeading;