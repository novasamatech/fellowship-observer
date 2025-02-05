import {SubstrateConnection} from "../../connection";
import {BumpHelper} from "../BumpHelper";
import {sendTransaction} from "../../utils";
import * as console from "node:console";

/**
 * FellowshipBumper is a class that extends BumperHelper and provides methods bump Fellowship members
 */
export class FellowshipBumper extends BumpHelper {

    private params;

    constructor(api: SubstrateConnection) {
        super(api);
    }
    /**
     * Bump Fellowship members that may be bumped
     *
     * @param sender - The sender of the transaction.
     * @returns A promise that resolves when members are bumped.
     */
    async bumpMembers(sender): Promise<void> {
        let members = await this.api.query['fellowshipCore'].member.entries();
        let membersRanks = await this.api.query['fellowshipCollective'].members.entries();

        const memberRanksMap = new Map<string, string>();
        membersRanks.forEach(([{ args: [account] }, value]) => {
            memberRanksMap.set(account.toString(), JSON.parse(value.toString()).rank);
        });

        const currentBlockNumber = await this.getBlockNumber();

        let accountsToBump: string[] = [];
        for (const [{args: [account]}, value] of members) {
            let fellowInfo = JSON.parse(value.toString());
            let rank = Number(memberRanksMap.get(account.toString()) || 0);
            let mayBeBumped = await this.mayBeBumped(rank, fellowInfo, currentBlockNumber);
            if (mayBeBumped) {
                accountsToBump.push(account.toString());
            }
        }

        if (accountsToBump.length > 0) {
            await this.bumpAccounts(accountsToBump, sender);
        }
    }

    /**
     * Bump Fellowship salary cycle
     *
     * @param sender - The sender of the transaction.
     * @returns A promise that resolves when the salary cycle is bumped.
     */
    async bumpSalaryCycle(sender): Promise<void> {
        let currentCycle = await this.api.query['fellowshipSalary'].status();
        const {cycleIndex, cycleStart} = JSON.parse(currentCycle.toString());
        const registrationPeriod = Number(await this.api.consts['fellowshipSalary'].registrationPeriod.toString());
        const payoutPeriod = Number(await this.api.consts['fellowshipSalary'].payoutPeriod.toString());

        const currentBlockNumber = await this.getBlockNumber();

        if (Number(cycleStart) + registrationPeriod + payoutPeriod < currentBlockNumber) {
            console.log(`Bumping salary cycle ${cycleIndex}`);
            const transaction = this.api.tx.fellowshipSalary.bump();
            await sendTransaction(transaction, sender, this.api);
        }
    }

    private async getBlockNumber(): Promise<number> {
        const { block } = await this.api.rpc.chain.getBlock();
        return block.header.number.toNumber();
    }

    private async mayBeBumped(
        rank: number,
        memberInfo: { isActive: boolean; lastProof: number },
        currentBlockNumber: number
    ): Promise<boolean> {
        if (this.isEligableForBump(memberInfo)) {
            return false;
        }

        const rankDemotionPeriod = await this.getRankPromotionAndDemotionPeriod(rank);

        return rankDemotionPeriod > 0 && currentBlockNumber - memberInfo.lastProof > rankDemotionPeriod;
    }

    private isEligableForBump(memberInfo: { isActive: boolean; lastProof: number }) {
        return !memberInfo.isActive;
    }

    private async getRankPromotionAndDemotionPeriod(rank: number): Promise<number> {
        if (!this.params) {
            await this.loadFellowshipParams();
        }

        const rankDemotionPeriod = this.params['demotionPeriod'][rank-1];
        return rankDemotionPeriod;
    }

    private async loadFellowshipParams(): Promise<void> {
        const params = await this.api.query['fellowshipCore'].params();
        const paramsJson = params.toJSON();
        this.params = paramsJson;
    }

    private async bumpAccounts(accounts: string[], sender): Promise<void> {
        console.log(`Bumping accounts ${accounts}`);
        let transaction;
        if (accounts.length > 1) {
            transaction = this.api.tx.utility.batchAll(accounts.map(a => this.api.tx.fellowshipCore.bump(a)));
        } else {
            transaction = this.api.tx.fellowshipCore.bump(accounts[0]);
        }
        await sendTransaction(transaction, sender, this.api);
    }
}