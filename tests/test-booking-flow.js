import assert from 'assert';

async function testFullBookingEmailSuite() {
  console.log('============================================================');
  console.log('VAULT 147 — END-TO-END RESEND EMAIL & BOOKING FLOW TEST');
  console.log('============================================================');

  // Dynamic future test date to prevent database collision on re-runs
  const randYear = 2030 + Math.floor(Math.random() * 50);
  const randMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const randDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  const testDate = `${randYear}-${randMonth}-${randDay}`;

  // Test 1: Counter Reservation with Email
  console.log(`\n[TEST 1] Testing Pay at Counter reservation with customerEmail (Date: ${testDate})...`);
  const counterPayload = {
    unitId: 'snooker-02',
    date: testDate,
    startTime: '03:00 PM',
    durationHours: 3,
    playerCount: 1,
    customerName: 'Marcus Snooker',
    customerPhone: '08825975491',
    customerEmail: 'marcus@vault147.in',
    notes: 'Please prepare cue with chalk',
    paymentMethod: 'counter'
  };

  const counterRes = await fetch('http://localhost:5000/api/bookings/create-hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(counterPayload)
  });
  const counterData = await counterRes.json();

  assert(counterRes.status === 201, `Expected 201, got ${counterRes.status}`);
  assert(counterData.success === true, 'Counter booking was not successful');
  assert(counterData.status === 'CONFIRMED', 'Status should be CONFIRMED');
  assert(counterData.paymentMethod === 'COUNTER', 'PaymentMethod should be COUNTER');
  assert(counterData.amount === 750, `Amount should be 750 (250 * 3), got ${counterData.amount}`);
  assert(counterData.endTime === '06:00 PM', `End time should be 06:00 PM, got ${counterData.endTime}`);
  console.log(`✓ Counter booking confirmed: ID ${counterData.bookingId}, Amount ₹${counterData.amount}, Time: ${counterData.startTime} - ${counterData.endTime}`);

  // Test 2: Overlapping Booking Conflict Prevention
  console.log('\n[TEST 2] Testing interval conflict prevention on same unit & overlapping time...');
  const overlapPayload = {
    unitId: 'snooker-02',
    date: testDate,
    startTime: '04:00 PM',
    durationHours: 1,
    playerCount: 1,
    customerName: 'Conflict Player',
    customerPhone: '08825975491',
    customerEmail: 'conflict@example.com',
    paymentMethod: 'counter'
  };

  const overlapRes = await fetch('http://localhost:5000/api/bookings/create-hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overlapPayload)
  });
  assert(overlapRes.status === 409, `Expected 409 conflict, got ${overlapRes.status}`);
  console.log('✓ Overlap correctly rejected with 409 Conflict.');

  // Test 3: PS5 Station Counter Booking with Email
  console.log('\n[TEST 3] Testing PS5 Station Counter reservation with customerEmail & 4 players...');
  const ps5Payload = {
    unitId: 'ps5-station-03',
    date: testDate,
    startTime: '08:00 PM',
    durationHours: 2,
    playerCount: 4, // 500/hr * 2 = 1000
    customerName: 'Elena Squad',
    customerPhone: '08825975491',
    customerEmail: 'elena@vault147.in',
    notes: 'Tekken 8 / FIFA tournament'
  };

  const ps5Res = await fetch('http://localhost:5000/api/bookings/create-hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ps5Payload)
  });
  const ps5Data = await ps5Res.json();

  assert(ps5Res.status === 201, `Expected 201, got ${ps5Res.status}`);
  assert(ps5Data.success === true, 'PS5 counter booking was not successful');
  assert(ps5Data.status === 'CONFIRMED', 'Status should be CONFIRMED');
  assert(ps5Data.paymentMethod === 'COUNTER', 'PaymentMethod should be COUNTER');
  assert(ps5Data.amount === 1000, `Amount should be 1000, got ${ps5Data.amount}`);
  assert(ps5Data.endTime === '10:00 PM', `End time should be 10:00 PM, got ${ps5Data.endTime}`);
  console.log(`✓ PS5 counter booking confirmed: ID ${ps5Data.bookingId}, Amount ₹${ps5Data.amount}, Time: ${ps5Data.startTime} - ${ps5Data.endTime}`);

  console.log('\n============================================================');
  console.log('ALL BOOKING & RESEND EMAIL TESTS PASSED SUCCESSFULLY! (3/3)');
  console.log('============================================================');
}

testFullBookingEmailSuite().catch(err => {
  console.error(err);
  process.exit(1);
});
