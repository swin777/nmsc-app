import { atom } from "recoil";

export enum MODE {CATEGORY_LIST, CATEGORY_REG, TOPIC_LIST, TOPIC_DETAIL, TOPIC_REG}

export const mode = atom<MODE>({
    key: 'mode', 
    default: MODE.CATEGORY_LIST
});

// export const orderByMonth = selectorFamily<OrderByDay|null, any>({
//     key: 'orderByMonth',
//     get: (params:any) => async ({get}) => {
//         get(monthDataRefresh)
//         if(get(menuState) !== MENU.SITUATION){
//             return null;
//         }
//         try{
//             let param:any = {
//                 yearMonth: `${get(calDate).getFullYear()}-${fillZeroDay(get(calDate).getMonth()+1)}`,
//                 deliveryStatus: params.deliveryStatus===null ? 'all' : convertCode(DELIVERY_STATUS, params.deliveryStatus),
//                 limit: params.limit,
//                 page:params.page,
//             }
//             let res:any = await serverCall(`/v1/orders${makeParameter(param)}`, 'GET', null)
//             if(res.data){
//                 return new OrderByDay(res.data.totalElements, res.data.orders.map((e:any) => {
//                     e.loadingManagrRepresentative = false;
//                     e.unloadingManagerRepresentative = false;
//                     e.interestFreightYn = false;
//                     return plainToInstance(Delivery, e);
//                 }))
//             }else{
//                 return null;
//             }
//         }catch(e){
//             return null;
//         }
//     },
//     cachePolicy_UNSTABLE: {
//         eviction: 'most-recent',
//     },
// });