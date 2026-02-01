const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get user ID from command line argument
const USER_ID = process.argv[2];

async function main() {
  if (!USER_ID) {
    console.log('❌ Please provide a user ID as argument');
    console.log('Usage: npm run seed <user_id>');
    console.log('Example: npm run seed abc123-def456-ghi789');
    process.exit(1);
  }

  console.log('🌱 Starting database seed...');
  console.log(`📝 Adding trips for user: ${USER_ID}`);

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: USER_ID }
  });

  if (!user) {
    console.log('❌ User not found with ID:', USER_ID);
    process.exit(1);
  }

  console.log('✅ Found user:', user.email);

  // Create two demo trips
  const trip1 = await prisma.trip.create({
    data: {
      user_id: USER_ID,
      destination: 'Paris, France',
      start_date: new Date('2026-02-10'),
      end_date: new Date('2026-02-17'),
      booking_id: 'RM-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'upcoming',
    },
  });

  console.log('✅ Created trip 1:', trip1.destination);

  const trip2 = await prisma.trip.create({
    data: {
      user_id: USER_ID,
      destination: 'Tokyo, Japan',
      start_date: new Date('2026-03-15'),
      end_date: new Date('2026-03-25'),
      booking_id: 'RM-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'planning',
    },
  });

  console.log('✅ Created trip 2:', trip2.destination);

  // Create destination data for Paris
  await prisma.destination.upsert({
    where: { name: 'Paris' },
    update: {},
    create: {
      name: 'Paris',
      highlights: [
        'Eiffel Tower',
        'Louvre Museum',
        'Notre-Dame Cathedral',
        'Champs-Élysées',
        'Montmartre',
      ],
      local_tips: [
        'Most cafes include service charge - no need to tip extra',
        'Metro is the fastest way to get around',
        'Many museums are free on first Sunday of month',
        'Learn basic French greetings - locals appreciate it',
      ],
      emergency_contacts: {
        police: '17',
        ambulance: '15',
        fire: '18',
        embassy_us: '+33 1 43 12 22 22',
        embassy_india: '+33 1 40 50 70 70',
      },
      vr_assets: [],
    },
  });

  console.log('✅ Created Paris destination data');

  // Create destination data for Tokyo
  await prisma.destination.upsert({
    where: { name: 'Tokyo' },
    update: {},
    create: {
      name: 'Tokyo',
      highlights: [
        'Senso-ji Temple',
        'Shibuya Crossing',
        'Tokyo Skytree',
        'Meiji Shrine',
        'Tsukiji Fish Market',
      ],
      local_tips: [
        'Get a Suica/Pasmo card for easy transit',
        'No tipping culture in Japan',
        'Remove shoes before entering homes and some restaurants',
        'Convenience stores (konbini) are excellent for quick meals',
      ],
      emergency_contacts: {
        police: '110',
        ambulance: '119',
        fire: '119',
        embassy_us: '+81 3 3224 5000',
        embassy_india: '+81 3 3262 2391',
      },
      vr_assets: [],
    },
  });

  console.log('✅ Created Tokyo destination data');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log(`   Added 2 trips for user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
