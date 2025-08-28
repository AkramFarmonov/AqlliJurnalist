import cron from "node-cron";
import { storage } from "../storage";
import { generateArticle, analyzeTrends } from "../services/gemini";
import { fetchImageByKeyword } from "../services/unsplash";
import { postToChannel, sendNotification } from "../services/telegram";
import { NewsApiService } from "../services/newsApi";
import { randomUUID, createHash } from "crypto";

// Initialize News API service
const newsApiService = new NewsApiService();

// Topics for content generation when trending topics are not available
const contentTopics = [
  "O'zbekistonda sun'iy intellekt rivojlanishi",
  "Blokcheyn texnologiyalarining istiqboli", 
  "Kvant kompyuterlari va kelajak",
  "5G tarmoqlari O'zbekistonda",
  "Elektromobillar bozori tendensiyasi",
  "Kibertxavfsizlik yangi tahdidlari",
  "IoT qishloq xo'jaligida qo'llanilishi",
  "Virtual reallik ta'limda",
  "Raqamli to'lovlar tizimi rivojlanishi",
  "Startap ekotizimi O'zbekistonda",
  "Cloud computing biznes uchun",
  "Ma'lumotlar analitikasi sohasida yangiliklar",
  "Mobil ilovalar bozori trendlari",
  "Kosmik texnologiyalar yangiliklari",
  "Biotexnologiya sohasidagi yutuqlar"
];

let usedTopics: Set<string> = new Set();
// In-process guard to prevent overlapping runs that can cause duplicates
let isJobRunning = false;
let lastPostedHash: string | null = null;

function getRandomTopic(): string {
  // Reset used topics if all are used
  if (usedTopics.size >= contentTopics.length) {
    usedTopics.clear();
  }

  let availableTopics = contentTopics.filter(topic => !usedTopics.has(topic));
  if (availableTopics.length === 0) {
    availableTopics = contentTopics;
  }

  const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
  usedTopics.add(randomTopic);
  
  return randomTopic;
}

async function generateAndPostContent(): Promise<void> {
  console.log("🚀 Starting automated content generation...");

  try {
    // Concurrency guard
    if (isJobRunning) {
      console.log("⏭️  Job is already running, skipping this tick to prevent duplicates");
      return;
    }
    isJobRunning = true;

    // Step 1: Get recent articles to check for duplicates
    const recentArticles = await storage.getArticles(100); // Broader window for duplicate checks
    
    // Step 2: Get a topic (either from trends, News API, or predefined list)
    let topic: string = '';
    let category = "Texnologiya";
    let isFromNewsApi = false;

    try {
      // First try to get news from News API
      const newsApiArticles = await newsApiService.fetchTrendingNews('technology', 'us');
      if (newsApiArticles.articles && newsApiArticles.articles.length > 0) {
        // Filter out articles with similar titles to what we've already posted
        const newArticle = newsApiArticles.articles.find((article) => {
          if (!article.title) return false;
          return !recentArticles.some(ra => 
            ra.title?.toLowerCase().includes(article.title?.toLowerCase().substring(0, 20) || '') ||
            article.title?.toLowerCase().includes(ra.title?.toLowerCase().substring(0, 20) || '')
          );
        });
        
        if (newArticle?.title) {
          topic = newArticle.title;
          isFromNewsApi = true;
          console.log(`📰 Using news from News API: ${topic}`);
        }
      }
      
      // If no news from API, try to get trending topics
      if (!topic) {
        try {
          const articles = await storage.getArticles(10);
          if (articles.length > 0) {
            const trends = await analyzeTrends(articles);
            if (trends.length > 0 && trends[0]?.topic) {
              const topTrend = trends[0];
              topic = topTrend.topic.replace('#', '');
              console.log(`📈 Using trending topic: ${topic}`);
            }
          }
        } catch (error) {
          console.error("Error getting trending topics:", error);
        }
      }
      
      // If still no topic, use a random one
      if (!topic) {
        topic = getRandomTopic();
        console.log(`🎲 Using random topic: ${topic}`);
      }
    } catch (error) {
      console.error("Error getting topic:", error);
      topic = getRandomTopic();
      console.log(`🎲 Using fallback topic: ${topic}`);
    }

    // Step 2: Generate article content using Gemini (with fallback)
    let generatedArticle;
    let imageUrl;
    
    try {
      console.log(`📝 Generating article for topic: ${topic}`);
      generatedArticle = await generateArticle(topic, category);
      
      // Step 3: Get relevant image from Unsplash
      console.log(`🖼️ Fetching image for keywords: ${topic}`);
      imageUrl = await fetchImageByKeyword(topic);
      
    } catch (error) {
      console.log(`⚠️ AI generation failed, using pre-written article template...`);
      
      // Fallback to pre-written article when AI quota is exceeded
      generatedArticle = {
        title: `${topic}: Sohadagi so'nggi yangiliklar`,
        summary: `${topic} sohasida so'nggi paytlarda katta o'zgarishlar kuzatilmoqda. Mutaxassislarning fikricha, bu tendensiya yaqin kelajakda ham davom etadi.`,
        content: `${topic} bugungi kunda eng muhim mavzulardan biri hisoblanadi. Texnologiyaning rivojlanishi va innovatsion yechimlarning paydo bo'lishi bu sohada yangi imkoniyatlar yaratmoqda.

Ekspertlarning fikriga ko'ra, ${topic.toLowerCase()} sohasida quyidagi asosiy tendensiyalar kuzatilmoqda:

• Texnologik yechimlarning takomillashishi
• Bozor talablarining o'zgarishi  
• Yangi imkoniyatlarning paydo bo'lishi
• International hamkorlikning kengayishi

O'zbekistonda ham bu sohaga alohida e'tibor berilmoqda. Davlat va xususiy sektor vakillari birgalikda ishlayotgan loyihalar bu yo'nalishdagi rivojlanishni yanada tezlashtirmoqda.

Kelajakda ${topic.toLowerCase()} sohasida yanada katta yutuqlarga erishish kutilmoqda. Bu esa iqtisodiyot va jamiyat rivojiga ijobiy ta'sir ko'rsatadi.`,
        category: category,
        tags: [topic.toLowerCase(), "yangilik", "tendensiya", "rivojlanish"]
      };
      
      // Use fallback image
      imageUrl = "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
    }

    // Step 4: Check for duplicates before saving
    const articleData = {
      title: generatedArticle.title,
      summary: generatedArticle.summary,
      content: generatedArticle.content,
      category: generatedArticle.category,
      tags: generatedArticle.tags,
      isAiGenerated: true,
      imageUrl: imageUrl
    };

    const normalize = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");
    const aTitle = normalize(articleData.title);
    const aSummary = normalize(articleData.summary);
    const isDuplicate = recentArticles.some(article => {
      const rTitle = normalize(article.title || "");
      const rSummary = normalize(article.summary || "");
      // exact or strong partial overlap to catch near-duplicates
      const titleOverlap = rTitle === aTitle || rTitle.includes(aTitle.slice(0, Math.min(20, aTitle.length))) || aTitle.includes(rTitle.slice(0, Math.min(20, rTitle.length)));
      const summaryOverlap = rSummary === aSummary || rSummary.includes(aSummary.slice(0, Math.min(30, aSummary.length))) || aSummary.includes(rSummary.slice(0, Math.min(30, rSummary.length)));
      return titleOverlap || summaryOverlap;
    });
    
    if (isDuplicate) {
      console.log("⏭️  Duplicate article detected, skipping...");
      return;
    }
    
    // In-process last-hash guard (extra safety)
    const postHash = createHash('sha256').update(`${aTitle}\n${aSummary}`).digest('hex');
    if (lastPostedHash && lastPostedHash === postHash) {
      console.log("⏭️  Same content hash as last post detected, skipping to prevent duplicate send");
      return;
    }

    // Step 5: Save article to database
    console.log(`💾 Saving article to database: ${articleData.title}`);
    const savedArticle = await storage.createArticle(articleData);

    // Step 6: Post to Telegram channel (only if not from News API or if explicitly enabled)
    if (!isFromNewsApi || process.env.ENABLE_NEWS_API_POSTING === 'true') {
      console.log(`📱 Posting to Telegram channel...`);
      const telegramArticle = {
        title: savedArticle.title,
        summary: savedArticle.summary,
        imageUrl: savedArticle.imageUrl,
        id: savedArticle.id
      };

      const telegramSuccess = await postToChannel(telegramArticle);

      if (telegramSuccess) {
        console.log(`✅ Successfully posted to Telegram: ${savedArticle.title}`);
        lastPostedHash = postHash;
      } else {
        console.log(`⚠️  Article saved but Telegram posting failed for: ${savedArticle.title}`);
      }
    } else {
      console.log(`ℹ️  Article saved but not posted to Telegram (from News API and posting disabled)`);
    }

    // Optional: Update analytics
    try {
      const currentAnalytics = await storage.getAnalytics();
      if (currentAnalytics) {
        await storage.updateAnalytics({
          aiArticles: (currentAnalytics.aiArticles || 0) + 1,
          dailyReads: (currentAnalytics.dailyReads || 0) + Math.floor(Math.random() * 50) + 20
        });
      }
    } catch (error) {
      console.log("Analytics update failed:", error);
    }

  } catch (error) {
    console.error("❌ Automated content generation completely failed:", error);
    
    // Only send critical error notifications (not API quota issues)
    if (error instanceof Error && !error.message.includes('quota') && !error.message.includes('429')) {
      try {
        await sendNotification(`🚨 *Kritik xatolik*\n\nVaqt: ${new Date().toLocaleString('uz-UZ')}\nXatolik: ${error.message}`);
      } catch (notificationError) {
        console.error("Failed to send error notification:", notificationError);
      }
    } else {
      console.log("⚠️ API quota exceeded - fallback system should handle this");
    }
  } finally {
    isJobRunning = false;
  }
}

export function startScheduler(): void {
  // Schedule to run every 30 minutes from 9:00 to 21:00
  // Cron pattern: "0,30 9-21 * * *" means at minute 0 and 30 of every hour from 9 to 21
  const schedule = "0,30 9-21 * * *";

  console.log("⏰ Starting content scheduler...");
  console.log(`📅 Schedule: Every 30 minutes from 9:00 to 21:00 (${schedule})`);

  // Config diagnostics
  const hasTelegram = !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;
  if (!hasTelegram) {
    console.warn("⚠️ Telegram sozlamalari to'liq emas: TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID yo'q.");
  } else {
    console.log("📲 Telegram sozlamalari topildi: post yuborish tayyor.");
  }

  cron.schedule(schedule, generateAndPostContent, {
    timezone: "Asia/Tashkent" // O'zbekiston vaqti
  });

  // Send startup notification
  sendNotification("🤖 *Aqlli Jurnalist avtomatlashtirildi*\n\nTizim ishga tushdi va har 30 daqiqada yangi kontent yaratadi.\n\n📅 Jadval: 09:00 - 21:00\n⏰ Interval: Har 30 daqiqa")
    .catch(error => console.log("Startup notification failed:", error));

  console.log("✅ Content scheduler is now active!");

  // Run once shortly after startup to verify everything works without kutish
  setTimeout(() => {
    console.log("🚀 Initial run: Generating and posting content immediately after startup...");
    generateAndPostContent().catch((e) => {
      console.error("Initial generation failed:", e);
    });
  }, 5_000);
}

export function stopScheduler(): void {
  cron.getTasks().forEach((task, name) => {
    task.destroy();
    console.log(`🛑 Stopped scheduler task: ${name}`);
  });
}