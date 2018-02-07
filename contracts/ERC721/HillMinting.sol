pragma solidity ^0.4.18;

import "./CryptoHillsOwnership.sol";

/// @title all functions related to creating hills
contract HillMinting is CryptoHillsOwnership {

    // Limits the number of hills the contract owner can ever create.
    uint256 public promoCreationLimit = 5000;
    uint256 public gen0CreationLimit = 50000;

    // Counts the number of cats the contract owner has created.
    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    /// @dev we can create promo hills, up to a limit. Only callable by COO
    /// @param _elevation The hills elevation
    /// @param _latitude The hills latitude
    /// @param _longitude The hills longitude
    /// @param _owner the future owner of the created hills. Default to COO
    function createPromoHill(
      uint256 _elevation,
      uint256 _latitude,
      uint256 _longitude,
      address _owner
    )
      public
      onlyCOO
    {
      if (_owner == address(0)) {
        _owner = cooAddress;
      }
      require(promoCreatedCount < promoCreationLimit);
      require(gen0CreatedCount < gen0CreationLimit);

      promoCreatedCount++;
      gen0CreatedCount++;
      _createHill(_elevation, _latitude, _longitude,  _owner);
    }
}
