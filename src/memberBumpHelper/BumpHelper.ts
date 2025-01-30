import { ApiPromise } from '@polkadot/api';
import { SubstrateConnection } from '../connection';

/**
 * Abstract class BumpHelper that provides a structure for handling bumps.
 */
export abstract class BumpHelper {
    protected api: ApiPromise;

    /**
     * Constructor for the BumpHelper class.
     * @param connection - The connection to the Substrate node.
     */
    constructor(connection: SubstrateConnection) {
        this.api = connection.getApi();
    }

    /**
     * Abstract method to bump members.
     * @param sender - The sender of the transaction.
     * @returns A promise that resolves when members are bumped.
     */
    public abstract bumpMembers(sender): Promise<void>;

    /**
     * Abstract method to bump salary cycle.
     * @param sender - The sender of the transaction.
     * @returns A promise that resolves when salary cycle is bumped.
     */
    public abstract bumpSalaryCycle(sender): Promise<void>;
}