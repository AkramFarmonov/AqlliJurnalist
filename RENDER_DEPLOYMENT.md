# Render.com ga Deploy Qilish To'liq Yo'riqnomasi

## 1-Bosqich: GitHub Repository Yaratish

### GitHub ga kod yuklash:
```bash
# 1. GitHub.com ga kiring va yangi repository yarating
# Repository nomi: aqlli-jurnalist-news-platform

# 2. Loyihani GitHub ga yuklash:
git init
git add .
git commit -m "Initial commit: Aqlli Jurnalist News Platform"
git remote add origin https://github.com/[USERNAME]/aqlli-jurnalist-news-platform.git
git push -u origin main
```

## 2-Bosqich: Render.com da Hisob Yaratish

1. **Render.com** ga boring: https://render.com
2. **Sign up** tugmasini bosing
3. GitHub akkauntingiz bilan ro'yxatdan o'ting
4. Email tasdiqlash orqali hisobingizni faollashtiring

## 3-Bosqich: Web Service Yaratish

### Render Dashboard da:
1. **New +** tugmasini bosing
2. **Web Service** ni tanlang
3. GitHub repository ni ulang
4. Repository ni tanlang: `aqlli-jurnalist-news-platform`

### Asosiy Sozlamalar:
```
Name: aqlli-jurnalist
Region: Oregon (US West) - yoki eng yaqin region
Branch: main
Root Directory: (bo'sh qoldiring)
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

## 4-Bosqich: Environment Variables (Secrets) Sozlash

Render dashboard da **Environment** bo'limida quyidagi o'zgaruvchilarni qo'shing:

### Majburiy Environment Variables:
```bash
# Node.js muhiti
NODE_ENV=production

# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Image Service
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Database (agar PostgreSQL ishlatsangiz)
DATABASE_URL=postgresql://username:password@hostname:port/database
```

### API Keys ni qayerdan olish:

#### 1. Gemini API Key:
- https://ai.google.dev/ ga boring
- **Get API key** tugmasini bosing
- Google akkauntingiz bilan kiring
- **Create API Key** ni tanlang
- Free tier: 1000 request/day

#### 2. Telegram Bot Token:
```
1. Telegram da @BotFather ga murojaat qiling
2. /newbot buyrug'ini yuboring
3. Bot nomini kiriting: Aqlli Jurnalist Bot
4. Username kiriting: aqlli_jurnalist_bot
5. Token ni nusxalab oling

Chat ID olish uchun:
1. @userinfobot ga murojaat qiling
2. /start buyrug'ini yuboring
3. Chat ID ni nusxalab oling
```

#### 3. Unsplash API Key:
- https://unsplash.com/developers ga boring
- **Register as a developer** tugmasini bosing
- **New Application** yarating
- API key ni nusxalab oling

## 5-Bosqich: Deploy Qilish

1. **Deploy** tugmasini bosing
2. Build jarayonini kuzating (5-10 daqiqa)
3. Deploy muvaffaqiyatli bo'lgach, URL ni oling

### Deploy URL:
```
https://aqlli-jurnalist.onrender.com
```

## 6-Bosqich: Custom Domain (Ixtiyoriy)

### Agar o'z domeningiz bo'lsa:
1. Render dashboard da **Settings** > **Custom Domains**
2. Domain nomini kiriting: `aqlijurnalist.uz`
3. DNS sozlamalarini yangilang:
   - CNAME record: `www` -> `aqlli-jurnalist.onrender.com`
   - A record: `@` -> Render IP address

## 7-Bosqich: HTTPS va SSL

- Render avtomatik ravishda Let's Encrypt SSL sertifikati beradi
- HTTPS avtomatik faollashadi
- HTTP dan HTTPS ga avtomatik yo'naltirish ishlaydi

## 8-Bosqich: Monitoring va Logs

### Logs ko'rish:
1. Render dashboard da **Logs** bo'limiga boring
2. Real-time loglarni kuzating
3. Xatoliklar uchun loglarni tahlil qiling

### Performance monitoring:
```bash
# CPU va Memory ishlatilishini kuzatish
# Render dashboard da **Metrics** bo'limida
```

## 9-Bosqich: Database Sozlash (Agar kerak bo'lsa)

### PostgreSQL qo'shish:
1. Render da **New** > **PostgreSQL** ni tanlang
2. Database nomini kiriting: `aqlli-jurnalist-db`
3. Connection URL ni nusxalab oling
4. Web Service da `DATABASE_URL` environment variable ga qo'shing

## 10-Bosqich: Automatic Deploys

### GitHub Integration:
- Har bir `git push` avtomatik deploy qiladi
- Pull request lar uchun preview deployments yaratiladi
- **Auto-Deploy**: `Yes` (default)

## Troubleshooting

### Keng tarqalgan muammolar:

#### 1. Build xatoligi:
```bash
# package.json da scripts ni tekshiring:
"scripts": {
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js"
}
```

#### 2. Environment variables yo'q:
- Render dashboard da barcha kerakli variables qo'shilganini tekshiring
- API keylar to'g'ri ekanini tekshiring

#### 3. Database connection xatoligi:
- DATABASE_URL to'g'ri formatda ekanini tekshiring
- Database host va credentials ni tekshiring

#### 4. Port xatoligi:
```javascript
// server/index.ts da:
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

## Performance Optimizatsiya

### Render Free Tier:
- 512 MB RAM
- 0.1 CPU
- 30 daqiqa inactivity dan keyin sleep mode
- Oyiga 750 soat free

### Paid Plan tavsiyalari:
- **Starter ($7/oy)**: 512 MB RAM, sleep yo'q
- **Standard ($25/oy)**: 2 GB RAM, autoscaling

## Backup va Recovery

### Code backup:
- GitHub repository avtomatik backup
- Render barcha deploymentlar tarixini saqlaydi

### Database backup:
```bash
# PostgreSQL backup (agar ishlatilsa):
pg_dump $DATABASE_URL > backup.sql
```

## Monitoring URLs

### Asosiy sahifalar:
- Asosiy sahifa: `https://aqlli-jurnalist.onrender.com/`
- API: `https://aqlli-jurnalist.onrender.com/api/articles`
- Sitemap: `https://aqlli-jurnalist.onrender.com/sitemap.xml`
- Manifest: `https://aqlli-jurnalist.onrender.com/manifest.json`

### Health check:
```bash
# Terminal orqali tekshirish:
curl -I https://aqlli-jurnalist.onrender.com/
curl https://aqlli-jurnalist.onrender.com/api/articles
```

## Final Checklist

- [ ] GitHub repository yaratildi va code yuklandi
- [ ] Render account yaratildi
- [ ] Web service yaratildi
- [ ] Barcha environment variables qo'shildi
- [ ] API keylar to'g'ri va ishlayapti
- [ ] Deploy muvaffaqiyatli tugadi
- [ ] Website ochiladi va ishlaydi
- [ ] API endpoints javob beradi
- [ ] Telegram bot ishlaydi
- [ ] Avtomatik content generation ishlaydi
- [ ] Real-time chat ishlaydi
- [ ] PWA install qilish mumkin

## Support

Agar muammolar bo'lsa:
1. Render logs ni tekshiring
2. GitHub Issues da savol bering
3. Render Support ga murojaat qiling
4. Community forums da yordam so'rang

**Muvaffaqiyatli deploy!** 🚀