// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Institute {

    struct InstituteData {
        string name;
        string accreditationId;
        uint256 registeredAt;
    }

    mapping(address => InstituteData) private _institutes;

    event InstituteProfileCreated(address indexed institute);

    function createProfile(
        string calldata name,
        string calldata accreditationId
    ) external {

        require(bytes(name).length > 0, "Name required");
        require(bytes(accreditationId).length > 0, "Accreditation required");
        require(_institutes[msg.sender].registeredAt == 0, "Already registered");

        _institutes[msg.sender] = InstituteData({
            name: name,
            accreditationId: accreditationId,
            registeredAt: block.timestamp
        });

        emit InstituteProfileCreated(msg.sender);
    }

    function getProfile(address institute)
        external
        view
        returns (InstituteData memory)
    {
        return _institutes[institute];
    }
}
