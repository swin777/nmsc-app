export class Topic {
    language!: string;
    regDate!: string;
    version!: number;
    title!: string;
    topicId!: number;
    contents!: string;
}

export class TopicListData {
    constructor(public topics:Topic[], public count:number, public total:number, public page:number, public rows:number){}
}

export class History{
    contents_id!: number;
    language!: string;
    fileIds!: string;
    version!: number;
    regDate!: string;
    comments!: string;
    files!: File[];
    userId:string='';
    userName:string='';
}

export class File{
    attachFileUsq!: string;
    refTbCd!: string;
    refTbUsq!: string;
    saveFileName!: string;
    contentType!: string;
    originalFileName!: string;
    filePath!: string;
    fileSize!: number;
    delFl!: string;
    regUserId!: string|null;
    regDtate!: string|null;
}

export class TopicDetail{
    topic!: Topic;
    history!: History[];
}

export class UploadTopic {
    title!: string;
    contents!: string;
    language!: string;
    comments!: string;
    file:any;
    topicId?:number;
    constructor(public categoryId:number){}
}