export const strollers = [
  // ── DEMO 1 & 2: Normal comparison (good data, price gap) ──
  {
    id: 1,
    name: "Joie Premium Stroller",
    price: "799 AED",
    weight: "9kg",
    age: "from birth",
    description:
      "Joie Premium Stroller, 9kg, price 799 AED, suitable from birth",
    image:
      "https://plus.unsplash.com/premium_photo-1773816002422-a6fa6c3a7344?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    name: "Chicco Lightweight Stroller",
    price: "549 AED",
    weight: "7kg",
    age: "from 6 months",
    description:
      "Chicco Lightweight Stroller, 7kg, price 549 AED, suitable from 6 months",
    image:
      "https://images.unsplash.com/photo-1714042804911-47f0dea4b8ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  // ── DEMO 2: Big price gap ──
  {
    id: 3,
    name: "Babyzen YOYO Premium",
    price: "2500 AED",
    weight: "5.5kg",
    age: "from birth",
    description:
      "Babyzen YOYO Premium Stroller, 5.5kg, price 2500 AED, suitable from birth, lightweight cabin-approved travel stroller",
    image:
      "https://plus.unsplash.com/premium_photo-1661422310225-b741a317d82d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 4,
    name: "Graco Travel Stroller",
    price: "199 AED",
    weight: "8kg",
    age: "from 6 months",
    description:
      "Graco Travel Stroller, 8kg, price 199 AED, suitable from 6 months, basic budget stroller",
    image:
      "https://media.istockphoto.com/id/1350738089/photo/close-up-on-midsection-of-unknown-caucasian-woman-mother-pushing-stroller-with-baby-in-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=UmIJQbaFMJHyQqyDVmJltZ3Z2rts6vrPJZFrRSeCoXQ=",
  },

  // ── DEMO 3: Missing / vague data ──
  {
    id: 5,
    name: "Lightweight Stroller",
    price: null,
    weight: null,
    age: null,
    description: "Lightweight stroller",
    image:
      "https://plus.unsplash.com/premium_photo-1661422300698-11cb1023b02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 6,
    name: "Premium Baby Stroller",
    price: null,
    weight: null,
    age: null,
    description: "Premium baby stroller",
    image:
      "https://plus.unsplash.com/premium_photo-1661628627970-774a6d03fd3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },

  // ── DEMO 4: Rich detailed data (confidence test) ──
  {
    id: 7,
    name: "Maxi-Cosi Urban Stroller",
    price: "899 AED",
    weight: "7.5kg",
    age: "from birth",
    description:
      "Maxi-Cosi Urban Stroller, 7.5kg, price 899 AED, suitable from birth, reversible seat, all-terrain wheels, one-hand fold",
    image:
      "https://plus.unsplash.com/premium_photo-1661422300698-11cb1023b02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 8,
    name: "Evenflo Compact Stroller",
    price: "499 AED",
    weight: "6.8kg",
    age: "from 6 months",
    description:
      "Evenflo Compact Stroller, 6.8kg, price 499 AED, suitable from 6 months, compact fold, lightweight frame, basic canopy",
    image:
      "https://plus.unsplash.com/premium_photo-1661628627970-774a6d03fd3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },

  // ── DEMO 5: Garbage input — uncertainty handling ──
  {
    id: 9,
    name: "Mystery Product A",
    price: null,
    weight: null,
    age: null,
    description: "asdfghjkl",
    image:
      "https://plus.unsplash.com/premium_photo-1773816002422-a6fa6c3a7344?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 10,
    name: "Mystery Product B",
    price: null,
    weight: null,
    age: null,
    description: "random text nothing",
    image:
      "https://images.unsplash.com/photo-1714042804911-47f0dea4b8ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// export const strollers = [
//   {
//     id: 1,
//     name: "Joie Premium Stroller",
//     price: "799 AED",
//     weight: "9kg",
//     age: "from birth",
//     description:
//       "Joie Premium Stroller, 9kg, price 799 AED, suitable from birth",
//     image:
//       "https://plus.unsplash.com/premium_photo-1773816002422-a6fa6c3a7344?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjV8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
//   },
//   {
//     id: 2,
//     name: "Chicco Lightweight Stroller",
//     price: "549 AED",
//     weight: "7kg",
//     age: "from 6 months",
//     description:
//       "Chicco Lightweight Stroller, 7kg, price 549 AED, suitable from 6 months",
//     image:
//       "https://images.unsplash.com/photo-1714042804911-47f0dea4b8ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 3,
//     name: "Graco Travel Stroller",
//     price: "699 AED",
//     weight: "8kg",
//     age: "from birth",
//     description:
//       "Graco Travel Stroller, 8kg, price 699 AED, suitable from birth",
//     image:
//       "https://media.istockphoto.com/id/1350738089/photo/close-up-on-midsection-of-unknown-caucasian-woman-mother-pushing-stroller-with-baby-in-the.webp?a=1&b=1&s=612x612&w=0&k=20&c=UmIJQbaFMJHyQqyDVmJltZ3Z2rts6vrPJZFrRSeCoXQ=",
//   },
//   {
//     id: 4,
//     name: "Babyzen Compact Stroller",
//     price: "999 AED",
//     weight: "6kg",
//     age: "from 6 months",
//     description:
//       "Babyzen Compact Stroller, 6kg, price 999 AED, suitable from 6 months",
//     image:
//       "https://plus.unsplash.com/premium_photo-1661422310225-b741a317d82d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
//   },
//   {
//     id: 5,
//     name: "Maxi-Cosi Urban Stroller",
//     price: "899 AED",
//     weight: "7.5kg",
//     age: "from birth",
//     description:
//       "Maxi-Cosi Urban Stroller, 7.5kg, price 899 AED, suitable from birth",
//     image:
//       "https://plus.unsplash.com/premium_photo-1661422300698-11cb1023b02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
//   },
//   {
//     id: 6,
//     name: "Evenflo Compact Stroller",
//     price: "499 AED",
//     weight: "6.8kg",
//     age: "from 6 months",
//     description:
//       "Evenflo Compact Stroller, 6.8kg, price 499 AED, suitable from 6 months",
//     image:
//       "https://plus.unsplash.com/premium_photo-1661628627970-774a6d03fd3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHN0cm9sbGVyc3xlbnwwfHwwfHx8MA%3D%3D",
//   },
// ];
