import type { ReactNode } from 'react'
import {
    Container,
    Paper,
    Text,
    Button,
    Stack,
    Group,
    Loader,
    Alert,
    Title,
    Avatar
} from '@mantine/core'
import { IconLogin, IconLogout, IconAlertCircle, IconUser } from '@tabler/icons-react'
import { useAuth } from '../hooks/useAuth'

interface AuthWrapperProps {
    children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
    const { isAuthenticated, user, login, logout, isLoading, error } = useAuth()

    if (isLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Stack align="center" gap="md">
                    <Loader size="xl" />
                    <Text>Initializing authentication...</Text>
                </Stack>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Container size="sm">
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Authentication Error"
                        color="red"
                        variant="filled"
                    >
                        <Text>{error}</Text>
                        <Button variant="light" color="red" mt="md" onClick={() => window.location.reload()}>
                            Reload Page
                        </Button>
                    </Alert>
                </Container>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Container size="sm" style={{ width: '100%', maxWidth: '500px' }}>
                    <Paper shadow="md" p="xl" radius="md" withBorder>
                        <Stack gap="xl" align="center">
                            <div style={{ textAlign: 'center' }}>
                                <Title order={2} mb="sm">
                                    SketchUp Classification Downloader
                                </Title>
                                <Text size="lg" c="dimmed">
                                    Download SketchUp Classification (SKC) files from the buildingSMART Data Dictionary
                                </Text>
                            </div>

                            <IconUser size={64} color="var(--mantine-color-blue-6)" />

                            <div style={{ textAlign: 'center' }}>
                                <Text size="md" mb="md">
                                    Please login with your buildingSMART account to access the bSDD API
                                </Text>
                                <Text size="sm" c="dimmed">
                                    This application requires authentication to download SketchUp classification files
                                    from the buildingSMART Data Dictionary.
                                </Text>
                            </div>

                            <Button
                                size="lg"
                                leftSection={<IconLogin size={20} />}
                                onClick={login}
                                disabled={isLoading}
                                variant="filled"
                            >
                                {isLoading ? 'Logging in...' : 'Login with buildingSMART'}
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            </div>
        )
    }

    return (
        <>
            {/* User info header */}
            <Paper shadow="sm" p="md" mb="md" withBorder>
                <Container size="xl">
                    <Group justify="space-between">
                        <Group gap="sm">
                            <Avatar
                                size="sm"
                                radius="xl"
                                color="blue"
                            >
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </Avatar>
                            <div>
                                <Text size="sm" fw={500}>
                                    {user?.name || user?.username || 'User'}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    Authenticated via buildingSMART
                                </Text>
                            </div>
                        </Group>

                        <Button
                            variant="subtle"
                            leftSection={<IconLogout size={16} />}
                            onClick={logout}
                            disabled={isLoading}
                            size="sm"
                        >
                            Logout
                        </Button>
                    </Group>
                </Container>
            </Paper>

            {/* Main content */}
            {children}
        </>
    )
}
