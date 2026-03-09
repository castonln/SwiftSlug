import { Node } from '@tiptap/core';

const SceneHeading = Node.create({
  name: 'scene_heading',
  group: 'screenplay_block',
  content: 'inline*',

  addAttributes() {
    return { sceneNumber: { default: null } }
  },

  parseHTML() {
    return [{ tag: 'p[data-type="scene-heading"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', { 'data-type': 'scene-heading', ...HTMLAttributes }, 0]
  },
});

export default SceneHeading;