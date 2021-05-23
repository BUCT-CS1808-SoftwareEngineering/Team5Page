// @ts-ignore
/* eslint-disable */
// import { result } from 'lodash';
import { request } from 'umi';
import RealRequest from '../interceptors'


/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
    return RealRequest<API.CurrentUser>('/api/backlogin/info', {
        method: 'GET',
        ...({
            ...options, headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('currentToken'),
            }
        } || {}),
    });
}

/** 退出登录*/
export async function outLogin(options?: { [key: string]: any }) {
    sessionStorage.removeItem("currentToken");
    return ;
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
    return RealRequest<API.LoginResult>('/api/backlogin', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}

/**  GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
    return request<API.NoticeIconList>('/api/notices', {
        method: 'GET',
        ...(options || {}),
    });
}
/** 获取 博物馆列表 */
export async function getMuseum(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.MuseumList>(`/api/museum/info`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新建博物馆 */
export async function addMuseum(options?: { [key: string]: any }) {
    return RealRequest<API.MuseumListItem>(
        '/api/museum/info',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除博物馆 */
export async function deleteMuseum(options?: { [key: string]: any }) {
    return RealRequest('/api/museum/info', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}

/** 获取新闻列表 */
export async function getNews(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.NewsList>(`/api/museum/news`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新建新闻 */
export async function addNews(options?: { [key: string]: any }) {
    return RealRequest<API.NewItem>(
        '/api/museum/news',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除新闻 */
export async function deleteNews(options?: { [key: string]: any }) {
    return RealRequest('/api/museum/news', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取评论列表 */
export async function getComment(
    params: {
        com_IfShow: boolean;
        current: number;
        pageSize: number;
        pageIndex: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.CommentList>(`/api/comment`, {
        method: 'GET',
        params: {
            ...params,
            com_IfShow:false,
        },
        ...(options || {}),
    });
}
/**新建评论 */
export async function addComment(options?: { [key: string]: any }) {
    return RealRequest<API.CommentItem>(
        '/api/comment',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除评论 */
export async function deleteComment(options?: { [key: string]: any }) {
    return RealRequest('/api/comment', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/**修改评论 */
export async function updateComment(options?: { [key: string]: any }) {
    return RealRequest<API.CommentItem>('/api/comment', {
        method: 'PUT',
        data: {
            ...(options || {}),
        }
    });
}
/** 获取藏品列表 */
export async function getCollection(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.CollectionItem>(`/api/collection`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新建藏品 */
export async function addCollection(options?: { [key: string]: any }) {
    return RealRequest<API.CollectionItem>(
        '/api/collection',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除藏品 */
export async function deleteCollection(options?: { [key: string]: any }) {
    return RealRequest('/api/collection', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取教育活动列表 */
export async function getEducation(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.EducationItem>(`/api/education`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新建教育活动 */
export async function addEducation(options?: { [key: string]: any }) {
    return RealRequest<API.EducationItem>(
        '/api/education',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除教育活动 */
export async function deleteEducation(options?: { [key: string]: any }) {
    return RealRequest('/api/education', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取展览活动列表 */
export async function getExhibition(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.ExhibitionItem>(`/api/exhibition`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新建展览活动 */
export async function addExhibition(options?: { [key: string]: any }) {
    return RealRequest<API.ExhibitionItem>(
        '/api/exhibition',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除展览活动 */
export async function deleteExhibition(options?: { [key: string]: any }) {
    return RealRequest('/api/exhibition', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取关注列表 */
export async function getAttention(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.AttentionItem>(`/api/attention`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新增关注 */
export async function addAttention(options?: { [key: string]: any }) {
    return RealRequest<API.AttentionItem>(
        '/api/attention',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除关注 */
export async function deleteAttention(options?: { [key: string]: any }) {
    return RealRequest('/api/attention', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}

/** 获取反馈列表 */
export async function getFeedback(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.FeedbackItem>(`/api/feedback`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新增反馈 */
export async function addFeedback(options?: { [key: string]: any }) {
    return RealRequest<API.FeedbackItem>(
        '/api/feedback',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**修改反馈 */
export async function updateFeedback(options?: { [key: string]: any }) {
    return RealRequest<API.FeedbackItem>('/api/feedback', {
        method: 'PUT',
        data: {
            ...(options || {}),
        }
    });
}
/**删除反馈 */
export async function deleteFeedback(options?: { [key: string]: any }) {
    return RealRequest('/api/feedback', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取用户列表 */
export async function getNormalUser(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.NormalUserItem>(`/api/user`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新增用户 */
export async function addNormalUser(options?: { [key: string]: any }) {
    return RealRequest<API.NormalUserItem>(
        '/api/user',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**修改用户 */
export async function updateNormalUser(options?: { [key: string]: any }) {
    return RealRequest<API.NormalUserItem>('/api/user', {
        method: 'PUT',
        data: {
            ...(options || {}),
        }
    });
}
export async function postUserAvatar(options?: { [key: string]: any }){
    return RealRequest('/api/user/Avatar',{
        method: 'POST',
        ...(options || {}),
    })
}
/**删除用户 */
export async function deleteNormalUser(options?: { [key: string]: any }) {
    return RealRequest('/api/user', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取管理员列表 */
export async function getAdmin(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.AdminItem>(`/api/admin`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新增管理员 */
export async function addAdmin(options?: { [key: string]: any }) {
    return RealRequest<API.AdminItem>(
        '/api/admin',
        {
            method: 'POST',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**修改管理员 */
export async function updateAdmin(options?: { [key: string]: any }) {
    return RealRequest<API.AdminItem>(
        '/api/admin',
        {
            method: 'PUT',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除管理员 */
export async function deleteAdmin(options?: { [key: string]: any }) {
    return RealRequest('/api/admin', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
/** 获取视频列表 */
export async function getVideos(
    params: {
        current?: number;
        pageSize?: number;
        pageIndex?: number;
    },
    options?: { [key: string]: any },
) {
    return RealRequest<API.AdminItem>(`/api/video`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/**新增视频 */
export async function addVideo(options?: { [key: string]: any }) {
    return RealRequest<API.AdminItem>(
        '/api/video',
        {
            method: 'POST',
            headers: {
                "content-type":"multipart/form-data; boundary=<calculated when request is sent>",
            },
            data: {
                ...(options || {}),
            }
        }
    )
}
/**审核视频 */
export async function updateVideo(options?: { [key: string]: any }) {
    return RealRequest<API.AdminItem>(
        '/api/video',
        {
            method: 'PUT',
            data: {
                ...(options || {}),
            }
        }
    )
}
/**删除视频 */
export async function deleteVideo(options?: { [key: string]: any }) {
    return RealRequest('/api/video', {
        method: 'DELETE',
        data: {
            ...options,
        }
    })
}
// export async function backUp(options?: { [key: string]: any }){
//     return RealRequest('/BAckup',{

//     })
// }























/** 获取规则列表 GET /api/rule */
export async function rule(
    params: {
        // query
        /** 当前的页码 */
        current?: number;
        /** 页面的容量 */
        pageSize?: number;
    },
    options?: { [key: string]: any },
) {
    return request<API.RuleList>('/api/rule', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
    return request<API.RuleListItem>('/api/rule', {
        method: 'PUT',
        ...(options || {}),
    });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
    return request<API.RuleListItem>('/api/rule', {
        method: 'POST',
        ...(options || {}),
    });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/rule', {
        method: 'DELETE',
        ...(options || {}),
    });
}
