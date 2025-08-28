// Unsplash API service for fetching high-quality images
export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export async function fetchImageByKeyword(keyword: string): Promise<string | null> {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn("Unsplash Access Key not found, using fallback image");
      return getFallbackImage(keyword);
    }

    // Build a topic-aware search query
    const searchQuery = buildUnsplashQuery(keyword);
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&order_by=relevant&content_filter=high`,
      {
        headers: {
          'Authorization': `Client-ID ${accessKey}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      console.error(`Unsplash API error: ${response.status} ${response.statusText}`);
      return getFallbackImage(keyword);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Prefer images with descriptive alt text, otherwise first
      const pick = data.results.find((p: any) => !!p.alt_description) || data.results[0];
      return `${pick.urls.regular}&w=800&h=600&fit=crop`;
    }

    return getFallbackImage(keyword);
  } catch (error) {
    console.error("Failed to fetch image from Unsplash:", error);
    return getFallbackImage(keyword);
  }
}

// Build a better Unsplash query: translate Uzbek topic to English and
// expand with a few descriptive synonyms to improve relevance
function buildUnsplashQuery(raw: string): string {
  const s = (raw || '').toLowerCase();
  const pairs: Array<[RegExp, string]> = [
    [/sun'?iy\s*intellekt|ai|a\.i\./g, 'artificial intelligence, ai, robotics, neural network'],
    [/texnologiya|texnologiyalar|technology/g, 'technology, innovation, gadgets'],
    [/kvant|quantum/g, 'quantum computing, qubits, physics'],
    [/kibertxavfsizlik|kiber(xavfsizlik)?|cyber ?security/g, 'cybersecurity, hacker, code, data security'],
    [/blokcheyn|block ?chain/g, 'blockchain, crypto, ledger, web3'],
    [/bulut|cloud/g, 'cloud computing, datacenter, servers'],
    [/mobil|smartfon|telefon/g, 'mobile, smartphone, app, handheld'],
    [/kosmik|space/g, 'space, astronaut, galaxy, satellite'],
    [/startap|startup/g, 'startup, founders, team, office'],
    [/ta'?lim|education/g, 'education, classroom, learning'],
    [/transport|avtomobil|avtosanoat/g, 'transport, mobility, car, vehicle'],
    [/iot|narsalar interneti/g, 'internet of things, sensors, devices'],
    [/moliy(a|e)|fintech|bank/g, 'finance, fintech, trading, stock']
  ];

  let enriched: string[] = [];
  for (const [re, translated] of pairs) {
    if (re.test(s)) enriched.push(translated);
  }

  // If nothing matched, fall back to the original text with generic tech descriptors
  if (enriched.length === 0) {
    const cleaned = s.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
    enriched.push(`${cleaned}, technology, modern, innovation`);
  }

  // Keep query concise but descriptive
  const base = enriched.join(', ');
  return `${base}, landscape, abstract, minimal, professional photo`;
}

function getFallbackImage(keyword: string): string {
  // Category-based fallback images from Unsplash
  const fallbackPools: Record<string, string[]> = {
    "technology": [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "ai": [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "business": [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "education": [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1515524738708-327f6b0037a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "transport": [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "space": [
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "blockchain": [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "startup": [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "cybersecurity": [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1496096265110-f83ad7f96608?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "cloud": [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "mobile": [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    "default": [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ]
  };

  // Try to match keyword with categories
  const lowerKeyword = keyword.toLowerCase();
  const pickFromPool = (pool: string[]) => {
    // Deterministic pick based on keyword
    let hash = 0;
    for (let i = 0; i < lowerKeyword.length; i++) hash = (hash * 31 + lowerKeyword.charCodeAt(i)) >>> 0;
    const idx = hash % pool.length;
    return pool[idx];
  };

  for (const [category, pool] of Object.entries(fallbackPools)) {
    if (lowerKeyword.includes(category)) {
      return pickFromPool(pool);
    }
  }

  return pickFromPool(fallbackPools.default);
}