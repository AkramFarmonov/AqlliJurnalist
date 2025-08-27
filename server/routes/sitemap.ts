import { Request, Response } from "express";
import { storage } from "../storage";

export async function generateSitemap(req: Request, res: Response) {
  try {
    const articles = await storage.getArticles();
    const baseUrl = req.protocol + '://' + req.get('host');
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

    for (const article of articles) {
      sitemap += `
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
  </url>`;
    }

    sitemap += '\n</urlset>';

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).send('Internal Server Error');
  }
}