export interface SampleBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: { id: string; name: string; slug: string };
  coverImage: { url: string };
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  author: { name: string; role: string };
  tags: { tag: { id: string; name: string } }[];
  seoTitle: string;
  seoDescription: string;
}

export const SAMPLE_BLOG_POSTS: SampleBlogPost[] = [
  {
    id: "post-1",
    title: "The Journey of Ethiopian Coffee: From Cherry to Green Bean",
    slug: "journey-of-ethiopian-coffee-from-cherry-to-green-bean",
    excerpt:
      "Follow the intricate transformation of specialty coffee in the Gedeo highlands — from selective hand-harvesting of crimson cherries to pristine export-ready green beans.",
    coverImage: { url: "/images/blog-coffee-journey.jpg" },
    publishedAt: "2025-01-15T09:00:00.000Z",
    readingTime: 5,
    featured: true,
    category: {
      id: "cat-1",
      name: "Origin & Processing",
      slug: "origin-processing",
    },
    author: {
      name: "Takele Mamo",
      role: "Managing Director & Coffee Specialist",
    },
    tags: [
      { tag: { id: "t-1", name: "Green Coffee" } },
      { tag: { id: "t-2", name: "Harvest" } },
      { tag: { id: "t-3", name: "Yirgacheffe" } },
      { tag: { id: "t-4", name: "Traceability" } },
    ],
    seoTitle: "The Journey of Ethiopian Coffee: From Cherry to Green Bean | Lambek Coffee",
    seoDescription:
      "Explore the transformation of Ethiopian specialty coffee from ripe cherries on highland trees to sorted green coffee beans ready for export.",
    content: `
      <h2>The Birthplace of Arabica and Highland Agroforestry</h2>
      <p>In the mist-shrouded valleys of the Gedeo Zone in southern Ethiopia, coffee is not merely a crop — it is an ancient agroforestry tradition. Grown at altitudes between 2,000 and 2,200 meters above sea level, indigenous Arabica trees thrive beneath towering native shade canopies like Cordia africana and Acacia.</p>
      
      <blockquote>
        &ldquo;True specialty coffee begins at the tree: only deep crimson cherries picked at peak brix sugar concentration can develop the celebrated floral aromatics of Yirgacheffe.&rdquo;
      </blockquote>

      <h2>Step 1: Selective Hand-Harvesting</h2>
      <p>Harvesting in Ethiopia is done entirely by hand. Smallholder farming families navigate steep highland slopes multiple times throughout the harvest season, picking only cherries that have reached deep red maturity while leaving underripe green cherries on the branch for subsequent passes.</p>

      <h2>Step 2: Density Flotation & Sorting</h2>
      <p>Within hours of picking, cherries are brought to the local washing station. They are immersed in clean water channels where dense, sugar-rich cherries sink to the bottom while lower-density floaters are skimmed away. This initial density separation ensures uniform sweetness and defect-free cup quality.</p>

      <h2>Step 3: Curing on Raised African Beds</h2>
      <p>Whether processed as fully washed parchment or sun-dried natural cherries, the coffee is laid in thin layers on elevated wooden mesh beds. Workers turn the coffee every hour to guarantee even airflow and solar exposure, protecting the beans from rain and intense midday sun with shade netting until moisture reaches a steady 10.5% to 11.5%.</p>

      <h2>Step 4: Dry Milling, Optical Grading & Bagging</h2>
      <p>After resting for 4 to 6 weeks to stabilize water activity, the cured parchment is transported to our modern dry mill in Addis Ababa. Here, mechanical hullers remove the outer husk, followed by multi-stage gravity separation and high-precision optical color sorting to eliminate physical defects before the green beans are hermetically sealed in GrainPro liners.</p>
    `,
  },
  {
    id: "post-2",
    title: "Understanding Washed Ethiopian Coffee: The Art of Wet Processing",
    slug: "understanding-washed-ethiopian-coffee-the-art-of-wet-processing",
    excerpt:
      "How pure mountain spring water, controlled fermentation, and meticulous channel grading produce the sparkling acidity and jasmine florals of washed Yirgacheffe.",
    coverImage: { url: "/images/washed-coffee-station.jpg" },
    publishedAt: "2025-01-28T10:30:00.000Z",
    readingTime: 6,
    featured: true,
    category: {
      id: "cat-2",
      name: "Processing Science",
      slug: "processing-science",
    },
    author: {
      name: "Lambek Quality Team",
      role: "QC & Milling Department",
    },
    tags: [
      { tag: { id: "t-5", name: "Washed Coffee" } },
      { tag: { id: "t-6", name: "Wet Mill" } },
      { tag: { id: "t-7", name: "Cup Clarity" } },
    ],
    seoTitle: "Understanding Washed Ethiopian Coffee: The Art of Wet Processing | Lambek Coffee",
    seoDescription:
      "Discover the science and craftsmanship behind washed Ethiopian green coffee processing, from de-pulping to clean water washing.",
    content: `
      <h2>The Hallmark of Cleanliness and Terroir Transparency</h2>
      <p>Washed (or wet-processed) coffee is prized by specialty roasters for its pristine transparency, vibrant citric acidity, and delicate floral perfumes. Unlike natural processing where the fruit dries intact, washed processing strips away the fruit flesh before drying, allowing the pure seed terroir to shine through unmasked.</p>

      <h2>Pulping with Mountain Spring Water</h2>
      <p>At our Gedeo washing stations, freshly picked ripe cherries are fed through mechanical disk pulpers driven by gravity and clean mountain spring water. The outer skin and pulp are gently removed, leaving the seed enveloped in its sticky mucilage layer.</p>

      <blockquote>
        &ldquo;The fermentation stage is critical: too short and mucilage clings to the parchment; too long and delicate floral esters degrade into harsh vinegary notes.&rdquo;
      </blockquote>

      <h2>Controlled Underwater Fermentation</h2>
      <p>The pulped parchment rests in clean concrete tanks for 36 to 48 hours. Natural enzymes and ambient microflora break down the pectin-rich mucilage. Our station managers continually monitor ambient temperature and pH levels to ensure complete mucilage breakdown without spontaneous over-fermentation.</p>

      <h2>Channel Washing & Density Separation</h2>
      <p>Once fermentation is complete, the coffee is pushed along long, serpentine concrete washing channels against flowing clean spring water. Dense, Grade 1 beans settle into the upper channel sections, while lighter seeds travel further downstream. This physical grading is the secret behind the consistency of Ethiopian Grade 1 washed green coffee.</p>
    `,
  },
  {
    id: "post-3",
    title: "Why Ethiopian Green Coffee Is Highly Valued in the Global Specialty Market",
    slug: "why-ethiopian-green-coffee-is-highly-valued",
    excerpt:
      "A deep dive into unmatched genetic biodiversity, extreme elevations, and why international roasters consider Ethiopian green coffee an essential cornerstone.",
    coverImage: { url: "/images/green-coffee-beans.jpg" },
    publishedAt: "2025-02-10T14:00:00.000Z",
    readingTime: 4,
    featured: false,
    category: {
      id: "cat-3",
      name: "Market & Trade",
      slug: "market-trade",
    },
    author: {
      name: "Takele Mamo",
      role: "Managing Director",
    },
    tags: [
      { tag: { id: "t-1", name: "Green Coffee" } },
      { tag: { id: "t-8", name: "Specialty Market" } },
      { tag: { id: "t-9", name: "Export" } },
    ],
    seoTitle: "Why Ethiopian Green Coffee Is Highly Valued | Lambek Coffee",
    seoDescription:
      "Understand the key drivers behind the global demand and high value of Ethiopian unroasted green coffee beans.",
    content: `
      <h2>The Global Benchmark of Complexity</h2>
      <p>For decades, Ethiopian green coffee has occupied the highest tier in international specialty cupping competitions and specialty cafes worldwide. Roasters from Tokyo to Oslo consider Ethiopian micro-lots indispensable components of their seasonal offerings.</p>

      <h2>1. Unmatched Genetic Diversity</h2>
      <p>While the rest of the world relies on a handful of Arabica varieties derived from Typica and Bourbon, Ethiopia is home to thousands of naturally occurring heirloom varieties and regional landraces. This genetic wealth produces taste profiles that simply cannot be replicated anywhere else on earth.</p>

      <h2>2. Extreme Altitude and Dense Cell Structure</h2>
      <p>In the Yirgacheffe and Gedeo highlands, coffee grows above 2,000 meters. The cool mountain nights slow cherry development, allowing sugars and organic acids to concentrate deeply inside the seed. The resulting bean is exceptionally dense, capable of withstanding high roasting heat while yielding extraordinary aroma.</p>

      <h2>3. The Premium of Single-Farm Traceability</h2>
      <p>As consumer demand shifts toward transparency, Lambek Coffee's single-farm traceability model bridges the gap between dedicated Ethiopian growers and quality-obsessed global buyers.</p>
    `,
  },
  {
    id: "post-4",
    title: "The Tradition Behind Ethiopian Coffee: Heritage, Terroir & Hand-Harvesting",
    slug: "tradition-behind-ethiopian-coffee-heritage-terroir",
    excerpt:
      "Where traditions meet aroma — how centuries of Ethiopian cultural heritage shape the dedication and care invested into every bag of green coffee.",
    coverImage: { url: "/images/blog-ethiopian-tradition.jpg" },
    publishedAt: "2025-02-22T11:15:00.000Z",
    readingTime: 5,
    featured: false,
    category: {
      id: "cat-1",
      name: "Origin & Heritage",
      slug: "origin-heritage",
    },
    author: {
      name: "Lambek Editorial",
      role: "Cultural Heritage",
    },
    tags: [
      { tag: { id: "t-10", name: "Tradition" } },
      { tag: { id: "t-11", name: "Heritage" } },
      { tag: { id: "t-3", name: "Yirgacheffe" } },
    ],
    seoTitle: "The Tradition Behind Ethiopian Coffee | Lambek Coffee",
    seoDescription:
      "Discover the rich cultural heritage and generational traditions that define Ethiopian specialty green coffee production.",
    content: `
      <h2>Where Traditions Meet Aroma</h2>
      <p>In Ethiopia, coffee (known locally as <em>Buna</em>) is far more than an agricultural commodity — it is woven into the very fabric of daily life, hospitality, and communal unity. As the ancient proverb goes, &ldquo;Buna dabo naw&rdquo; (Coffee is our bread).</p>

      <h2>Generational Agroforestry Knowledge</h2>
      <p>The farming families of the Gedeo zone have cultivated coffee for centuries without synthetic inputs, using traditional multi-layered garden systems that preserve native biodiversity, soil moisture, and wildlife habitats.</p>

      <blockquote>
        &ldquo;Our tagline 'Where Traditions Meet Aroma' encapsulates our core mission: honoring age-old Ethiopian coffee culture while delivering the highest standard of specialty green beans to the modern world.&rdquo;
      </blockquote>

      <h2>From Origin to Roastery</h2>
      <p>Every lot processed by Lambek Coffee carries the soul of these traditions — from the gentle hands of farmers harvesting crimson cherries to the meticulous care of our station managers and export grading teams.</p>
    `,
  },
];
