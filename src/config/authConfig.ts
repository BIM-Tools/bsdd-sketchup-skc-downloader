import type { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_CLIENT_ID as string,
        authority: 'https://authentication.buildingsmart.org/tfp/buildingsmartservices.onmicrosoft.com/b2c_1a_signupsignin_c',
        knownAuthorities: ['authentication.buildingsmart.org'],
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
};

export const loginRequest: PopupRequest = {
    scopes: ['https://buildingsmartservices.onmicrosoft.com/api/read'],
    prompt: 'select_account',
};

// Use test environment for development (supports CORS)
// export const bsddConfig = {
//     apiUrl: 'https://test.bsdd.buildingsmart.org',
//     apiScope: 'https://buildingsmartservices.onmicrosoft.com/api/read',
// };

// For production deployment, change to: 'https://api.bsdd.buildingsmart.org'
export const bsddConfig = {
    apiUrl: 'https://api.bsdd.buildingsmart.org',
    apiScope: 'https://buildingsmartservices.onmicrosoft.com/api/read',
};
