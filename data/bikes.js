// VOLTERRA — Clean local inventory data
// No backend, no Firebase, no API — local JS only
// Image paths only — add real files in assets/images/bikes/ yourself

const bikes = [
{
id: 1,
brand: "Trek",
model: "Allant+ 7",
category: "Commuter",
price: 2490,
year: 2023,
mileage: 1840,
battery: "625 Wh",
motor: "Bosch Performance Line CX",
frameSize: "L",
condition: "Excellent",
color: "Black",
description: "One-owner commuter in excellent condition. Serviced regularly and used mainly for city commuting. Battery holds full range.",
features: [
"Hydraulic disc brakes",
"Integrated LED lights",
"Bosch Kiox display",
"Rear rack with MIK system",
"Fenders and kickstand"
],
images: [
"assets/images/bikes/bike-01-1.jpg",
"assets/images/bikes/bike-01-2.jpg",
"assets/images/bikes/bike-01-3.jpg"
],
status: "available"
},
{
id: 2,
brand: "VOLTERRA",
model: "Urban 20",
category: "City",
price: 2790,
year: 2024,
mileage: 790,
battery: "710 Wh",
motor: "Specialized 2.2 90Nm",
frameSize: "M",
condition: "Excellent",
color: "White",
description: "Almost new city e-bike with low mileage. Silent motor and powerful 710Wh battery. Perfect for daily rides up to 60km.",
features: [
"MasterMind TCD display",
"Garmin radar ready",
"Integrated lights",
"Suspension fork"
],
images: [
"assets/images/bikes/bike-02-1.jpg",
"assets/images/bikes/bike-02-2.jpg",
"assets/images/bikes/bike-02-3.jpg",
"assets/images/bikes/bike-02-4.jpg"
],
status: "available"
},
{
id: 3,
brand: "VOLTERRA",
model: "Moped X",
category: "Moped",
price: 2190,
year: 2022,
mileage: 3250,
battery: "625 Wh",
motor: "Bosch Performance Line",
frameSize: "L",
condition: "Very Good",
color: "Grey",
description: "Well-maintained trekking e-bike ideal for long tours. Frame in very good condition with minor signs of use. New chain and brake pads.",
features: [
"Bosch Intuvia display",
"Shimano Deore 10-speed",
"Hydraulic brakes",
"Full mudguards and lights"
],
images: [
"assets/images/bikes/bike-03-1.jpg",
"assets/images/bikes/bike-03-2.jpg",
"assets/images/bikes/bike-03-3.jpg"
],
status: "available"
},
{
id: 4,
brand: "VOLTERRA",
model: "Fat 20",
category: "Fat Tire",
price: 1890,
year: 2023,
mileage: 2100,
battery: "500 Wh",
motor: "Giant SyncDrive Core",
frameSize: "M",
condition: "Very Good",
color: "Blue",
description: "Comfortable trekking e-bike with upright position. Great for leisure rides and light trails. Battery health 92%.",
features: [
"Suspension fork 63mm",
"Hydraulic disc brakes",
"Integrated battery",
"Rear rack"
],
images: [
"assets/images/bikes/bike-04-1.jpg",
"assets/images/bikes/bike-04-2.jpg"
],
status: "reserved"
},
{
id: 5,
brand: "VOLTERRA",
model: "Trail Fat",
category: "Mountain",
price: 3290,
year: 2023,
mileage: 980,
battery: "750 Wh",
motor: "Bosch Performance Line CX",
frameSize: "L",
condition: "Excellent",
color: "Orange",
description: "Full-suspension e-MTB with low mileage. Trail-ready with 140mm travel and 750Wh battery for long days in the mountains.",
features: [
"Full suspension 140mm",
"Shimano Deore 12-speed",
"Dropper post",
"Tubeless ready wheels"
],
images: [
"assets/images/bikes/bike-05-1.jpg",
"assets/images/bikes/bike-05-2.jpg",
"assets/images/bikes/bike-05-3.jpg",
"assets/images/bikes/bike-05-4.jpg"
],
status: "available"
},
{
id: 6,
brand: "VOLTERRA",
model: "Street Fat",
category: "Commuter",
price: 1490,
year: 2022,
mileage: 2850,
battery: "500 Wh",
motor: "Bosch Active Line Plus",
frameSize: "M",
condition: "Good",
color: "Silver",
description: "Affordable city e-bike with practical equipment. Some cosmetic wear but technically sound. Ideal as an entry-level commuter.",
features: [
"Bosch Purion display",
"Nexus 7-speed hub",
"Hydraulic brakes",
"Comfort saddle"
],
images: [
"assets/images/bikes/bike-06-1.jpg",
"assets/images/bikes/bike-06-2.jpg",
"assets/images/bikes/bike-06-3.jpg"
],
status: "available"
},
{
id: 7,
brand: "VOLTERRA",
model: "Trail Pro",
category: "Mountain",
price: 2590,
year: 2024,
mileage: 620,
battery: "750 Wh",
motor: "Bosch Performance Line CX Smart",
frameSize: "M",
condition: "Excellent",
color: "Black",
description: "Like-new trekking bike from 2024 with only 620km. Smart System with Kiox 300 and 750Wh battery. Still under warranty.",
features: [
"Bosch Smart System",
"Kiox 300 display",
"Shimano Deore XT",
"Air suspension fork"
],
images: [
"assets/images/bikes/bike-07-1.jpg",
"assets/images/bikes/bike-07-2.jpg",
"assets/images/bikes/bike-07-3.jpg"
],
status: "available"
},
{
id: 8,
brand: "VOLTERRA",
model: "Fold X",
category: "Folding",
price: 2890,
year: 2024,
mileage: 450,
battery: "540 Wh",
motor: "Shimano EP8",
frameSize: "S",
condition: "Excellent",
color: "Green",
description: "Lightweight city e-bike weighing only 17kg. Minimal design with integrated battery and belt drive. Perfect for urban living.",
features: [
"Carbon fork",
"Gates belt drive",
"Shimano Alfine 8",
"Integrated lights"
],
images: [
"assets/images/bikes/bike-08-1.jpg",
"assets/images/bikes/bike-08-2.jpg",
"assets/images/bikes/bike-08-3.jpg"
],
status: "available"
},
{
id: 9,
brand: "VOLTERRA",
model: "Fold Step",
category: "Folding",
price: 3590,
year: 2023,
mileage: 1320,
battery: "750 Wh",
motor: "Bosch Performance CX",
frameSize: "M",
condition: "Very Good",
color: "Red",
description: "Enduro e-MTB in very good condition. Carbon frame, 140mm travel and powerful motor. Ready for aggressive trails.",
features: [
"Carbon main frame",
"Fox 34 Float fork",
"4-piston brakes",
"Bosch Kiox display"
],
images: [
"assets/images/bikes/bike-09-1.jpg",
"assets/images/bikes/bike-09-2.jpg",
"assets/images/bikes/bike-09-3.jpg"
],
status: "available"
},
{
id: 10,
brand: "VOLTERRA",
model: "City Step",
category: "City",
price: 1790,
year: 2022,
mileage: 3980,
battery: "500 Wh",
motor: "Giant SyncDrive Sport",
frameSize: "L",
condition: "Good",
color: "Grey",
description: "Fast commuter e-bike with 28mph support. Higher mileage but fully serviced. Great value for daily commuting.",
features: [
"45 km/h support",
"Hydraulic brakes",
"Integrated lights",
"Rear rack"
],
images: [
"assets/images/bikes/bike-10-1.jpg",
"assets/images/bikes/bike-10-2.jpg"
],
status: "sold"
},
{
id: 11,
brand: "VOLTERRA",
model: "Compact Fat",
category: "Fat Tire",
price: 2390,
year: 2023,
mileage: 1650,
battery: "625 Wh",
motor: "Bosch Performance CX",
frameSize: "M",
condition: "Very Good",
color: "Black",
description: "Hardtail e-MTB for trail and commute. Strong motor, solid components and well-kept frame. Battery health 90%.",
features: [
"Hardtail alloy frame",
"RockShox fork 120mm",
"Shimano Deore 12-speed",
"Tubeless tires"
],
images: [
"assets/images/bikes/bike-11-1.jpg",
"assets/images/bikes/bike-11-2.jpg",
"assets/images/bikes/bike-11-3.jpg"
],
status: "available"
},
{
id: 12,
brand: "VOLTERRA",
model: "Step City",
category: "City",
price: 1990,
year: 2022,
mileage: 2240,
battery: "530 Wh",
motor: "Specialized 2.0E",
frameSize: "S",
condition: "Good",
color: "Beige",
description: "Comfort-oriented city e-bike with low step-through frame. Relaxed riding position and wide tires for extra comfort.",
features: [
"Low step frame",
"Comfort saddle",
"Integrated lights",
"Fenders and rack"
],
images: [
"assets/images/bikes/bike-12-1.jpg",
"assets/images/bikes/bike-12-2.jpg",
"assets/images/bikes/bike-12-3.jpg"
],
status: "available"
}
];

// Compatibility for existing scripts that expect BIKES or window.bikes
const BIKES = bikes;
if (typeof window !== 'undefined') {
window.bikes = bikes;
window.BIKES = bikes;
}
