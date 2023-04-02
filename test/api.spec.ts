import fetch from 'node-fetch'
const { Response } = jest.requireActual('node-fetch')

import BrightSkyAPI from '../src/api'

jest.mock('node-fetch')

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('BrightSkyAPI', () => {
    let api: ReturnType<typeof BrightSkyAPI>

    beforeAll(() => {
        api = BrightSkyAPI({ fetch: mockFetch })
    })

    describe('Initialize', () => {
        it('should accept different endpoints', async () => {
            api = BrightSkyAPI({ baseUrl: 'http://example.com', fetch: mockFetch })

            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({})))

            await api.currentWeather({
                lat: '52.5070',
                lon: '13.4246',
            })

            expect(fetch).toHaveBeenCalledWith(
                'http://example.com/current_weather?lat=52.5070&lon=13.4246',
                { headers: { Accept: 'application/json; charset=UTF-8' }, method: 'GET' }
            )
        })
    })

    describe('Get current weather', () => {
        it('should get the current weather', async () => {
            const expected = { weather: [], sources: [] }

            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(expected)))

            const response = await api.currentWeather({
                lat: '52.5070',
                lon: '13.4246',
            })

            expect(response).toEqual(expected)
        })
    })

    describe('Get observed and/or forecasted weather', () => {
        it('should get the weather', async () => {
            const expected = { weather: [], sources: [] }

            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(expected)))

            const response = await api.weather({
                date: '2023-04-01T20:41+02:00',
                lat: '52.5070',
                lon: '13.4246',
            })

            expect(response).toEqual(expected)
        })

        it('should require lat, lon, or sources...', () => {
            try {
                api.weather({ date: '2023-04-01T20:41+02:00' })
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty(
                    'message',
                    `Please supply lat/lon or dwd_station_id or wmo_station_id or source_id`
                )
            }
        })
    })

    describe('Get available sources', () => {
        it('should get sources', async () => {
            const expected = { sources: [] }

            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(expected)))

            const response = await api.sources({
                lat: '52.5070',
                lon: '13.4246',
            })

            expect(response).toEqual(expected)
        })

        it('should require lat, lon, or sources...', () => {
            try {
                api.sources({})
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty(
                    'message',
                    `Please supply lat/lon or dwd_station_id or wmo_station_id or source_id`
                )
            }
        })
    })

    describe('Get SYNOP observations', () => {
        it('should get synop', async () => {
            const expected = { weather: [], sources: [] }

            mockFetch.mockResolvedValueOnce(new Response(JSON.stringify(expected)))

            const response = await api.synop({
                date: '2023-04-01T20:41+02:00',
                source_id: [12345],
            })

            expect(response).toEqual(expected)
        })

        it('should require dwd_station_id, wmo_station_id, or source_id', () => {
            try {
                api.synop({
                    date: '2023-04-01T20:41+02:00',
                })
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty(
                    'message',
                    `Please supply dwd_station_id or wmo_station_id or source_id`
                )
            }
        })
    })
})
