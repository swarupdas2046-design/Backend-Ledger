import sendEmail from "../services/mail.service.js"

const escapeHtml = (value = "") => {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

const getDisplayName = (name) => {
    const normalizedName = String(name || "").trim().replace(/\s+/g, " ")
    return normalizedName || "there"
}

const emailTemplate = async(email,name)=>{
    const displayName = getDisplayName(name)
    const safeName = escapeHtml(displayName)
    const currentYear = new Date().getFullYear()

    const subject = "Welcome to Concurrent Bank"
    const text = `Hi ${displayName},

Welcome to Concurrent Bank. Your account is ready, and we are glad to have you here.

We are building a simple, secure, and reliable banking ledger experience for clean records, confident transactions, and fewer spreadsheet headaches. No confetti cannons, just a smoother way to keep money movement organized.

What you can expect next:
- Secure access to your account
- Clear account and ledger updates as features roll out
- A product built with care, consistency, and practical finance workflows in mind

Thanks for joining early. Good things are being built.

Best regards,
Concurrent Bank`

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Concurrent Bank</title>
</head>
<body style="margin:0; padding:0; background-color:#eef2f7; font-family:Arial, Helvetica, sans-serif; color:#162033;">
  <span style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    Your Concurrent Bank account is ready. Welcome aboard.
  </span>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eef2f7; margin:0; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background-color:#ffffff; border-radius:18px; overflow:hidden; border:1px solid #d9e2ef; box-shadow:0 14px 42px rgba(22,32,51,0.10);">
          <tr>
            <td style="background-color:#0f2f2e; padding:32px 32px 28px;">
              <p style="margin:0 0 10px; color:#9ee6d6; font-size:13px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                Concurrent Bank
              </p>
              <h1 style="margin:0; color:#ffffff; font-size:30px; line-height:1.2; font-weight:800;">
                Welcome, ${safeName}.
              </h1>
              <p style="margin:14px 0 0; color:#d6fff5; font-size:16px; line-height:1.65;">
                Your account is ready. We are glad to have you here at the start of something built for clarity, security, and calm financial records.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 18px; color:#273449; font-size:16px; line-height:1.75;">
                Hi ${safeName},
              </p>
              <p style="margin:0 0 18px; color:#273449; font-size:16px; line-height:1.75;">
                Thanks for creating your Concurrent Bank account. We are building a simple, secure, and reliable ledger experience for clean money movement, useful records, and fewer spreadsheet headaches.
              </p>
              <p style="margin:0 0 26px; color:#273449; font-size:16px; line-height:1.75;">
                No loud confetti cannons here, just a solid place to keep things organized and moving in the right direction.
              </p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f7fafc; border:1px solid #e2e8f0; border-radius:14px; margin:0 0 28px;">
                <tr>
                  <td style="padding:22px;">
                    <h2 style="margin:0 0 14px; color:#162033; font-size:18px; line-height:1.35;">
                      What happens next
                    </h2>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:8px 0; color:#273449; font-size:15px; line-height:1.6;">
                          <strong style="color:#0f766e;">01.</strong> Secure access to your account.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#273449; font-size:15px; line-height:1.6;">
                          <strong style="color:#0f766e;">02.</strong> Clear account and ledger updates as features roll out.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#273449; font-size:15px; line-height:1.6;">
                          <strong style="color:#0f766e;">03.</strong> Finance workflows designed to stay practical, readable, and dependable.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 6px; color:#273449; font-size:16px; line-height:1.75;">
                Thanks for joining early. Good things are being built.
              </p>
              <p style="margin:0; color:#273449; font-size:16px; line-height:1.75;">
                Best regards,<br />
                <strong>Concurrent Bank</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#f7fafc; border-top:1px solid #e2e8f0; padding:20px 32px;">
              <p style="margin:0; color:#64748b; font-size:13px; line-height:1.6;">
                This email was sent because a new account was created on Concurrent Bank.
              </p>
              <p style="margin:8px 0 0; color:#94a3b8; font-size:12px; line-height:1.6;">
                &copy; ${currentYear} Concurrent Bank. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    await sendEmail(email,subject,text,html)
}

export default emailTemplate
