// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title E-Certify - Blockchain Certificate Management
/// @author
/// @notice Secure certificate issuance and verification system
contract ECertify {

    // ============================
    // STRUCTS
    // ============================

    struct Certificate {
        uint256 id;
        string ipfsHash;         // IPFS CID of certificate file
        address student;
        address institute;
        bool approved;
    }

    // ============================
    // STATE VARIABLES
    // ============================

    uint256 private certificateCounter;

    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public studentCertificates;
    mapping(address => uint256[]) public instituteCertificates;

    // ============================
    // EVENTS (Best Practice)
    // ============================

    event CertificateCreated(
        uint256 indexed certificateId,
        address indexed student,
        address indexed institute
    );

    event CertificateApproved(
        uint256 indexed certificateId
    );

    // ============================
    // MODIFIERS
    // ============================

    modifier onlyInstitute(uint256 certificateId) {
        require(
            certificates[certificateId].institute == msg.sender,
            "Not authorized institute"
        );
        _;
    }

    modifier onlyStudent(uint256 certificateId) {
        require(
            certificates[certificateId].student == msg.sender,
            "Not certificate owner"
        );
        _;
    }

    modifier certificateExists(uint256 certificateId) {
        require(
            certificateId > 0 && certificateId <= certificateCounter,
            "Certificate does not exist"
        );
        _;
    }

    // ============================
    // FUNCTIONS
    // ============================

    /// Student requests certificate creation
    function requestCertificate(
        string calldata ipfsHash,
        address instituteAddress
    ) external {

        require(instituteAddress != address(0), "Invalid institute address");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");

        certificateCounter++;

        certificates[certificateCounter] = Certificate({
            id: certificateCounter,
            ipfsHash: ipfsHash,
            student: msg.sender,
            institute: instituteAddress,
            approved: false
        });

        studentCertificates[msg.sender].push(certificateCounter);
        instituteCertificates[instituteAddress].push(certificateCounter);

        emit CertificateCreated(
            certificateCounter,
            msg.sender,
            instituteAddress
        );
    }

    /// Institute approves certificate
    function approveCertificate(uint256 certificateId)
        external
        certificateExists(certificateId)
        onlyInstitute(certificateId)
    {
        require(
            !certificates[certificateId].approved,
            "Already approved"
        );

        certificates[certificateId].approved = true;

        emit CertificateApproved(certificateId);
    }

    /// Public verification function
    function verifyCertificate(uint256 certificateId)
        external
        view
        certificateExists(certificateId)
        returns (
            string memory ipfsHash,
            address student,
            address institute,
            bool approved
        )
    {
        Certificate memory cert = certificates[certificateId];
        return (
            cert.ipfsHash,
            cert.student,
            cert.institute,
            cert.approved
        );
    }

    /// Get certificates of student
    function getStudentCertificates(address student)
        external
        view
        returns (uint256[] memory)
    {
        return studentCertificates[student];
    }

    /// Get certificates issued by institute
    function getInstituteCertificates(address institute)
        external
        view
        returns (uint256[] memory)
    {
        return instituteCertificates[institute];
    }
}
