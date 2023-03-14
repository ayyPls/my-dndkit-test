import { IRowItem } from '../../components/RowItem/types';

type ITestSortableItems = {
    id: number,
    title: string,
    rowItems: IRowItem[]
}

function createRange<ITestSortableItems>(
    length: number,
    initializer: (index: number) => ITestSortableItems
): ITestSortableItems[] {
    return [...new Array(length)].map((_, index) => initializer(index));
}

export function getMockItems(): Array<ITestSortableItems> {
    return createRange(50, (index) => ({ id: index + 1, title: `Строка  ${index + 1}`, rowItems: [] }));
}

export function createRowElement(id: number, elementType: IRowItem['elementType']): IRowItem {
    switch (elementType) {
        case 'button': return { elementType, buttonText: 'default button text', id}
        case 'text': return { elementType, textValue: 'default text', id }
        case 'slider': return { elementType, id }
    }
}