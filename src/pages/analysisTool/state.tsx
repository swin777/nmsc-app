import { atom, selector } from "recoil";

export interface GridData {
    columnDefs: Array<object>;
    rowData: Array<object>;
    //editData: Array<object>|null;
}

export const leftGridData = atom<GridData|null>({
    key: 'leftGridData', 
    default: null
});

export const rightGridData = atom<GridData|null>({
    key: 'rightGridData', 
    default: null
});

export const leftJoinKey = atom<string|null>({
    key:'leftJoinKey',
    default: null
})

export const rightJoinKey = atom<string|null>({
    key:'rightJoinKey',
    default: null
})

export const joinGridData = atom<GridData|null>({
    key: 'joinGridData', 
    default: null
});

export const keySettingPopYn = atom<boolean>({
    key:'keySettingPopYn',
    default: false
});
