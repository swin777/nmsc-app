export class Category {
    state!: string;
    title!: string;
    categoryId!: number;
    rn!: string;
    tags!: string;
    contents!: string;
    constructor(public userId:string){}
}

export class CategoryListData {
    constructor(public categories:Category[], public count:number, public total:number, public page:number, public rows:number){}
}

export const categorySendMake = (category:Category):Object => {
    return {'userId':category.userId, 'title':category.title, 'contents':category.contents, 'tags':category.tags}
} 