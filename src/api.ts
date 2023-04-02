import { isEmpty, skipEmpty } from './utils'

export enum Condition {
    DRY = 'dry',
    FOG = 'fog',
    RAIN = 'rain',
    SLEET = 'sleet',
    SNOW = 'snow',
    HAIL = 'hail',
    THUNDERSTORM = 'thunderstorm',
}

// Use a minimal fetch type def rather then requiring a dependency on DOM types.
export type RequestInit = {
    body?: string | any
    headers?: { [key: string]: any } | string[][]
    method?: string
    mode?: string | any
    cache?: string | any
    referrer?: string
    redirect?: string | any
    [key: string]: any
}
export type Response = {
    json(): Promise<any>
    text(): Promise<string>
    status: number
    statusText: string
    ok: boolean
    [key: string]: any
}
export type FetchType = (url: string, init?: RequestInit) => Promise<Response>
declare const fetch: FetchType

export enum Icon {
    CLEAR_DAY = 'clear-day',
    CLEAR_NIGHT = 'clear-night',
    PARTLY_CLOUDY_DAY = 'partly-cloudy-day',
    PARTLY_CLOUDY_NIGHT = 'partly-cloudy-night',
    CLOUDY = 'cloudy',
    FOG = 'fog',
    WIND = 'wind',
    RAIN = 'rain',
    SLEET = 'sleet',
    SNOW = 'snow',
    HAIL = 'hail',
    THUNDERSTORM = 'thunderstorm',
}

export type CurrentWeather = DefaultWeather & {
    precipitation_10?: number
    precipitation_30?: number
    precipitation_60?: number
    sunshine_10?: number
    sunshine_30?: number
    sunshine_60?: number
    wind_direction_10?: number
    wind_direction_30?: number
    wind_direction_60?: number
    wind_speed_10?: number
    wind_speed_30?: number
    wind_speed_60?: number
    wind_gust_direction_10?: number
    wind_gust_direction_30?: number
    wind_gust_direction_60?: number
    wind_gust_speed_10?: number
    wind_gust_speed_30?: number
    wind_gust_speed_60?: number
}

export interface DefaultWeather {
    timestamp: string
    source_id: number
    cloud_cover?: number
    condition?: Condition
    dew_point?: number
    icon?: Icon
    pressure_msl?: number
    relative_humidity?: number
    temperature?: number
    visibility?: number
    fallback_source_ids?: Record<string, number>
}

export type Weather = DefaultWeather & {
    precipitation?: number
    sunshine?: number
    wind_direction?: number
    wind_speed?: number
    wind_gust_direction?: number
    wind_gust_speed?: number
}

export interface Source {
    id: number
    dwd_station_id?: string
    wmo_station_id?: string
    station_name?: string
    observation_type?: SourceType
    first_record: string
    last_record: string
    lat: number
    lon: number
    height: number
    distance: number
}

export enum SourceType {
    FORECAST = 'forecast',
    SYNOP = 'synop',
    CURRENT = 'current',
    HISTORICAL = 'historical',
}

export enum Units {
    DWD = 'dwd',
    SI = 'si',
}

export type CurrentWeatherParams = DefaultParams & {
    lat?: string
    lon?: string
    max_dist?: number
}

export type WeatherParams = DefaultParams & {
    date: string
    lat?: string
    lon?: string
    max_dist?: number
}

export interface SourcesParams {
    lat?: string
    lon?: string
    dwd_station_id?: string[]
    wmo_station_id?: string[]
    source_id?: number[]
    max_dist?: number
}

export type SynopParams = DefaultParams & {
    date: string
    dwd_station_id?: string[]
    wmo_station_id?: string[]
    source_id?: number[]
}

export interface DefaultParams {
    last_date?: string
    dwd_station_id?: string[]
    wmo_station_id?: string[]
    source_id?: number[]
    tz?: string
    units?: Units
}

export interface CurrentWeatherResponse {
    weather: Array<CurrentWeather>
    sources: Array<Source>
}

export interface WeatherResponse {
    weather: Array<Weather>
    sources: Array<Source>
}

export interface SourcesResponse {
    sources: Array<Source>
}

export type SynopResponse = CurrentWeatherResponse

export function BrightSkyAPI(opts: { baseUrl?: string, fetch?: FetchType } = {}) {
    let baseUrl = 'https://api.brightsky.dev/'
    let fetchFn: FetchType

    if (opts.baseUrl) {
        baseUrl = opts.baseUrl
    }

    if (opts && opts.fetch) {
        fetchFn = opts.fetch
    } else if (typeof fetch !== 'undefined') {
        fetchFn = fetch
    } else {
        throw new Error('The `fetch` API is not available. It must be specified.')
    }

    const defaultFetchOpts: RequestInit = {
        method: 'GET',
        headers: { Accept: 'application/json; charset=UTF-8' },
    }

    /**
     * Get current weather
     * @param opts {CurrentWeatherParams}
     * @returns {Promise<CurrentWeatherResponse>}
     */
    function currentWeather(opts: CurrentWeatherParams): Promise<CurrentWeatherResponse> {
        const urlSearchParams = new URLSearchParams(skipEmpty({ ...opts }))

        return fetchFn(baseUrl + '/current_weather?' + urlSearchParams.toString(), defaultFetchOpts).then(
            (r) => r.json() as Promise<CurrentWeatherResponse>
        )
    }

    /**
     * Get observed and/or forecasted weather
     * @param opts {WeatherParams}
     * @returns {Promise<WeatherResponse>}
     */
    function weather(opts: WeatherParams): Promise<WeatherResponse> {
        if (
            !(opts.lat && opts.lon) &&
            isEmpty(opts.dwd_station_id) &&
            isEmpty(opts.wmo_station_id) &&
            isEmpty(opts.source_id)
        ) {
            throw new Error(
                `Please supply lat/lon or dwd_station_id or wmo_station_id or source_id`
            )
        }

        const urlSearchParams = new URLSearchParams(skipEmpty({ ...opts }))

        return fetchFn(baseUrl + '/weather?' + urlSearchParams.toString(), defaultFetchOpts).then(
            (r) => r.json() as Promise<WeatherResponse>
        )
    }

    /**
     * Get available sources
     * @param opts {SourcesParams}
     * @returns {Promise<SourcesResponse>}
     */
    function sources(opts: SourcesParams): Promise<SourcesResponse> {
        if (
            !(opts.lat && opts.lon) &&
            isEmpty(opts.dwd_station_id) &&
            isEmpty(opts.wmo_station_id) &&
            isEmpty(opts.source_id)
        ) {
            throw new Error(
                `Please supply lat/lon or dwd_station_id or wmo_station_id or source_id`
            )
        }

        const urlSearchParams = new URLSearchParams(skipEmpty({ ...opts }))

        return fetchFn(baseUrl + '/sources?' + urlSearchParams.toString(), defaultFetchOpts).then(
            (r) => r.json() as Promise<WeatherResponse>
        )
    }

    /**
     * Get SYNOP observations
     * @param opts {SynopParams}
     * @returns {Promise<SynopResponse>}
     */
    function synop(opts: SynopParams): Promise<SynopResponse> {
        if (
            isEmpty(opts.dwd_station_id) &&
            isEmpty(opts.wmo_station_id) &&
            isEmpty(opts.source_id)
        ) {
            throw new Error(
                `Please supply dwd_station_id or wmo_station_id or source_id`
            )
        }

        const urlSearchParams = new URLSearchParams(skipEmpty({ ...opts }))

        return fetchFn(baseUrl + '/synop?' + urlSearchParams.toString(), defaultFetchOpts).then(
            (r) => r.json() as Promise<SynopResponse>
        )
    }

    return { currentWeather, weather, sources, synop }
}

export default BrightSkyAPI
