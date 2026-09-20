type SellerApprovedProps = {
  username: string
  storeName: string
  dashboardUrl: string
}

export function sellerApprovedEmail({ username, storeName, dashboardUrl }: SellerApprovedProps) {
  return {
    subject: '🎉 Your NovaMarket Seller Application is Approved!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Application Approved</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); padding: 40px; text-align: center;">
              <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                🎉
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                Congratulations!
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
                Your seller application has been approved
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #111827; margin: 0 0 16px; font-size: 24px; font-weight: bold;">
                Welcome aboard, ${username}! 🚀
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Great news! Your seller application for <strong style="color: #9333ea;">${storeName}</strong> has been approved by our team.
              </p>

              <div style="background-color: #f3e8ff; border-left: 4px solid #9333ea; padding: 20px; border-radius: 8px; margin: 0 0 32px;">
                <p style="margin: 0; color: #6b21a8; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ✓ You are now a SELLER
                </p>
              </div>

              <h3 style="color: #111827; margin: 0 0 16px; font-size: 18px; font-weight: bold;">
                What can you do now?
              </h3>

              <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0 0 32px; padding-left: 20px;">
                <li>📦 List unlimited products</li>
                <li>💰 Earn money (only 5% commission)</li>
                <li>📊 Track sales with analytics</li>
                <li>🚀 Grow your business globally</li>
              </ul>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                      Go to Seller Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; margin: 32px 0 0;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  <strong>💡 Pro Tip:</strong> Start by listing 3-5 products to attract more buyers.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">
                Need help? Contact us at{' '}
                <a href="mailto:support@novamarket.com" style="color: #9333ea; text-decoration: none;">
                  support@novamarket.com
                </a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0;">
                © ${new Date().getFullYear()} NovaMarket. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

type SellerRejectedProps = {
  username: string
  storeName: string
  reason?: string
}

export function sellerRejectedEmail({ username, storeName, reason }: SellerRejectedProps) {
  return {
    subject: 'Update on your NovaMarket Seller Application',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="background-color: #6b7280; padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                Application Update
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #111827; margin: 0 0 16px; font-size: 22px;">
                Hi ${username},
              </h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Thank you for your interest in becoming a seller on NovaMarket. After reviewing your application for <strong>${storeName}</strong>, we are unable to approve it at this time.
              </p>

              ${reason ? `
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 0 0 24px;">
                <p style="margin: 0 0 8px; color: #991b1b; font-weight: 600; font-size: 14px;">Reason:</p>
                <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.6;">${reason}</p>
              </div>
              ` : ''}

              <h3 style="color: #111827; margin: 32px 0 12px; font-size: 17px; font-weight: bold;">
                What can you do next?
              </h3>
              <ul style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0 0 24px; padding-left: 20px;">
                <li>Review our seller guidelines</li>
                <li>Make sure all information is accurate</li>
                <li>Reapply after 30 days</li>
              </ul>

              <p style="color: #6b7280; font-size: 14px; margin: 24px 0 0;">
                If you believe this is a mistake, contact us at{' '}
                <a href="mailto:support@novamarket.com" style="color: #9333ea; text-decoration: none;">
                  support@novamarket.com
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} NovaMarket. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

type NewRequestAdminProps = {
  username: string
  userEmail: string
  storeName: string
  storeCategory: string
  phone: string
  address: string
  adminUrl: string
}

export function newRequestAdminEmail({
  username,
  userEmail,
  storeName,
  storeCategory,
  phone,
  address,
  adminUrl,
}: NewRequestAdminProps) {
  return {
    subject: `🔔 New Seller Request: ${storeName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
                🔔 New Seller Request
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
                A user has applied to become a seller
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Username</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px; font-weight: 600;">${username}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px;">${userEmail}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Store Name</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px; font-weight: 600;">${storeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Category</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px; text-transform: capitalize;">${storeCategory}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px;">${phone}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Address</span>
                    <p style="margin: 4px 0 0; color: #111827; font-size: 15px;">${address}</p>
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" style="margin: 32px auto 0;">
                <tr>
                  <td align="center">
                    <a href="${adminUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: bold; font-size: 15px;">
                      Review Request →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} NovaMarket Admin Notifications
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

type BannedUserProps = {
  username: string
  reason: string
}

export function bannedUserEmail({ username, reason }: BannedUserProps) {
  return {
    subject: 'Your NovaMarket Account Has Been Suspended',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background-color: #dc2626; padding: 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
                🚫 Account Suspended
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px;">
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Hi <strong>${username}</strong>,
              </p>
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
                Your NovaMarket account has been suspended due to violation of our terms of service.
              </p>

              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; margin: 0 0 24px;">
                <p style="margin: 0 0 6px; color: #991b1b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Reason:</p>
                <p style="margin: 0; color: #7f1d1d; font-size: 14px;">${reason}</p>
              </div>

              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                If you believe this is a mistake, contact{' '}
                <a href="mailto:support@novamarket.com" style="color: #9333ea;">support@novamarket.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}
