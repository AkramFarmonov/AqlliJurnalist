import TelegramBot from "node-telegram-bot-api";
import type { Article } from "@shared/schema";

export interface TelegramArticle {
  title: string;
  summary: string;
  imageUrl?: string | null;
  id: string;
}

export async function postToChannel(article: TelegramArticle): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram bot token or chat ID not configured");
      return false;
    }

    const bot = new TelegramBot(botToken, { polling: false });
    
    // Create the message caption
    const websiteUrl = process.env.REPLIT_DOMAINS 
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
      : "https://aqlli-jurnalist.replit.app";
    
    const caption = `*${article.title}*

${article.summary}

[📖 Batafsil o'qish](${websiteUrl}/article/${article.id})

#AqlliJurnalist #Yangilik #AI`;

    if (article.imageUrl) {
      // Send photo with caption
      await bot.sendPhoto(chatId, article.imageUrl, {
        caption: caption,
        parse_mode: 'Markdown'
      });
    } else {
      // Send text message only
      await bot.sendMessage(chatId, caption, {
        parse_mode: 'Markdown'
      });
    }

    console.log(`✅ Successfully posted article "${article.title}" to Telegram channel`);
    return true;

  } catch (error) {
    console.error("Failed to post to Telegram channel:", error);
    return false;
  }
}

export async function sendNotification(message: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram bot token or chat ID not configured");
      return false;
    }

    const bot = new TelegramBot(botToken, { polling: false });
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });

    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}