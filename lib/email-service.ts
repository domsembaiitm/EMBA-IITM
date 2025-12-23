
// Simulated Email Service
// In a real application, this would use Resend, SendGrid, or AWS SES
export async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
    console.log(`
    ================================================
    [EMAIL SERVICE SIMULATION]
    To: ${to}
    Subject: ${subject}
    ------------------------------------------------
    ${body}
    ================================================
    `)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return { success: true, messageId: 'simulated-' + Date.now() }
}

export async function sendRecruiterNotification(studentEmail: string, studentName: string, recruiterName: string, company: string, intent: string, message: string) {
    const subject = `[EMBA Talent] New ${intent} Interest from ${company}`
    const body = `
    Hi ${studentName},

    Good news! You have caught the attention of ${recruiterName} from ${company}.

    Intent: ${intent}
    Message:
    "${message}"

    Please log in to the platform to view their full profile and respond.

    Best,
    The EMBA Talent Team
    `
    return sendEmail({ to: studentEmail, subject, body })
}
