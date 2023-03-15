import { useState, useMemo } from 'react'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { Active } from "@dnd-kit/core";
import {
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
    SortableContext, sortableKeyboardCoordinates, arrayMove, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { createRowElement, getMockItems } from '../../helpers/items';
import { DraggableRow } from '../Row';
import { IRowItem } from '../RowItem/types';

export const ConstructorField = () => {
    const [rowItems, setRowItems] = useState(getMockItems);
    const [activeRowItem, setActiveRowItem] = useState<Active | null>(null);

    const rowSensors = useSensors(
        useSensor(PointerSensor, {
            // row press delay 
            activationConstraint: {
                delay: 500,
                tolerance: 100,
            },
            onActivation: event => console.log(event.event)
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
    );

    const activeRow = useMemo(
        () => rowItems.find((item) => item.id === activeRowItem?.id),
        [activeRowItem, rowItems]
    );

    const handleCreateElement = (id: number, elementType: IRowItem['elementType']) => {
        setRowItems(items => items.map(i => i.id == id ? { ...i, rowItems: [...i.rowItems, createRowElement(i.rowItems.length + 1, elementType)] } : i))
    }

    const handleCreateNewRow = () => {
        setRowItems(items => [...items, { id: items.length, rowItems: [], title: `Новая строка с индексом ${items.length}` }])
    }

    const updateElementsOfTheRow = (rowId: number, updatedRowElements: Array<IRowItem>) => {
        setRowItems(items => items.map(i => i.id == rowId ? { ...i, rowItems: updatedRowElements } : i))
    }

    console.log(rowItems[0])

    return <DndContext
        // перемещение только по оси y
        modifiers={[restrictToVerticalAxis]}
        sensors={rowSensors}
        onDragStart={({ active }) => {
            console.log('ondragstart ==>', active)
            setActiveRowItem(active);
        }}
        onDragEnd={({ active, over }) => {
            console.log('ondragover==>', active, over)
            if (over && active.id !== over?.id) {
                const activeIndex = rowItems.findIndex(({ id }) => id === active.id);
                const overIndex = rowItems.findIndex(({ id }) => id === over.id);
                setRowItems(arrayMove(rowItems, activeIndex, overIndex));
            }
            setActiveRowItem(null);
        }}
        onDragCancel={() => {
            setActiveRowItem(null);
        }}
    >
        <div className='rows_wrapper' style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '10vh 0' }}>
            <SortableContext
                strategy={verticalListSortingStrategy}
                items={rowItems}
            >
                {rowItems.map(item =>
                    <DraggableRow key={item.id} item={item} active={activeRow?.id === item.id} handleCreateElement={handleCreateElement} updateElementsOfTheRow={updateElementsOfTheRow} />
                )}
            </SortableContext>
        </div>
    </DndContext>
}