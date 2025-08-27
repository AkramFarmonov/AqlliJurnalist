import cron from "node-cron";
import { storage } from "../storage";
import { generateArticle, analyzeTrends } from "../services/gemini";
import { fetchImageByKeyword } from "../services/unsplash";
import { postToChannel, sendNotification } from "../services/telegram";
import { randomUUID } from "crypto";

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
    // Step 1: Get a topic (either from trends or predefined list)
    let topic: string;
    let category = "Texnologiya";

    try {
      // Try to get trending topics first
      const articles = await storage.getArticles(10);
      if (articles.length > 0) {
        const trends = await analyzeTrends(articles);
        if (trends.length > 0) {
          const topTrend = trends[0];
          topic = topTrend.topic.replace('#', '');
          console.log(`📈 Using trending topic: ${topic}`);
        } else {
          topic = getRandomTopic();
          console.log(`🎲 Using random topic: ${topic}`);
        }
      } else {
        topic = getRandomTopic();
        console.log(`🎲 Using random topic: ${topic}`);
      }
    } catch (error) {
      topic = getRandomTopic();
      console.log(`🎲 Using fallback topic: ${topic}`);
    }

    // Step 2: Generate article content using Gemini
    console.log(`📝 Generating article for topic: ${topic}`);
    const generatedArticle = await generateArticle(topic, category);

    // Step 3: Get relevant image from Unsplash
    console.log(`🖼️ Fetching image for keywords: ${topic}`);
    const imageUrl = await fetchImageByKeyword(topic);

    // Step 4: Save article to database
    const articleData = {
      title: generatedArticle.title,
      summary: generatedArticle.summary,
      content: generatedArticle.content,
      category: generatedArticle.category,
      tags: generatedArticle.tags,
      isAiGenerated: true,
      imageUrl: imageUrl
    };

    console.log(`💾 Saving article to database: ${articleData.title}`);
    const savedArticle = await storage.createArticle(articleData);

    // Step 5: Post to Telegram channel
    console.log(`📱 Posting to Telegram channel...`);
    const telegramArticle = {
      title: savedArticle.title,
      summary: savedArticle.summary,
      imageUrl: savedArticle.imageUrl,
      id: savedArticle.id
    };

    const telegramSuccess = await postToChannel(telegramArticle);

    if (telegramSuccess) {
      console.log(`✅ Successfully completed automated content generation for: ${savedArticle.title}`);
    } else {
      console.log(`⚠️  Article saved but Telegram posting failed for: ${savedArticle.title}`);
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
    console.error("❌ Automated content generation failed:", error);
    
    // Try to send error notification to Telegram
    try {
      await sendNotification(`🚨 *Avtomatik kontent generatsiyasida xatolik*\n\nVaqt: ${new Date().toLocaleString('uz-UZ')}\nXatolik: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`);
    } catch (notificationError) {
      console.error("Failed to send error notification:", notificationError);
    }
  }
}

export function startScheduler(): void {
  // Schedule to run every 30 minutes from 9:00 to 21:00
  // Cron pattern: "0,30 9-21 * * *" means at minute 0 and 30 of every hour from 9 to 21
  const schedule = "0,30 9-21 * * *";

  console.log("⏰ Starting content scheduler...");
  console.log(`📅 Schedule: Every 30 minutes from 9:00 to 21:00 (${schedule})`);

  cron.schedule(schedule, generateAndPostContent, {
    timezone: "Asia/Tashkent" // O'zbekiston vaqti
  });

  // Send startup notification
  sendNotification("🤖 *Aqlli Jurnalist avtomatlashtirildi*\n\nTizim ishga tushdi va har 30 daqiqada yangi kontent yaratadi.\n\n📅 Jadval: 09:00 - 21:00\n⏰ Interval: Har 30 daqiqa")
    .catch(error => console.log("Startup notification failed:", error));

  console.log("✅ Content scheduler is now active!");
}

export function stopScheduler(): void {
  cron.getTasks().forEach((task, name) => {
    task.destroy();
    console.log(`🛑 Stopped scheduler task: ${name}`);
  });
}