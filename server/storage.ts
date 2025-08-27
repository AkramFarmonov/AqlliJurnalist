import { type User, type InsertUser, type Article, type InsertArticle, type Trend, type InsertTrend, type ChatMessage, type InsertChatMessage, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Articles
  getArticles(limit?: number, category?: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticleStats(id: string, field: 'views' | 'comments' | 'shares'): Promise<void>;
  searchArticles(query: string): Promise<Article[]>;

  // Trends
  getTrends(): Promise<Trend[]>;
  createTrend(trend: InsertTrend): Promise<Trend>;
  updateTrend(id: string, data: Partial<Trend>): Promise<Trend | undefined>;

  // Chat Messages
  getChatMessages(limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Analytics
  getAnalytics(): Promise<Analytics | undefined>;
  updateAnalytics(data: Partial<Analytics>): Promise<Analytics>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;
  private trends: Map<string, Trend>;
  private chatMessages: Map<string, ChatMessage>;
  private analytics: Analytics;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.trends = new Map();
    this.chatMessages = new Map();
    this.analytics = {
      id: randomUUID(),
      dailyReads: 12500,
      aiArticles: 156,
      activeUsers: 3200,
      topCategory: "AI & Texnologiya",
      topCategoryPercent: 68,
      date: new Date(),
    };

    // Initialize with some sample data
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    // Sample trends
    await this.createTrend({ topic: "#AI_Uzbekistan", posts: 1200, changePercent: 15 });
    await this.createTrend({ topic: "#Blockchain", posts: 890, changePercent: 8 });
    await this.createTrend({ topic: "#ITpark", posts: 654, changePercent: -2 });
    await this.createTrend({ topic: "#Startup", posts: 432, changePercent: 12 });

    // Sample chat message
    await this.createChatMessage({
      message: "Salom! Men sizga yangiliklar va trendlar haqida savollarga javob beraman. Nimani bilmoqchisiz?",
      isBot: true,
    });

    // If no articles exist, populate with sample content
    if (this.articles.size === 0) {
      try {
        await this.seedArticles();
      } catch (error) {
        console.log("AI generation failed, creating sample articles...");
        await this.createSampleArticles();
      }
    }
  }

  private async seedArticles() {
    const { generateArticle } = await import("./services/gemini");
    const { fetchImageByKeyword } = await import("./services/unsplash");
    
    const topics = [
      "Kvant kompyuterlarining kelajagi",
      "Toshkentda elektromobillar infratuzilmasi", 
      "O'zbekistonning IT eksport salohiyati",
      "Marsni o'zlashtirish missiyalari",
      "Blokcheyn texnologiyasi va uning qo'llanilishi",
      "Startap ekotizimini rivojlantirish",
      "Kibertxavfsizlikning zamonaviy tahdidlari",
      "Bulutli texnologiyalar biznes uchun",
      "Mobil ilovalar bozori trendlari",
      "Raqamli marketingdagi yangi vositalar",
      "O'zbekiston raqamli iqtisodiyoti",
      "Sun'iy intellekt va ta'lim tizimi",
      "IoT texnologiyalari qishloq xo'jaligida",
      "5G tarmoqlari va ularning imkoniyatlari",
      "Virtual va kengaytirilgan reallik dasturlari"
    ];

    const categories = [
      "Texnologiya", "Transport", "IT va Biznes", "Kosmik fanlar", 
      "Blokcheyn", "Startap", "Kibertxavfsizlik", "Bulutli xizmatlar",
      "Mobil texnologiyalar", "Marketing", "Raqamli iqtisodiyot", "Ta'lim",
      "Qishloq xo'jaligi", "Aloqa texnologiyalari", "Virtual reallik"
    ];

    console.log("🚀 Initializing storage with AI-generated articles...");
    
    let successfulArticles = 0;
    for (let i = 0; i < topics.length; i++) {
      try {
        const topic = topics[i];
        const category = categories[i];
        
        console.log(`📝 Generating article ${i + 1}/15: "${topic}"`);
        
        const generatedArticle = await generateArticle(topic, category);
        
        // Fetch relevant image from Unsplash
        const imageUrl = await fetchImageByKeyword(topic);
        
        await this.createArticle({
          title: generatedArticle.title,
          summary: generatedArticle.summary,
          content: generatedArticle.content,
          category: generatedArticle.category,
          tags: generatedArticle.tags,
          isAiGenerated: true,
          imageUrl: imageUrl
        });
        
        console.log(`✅ Article created: ${generatedArticle.title}`);
        successfulArticles++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to generate article ${i + 1}:`, error);
      }
    }
    
    // If no articles were generated successfully, throw error to trigger fallback
    if (successfulArticles === 0) {
      throw new Error("Failed to generate any articles due to API quota limits");
    }
    
    console.log(`🎉 Storage initialized with ${this.articles.size} articles!`);
  }

  private async createSampleArticles() {
    const sampleArticles = [
      {
        title: "Kvant kompyuterlarining kelajagi: texnologiyaning yangi davri",
        summary: "Kvant kompyuterlari an'anaviy kompyuterlardan minglap marta tezroq ishlaydi va murakkab masalalarni hal qilish imkonini beradi.",
        content: "Kvant kompyuterlari zamonaviy texnologiyaning eng muhim yutuqlaridan biri hisoblanadi. Ular an'anaviy kompyuterlardan farqli ravishda kvant mexanikasi qonunlaridan foydalanadi. Bu esa ularga bir vaqtda ko'plab hisob-kitoblarni parallel ravishda bajarishga imkon beradi. Google, IBM va boshqa yirik kompaniyalar kvant kompyuterlarini rivojlantirishga milliardlab dollar sarmoya kiritmoqda. Kelajakda bu texnologiya tibbiyot, moliya va kriptografiya sohalarida inqilob yasashi kutilmoqda.",
        category: "Texnologiya",
        tags: ["kvant", "kompyuter", "fan", "texnologiya"],
        isAiGenerated: false
      },
      {
        title: "Toshkentda elektromobillar infratuzilmasi rivojlanmoqda",
        summary: "O'zbekiston poytaxtida elektromobillar uchun zaryadlash stansiyalari faol o'rnatilmoqda.",
        content: "Toshkent shahrida transport tizimini modernizatsiya qilish doirasida elektromobillar infratuzilmasi jadal rivojlanmoqda. Hozirda shaharda 50 dan ortiq zaryadlash stantsiyasi mavjud bo'lib, 2025 yilgacha bu raqam 200 taga yetkazilishi rejalashtirilgan. Bu tashabbusning maqsadi havoning ifloslanishini kamaytirish va yashil transport turlarini rag'batlantirish hisoblanadi.",
        category: "Transport",
        tags: ["elektromobil", "Toshkent", "infratuzilma", "ekologiya"],
        isAiGenerated: false
      },
      {
        title: "O'zbekistonning IT eksport salohiyati: imkoniyatlar va istiqbollar",
        summary: "Mamlakat IT xizmatlarini eksport qilish borasida sezilarli yutuqlarga erishmoqda.",
        content: "So'nggi yillarda O'zbekistonda IT sohasining rivojlanishi kuzatilmoqda. 2023 yilda mamlakatdan IT xizmatlarini eksport hajmi 2.5 milliard dollarni tashkil etdi. Toshkent shahrida 300 dan ortiq IT kompaniya faoliyat yuritmoqda. Hukumat tomonidan IT sohani qo'llab-quvvatlash maqsadida maxsus soliq imtiyozlari va IT parklar tashkil etilgan.",
        category: "IT va Biznes",
        tags: ["IT", "eksport", "O'zbekiston", "texnologiya"],
        isAiGenerated: false
      },
      {
        title: "Sun'iy intellekt va ta'lim tizimi: yangi imkoniyatlar",
        summary: "AI texnologiyalari ta'lim jarayonini tubdan o'zgartirib, shaxsiy yondashuvni ta'minlaydi.",
        content: "Sun'iy intellekt ta'lim sohasida inqilob yaratmoqda. Shaxsiy o'quv rejalari, avtomatik baholash tizimi va aqlli darslik dasturlari o'quvchilarning bilim olish samaradorligini oshirmoqda. O'zbekiston universitetlari ham AI texnologiyalarini joriy etishni boshlagan. Bu yangi yondashuv har bir talabaning individual ehtiyojlariga moslashtirilgan ta'lim olishiga yordam beradi.",
        category: "Ta'lim",
        tags: ["AI", "ta'lim", "texnologiya", "innovatsiya"],
        isAiGenerated: false
      },
      {
        title: "Blokcheyn texnologiyasi va uning amaliy qo'llanilishi",
        summary: "Blokcheyn nafaqat kriptovalyuta, balki ko'plab sohalarda inqilobiy o'zgarishlar olib kelmoqda.",
        content: "Blokcheyn texnologiyasi zamonaviy dunyoda keng qo'llanilmoqda. U nafaqat Bitcoin va boshqa kriptovalyutalar uchun asos bo'lib xizmat qiladi, balki logistika, sog'liqni saqlash va qishloq xo'jaligi kabi sohalarda ham foydalaniladi. Bu texnologiya ma'lumotlarning xavfsiz va o'zgarmas saqlashini ta'minlaydi, shuningdek, vorisitchilarni yo'q qiladi.",
        category: "Blokcheyn",
        tags: ["blokcheyn", "kriptovalyuta", "xavfsizlik", "texnologiya"],
        isAiGenerated: false
      },
      {
        title: "5G aloqa tarmoqlari: kelajakning internet tezligi",
        summary: "5G texnologiyasi internetning tezligini 100 barobar oshirib, yangi imkoniyatlar yaratmoqda.",
        content: "5G tarmoqlari internetning navbatdagi avlodi hisoblanadi. Bu texnologiya soniyada gigabaytlab ma'lumot uzatish imkonini beradi. O'zbekistonda ham 5G tarmoqlarini sinovdan o'tkazish boshlangan. Bu texnologiya avtomatlashtirish, masofaviy jarrohlik va virtual reallik sohasida yangi imkoniyatlar yaratadi.",
        category: "Aloqa",
        tags: ["5G", "internet", "aloqa", "tezlik"],
        isAiGenerated: false
      },
      {
        title: "Startap ekotizimi: yosh tadbirkorlar uchun imkoniyatlar",
        summary: "O'zbekistonda startap madaniyati rivojlanib, yosh tadbirkorlar uchun keng imkoniyatlar yaratilmoqda.",
        content: "Mamlakatda startap ekotizimi jadal rivojlanmoqda. IT Park, UzDigital va boshqa tashkilotlar yosh tadbirkorlarga moliyaviy yordam va mentorlik xizmatlari ko'rsatmoqda. 2023 yilda O'zbekiston startaplarini jami 50 million dollar investitsiya jalb qildi. Bu ko'rsatkich yildan-yilga o'sib bormoqda.",
        category: "Biznes",
        tags: ["startap", "tadbirkorlik", "investitsiya", "innovatsiya"],
        isAiGenerated: false
      },
      {
        title: "Kibertxavfsizlik: raqamli dunyodagi xavflar va himoya usullari",
        summary: "Internet foydalanishining o'sishi bilan kibertxavfsizlik masalalari ham dolzarblashmoqda.",
        content: "Zamonaviy dunyoda kibertxavfsizlik muhim masala hisoblanadi. Haker hujumlari, ma'lumotlar o'g'irlanishi va raqamli firibgarlik hollari ko'paymoqda. Shaxsiy ma'lumotlarni himoya qilish uchun kuchli parollar, ikki bosqichli autentifikatsiya va xavfsizlik dasturlari ishlatish zarur. O'zbekistonda ham kibertxavfsizlik bo'yicha mutaxassislar tayyorlash boshlangan.",
        category: "Xavfsizlik",
        tags: ["kibertxavfsizlik", "haker", "himoya", "internet"],
        isAiGenerated: false
      },
      {
        title: "IoT texnologiyalari qishloq xo'jaligida: smart fermalar davri",
        summary: "Internet of Things texnologiyalari qishloq xo'jaligini modernizatsiya qilish va hosildorlikni oshirish uchun ishlatilmoqda.",
        content: "IoT (Internetga ulangan narsalar) texnologiyalari qishloq xo'jaligida keng qo'llanilmoqda. Smart fermalarda sensorlar orqali tuproq namligi, havo harorati va o'simliklarning holati nazorat qilinadi. Bu ma'lumotlar asosida suv berish va o'g'itlash avtomatik ravishda amalga oshiriladi. Natijada hosildorlik 30% gacha oshadi va resurslarga tejamkor yondashuv ta'minlanadi.",
        category: "Qishloq xo'jaligi",
        tags: ["IoT", "smart ferma", "qishloq xo'jaligi", "avtomatlashtirish"],
        isAiGenerated: false
      },
      {
        title: "Virtual va AR texnologiyalar: haqiqatning yangi ko'rinishi",
        summary: "Virtual va kengaytirilgan reallik texnologiyalari o'yin-kulgi sanoatidan tashqari ko'plab sohalarda qo'llanilmoqda.",
        content: "Virtual Reality (VR) va Augmented Reality (AR) texnologiyalari nafaqat o'yinlar uchun, balki ta'lim, tibbiyot va muhandislik sohalarida ham faol ishlatilmoqda. VR orqali jarrohlar operatsiyalarni mashq qiladi, me'morlar binolarni virtual muhitda loyihalaydi. AR esa real dunyoga raqamli ma'lumotlarni qo'shib, yangi imkoniyatlar yaratadi.",
        category: "Virtual Reality",
        tags: ["VR", "AR", "virtual reallik", "texnologiya"],
        isAiGenerated: false
      },
      {
        title: "Raqamli to'lovlar tizimi: naqdsiz jamiyatga yo'l",
        summary: "Mobil to'lovlar va raqamli valyutalar an'anaviy bank xizmatlarini o'zgartirmoqda.",
        content: "Raqamli to'lovlar tizimi kundan-kunga keng tarqalmoqda. Mobil ilovalar orqali to'lovlar amalga oshirish, kriptovalyutalar va CBDClar (markaziy bank raqamli valyutalari) moliyaviy tizimni o'zgartirib bormoqda. O'zbekistonda ham Click, Payme va boshqa raqamli to'lov tizimlari faol ishlatilmoqda. Bu tizimlar to'lovlarni tez va xavfsiz qilishga yordam beradi.",
        category: "Moliya",
        tags: ["raqamli to'lov", "mobil", "moliya", "kriptovalyuta"],
        isAiGenerated: false
      },
      {
        title: "Kosmik sanoat rivojlanishi: O'zbekiston kosmosga qadam qo'ymoqda",
        summary: "O'zbekiston o'zining birinchi sun'iy yo'ldoshini uchirishga tayyorlanmoqda va kosmik texnologiyalar sohasida faol ishlamoqda.",
        content: "O'zbekiston kosmik texnologiyalar sohasiga katta e'tibor bermoqda. Mamlakatning birinchi sun'iy yo'ldoshi 'O'zbekiston-sat' ni yaratish ustida ish olib borilmoqda. Bu loyiha telekommunikatsiya, meteorologiya va qishloq xo'jaligi kabi sohalarda foydalanish uchun mo'ljallangan. Shuningdek, yoshlarni kosmik fanlar bilan qiziqtirish maqsadida maxsus ta'lim dasturlari ishlab chiqilmoqda.",
        category: "Kosmik texnologiya",
        tags: ["kosmik", "sun'iy yo'ldosh", "O'zbekiston", "texnologiya"],
        isAiGenerated: false
      }
    ];

    for (const articleData of sampleArticles) {
      await this.createArticle(articleData);
      console.log(`✅ Sample article created: ${articleData.title}`);
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Articles
  async getArticles(limit: number = 10, category?: string): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (category && category !== "Hammasi") {
      articles = articles.filter(article => article.category === category);
    }
    
    return articles
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  async getArticle(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      tags: insertArticle.tags || [],
      isAiGenerated: insertArticle.isAiGenerated || false,
      imageUrl: insertArticle.imageUrl || null,
      views: 0,
      comments: 0,
      shares: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticleStats(id: string, field: 'views' | 'comments' | 'shares'): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      const currentValue = article[field] || 0;
      article[field] = currentValue + 1;
      this.articles.set(id, article);
    }
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const lowercaseQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.category.toLowerCase().includes(lowercaseQuery) ||
      (article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
    );
  }

  // Trends
  async getTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values())
      .sort((a, b) => (b.posts || 0) - (a.posts || 0));
  }

  async createTrend(insertTrend: InsertTrend): Promise<Trend> {
    const id = randomUUID();
    const trend: Trend = {
      ...insertTrend,
      id,
      posts: insertTrend.posts || 0,
      changePercent: insertTrend.changePercent || 0,
      updatedAt: new Date(),
    };
    this.trends.set(id, trend);
    return trend;
  }

  async updateTrend(id: string, data: Partial<Trend>): Promise<Trend | undefined> {
    const trend = this.trends.get(id);
    if (trend) {
      const updatedTrend = { ...trend, ...data, updatedAt: new Date() };
      this.trends.set(id, updatedTrend);
      return updatedTrend;
    }
    return undefined;
  }

  // Chat Messages
  async getChatMessages(limit: number = 20): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => {
        const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return aTime - bTime;
      })
      .slice(-limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      isBot: insertMessage.isBot || false,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // Analytics
  async getAnalytics(): Promise<Analytics | undefined> {
    return this.analytics;
  }

  async updateAnalytics(data: Partial<Analytics>): Promise<Analytics> {
    this.analytics = { ...this.analytics, ...data };
    return this.analytics;
  }
}

export const storage = new MemStorage();
