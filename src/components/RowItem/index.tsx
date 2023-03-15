import { IRowItem } from "./types"
import { FC } from 'react'
import type { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export const RowItem: FC<IRowItem & { active: boolean }> = (props) => {
    const { elementType, id, active } = props
    // пропсы которые отвечают за перемещение элементов в строке
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        // setActivatorNodeRef нужен для применения listeners к другому node элементу, например иконка для перетаскивания элементов
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({ id });


    const style: CSSProperties = {
        opacity: isDragging ? 0.9 : undefined,
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: 100,
        border: '1px solid transparent',
        height: 'fit-content',
        width: 'fit-content',
        background: isDragging ? 'linear-gradient(white, white) padding-box padding-box, linear-gradient(to right, rgb(25, 118, 210), rgb(193, 130, 255)) border-box border-box' : 'white'
    };

    return <div ref={setNodeRef} {...attributes} {...listeners} className="RowElementContainer" style={{ ...style, border: '1px solid transparent', height: '100%', width: '100%', display: 'flex' }}>

        <div className="RowElementContent" >
            {
                elementType == 'button' && <div><button>{props.buttonText}</button></div>
            }
            {
                elementType == 'text' && <div><p>{props.textValue}</p></div>
            }
            {
                elementType == 'slider' && <div><p>я слайдер вжжж🤡</p></div>
            }
        </div>
    </div>
}