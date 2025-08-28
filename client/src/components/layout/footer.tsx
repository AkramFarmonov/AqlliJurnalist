import { Brain } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const year = new Date().getFullYear();
  const footerSections = [
    {
      title: "Havolalar",
      links: [
        { label: "Biz haqimizda", href: "/about" },
        { label: "Aloqa", href: "#" },
        { label: "Maxfiylik", href: "#" },
        { label: "Shartlar", href: "#" },
      ]
    },
    {
      title: "Kategoriyalar", 
      links: [
        { label: "Texnologiya", href: "#" },
        { label: "AI & ML", href: "#" },
        { label: "Biznes", href: "#" },
        { label: "Ta'lim", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="text-primary text-xl" />
              <h3 className="font-bold text-foreground" data-testid="footer-logo">
                Aqlli Jurnalist
              </h3>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="footer-description">
              AI texnologiyalari yordamida yangiliklar va trendlarni taqdim etuvchi zamonaviy platforma.
            </p>
          </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-3" data-testid={`footer-title-${section.title.toLowerCase()}`}>
                {section.title}
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  link.href.startsWith('/') ? (
                    <Link 
                      key={link.label}
                      href={link.href}
                      className="block hover:text-primary transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a 
                      key={link.label}
                      href={link.href}
                      className="block hover:text-primary transition-colors"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          ))}
          
          <div>
            <h4 className="font-semibold text-foreground mb-3" data-testid="footer-title-social">
              Ijtimoiy tarmoqlar
            </h4>
            <div className="flex space-x-4">
              {[
                { icon: "📱", label: "Telegram", href: "#" },
                { icon: "🐦", label: "Twitter", href: "#" },
                { icon: "📷", label: "Instagram", href: "#" },
                { icon: "📺", label: "YouTube", href: "#" },
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="text-muted-foreground hover:text-primary transition-colors text-xl"
                  data-testid={`social-link-${social.label.toLowerCase()}`}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
            © {year} Aqlli Jurnalist. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
