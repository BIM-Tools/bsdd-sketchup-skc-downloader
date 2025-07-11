import { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Container,
    Title,
    Text,
    TextInput,
    Card,
    Group,
    Button,
    Stack,
    Badge,
    Loader,
    Alert,
    Grid,
    Pagination,
    Progress
} from '@mantine/core'
import { IconSearch, IconDownload, IconAlertCircle, IconBuildingBank, IconRefresh } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import {
    type DictionaryContractV1,
    type DictionaryApi
} from '../generated/api/src'
import { bsddService } from '../services/bsddService'
import { downloadSketchUpFile, filterDictionaries } from '../utils/downloadUtils'
import { useAuth } from '../hooks/useAuth'

export function DictionarySelector() {
    const { getAccessToken } = useAuth()
    const [allDictionaries, setAllDictionaries] = useState<DictionaryContractV1[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [downloadingDict, setDownloadingDict] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [dictionaryApi, setDictionaryApi] = useState<DictionaryApi | null>(null)

    const [loadingProgress, setLoadingProgress] = useState<{ current: number; total: number } | null>(null)

    const pageSize = 24

    // Load all dictionaries using the new service with rate limiting
    const loadAllDictionaries = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            setLoadingProgress(null)

            const token = await getAccessToken()

            // Monitor loading progress
            const progressInterval = setInterval(() => {
                const status = bsddService.getLoadingStatus()
                if (status.isLoading && status.count > 0) {
                    setLoadingProgress({ current: status.count, total: Math.max(status.count * 2, 100) })
                }
            }, 500)

            const dictionaries = await bsddService.loadAllDictionaries(token || undefined)
            setAllDictionaries(dictionaries)

            clearInterval(progressInterval)
            setLoadingProgress(null)

        } catch (err) {
            setError('Failed to load dictionaries. Please try again.')
            console.error('Error loading dictionaries:', err)
        } finally {
            setLoading(false)
        }
    }, [getAccessToken])

    // Filter and paginate dictionaries using useMemo for performance
    const { dictionaries, totalCount, totalPages } = useMemo(() => {
        // Apply client-side filtering
        const filtered = searchTerm.trim()
            ? filterDictionaries(allDictionaries, searchTerm)
            : allDictionaries

        // Apply client-side pagination
        const startIndex = (currentPage - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginated = filtered.slice(startIndex, endIndex)

        return {
            dictionaries: paginated,
            totalCount: filtered.length,
            totalPages: Math.ceil(filtered.length / pageSize)
        }
    }, [allDictionaries, searchTerm, currentPage, pageSize])

    // Initialize API clients with authentication
    useEffect(() => {
        const initializeApis = async () => {
            try {
                const token = await getAccessToken()
                if (token) {
                    const dictionaryApi = bsddService.createAuthenticatedApi(token)
                    setDictionaryApi(dictionaryApi)
                } else {
                    const dictionaryApi = bsddService.createPublicApi()
                    setDictionaryApi(dictionaryApi)
                }
            } catch (error) {
                console.error('Failed to initialize APIs:', error)
                setError('Failed to initialize API connection')
            }
        }

        initializeApis()
    }, [getAccessToken])

    // Load all dictionaries when component mounts (no dependency on dictionaryApi)
    useEffect(() => {
        loadAllDictionaries()
    }, [loadAllDictionaries])

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleDownload = async (dictionary: DictionaryContractV1) => {
        if (!dictionary.uri || !dictionaryApi) {
            notifications.show({
                title: 'Error',
                message: 'Dictionary URI is missing or API not initialized',
                color: 'red',
                icon: <IconAlertCircle size={16} />
            })
            return
        }

        try {
            setDownloadingDict(dictionary.uri)

            // Ensure we have fresh authentication token for download
            const token = await getAccessToken()
            if (token) {
                const authDictionaryApi = bsddService.createAuthenticatedApi(token)
                await downloadSketchUpFile(authDictionaryApi, dictionary.uri, dictionary)
            } else {
                await downloadSketchUpFile(dictionaryApi, dictionary.uri, dictionary)
            }

            notifications.show({
                title: 'Download Started',
                message: `Downloading ${dictionary.name} classification file`,
                color: 'green',
                icon: <IconDownload size={16} />
            })

        } catch (err) {
            notifications.show({
                title: 'Download Failed',
                message: 'Failed to download the dictionary. Please try again.',
                color: 'red',
                icon: <IconAlertCircle size={16} />
            })
            console.error('Download error:', err)
        } finally {
            setDownloadingDict(null)
        }
    }

    if (loading) {
        return (
            <Container size="lg" py="xl">
                <Stack align="center" gap="md">
                    <Loader size="xl" />
                    <Text>Loading bSDD dictionaries...</Text>
                    {loadingProgress && (
                        <div style={{ width: '300px' }}>
                            <Text size="sm" c="dimmed" ta="center" mb="xs">
                                Loaded {loadingProgress.current} dictionaries
                            </Text>
                            <Progress value={50} animated />
                        </div>
                    )}
                    <Text size="sm" c="dimmed" ta="center">
                        Fetching all available dictionaries (rate limited for API compliance)
                    </Text>
                </Stack>
            </Container>
        )
    }

    if (error) {
        return (
            <Container size="lg" py="xl">
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Error"
                    color="red"
                    variant="filled"
                >
                    <Text>{error}</Text>
                    <Group mt="md">
                        <Button variant="light" color="red" onClick={() => window.location.reload()}>
                            Reload Page
                        </Button>
                        <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={() => {
                            bsddService.clearCache()
                            loadAllDictionaries()
                        }}>
                            Retry Load
                        </Button>
                    </Group>
                </Alert>
            </Container>
        )
    }

    return (
        <Container size="xl" py="xl" style={{ width: '100%', maxWidth: '1200px' }}>
            <Stack gap="xl">
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <Title order={1} mb="sm">
                        SketchUp Classification Downloader
                    </Title>
                    <Text size="lg" c="dimmed" mb="md">
                        Download SketchUp classification files (.skc) from the buildingSMART Data Dictionary
                    </Text>
                    <Text size="sm" c="dimmed">
                        Learn more: <a href="https://help.sketchup.com/en/sketchup/classifying-objects" target="_blank" rel="noopener noreferrer">SketchUp Classifications</a> | <a href="https://www.buildingsmart.org/users/services/buildingsmart-data-dictionary/" target="_blank" rel="noopener noreferrer">bSDD</a>
                    </Text>
                </div>

                {/* Search */}
                <TextInput
                    placeholder="Search dictionaries by name, code, or organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                    leftSection={<IconSearch size={16} />}
                    size="lg"
                />

                {/* Results Summary and Pagination */}
                <Group justify="space-between" align="center">
                    <Text>
                        {searchTerm
                            ? `Showing ${dictionaries.length} of ${totalCount} dictionaries matching "${searchTerm}"`
                            : `Showing ${dictionaries.length} of ${totalCount} dictionaries`
                        }
                    </Text>
                    {searchTerm && (
                        <Button variant="subtle" onClick={() => setSearchTerm('')}>
                            Clear search
                        </Button>
                    )}
                </Group>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Group justify="center">
                        <Pagination
                            value={currentPage}
                            onChange={handlePageChange}
                            total={totalPages}
                            size="md"
                        />
                    </Group>
                )}

                {/* Dictionary Cards */}
                <Grid>
                    {dictionaries.map((dictionary) => (
                        <Grid.Col key={dictionary.uri} span={{ base: 12, md: 6, lg: 4 }}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                                <Stack justify="space-between" h="100%">
                                    <div>
                                        <Group justify="space-between" mb="xs">
                                            <Text fw={500} size="lg" lineClamp={2}>
                                                {dictionary.name}
                                            </Text>
                                            <IconBuildingBank size={20} color="var(--mantine-color-blue-6)" />
                                        </Group>

                                        <Text size="sm" c="dimmed" mb="sm">
                                            Code: {dictionary.code}
                                        </Text>

                                        <Text size="sm" mb="md" lineClamp={3}>
                                            {dictionary.organizationCodeOwner || 'No additional information available'}
                                        </Text>

                                        <Group gap="xs" mb="md">
                                            <Badge variant="light" color="blue">
                                                v{dictionary.version}
                                            </Badge>
                                            <Badge variant="light" color="gray">
                                                {dictionary.defaultLanguageCode}
                                            </Badge>
                                            {dictionary.isVerified && (
                                                <Badge variant="light" color="green">
                                                    Verified
                                                </Badge>
                                            )}
                                        </Group>

                                        <Text size="xs" c="dimmed" mb="md">
                                            By: {dictionary.organizationNameOwner}
                                        </Text>
                                    </div>

                                    <Button
                                        variant="filled"
                                        leftSection={<IconDownload size={16} />}
                                        onClick={() => handleDownload(dictionary)}
                                        loading={downloadingDict === dictionary.uri}
                                        disabled={downloadingDict !== null}
                                        fullWidth
                                    >
                                        {downloadingDict === dictionary.uri ? 'Downloading...' : 'Download .skc file'}
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                {/* Empty State */}
                {dictionaries.length === 0 && !loading && (
                    <Alert title="No dictionaries found" icon={<IconSearch size={16} />}>
                        <Text>
                            {searchTerm
                                ? `No dictionaries match "${searchTerm}". Try adjusting your search term.`
                                : 'No dictionaries are available at the moment.'
                            }
                        </Text>
                    </Alert>
                )}
            </Stack>
        </Container>
    )
}
