
export interface MernAccessClientConfig {
  /** Base URL where mern-access routes live, e.g. https://api.example.com/auth */
  baseUrl: string;
  /** localStorage key used to store the access token */
  storageKey?: string;
  /** Called on non-OK responses or network failures */
  onAuthError?: (err: unknown) => void;
}

const defaultConfig: Required<Pick<MernAccessClientConfig, "storageKey">> = {
  storageKey: "e58ea3edfbbbc2"
};

let activeConfig: MernAccessClientConfig = {
  baseUrl: "/auth",
  storageKey: defaultConfig.storageKey
};

/** Library consumer helper to provide config. */
export function defineMernAccessConfig(cfg: MernAccessClientConfig) {
  return cfg;
}

/** Internal: read current config, merged with defaults */
export function getConfig(): Required<MernAccessClientConfig> {
  return {
    baseUrl: activeConfig.baseUrl,
    storageKey: activeConfig.storageKey ?? defaultConfig.storageKey,
    onAuthError: activeConfig.onAuthError ?? (() => {})
  };
}

/** Used by the Provider to set active config at runtime */
export function _setActiveConfig(cfg: MernAccessClientConfig) {
  activeConfig = { ...activeConfig, ...cfg };
}
