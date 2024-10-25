import HttpInterceptor from "../../service/http-interceptor";

const http = new HttpInterceptor();


export const addAccountTransection = (body, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/account`;

    try {
        http
            .post(endpoint, body)
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


export const addouTransection = (body, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/wallet`;

    try {
        http
            .post(endpoint, body)
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



export const getTransection = (watlet_id, search, page, type, start_date, end_date, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/wallet/${watlet_id}?search=${search}&page=${page}&type=${type}&startDate=${start_date}&endDate=${end_date}`;

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


export const getAccountTransection = (account_id, search, page, type, start_date, end_date, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/account/${account_id}?search=${search}&page=${page}&type=${type}&startDate=${start_date}&endDate=${end_date}`;

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


export const getWalletBalance = (wallet_id, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/wallet_balance/${wallet_id}`;

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

export const getAccountBalance = (account_id, callback) => {
    const endpoint = `${import.meta.env.VITE_API_HOST}transaction/account_balance/${account_id}`;

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