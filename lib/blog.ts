export type Block =
  | { type: 'p';       text: string }
  | { type: 'h2';      text: string }
  | { type: 'quote';   text: string; attr?: string }
  | { type: 'callout'; text: string; variant: 'gold' | 'green' | 'red' }
  | { type: 'list';    items: string[] }
  | { type: 'stat';    stats: { value: string; label: string }[] }

export interface BlogPost {
  slug:        string
  title:       string
  excerpt:     string
  category:    string
  categoryColor: 'green' | 'gold' | 'red'
  readTime:    number
  publishedAt: string
  featured:    boolean
  body:        Block[]
}

export const posts: BlogPost[] = [

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'the-viewing-fee-trap-accra',
    title:         'The Viewing Fee Trap: How Accra\'s Agents Charge You Before You Ever See a Door',
    excerpt:       'In almost every city on earth, viewing a rental property is free. In Accra, you pay GHS 200 to 500 just to walk through a door — and there is no refund if the property is nothing like the photos. This is how the system works, who it hurts, and why it survives.',
    category:      'Tenant Rights',
    categoryColor: 'red',
    readTime:      6,
    publishedAt:   '2026-06-01',
    featured:      true,
    body: [
      { type: 'quote', text: 'I paid GHS 1,200 in one weekend viewing properties. I did not rent a single one. The agent kept apologising and saying the next one would be better.', attr: 'Ama, 27, nurse — relocating from Kumasi to Accra' },

      { type: 'p', text: 'Ama\'s story is not unusual. It is not even close to the worst version. There are Ghanaians who have spent GHS 4,000 to GHS 6,000 in viewing fees across months of searching — money that simply disappeared, money that could have covered the first month\'s rent — before they found a place to live.' },

      { type: 'p', text: 'In London, Paris, New York, Nairobi, Dakar — viewing a rental property is free. You schedule a time. You visit. You decide. The landlord wants to show you the property because they want a tenant. That is the natural order of a rental market.' },

      { type: 'p', text: 'In Accra, you pay before you see anything.' },

      { type: 'h2', text: 'How the Viewing Fee Became a Revenue Stream' },

      { type: 'p', text: 'The origins of the viewing fee are almost reasonable. In the 1990s, when Accra\'s rental market was growing fast and most properties were found through personal networks, agents argued they needed to cover transportation and their time. A small fee — GHS 10, GHS 20 in old currency — was meant to filter out people who were not serious.' },

      { type: 'p', text: 'But what started as a logistics charge became a business model. Today, viewing fees in Accra range from GHS 100 to GHS 500 per property. Premium areas like East Legon and Airport Residential regularly see fees of GHS 300 to GHS 500 per viewing. Some agents charge per person in your group.' },

      { type: 'p', text: 'The fee is charged upfront, before you see the property. There is no refund if the property does not match what was described. There is no credit toward rent if you decide to take it. The money is simply gone, regardless of outcome.' },

      { type: 'stat', stats: [
        { value: 'GHS 200–500', label: 'Average viewing fee per property' },
        { value: '5–8',         label: 'Properties a tenant views before finding one' },
        { value: 'GHS 0',       label: 'Refund if the property is nothing like the description' },
      ]},

      { type: 'h2', text: 'The Sunk Cost Trap' },

      { type: 'p', text: 'Here is what makes the viewing fee particularly cruel: once you have paid to see something, your judgment is compromised. Psychologists call it the sunk cost fallacy — the tendency to value something more simply because you have already invested in it.' },

      { type: 'p', text: 'Agents know this. They show you a property that is not quite right. The bedroom is smaller than described. The kitchen has no ventilation. The compound is noisier than expected. But you paid GHS 300 to walk through that door. You start making mental adjustments. Maybe the small bedroom is fine. Maybe you can put a fan in the kitchen. Maybe you get used to the noise.' },

      { type: 'p', text: 'This is the viewing fee working exactly as intended — not to show you properties, but to make you more likely to take whatever you are shown.' },

      { type: 'callout', variant: 'red', text: 'If you feel pressure to accept a property partly because you already paid to view it, that pressure is by design. A viewing fee is a psychological tool, not just a financial one.' },

      { type: 'h2', text: 'Who It Hurts Most' },

      { type: 'p', text: 'The viewing fee does not fall equally on everyone. For an expatriate employee with a housing allowance, GHS 500 per viewing is an inconvenience. For a fresh graduate earning GHS 2,000 a month — which is above average in Ghana — that same fee is 25% of their monthly income, gone before they see a kitchen.' },

      { type: 'p', text: 'It hits hardest on people in transition: nurses relocating for a new hospital posting, teachers transferred to a new district, young couples leaving a family home for the first time, people fleeing difficult living situations who cannot afford to be choosy. The more urgently you need housing, the more the viewing fee system exploits you.' },

      { type: 'h2', text: 'The Alternative Exists' },

      { type: 'p', text: 'The viewing fee exists because it has never faced real competition. When every agent charges it, there is no market pressure to stop. When there is no platform where you can see real photos, read an honest description, and contact the landlord directly before committing to a visit — you have no choice but to pay.' },

      { type: 'p', text: 'Find Direct Ghana charges zero viewing fees. You browse verified listings with real photos. You read the honest description. You WhatsApp the owner directly from the listing page. You only visit when you are genuinely interested — because you have already done your research and the property is genuinely what you need.' },

      { type: 'p', text: 'This is how it should work. This is how it works everywhere else. And now it works here too.' },

      { type: 'callout', variant: 'green', text: 'Never pay a viewing fee for a property listed on Find Direct Ghana. Browse, research, contact the owner directly, and only visit when you are ready. Zero fees, always.' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'two-years-advance-rent-ghana',
    title:         'Two Years Upfront: The Advance Rent System That Is Locking Ghanaians Out of Their Own City',
    excerpt:       'Ghana\'s advance rent system asks ordinary workers to produce one to two years of rent before they can move into a home. The math is brutal and the human cost is invisible. Here is why it exists, who it traps, and what a fairer system would look like.',
    category:      'Housing Policy',
    categoryColor: 'gold',
    readTime:      8,
    publishedAt:   '2026-06-08',
    featured:      false,
    body: [
      { type: 'p', text: 'Imagine walking into a restaurant and being told you must pay for every meal you will eat there for the next two years — today, in full — before you are allowed to sit down. The food might be good. It might be terrible. The chef might leave. The restaurant might close. You pay anyway, because this is the only restaurant in town that will let you in.' },

      { type: 'p', text: 'This is what advance rent asks of tenants in Ghana. And unlike the restaurant metaphor, for hundreds of thousands of Ghanaians, it is not absurd. It is simply Tuesday.' },

      { type: 'h2', text: 'The Numbers Behind the System' },

      { type: 'p', text: 'Advance rent in Ghana typically runs twelve to twenty-four months. In some premium areas of Accra — East Legon, Airport Residential, Cantonments — landlords ask for three years upfront. Before signing a single page, before moving a single item of furniture, a tenant in a modest GHS 2,500 per month apartment must produce GHS 60,000.' },

      { type: 'stat', stats: [
        { value: 'GHS 60,000', label: 'Two years advance on a GHS 2,500/mo apartment' },
        { value: '2.5 years',  label: 'Average Ghanaian worker\'s savings required' },
        { value: '30%',        label: 'Of Accra renters who have borrowed to pay advance rent' },
      ]},

      { type: 'p', text: 'The median monthly salary in Ghana across formal and informal employment hovers around GHS 1,800 to GHS 2,500. For someone earning at that level, producing two years advance rent on a GHS 2,500 per month apartment means saving their entire salary for two and a half years — with no spending, no food, no transport, no nothing. The number is not aspirational. It is impossible.' },

      { type: 'h2', text: 'Why Landlords Demand It' },

      { type: 'p', text: 'Landlords are not the villains in this story — or at least, they are not the only ones. The advance rent system emerged from a real problem: Ghana\'s legal framework for handling tenancy disputes and enforcing evictions is slow, expensive, and unreliable. A landlord who accepts monthly rent and the tenant stops paying faces months of legal proceedings before they can reclaim their property. Many landlords have stories — or know someone with stories — of tenants who lived rent-free for a year while a court case dragged on.' },

      { type: 'p', text: 'So landlords took the law into their own hands. If they collect two years upfront, they cannot be cheated on rent. If inflation runs high and the cedi depreciates, at least they got what they were owed before the currency moved. Advance rent is, from the landlord\'s perspective, risk management.' },

      { type: 'callout', variant: 'gold', text: 'The advance rent system is not greed. It is distrust. Distrust of tenants, distrust of courts, distrust of contracts. The solution is not to shame landlords — it is to build the trust infrastructure that makes monthly rent viable for both sides.' },

      { type: 'h2', text: 'The Hidden Human Cost' },

      { type: 'p', text: 'The people you do not see in this conversation are the ones sleeping on a floor mattress in a cousin\'s living room at thirty-two years old. Not because they are lazy. Not because they cannot afford the GHS 2,500 monthly rent. But because they cannot produce GHS 60,000 at once, and no bank in Ghana offers a rental deposit loan product that makes sense.' },

      { type: 'p', text: 'They are the nurse who got a posting at Korle-Bu and cannot find a place near the hospital that she can move into this month. The teacher transferred to Accra who is commuting three hours each day from a relative\'s house in Tema because it is cheaper than the advance rent for a room in the city. The young couple who have been "almost ready to move out" of their parents\' homes for four years, saving everything, watching the target number rise as rents increase.' },

      { type: 'p', text: 'These people are everywhere in Accra. They are invisible in the housing conversation because they are not in the market — they have been priced out of the entry cost, not the monthly cost.' },

      { type: 'h2', text: 'What Landlords Actually Lose' },

      { type: 'p', text: 'Advance rent has a cost for landlords too, though it is harder to see. When a landlord collects GHS 60,000 upfront and spends it — as most do, since it arrives as a single large sum — there is nothing left for repairs eighteen months into the tenancy. When the ceiling leaks, when the water pump breaks, when the gate motor fails, the landlord has no reserved funds. Repairs get delayed. The property deteriorates. The relationship with the tenant sours.' },

      { type: 'p', text: 'Monthly rent, by contrast, creates a consistent income stream that most landlords would actually prefer if they trusted the system. A reliable tenant paying GHS 2,500 every month is worth more in the long run than GHS 60,000 upfront that is already spent by month six.' },

      { type: 'h2', text: 'The Negotiation That Nobody Teaches You' },

      { type: 'p', text: 'Here is something that does not appear in any formal guide to renting in Ghana: advance rent is often negotiable. Not always. Not by much. But if a landlord is advertising a property that has been empty for two months, their true preference is a paying tenant over an empty room. That gives you leverage.' },

      { type: 'list', items: [
        'Ask directly: "Can we discuss a shorter advance period?" Most landlords expect the question.',
        'Offer additional security: a higher security deposit, a Ghana Card-verified identity, a referee who the landlord can call.',
        'On platforms like Find Direct Ghana where you contact the landlord directly, this conversation happens before anyone pays anyone anything.',
        'Never pay advance rent to someone you have not met in person, at the property itself.',
        'Get every term in writing. The advance period, the renewal date, what happens if you need to leave early.',
      ]},

      { type: 'p', text: 'The advance rent system will not disappear overnight. But the more tenants who enter the market informed, the more leverage shifts toward a fairer conversation. That is what we are building Find Direct Ghana to support.' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'best-neighborhoods-rent-accra-2026',
    title:         'Where to Rent in Accra in 2026: Real Prices, Real Neighborhoods, and What Nobody Tells You',
    excerpt:       'Every neighborhood guide about Accra is written by someone who has never paid rent there. This one is not. Here is the unfiltered truth about where to live in Accra — prices in GHS, commute times, what you actually get, and who each area is really for.',
    category:      'Neighborhood Guide',
    categoryColor: 'green',
    readTime:      10,
    publishedAt:   '2026-06-15',
    featured:      false,
    body: [
      { type: 'p', text: 'Most neighborhood guides about Accra were written by people who have never actually paid rent there. They describe East Legon as "upscale" and Madina as "affordable" and then list price ranges that bear no resemblance to what landlords actually charge in June 2026. This guide is different.' },

      { type: 'p', text: 'Every price here reflects real listings. Every observation comes from the reality of renting — not from a tourism brochure. Read this before you start your search.' },

      { type: 'h2', text: 'East Legon: The Gold Standard — and the Price Tag to Match' },

      { type: 'p', text: 'East Legon is Accra\'s most sought-after residential area for a reason. Wide roads, generally reliable water supply, close proximity to the international community, and a concentration of embassies, international schools, and supermarkets that carry imported goods. Properties here are well-maintained compared to many other parts of the city.' },

      { type: 'p', text: 'The price for a 2-bedroom furnished apartment runs GHS 4,500 to GHS 8,000 per month. Unfurnished 3-bedroom houses start at GHS 6,000. At the top end — gated community properties near the Ghana Police Service headquarters or along Boundary Road — you are looking at GHS 12,000 to GHS 18,000 for a 4-bedroom house. That is before utilities.' },

      { type: 'callout', variant: 'gold', text: 'East Legon is for: Senior executives, expatriates on housing packages, embassy staff, and Ghanaian professionals with high incomes who can also handle advance rent at that price level.' },

      { type: 'h2', text: 'Osu: The Neighborhood That Never Sleeps' },

      { type: 'p', text: 'Osu is central, cosmopolitan, and full of energy. Oxford Street — a stretch of restaurants, boutiques, and nightlife — makes it the most socially alive neighborhood in Accra. Proximity to Labone, Cantonments, and the airport corridor makes commuting manageable. The roads are busier and narrower than East Legon, and the noise level is higher.' },

      { type: 'p', text: 'A self-contained chamber and hall in Osu runs GHS 1,800 to GHS 3,000. A proper 2-bedroom apartment — not a converted compound room — starts at GHS 3,500 and goes to GHS 7,000 for a newer building with security and parking. The market in Osu is active; properties move fast.' },

      { type: 'callout', variant: 'green', text: 'Osu is for: Young professionals who want to be close to social life and do not mind noise. Creatives, people in media and marketing, restaurant and hospitality workers.' },

      { type: 'h2', text: 'Spintex Road: Growth Without the Price Tag — For Now' },

      { type: 'p', text: 'Spintex Road has transformed in the last decade from an industrial corridor to one of Accra\'s most active residential zones. Shopping malls, the airport expansion, a growing number of gated communities, and proximity to the port have made it increasingly popular. The roads can be nightmarish during rush hour — the Spintex traffic is legendary — but the value for money is still good compared to older established areas.' },

      { type: 'p', text: 'A 2-bedroom apartment on Spintex starts at GHS 2,500 unfurnished and rises to GHS 5,500 furnished in a newer estate. Chamber and hall in the secondary streets runs GHS 1,200 to GHS 2,000. Borehole water is common because municipal supply is unreliable in parts of the area.' },

      { type: 'h2', text: 'Haatso and Achimota: The Practical Middle' },

      { type: 'p', text: 'Haatso and Achimota sit between the premium north of the city and the affordable eastern suburbs. The Achimota Retail Centre and the proximity to the University of Ghana, KNUST Faculty of Art, and several secondary schools make these neighborhoods popular with families and academic staff.' },

      { type: 'p', text: 'Rents here range from GHS 1,500 for a decent self-contained room to GHS 4,500 for a 3-bedroom house in a quiet compound. Water supply from the main grid is slightly more reliable than Spintex. Commuting to the central business district takes 30 to 60 minutes depending on traffic.' },

      { type: 'h2', text: 'Adenta and Madina: Accra\'s Most Practical Neighborhoods for Ordinary Earners' },

      { type: 'p', text: 'If you are a teacher, a nurse, a civil servant, or anyone earning a salary in the GHS 2,000 to GHS 4,000 range, Adenta and Madina are where most people who can afford to rent in Accra actually live. These neighborhoods are often left out of "best places to live in Accra" guides because those guides are not written for ordinary Ghanaians.' },

      { type: 'p', text: 'A self-contained chamber and hall in Adenta runs GHS 1,000 to GHS 2,000. A 2-bedroom apartment with parking and a small compound starts at GHS 2,200. In Madina, a chamber and hall from a direct landlord can be found for as low as GHS 700 to GHS 1,200. The trade-off is commute time — getting to Accra central during rush hour can take 90 minutes.' },

      { type: 'stat', stats: [
        { value: 'GHS 700',    label: 'Cheapest self-contained room (Madina)' },
        { value: 'GHS 8,000',  label: 'Mid-range 3-bed apartment (East Legon)' },
        { value: 'GHS 18,000', label: 'Premium 4-bed house (East Legon gated)' },
      ]},

      { type: 'h2', text: 'Tema: The City That Gets Overlooked' },

      { type: 'p', text: 'Tema is its own city, not a suburb of Accra, and it is undersold as a place to live. Built as Ghana\'s industrial port city in the 1950s and 1960s, Tema has the most planned urban layout in the country — numbered communities, wide main roads, a functioning grid. Community 9 and Community 18 are popular with professionals working near the port or in the industrial zone.' },

      { type: 'p', text: 'Rents in Tema run 20 to 40% below Accra for equivalent properties. A 2-bedroom apartment in Community 9 goes for GHS 1,800 to GHS 3,500. For anyone working in the Tema industrial corridor, it is both more affordable and closer to work.' },

      { type: 'callout', variant: 'green', text: 'The best value rentals in Ghana are consistently found by going directly to the landlord. When you cut out the agent\'s two-month commission, the savings often cover your entire first month\'s rent.' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'chamber-and-hall-ghana-explained',
    title:         'Chamber and Hall: The Heart of Ghana\'s Housing Culture — and the Dignity Within It',
    excerpt:       'Most housing discussions in Ghana treat chamber and hall as a stepping stone — something you endure on the way to something better. They have it wrong. Chamber and hall is where most of Accra actually lives, where families are raised, where communities are built. Here is what it really means.',
    category:      'Ghana Living',
    categoryColor: 'green',
    readTime:      7,
    publishedAt:   '2026-06-22',
    featured:      false,
    body: [
      { type: 'p', text: 'If you have grown up in Ghana, you already know what chamber and hall means. You probably grew up in one, or your parents did, or your uncle\'s family three doors down lived in one while you visited on weekends. Chamber and hall is not a housing type that needs explaining to most Ghanaians. It simply is.' },

      { type: 'p', text: 'But the way it gets discussed — when it gets discussed at all — is usually as a deficit. Something to graduate out of. An interim arrangement. A compromise. This framing is wrong, and it does a disservice to the millions of Ghanaians who have built lives, raised children, and created genuine community within these walls.' },

      { type: 'h2', text: 'What It Actually Is' },

      { type: 'p', text: 'A chamber and hall is typically two main rooms: the chamber (the primary room, used for sleeping and receiving close guests) and the hall (a multi-purpose space that serves as a corridor, sitting area, and sometimes a second sleeping space). Total floor area usually runs between 22 and 40 square metres.' },

      { type: 'p', text: 'The key distinction in pricing and desirability is whether the unit is self-contained — meaning it has its own bathroom and toilet attached — or whether facilities are shared with other households in the compound. Self-contained adds GHS 200 to GHS 600 per month to the rent in most neighborhoods, and significantly changes daily life.' },

      { type: 'p', text: 'Most chamber and hall units sit within a compound — a collection of units sharing a courtyard or entry gate. The compound structure is itself a cultural artifact: it reflects an era when land was held in family ownership and built incrementally, room by room, over decades. What looks like a single large property on a street is often five or six separate family units behind a shared gate.' },

      { type: 'h2', text: 'Who Lives There and Why It Matters' },

      { type: 'p', text: 'Teachers live in chamber and hall. Nurses. Soldiers. Market women who have been selling at Kaneshie market for thirty years. Young graduates in their first job. Security guards. Seamstresses. Church pastors in new congregations. Civil servants waiting for promotions. Construction workers who moved to Accra from the north and have been here for fifteen years.' },

      { type: 'p', text: 'This is not a list of people who have failed to afford better. This is a list of the people who run Accra. Who teach the children, treat the patients, guard the buildings, move the goods, feed the city. Chamber and hall is not where the margins of Accra live. It is where Accra lives.' },

      { type: 'quote', text: 'My grandmother raised six children in a chamber and hall in Nima. All six went to university. The chamber was not a limitation — it was the foundation.', attr: 'Kweku, 34, civil engineer' },

      { type: 'h2', text: 'The Water Question' },

      { type: 'p', text: 'No honest conversation about chamber and hall in Accra can avoid water. Municipal water supply in most of Accra is intermittent at best and absent for weeks at a time in many neighborhoods. The practical response in most compounds is a combination: a roof tank that fills when the mains run, sometimes supplemented by a borehole, sometimes by water deliveries from tanker trucks at GHS 80 to GHS 200 per load.' },

      { type: 'p', text: 'Before you rent any chamber and hall, ask these questions directly: Where does the water come from? How often does the main supply run? Is there a borehole? Who pays for tanker water and how is the cost shared? These are not rude questions. They are essential ones. A good landlord will have clear answers.' },

      { type: 'h2', text: 'The Art of Making It Home' },

      { type: 'p', text: 'Walk through any compound in Haatso, Achimota, or Adenta on a Saturday morning and you will see what chamber and hall actually looks like when it is lived in. Curtains that took three months to save for, chosen with more care than any interior designer brings to a showroom. A small refrigerator that hums through the night. Concrete floors painted and repainted until they shine. A bookshelf that holds both the family Bible and a set of secondary school textbooks that nobody has the heart to throw away.' },

      { type: 'p', text: 'There is a tradition in Ghana of making limited space feel generous. Of hanging a single framed print at the exact angle that makes the room look intentional. Of keeping a chamber and hall so clean and ordered that visitors do not think about its size — they think about the warmth of the household.' },

      { type: 'callout', variant: 'gold', text: 'Chamber and hall is not a category below "real" apartments. It is a housing type with its own culture, its own community logic, and its own standards of quality. The right question is not "when will you get something bigger?" It is "is this one well-maintained, honestly priced, and worth what the landlord is asking?"' },

      { type: 'h2', text: 'What to Look For Before You Sign' },

      { type: 'list', items: [
        'Self-contained vs. shared facilities — confirm this before anything else.',
        'Water source — municipal, borehole, tanker delivery, and who covers the cost.',
        'Electrical load shedding schedule for the area — this affects your fan, your fridge, everything.',
        'Compound rules — some landlords restrict cooking methods, visitors, or business use.',
        'Who manages repairs — ask what happened the last time something broke.',
        'Noise — visit at different times of day. A compound that is quiet at 10am may be entirely different at 10pm.',
        'Ceiling condition — water damage in the ceiling means a leaking roof above. Do not overlook it.',
      ]},

      { type: 'p', text: 'Chamber and hall is not something to apologise for. It is something to choose wisely. Find Direct Ghana lists chamber and hall properties with honest descriptions, real photos, and direct landlord contact — so you can make that choice with all the information you deserve to have.' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'how-to-spot-fake-landlord-ghana',
    title:         'How to Spot a Fake Landlord in Ghana Before You Lose Your Money',
    excerpt:       'Property fraud in Ghana costs tenants millions of cedis every year. The scams are getting more sophisticated — professional-looking photos, convincing WhatsApp personas, even fake viewing trips. Here are the red flags every renter must know, and the exact steps to verify any landlord before paying a single cedi.',
    category:      'Safety',
    categoryColor: 'red',
    readTime:      7,
    publishedAt:   '2026-06-29',
    featured:      false,
    body: [
      { type: 'p', text: 'The message arrives in a Facebook group at 9pm. "3-bedroom house for rent, East Legon, GHS 2,500/month. Owner travelling. Interested parties contact 055XXXXXXX." The photos are beautiful. Natural light, clean floors, a compound with a generator visible in the corner. The price is low for East Legon but not impossibly low. The account looks real — profile photo, a few posts, some family photos from what appears to be two years ago.' },

      { type: 'p', text: 'Mensah sent GHS 6,000 for three months advance. He never met the landlord. He never visited the property. The number was disconnected the next morning.' },

      { type: 'p', text: 'This happens in Accra every week. Not every week to someone naive — to teachers, to accountants, to people who have rented properties before and thought they knew what to look for. The scams are sophisticated. Here is what you need to know.' },

      { type: 'h2', text: 'Red Flag 1: The Price Is Too Right for the Location' },

      { type: 'p', text: 'The most reliable indicator of a fraudulent listing is a price that is 30 to 50 percent below market rate for the neighborhood. Not slightly below — significantly below. A furnished 3-bedroom in East Legon at GHS 2,500 is not a bargain. It is a trap. Scammers set prices low enough to generate urgency ("at this price it will go fast") but not so low as to seem obviously fake.' },

      { type: 'p', text: 'Before you contact any landlord from an informal source, check what similar properties actually cost in that neighborhood. Find Direct Ghana shows you real prices from verified owners. If something is materially cheaper than everything else you see — be suspicious before you are interested.' },

      { type: 'h2', text: 'Red Flag 2: The Landlord Cannot Meet You In Person' },

      { type: 'p', text: '"I am currently in the UK on a project." "I am in Kumasi for a family matter but my caretaker can show you." "I am travelling but I can arrange everything remotely." These are the phrases that should end any conversation.' },

      { type: 'p', text: 'A genuine landlord in Accra who is temporarily unavailable will have someone — a family member, a property manager, a neighbor — who can meet you at the actual property, hand you a key, and be accountable with a real name and face. A scammer cannot provide this because there is no property, or because the property belongs to someone else.' },

      { type: 'callout', variant: 'red', text: 'If the landlord cannot meet you at the property, do not pay anything. Full stop. No exception. A legitimate property rental in Ghana does not require you to trust someone you have never seen at a building you have never entered.' },

      { type: 'h2', text: 'Red Flag 3: Payment Before Viewing' },

      { type: 'p', text: 'No legitimate landlord in Ghana requires payment before you have physically visited the property. Any request for a "reservation fee," a "holding deposit," or even a "viewing fee" to be paid via mobile money before you see the place is fraud. The viewing fee paid in cash at the agent\'s office is a different (though still controversial) practice — but money sent to a number on WhatsApp before you have seen anything is always, always a scam.' },

      { type: 'h2', text: 'Red Flag 4: The Photos Are Too Perfect' },

      { type: 'p', text: 'Scammers steal photos from legitimate property listings, estate agency websites, and even international platforms like Airbnb. A few signs that photos may be stolen: they are shot with professional lighting and wide-angle lenses (unusual for a private Ghanaian landlord), they show furniture and decor that looks like a hotel rather than a home, or a reverse image search (right-click → Search Image on Google) shows the photos appearing on other listings or websites.' },

      { type: 'p', text: 'On Find Direct Ghana, owners submit photos through a verified account. We check that photos are original and match the listed property before any listing goes live.' },

      { type: 'h2', text: 'The Five Steps to Verify Any Landlord Before You Pay' },

      { type: 'list', items: [
        '1. Visit the property in person before any money changes hands. This is non-negotiable.',
        '2. Ask the landlord to show you their Ghana Card. Any owner who refuses to show identification should not receive your money.',
        '3. Knock on neighboring doors. Ask: "Who owns this building?" If the person you spoke to online is not the owner, you will find out in sixty seconds.',
        '4. Search the landlord\'s name and phone number on Google and on Facebook. Scammers often have digital trails.',
        '5. Use platforms that verify owners. On Find Direct Ghana, every listing owner has submitted their Ghana Card and phone verification before their profile is published.',
      ]},

      { type: 'h2', text: 'If You Have Already Been Scammed' },

      { type: 'p', text: 'Report to the Ghana Police Service. File a report at your nearest station with the phone number, any WhatsApp conversation screenshots, and the mobile money transaction reference. The Ghana CID Cybercrime Unit handles property fraud cases. Your chances of recovering money are not high, but reporting creates a record and has led to arrests.' },

      { type: 'p', text: 'Report to your mobile money provider (MTN MoMo, AirtelTigo Money, or Vodafone Cash). If you act within 24 to 48 hours and the recipient has not yet withdrawn the funds, there is a possibility of reversal. This is rare but not impossible.' },

      { type: 'callout', variant: 'green', text: 'Every listing on Find Direct Ghana is tied to a verified owner with a confirmed Ghana Card. We do not publish profiles we cannot verify. Browse with confidence.' },
    ],
  },

  /* ─────────────────────────────────────────────────────────── */
  {
    slug:          'real-cost-renting-accra-2026',
    title:         'The Real Cost of Renting in Accra: A Breakdown Nobody Does for You',
    excerpt:       'The rent is GHS 2,500 a month. You think you need GHS 2,500 to move in. You are short by about GHS 45,000. Here is every cost you will face when renting in Accra in 2026 — the numbers most landlords and agents do not bring up until you are already committed.',
    category:      'Money & Costs',
    categoryColor: 'gold',
    readTime:      6,
    publishedAt:   '2026-07-01',
    featured:      false,
    body: [
      { type: 'p', text: 'The advertisement says GHS 2,500 per month. You see it. You think about your salary. You think: I can do this. And then you start asking questions and the number that you need in your bank account before you can move in grows. And grows. And grows.' },

      { type: 'p', text: 'The monthly rent is only one of eight costs involved in renting in Accra. Most people only learn the others when they are already too far in to walk away. Here is the full picture, built around a real example: a self-contained 2-bedroom unfurnished apartment in Adenta at GHS 2,500 per month.' },

      { type: 'h2', text: 'The Full Move-In Cost Breakdown' },

      { type: 'stat', stats: [
        { value: 'GHS 30,000', label: '12 months advance rent (minimum)' },
        { value: 'GHS 5,000',  label: 'Agent commission (2 months rent)' },
        { value: 'GHS 2,500',  label: 'Security deposit (1 month)' },
        { value: 'GHS 1,000',  label: 'Viewing fees across your search (5 × GHS 200)' },
      ]},

      { type: 'p', text: 'That is GHS 38,500 before you have moved a single item into the property. And that is before the things that are entirely your responsibility once you are inside.' },

      { type: 'list', items: [
        'Moving truck: GHS 600 to GHS 1,200 depending on distance and volume',
        'Basic furniture if unfurnished (bed, wardrobe, chairs, table): GHS 6,000 to GHS 15,000',
        'Kitchen equipment (gas cooker, pots, fridge): GHS 3,000 to GHS 6,000',
        'First electricity credit on prepaid meter: GHS 300 to GHS 600',
        'Curtains, cleaning materials, first-month supplies: GHS 800 to GHS 1,500',
      ]},

      { type: 'p', text: 'Conservative total before month two: GHS 49,200. Realistic total including a modest furniture budget: GHS 55,000 to GHS 65,000.' },

      { type: 'callout', variant: 'red', text: 'The monthly rent is the smallest part of what renting in Accra actually costs. The entry cost — advance rent, commission, deposit, fees — is where most people are blocked, not the ongoing payment.' },

      { type: 'h2', text: 'Where the Cuts Can Be Made' },

      { type: 'p', text: 'Not all of these costs are fixed. Some are avoidable entirely. Some are negotiable. Here is where the real opportunities are:' },

      { type: 'list', items: [
        'Agent commission (GHS 5,000): Avoidable. Contact landlords directly through Find Direct Ghana and this cost disappears completely.',
        'Viewing fees (GHS 1,000): Avoidable. Find Direct Ghana charges zero viewing fees.',
        'Advance rent: Negotiable. On properties that have been empty for more than a month, landlords are often willing to accept 6 months rather than 12 if you can demonstrate stable income.',
        'Furniture: Stageable. You do not need everything on day one. A mattress, a fridge, and a gas cooker covers the first month while you save for the rest.',
      ]},

      { type: 'h2', text: 'The Agent Commission: The Most Avoidable Cost' },

      { type: 'p', text: 'The standard agent commission in Accra is two months rent, paid by the tenant. On a GHS 2,500 per month apartment, that is GHS 5,000 — paid to someone whose only contribution was a phone call to a landlord they know. There is no contract. No service guarantee. No ongoing support after you move in. Two months of your advance rent gone.' },

      { type: 'p', text: 'When you contact a landlord directly through Find Direct Ghana, you pay no commission to anyone. The GHS 5,000 stays in your pocket. Over a two-year tenancy, you are not paying extra for a service you never needed.' },

      { type: 'h2', text: 'Planning Your Rental Budget: The Honest Formula' },

      { type: 'p', text: 'Before you search for a property in Accra, calculate your real readiness number. Take the monthly rent you can afford. Multiply by fourteen (twelve months advance plus two months commission). Add GHS 10,000 to GHS 15,000 for move-in costs. That is the number you need in your account on signing day.' },

      { type: 'p', text: 'If you go through Find Direct Ghana and contact the landlord directly, remove the two-month commission from the calculation. You are starting GHS 5,000 ahead before you have done anything else.' },

      { type: 'callout', variant: 'green', text: 'Find Direct Ghana saves tenants an average of GHS 5,000 in agent fees on every rental — money that goes toward your actual home, not someone else\'s pocket.' },
    ],
  },

]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find(p => p.slug === slug)
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return posts.filter(p => p.slug !== slug).slice(0, limit)
}
