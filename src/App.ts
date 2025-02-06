import { SubstrateConnection } from './connection';
import { config } from './config/conf';
import { Sender } from './utils';
import { configManager } from './config/ConfigManager';
import {getBumpHelper} from "./memberBumpHelper/BumpFabric";

interface Connections {
    [network: string]: SubstrateConnection;
}

async function main(): Promise<void> {
    const networkType = process.argv[2];

    let connections: Connections = {}
    if (!config.bumpAccount) {
        throw new Error('Payout Account does not set, please provide BUMP_ACCOUNT_MNEMONIC variable')
    }

    const sender = new Sender(config.bumpAccount)

    const filteredNetworks = configManager(networkType, config)

    for (const network of filteredNetworks) {
        // Create connection
        const connection = new SubstrateConnection(network.endpoint);
        await connection.connect();
        connections[network.name] = connection;
        console.log(`Connected to ${network.name} network`);

        // Bump Fellowship members and salary
        const memberBumpHelper = getBumpHelper(network, connections[network.name]);
        await memberBumpHelper.bumpMembers(sender.generateKeyringPair());
        await memberBumpHelper.bumpSalaryCycle(sender.generateKeyringPair());


        // Close connection
        await connection.disconnect();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});