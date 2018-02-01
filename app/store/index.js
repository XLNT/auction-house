import { action, observable } from "mobx";
import contract from "truffle-contract";

export default class Store {
  @observable currentAccount;

  constructor(web3) {
    this.web3 = web3;
    this.accountInterval = setInterval(() => this.setCurrentAccount(), 100); // Ugh ಠ_ಠ
  }

  setCurrentAccount() {
    this.web3.eth.getAccounts(
      action((error, accounts) => {
        this.currentAccount = accounts[0];
      })
    );
  }
}
