const defaultConfig = {
    storageKey: "e58ea3edfbbbc2"
};
let activeConfig = {
    baseUrl: "/auth",
    storageKey: defaultConfig.storageKey
};
/** Library consumer helper to provide config. */
export function defineMernAccessConfig(cfg) {
    return cfg;
}
/** Internal: read current config, merged with defaults */
export function getConfig() {
    return {
        baseUrl: activeConfig.baseUrl,
        storageKey: activeConfig.storageKey ?? defaultConfig.storageKey,
        onAuthError: activeConfig.onAuthError ?? (() => { })
    };
}
/** Used by the Provider to set active config at runtime */
export function _setActiveConfig(cfg) {
    activeConfig = { ...activeConfig, ...cfg };
}
