import type { Configuration, PopupRequest } from '@azure/msal-browser';

const BSDD_API_SCOPE = 'https://buildingsmartservices.onmicrosoft.com/bsddapi/read';

// Hardcoded redirect URI for production and localhost for development
const getCurrentOrigin = () => {
    if (typeof window === 'undefined') return 'http://localhost:5173';
    const isProd = window.location.hostname === 'bim-tools.github.io';
    if (isProd) {
        // Hardcoded for GitHub Pages deployment
        return 'https://bim-tools.github.io/bsdd-sketchup-skc-downloader/';
    }
    // Default to localhost for dev
    return 'http://localhost:5173/';
};

export const msalConfig: Configuration = {
    auth: {
        clientId: "0fcd615b-f2b7-4514-9046-7b3e545ba341",
        authority: 'https://authentication.buildingsmart.org/tfp/buildingsmartservices.onmicrosoft.com/b2c_1a_signupsignin_c',
        knownAuthorities: ['authentication.buildingsmart.org'],
        redirectUri: getCurrentOrigin(),
        postLogoutRedirectUri: getCurrentOrigin(),
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
};

export const loginRequest: PopupRequest = {
    scopes: [BSDD_API_SCOPE],
    prompt: 'select_account',
};

// Use test environment for development (supports CORS)
// export const bsddConfig = {
//     apiUrl: 'https://test.bsdd.buildingsmart.org',
//     apiScope: BSDD_API_SCOPE,
// };

// For production deployment, change to: 'https://api.bsdd.buildingsmart.org'
export const bsddConfig = {
    apiUrl: 'https://api.bsdd.buildingsmart.org',
    apiScope: BSDD_API_SCOPE,
};
