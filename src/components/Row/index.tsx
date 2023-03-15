import type { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { ITestSortableItems } from "./types";
import { RowItem } from "../RowItem";
import { IRowItem } from "../RowItem/types";
import { Active, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToHorizontalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { useState, useMemo, useEffect } from 'react'

export const DraggableRow: React.FC<{ item: ITestSortableItems, active?: boolean, handleCreateElement(rowId: number, elementType: IRowItem['elementType']): void, updateElementsOfTheRow(rowId: number, updatedRowElements: Array<IRowItem>): void }> = ({ item, active, handleCreateElement, updateElementsOfTheRow }) => {
    const { id } = item
    const [rowItemElements, setRowItemElements] = useState<Array<IRowItem>>([]);
    const [activeRowElement, setActiveRowItemElement] = useState<Active | null>(null);
    const activeRowElem = useMemo(
        () => rowItemElements.find((item) => item.id === activeRowElement?.id),
        [activeRowElement, rowItemElements]
    );

    useEffect(() => {
        setRowItemElements(item.rowItems)
    }, [item.rowItems])

    // пропсы которые отвечают за перемещение строк
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

    // сенсоры для элементов строки
    const rowElementSensors = useSensors(
        useSensor(PointerSensor, {
            // press delay 
            // activationConstraint: {
            //     delay: 1000,
            //     tolerance: 100,
            // },

            onActivation: event => console.log(`ACTIVE ROW ELEM SENSOR ${event.event}`),
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
    );
    // стили для строки при drag n drop
    const style: CSSProperties = {
        opacity: isDragging ? 0.9 : undefined,
        transform: CSS.Translate.toString(transform),
        transition,
        padding: '10px 5px',
        height: '56px',
        boxShadow: '0 0 7px rgba(141, 140, 186, 0.03), 0 0 6px rgba(141, 140, 186, 0.1), 0 0 4px rgba(141, 140, 186, 0.17), 0 0 2px rgba(141, 140, 186, 0.2), 0 0 0 rgba(141, 140, 186, 0.2)',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '10px',
        justifyContent: 'space-between',
        zIndex: 100,
        border: '1px solid transparent',
        background: isDragging ? 'linear-gradient(white, white) padding-box padding-box, linear-gradient(to right, rgb(25, 118, 210), rgb(193, 130, 255)) border-box border-box' : 'white'
    };

    // listeners и attributes это пропсы, которые отвечают за функционал drag and drop
    return <>
        <div ref={setNodeRef} {...attributes} {...listeners} style={style} >
            {item.title}
            <DndContext
                // перемещение только по оси x
                modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
                sensors={rowElementSensors}
                onDragStart={({ active }) => {
                    console.log('ONDRAGSTART ==>', active)
                    setActiveRowItemElement(active);
                }}
                onDragEnd={({ active, over }) => {
                    console.log('ONDRAGOVER==>', active.id, over?.id)
                    if (over && active.id !== over?.id) {
                        const activeIndex = rowItemElements.findIndex(({ id }) => id === active.id);
                        const overIndex = rowItemElements.findIndex(({ id }) => id === over.id);
                        // функция для обновления элементов строки
                        updateElementsOfTheRow(item.id, arrayMove(rowItemElements, activeIndex, overIndex))
                    }
                    setActiveRowItemElement(null);
                }}
                onDragCancel={() => {
                    setActiveRowItemElement(null);
                }}
            >
                <SortableContext
                    strategy={horizontalListSortingStrategy}
                    items={item.rowItems}
                >
                    {item.rowItems.map(
                        (rowItem, index) => <RowItem key={index} active={activeRowElem?.id == rowItem.id} {...rowItem} />
                    )}
                </SortableContext>
            </DndContext>
            {
                item.rowItems.length < 3 && !item.rowItems.some(i => i.elementType == 'slider') &&
                <div style={{ position: 'sticky', }}>
                    <button onClick={() => handleCreateElement(item.id, 'button')}>add button</button>
                    <button onClick={() => handleCreateElement(item.id, 'text')}>add text</button>
                    {!item.rowItems.length && <button onClick={() => handleCreateElement(item.id, 'slider')}>add slider</button>}
                </div>
            }
        </div >

    </>
}
