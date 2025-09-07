export interface MernAccessClientConfig {
    /** Base URL where mern-access routes live, e.g. https://api.example.com/auth */
    baseUrl: string;
    /** localStorage key used to store the access token */
    storageKey?: string;
    /** Called on non-OK responses or network failures */
    onAuthError?: (err: unknown) => void;
}
/** Library consumer helper to provide config. */
export declare function defineMernAccessConfig(cfg: MernAccessClientConfig): MernAccessClientConfig;
/** Internal: read current config, merged with defaults */
export declare function getConfig(): Required<MernAccessClientConfig>;
/** Used by the Provider to set active config at runtime */
export declare function _setActiveConfig(cfg: MernAccessClientConfig): void;
