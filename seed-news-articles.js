import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample news articles in both English and Kinyarwanda
const newsArticles = [
  // POLITICS
  {
    title: "Perezida Kagame yavuze ku iterambere ry'u Rwanda",
    slug: "perezida-kagame-yavuze-ku-iterambere-ryu-rwanda",
    content: `
      <p>Perezida wa Repubulika y'u Rwanda, Paul Kagame, yavuze ko u Rwanda rugiye gukomeza gushyira imbere iterambere ry'ubukungu n'imibereho myiza y'abaturage.</p>
      
      <h2>Amagambo ya Perezida</h2>
      <p>Mu kiganiro yagiranye n'abanyamakuru, Perezida Kagame yashimangiye ko guverinoma izakomeza gushyira imbere:</p>
      <ul>
        <li>Iterambere ry'ubukungu</li>
        <li>Ubuzima bw'abaturage</li>
        <li>Uburezi bw'ireme</li>
        <li>Ibikorwa remezo</li>
      </ul>
      
      <h2>Intego za 2030</h2>
      <p>Perezida yashimangiye ko u Rwanda rugamije kuba igihugu cy'amajyambere menshi mu 2030, gifite ubukungu bukomeye kandi abaturage bafite ubuzima bwiza.</p>
      
      <p>Yongeye gushimira abaturage b'u Rwanda ku bufatanye n'uruhare bafite mu iterambere ry'igihugu.</p>
    `,
    excerpt: "Perezida Kagame yavuze ko u Rwanda rugiye gukomeza gushyira imbere iterambere ry'ubukungu n'imibereho myiza y'abaturage.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=500&fit=crop",
    categorySlug: "politics",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Politiki, Perezida Kagame, Iterambere, Rwanda",
    readTime: "5 min"
  },
  {
    title: "Parliament Approves New Economic Development Bill",
    slug: "parliament-approves-new-economic-development-bill",
    content: `
      <p>The Parliament has unanimously approved a new economic development bill aimed at boosting the country's GDP growth and creating more job opportunities.</p>
      
      <h2>Key Provisions</h2>
      <p>The bill includes several important provisions:</p>
      <ul>
        <li>Tax incentives for small businesses</li>
        <li>Investment in infrastructure projects</li>
        <li>Support for technology startups</li>
        <li>Agricultural modernization programs</li>
      </ul>
      
      <h2>Expected Impact</h2>
      <p>Economists predict that this bill will lead to a 15% increase in GDP growth over the next five years and create over 100,000 new jobs.</p>
      
      <p>The Prime Minister praised the Parliament for their swift action and commitment to economic development.</p>
    `,
    excerpt: "Parliament unanimously approves economic development bill expected to boost GDP by 15% and create 100,000 jobs.",
    imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=500&fit=crop",
    categorySlug: "politics",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Politics, Parliament, Economy, Development",
    readTime: "4 min"
  },

  // ECONOMICS
  {
    title: "Ubukungu bw'u Rwanda bwiyongereye 8.2% mu gihembwe cya kabiri",
    slug: "ubukungu-bwu-rwanda-bwiyongereye-82-mu-gihembwe-cya-kabiri",
    content: `
      <p>Raporo y'Ikigo cy'Ibarurishamibare mu Rwanda (NISR) yerekana ko ubukungu bw'u Rwanda bwiyongereye 8.2% mu gihembwe cya kabiri cy'umwaka wa 2025.</p>
      
      <h2>Inkomoko y'Iterambere</h2>
      <p>Iterambere ryatewe ahanini n'ibi bikurikira:</p>
      <ul>
        <li>Ubukerarugendo - 12% kuzamuka</li>
        <li>Ikoranabuhanga - 15% kuzamuka</li>
        <li>Ubuhinzi - 9% kuzamuka</li>
        <li>Inganda - 10% kuzamuka</li>
      </ul>
      
      <h2>Icyerekezo cy'Ejo</h2>
      <p>Abahanga bavuga ko ubukungu buzakomeza gukura mu gihembwe gitaha, bikaba byatewe n'ishoramari nyinshi n'iterambere ry'ibikorwa remezo.</p>
      
      <p>Minisitiri w'Ubukungu n'Imari yashimiye iterambere ryagezweho kandi yashimangiye ko guverinoma izakomeza gushyira imbere politiki zigamije iterambere rirambye.</p>
    `,
    excerpt: "Ubukungu bw'u Rwanda bwiyongereye 8.2% mu gihembwe cya kabiri, buterwa cyane cyane n'ubukerarugendo n'ikoranabuhanga.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    categorySlug: "economics",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Ubukungu, Iterambere, GDP, Rwanda",
    readTime: "6 min"
  },
  {
    title: "Rwanda Stock Exchange Hits Record High",
    slug: "rwanda-stock-exchange-hits-record-high",
    content: `
      <p>The Rwanda Stock Exchange (RSE) reached an all-time high today, with the main index closing at 2,450 points, marking a 25% increase year-to-date.</p>
      
      <h2>Market Performance</h2>
      <p>Several factors contributed to this historic milestone:</p>
      <ul>
        <li>Strong corporate earnings reports</li>
        <li>Increased foreign investment</li>
        <li>Positive economic indicators</li>
        <li>Government economic reforms</li>
      </ul>
      
      <h2>Top Performers</h2>
      <p>Banking and telecommunications sectors led the gains, with major companies posting double-digit growth.</p>
      
      <p>Market analysts predict continued growth in the coming quarters, driven by strong fundamentals and investor confidence.</p>
    `,
    excerpt: "Rwanda Stock Exchange reaches all-time high with 25% year-to-date growth driven by strong corporate performance.",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop",
    categorySlug: "economics",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Economics, Stock Market, Investment, Finance",
    readTime: "5 min"
  },

  // HEALTH
  {
    title: "Ibitaro bishya 5 bizafunguwa mu ntara zitandukanye",
    slug: "ibitaro-bishya-5-bizafunguwa-mu-ntara-zitandukanye",
    content: `
      <p>Minisiteri y'Ubuzima yatangaje ko ibitaro bishya 5 bizafunguwa mu ntara zitandukanye mu mezi atatu aza, bigamije kongera ubushobozi bwo gutanga serivisi z'ubuzima.</p>
      
      <h2>Aho Bizubakwa</h2>
      <p>Ibitaro bizubakwa muri ibi bice:</p>
      <ul>
        <li>Bugesera - Ibitaro rifite ibitanda 200</li>
        <li>Nyagatare - Ibitaro rifite ibitanda 150</li>
        <li>Rusizi - Ibitaro rifite ibitanda 180</li>
        <li>Gicumbi - Ibitaro rifite ibitanda 160</li>
        <li>Nyamasheke - Ibitaro rifite ibitanda 140</li>
      </ul>
      
      <h2>Serivisi Zitangwa</h2>
      <p>Ibitaro bizatanga serivisi zikurikira:</p>
      <ul>
        <li>Serivisi rusange z'ubuzima</li>
        <li>Kubaga</li>
        <li>Laboratwari</li>
        <li>Radiyo</li>
        <li>Serivisi z'ubuvuzi bw'ihutirwa</li>
      </ul>
      
      <p>Minisitiri w'Ubuzima yavuze ko ibi bitaro bizafasha kugabanya ingorane z'abaturage mu kubona serivisi z'ubuzima.</p>
    `,
    excerpt: "Ibitaro bishya 5 bizafunguwa mu ntara zitandukanye mu mezi atatu aza, bifite ubushobozi bw'ibitanda 830.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop",
    categorySlug: "health",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Ubuzima, Ibitaro, Serivisi, Iterambere",
    readTime: "4 min"
  },
  {
    title: "New Vaccination Campaign Reaches 2 Million Children",
    slug: "new-vaccination-campaign-reaches-2-million-children",
    content: `
      <p>The Ministry of Health announced that the national vaccination campaign has successfully reached 2 million children across the country, exceeding initial targets.</p>
      
      <h2>Campaign Success</h2>
      <p>The campaign focused on protecting children against:</p>
      <ul>
        <li>Measles</li>
        <li>Polio</li>
        <li>Tuberculosis</li>
        <li>Hepatitis B</li>
        <li>Pneumonia</li>
      </ul>
      
      <h2>Community Participation</h2>
      <p>The success was attributed to strong community mobilization, trained health workers, and effective communication strategies.</p>
      
      <p>Health officials praised parents for their cooperation and emphasized the importance of maintaining high vaccination coverage.</p>
    `,
    excerpt: "National vaccination campaign successfully reaches 2 million children, exceeding targets and protecting against major diseases.",
    imageUrl: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&h=500&fit=crop",
    categorySlug: "health",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Health, Vaccination, Children, Healthcare",
    readTime: "5 min"
  },

  // SPORTS
  {
    title: "Rayon Sports yatsitse APR FC 2-1 mu mukino w'ingenzi",
    slug: "rayon-sports-yatsitse-apr-fc-2-1-mu-mukino-wingenzi",
    content: `
      <p>Rayon Sports yakomeje urugendo rwayo rwo kwegera igikombe cy'umwaka wa 2025 nyuma yo gutsinda APR FC 2-1 mu mukino w'ingenzi wakinwe ku kibuga cya Kigali.</p>
      
      <h2>Imikino Yagenze Gute</h2>
      <p>Umukino wakoze ku wa gatandatu ku munsi wa 29 Ukwakira 2025. Rayon Sports yatsinze APR FC 2-1 mu mukino wari uzuye abantu.</p>
      
      <p>Ibitego byatsinzwe na:</p>
      <ul>
        <li>Djabel Manishimwe - Igihe: 23'</li>
        <li>Kevin Muhire - Igihe: 67'</li>
        <li>APR FC - Innocent Nshuti - Igihe: 85'</li>
      </ul>
      
      <h2>Amanota</h2>
      <p>Nyuma y'uyu mukino, Rayon Sports ifite amanota 48 kandi ikomeza ku mwanya wa mbere mu isonga. APR FC iri ku mwanya wa kabiri ifite amanota 45.</p>
      
      <h2>Umutoza Avuga</h2>
      <p>Umutoza wa Rayon Sports, Robertinho Oliveira, yavuze: "Twatsinze neza ariko tugomba gukomeza gukora cyane. Shampiyona ntabwo yararangiye."</p>
      
      <p>Rayon Sports izakina umukino utaha na Mukura Victory Sports ku wa gatanu.</p>
    `,
    excerpt: "Rayon Sports yatsitse APR FC 2-1 mu mukino w'ingenzi, ikomeza ku mwanya wa mbere mu isonga.",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=500&fit=crop",
    categorySlug: "sports",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Siporo, Rayon Sports, APR FC, Umupira w'amaguru",
    readTime: "4 min"
  },
  {
    title: "Rwanda National Team Qualifies for AFCON 2026",
    slug: "rwanda-national-team-qualifies-for-afcon-2026",
    content: `
      <p>The Rwanda National Football Team has qualified for the Africa Cup of Nations (AFCON) 2026 after a stunning 3-0 victory over their rivals in the final qualifying match.</p>
      
      <h2>Historic Achievement</h2>
      <p>This marks Rwanda's first AFCON qualification in over a decade, bringing joy to millions of fans across the country.</p>
      
      <h2>Match Highlights</h2>
      <ul>
        <li>First Goal: Muhadjiri Hakizimana (15')</li>
        <li>Second Goal: Innocent Nshuti (42')</li>
        <li>Third Goal: Djabel Manishimwe (78')</li>
      </ul>
      
      <h2>Coach's Reaction</h2>
      <p>Head coach Torsten Spittler expressed his pride: "This is a historic moment for Rwandan football. The players showed great determination and skill."</p>
      
      <p>Celebrations erupted across the country as fans took to the streets to celebrate this momentous achievement.</p>
    `,
    excerpt: "Rwanda National Team makes history by qualifying for AFCON 2026 with a commanding 3-0 victory.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
    categorySlug: "sports",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Sports, Football, AFCON, National Team, Rwanda",
    readTime: "5 min"
  },

  // ENTERTAINMENT
  {
    title: "Filime nshya y'Umunyarwanda 'Inzozi' yatsinze ibihembo 3 muri Afrika",
    slug: "filime-nshya-yumunyarwanda-inzozi-yatsinze-ibihembo-3-muri-afrika",
    content: `
      <p>Filime 'Inzozi' yakozwe n'umukinnyi n'umuyobozi w'Umunyarwanda Eric Kabera yatsinze ibihembo 3 mu iserukiramuco mpuzamahanga ry'amafilime muri Afrika ryabereye i Nairobi, Kenya.</p>
      
      <h2>Ibihembo Yatsindiye</h2>
      <ul>
        <li>Filime nziza yo muri Afrika</li>
        <li>Umuyobozi mwiza</li>
        <li>Umukinnyi mwiza (Clementine Dusabimana)</li>
      </ul>
      
      <h2>Ibyerekeye Filime</h2>
      <p>Filime 'Inzozi' ivuga ku nzozi z'umukobwa ukiri muto wifuza kuba umukinnyi wa filime, ariko ahura n'ingorane nyinshi mu nzira ye.</p>
      
      <p>Filime yakoze mu Rwanda kandi ikoresha abakinnyi b'Abanyarwanda. Yafashwe mu turere dutandukanye tw'u Rwanda.</p>
      
      <h2>Umuyobozi Avuga</h2>
      <p>Eric Kabera yavuze: "Ibi bihembo ni intsinzi y'amafilime y'u Rwanda. Biri kwerekana ko dufite ubushobozi bwo gukora amafilime meza."</p>
      
      <p>Filime izatangira kwerekwa mu makinamico y'u Rwanda kuva ku wa mbere Ugushyingo.</p>
    `,
    excerpt: "Filime 'Inzozi' y'Umunyarwanda yatsinze ibihembo 3 mu iserukiramuco mpuzamahanga ry'amafilime muri Afrika.",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=500&fit=crop",
    categorySlug: "entertainment",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Imyidagaduro, Amafilime, Rwanda, Ibihembo",
    readTime: "4 min"
  },
  {
    title: "International Music Festival Coming to Kigali",
    slug: "international-music-festival-coming-to-kigali",
    content: `
      <p>Kigali will host the East African Music Festival next month, featuring over 50 artists from across the region and international stars.</p>
      
      <h2>Festival Highlights</h2>
      <p>The three-day festival will feature:</p>
      <ul>
        <li>Live performances from top African artists</li>
        <li>International headliners</li>
        <li>Cultural exhibitions</li>
        <li>Food and craft markets</li>
        <li>Youth talent showcases</li>
      </ul>
      
      <h2>Expected Attendance</h2>
      <p>Organizers expect over 50,000 attendees from across East Africa and beyond.</p>
      
      <h2>Economic Impact</h2>
      <p>The festival is expected to boost tourism and generate significant revenue for local businesses.</p>
      
      <p>Tickets are now available online and at selected outlets across the city.</p>
    `,
    excerpt: "Kigali to host major international music festival featuring 50+ artists and expected 50,000 attendees.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop",
    categorySlug: "entertainment",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Entertainment, Music, Festival, Kigali, Tourism",
    readTime: "5 min"
  },

  // TECHNOLOGY
  {
    title: "Rwanda Launches First Locally-Made Smartphone",
    slug: "rwanda-launches-first-locally-made-smartphone",
    content: `
      <p>Rwanda has launched its first locally-assembled smartphone, marking a significant milestone in the country's technology sector.</p>
      
      <h2>Product Features</h2>
      <p>The smartphone, named "Mara Phone," includes:</p>
      <ul>
        <li>5.7-inch HD display</li>
        <li>Dual camera system</li>
        <li>4G LTE connectivity</li>
        <li>Android operating system</li>
        <li>Long-lasting battery</li>
      </ul>
      
      <h2>Local Manufacturing</h2>
      <p>The phones are assembled at a factory in Kigali, creating jobs and building technical capacity.</p>
      
      <h2>Affordability</h2>
      <p>Priced competitively, the phone aims to make smartphone technology accessible to more Rwandans.</p>
      
      <p>The launch represents Rwanda's commitment to becoming a technology hub in Africa.</p>
    `,
    excerpt: "Rwanda launches first locally-assembled smartphone, marking milestone in technology sector development.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=500&fit=crop",
    categorySlug: "technology",
    isBreaking: true,
    isFeatured: true,
    status: "published",
    tags: "Technology, Innovation, Smartphone, Manufacturing, Rwanda",
    readTime: "4 min"
  },

  // EDUCATION
  {
    title: "Kaminuza nshya y'ikoranabuhanga izafunguwa mu 2026",
    slug: "kaminuza-nshya-yikoranabuhanga-izafunguwa-mu-2026",
    content: `
      <p>Minisiteri y'Uburezi yatangaje ko kaminuza nshya yihariye ku koranabuhanga izafunguwa mu 2026, igamije guteza imbere ubumenyi bw'ikoranabuhanga mu Rwanda.</p>
      
      <h2>Amasomo Azatangwa</h2>
      <ul>
        <li>Ubuhanga bwa mudasobwa (Computer Science)</li>
        <li>Ubwubatsi bw'ikoranabuhanga (Engineering)</li>
        <li>Ubuhanga bw'amakuru (Information Technology)</li>
        <li>Ubuhanga bw'ibanze (Artificial Intelligence)</li>
        <li>Cybersecurity</li>
      </ul>
      
      <h2>Ubushobozi</h2>
      <p>Kaminuza izashobora kwakira abanyeshuri 5,000 ku mwaka, kandi izaba ifite abarimu b'inararibonye baturutse mu mahanga.</p>
      
      <h2>Ibikorwa Remezo</h2>
      <p>Kaminuza izaba ifite:</p>
      <ul>
        <li>Laboratwari zigezweho</li>
        <li>Isomero rikomeye</li>
        <li>Amazu y'abanyeshuri</li>
        <li>Ibikoresho bya siporo</li>
      </ul>
      
      <p>Minisitiri w'Uburezi yavuze ko kaminuza izafasha guteza imbere ubumenyi bw'ikoranabuhanga mu Rwanda.</p>
    `,
    excerpt: "Kaminuza nshya y'ikoranabuhanga izafunguwa mu 2026, izashobora kwakira abanyeshuri 5,000.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
    categorySlug: "education",
    isBreaking: false,
    isFeatured: true,
    status: "published",
    tags: "Uburezi, Kaminuza, Ikoranabuhanga, Iterambere",
    readTime: "5 min"
  }
];

async function seedNewsArticles() {
  try {
    console.log('🌱 Starting to seed news articles...\n');

    // Get admin user (first user in database)
    const adminUser = await prisma.user.findFirst();
    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      return;
    }

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    let successCount = 0;
    let errorCount = 0;

    for (const article of newsArticles) {
      try {
        const categoryId = categoryMap[article.categorySlug];
        if (!categoryId) {
          console.log(`⚠️  Category '${article.categorySlug}' not found, skipping article: ${article.title}`);
          errorCount++;
          continue;
        }

        await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            content: article.content,
            excerpt: article.excerpt,
            imageUrl: article.imageUrl,
            authorId: adminUser.id,
            categoryId: categoryId,
            isBreaking: article.isBreaking,
            isFeatured: article.isFeatured,
            status: article.status,
            tags: article.tags,
            readTime: article.readTime,
            publishedAt: new Date(),
            views: Math.floor(Math.random() * 5000) + 100 // Random views between 100-5100
          }
        });

        console.log(`✅ Created: ${article.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating article '${article.title}':`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${successCount} articles`);
    console.log(`❌ Failed: ${errorCount} articles`);
    console.log(`\n🎉 Seeding completed!`);

  } catch (error) {
    console.error('❌ Error seeding articles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNewsArticles();
