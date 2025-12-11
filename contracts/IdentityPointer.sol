// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IdentityPointer
 * @dev Smart contract for storing PIP identity pointers on-chain
 * 
 * This contract stores only a hash and URI pointer to the identity JSON,
 * not the identity data itself. This keeps gas costs low while providing
 * authenticity and version verification.
 */
contract IdentityPointer {
    /**
     * @dev Struct to store identity pointer information
     */
    struct IdentityRecord {
        bytes32 identityHash;    // SHA-256 hash of the identity JSON
        string uri;               // URI where the identity JSON is hosted
        string version;           // PIP schema version (e.g., "0.1.0")
        address owner;            // Owner of the identity
        uint256 updatedAt;        // Timestamp of last update
    }

    /**
     * @dev Mapping from owner address to their identity record
     */
    mapping(address => IdentityRecord) public identities;

    /**
     * @dev Event emitted when an identity is registered or updated
     */
    event IdentityUpdated(
        address indexed owner,
        bytes32 indexed identityHash,
        string uri,
        string version,
        uint256 timestamp
    );

    /**
     * @dev Event emitted when an identity is revoked
     */
    event IdentityRevoked(
        address indexed owner,
        uint256 timestamp
    );

    /**
     * @dev Register or update an identity pointer
     * @param _identityHash SHA-256 hash of the identity JSON
     * @param _uri URI where the identity JSON is hosted
     * @param _version PIP schema version
     */
    function setIdentity(
        bytes32 _identityHash,
        string memory _uri,
        string memory _version
    ) public {
        require(_identityHash != bytes32(0), "Identity hash cannot be zero");
        require(bytes(_uri).length > 0, "URI cannot be empty");
        require(bytes(_version).length > 0, "Version cannot be empty");

        identities[msg.sender] = IdentityRecord({
            identityHash: _identityHash,
            uri: _uri,
            version: _version,
            owner: msg.sender,
            updatedAt: block.timestamp
        });

        emit IdentityUpdated(
            msg.sender,
            _identityHash,
            _uri,
            _version,
            block.timestamp
        );
    }

    /**
     * @dev Get identity pointer for an address
     * @param _owner Address of the identity owner
     * @return identityHash Hash of the identity JSON
     * @return uri URI where the identity JSON is hosted
     * @return version PIP schema version
     * @return updatedAt Timestamp of last update
     */
    function getIdentity(address _owner)
        public
        view
        returns (
            bytes32 identityHash,
            string memory uri,
            string memory version,
            uint256 updatedAt
        )
    {
        IdentityRecord memory record = identities[_owner];
        require(record.identityHash != bytes32(0), "Identity not found");
        
        return (
            record.identityHash,
            record.uri,
            record.version,
            record.updatedAt
        );
    }

    /**
     * @dev Check if an address has a registered identity
     * @param _owner Address to check
     * @return True if identity exists
     */
    function hasIdentity(address _owner) public view returns (bool) {
        return identities[_owner].identityHash != bytes32(0);
    }

    /**
     * @dev Revoke (delete) an identity pointer
     */
    function revokeIdentity() public {
        require(identities[msg.sender].identityHash != bytes32(0), "No identity to revoke");
        
        delete identities[msg.sender];
        
        emit IdentityRevoked(msg.sender, block.timestamp);
    }

    /**
     * @dev Verify that an identity hash matches the stored hash
     * @param _owner Address of the identity owner
     * @param _identityHash Hash to verify
     * @return True if hash matches
     */
    function verifyIdentityHash(address _owner, bytes32 _identityHash)
        public
        view
        returns (bool)
    {
        return identities[_owner].identityHash == _identityHash;
    }
}

