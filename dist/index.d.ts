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
export default class PlausibleClient {
    apiKey: string;
    apiBase: string;
    constructor(apiKey: string, apiBase?: string);
    getRealtimeVisitors(siteId: string): Promise<number>;
    getTimeseries(siteId: string, period: "12mo" | "6mo" | "30d" | "7d" | "month" | "day", filters?: string, interval?: "date" | "month"): Promise<{
        date: Date;
        value: number;
    }[]>;
    aggregate(siteId: string, period: "12mo" | "6mo" | "30d" | "7d" | "month" | "day", metrics: Array<"visitors" | "pageviews" | "bounce_rate" | "visit_duration">, filters?: string): Promise<{
        bounce_rate?: number;
        pageviews?: number;
        visit_duration?: number;
        visitors?: number;
    }>;
}
