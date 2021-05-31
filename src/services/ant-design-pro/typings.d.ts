// @ts-ignore
/* eslint-disable */

declare namespace API {
    type CurrentUser = {
        code: string;
        info: Object<{
            name:string;
            id: number;
            iat:string;
            exp:string;
        }>;
    };
    type LoginResult = {
        message :  string;
        code : string;
        token : string;
    };
    type PageParams = {
        current?: number;
        pageSize?: number;
    };
    type MuseumListItem = {
        muse_ID?: number;
        muse_Name?: string;
        muse_Intro?: string;
        muse_Location?: string;
        muse_Addres?: string;
        muse_Opentime?: string;
        muse_price?: string;
        muse_class?: string;
        muse_Ename?: string;
        muse_Img: string;
    };
    type MuseumList = {
        data?: MuseumListItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: {
            num: number;
            items: any[];
        };
    };
    type CollectionItem = {
        col_ID : number;
        muse_ID : number;
        col_Name: string;
        col_Intro: string;
        col_Photo: string;
    }
    type CollectionList = {
        data: CollectionItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type EducationItem = {
        act_ID: number;
        muse_ID: number;
        act_Name: string;
        act_Content: string;
        act_Time:string;
        act_Pic :string;
        act_Url:string;
    }
    type EducationList = {
        data: EducationItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type ExhibitionItem = {
        exhib_ID : number;
        muse_ID: number;
        exhib_Name :string;
        exhib_Content: string;
        exhib_Pic: string;
    }
    type ExhibitionList = {
        data: ExhibitionItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type NewItem = {
        news_ID: number;
        muse_ID: number;
        news_Name : string;
        news_Contet: string;
        news_type: number;
        news_time: string;
        news_source: string;
    }
    type NewsList = {
        data?: NewItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    };
    type CommentItem = {
        com_ID: number;
        user_ID: number;
        muse_ID: number;
        com_Info: string;
        com_Time: string;
        com_IfShow: boolean;
    }
    type CommentList = {
        data?: CommentItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    };
    type FeedbackItem = {
        fdback_ID : number;
        muse_ID: number;
        user_ID: number;
        env_Review: number;
        exhib_Review : number;
        service_Review: number;
    }
    type FeedbackList = {
        data?: FeedbackItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    };
    type AttentionItem = {
        att_ID: number;
        muse_ID: number;
        user_ID: number;
    }
    type AttentionList = {
        data?: AttentionItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;  
    };
    type NormalUserItem = {
        user_ID?:number;
        user_Name?:string;
        user_Phone?:string;
        user_Passwd?:string;
        user_Email?:string;
        user_Avatar?:string;
        if_com?:boolean;
    }
    type NormalUserList = {
        data?: NormalUserItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type AdminItem = {
        admin_ID?:number;
        admin_Name?:string;
        admin_Passwd?:string;
    }
    type AdminList = {
        data?: AdminItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type VideoItem = {
        video_ID:number;
        muse_ID:number;
        user_ID:number;
        video_Url:string;
        video_IfShow:boolean;
        video_Name:string;
        video_Time:string;
        video_Desciption:string;
    }
    type VideoList = {
        data?: VideoItem[];
        total?: number;
        success?: number;
        code?: string;
        info?: Object;
    }
    type UpdateFormType = "add"|"update";

    type RuleListItem = {
        key?: number;
        disabled?: boolean;
        href?: string;
        avatar?: string;
        name?: string;
        owner?: string;
        desc?: string;
        callNo?: number;
        status?: number;
        updatedAt?: string;
        createdAt?: string;
        progress?: number;
    };
    type RuleList = {
        data?: RuleListItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type FakeCaptcha = {
        code?: number;
        status?: string;
    };

    type LoginParams = {
        admin_Name?: string;
        admin_Passwd?: string;
    };

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string;
        /** 业务上的错误信息 */
        errorMessage?: string;
        /** 业务上的请求是否成功 */
        success?: boolean;
    };

    type NoticeIconList = {
        data?: NoticeIconItem[];
        /** 列表的内容总数 */
        total?: number;
        success?: boolean;
    };

    type NoticeIconItemType = 'notification' | 'message' | 'event';

    type NoticeIconItem = {
        id?: string;
        extra?: string;
        key?: string;
        read?: boolean;
        avatar?: string;
        title?: string;
        status?: string;
        datetime?: string;
        description?: string;
        type?: NoticeIconItemType;
    };
}
