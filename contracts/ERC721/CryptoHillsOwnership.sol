pragma solidity ^0.4.18;

import "./HillBase.sol";
import "./ERC721Draft.sol";

/// @title The facet of the CryptoHills core contract that manages ownership, ERC-721 (draft) compliant.
/// @author Hill St Labs
/// @dev Ref: https://github.com/ethereum/EIPs/issues/721
contract CryptoHillsOwnership is HillBase, ERC721 {

    /// @notice Name and symbol of the non fungible token, as defined in ERC721.
    string public name = "CryptoHills";
    string public symbol = "CH";

    // bool public implementsERC721 = true;
    //
    function implementsERC721() public pure returns (bool)
    {
        return true;
    }

    // Internal utility functions: These functions all assume that their input arguments
    // are valid. We leave it to public methods to sanitize their inputs and follow
    // the required logic.

    /// @dev Checks if a given address is the current owner of a particular Hill.
    /// @param _claimant the address we are validating against.
    /// @param _tokenId hill id, only valid when > 0
    function _owns(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return hillIndexToOwner[_tokenId] == _claimant;
    }

    /// @dev Checks if a given address currently has transferApproval for a particular Hill.
    /// @param _claimant the address we are confirming hill is approved for.
    /// @param _tokenId hill id, only valid when > 0
    function _approvedFor(address _claimant, uint256 _tokenId) internal view returns (bool) {
        return hillIndexToApproved[_tokenId] == _claimant;
    }

    /// @dev Marks an address as being approved for transferFrom(), overwriting any previous
    ///  approval. Setting _approved to address(0) clears all transfer approval.
    function _approve(uint256 _tokenId, address _approved) internal {
        hillIndexToApproved[_tokenId] = _approved;
    }

    /// @dev Transfers a hill owned by this contract to the specified address.
    ///  Used to rescue lost hill. (There is no "proper" flow where this contract
    ///  should be the owner of any Hill. This function exists for us to reassign
    ///  the ownership of Hills that users may have accidentally sent to our address.)
    /// @param _hillId - ID of hill
    /// @param _recipient - Address to send the hill to
    function rescueLostHill(uint256 _hillId, address _recipient) public onlyCOO whenNotPaused {
        require(_owns(this, _hillId));
        _transfer(this, _recipient, _hillId);
    }

    /// @notice Returns the number of Hills owned by a specific address.
    /// @param _owner The owner address to check.
    /// @dev Required for ERC-721 compliance
    function balanceOf(address _owner) public view returns (uint256 count) {
        return ownershipTokenCount[_owner];
    }

    /// @notice Transfers a Hill to another address. If transferring to a smart
    ///  contract be VERY CAREFUL to ensure that it is aware of ERC-721 (or
    ///  CryptoHills specifically) or your Hill may be lost forever. Seriously.
    /// @param _to The address of the recipient, can be a user or contract.
    /// @param _tokenId The ID of the Hill to transfer.
    /// @dev Required for ERC-721 compliance.
    function transfer(
        address _to,
        uint256 _tokenId
    )
        public
        whenNotPaused
    {
        // Safety check to prevent against an unexpected 0x0 default.
        require(_to != address(0));
        // You can only send your own cat.
        require(_owns(msg.sender, _tokenId));

        // Reassign ownership, clear pending approvals, emit Transfer event.
        _transfer(msg.sender, _to, _tokenId);
    }

    /// @notice Grant another address the right to transfer a specific Hill via
    ///  transferFrom(). This is the preferred flow for transfering NFTs to contracts.
    /// @param _to The address to be granted transfer approval. Pass address(0) to
    ///  clear all approvals.
    /// @param _tokenId The ID of the Hill that can be transferred if this call succeeds.
    /// @dev Required for ERC-721 compliance.
    function approve(
        address _to,
        uint256 _tokenId
    )
        public
        whenNotPaused
    {
        // Only an owner can grant transfer approval.
        require(_owns(msg.sender, _tokenId));

        // Register the approval (replacing any previous approval).
        _approve(_tokenId, _to);

        // Emit approval event.
        Approval(msg.sender, _to, _tokenId);
    }

    /// @notice Transfer a Hill owned by another address, for which the calling address
    ///  has previously been granted transfer approval by the owner.
    /// @param _from The address that owns the Hill to be transfered.
    /// @param _to The address that should take ownership of the Hill. Can be any address,
    ///  including the caller.
    /// @param _tokenId The ID of the Hill to be transferred.
    /// @dev Required for ERC-721 compliance.
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    )
        public
        whenNotPaused
    {
        // Check for approval and valid ownership
        require(_approvedFor(msg.sender, _tokenId));
        require(_owns(_from, _tokenId));

        // Reassign ownership (also clears pending approvals and emits Transfer event).
        _transfer(_from, _to, _tokenId);
    }

    /// @notice Returns the total number of Hills currently in existence.
    /// @dev Required for ERC-721 compliance.
    function totalSupply() public view returns (uint) {
        return hills.length - 1;
    }

    /// @notice Returns the address currently assigned ownership of a given Hill.
    /// @dev Required for ERC-721 compliance.
    function ownerOf(uint256 _tokenId)
        public
        view
        returns (address owner)
    {
        owner = hillIndexToOwner[_tokenId];

        require(owner != address(0));
    }

    /// @notice Returns the nth Hill assigned to an address, with n specified by the
    ///  _index argument.
    /// @param _owner The owner whose Hills we are interested in.
    /// @param _index The zero-based index of the hill within the owner's list of hills.
    ///  Must be less than balanceOf(_owner).
    /// @dev This method MUST NEVER be called by smart contract code. It will almost
    ///  certainly blow past the block gas limit once there are a large number of
    ///  Hills in existence. Exists only to allow off-chain queries of ownership.
    ///  Optional method for ERC-721.
    function tokensOfOwnerByIndex(address _owner, uint256 _index)
        external
        view
        returns (uint256 tokenId)
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (hillIndexToOwner[i] == _owner) {
                if (count == _index) {
                    return i;
                } else {
                    count++;
                }
            }
        }
        revert();
    }
}
