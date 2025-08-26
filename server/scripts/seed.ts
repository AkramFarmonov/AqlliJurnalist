import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { articles } from "../../shared/schema";
import { generateArticle } from "../services/gemini";

// Initialize database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// 15 diverse and interesting topics in Uzbek
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

// Categories for different topics
const categories = [
  "Texnologiya", "Transport", "IT va Biznes", "Kosmik fanlar", 
  "Blokcheyn", "Startap", "Kibertxavfsizlik", "Bulutli xizmatlar",
  "Mobil texnologiyalar", "Marketing", "Raqamli iqtisodiyot", "Ta'lim",
  "Qishloq xo'jaligi", "Aloqa texnologiyalari", "Virtual reallik"
];

async function main() {
  console.log("🚀 Database seeding started...");
  
  try {
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      const category = categories[i];
      
      console.log(`📝 Generating article ${i + 1}/15: "${topic}"`);
      
      // Generate article using AI
      const generatedArticle = await generateArticle(topic, category);
      
      // Insert into database
      const [savedArticle] = await db.insert(articles).values({
        title: generatedArticle.title,
        summary: generatedArticle.summary,
        content: generatedArticle.content,
        category: generatedArticle.category,
        tags: generatedArticle.tags,
        isAiGenerated: true,
        imageUrl: null,
        views: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 25)
      }).returning();
      
      console.log(`✅ Successfully generated and saved article: ${savedArticle.title}`);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Total articles created: ${topics.length}`);
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Execute the seeding script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});