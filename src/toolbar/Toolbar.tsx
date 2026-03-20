import Icon from './icon/Icon'
import './toolbar.css'
import ExportFile from './toolbarButtons/ExportFile'
import ImportFile from './toolbarButtons/ImportFile'
import Settings from './toolbarButtons/Settings'
import ToolbarNodes from './toolbarButtons/ToolbarNodes'

const Toolbar = () => {
    return (
        <div className='toolbar'>
            <div className='toolbar-group'>
                <Icon fill='#682860' height={25} width={25} />
                <ImportFile />
                <ExportFile />
                <Settings />
            </div>
            <ToolbarNodes />
        </div>
    )
}

export default Toolbar