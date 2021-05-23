import { extend } from 'umi-request';

const RealRequest = extend({
    prefix: 'http://192.144.230.213:8080'
});
RealRequest.interceptors.request.use(
    (url, options) => {
        if(options.method === "get" && !url.includes("login")){
            const query = options.params;
            query.pageIndex = query.current;
            delete query.current;
        }
        return {
            url,
            options: { ...options, interceptors: true },
        };
    },
    { global: false }
);


RealRequest.interceptors.response.use(
    async (response) => {
        const result = await response.clone().json();
        if(result.code === "success"){
            result.data = result.info.items;
            result.success = 1;
            result.total = result.info.num;
        }
        return result;
    },
    { global: false },
);
export default RealRequest;
