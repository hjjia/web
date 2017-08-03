import fetch from 'isomorphic-fetch';
import cookie from 'react-cookie';
// import { API_PREFIX } from './Network';

const maxRetries = 3;
let retry = 0;

const errorMessages = res => ({
    code: -100,
    message: `${res.status} ${res.statusText}`,
});

function checkLogin(res) {
    if (res.url.indexOf('/login') > -1) {
        const protocol = location.protocol;
        let host = location.host;
        if (host.indexOf('static.workec.com') > -1) {
            host = 'www.workec.com';
        }

        location.replace(`https://www.workec.com/login?from=${protocol}//${host}`);
    }

    return res;
}

function check404(res) {
    if (res.status === 404) {
        return Promise.reject(errorMessages(res));
    }
    return res;
}

function jsonParse(res) {
    try {
        return res.json().then(jsonResult => ({ ...res, jsonResult }));
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e, 'json parse error');
        return {};
    }
}

function errorMessageParse(url, opts, res) {
    const { ret, msg } = res.jsonResult;
    let { code } = res.jsonResult;
//   @todo token 过期
//   if (code === 50001) {
//     if (retry <= (opts.maxRetries || maxRetries)) {
//       retry += 1;
//       // window.location.reload();
//       return xFetch('/gettoken').then((res) => {
//         if (!res.errorMsg) {
//             return xFetch(url, opts);
//         }

//         return res;
//       });
//     }
//     return res;
//   }

    if (code !== 0 && code !== 200 && ret !== 200 && ret !== 0) {
        if (code === undefined && ret !== undefined) {
            code = ret;
        }

        return Promise.reject({ message: msg, code, jsonResult: res.jsonResult });
    }
    return res;
}

function xFetch(url, options) {
    const opts = {
        mode: 'cors',
        credentials: options.isOss ? '' : 'include',
        ...options,
    };

    opts.headers = {
        ...opts.headers,
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (cookie.load('XSRF-TOKEN')) {
        opts.headers = {
            ...opts.headers,
            'X-XSRF-TOKEN': cookie.load('XSRF-TOKEN'),
        };
    } else {
        const ecCsrf = cookie.load('ec_csrf_token');
        if (ecCsrf) {
            const reqMethod = opts.method;
            if (reqMethod && reqMethod.toLowerCase() === 'post') {
                if (!!window.FormData && opts.body instanceof window.FormData) {
                    opts.body.append('ec_csrf_token', ecCsrf);
                } else if (typeof opts.body === 'object') {
                    opts.body = {
                        ...opts.body,
                        ec_csrf_token: ecCsrf,
                    };
                } else if (typeof opts.body === 'string') {
                    opts.body += opts.body.indexOf('&') > -1 ? `&ec_csrf_token=${ecCsrf}` : `&ec_csrf_token=${ecCsrf}`;
                }
            }
        }
    }

    return fetch(url, opts)
    // .then(check401)
    .then(check404)
    .then(checkLogin)
    .then(jsonParse)
    .then(errorMessageParse.bind(null, url, opts))
    .catch((errorObj) => {
        const { message, jsonResult } = errorObj;
        let { code } = errorObj;

        let errorMsg = '';

        if (errorObj instanceof TypeError) {
            if (message.indexOf('Network') > -1 || message.indexOf('网络') > -1) {
                if (retry < maxRetries) {
                    retry += 1;
                    return xFetch(url, options);
                }
                code = -50000;
                errorMsg = '网络异常';
            } else if (message.indexOf('Failed to fetch') > -1) {
                if (retry < maxRetries) {
                    retry += 1;
                    return xFetch(url, options);
                }
            } else {
                errorMsg = '';
            }
        } else if (typeof message === 'object' || errorObj instanceof SyntaxError) {
            errorMsg = '系统繁忙';
        } else {
            errorMsg = message || '系统繁忙';
        }

        return { errorCode: code, errorMsg, jsonResult };
    });
}

export default xFetch;
