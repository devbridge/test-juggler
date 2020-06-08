const axios = require("axios").default;

export default class ApiHelpers {
    constructor(instanceConfig) {
        this.instance = axios.create(instanceConfig);
    }

    async request(config) {
        var response;
        try {
            response = await this.instance(config);
        } catch (error) {
            response = error.response;
        }
        return response;
    }

    async get(url) {
        return await this.request({
            method: "get",
            url: url
        });
    }

    async post(url, data) {
        return await this.request({
            method: "post",
            url: url,
            data: data
        });
    }
}