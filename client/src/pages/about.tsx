import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Biz Haqimizda - Aqlli Jurnalist</title>
        <meta name="description" content="Aqlli Jurnalist platformasi haqida ma'lumot - bizning maqsadimiz, qadriyatlarimiz va aloqa ma'lumotlari" />
      </Helmet>
      
      <Navbar onSearch={handleSearch} />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="p-8">
          <CardContent className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Biz Haqimizda</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Bizning Maqsadimiz</h2>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "Aqlli Jurnalist" zamonaviy eksperimental yangilik platformasi bo'lib, 
                global trendlarni tahlil qilish va o'zbek tilida yuqori sifatli, 
                analitik yangiliklar yetkazib berish uchun ilg'or sun'iy intellekt 
                (Gemini 1.5 Flash) dan foydalanadi.
              </p>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Biz texnologiya, biznes, siyosat va jamiyat sohasidagi eng muhim 
                voqealarni kuzatib boramiz va ularni o'zbek audiitoriyasi uchun 
                tushunarli va qiziqarli tarzda taqdim etamiz. Platforma real vaqtda 
                yangilanuvchi ma'lumotlar va chuqur tahlillar bilan foydalanuvchilarni 
                ta'minlaydi.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Bizning Qadriyatlarimiz</h2>
              
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Obyektivlik:</strong> Trendlarni tahlil qilishda 
                  xolislikka intilish va har tomonlama ma'lumot berish.
                </li>
                <li>
                  <strong className="text-foreground">Shaffoflik:</strong> Kontentning sun'iy intellekt 
                  yordamida yaratilganini ochiq e'tirof etish va jarayonlarni tiniq tutish.
                </li>
                <li>
                  <strong className="text-foreground">Innovatsiya:</strong> Yangiliklar yetkazib berishda 
                  eng so'nggi texnologiyalarni qo'llash va raqamli journalistikani rivojlantirish.
                </li>
                <li>
                  <strong className="text-foreground">Sifat:</strong> Har bir maqolaning to'g'riligi, 
                  dolzarbligi va foydaliligini ta'minlash.
                </li>
                <li>
                  <strong className="text-foreground">Dostupnost:</strong> Axborotni barcha foydalanuvchilar 
                  uchun ochiq va tushunarli qilish.
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Biz bilan bog'lanish</h2>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Savollar, takliflar yoki hamkorlik borasida biz bilan bog'lanishni istasangiz, 
                quyidagi elektron pochta manzili orqali murojaat qilishingiz mumkin:
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold text-foreground">
                  Elektron pochta: <a href="mailto:info@aqlijurnalist.dev" className="text-primary hover:underline">info@aqlijurnalist.dev</a>
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Biz har bir murojaatni diqqat bilan ko'rib chiqamiz va imkon qadar tez orada javob berishga harakat qilamiz.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}