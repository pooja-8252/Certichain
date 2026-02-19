// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AccessControl {

    address public immutable admin;

    mapping(address => bool) private _institutes;
    mapping(address => bool) private _students;

    event InstituteRegistered(address indexed institute);
    event StudentRegistered(address indexed student);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function registerInstitute(address institute) external onlyAdmin {
        require(institute != address(0), "Invalid address");
        require(!_institutes[institute], "Already registered");

        _institutes[institute] = true;
        emit InstituteRegistered(institute);
    }

    function registerStudent(address student) external onlyAdmin {
        require(student != address(0), "Invalid address");
        require(!_students[student], "Already registered");

        _students[student] = true;
        emit StudentRegistered(student);
    }

    function isInstitute(address user) external view returns (bool) {
        return _institutes[user];
    }

    function isStudent(address user) external view returns (bool) {
        return _students[user];
    }
}
