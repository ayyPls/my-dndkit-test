import React, { useState } from 'react';
import './App.css';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Active, } from "@dnd-kit/core";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";
import type { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates, arrayMove, useSortable
} from "@dnd-kit/sortable";
type ITestSortableItems = {
  id: string | number,
  title: string
}

function createRange<ITestSortableItems>(
  length: number,
  initializer: (index: number) => ITestSortableItems
): ITestSortableItems[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockItems() {
  return createRange(50, (index) => ({ id: index + 1, title: `Слайд  ${index + 1}` }));
}
// 
const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4"
      },
    }
  }),
};

const SortableItem: React.FC<{ item: ITestSortableItems, active?: boolean }> = ({ item, active }) => {
  const { id } = item

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
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    padding: '10px 5px',
    height: '56px',
    background: active ? 'pink' : 'white',
    boxShadow: '0 0 7px rgba(141, 140, 186, 0.03), 0 0 6px rgba(141, 140, 186, 0.1), 0 0 4px rgba(141, 140, 186, 0.17), 0 0 2px rgba(141, 140, 186, 0.2), 0 0 0 rgba(141, 140, 186, 0.2)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '10px',
    justifyContent: 'space-between',
  };
  // listeners и attributes это пропсы, которые отвечают за функционал drag and drop
  return <div ref={setNodeRef} {...attributes} {...listeners} style={style}>{item.title}</div>

}

function App() {

  const [items, setItems] = useState(getMockItems);

  const [active, setActive] = useState<Active | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // press delay 
      activationConstraint: {
        delay: 1000,
        tolerance: 100,
      },
      onActivation: event => console.log(event.event)
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    }),
  );

  const activeItem = React.useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

  return (
    <div style={{ maxWidth: 400, margin: "30px auto" }}>
      <DndContext
        // перемещение только по оси y
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        onDragStart={({ active }) => {
          console.log('ondragstart ==>', active)
          setActive(active);
        }}
        onDragEnd={({ active, over }) => {
          console.log('ondragover==>', active, over)
          if (over && active.id !== over?.id) {
            const activeIndex = items.findIndex(({ id }) => id === active.id);
            const overIndex = items.findIndex(({ id }) => id === over.id);
            setItems(arrayMove(items, activeIndex, overIndex));
          }
          setActive(null);
        }}
        onDragCancel={() => {
          setActive(null);
        }}

      >
        <SortableContext
          items={items}
        >
          {items.map(item =>
            <SortableItem key={item.id} item={item} active={activeItem?.id === item.id} />
          )}
        </SortableContext>
        {/*  компонент который отображается при перетаскивании */}
        <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[restrictToWindowEdges]}>
          {activeItem ? <SortableItem item={activeItem} active /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
