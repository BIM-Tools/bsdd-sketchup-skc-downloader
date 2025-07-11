import { useState, useCallback } from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../config/authConfig'
import type { AccountInfo } from '@azure/msal-browser'

interface UseAuthResult {
    isAuthenticated: boolean
    user: AccountInfo | null
    login: () => Promise<void>
    logout: () => Promise<void>
    getAccessToken: () => Promise<string | null>
    isLoading: boolean
    error: string | null
}

export const useAuth = (): UseAuthResult => {
    const { instance, accounts } = useMsal()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isAuthenticated = accounts.length > 0
    const user = accounts[0] || null

    const login = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            await instance.loginPopup(loginRequest)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [instance])

    const logout = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            await instance.logoutPopup()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Logout failed')
            console.error('Logout error:', err)
        } finally {
            setIsLoading(false)
        }
    }, [instance])

    const getAccessToken = useCallback(async (): Promise<string | null> => {
        if (!user) {
            console.log('No user available for token acquisition')
            return null
        }

        try {
            console.log('Attempting silent token acquisition...')
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: user,
            })
            console.log('Silent token acquisition successful')
            return response.accessToken
        } catch (err) {
            console.error('Silent token acquisition error:', err)

            // If silent token acquisition fails, try interactive
            try {
                console.log('Attempting interactive token acquisition...')
                const response = await instance.acquireTokenPopup(loginRequest)
                console.log('Interactive token acquisition successful')
                return response.accessToken
            } catch (interactiveErr) {
                console.error('Interactive token acquisition error:', interactiveErr)
                return null
            }
        }
    }, [instance, user])

    return {
        isAuthenticated,
        user,
        login,
        logout,
        getAccessToken,
        isLoading,
        error,
    }
}
