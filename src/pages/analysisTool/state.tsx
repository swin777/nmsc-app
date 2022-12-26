import { atom } from "recoil";

export interface GridData {
    columnDefs: Array<object>;
    rowData: Array<object>;
}

export const leftGridData = atom<GridData|null>({
    key: 'leftGridData', 
    default: null
});

export const rightGridData = atom<GridData|null>({
    key: 'rightGridData', 
    default: null
});

export const leftJoinKey = atom<string>({
    key:'leftJoinKey',
    default: ''
})

export const rightJoinKey = atom<string>({
    key:'rightJoinKey',
    default: ''
})

export const joinGridData = atom<GridData|null>({
    key: 'joinGridData', 
    default: null
});

export const keySettingPopYn = atom<boolean>({
    key:'keySettingPopYn',
    default: false
});