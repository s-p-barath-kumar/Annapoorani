import cron from 'node-cron';
import Student from '../models/Student.js';

const resetBalance = async () => {
  try {
     const result = await Student.updateMany(
    {},
    { $set: { balance: 70 } }
  );

  console.log("Matched:", result.matchedCount);
  console.log("Modified:", result.modifiedCount);
  } catch (error) {
    console.error('Balance reset failed:', error);
  }
};

cron.schedule('0 0 * * *', resetBalance, {
  timezone: 'Asia/Kolkata',
});

export default resetBalance; // optional for manual testing