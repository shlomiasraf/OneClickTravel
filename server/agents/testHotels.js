import dotenv from "dotenv";
dotenv.config();

import { LodgingAgent } from "./lodgingAgent.js";

const agent = new LodgingAgent();

const test = async () => {
    const hotels = await agent.findOptions({
        destination: "LON",
        startDate: "2025-04-20",
        endDate: "2025-04-23",
        numPeople: 2
      });

  if (!hotels || hotels.length === 0) {
    console.log("❌ No hotels found.");
    return;
  }

  console.log(`🏨 Found ${hotels.length} hotels:\n`);

  hotels.slice(0, 5).forEach((hotel, i) => {
    const name = hotel.hotel?.name || "Unnamed Hotel";
    const address = hotel.hotel?.address?.lines?.[0] || "No address";
    const price = hotel.offers?.[0]?.price?.total || "N/A";
    const currency = hotel.offers?.[0]?.price?.currency || "USD";
    const checkIn = hotel.offers?.[0]?.checkInDate;
    const checkOut = hotel.offers?.[0]?.checkOutDate;

    console.log(`🏨 Option ${i + 1}: ${name}`);
    console.log(`   📍 ${address}`);
    console.log(`   💰 $${price} ${currency}`);
    console.log(`   📅 ${checkIn} → ${checkOut}`);
    console.log("––––––––––––––––––––––––––––––\n");
  });
};

test();
