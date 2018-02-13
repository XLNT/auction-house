import { action, observable, observe, computed } from "mobx";
import BigNumber from "bignumber.js";

export default class AuctionStore {
  @observable currentAccountBid = new BigNumber(0);

  constructor(store, auctionId) {
    this.store = store;
    this.auctionId = auctionId;
    this.blockWatcher = observe(
      this.store,
      "currentBlock",
      () => {
        this.getCurrentAccountBid();
      },
      true // invoke immediately
    );
  }

  @computed
  get auction() {
    return this.store.auctionById(this.auctionId);
  }

  @computed
  get statusText() {
    if (!this.auction) return null;
    const { status } = this.auction;
    if (status.equals(0)) return "Live";
    if (status.equals(1)) return "Cancelled";
    return "Completed";
  }

  statusIs(statusString) {
    return statusString === this.statusText;
  }

  @computed
  get userHasParticipated() {
    return this.currentAccountBid > 0;
  }

  @computed
  get userIsHighestBidder() {
    return this.auction.highestBidder === this.store.currentAccount;
  }

  @action
  async getCurrentAccountBid() {
    const {
      readOnlyAuctionBaseInstance,
      currentAccount,
      currentBlock
    } = this.store;
    if (!this.store.isReady) {
      this.currentAccountBid = new BigNumber(0);
      return false;
    }
    this.currentAccountBid = await readOnlyAuctionBaseInstance.getBid(
      this.auctionId,
      currentAccount,
      {},
      currentBlock
    );
  }

  @action
  async placeBid(bigNumber) {
    const { writeOnlyAuctionBaseInstance } = this.store;
    const adjustedBid = bigNumber.minus(this.currentAccountBid);
    const params = {
      from: this.store.currentAccount,
      value: adjustedBid
    };
    await writeOnlyAuctionBaseInstance.bid(this.auctionId, params);
  }

  @action
  async withdrawBalance() {
    const { writeOnlyAuctionBaseInstance } = this.store;
    const params = {
      from: this.store.currentAccount
    };
    await writeOnlyAuctionBaseInstance.withdrawBalance(this.auctionId, params);
  }
}
