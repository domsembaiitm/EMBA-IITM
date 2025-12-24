# Security Gap Analysis: Stealth Mode vs. Guest Access

There is a fundamental conflict between the **"No Recruiter Login"** requirement and the **"Blocklist Security"** feature.

## 1. The Current Reality
The database currently has two rules for viewing a profile:

1.  **Rule A (Public Access)**: "If `public_visibility` is TRUE, show to EVERYONE."
    *   *Note: This rule does NOT check the Blocklist.*
2.  **Rule B (Recruiter Access)**: "If user is a Logged-In Recruiter, show them... UNLESS they are in the Blocklist."

## 2. The Problem
Since you have confirmed **Recruiters do not login (they are Guests)**, they always fall under **Rule A**.

This means:
*   **Scenario 1: Student is Public**
    *   Result: Visible to `competitor.com`, `google.com`, and `random_hacker`.
    *   Blocklist is **BYPASSED**.
*   **Scenario 2: Student is Private**
    *   Result: Hidden from EVERYONE (because there are no logged-in recruiters to trigger Rule B).
    *   Profile is effectively **Offline**.

## 3. Conclusion
**The Blocklist feature currently does nothing.**
It is impossible to block "Current Employer" if we cannot identify who the visitor is (which requires Login).

## 4. Recommended Solutions

### Option A: accept the limitation (Ghost Mode)
Acknowledge that "Public = Public".
*   **Action**: Remove the Blocklist UI to avoid giving students false hope.
*   **Benefit**: Honest and simple.
*   **Risk**: Lose the "Stealth" value proposition.

### Option B: The "Gatekeeper" (Lightweight Auth)
Recruiters don't need a password, but they must use a **Magic Link** or **Verified Email**.
*   **Action**: Recruiters enter email -> Get a magic link -> System knows who they are -> Blocklist WORKS.
*   **Benefit**: Solves the problem, keeps high security.

### Option C: Obfuscation (The "Blur" Approach) - RECOMMENDED for No-Login
If a Guest views the profile, we **Hide the Name and Current Company** by default.
*   **Action**: Show "Senior Director at [Tech Company]".
*   **Unlock**: Guest clicks "Reveal Identity" -> Must enter work email -> We check Blocklist -> If safe, we email them the full profile link.
*   **Benefit**: Keeps profiles public but anonymous-by-default to enemies. Only "High Intent" recruiters reveal the identity.
