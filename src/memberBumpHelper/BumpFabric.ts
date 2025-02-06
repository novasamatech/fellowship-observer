import {BaseNetworkConfig, FellowshipConfig, NovasamaConfig} from "../config/conf";
import {SubstrateConnection} from "../connection";
import {BumpHelper} from "./BumpHelper";
import {FellowshipBumper} from "./bumpers/FellowshipBumper";

/**
 * Function to get the appropriate BumpHelper based on the network configuration.
 *
 * @param config - The network configuration.
 * @param connection - The connection to the Substrate node.
 * @returns A FellowshipHelper instance for the specified network.
 * @throws {Error} If the network is not supported.
 */
export function getBumpHelper(config: BaseNetworkConfig, connection: SubstrateConnection): BumpHelper {
    if (config instanceof FellowshipConfig) {
        return new FellowshipBumper(connection);
    } else if (config instanceof NovasamaConfig) {
        return new FellowshipBumper(connection);
    } else {
        throw new Error(`Unsupported network: ${config.name}`);
    }
}