pragma solidity ^0.4.18;

import "./HillAccessControl.sol";

/// @title Base contract for CryptoHills. Holds all common structs, events and base variables.
/// @author Hill St Labs
contract HillBase is HillAccessControl {
    /*** EVENTS ***/

    /// @dev Transfer event as defined in current draft of ERC721. Emitted every time a Hill
    ///  ownership is assigned
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /*** DATA TYPES ***/

    /// @dev The main Kitty struct. Every cat in CryptoKitties is represented by a copy
    ///  of this structure, so great care was taken to ensure that it fits neatly into
    ///  exactly two 256-bit words. Note that the order of the members in this structure
    ///  is important because of the byte-packing rules used by Ethereum.
    ///  Ref: http://solidity.readthedocs.io/en/develop/miscellaneous.html
    struct Hill {
        uint256 elevation;
        uint256 latitude;
        uint256 longitude;
    }
    /*** STORAGE ***/

    /// @dev An array containing the Hill struct for all Hills in existence. The ID
    ///  of each hill is actually an index into this array.
    Hill[] hills;

    /// @dev A mapping from HillIDs to the address that owns them. All hills have
    ///  some valid owner address
    mapping (uint256 => address) public hillIndexToOwner;

    // @dev A mapping from owner address to count of tokens that address owns.
    //  Used internally inside balanceOf() to resolve ownership count.
    mapping (address => uint256) ownershipTokenCount;

    /// @dev A mapping from HillIDs to an address that has been approved to call
    ///  transferFrom(). Each Hill can only have one approved address for transfer
    ///  at any time. A zero value means no approval is outstanding.
    mapping (uint256 => address) public hillIndexToApproved;

    /// @dev Assigns ownership of a specific Hill to an address.
    function _transfer(address _from, address _to, uint256 _tokenId) internal {
        ownershipTokenCount[_to]++;
        // transfer ownership
        hillIndexToOwner[_tokenId] = _to;
        if (_from != address(0)) {
            ownershipTokenCount[_from]--;
            // once the kitten is transferred also clear sire allowances
            // clear any previously approved ownership exchange
            delete hillIndexToApproved[_tokenId];
        }
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);
    }

    /// @dev An internal method that creates a new hills and stores it. This
    ///  method doesn't do any checking and should only be called when the
    ///  input data is known to be valid. Will generate both a Birth event
    ///  and a Transfer event.
    /// @param _elevation The hills elevation
    /// @param _latitude The hills latitude
    /// @param _longitude The hills longitude
    /// @param _owner The inital owner of this hill, must be non-zero
    function _createHill(
        uint256 _elevation,
        uint256 _latitude,
        uint256 _longitude,
        address _owner
    )
        internal
        returns (uint)
    {
        Hill memory _hill = Hill({
            elevation: _elevation,
            latitude: _latitude,
            longitude: _longitude
        });
        uint256 newHillId = hills.push(_hill) - 1;

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _transfer(0, _owner, newHillId);

        return newHillId;
    }
}
