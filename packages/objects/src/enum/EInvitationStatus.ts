/**
 * EInvitationStatus is the status of a CohortInvitation in relation to this particular data wallet.
 */
export enum EInvitationStatus {
  New, // The invitation is not for a cohort that we have dealt with before
  Rejected, // We have previously rejected an invitation to join this cohort
  Accepted, // We have already opted in to this cohort
}
