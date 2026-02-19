// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

contract Certificate {

    struct Cert {
        uint256 id;
        string ipfsHash;
        address student;
        address institute;
        bool approved;
        bool revoked;
    }

    uint256 private _certCounter;

    // mapping(uint256 => Cert) private _certificates;
    mapping(uint256 => Cert) public _certificates;
    mapping(address => uint256[]) private _studentCerts;
    mapping(address => uint256[]) private _instituteCerts;

    AccessControl public accessControl;

    event CertificateRequested(uint256 indexed id, address indexed student);
    event CertificateApproved(uint256 indexed id, address indexed institute);
    event CertificateRevoked(uint256 indexed id);
    event CertificateIssued(uint256 indexed id, address indexed student, address indexed institute);

    constructor(address accessControlAddress) {
        require(accessControlAddress != address(0), "Invalid address");
        accessControl = AccessControl(accessControlAddress);
    }

    modifier onlyStudent() {
        require(accessControl.isStudent(msg.sender), "Not student");
        _;
    }

    modifier onlyInstitute() {
        require(accessControl.isInstitute(msg.sender), "Not institute");
        _;
    }

    // ── Existing functions (unchanged) ────────────────────────────────────────

    function requestCertificate(string calldata ipfsHash)
        external
        onlyStudent
    {
        require(bytes(ipfsHash).length > 0, "Invalid IPFS");

        _certCounter++;
        _certificates[_certCounter] = Cert({
            id: _certCounter,
            ipfsHash: ipfsHash,
            student: msg.sender,
            institute: address(0),
            approved: false,
            revoked: false
        });
        _studentCerts[msg.sender].push(_certCounter);
        emit CertificateRequested(_certCounter, msg.sender);
    }

    function approveCertificate(uint256 certId)
        external
        onlyInstitute
    {
        Cert storage cert = _certificates[certId];
        require(cert.id != 0, "Invalid certificate");
        require(!cert.approved, "Already approved");
        require(!cert.revoked, "Revoked");

        cert.institute = msg.sender;
        cert.approved = true;
        _instituteCerts[msg.sender].push(certId);
        emit CertificateApproved(certId, msg.sender);
    }

    function revokeCertificate(uint256 certId)
        external
        onlyInstitute
    {
        Cert storage cert = _certificates[certId];
        require(cert.approved, "Not approved");
        require(!cert.revoked, "Already revoked");
        cert.revoked = true;
        emit CertificateRevoked(certId);
    }

    // ── NEW: Institute directly issues certificate to a student ───────────────

    function issueCertificate(address student, string memory ipfsHash)
        external
        onlyInstitute
    {
        require(student != address(0), "Invalid student address");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(accessControl.isStudent(student), "Address is not a registered student");

        _certCounter++;
        _certificates[_certCounter] = Cert({
            id:        _certCounter,
            ipfsHash:  ipfsHash,
            student:   student,
            institute: msg.sender,
            approved:  true,
            revoked:   false
        });

        _studentCerts[student].push(_certCounter);
        _instituteCerts[msg.sender].push(_certCounter);

        emit CertificateIssued(_certCounter, student, msg.sender);
    }

    // ── View functions (unchanged) ────────────────────────────────────────────

    function verifyCertificate(uint256 certId)
        external
        view
        returns (Cert memory)
    {
        Cert memory cert = _certificates[certId];
        require(cert.id != 0, "Invalid certificate");
        require(
            cert.approved &&
            (msg.sender == cert.student || msg.sender == cert.institute),
            "Not authorized or not yet approved"
        );
        return cert;
    }

    function getStudentCertificates(address student)
        external
        view
        returns (uint256[] memory)
    {
        return _studentCerts[student];
    }

    function getInstituteCertificates(address institute)
        external
        view
        returns (uint256[] memory)
    {
        return _instituteCerts[institute];
    }

    // Get any certificate by ID — no restrictions
function getCertificate(uint256 certId)
    external
    view
    returns (Cert memory)
{
    return _certificates[certId];
}

// Get total cert count so frontend can scan all certs
function getCertCount() 
    external 
    view 
    returns (uint256) 
{
    return _certCounter;
}
}