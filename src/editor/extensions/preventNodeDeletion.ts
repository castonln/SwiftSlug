import { Plugin } from '@tiptap/pm/state'
import { Extension } from '@tiptap/core'

const PreventNodeDeletion = Extension.create({
    name: 'preventNodeDeletion',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                filterTransaction(tr) {
                    // Allow non-document-changing transactions
                    if (!tr.docChanged) return true

                    // Block any transaction that reduces node count
                    const before = tr.before.childCount
                    const after = tr.doc.childCount
                    if (after < before) return false

                    return true
                }
            })
        ]
    }
});

export default PreventNodeDeletion;