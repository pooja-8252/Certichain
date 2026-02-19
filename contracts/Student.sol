// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Student {

    struct StudentData {
        string name;
        string emailHash; // hashed email, never raw email
        uint256 registeredAt;
    }

    mapping(address => StudentData) private _students;

    event StudentProfileCreated(address indexed student);

    function createProfile(
        string calldata name,
        string calldata emailHash
    ) external {

        require(bytes(name).length > 0, "Name required");
        require(bytes(emailHash).length > 0, "Email hash required");
        require(_students[msg.sender].registeredAt == 0, "Already registered");

        _students[msg.sender] = StudentData({
            name: name,
            emailHash: emailHash,
            registeredAt: block.timestamp
        });

        emit StudentProfileCreated(msg.sender);
    }

    function getProfile(address student)
        external
        view
        returns (StudentData memory)
    {
        return _students[student];
    }
}
