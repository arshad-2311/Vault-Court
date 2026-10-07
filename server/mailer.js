/**
 * VAULT 147 — AUTOMATED EMAIL DISPATCH SERVICE VIA RESEND
 * Dispatches session passes to Customers and real-time operational alerts to Managers.
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getResendClient() {
  const key = process.env.RESEND_API_KEY || '';
  return key ? new Resend(key) : null;
}

const VENUE_DETAILS = {
  name: 'VAULT 147',
  address: 'Mannarsamy 6/1, Somu Nagar, Royapuram, Chennai, Tamil Nadu 600013',
  phone: '088259 75491',
  whatsapp: '918825975491',
  hours: '10:00 AM – 12:00 AM Open Daily',
  mapsUrl: 'https://maps.app.goo.gl/rN38rF2Q24eN3K7W8'
};

const UNIT_LABELS = {
  'snooker-01': 'Championship Snooker Table 01',
  'snooker-02': 'Championship Snooker Table 02',
  'snooker-03': 'Championship Snooker Table 03',
  'ps5-station-01': 'PlayStation 5 Station 01 (EA FC 25 / DualSense)',
  'ps5-station-02': 'PlayStation 5 Station 02 (Combat Arena)',
  'ps5-station-03': 'PlayStation 5 Station 03 (Squad Lounge)',
  'ps5-station-04': 'PlayStation 5 Station 04 (Dual Duel)'
};

/**
 * Generates the Customer Session Pass Email HTML
 */
function buildCustomerEmailHtml(booking) {
  const unitName = UNIT_LABELS[booking.unitId] || booking.unitId;

  const paymentBadge = '<span style="display:inline-block;padding:4px 10px;background:#3b2d13;color:#fbbf24;border:1px solid #78350f;border-radius:4px;font-family:monospace;font-size:12px;font-weight:bold;">PAY AT COUNTER (DUE ON ARRIVAL)</span>';

  const paymentNotice = `<div style="background:#1e1a12;border-left:4px solid #f59e0b;padding:12px 16px;margin:20px 0;border-radius:4px;">
        <strong style="color:#fbbf24;font-size:14px;">Pay at Counter Instructions:</strong>
        <p style="color:#d1d5db;margin:6px 0 0 0;font-size:13px;line-height:1.5;">
          Your slot is strictly reserved and held for you. Please present this pass or your Booking ID (<strong>${booking.bookingId}</strong>) at the front desk upon arrival and settle <strong>₹${booking.amount}</strong> via Cash or UPI.
        </p>
      </div>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your VAULT 147 Session Pass</title>
  </head>
  <body style="margin:0;padding:0;background-color:#050507;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#050507;padding:30px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:580px;background-color:#0f0f13;border:1px solid #27272a;border-radius:12px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.8);">
            
            <!-- HEADER -->
            <tr>
              <td style="padding:28px 30px;background-color:#14141b;border-bottom:1px solid #27272a;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="font-family:monospace;font-size:11px;color:#dc2626;letter-spacing:2px;font-weight:bold;">[SESSION CONFIRMED]</span>
                      <h1 style="margin:6px 0 0 0;font-size:24px;font-weight:800;letter-spacing:1px;color:#ffffff;">VAULT 147</h1>
                      <div style="font-size:12px;color:#a1a1aa;margin-top:2px;">CHAMPIONSHIP SNOOKER & PLAYSTATION 5 DESTINATION</div>
                    </td>
                    <td align="right" valign="top">
                      <span style="display:inline-block;padding:6px 12px;background:#1e1416;color:#ef4444;border:1px solid #7f1d1d;border-radius:6px;font-family:monospace;font-size:14px;font-weight:bold;letter-spacing:1px;">
                        ${booking.bookingId}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- BODY CONTENT -->
            <tr>
              <td style="padding:30px;">
                <p style="margin:0 0 16px 0;font-size:16px;color:#ffffff;">
                  Hello <strong>${booking.customerName}</strong>,
                </p>
                <p style="margin:0 0 24px 0;font-size:14px;color:#a1a1aa;line-height:1.6;">
                  Your gaming session at <strong>VAULT 147</strong> has been reserved. Please find your official digital session pass details below.
                </p>

                <!-- TICKET SUMMARY GRID -->
                <table width="100%" cellspacing="0" cellpadding="10" style="background:#16161f;border:1px solid #27272a;border-radius:8px;margin-bottom:20px;">
                  <tr>
                    <td width="35%" style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">UNIT</td>
                    <td width="65%" style="color:#ffffff;font-size:14px;font-weight:bold;border-bottom:1px solid #22222d;">${unitName}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">DATE</td>
                    <td style="color:#ffffff;font-size:14px;font-weight:bold;border-bottom:1px solid #22222d;">${booking.date}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">TIME INTERVAL</td>
                    <td style="color:#ffffff;font-size:14px;font-weight:bold;border-bottom:1px solid #22222d;">${booking.startTime} — ${booking.endTime}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">DURATION</td>
                    <td style="color:#ffffff;font-size:14px;font-weight:bold;border-bottom:1px solid #22222d;">${booking.durationHours} Hour(s)</td>
                  </tr>
                  ${booking.playerCount && booking.unitId.startsWith('ps5') ? `
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">PLAYERS</td>
                    <td style="color:#ffffff;font-size:14px;font-weight:bold;border-bottom:1px solid #22222d;">${booking.playerCount} Player(s)</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;border-bottom:1px solid #22222d;">TOTAL TARIFF</td>
                    <td style="color:#ef4444;font-size:18px;font-weight:800;border-bottom:1px solid #22222d;">₹${booking.amount}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;font-family:monospace;font-size:11px;">PAYMENT STATUS</td>
                    <td>${paymentBadge}</td>
                  </tr>
                </table>

                ${paymentNotice}

                <!-- VENUE LOCATION CARD -->
                <div style="background:#14141b;border:1px solid #27272a;border-radius:8px;padding:20px;margin-top:24px;">
                  <div style="font-family:monospace;font-size:11px;color:#dc2626;font-weight:bold;margin-bottom:8px;">[DESTINATION LOCATION]</div>
                  <div style="font-size:14px;font-weight:bold;color:#ffffff;margin-bottom:4px;">VAULT 147 Arena</div>
                  <div style="font-size:13px;color:#a1a1aa;line-height:1.5;margin-bottom:12px;">
                    ${VENUE_DETAILS.address}
                  </div>
                  <div style="font-size:12px;color:#71717a;margin-bottom:16px;">
                    Open Daily: <strong>${VENUE_DETAILS.hours}</strong> · Phone: <strong>${VENUE_DETAILS.phone}</strong>
                  </div>
                  <a href="${VENUE_DETAILS.mapsUrl}" target="_blank" style="display:inline-block;background:#dc2626;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;padding:10px 18px;border-radius:6px;">
                    OPEN GOOGLE MAPS DIRECTIONS &rarr;
                  </a>
                </div>

                <!-- WHATSAPP SUPPORT -->
                <div style="text-align:center;margin-top:24px;">
                  <a href="https://wa.me/${VENUE_DETAILS.whatsapp}?text=Hi%20Vault%20147%2C%20regarding%20my%20booking%20${booking.bookingId}" style="color:#22c55e;text-decoration:none;font-size:13px;font-family:monospace;">
                    💬 Need assistance? Contact us on WhatsApp (${VENUE_DETAILS.phone})
                  </a>
                </div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background-color:#09090d;padding:20px;text-align:center;border-top:1px solid #27272a;font-family:monospace;font-size:11px;color:#71717a;">
                © 2026 VAULT 147 · ROYAPURAM, CHENNAI · ALL RIGHTS RESERVED
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Generates the Manager Operational Alert Email HTML
 */
function buildManagerAlertEmailHtml(booking) {
  const unitName = UNIT_LABELS[booking.unitId] || booking.unitId;

  const actionBox = `<div style="background:#2b200b;border:1px solid #d97706;padding:14px 18px;border-radius:6px;margin:20px 0;">
        <div style="color:#fbbf24;font-weight:bold;font-size:14px;margin-bottom:4px;">⚠️ COUNTER PAYMENT REQUIRED:</div>
        <div style="color:#fde68a;font-size:13px;line-height:1.4;">
          The guest will pay <strong>₹${booking.amount}</strong> at the counter upon arrival. Please collect payment via Cash or UPI before allocating the table/station.
        </div>
      </div>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>🚨 NEW BOOKING ALERT: ${booking.bookingId}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#09090c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:25px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:580px;background-color:#121217;border:1px solid #2e2e38;border-radius:10px;overflow:hidden;">
            
            <tr style="background:#1a1012;border-bottom:2px solid #dc2626;">
              <td style="padding:20px 24px;">
                <span style="font-family:monospace;font-size:12px;color:#ef4444;font-weight:bold;letter-spacing:1px;">[MANAGER DISPATCH NOTIFICATION]</span>
                <h2 style="margin:6px 0 0 0;font-size:20px;color:#ffffff;">NEW BOOKING CONFIRMED</h2>
                <div style="font-size:12px;color:#a1a1aa;margin-top:2px;">Pass ID: <strong>${booking.bookingId}</strong></div>
              </td>
            </tr>

            <tr>
              <td style="padding:24px;">
                ${actionBox}

                <h3 style="font-size:14px;font-family:monospace;color:#a1a1aa;margin:0 0 12px 0;letter-spacing:1px;">[CUSTOMER DETAILS]</h3>
                <table width="100%" cellspacing="0" cellpadding="8" style="background:#171720;border-radius:6px;margin-bottom:20px;font-size:13px;">
                  <tr>
                    <td width="30%" style="color:#71717a;">NAME:</td>
                    <td width="70%" style="color:#ffffff;font-weight:bold;">${booking.customerName}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">PHONE:</td>
                    <td style="color:#ffffff;">
                      <a href="tel:${booking.customerPhone}" style="color:#38bdf8;text-decoration:none;font-weight:bold;">${booking.customerPhone}</a>
                      &nbsp;·&nbsp;
                      <a href="https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}" style="color:#4ade80;text-decoration:none;">WhatsApp</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">EMAIL:</td>
                    <td style="color:#ffffff;">${booking.customerEmail || 'Not provided'}</td>
                  </tr>
                  ${booking.notes ? `
                  <tr>
                    <td style="color:#71717a;">NOTES:</td>
                    <td style="color:#fde047;font-style:italic;">"${booking.notes}"</td>
                  </tr>
                  ` : ''}
                </table>

                <h3 style="font-size:14px;font-family:monospace;color:#a1a1aa;margin:0 0 12px 0;letter-spacing:1px;">[SLOT ALLOCATION]</h3>
                <table width="100%" cellspacing="0" cellpadding="8" style="background:#171720;border-radius:6px;font-size:13px;">
                  <tr>
                    <td width="30%" style="color:#71717a;">UNIT:</td>
                    <td width="70%" style="color:#ffffff;font-weight:bold;">${unitName}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">DATE:</td>
                    <td style="color:#ffffff;font-weight:bold;">${booking.date}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">INTERVAL:</td>
                    <td style="color:#38bdf8;font-weight:bold;font-family:monospace;font-size:14px;">${booking.startTime} — ${booking.endTime}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">DURATION:</td>
                    <td style="color:#ffffff;">${booking.durationHours} Hour(s)</td>
                  </tr>
                  ${booking.playerCount && booking.unitId.startsWith('ps5') ? `
                  <tr>
                    <td style="color:#71717a;">PLAYERS:</td>
                    <td style="color:#ffffff;">${booking.playerCount} Player(s)</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="color:#71717a;">TARIFF:</td>
                    <td style="color:#ef4444;font-size:16px;font-weight:bold;">₹${booking.amount}</td>
                  </tr>
                  <tr>
                    <td style="color:#71717a;">PAYMENT METHOD:</td>
                    <td style="color:#ffffff;font-weight:bold;">${booking.paymentMethod || 'ONLINE'}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr style="background:#0c0c10;border-top:1px solid #22222c;">
              <td style="padding:15px;text-align:center;font-family:monospace;font-size:11px;color:#71717a;">
                VAULT 147 DESK ALERT · ${new Date().toISOString()}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Dispatches confirmation emails to both Customer and Manager via Resend
 * @param {Object} booking Booking details
 * @returns {Promise<Object>} Status of dispatches
 */
export async function sendBookingConfirmationEmails(booking) {
  const result = {
    customerSent: false,
    managerSent: false,
    errors: []
  };

  const customerHtml = buildCustomerEmailHtml(booking);
  const managerHtml = buildManagerAlertEmailHtml(booking);
  const unitLabel = UNIT_LABELS[booking.unitId] || booking.unitId;

  const resend = getResendClient();
  const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'VAULT 147 <onboarding@resend.dev>';
  const MANAGER_EMAIL = process.env.MANAGER_EMAIL || 'beastboy231128@gmail.com';

  // 1. Dispatch through Resend if API Key is configured
  if (resend) {
    // Send to Customer (if valid email present)
    if (booking.customerEmail && booking.customerEmail.includes('@')) {
      try {
        const customerRes = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [booking.customerEmail.trim()],
          subject: `🎟️ Your VAULT 147 Session Pass [${booking.bookingId}] — ${unitLabel}`,
          html: customerHtml
        });

        if (customerRes.error) {
          if (customerRes.error.statusCode === 403 && customerRes.error.message?.includes('testing emails')) {
            console.warn(`[Resend Notice] In test mode with onboarding@resend.dev, Resend delivers to your registered account (beastboy231128@gmail.com). Customer email "${booking.customerEmail}" was blocked by Resend unverified test domain policy.`);
          } else {
            console.warn('[Resend] Customer email error:', customerRes.error);
          }
          result.errors.push({ recipient: 'customer', error: customerRes.error });
        } else {
          console.log(`[Resend] Customer session pass dispatched live to ${booking.customerEmail} (ID: ${customerRes.data?.id})`);
          result.customerSent = true;
        }
      } catch (err) {
        console.error('[Resend] Failed to send customer email:', err.message);
        result.errors.push({ recipient: 'customer', error: err.message });
      }
    } else {
      console.log(`[Resend] No customer email provided for booking ${booking.bookingId}`);
    }

    // Send to Manager
    if (MANAGER_EMAIL && MANAGER_EMAIL.includes('@')) {
      try {
        const managerRes = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [MANAGER_EMAIL.trim()],
          subject: `🚨 [NEW BOOKING] ${unitLabel} · ${booking.date} ${booking.startTime} (${booking.bookingId})`,
          html: managerHtml
        });

        if (managerRes.error) {
          console.warn('[Resend] Manager email error:', managerRes.error);
          result.errors.push({ recipient: 'manager', error: managerRes.error });
        } else {
          console.log(`[Resend] Manager alert dispatched live to ${MANAGER_EMAIL} (ID: ${managerRes.data?.id})`);
          result.managerSent = true;
        }
      } catch (err) {
        console.error('[Resend] Failed to send manager alert:', err.message);
        result.errors.push({ recipient: 'manager', error: err.message });
      }
    }

    return result;
  }

  // 2. Fallback / Test Mode Telemetry (when RESEND_API_KEY is not yet populated)
  console.log('============================================================');
  console.log('[Resend Mailer — Test/Simulated Mode]');
  console.log(`Booking ID: ${booking.bookingId}`);
  console.log(`Target Customer Email: ${booking.customerEmail || 'None'}`);
  console.log(`Target Manager Email: ${MANAGER_EMAIL}`);
  console.log(`Unit: ${unitLabel}`);
  console.log(`Interval: ${booking.date} @ ${booking.startTime} — ${booking.endTime}`);
  console.log(`Payment: ${booking.paymentMethod} (₹${booking.amount})`);
  console.log('(To enable live delivery, set RESEND_API_KEY in your .env file)');
  console.log('============================================================');

  return {
    customerSent: Boolean(booking.customerEmail),
    managerSent: true,
    simulated: true
  };
}
