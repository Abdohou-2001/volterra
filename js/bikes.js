// VOLTERRA mock inventory — extended for details page (images[], description)
const BIKES = [
  {
    id:1, brand:"Specialized", model:"Turbo Vado 4.0", year:2024, price:2399, originalPrice:2799, mileage:1240, battery:710, batteryLabel:"710Wh", frameSize:"M", condition:"Excellent", conditionTag:"Excellent Condition",
    image:"assets/images/bikes/bike-01.jpg",
    fallback:"https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Specialized 2.2 - 90Nm", batteryHealth:92,
    description:"City flagship with silent 2.2 motor and 710Wh internal battery. One owner, commuter use, full service history. New chain, brake pads at 80%, display flawless. Perfect for 30-60km daily commutes with MasterMind TCD.",
    features:["MasterMind TCD display","Garmin Radar ready","Integrated lights","MIK rack system"]
  },
  {
    id:2, brand:"Riese & Müller", model:"Charger3 GT", year:2023, price:3190, mileage:2180, battery:625, batteryLabel:"625Wh x2", frameSize:"L", condition:"Great", conditionTag:"Great Condition",
    image:"assets/images/bikes/bike-02.jpg",
    fallback:"https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch Performance CX Gen4", batteryHealth:88,
    description:"DualBattery tourer built for long distance. 2180km, touring use, always stored indoors. Enviolo + Gates belt, no wear on drivetrain. Two 625Wh PowerTubes tested at 88% combined health.",
    features:["DualBattery 1250Wh","Enviolo + Belt","Fox Float","GX option"]
  },
  {
    id:3, brand:"Cowboy", model:"Cruiser ST", year:2024, price:1850, mileage:890, battery:360, batteryLabel:"360Wh", frameSize:"M", condition:"Excellent", conditionTag:"Excellent Condition",
    image:"assets/images/bikes/bike-03.jpg",
    fallback:"https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504144904754-13d7dedc10a1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e90?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Cowboy 250W - 45Nm", batteryHealth:94,
    description:"Step-through minimal e-bike, 890km, city use only. App connectivity, adaptive power, theft detection still active. Immaculate frame, tires like new. Ideal for light riders up to 100kg.",
    features:["AdaptivePower","Theft detection","AirTag hidden","27kg"]
  },
  {
    id:4, brand:"VanMoof", model:"S5 — Rebuilt", year:2023, price:1640, mileage:3100, battery:487, batteryLabel:"487Wh", frameSize:"M", condition:"Great", conditionTag:"Great Condition",
    image:"assets/images/bikes/bike-04.jpg",
    fallback:"https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504144904754-13d7dedc10a1?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"VanMoof Gen5 68Nm", batteryHealth:86,
    description:"VOLTERRA rebuilt S5: new e-shifter, new controller, battery tested at 86%. Original issues resolved. Our workshop warranty 6 months included. Strong value for connected city riding.",
    features:["Rebuilt controller","New e-shifter","Kick Lock","Find My"]
  },
  {
    id:5, brand:"Canyon", model:"Pathlite:ON 5", year:2023, price:2250, mileage:1560, battery:625, batteryLabel:"625Wh", frameSize:"L", condition:"Excellent", conditionTag:"Excellent Condition",
    image:"assets/images/bikes/bike-05.jpg",
    fallback:"https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch CX 85Nm", batteryHealth:90,
    description:"SUV e-bike, comfortable geometry, trail-capable. One owner, gravel path use. 90% battery, suspension serviced, new grips. Ready for mixed surface commute.",
    features:["100mm Suntour","Bosch Kiox","Integrated lights","Gravel tires"]
  },
  {
    id:6, brand:"Stromer", model:"ST2 Pinion", year:2022, price:3450, mileage:4200, battery:983, batteryLabel:"983Wh", frameSize:"L", condition:"Good", conditionTag:"Good Condition",
    image:"assets/images/bikes/bike-06.jpg",
    fallback:"https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Stromer CYRO 40Nm + Pinion C1.9", batteryHealth:84,
    description:"Speed pedelec 45km/h with massive 983Wh battery. 4200km highway commute. Pinion gearbox, belt drive. Cosmetic wear on crank, technical perfect. Great range still ~150km.",
    features:["45km/h","Pinion 9-speed","Belt drive","OMNI Connect"]
  },
  {
    id:7, brand:"Moustache", model:"Lundi 27.3", year:2024, price:2690, mileage:720, battery:500, batteryLabel:"500Wh", frameSize:"S", condition:"Excellent", conditionTag:"Excellent Condition",
    image:"assets/images/bikes/bike-07.jpg",
    fallback:"https://images.unsplash.com/photo-1485968579580-b6d095142e90?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1485968579580-b6d095142e90?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch Active Line Plus", batteryHealth:95,
    description:"French comfort icon, low step, 720km only. Like new, garage kept. 500Wh PowerTube, Intuvia display. Perfect for comfortable city rides and shopping trips.",
    features:["Low step 42cm","Comfort saddle","Double kickstand","Moustache frame bag"]
  },
  {
    id:8, brand:"Tern", model:"GSD S10", year:2022, price:3890, mileage:1850, battery:1000, batteryLabel:"500Wh x2", frameSize:"One Size", condition:"Great", conditionTag:"Great Condition",
    image:"assets/images/bikes/bike-08.jpg",
    fallback:"https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch Cargo Line 85Nm", batteryHealth:89,
    description:"Cargo king with dual battery, 1850km family use. Carries 2 kids + cargo. Deore 1x10, heavy duty rack rated 200kg. Battery 89%, motor strong. Full workshop check done.",
    features:["200kg capacity","DualBattery","Clubhouse ready","Cargo Line"]
  },
  {
    id:9, brand:"Specialized", model:"Turbo Como 4.0", year:2023, price:2150, mileage:1320, battery:710, batteryLabel:"710Wh", frameSize:"S", condition:"Great", conditionTag:"Great Condition",
    image:"assets/images/bikes/bike-09.jpg",
    fallback:"https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e90?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Specialized 2.0 E 70Nm", batteryHealth:91,
    description:"Low-step comfort e-bike, 1320km, relaxed riding. Wide tires, upright position, 710Wh for long rides without range anxiety. Small frame, ideal 155-168cm.",
    features:["Low step","Comfort geometry","710Wh","Integrated lights"]
  },
  {
    id:10, brand:"Riese & Müller", model:"Multicharger GT", year:2024, price:4750, mileage:560, battery:1250, batteryLabel:"625Wh x2", frameSize:"M", condition:"Excellent", conditionTag:"Like New",
    image:"assets/images/bikes/bike-10.jpg",
    fallback:"https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch CX + 625x2", batteryHealth:97,
    description:"Almost new Multicharger GT, 560km demo bike from R&M partner. Dual battery, GT touring kit, 97% health. Original receipt, full warranty transfer. Ready for family cargo.",
    features:["Demo bike","625Wh x2","GT Pack","Fox 34"]
  },
  {
    id:11, brand:"Cowboy", model:"Classic C4", year:2022, price:1290, mileage:2450, battery:360, batteryLabel:"360Wh", frameSize:"M", condition:"Good", conditionTag:"Good Condition",
    image:"assets/images/bikes/bike-11.jpg",
    fallback:"https://images.unsplash.com/photo-1504144904754-13d7dedc10a1?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1504144904754-13d7dedc10a1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Cowboy 250W", batteryHealth:82,
    description:"Affordable entry to Cowboy ecosystem. 2450km commuter, cosmetic scratches on top tube, otherwise solid. Battery 82% - still 45-55km real range. Serviced, new brake pads.",
    features:["45km range","Mudguards","Cowboy app","Lightweight"]
  },
  {
    id:12, brand:"Canyon", model:"Precede:ON CF 8", year:2024, price:2980, mileage:430, battery:750, batteryLabel:"750Wh", frameSize:"M", condition:"Excellent", conditionTag:"Excellent Condition",
    image:"assets/images/bikes/bike-12.jpg",
    fallback:"https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?q=80&w=1200&auto=format&fit=crop",
    images:[
      "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484156818044-c0402b43b4ad?q=80&w=1200&auto=format&fit=crop"
    ],
    motor:"Bosch CX 85Nm - 750Wh", batteryHealth:96,
    description:"Carbon city e-bike, 430km only, super light for e-bike. 750Wh, Kiox 300, integrated cockpit. Feels like acoustic bike with power. Perfect condition.",
    features:["Carbon frame","Kiox 300","Cockpit integrated","750Wh"]
  }
];
if(typeof window!=='undefined') window.BIKES = BIKES;
