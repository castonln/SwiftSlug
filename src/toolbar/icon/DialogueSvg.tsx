interface DialogueSvgProps {
    fill: string,
    height: number,
    width: number
}

const DialogueSvg = ({ width, height, fill }: DialogueSvgProps) => {
    return (
        <svg fill={fill} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
            width={width} height={height} viewBox="0 0 569.16 569.16">
            <g>
                <g>
                    <polygon points="42.821,514.354 115.181,436.547 410.039,436.547 410.039,355.175 142.837,355.175 127.538,355.175 
			127.538,339.875 127.538,162.362 0,162.362 0,436.547 42.821,436.547 		"/>
                    <polygon points="569.16,54.806 142.837,54.806 142.837,162.362 142.837,339.875 410.039,339.875 449.404,339.875 524.641,420.776 
			524.641,339.875 569.16,339.875 		"/>
                </g>
            </g>
        </svg>
    );
}

export default DialogueSvg;