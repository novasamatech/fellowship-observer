import { Keyring } from '@polkadot/keyring'

export class Sender {
    private mnemonic: string

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic
    }

    generateKeyringPair(): any {
        const keyring = new Keyring();
        const pair = keyring.createFromUri(this.mnemonic, {}, 'sr25519');
        return pair;
    }

}