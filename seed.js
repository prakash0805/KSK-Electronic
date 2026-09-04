require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Review = require('./models/Review');

const services = [
  { icon: 'ic-power', title: 'TV Not Turning On' },
  { icon: 'ic-picture', title: 'No Display / Picture Problem' },
  { icon: 'ic-flicker', title: 'Screen Flickering Issue' },
  { icon: 'ic-lines', title: 'Screen Lines Issue' },
  { icon: 'ic-wifi', title: 'No Signal / Wi-Fi Problem' },
  { icon: 'ic-hdmi', title: 'HDMI / USB Problem' },
  { icon: 'ic-remote', title: 'Remote Control Issue' },
  { icon: 'ic-backlight', title: 'Backlight Bleeding' },
  { icon: 'ic-half', title: 'Half Screen Issue' },
  { icon: 'ic-net', title: 'Internet Connectivity' },
  { icon: 'ic-blur', title: 'Blur Screen Issue' },
  { icon: 'ic-chip', title: 'Chip Level Repair' },
  { icon: 'ic-software', title: 'Software & Firmware' },
  { icon: 'ic-glass', title: 'Toughened Glass Install' },
  { icon: 'ic-spot', title: 'White / Black Spot Issue' },
  { icon: 'ic-home', title: 'Home Visit Service' },
].map((s, i) => ({ ...s, order: i }));

const reviews = [
  { name: 'Arun Kumar', rating: 5, text: 'Fixed my LED TV backlight issue same day, right at home. Fair pricing.' },
  { name: 'Priya S', rating: 5, text: 'Very honest diagnosis — told me exactly what was wrong before charging anything.' },
  { name: 'Mohamed Rafi', rating: 4, text: 'Good service, technician was on time and explained the repair clearly.' },
];

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ksk_electronics';
  await mongoose.connect(uri);
  console.log('Connected. Seeding...');

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`✔ Inserted ${services.length} services`);

  await Review.deleteMany({});
  await Review.insertMany(reviews);
  console.log(`✔ Inserted ${reviews.length} reviews`);

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
