window.TAROT_SPREADS = [
{
  id:"spread-single", name:"Single Card Draw",
  description:"This is the simplest spread, using one card to reflect on a single question, theme for the day, or a quick check-in on a situation.",
  positions:["The card: a direct reflection on the question or theme asked."],
  quiz:[
    {type:"mcq", q:"How many cards are used in a Single Card Draw?", options:["One","Three","Five","Ten"], answer:0},
    {type:"yesno", q:"A single card draw is typically used for quick, focused reflection rather than a detailed multi-part reading.", answer:true}
  ]
},
{
  id:"spread-three", name:"Three-Card Spread",
  description:"A widely used spread where three cards are laid out in a row. The most common version reads the positions as Past, Present, and Future, though the same layout can also be read as Situation, Action, and Outcome.",
  positions:[
    "Position 1 (left): the past — what has led to the current situation.",
    "Position 2 (center): the present — the situation as it stands now.",
    "Position 3 (right): the future — the likely direction things are heading."
  ],
  quiz:[
    {type:"mcq", q:"In the most common version of the Three-Card Spread, what do the three positions represent?", options:["Body, Mind, Spirit","Past, Present, Future","Love, Money, Health","Question, Answer, Advice"], answer:1},
    {type:"mcq", q:"How many cards are laid out in this spread?", options:["Two","Three","Four","Five"], answer:1},
    {type:"yesno", q:"The Three-Card Spread can also be read as Situation, Action, and Outcome.", answer:true}
  ]
},
{
  id:"spread-celtic-cross", name:"Celtic Cross Spread",
  description:"One of the most detailed and widely used spreads, using ten cards arranged in a cross and a staff, offering a thorough look at a situation from multiple angles.",
  positions:[
    "Position 1: the heart of the matter — the current situation.",
    "Position 2: the immediate challenge or crossing influence.",
    "Position 3: the foundation — the root cause or distant past.",
    "Position 4: the recent past — events just behind the present.",
    "Position 5: the best possible outcome or conscious goal.",
    "Position 6: the near future — what is approaching next.",
    "Position 7: the querent's own attitude toward the situation.",
    "Position 8: external influences — other people or circumstances at play.",
    "Position 9: hopes and fears surrounding the situation.",
    "Position 10: the likely final outcome."
  ],
  quiz:[
    {type:"mcq", q:"How many cards make up a traditional Celtic Cross Spread?", options:["Six","Eight","Ten","Twelve"], answer:2},
    {type:"mcq", q:"Which position in the Celtic Cross represents the querent's own attitude toward the situation?", options:["Position 3","Position 5","Position 7","Position 10"], answer:2},
    {type:"yesno", q:"The Celtic Cross Spread is generally used for a quick, single-issue check-in rather than a detailed reading.", answer:false}
  ]
},
{
  id:"spread-relationship", name:"Relationship (Couples) Spread",
  description:"A spread built to explore the dynamic between two people, commonly using a layout of around five to six cards to look at each partner's perspective and the connection between them.",
  positions:[
    "Position 1: what one partner brings to the relationship.",
    "Position 2: what the other partner brings to the relationship.",
    "Position 3: the current state of the connection between them.",
    "Position 4: a challenge the relationship is facing.",
    "Position 5: what is needed to strengthen the connection.",
    "Position 6: the potential direction of the relationship."
  ],
  quiz:[
    {type:"mcq", q:"What is the main focus of a Relationship Spread?", options:["Career decisions","The dynamic between two people","Financial planning","Health outcomes"], answer:1},
    {type:"yesno", q:"A Relationship Spread typically includes a position for each partner's individual contribution to the connection.", answer:true}
  ]
},
{
  id:"spread-yesno", name:"Yes or No Spread",
  description:"A focused spread used to address a direct yes-or-no question, typically drawing one card, or a small number of cards where a majority of upright or reversed cards helps determine the leaning of the answer.",
  positions:[
    "The card (or cards): read primarily by whether it is upright (generally leaning yes) or reversed (generally leaning no), alongside its individual meaning."
  ],
  quiz:[
    {type:"mcq", q:"What kind of question is the Yes or No Spread designed to address?", options:["Open-ended life questions","A direct yes-or-no question","Career forecasts only","Multi-year outlooks"], answer:1},
    {type:"yesno", q:"In a Yes or No Spread, whether a card is upright or reversed is commonly used to help lean the answer toward yes or no.", answer:true}
  ]
}
];
