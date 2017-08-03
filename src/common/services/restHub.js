import cookie from 'react-cookie';
import xFetch from './xFetch';

const postDefaultOpts = {
    headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': cookie.load('XSRF-TOKEN')
    },
    method: 'POST',
};

const postOssDefaultOpts = {
    method: 'POST',
};

const postFormDefaultOpts = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
};

const putDefaultOpts = {
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'PUT',
};

const removeDefaultOpts = {
    method: 'DELETE',
};

const getSerializedObject = (object) => {
    let serializedString = '';
    Object.keys(object).forEach((key) => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
};

const getFormData = (object) => {
    const data = new FormData();
    Object.keys(object).forEach(key => data.append([key], object[key]));
    return data;
};

const restHub = {
    get(url, opts = { params: {} }) {
        /* eslint-disable no-param-reassign */
        if (opts.params && Object.keys(opts.params).length > 0) {
            if (url.indexOf('?') > -1) {
                url += getSerializedObject(opts.params);
            } else {
                url += `?${getSerializedObject(opts.params)}`;
            }
        }
        delete opts.params;
        /* eslint-enable no-param-reassign */
        return xFetch(url, opts);
    },

    post(url, opts = { body: {} }) {
        const options = {
            ...postDefaultOpts,
            ...opts,
            body: JSON.stringify(opts.body),
        };
        return xFetch(url, options);
    },

    postForm(url, opts = { body: {} }) {
        const options = {
            ...postFormDefaultOpts,
            ...opts,
            body: getSerializedObject(opts.body),
        };
        return xFetch(url, options);
    },

    uploadFile(url, opts = { body: {} }) {
        const options = {
            ...postOssDefaultOpts,
            ...opts,
            isOss: true,
            body: getFormData(opts.body),
        };
        return xFetch(url, options);
    },

    uploadImage(url, opts = { body: {} }) {
        const options = {
            ...postOssDefaultOpts,
            ...opts,
            isOss: opts.isOss,
            body: getFormData(opts.body),
        };
        return xFetch(url, options);
    },

    put(url, opts = { body: {} }) {
        const options = {
            ...putDefaultOpts,
            ...opts,
            body: JSON.stringify(opts.body),
        };
        return xFetch(url, options);
    },

    remove(url, opts) {
        const options = { ...removeDefaultOpts, opts };
        return xFetch(url, options);
    },
};

export default restHub;
