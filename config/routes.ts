export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user',
                routes: [
                    {
                        name: 'login',
                        path: '/user/login',
                        component: './user/Login',
                    },
                ],
            },
        ],
    },
    {
        path: '/museum',
        name: '博物馆',
        icon: 'smile',
        routes: [
            {
                path: '/museum/info',
                name: '详细信息',
                icon: 'smile',
                component: './Museum/MuseumInfo',
            },
            {
                path: '/museum/news',
                name: '新闻',
                icon: 'smile',
                component: './Museum/MuseumNews',
            },
            {
                path: '/museum/collection',
                name: '藏品',
                icon: 'smile',
                component: './Museum/Collection',
            },
            {
                path: '/museum/comment',
                name: '评论',
                icon: 'smile',
                component: './Museum/Comment',
            },
            {
                path: '/museum/education',
                name: '教育',
                icon: 'smile',
                component: './Museum/Education',
            },
            {
                path: '/museum/exhibition',
                name: '展览',
                icon: 'smile',
                component: './Museum/Exhibition',
            },
        ],
    },
    {
        name: '关注',
        icon: 'table',
        path: '/attention',
        component: './Attention',
    },
    {
        name: '反馈',
        icon: 'table',
        path: '/feedback',
        component: './Feedback',
    },
    {
        name: '讲解视频',
        icon: 'table',
        path: '/videos',
        component: './Videos',
    },
    {
        name: '用户',
        icon: 'table',
        path: '/users',
        routes: [
            {
                path: '/users/normal',
                name: '普通用户',
                icon: 'smile',
                component: './Users/NormalUser',
            },
            {
                path: '/users/admin',
                name: '管理员',
                icon: 'smile',
                component: './Users/AdminUser',
            }
        ]
    },
    {
        path: '/',
        redirect: './museum/info',
    },
    {
        component: './404',
    },
];
