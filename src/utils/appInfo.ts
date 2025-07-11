// Application metadata for API headers
// Used for bSDD API User-Agent header to track usage statistics
export const APP_NAME = 'bsdd-sketchup-skc-downloader'
export const APP_VERSION = '1.0.0' // Update this when releasing new versions

export const getUserAgent = () => `${APP_NAME}/${APP_VERSION}`
