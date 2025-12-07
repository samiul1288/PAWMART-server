import mongoose from "mongoose";
import "dotenv/config";
import Listing from "./models/Listing.js";
import Order from "./models/Order.js";

const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}


const listings = [
  {
    name: "Golden Retriever Puppy",
    category: "Pets",
    price: 0,
    location: "Dhaka",
    description: "Friendly 2-month-old puppy available for adoption.",
    image:
      "https://t4.ftcdn.net/jpg/02/90/84/47/360_F_290844781_V4hoIL3E291xvY5nEL7NCaWIoCIQxHfI.jpg",
    email: "owner1@gmail.com",
    date: "2025-11-18",
  },
  {
    name: "Persian Kitten",
    category: "Pets",
    price: 0,
    location: "Chattogram",
    description: "Healthy Persian kitten, litter trained, loving home needed.",
    image:
      "https://t3.ftcdn.net/jpg/02/26/62/36/360_F_226623621_xozMQnRsIDwxZXZgP6Xiitjbl4aSod5b.webp",
    email: "owner2@gmail.com",
    date: "2025-11-19",
  },
  {
    name: "Parakeet Pair",
    category: "Pets",
    price: 0,
    location: "Sylhet",
    description: "Bonded pair, includes small cage and starter feed.",
    image:
      "https://t3.ftcdn.net/jpg/02/72/18/34/240_F_272183464_RJ61DSfq3oSZ65aq9bkSg14vPzQsfCaw.jpg",
    email: "owner3@gmail.com",
    date: "2025-11-15",
  },
  {
    name: "Rescue Street Cat",
    category: "Pets",
    price: 0,
    location: "Rajshahi",
    description: "Vaccinated, very calm and affectionate. Adoption only.",
    image:
      "https://media.istockphoto.com/id/605757050/photo/small-kitten-into-the-hands-of-the-physician.jpg?s=612x612&w=0&k=20&c=1yyS1VlshpkmK0zDG7mg0rat8GUeqXv9NCVL82jAcJY=",
    email: "owner4@gmail.com",
    date: "2025-11-16",
  },
  {
    name: "Rabbit (Dutch)",
    category: "Pets",
    price: 0,
    location: "Khulna",
    description: "Gentle rabbit, beginner friendly. Adoption only.",
    image:
      "https://media.istockphoto.com/id/153016104/photo/dutch-rabbit.jpg?s=612x612&w=0&k=20&c=e2ifVCt7q25kZow0VYA5O_UcedH-bWqOSCGBHY6Wc2A=",
    email: "owner5@gmail.com",
    date: "2025-11-17",
  },
  {
    name: "Premium Dog Kibble 10kg",
    category: "Food",
    price: 35,
    location: "Dhaka",
    description: "Grain-free, high protein kibble for adult dogs.",
    image:
      "https://supertails.com/cdn/shop/files/CanineCreekClubLowGrain20_10KG.png?v=1748024511",
    email: "shop1@gmail.com",
    date: "2025-11-14",
  },
  {
    name: "Cat Scratching Post",
    category: "Accessories",
    price: 18,
    location: "Chattogram",
    description: "Sturdy post to keep claws healthy and protect furniture.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoCvQFSqvTj5uXbddyF_sdm77LhcQWPQBzw&s",
    email: "shop7@gmail.com",
    date: "2025-11-06",
  },
  {
    name: "Dog Shampoo (Hypoallergenic)",
    category: "Care Products",
    price: 9,
    location: "Dhaka",
    description: "Gentle formula, reduces itching and dryness.",
    image: "https://m.media-amazon.com/images/I/91YoSTiYXML.jpg",
    email: "shop11@gmail.com",
    date: "2025-11-02",
  },
  {
    name: "Rabbit Pellets 2kg",
    category: "Food",
    price: 10,
    location: "Rajshahi",
    description: "High-fiber pellets, supports digestive health.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTDqAHTMnGy6Yv-5SJauRTkA18Ruqqk-3HTw&s",
    email: "shop4@gmail.com",
    date: "2025-11-09",
  },
  {
    name: "Aquarium Plant Set",
    category: "Accessories",
    price: 12,
    location: "Khulna",
    description: "Plastic plant set for 60–100L tanks.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROe4bGvqRh9TdmdeEQ9GSCnsc6WpvxRHiIoS6GAp_9gkjfHpB3a5_3whQiIR6DeEUEaMM&usqp=CAU",
    email: "shop10@gmail.com",
    date: "2025-11-03",
  },
  {
    name: "Cat Litter 10L",
    category: "Care Products",
    price: 11,
    location: "Chattogram",
    description: "Clumping litter with odor control.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHOjagLBKS0Dt4c9ZjYiUPJniQYGl7RAyW9Q&s",
    email: "shop12@gmail.com",
    date: "2025-11-01",
  },
  {
    name: "Bird Cage (Medium)",
    category: "Accessories",
    price: 40,
    location: "Sylhet",
    description: "Includes perch and feeder bowls, easy-clean tray.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZqIxgiBQNPKYJLOksYLa2W6Aif-Ep_NQRUg&s",
    email: "shop8@gmail.com",
    date: "2025-11-05",
  },
  {
    name: "Rabbit Hutch (Outdoor)",
    category: "Accessories",
    price: 75,
    location: "Rajshahi",
    description: "Weather-resistant wood, two compartments, secure latch.",
    image:
      "https://media.diy.com/is/image/KingfisherDigital/pawhut-rabbit-hutch-outdoor-bunny-cage-w-run-removable-tray-120-x-55-5-x-80cm~5056602932848_01c_MP?$MOB_PREV$&$width=1200&$height=1200",
    email: "shop9@gmail.com",
    date: "2025-11-04",
  },
  {
    name: "Parrot Seed Mix 3kg",
    category: "Food",
    price: 14,
    location: "Sylhet",
    description: "Vitamin-enriched seed mix for parrots and parakeets.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRhH-PFbgJ7vxvD_HTbe3oSKbZLJy7mAgLiw&s",
    email: "shop3@gmail.com",
    date: "2025-11-10",
  },
  {
    name: "Fish Flakes 500g",
    category: "Food",
    price: 8,
    location: "Khulna",
    description: "Suitable for most tropical fish, enhances color.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8S2IRI3QOGe1MXVzVPjWsGhrXqN6NJl1gDg&s",
    email: "shop5@gmail.com",
    date: "2025-11-08",
  },
];
const rawOrders = [
  
  {
    productName: "Premium Dog Kibble 10kg",
    buyerName: "Rafiul Islam",
    email: "buyer1@gmail.com",
    quantity: 1,
    price: 35,
    address: "Dhaka",
    phone: "01710000001",
    date: "2025-11-18",
    additionalNotes: "Leave at security desk",
  },
  {
    productName: "Cat Scratching Post",
    buyerName: "Nusrat Jahan",
    email: "buyer2@gmail.com",
    quantity: 1,
    price: 18,
    address: "Chattogram",
    phone: "01710000002",
    date: "2025-11-18",
    additionalNotes: "Call before delivery",
  },
  {
    productName: "Dog Shampoo (Hypoallergenic)",
    buyerName: "Tanvir Ahmed",
    email: "buyer3@gmail.com",
    quantity: 2,
    price: 18,
    address: "Sylhet",
    phone: "01710000003",
    date: "2025-11-19",
    additionalNotes: "Gift wrap please",
  },
  {
    productName: "Rabbit Pellets 2kg",
    buyerName: "Sabiha Rahman",
    email: "buyer4@gmail.com",
    quantity: 3,
    price: 10,
    address: "Rajshahi",
    phone: "01710000004",
    date: "2025-11-20",
    additionalNotes: "Deliver morning",
  },
  {
    productName: "Aquarium Plant Set",
    buyerName: "Imran Kabir",
    email: "buyer5@gmail.com",
    quantity: 1,
    price: 12,
    address: "Khulna",
    phone: "01710000005",
    date: "2025-11-21",
    additionalNotes: "No plastic bag",
  },
  {
    productName: "Cat Litter 10L",
    buyerName: "Farhan Alam",
    email: "buyer6@gmail.com",
    quantity: 2,
    price: 11,
    address: "Dhaka",
    phone: "01710000006",
    date: "2025-11-22",
    additionalNotes: "Ring bell once",
  },
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    console.log("🔄 Clearing existing data...");
    await Listing.deleteMany({});
    await Order.deleteMany({});

    console.log("📥 Inserting listings...");
    const insertedListings = await Listing.insertMany(listings);
    console.log(`✅ Listings inserted: ${insertedListings.length}`);

    // 🔗 Create a map of productName → listing._id
    const listingMap = {};
    for (const listing of insertedListings) {
      listingMap[listing.name] = listing._id;
    }

    console.log("🔗 Linking orders to listings...");
    const linkedOrders = rawOrders.map((order) => {
      const listingId = listingMap[order.productName];
      return {
        userId: "seed-user", // 🔧 Replace with actual Firebase UID if needed
        items: [
          {
            listingId,
            qty: order.quantity,
            price: order.price,
          },
        ],
        total: order.price * order.quantity,
        status: "pending",
        createdAt: new Date(order.date),
        buyerName: order.buyerName,
        email: order.email,
        address: order.address,
        phone: order.phone,
        additionalNotes: order.additionalNotes,
      };
    });

    console.log("📥 Inserting orders...");
    const insertedOrders = await Order.insertMany(linkedOrders);
    console.log(`✅ Orders inserted: ${insertedOrders.length}`);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🏁 Seed finished.");
  }
}

run();
