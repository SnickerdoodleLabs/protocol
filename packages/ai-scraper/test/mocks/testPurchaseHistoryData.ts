import { LLMData, LLMResponse } from "@ai-scraper/interfaces";

export const chatGPTPurchaseHistoryResponse = LLMResponse(
  '[\n    {\n        "name": "VANMASS Universal Car Phone Mount",\n        "brand": "VANMASS",\n        "price": 23.8,\n        "classification": "Electronics",\n        "keywords": ["car phone mount", "handsfree stand", "phone holder", "dashboard", "windshield", "compatible", "iPhone", "Samsung", "Android", "pickup truck"],\n        "date": "July 12, 2023"\n    },\n    {\n        "name": "Genie 7155-TKV Smart Garage Door Opener",\n        "brand": "Genie",\n        "price": 246.8,\n        "classification": "Home Improvement",\n        "keywords": ["garage door opener", "smart", "WiFi", "battery backup", "Alexa", "Google Home"],\n        "date": "July 12, 2023"\n    },\n    {\n        "name": "Flexzilla Garden Hose",\n        "brand": "Flexzilla",\n        "price": 57.99,\n        "classification": "Patio, Lawn & Garden",\n        "keywords": ["garden hose", "heavy duty", "lightweight", "drinking water safe", "ZillaGreen"],\n        "date": "July 11, 2023"\n    },\n    {\n        "name": "Homall L Shaped Gaming Desk",\n        "brand": "Homall",\n        "price": 64.94,\n        "classification": "Office Products",\n        "keywords": ["gaming desk", "computer corner desk", "PC gaming desk", "monitor riser stand", "home office", "writing workstation"],\n        "date": "July 9, 2023"\n    },\n    {\n        "name": "ASURION 3 Year Furniture Protection Plan",\n        "brand": "ASURION",\n        "price": 15.14,\n        "classification": "Home & Kitchen",\n        "keywords": ["furniture protection plan"],\n        "date": "July 9, 2023"\n    },\n    {\n        "name": "Rust-Oleum 261845 EpoxyShield Garage Floor Coating",\n        "brand": "Rust-Oleum",\n        "price": 200.25,\n        "classification": "Tools & Home Improvement",\n        "keywords": ["garage floor coating", "2 gal", "gray"],\n        "date": "July 3, 2023"\n    },\n    {\n        "name": "Bonnlo 3 Burner Outdoor Portable Propane Stove Gas Cooker",\n        "brand": "Bonnlo",\n        "price": 115.92,\n        "classification": "Sports & Outdoors",\n        "keywords": ["outdoor portable propane stove", "gas cooker", "heavy duty", "iron cast", "patio burner", "camp cooking"],\n        "date": "July 1, 2023"\n    },\n    {\n        "name": "Purrfectzone Bidet Sprayer for Toilet",\n        "brand": "Purrfectzone",\n        "price": 0,\n        "classification": "Tools & Home Improvement",\n        "keywords": ["bidet sprayer", "handheld sprayer kit", "cloth diaper sprayer set"],\n        "date": "June 27, 2023"\n    },\n    {\n        "name": "Mielle Organics Rosemary Mint Scalp & Hair Strengthening Oil",\n        "brand": "Mielle Organics",\n        "price": 9.78,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["hair strengthening oil", "biotin", "essential oils", "nourishing treatment", "split ends", "dry scalp"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Cantu Coconut Curling Cream with Shea Butter",\n        "brand": "Cantu",\n        "price": 25.64,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["coconut curling cream", "shea butter", "natural hair"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Amazon Brand - Mama Bear Organic Kids Vitamin D3 25 mcg (1000 IU) Gummies",\n        "brand": "Amazon Brand - Mama Bear",\n        "price": 25.64,\n        "classification": "Health & Household",\n        "keywords": ["organic kids vitamin D3", "bone health", "immune health", "strawberry"],\n        "date": "June 26, 2023"\n    },\n    {\n        "name": "Garnier Fructis Sleek & Shine Moroccan Sleek Smoothing Oil",\n        "brand": "Garnier Fructis",\n        "price": 25.64,\n        "classification": "Beauty & Personal Care",\n        "keywords": ["sleek & shine oil", "frizzy hair", "dry hair", "argan oil"],\n        "date": "June 26, 2023"\n    }\n]',
);

export const firstPurchase = {
  name: "VANMASS Universal Car Phone Mount",
  brand: "VANMASS",
  price: 23.8,
  classification: "Electronics",
  keywords: [
    "car phone mount",
    "handsfree stand",
    "phone holder",
    "dashboard",
    "windshield",
    "compatible",
    "iPhone",
    "Samsung",
    "Android",
    "pickup truck",
  ],
  date: "July 12, 2023",
};

export const multiplePurchasesInOneOrder = [
  {
    name: "Cantu Coconut Curling Cream with Shea Butter",
    brand: "Cantu",
    price: 25.64,
    classification: "Beauty & Personal Care",
    keywords: ["coconut curling cream", "shea butter", "natural hair"],
    date: "June 26, 2023",
  },
  {
    name: "Amazon Brand - Mama Bear Organic Kids Vitamin D3 25 mcg (1000 IU) Gummies",
    brand: "Amazon Brand - Mama Bear",
    price: 25.64,
    classification: "Health & Household",
    keywords: [
      "organic kids vitamin D3",
      "bone health",
      "immune health",
      "strawberry",
    ],
    date: "June 26, 2023",
  },
  {
    name: "Garnier Fructis Sleek & Shine Moroccan Sleek Smoothing Oil",
    brand: "Garnier Fructis",
    price: 25.64,
    classification: "Beauty & Personal Care",
    keywords: ["sleek & shine oil", "frizzy hair", "dry hair", "argan oil"],
    date: "June 26, 2023",
  },
];

export const purchaseHistoryData = LLMData(
  ` * Your Account
    * ›
    * Your Orders
   
   
   YOUR ORDERS
   
   Search Orders
    * Orders
    * Buy Again
    * Not Yet Shipped
    * Digital Orders
    * Local Store Orders
    * Amazon Pay
    * Cancelled Orders
   
   23 orders placed in last 30 days past 3 months 2023 2022 2021 2020 2019 2018
   Archived Orders past 3 months
   
   AN ITEM YOU BOUGHT HAS BEEN RECALLED
   
   To ensure your safety, go to Your Recalls and Product Safety Alerts and see
   recall information.
   
   ACTION IS REQUIRED ON ONE OR MORE OF YOUR ORDERS.
   
   Please see below.
   
   THERE'S A PROBLEM DISPLAYING YOUR ORDERS RIGHT NOW.
   
   
   Order placed
   July 12, 2023
   Total
   $23.80
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   
   Order # 114-1517274-7393830
   View order details
   
   View invoice
   
   Arriving Thursday
   
   Track package
   VANMASS Universal Car Phone Mount,【Patent & Safety Certs】 Upgraded Handsfree
   Stand, Phone Holder for Car Dashboard Windshield Vent, Compatible with iPhone 14
   13 12 Samsung Android & Pickup Truck
   
   
   Buy it again
   View or edit order
   Archive order
   Order placed
   July 12, 2023
   Total
   $246.80
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   
   Order # 114-2496144-2288268
   View order details
   
   View invoice
   
   Arriving Thursday
   
   Track package
   Genie 7155-TKV Smart Garage Door Opener StealthDrive Connect - Ultra Quiet
   opener, WiFi, Battery Backup - Works with Alexa & Google Home
   
   
   Buy it again
   View or edit order
   Archive order
   Order placed
   July 11, 2023
   Total
   $57.99
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 114-9708805-8079465
   View order details View invoice
   Arriving today by 8 PM
   Shipped
   Flexzilla Garden Hose 5/8 in. x 100 ft., Heavy Duty, Lightweight, Drinking Water
   Safe, ZillaGreen - HFZG5100YW-E
   
   Buy it again
   Track package Get product support Return or replace items Share gift receipt
   Write a product review
   Archive order
   Order placed
   July 9, 2023
   Total
   $64.94
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 114-6884294-0047419
   View order details View invoice
   Delivered July 11
   
   Homall L Shaped Gaming Desk Computer Corner Desk PC Gaming Desk Table with Large
   Monitor Riser Stand for Home Office Sturdy Writing Workstation (Black, 51 Inch)
   
   Return items: Eligible through August 10, 2023
   Buy it again
   View your item
   Get product support Problem with order Track package Return items Share gift
   receipt Write a product review
   Archive order
   Order placed
   July 9, 2023
   Total
   $15.14
   Policy sent to
   adhocmaster@live.com
   
   Order # 114-3068656-9825042
   View order details
   
   View invoice
   
   Email delivery
   
   ASURION 3 Year Furniture Protection Plan ($60 - $69.99)
   
   
   Buy it again
   Problem with order Return items Share gift receipt Leave seller feedback Write a
   product review
   Archive order
   Order placed
   July 3, 2023
   Total
   $200.25
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 114-1479831-3352260
   View order details View invoice
   Delivered July 11
   Package was left in a parcel locker
   Rust-Oleum 261845 EpoxyShield Garage Floor Coating , 2 gal, Gray
   
   Buy it again
   View your item
   Get product support Track package Return or replace items Write a product review
   Archive order
   Order placed
   July 1, 2023
   Total
   $115.92
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 113-0866043-5306630
   View order details View invoice
   Delivered July 6
   
   Bonnlo 3 Burner Outdoor Portable Propane Stove Gas Cooker, Heavy Duty Iron Cast
   Patio Burner with Detachable Stand Legs for Camp Cooking (3-Burner 225,000-BTU)
   
   Buy it again
   View your item
   Problem with order Track package Return or replace items Write a product review
   Archive order
   Order placed
   June 27, 2023
   Total
   $0.00
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 113-7330109-7148238
   View order details View invoice
   Delivered June 28
   Your package was left near the front door or porch.
   Purrfectzone Bidet Sprayer for Toilet, Handheld Sprayer Kit , Cloth Diaper
   Sprayer Set - Easy to Install - Stainless Steel
   
   Return or replace items: Eligible through July 28, 2023
   Buy it again
   View your item
   Get product support Track package Return or replace items Share gift receipt Get
   help Write a product review
   Archive order
   Order placed
   June 26, 2023
   Total
   $9.78
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 113-4452204-9348259
   View order details View invoice
   Delivered June 27
   Your package was left near the front door or porch.
   Mielle Organics Rosemary Mint Scalp & Hair Strengthening Oil With Biotin &
   Essential Oils, Nourishing Treatment for Split Ends and Dry Scalp for All Hair
   Types, 2-Fluid Ounces
   
   Return or replace items: Eligible through July 27, 2023
   Buy it again
   View your item
   Track package Return or replace items Share gift receipt Get help Write a
   product review
   Archive order
   Order placed
   June 26, 2023
   Total
   $25.64
   Ship to
   hidden name
   hidden name
   hidden info
   hidden info, hidden info
   hidden info
   Order # 113-4291615-9645819
   View order details View invoice
   Delivered June 28
   Your package was left near the front door or porch.
   Cantu Coconut Curling Cream with Shea Butter for Natural Hair, 12 oz (Packaging
   May Vary)
   
   Return or replace items: Eligible through July 28, 2023
   Buy it again
   View your item
   Amazon Brand - Mama Bear Organic Kids Vitamin D3 25 mcg (1000 IU) Gummies per
   serving, Bone and Immune Health, Strawberry, 80 Count
   
   Buy it again
   View your item
   Garnier Fructis Sleek & Shine Moroccan Sleek Smoothing Oil for Frizzy, Dry Hair,
   Argan Oil, 3.75 Fl Oz, 1 Count (Packaging May Vary)
   
   Return or replace items: Eligible through July 28, 2023
   Buy it again
   View your item
   Get product support Track package Return or replace items Return or replace
   items Share gift receipt Write a product review
   Archive order
    * ←Previous
    * 1
    * 2
    * 3
    * Next→
   
   `,
);
