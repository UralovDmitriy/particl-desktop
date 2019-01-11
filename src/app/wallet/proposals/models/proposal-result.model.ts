import { Proposal } from 'app/wallet/proposals/models/proposal.model';
import { ProposalOptionResult } from 'app/wallet/proposals/models/proposal-option-result.model';
import { GraphOption } from 'app/wallet/proposals/models/proposal-result-graph-option.model';
import { VoteOption } from 'app/wallet/proposals/models/vote-option.model';
import { Amount } from 'app/core/util/utils';

export class ProposalResult {
  id: number;
  Proposal: Proposal
  ProposalOptionResults: ProposalOptionResult[];
  createdAt: Date;
  proposalId: number;
  updatedAt: Date;
  totalWeight: number = 0;
  private graphOptions: GraphOption[] = [];

  constructor(object: any) {
    this.id = object.id;
    this.Proposal = object.Proposal;
    this.ProposalOptionResults = object.ProposalOptionResults.map((v) => new ProposalOptionResult(v));
    this.createdAt = object.createdAt;
    this.proposalId = object.proposalId;
    this.updatedAt = object.updatedAt;
    this.setTotalWeight();
    this.setGraphInformation()
  }

  // Total weight of all the votes
  setTotalWeight(): void {
    this.ProposalOptionResults.map((optionResult: ProposalOptionResult) => {
      this.totalWeight += optionResult.weight;
    })
  }

  setGraphInformation(): void {
    this.ProposalOptionResults.map((optionResult: ProposalOptionResult) => {
      const option = new GraphOption({
        description: optionResult.weight ? this.getWeightInPercentage(optionResult.weight) : '0%',
        voters: optionResult.voters,
        optionId: optionResult.ProposalOption.optionId,
        weight: this.getPartCoins(optionResult.weight)
      });
      this.addGraphOption(option);
    })
  }

  addGraphOption(option: GraphOption): void {
    this.graphOptions.push(option)
  }

  // Calculating percentage of each vote.
  getWeightInPercentage(weight: number): string {
    return ((weight / this.totalWeight) * 100) + '%';
  }

  // Converting the satishi to part coin
  private  getPartCoins(weight: number): number {
    const part = (weight) / 100000000;
    return (new Amount(part, 4).getAmount());
  }

  get graphData(): GraphOption[] {
    return this.graphOptions;
  }

  get totalCoins(): number {
    return this.getPartCoins(this.totalWeight);
  }

  get totalPercentageText(): string {
    return this.totalWeight >= 1 ? 'coins' : 'coin';
  }
}
