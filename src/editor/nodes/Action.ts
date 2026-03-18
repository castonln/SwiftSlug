import { Node } from '@tiptap/core';
import { createNodeHelpers } from '../utils/nodeHelpers';
import { NodeNames } from '../constants/nodeNames';

const Action = Node.create({
  name: NodeNames.ACTION,
  group: 'screenplay_block',
  content: 'inline*',

  parseHTML() {
    return [{ tag:  `p[data-type="${NodeNames.ACTION}"]` }]
  },

  renderHTML() {
    return ['p', { 'data-type': `${NodeNames.ACTION}` }, 0]
  },

  addInputRules() {
    const { createInputRule } = createNodeHelpers(this.editor, this.name);

    return [
      createInputRule(/^(INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)[\.\s]/i, NodeNames.SCENE_HEADING),
      createInputRule(/^[a-z\s]+to:$/i, NodeNames.TRANSITION),
    ]
  },

  addKeyboardShortcuts() {
    const { setNode, createNode, isEmpty } = createNodeHelpers(this.editor, this.name);

    return {
      Enter: () => createNode(NodeNames.ACTION),
      Tab: () => isEmpty()
        ? setNode(NodeNames.CHARACTER)
        : createNode(NodeNames.CHARACTER)
    }
  }
}
);

export default Action;