require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Migrate existing users: rename lis.profile → lis.segment, map Occasional → Explorer
  const segmentMap = { Premium: 'Premium', Selective: 'Selective', Occasional: 'Explorer', Explorer: 'Explorer' };

  const users = await User.find({ role: 'customer' });
  let migrated = 0;

  for (const user of users) {
    const oldProfile = user.lis?.profile;
    const newSegment = segmentMap[oldProfile] || 'Explorer';

    await User.findByIdAndUpdate(user._id, {
      $set: {
        'lis.segment': newSegment,
        'lira.esScore': 0,
        'lira.pfScore': 0,
        'lira.pfLabel': 'Rare',
        'lira.cviScore': 0,
        'lira.cviSegment': 'low_priority',
        'lira.bonusBuffer': 0,
        'lira.lastUpdated': new Date(),
      },
      $unset: {
        'lis.profile': '',
        'lis.behavioralScore': '',
      },
    });
    migrated++;
  }

  console.log(`Migrated ${migrated} customer users`);

  // 2. Ensure indexes on new collections
  const Event = require('../models/Event');
  const ScoreSnapshot = require('../models/ScoreSnapshot');
  const BonusLog = require('../models/BonusLog');

  await Event.createIndexes();
  await ScoreSnapshot.createIndexes();
  await BonusLog.createIndexes();
  console.log('Indexes created for Event, ScoreSnapshot, BonusLog');

  await mongoose.disconnect();
  console.log('Migration complete.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
