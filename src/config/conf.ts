/**
 * Base class for network configuration.
 */
export class BaseNetworkConfig {
    name: string;
    endpoint: string;

    /**
     * @param {string} name - The name of the network.
     * @param {string} endpoint - The endpoint of the network.
     */
    constructor(name: string, endpoint: string) {
        this.name = name;
        this.endpoint = endpoint;
    }
}

/**
 * Class for Polkadot Collectives network configuration.
 */
export class FellowshipConfig extends BaseNetworkConfig {

    /**
     * @param {string} name - The name of the network.
     * @param {string} endpoint - The endpoint of the network.
     */
    constructor(name: string, endpoint: string) {
        super(name, endpoint);
    }
}

/**
 * Class for Novasama-collective network configuration.
 */
export class NovasamaConfig extends BaseNetworkConfig {

    /**
     * @param {string} name - The name of the network.
     * @param {string} endpoint - The endpoint of the network.
     */
    constructor(name: string, endpoint: string) {
        super(name, endpoint);
    }
}


/**
 * Type for Network configuration.
 */
export type NetworkConfig = FellowshipConfig | NovasamaConfig;

/**
 * Class for the main configuration.
 */
export class Config {
    networks: NetworkConfig[];
    bumpAccount: string | undefined;

    /**
     * @param {NetworkConfig[]} networks - The networks of the configuration.
     * @param {string | undefined} bumpAccount - The bump account of the configuration.
     */
    constructor(networks: NetworkConfig[], bumpAccount: string | undefined) {
        this.networks = networks;
        this.bumpAccount = bumpAccount;
    }
}

/**
 * The main configuration object.
 */
export const config = new Config([
    new FellowshipConfig(
        'Polkadot Collectives',
        'wss://sys.ibp.network/collectives-polkadot'
    ),
    new NovasamaConfig(
        'Novasama-Collectives',
        'wss://westend-collectives-a-parachain.novasama-tech.org'
    )
], process.env.BUMP_ACCOUNT_MNEMONIC);