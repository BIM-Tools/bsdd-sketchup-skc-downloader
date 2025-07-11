import { DictionaryApi, type DictionaryContractV1 } from '../generated/api/src'

export async function downloadSketchUpFile(
    dictionaryApi: DictionaryApi,
    dictionaryUri: string,
    dictionary?: DictionaryContractV1
): Promise<void> {
    const blob = await dictionaryApi.dictionaryDownloadSketchup({
        dictionaryUri
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const filename = dictionary?.code
        ? `${dictionary.code.replace(/[^a-zA-Z0-9]/g, '_')}.skc`
        : `dictionary_${dictionaryUri.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown'}.skc`

    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function filterDictionaries<T extends {
    name?: string | null
    code?: string | null
    organizationNameOwner?: string | null
}>(
    dictionaries: T[],
    searchTerm: string
): T[] {
    if (!searchTerm.trim()) return dictionaries

    const searchLower = searchTerm.toLowerCase()
    return dictionaries.filter(dict =>
        dict.name?.toLowerCase().includes(searchLower) ||
        dict.code?.toLowerCase().includes(searchLower) ||
        dict.organizationNameOwner?.toLowerCase().includes(searchLower)
    )
}
