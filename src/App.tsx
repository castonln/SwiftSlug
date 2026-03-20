import Editor from './editor/Editor'
import { useEditorSettings } from './editor/EditorContext'
import TitlePageEditor from './editor/TitlePageEditor'
import Navigator from './navigator/Navigator'
import Toolbar from './toolbar/Toolbar'

const App = () => {
    // TODO: move this into the TitlePageEditor and Editor instead of out here
    const { titlePage, blocks } = useEditorSettings()

    return (
        <>
            <Toolbar />

            <div className='editor-container'>
                <Navigator />
                <div style={{ marginTop: '50px', marginBottom: '100px' }}>
                    <div className="print-container">
                        <TitlePageEditor data={titlePage} />
                        <Editor blocks={blocks} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default App