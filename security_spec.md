# Security Specification

## Data Invariants
1. A user can only access their own profile and subcollections (`trades`, `journalEntries`).
2. Only verified users can write data.
3. The `userId` embedded in subcollection paths must correctly match the `request.auth.uid`.
4. `createdAt` must be `request.time` exactly upon creation, and cannot be modified.
5. `updatedAt` must be `request.time` exactly upon updates.
6. The size of arrays (if any exist) and strings must be strictly bounded to prevent Denial of Wallet.

## The "Dirty Dozen" Payloads
1. User profile creation with mismatched ID (Identity Spoofing).
2. Missing `createdAt` timestamp (Temporal Integrity).
3. Attempting to modify `createdAt` (Immutable Field).
4. Updating with an invalid type for a field (e.g. `trialStartDate` as Object instead of String).
5. Attempting to add extra unsupported fields (Shadow Field/Schema Integrity).
6. Missing `userId` in `trades` subcollection on create.
7. Attempting to read another user's `trades` list (Data Leak/Blanket Read).
8. Attempting to modify `userId` in an existing `trade`.
9. `direction` field containing a value other than `Long` or `Short`.
10. `contracts` size poisoning (sending an array or unbounded string instead of a number).
11. `notes` exceeding maximum allowed string length (Denial of Wallet).
12. Attempting to update without changing `updatedAt` to `request.time`.

## The Test Runner
See `firestore.rules.test.ts`.
