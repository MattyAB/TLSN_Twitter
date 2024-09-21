// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProofObj {
    struct DirectionalItem {
        string kind;
        Range[] ranges;
        string direction;
        Blake3 blake3;
    }

    struct Range {
        uint256 start;
        uint256 end;
    }

    struct Blake3 {
        bytes data;
        bytes nonce;
    }

    struct HandshakeDecommitment {
        bytes nonce;
        Data data;
    }

    struct Data {
        ServerCertDetails serverCertDetails;
        ServerKxDetails serverKxDetails;
        bytes clientRandom;
        bytes serverRandom;
    }

    struct ServerCertDetails {
        bytes[] certChain;
        bytes[] ocspResponse;
        bytes scts;
    }

    struct ServerKxDetails {
        bytes kxParams;
        KxSig kxSig;
    }

    struct KxSig {
        string scheme;
        bytes sig;
    }

    struct HandshakeSummary {
        uint256 time;
        ServerPublicKey serverPublicKey;
        bytes handshakeCommitment;
    }

    struct ServerPublicKey {
        string group;
        bytes key;
    }

    struct Header {
        bytes encoderSeed;
        bytes merkleRoot;
        uint256 sentLen;
        uint256 recvLen;
        HandshakeSummary handshakeSummary;
    }

    struct SessionInfo {
        ServerName serverName;
        HandshakeDecommitment handshakeDecommitment;
    }

    struct Session {
        Header header;
        string signature;
        SessionInfo sessionInfo;
    }

    struct Substrings {
        DirectionalItem[] openings;
        InclusionProof inclusionProof;
    }

    struct InclusionProof {
        bytes[] proof;
        uint256 totalLeaves;
    }

    struct Root {
        Session session;
        Substrings substrings;
        string notaryUrl;
    }

    struct ServerName {
        string dns;
    }
}
