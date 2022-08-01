/**
 * EInvitationStatus is the status of a Invitation in relation to this particular data wallet.
 */
export enum EInvitationStatus {
  New, // The invitation is not for a cohort that we have dealt with before
  Rejected, // We have previously rejected an invitation to join this cohort
  Accepted, // We have already opted in to this cohort
  Invalid, // The invitation is invalid- either the DNS info or the contract info doesn't match.
}
