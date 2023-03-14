
export type IRowItem =
    { id: number, elementType: 'button', buttonText: string }
    | { id: number, elementType: 'text', textValue: string }
    | { id: number, elementType: 'slider' }
