// Run with: node fix-link.js
// Place this in your server's root folder (wherever your models/ folder
// lives), so the require paths below resolve correctly.

require('dotenv').config();
const mongoose = require('mongoose');
const HolidayHomePage = require('./models/HolidayHome'); // adjust path if needed
const Apartment = require('./models/Apartment'); // adjust path if needed

const PAGE_ID = '6a41958298cbc3b66c07c8fb';
const APARTMENT_ID = '6a41957898cbc3b66c07c8f7';

async function run() {
  await mongoose.connect(process.env.MONGOURL || process.env.MONGODB_URI);
  console.log('Connected to database.');

  const apartment = await Apartment.findById(APARTMENT_ID);
  if (!apartment) {
    console.error(`No apartment found with ID ${APARTMENT_ID} — stopping, nothing was changed.`);
    await mongoose.disconnect();
    return;
  }
  console.log('Found apartment:', apartment.title);

  const updated = await HolidayHomePage.findByIdAndUpdate(
    PAGE_ID,
    { $addToSet: { 'listingsSection.apartments': APARTMENT_ID } },
    { new: true }
  ).populate('listingsSection.apartments');

  if (!updated) {
    console.error(`No HolidayHomePage found with ID ${PAGE_ID} — check this ID is correct.`);
  } else {
    console.log('Updated page. Linked apartments now:', updated.listingsSection.apartments);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script failed:', err);
  mongoose.disconnect();
});