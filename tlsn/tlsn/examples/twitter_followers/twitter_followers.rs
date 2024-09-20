use std::{str, time::Duration};

use elliptic_curve::pkcs8::DecodePublicKey;

use tlsn_core::proof::{SessionProof, TlsProof};

/// A simple verifier which reads a proof generated by `simple_prover.rs` from "proof.json", verifies
/// it and prints the verified data to the console.

// This needs to be done differently for when we do verification on Cartesi!
fn import_proof_file(filepath: &str) -> Result<TlsProof, Box<dyn std::error::Error>> {
   // Deserialize the proof
    let auth_proof = std::fs::read_to_string(filepath).unwrap();
    let auth_proof: TlsProof = serde_json::from_str(auth_proof.as_str()).unwrap();

    Ok(auth_proof)
}

fn read_verify_proof(filepath: &str) -> Result<(), Box<dyn std::error::Error>> {
    let TlsProof {
        // The session proof establishes the identity of the server and the commitments
        // to the TLS transcript.
        session,
        // The substrings proof proves select portions of the transcript, while redacting
        // anything the Prover chose not to disclose.
        substrings,
    } = import_proof_file(filepath).unwrap();

    // Verify the session proof against the Notary's public key
    //
    // This verifies the identity of the server using a default certificate verifier which trusts
    // the root certificates from the `webpki-roots` crate.
    session
        .verify_with_default_cert_verifier(notary_pubkey())?;

    let SessionProof {
        // The session header that was signed by the Notary is a succinct commitment to the TLS transcript.
        header,
        // This is the session_info, which contains the server_name, that is checked against the
        // certificate chain shared in the TLS handshake.
        session_info,
        ..
    } = session;

    // The time at which the session was recorded
    let time = chrono::DateTime::UNIX_EPOCH + Duration::from_secs(header.time());

    // Verify the substrings proof against the session header.
    //
    // This returns the redacted transcripts
    let (mut sent, mut recv) = substrings.verify(&header)?;

    // Replace the bytes which the Prover chose not to disclose with 'X'
    sent.set_redacted(b'X');
    recv.set_redacted(b'X');

    dbg!("-------------------------------------------------------------------");
    dbg!(
        "Successfully verified that the bytes below came from a session with {:?} at {}.",
        session_info.server_name, time
    );
    dbg!("Note that the bytes which the Prover chose not to disclose are shown as X.");
    dbg!();
    dbg!("Bytes sent:");
    dbg!();
    dbg!("{}", String::from_utf8(sent.data().to_vec()).unwrap());
    dbg!();
    dbg!("Bytes received:");
    dbg!();
    dbg!("{}", String::from_utf8(recv.data().to_vec()).unwrap());
    dbg!("-------------------------------------------------------------------");

    // Ok(recv)
    Ok(())
}


fn main() {
    let auth_str: &str = "../../proof/auth_proof.json";
    let verify_proof = read_verify_proof(auth_str);

    // needs profile proof as well. Will add in a later commit.
    
}

/// Returns a Notary pubkey trusted by this Verifier
fn notary_pubkey() -> p256::PublicKey {
    let pem_file = str::from_utf8(include_bytes!(
        "../../../keys/public_notary.pub"
    ))
    .unwrap();
    p256::PublicKey::from_public_key_pem(pem_file).unwrap()
}