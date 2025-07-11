import { bsddConfig } from '../config/authConfig'
import {
    Configuration,
    DictionaryApi,
    type DictionaryContractV1
} from '../generated/api/src'
import { getUserAgent } from '../utils/appInfo'

const RATE_LIMIT_DELAY = 170 // ~6 requests per second
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class BsddService {
    private config: Configuration
    private allDictionaries: DictionaryContractV1[] | null = null
    private isLoading = false
    private loadPromise: Promise<DictionaryContractV1[]> | null = null

    constructor() {
        this.config = new Configuration({
            basePath: bsddConfig.apiUrl,
            middleware: [],
            headers: {
                'User-Agent': getUserAgent()
            }
        })
    }

    createAuthenticatedApi(token: string) {
        const authConfig = new Configuration({
            basePath: bsddConfig.apiUrl,
            accessToken: async () => `Bearer ${token}`,
            middleware: [],
            headers: {
                'User-Agent': getUserAgent()
            }
        })
        return new DictionaryApi(authConfig)
    }

    createPublicApi() {
        return new DictionaryApi(this.config)
    }

    async loadAllDictionaries(token?: string): Promise<DictionaryContractV1[]> {
        if (this.allDictionaries) {
            return this.allDictionaries
        }

        if (this.loadPromise) {
            return this.loadPromise
        }

        this.loadPromise = this._fetchAllDictionaries(token)
        return this.loadPromise
    }

    private async _fetchAllDictionaries(token?: string): Promise<DictionaryContractV1[]> {
        try {
            this.isLoading = true
            const dictionaryApi = token
                ? this.createAuthenticatedApi(token)
                : this.createPublicApi()

            const allDictionaries: DictionaryContractV1[] = []
            let offset = 0
            const limit = 100
            let hasMore = true

            while (hasMore) {
                const startTime = Date.now()

                const response = await dictionaryApi.dictionaryGet({
                    offset,
                    limit,
                    includeTestDictionaries: false
                })

                const fetchedDictionaries = response.dictionaries || []
                allDictionaries.push(...fetchedDictionaries)

                const totalCount = response.totalCount || 0
                hasMore = offset + limit < totalCount
                offset += limit

                if (hasMore) {
                    const elapsed = Date.now() - startTime
                    const delayNeeded = Math.max(0, RATE_LIMIT_DELAY - elapsed)
                    if (delayNeeded > 0) {
                        await delay(delayNeeded)
                    }
                }
            }

            this.allDictionaries = allDictionaries
            return allDictionaries

        } catch {
            this.loadPromise = null
            throw new Error('Failed to load dictionaries from bSDD API')
        } finally {
            this.isLoading = false
        }
    }

    getLoadingStatus() {
        return {
            isLoading: this.isLoading,
            isLoaded: this.allDictionaries !== null,
            count: this.allDictionaries?.length || 0
        }
    }

    clearCache() {
        this.allDictionaries = null
        this.loadPromise = null
        this.isLoading = false
    }
}

export const bsddService = new BsddService()
