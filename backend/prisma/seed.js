const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function futureDate(monthOffset = 1, day = 15, hour = 10) {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    day,
    hour,
    0,
    0
  );
}

async function clearExisting() {

  console.log("Deleting old demo data...");
  await prisma.hotel.deleteMany({});
  await prisma.destination.deleteMany({});

}

function makeFlight(origin, destination, airline, number, depart, arrive, price) {

  return {
    Response: {
      TraceId: `mock-${origin}-${destination}-${Date.now()}`,
      Results: [
        [
          {
            ResultIndex: `${origin}-${destination}-${number}`,
            Airline: airline,
            FlightNumber: number,
            Origin: origin,
            Destination: destination,
            DepartureTime: depart.toISOString(),
            ArrivalTime: arrive.toISOString(),
            Duration: `${Math.floor((arrive - depart) / 3600000)}h`,
            Fare: {
              Currency: "USD",
              PublishedFare: price,
              BaseFare: Math.round(price * 0.85),
              Taxes: Math.round(price * 0.15)
            },
            Segments: [
              {
                Origin: origin,
                Destination: destination,
                Airline: airline,
                FlightNumber: number,
                DepartureTime: depart.toISOString(),
                ArrivalTime: arrive.toISOString(),
                Cabin: "Economy"
              }
            ]
          }
        ]
      ]
    }
  };

}

async function seedDestination(data) {

  console.log("Seeding destination:", data.name);

  await prisma.destination.create({
    data: {
      name: data.name,
      highlights: data.highlights,
      // store as an array of destination VR assets
      vr_assets: data.destinationVR
    }
  });

  for (let i = 1; i <= 5; i++) {

    await prisma.hotel.create({

      data: {

        name: `${data.name} Grand Hotel ${i}`,

        area: "City Center",

        destination: data.name,

        priceRange: `$${150 + i * 40}`,

        rating: 4 + i * 0.1,

        // store hotel's VR assets as an array
        vr_assets: data.hotelVR || []

      }

    });

  }

  // Flight inventory seeding removed (flights subsystem deprecated)

}

async function main() {

  await clearExisting();

  await seedDestination({

    name: "Paris",

    code: "CDG",

    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Seine River"
    ],

    destinationVR: [
      {
        id: "paris-d1",
        name: "Eiffel Tower 360",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=60"
      }
    ],

    hotelVR: [
      {
        id: "paris-h1",
        name: "Luxury Paris Hotel",
        type: "kuula",
        embed_url:
          "https://kuula.co/share/hzjcg?fs=1&vr=0&sd=1",
        thumbnail:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60"
      }
    ]

  });

  await seedDestination({

    name: "Dubai",

    code: "DXB",

    highlights: [
      "Burj Khalifa",
      "Desert Safari"
    ],

    destinationVR: [
      {
        id: "dubai-d1",
        name: "Dubai Skyline",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=400&q=60"
      }
    ],

    hotelVR: [
      {
        id: "dubai-h1",
        name: "Dubai Luxury Room",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=60"
      }
    ]

  });

  await seedDestination({

    name: "Tokyo",

    code: "HND",

    highlights: [
      "Shibuya Crossing",
      "Tokyo Tower"
    ],

    destinationVR: [
      {
        id: "tokyo-d1",
        name: "Tokyo Temple",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=400&q=60"
      }
    ],

    hotelVR: [
      {
        id: "tokyo-h1",
        name: "Tokyo Hotel Room",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=400&q=60"
      }
    ]

  });

  await seedDestination({

    name: "New York",

    code: "JFK",

    highlights: [
      "Times Square",
      "Statue of Liberty"
    ],

    destinationVR: [
      {
        id: "ny-d1",
        name: "NY Skyline",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=60"
      }
    ],

    hotelVR: [
      {
        id: "ny-h1",
        name: "NY Luxury Suite",
        type: "image",
        panorama:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1920&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=60"
      }
    ]

  });

  console.log("Demo data seeded successfully");

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());