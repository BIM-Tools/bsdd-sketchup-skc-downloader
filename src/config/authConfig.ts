import type { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
    auth: {
        clientId: '4aba821f-d4ff-498b-a462-c2837dbbba70',
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

export const bsddConfig = {
    // Use test environment for development (supports CORS)
    // For production deployment, change to: 'https://api.bsdd.buildingsmart.org'
    apiUrl: 'https://test.bsdd.buildingsmart.org',
    apiScope: 'https://buildingsmartservices.onmicrosoft.com/api/read',
};
