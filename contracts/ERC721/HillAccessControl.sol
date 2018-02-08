pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";

/// @title A facet of HillCore that manages special access privileges.
/// @author Hill Street Labs
/// @dev See the HillCore contract documentation to understand how the various contract facets are arranged.
contract HillAccessControl is Pausable {
  // This facet controls access control for CryptoHills. There are four roles managed here:
  //
  //     - The CEO: The CEO can reassign other roles and change the addresses of our dependent smart
  //         contracts. It is also the only role that can unpause the smart contract. It is initially
  //         set to the address that created the smart contract in the HillCore constructor.
  //
  //     - The CFO: The CFO can withdraw funds from HillCore and its auction contracts.
  //
  //     - The COO: The COO can release gen0 hills to auction, and mint promo hills.
  //

  /// @dev Emited when contract is upgraded - See README.md for updgrade plan
  event ContractUpgrade(address newContract);

  // The addresses of the accounts (or contracts) that can execute actions within each roles.
  address public ceoAddress;
  address public cfoAddress;
  address public cooAddress;

  /// @dev Access modifier for CEO-only functionality
  modifier onlyCEO() {
    require(msg.sender == ceoAddress);
    _;
  }

  /// @dev Access modifier for CFO-only functionality
  modifier onlyCFO() {
    require(msg.sender == cfoAddress);
    _;
  }

  /// @dev Access modifier for COO-only functionality
  modifier onlyCOO() {
    require(msg.sender == cooAddress);
    _;
  }

  modifier onlyCLevel() {
    require(
      msg.sender == cooAddress ||
      msg.sender == ceoAddress ||
      msg.sender == cfoAddress
    );
    _;
  }

  /// @dev Assigns a new address to act as the CEO. Only available to the current CEO.
  /// @param _newCEO The address of the new CEO
  function setCEO(address _newCEO) public onlyCEO {
    require(_newCEO != address(0));
    ceoAddress = _newCEO;
  }

  /// @dev Assigns a new address to act as the CFO. Only available to the current CEO.
  /// @param _newCFO The address of the new CFO
  function setCFO(address _newCFO) public onlyCEO {
    require(_newCFO != address(0));
    cfoAddress = _newCFO;
  }

  /// @dev Assigns a new address to act as the COO. Only available to the current CEO.
  /// @param _newCOO The address of the new COO
  function setCOO(address _newCOO) public onlyCEO {
    require(_newCOO != address(0));
    cooAddress = _newCOO;
  }

  function withdrawBalance() external onlyCFO {
    cfoAddress.transfer(this.balance);
  }
}
