# Render.com ga Tez Deploy Qilish

## 1. GitHub ga yuklash
```bash
git init
git add .
git commit -m "Aqlli Jurnalist - Ready for deploy"
git remote add origin https://github.com/[USERNAME]/aqlli-jurnalist.git
git push -u origin main
```

## 2. Render.com da Web Service yaratish
- **New +** > **Web Service**
- GitHub repository ni tanlang
- **Settings:**
  - Name: `aqlli-jurnalist`
  - Build: `npm install && npm run build`
  - Start: `npm start`

## 3. Environment Variables qo'shish
```
NODE_ENV=production
GEMINI_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
UNSPLASH_ACCESS_KEY=your_key_here
```

## 4. API Keys olish

### Gemini API:
- https://ai.google.dev/ > **Get API key**

### Telegram Bot:
- @BotFather ga `/newbot` yuboring
- Chat ID: @userinfobot dan oling

### Unsplash:
- https://unsplash.com/developers > **New Application**

## 5. Deploy
- **Deploy** tugmasini bosing
- 5-10 daqiqa kutib turib, saytingiz tayyor!

**URL:** `https://aqlli-jurnalist.onrender.com`