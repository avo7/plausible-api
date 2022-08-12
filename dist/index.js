"use strict";
/**
 *
 * plausible-api
 * Copyright 2021 Marvin Schopf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright 2021 Marvin Schopf
 * @license Apache-2.0
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const DEFAULT_API_BASE = "https://plausible.io/api/v1/stats";
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
class PlausibleClient {
    constructor(apiKey, apiBase = DEFAULT_API_BASE) {
        this.apiKey = apiKey;
        this.apiBase = apiBase;
    }
    getRealtimeVisitors(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield node_fetch_1.default(`${this.apiBase}/realtime/visitors?site_id=${siteId}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            if (response.status === 200) {
                return parseInt(yield response.text());
            }
            else {
                let responseJson;
                try {
                    responseJson = yield response.json();
                }
                catch (e) {
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
                }
                if (responseJson.error && responseJson.error.length >= 1) {
                    throw new Error(`API Error: ${responseJson.error}`);
                }
                else
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
            }
        });
    }
    getTimeseries(siteId, period, filters, interval) {
        return __awaiter(this, void 0, void 0, function* () {
            let additionalParams = "";
            if (interval && interval.length >= 1) {
                additionalParams = `${additionalParams}&interval=${interval}`;
            }
            if (filters && filters.length >= 1) {
                additionalParams = `${additionalParams}&filters=${filters}`;
            }
            const response = yield node_fetch_1.default(`${this.apiBase}/timeseries?site_id=${siteId}&period=${period}${additionalParams}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            if (response.status === 200) {
                let timeSeriesObjects = [];
                yield asyncForEach((yield response.json()).results, function (timeSeriesElement) {
                    return __awaiter(this, void 0, void 0, function* () {
                        timeSeriesObjects.push(timeSeriesElement);
                    });
                });
                return timeSeriesObjects;
            }
            else {
                let responseJson;
                try {
                    responseJson = yield response.json();
                }
                catch (e) {
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
                }
                if (responseJson.error && responseJson.error.length >= 1) {
                    throw new Error(`API Error: ${responseJson.error}`);
                }
                else
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
            }
        });
    }
    aggregate(siteId, period, metrics, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const metricsParam = metrics.join(",");
            let filtersParam = "";
            if (filters && filters.length >= 1) {
                filtersParam = `&filters=${filters}`;
            }
            const response = yield node_fetch_1.default(`${this.apiBase}/aggregate?site_id=${siteId}&period=${period}&metrics=${metricsParam}${filtersParam}`, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            if (response.status === 200) {
                let aggregateResponse = {};
                let value;
                let key;
                for ([key, value] of Object.entries((yield response.json()).results)) {
                    aggregateResponse[key] = value.value;
                }
                return aggregateResponse;
            }
            else {
                let responseJson;
                try {
                    responseJson = yield response.json();
                }
                catch (e) {
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
                }
                if (responseJson.error && responseJson.error.length >= 1) {
                    throw new Error(`API Error: ${responseJson.error}`);
                }
                else
                    throw new Error(`HTTP API Error: ${response.status} ${response.statusText}`);
            }
        });
    }
}
exports.default = PlausibleClient;
module.exports = PlausibleClient;
