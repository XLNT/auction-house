pragma solidity ^0.4.18;

// // Auction wrapper functions
import "./HillMinting.sol";

/// @title CryptoHills: Collectible, and oh-so-adorable hills on the Ethereum blockchain.
/// @author Hill St Labs
/// @dev The main CryptoHills contract, keeps track of hills so they don't get lost.
contract HillCore is HillMinting {

    // This is the main CryptoHills contract.
    //
    // We break the core contract into multiple files using inheritence, one for each major
    // facet of functionality of CH. This allows us to keep related code bundled together while still
    // avoiding a single giant file with everything in it. The breakdown is as follows:
    //
    //      - HillBase: This is where we define the most fundamental code shared throughout the core
    //             functionality. This includes our main data storage, constants and data types, plus
    //             internal functions for managing these items.
    //
    //      - HillAccessControl: This contract manages the various addresses and constraints for operations
    //             that can be executed only by specific roles. Namely CEO, CFO and COO.
    //
    //      - HillOwnership: This provides the methods required for basic non-fungible token
    //             transactions, following the draft ERC-721 spec (https://github.com/ethereum/EIPs/issues/721).
    //
    //      - HillMinting: This final facet contains the functionality we use for creating new hill.

    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    /// @notice Creates the main CryptoHills smart contract instance.
    function HillCore() public {
        // Starts paused.
        paused = true;

        // the creator of the contract is the initial CEO
        ceoAddress = msg.sender;

        // the creator of the contract is also the initial COO
        cooAddress = msg.sender;

        // start with the mythical hill 0 - so we don't have generation-0 parent issues
        _createHill(0, 0, 0, address(0));
    }

    /// @dev Used to mark the smart contract as upgraded, in case there is a serious
    ///  breaking bug. This method does nothing but keep track of the new contract and
    ///  emit a message indicating that the new address is set. It's up to clients of this
    ///  contract to update to the new contract address in that case. (This contract will
    ///  be paused indefinitely if such an upgrade takes place.)
    /// @param _v2Address new address
    function setNewAddress(address _v2Address) public onlyCEO whenPaused {
        // See README.md for updgrade plan
        newContractAddress = _v2Address;
        ContractUpgrade(_v2Address);
    }

    /// @notice No tipping!
    /// @dev Reject all Ether from being sent here
    function() external payable {
      revert();
    }

    /// @notice Returns all the relevant information about a specific hill.
    /// @param _id The ID of the hill of interest.
    function getHill(uint256 _id)
        public
        view
        returns (
        uint256 elevation,
        uint256 latitude,
        uint256 longitude
    ) {
        Hill storage hil = hills[_id];

        elevation = uint256(hil.elevation);
        latitude = uint256(hil.latitude);
        longitude = uint256(hil.longitude);
    }

    /// @dev Override unpause so it requires all external contract addresses
    ///  to be set before contract can be unpaused. Also, we can't have
    ///  newContractAddress set either, because then the contract was upgraded.
    function unpause() public onlyCEO whenPaused {
        require(newContractAddress == address(0));

        // Actually unpause the contract.
        super.unpause();
    }
}
