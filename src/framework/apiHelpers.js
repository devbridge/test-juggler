const axios = require("axios").default;

export default class ApiHelpers {
    constructor(instanceConfig) {
        const https = require("https");
        instanceConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false });
        this.instance = axios.create(instanceConfig);
    }

    async request(config) {
        var response;
        try {
            response = await this.instance(config);
        } catch (error) {
            if (error.response === undefined) {
                throw (error);
            } else {
                response = error.response;
            }
        }
        const requestInfo = {
            method: response.config.method,
            URL: response.config.baseURL + response.config.url,
            headers: response.config.headers,
            data: response.config.data
        };
        const responseInfo = {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        };
        console.log(`Sent request:\n${JSON.stringify(requestInfo, null, 2)}`);
        console.log(`Got response:\n${JSON.stringify(responseInfo, null, 2)}`);
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

    async put(url, data) {
        return await this.request({
            method: "put",
            url: url,
            data: data
        });
    }

    async patch(url, data) {
        return await this.request({
            method: "patch",
            url: url,
            data: data
        });
    }

    async delete(url, data) {
        return await this.request({
            method: "delete",
            url: url,
            data: data
        });
    }

    parseXml(xmlString) {
        const parseString = require("xml2js").parseString;
        var jsonData;
        parseString(xmlString, function (err, result) {
            jsonData = result;
        });
        return jsonData;
    }
}