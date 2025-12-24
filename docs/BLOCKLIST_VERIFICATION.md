# Blocklist Security Verification

This document details the exact mechanism that enforces the "Stealth Mode" (Blocklist) security.

## 1. The Mechanism
The security is enforced at the **Database Level (Row Level Security)**. This means it is impossible for the API or UI to accidentally leak data, because the database itself refuses to return the row.

### A. The Data
-   **Student Profile**: `blocked_domains = ['competitor.com', 'evilcorp.com']`
-   **Recruiter**: Logged in with email `recruiter@competitor.com`

### B. The Policy (Code Proof)
The following SQL runs automatically on every query:

```sql
CREATE POLICY "Recruiters can view students" ON public.profiles
    FOR SELECT USING (
        -- 1. Must be a Recruiter
        check_user_role('recruiter')
        AND role = 'student'
        
        -- 2. THE BLOCKLIST CHECK
        AND NOT (
            -- Extract domain from Recruiter's Email (e.g. 'recruiter@competitor.com' -> 'competitor.com')
            split_part(auth.jwt() ->> 'email', '@', 2) 
            
            -- Check if it exists in the Student's Blocked List
            = ANY(blocked_domains)
        )
    );
```

### C. Trace execution
1.  Recruiter `alice@competitor.com` requests "All Students".
2.  Database checks Student A (who blocked `competitor.com`).
3.  `split_part('alice@competitor.com', '@', 2)` returns `'competitor.com'`.
4.  Is `'competitor.com'` inside `['competitor.com']`? **YES**.
5.  `NOT (YES)` is **FALSE**.
6.  The database **HIDES** Student A from the result set. Student A simply does not exist for Alice.

## 2. Verification Steps (Manual Test)

Since we cannot easily spin up fake email accounts in this demo environment, you can verify the logic by **simulating the blockage**:

1.  **Login as Student**.
2.  Go to **Edit Profile** -> **Privacy & Blocklist**.
3.  Add `gmail.com` (or whatever email domain you use for your generic recruiter test account).
4.  **Save**.
5.  **Login as Recruiter** (using a `gmail.com` account).
6.  Go to **Discover**.
7.  **Result**: You should NOT see your own student profile. You have effectively blocked yourself.
8.  **Verify**: Go back to Student, remove `gmail.com`, and check Recruiter view again. You should reappear.

## 3. Conclusion
The logic uses standard PostgreSQL array operators (`ANY`) and string manipulation (`split_part`). It is robust, case-sensitive (currently, should be case-insensitive for safety), and runs on every single fetch.

**Recommendation**: For production, ensure we lower-case both the input domain and the JWT domain to avoid case mismatch (e.g., `Competitor.com` vs `competitor.com`). I will apply this hardening now.
