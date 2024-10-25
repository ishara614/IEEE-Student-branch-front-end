import HttpInterceptor from "../../service/http-interceptor";

const http = new HttpInterceptor();

export const getMainWallet = (callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}wallet/main`;

    try {
        http
            .get(endpoint)
            .then((response) => {
                callback(response);
            })
            .catch((error) => {
                callback(error.response);
            });
    } catch (error) {
        callback(error.response);
    }
};


export const getAllOuWallet = (callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}wallet/ou/all`;

    try {
        http
            .get(endpoint)
            .then((response) => {
                callback(response);
            })
            .catch((error) => {
                callback(error.response);
            });
    } catch (error) {
        callback(error.response);
    }
};


export const getMyExomWallet = (callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}wallet`;

    try {
        http
            .get(endpoint)
            .then((response) => {
                callback(response);
            })
            .catch((error) => {
                callback(error.response);
            });
    } catch (error) {
        callback(error.response);
    }
};


export const getWalletByProject = (project_id,callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}wallet/project/${project_id}`;

    try {
        http
            .get(endpoint)
            .then((response) => {
                callback(response);
            })
            .catch((error) => {
                callback(error.response);
            });
    } catch (error) {
        callback(error.response);
    }
};



export const getProjectWalletList = (ou_id,callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}wallet/ou/project/${ou_id}`;

    try {
        http
            .get(endpoint)
            .then((response) => {
                callback(response);
            })
            .catch((error) => {
                callback(error.response);
            });
    } catch (error) {
        callback(error.response);
    }
};
