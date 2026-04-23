const cron = require('node-cron');
const User = require('../models/User');
const { recalculateAndSnapshot } = require('./ScoreCalculationService');

// Runs daily at 03:00 UTC — recalculates CVI for all customers
// Decay (ES × 0.8) is applied inside recalculateAndSnapshot when inactive ≥15 days
function startDecayJob() {
  cron.schedule('0 3 * * *', async () => {
    console.log('[DecayJob] Starting daily CVI recalculation...');
    try {
      const customers = await User.find({ role: 'customer' }).select('_id');
      let processed = 0;
      let decayed = 0;

      for (const { _id } of customers) {
        try {
          const result = await recalculateAndSnapshot(_id);
          if (result.decayApplied) decayed++;
          processed++;
        } catch (err) {
          console.error(`[DecayJob] Failed for user ${_id}:`, err.message);
        }
      }

      console.log(`[DecayJob] Done. Processed: ${processed}, Decay applied: ${decayed}`);
    } catch (err) {
      console.error('[DecayJob] Fatal error:', err.message);
    }
  });

  console.log('[DecayJob] Scheduled — runs daily at 03:00 UTC');
}

module.exports = { startDecayJob };
