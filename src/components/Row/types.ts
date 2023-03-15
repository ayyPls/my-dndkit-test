import { IRowItem } from "../RowItem/types"

export type ITestSortableItems = {
    id: number,
    title: string,
    rowItems: IRowItem[]
}

export type IRowProps = {
    item: ITestSortableItems,
    active?: boolean,
    handleCreateElement(rowId: number, elementType: IRowItem['elementType']): void,
    updateElementsOfTheRow(rowId: number, updatedRowElements: Array<IRowItem>): void
}