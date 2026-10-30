/* Realistic dummy data */
const SERVICES = [
  { id: 'walk', name: 'Walking Companion', price: 249, category: 'elderly', desc: 'A friendly CARE Fellow walks with you in your neighbourhood, at your own pace.' },
  { id: 'grocery', name: 'Grocery Assistance', price: 249, category: 'elderly', desc: 'Your CARE Fellow shops for fruits, vegetables and daily needs and brings them home.' },
  { id: 'cook', name: 'Cooking Assistance', price: 249, category: 'elderly', desc: 'Help in the kitchen to prepare fresh, healthy home-style meals safely.' },
  { id: 'doctor', name: 'Doctor Appointment Assistance', price: 249, category: 'elderly', desc: 'A CARE Fellow accompanies you to the clinic, helps with forms and notes the doctor\'s advice.' },
  { id: 'house', name: 'Household Assistance', price: 249, category: 'elderly', desc: 'Support with light cleaning, arranging, laundry and small household tasks.' },
  { id: 'company', name: 'Elderly Companionship', price: 249, category: 'elderly', desc: 'Good conversation, board games, reading together or a cup of tea with a caring companion.' },
  { id: 'childcare', name: 'Flexible Childcare', price: 299, category: 'childcare', desc: 'Hourly and scheduled childcare, backup support when regular help is unavailable, after-school accompaniment.' }
];

const GROUPS = [
  { id: 'g-walk', name: 'Morning Walking Group', area: 'Indiranagar', time: '7:00 AM', members: 12, desc: 'A cheerful group that walks together in the park every morning.' },
  { id: 'g-yoga', name: 'Yoga Friends', area: 'Koramangala', time: '6:30 AM', members: 8, desc: 'Gentle yoga and breathing exercises suitable for all ages and abilities.' },
  { id: 'g-chess', name: 'Chess and Games Club', area: 'HSR Layout', time: '4:00 PM', members: 10, desc: 'Chess, carrom and cards over evening snacks and good company.' },
  { id: 'g-music', name: 'Music Lovers Group', area: 'Whitefield', time: '5:00 PM', members: 15, desc: 'Sing along to your favourite old songs and enjoy music with neighbours.' }
];

const EVENTS = [
  { id: 'e-diwali', name: 'Diwali Celebration', date: '5 November 2026', venue: 'CARE Hub, Indiranagar', desc: 'Light lamps, enjoy sweets and celebrate the festival of lights with neighbours.' },
  { id: 'e-music', name: 'Music and Memories', date: '8 November 2026', venue: 'CARE Hub, HSR', desc: 'An afternoon of golden-era songs, stories and shared memories.' },
  { id: 'e-art', name: 'Art and Creativity Workshop', date: '12 November 2026', venue: 'CARE Hub, Whitefield', desc: 'Try painting and simple crafts. All materials provided, no experience needed.' },
  { id: 'e-yoga', name: 'Morning Yoga Session', date: '15 November 2026', venue: 'CARE Hub, Koramangala', desc: 'A calm, guided yoga session followed by herbal tea.' }
];

const FELLOWS = ['Ramesh K.', 'Anita S.', 'Suresh M.', 'Kavitha R.', 'Meena P.', 'Arjun D.'];

const SEED_BOOKINGS = [
  { id: 'CARE-1001', service: 'Walking Companion (2 hrs)', date: '2 November 2026', time: '7:00 AM', fellow: 'Ramesh K.', status: 'Confirmed' },
  { id: 'CARE-1002', service: 'Grocery Assistance (2 hrs)', date: '3 November 2026', time: '10:00 AM', fellow: 'Anita S.', status: 'Completed' },
  { id: 'CARE-1003', service: 'Doctor Appointment Assistance (2 hrs)', date: '5 November 2026', time: '11:00 AM', fellow: 'Suresh M.', status: 'Upcoming' },
  { id: 'CARE-1004', service: 'Household Assistance (2 hrs)', date: '28 October 2026', time: '4:00 PM', fellow: 'Kavitha R.', status: 'Cancelled' }
];

const HUBS = [
  { area: 'HSR Layout', address: 'CARE Hub, Sector 2, HSR Layout, Bengaluru' },
  { area: 'Koramangala', address: 'CARE Hub, 80 Feet Road, Koramangala, Bengaluru' },
  { area: 'Bellandur', address: 'CARE Hub, Bellandur, Bengaluru' },
  { area: 'Indiranagar', address: 'CARE Hub, 100 Feet Road, Indiranagar, Bengaluru' },
  { area: 'Whitefield', address: 'CARE Hub, ITPL Main Road, Whitefield, Bengaluru' }
];

const CONTACT = { phone: '+91 80000 00000', tel: '+918000000000', email: 'hello@care-hub.com', wa: 'https://wa.me/918000000000' };

/* Service prices above are PER HOUR. Customers choose HOURS_RANGE hours per visit. */
const HOURS_RANGE = { min: 2, max: 4 };

/* Subscription plans: edit price / hrs (check-ins per month) here to change the offer */
const PLANS = [
  { id: 'silver', name: 'Silver', price: 999, hrs: 1, perks: ['1 scheduled 1-hour elderly check-in per month', 'Family update after each check-in', 'Priority booking'] },
  { id: 'gold', name: 'Gold', price: 2499, hrs: 2, perks: ['2 scheduled 1-hour elderly check-ins per month', 'Family update after each check-in', 'Priority booking'] },
  { id: 'platinum', name: 'Platinum', price: 4999, hrs: 4, perks: ['4 scheduled 1-hour elderly check-ins per month', 'Named care coordinator', 'Monthly family review', 'Priority booking'] }
];
