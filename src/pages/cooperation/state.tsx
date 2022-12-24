import { plainToInstance } from "class-transformer";
import { atom, selector, selectorFamily } from "recoil";
import { Category, CategoryListData } from "../../models/category";
import { Topic, TopicDetail, TopicListData } from "../../models/topic";
import { serverCall } from "../../utils/apiCallUtil";

export enum MODE {CATEGORY_LIST, CATEGORY_REG, TOPIC_LIST, TOPIC_DETAIL, TOPIC_REG}

export const mode = atom<MODE>({
    key: 'mode', 
    default: MODE.CATEGORY_LIST
});

export const categoryRefresh = atom<number>({
    key: 'categoryRefresh', 
    default: 0
});

export const selectCatory = atom<Category|null>({
    key: 'selectCatory', 
    default: null
});

export const topicRefresh = atom<number>({
    key: 'topicRefresh', 
    default: 0
});

export const selectTopic = atom<Topic|null>({
    key: 'selectTopic', 
    default: null
});

export const topicDetailRefresh = atom<number>({
    key: 'topicDetailRefresh', 
    default: 0
});

export const selectAttachFileUsq = atom<string|null>({
    key: 'selectAttachFileUsq', 
    default: null
});

export const categorySearchType = atom<string|null>({
    key: 'categorySearchType', 
    default: null
});

export const categorySearchKeyWord = atom<string|null>({
    key: 'categorySearchKeyWord', 
    default: ''
});

export const topicSearchType = atom<string|null>({
    key: 'topicSearchType', 
    default: null
});

export const topicSearchKeyWord = atom<string|null>({
    key: 'topicSearchKeyWord', 
    default: ''
});

export const listCategories = selectorFamily<CategoryListData|null, any>({
    key: 'listCategories',
    get: (params:any) => async ({get}) => {
        get(categoryRefresh);
        try{
            let param = categorySearchType ? `?${get(categorySearchType)}=${get(categorySearchKeyWord)}` : ''
            let res:any = await serverCall(`/homepage/html/base/collaboration/listCategories.do${param}`, 'GET', null)
            if(res.data && res.data.data){
                let data = res.data
                let category:Category[]= data.data.map((ele: any) => plainToInstance(Category, ele))
                return new CategoryListData(category, data.count, data.total, data.page, data.rows)
            }else{
                return null;
            }
        }catch(e){
            return null;
        }
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent',
    },
});

export const listTopics = selectorFamily<TopicListData|null, any>({
    key: 'listTopics',
    get: (params:any) => async ({get}) => {
        get(topicRefresh);
        if(get(selectCatory)===null){
            return null;
        }
        try{
            let param = topicSearchType ? `&${get(topicSearchType)}=${get(topicSearchKeyWord)}` : ''
            let res:any = await serverCall(`/homepage/html/base/collaboration/listTopics.do?categoryId=${get(selectCatory)?.categoryId}${param}`, 'GET', null)
            if(res.data && res.data.data){
                let data = res.data
                let topic:Topic[]= data.data.map((ele: any) => plainToInstance(Topic, ele))
                return new TopicListData(topic, data.count, data.total, data.page, data.rows)
            }else{
                return null;
            }
        }catch(e){
            return null;
        }
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent',
    },
});

export const detailTopic = selectorFamily<TopicDetail|null, any>({
    key: 'detailTopic',
    get: (params:any) => async ({get}) => {
        get(topicDetailRefresh);
        if(get(selectCatory)===null){
            return null;
        }
        try{
            let res:any = await serverCall(`/homepage/html/base/collaboration/selectTopic.do?categoryId=${get(selectCatory)?.categoryId}&topicId=${get(selectTopic)?.topicId}`, 'GET', null)
            if(res.data && res.data.data){
                return plainToInstance(TopicDetail, res.data.data)
            }else{
                return null;
            }
        }catch(e){
            return null;
        }
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent',
    },
});

export const readFile = selector<string|null>({
    key: 'readFile',
    get: async ({get}) => {
        let res:any = await serverCall(`/homepage/html/base/collaboration/readFile.do?fileId=${get(selectAttachFileUsq)}`, 'GET', null)
        if(res.data){
            return res.data.data
        }else{
            return null;
        }
    },
    cachePolicy_UNSTABLE: {
        eviction: 'most-recent',
    },
});