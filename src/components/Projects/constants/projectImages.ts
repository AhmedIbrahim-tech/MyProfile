import type { ProjectCategory } from "../types";

export const PROJECT_IMAGE_MAP: { [key: string]: string } = {
  "vitagymportalweb": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "vitagym": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "gym": "https://images.unsplash.com/photo-1734668486909-4637ecd66408?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "e-commerce": "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "ecommerce": "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "file-sharing": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=400&fit=crop",
  "file sharing": "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&h=400&fit=crop",
  "instagram": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  "social media": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
  "movie": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
  "movie site": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
  "portfolio": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=400&fit=crop",
  "blog": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
  "todo": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop",
  "task": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop",
  "chat": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop",
  "messenger": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=400&fit=crop",
  "api": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  "backend": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  "dashboard": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  "admin": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  "cms": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
  "crud": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
  "auth": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
  "login": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
  "payment": "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=400&fit=crop",
  "shop": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
  "restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
  "food": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
  "weather": "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=400&fit=crop",
  "news": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop",
  "game": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop",
  "music": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
  "video": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=400&fit=crop",
  "stream": "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=400&fit=crop",
  "learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
  "course": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
  "school": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
  "hospital": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
  "medical": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop",
  "booking": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop",
  "hotel": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=400&fit=crop",
  "travel": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
  "react": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  "angular": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  "vue": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  "node": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  "express": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  "asp.net": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  ".net": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  "mvc": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
};

export const DEFAULT_IMAGES = {
  frontend: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
  backend: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
  fullstack: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
};

export const getProjectImage = (
  repoUrl: string,
  repoName?: string,
  description?: string,
  category?: ProjectCategory
): string => {
  const name = (repoName || repoUrl.split("/").pop() || "").toLowerCase();
  const desc = (description || "").toLowerCase();
  
  // Try to find a match in the image map
  let imageUrl = "";
  for (const [key, value] of Object.entries(PROJECT_IMAGE_MAP)) {
    if (name.includes(key) || desc.includes(key)) {
      imageUrl = value;
      break;
    }
  }

  // If no match found, use category-based images
  if (!imageUrl) {
    if (category === "frontend") {
      imageUrl = DEFAULT_IMAGES.frontend;
    } else if (category === "backend") {
      imageUrl = DEFAULT_IMAGES.backend;
    } else {
      imageUrl = DEFAULT_IMAGES.fullstack;
    }
  }

  return imageUrl;
};

