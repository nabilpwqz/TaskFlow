import fs from "fs";
import path from "path";
import { connectToDatabase } from "./connection";
import { UserModel } from "./models/User";
import { ServiceModel } from "./models/Service";
import { OrderModel } from "./models/Order";
import { ReviewModel } from "./models/Review";
import { ConversationModel } from "./models/Conversation";
import { MessageModel } from "./models/Message";
import { NotificationModel } from "./models/Notification";
import { User, Service, Order, Review, Conversation, Message, Notification } from "@/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "taskflow-store.json");
let inMemoryStore: MemoryStoreData | null = null;

interface MemoryStoreData {
  users: Array<User & { passwordHash: string }>;
  services: Service[];
  orders: Order[];
  reviews: Review[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
}

const FIXTURE_ACCOUNT_EMAILS = new Set([
  "client@taskflow.com",
  "freelancer@taskflow.com",
  "marcus@taskflow.com",
  "admin@taskflow.com",
]);

function ensureDataFile(): MemoryStoreData {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  if (process.env.VERCEL) {
    inMemoryStore = getInitialStoreData();
    return inMemoryStore;
  }

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });

    if (fs.existsSync(DATA_FILE)) {
      try {
        inMemoryStore = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        return inMemoryStore!;
      } catch (error) {
        console.warn("Failed to read the local file store; creating a fresh store:", error);
      }
    }

    inMemoryStore = getInitialStoreData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryStore, null, 2), "utf-8");
    return inMemoryStore;
  } catch (error) {
    console.warn("File-backed store is unavailable; using process memory instead:", error);
    inMemoryStore = getInitialStoreData();
    return inMemoryStore;
  }
}

function saveStoreData(data: MemoryStoreData) {
  inMemoryStore = data;

  if (process.env.VERCEL) {
    return;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist file store data; changes only exist in process memory:", err);
  }
}

export function resetInMemoryStore(newData?: MemoryStoreData): MemoryStoreData {
  inMemoryStore = newData || getInitialStoreData();
  try {
    if (!process.env.VERCEL) {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryStore, null, 2), "utf-8");
    }
  } catch {}
  return inMemoryStore;
}

export function getInitialStoreData(): MemoryStoreData {
  const disabledPasswordHash = "";
  const now = new Date();
  const d = 86400000;

  const users: Array<User & { passwordHash: string }> = [
    {
      _id: "u_client_1",
      name: "Alex Vance",
      email: "client@taskflow.com",
      passwordHash: disabledPasswordHash,
      role: "client",
      username: "alexvance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
      status: "active",
      bio: "Tech entrepreneur and startup founder looking for high-caliber product designers and developers.",
      skills: ["Product Management", "Growth Strategy"],
      rating: 5.0,
      reviewCount: 4,
      completedOrders: 12,
      createdAt: new Date(now.getTime() - d * 60).toISOString(),
      updatedAt: new Date(now.getTime() - d * 5).toISOString(),
    },
    {
      _id: "u_freelancer_1",
      name: "Sarah Chen",
      email: "freelancer@taskflow.com",
      passwordHash: disabledPasswordHash,
      role: "freelancer",
      username: "sarahchen",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
      status: "active",
      bio: "Senior Full-Stack Engineer & Next.js specialist with 7+ years of experience building scalable SaaS products.",
      skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
      hourlyRate: 85,
      rating: 4.9,
      reviewCount: 38,
      completedOrders: 42,
      createdAt: new Date(now.getTime() - d * 90).toISOString(),
      updatedAt: new Date(now.getTime() - d * 2).toISOString(),
    },
    {
      _id: "u_freelancer_2",
      name: "Marcus Miller",
      email: "marcus@taskflow.com",
      passwordHash: disabledPasswordHash,
      role: "freelancer",
      username: "marcusmiller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80",
      status: "active",
      bio: "Award-winning Brand & Product Designer helping startups craft memorable visual identities.",
      skills: ["UI/UX Design", "Figma", "Branding", "Design Systems", "Webflow"],
      hourlyRate: 95,
      rating: 4.95,
      reviewCount: 52,
      completedOrders: 56,
      createdAt: new Date(now.getTime() - d * 120).toISOString(),
      updatedAt: new Date(now.getTime() - d * 4).toISOString(),
    },
    {
      _id: "u_admin_1",
      name: "Elena Rostova",
      email: "admin@taskflow.com",
      passwordHash: disabledPasswordHash,
      role: "admin",
      username: "elena_admin",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop&q=80",
      status: "active",
      bio: "TaskFlow Platform Lead and Marketplace Integrity Director.",
      skills: ["Platform Management", "Compliance", "Architecture"],
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      createdAt: new Date(now.getTime() - d * 180).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const services: Service[] = [
    {
      _id: "s_web_1",
      sellerId: "u_freelancer_1",
      seller: {
        _id: "u_freelancer_1",
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 38,
      },
      title: "Build Production-Ready Full-Stack Web App with Next.js & TypeScript",
      slug: "build-production-full-stack-web-app-nextjs",
      shortDesc: "End-to-end modern SaaS web application with App Router, responsive Tailwind UI, and secure database persistence.",
      fullDesc: `I will architect and develop a high-performance, enterprise-grade web application tailored to your startup's needs.
      
What you get:
- Modular Next.js 14/15 App Router architecture
- Fully typed TypeScript codebase with zero runtime surprises
- Modern responsive interface using Tailwind CSS and accessible UI components
- Scalable database schema with MongoDB / PostgreSQL
- Secure authentication with HTTP-only cookies and session protection
- Lighthouse 95+ score for performance and accessibility`,
      category: "Web Development",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Full Stack"],
      packages: [
        {
          id: "basic",
          name: "MVP Starter",
          description: "High-converting landing page + responsive layout + contact form integration",
          price: 450,
          deliveryDays: 3,
          revisions: 2,
          features: ["1-3 Responsive Pages", "SEO Optimization", "Mobile-first Design", "Source Code Included"],
        },
        {
          id: "standard",
          name: "Full Application",
          description: "Complete full-stack web application with authentication, database persistence, and API integration",
          price: 1250,
          deliveryDays: 7,
          revisions: 4,
          features: ["Full-Stack App Router", "Authentication & Roles", "Database Setup", "API Route Handlers", "Admin View"],
        },
        {
          id: "premium",
          name: "Enterprise SaaS",
          description: "Comprehensive production SaaS with payments, multi-tier roles, email delivery, and testing suite",
          price: 2600,
          deliveryDays: 14,
          revisions: 8,
          features: ["Full Production Architecture", "Payment Gateway Integration", "Automated Tests", "Deployment & CI/CD", "30 Days Support"],
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
      ],
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80",
      status: "published",
      rating: 4.95,
      reviewCount: 24,
      completedOrders: 31,
      createdAt: new Date(now.getTime() - d * 40).toISOString(),
      updatedAt: new Date(now.getTime() - d * 2).toISOString(),
    },
    {
      _id: "s_design_1",
      sellerId: "u_freelancer_2",
      seller: {
        _id: "u_freelancer_2",
        name: "Marcus Miller",
        username: "marcusmiller",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80",
        rating: 4.95,
        reviewCount: 52,
      },
      title: "Comprehensive Brand Identity & Modern SaaS UI/UX Design System",
      slug: "brand-identity-modern-saas-ui-ux-design-system",
      shortDesc: "Complete brand guidelines, design system, and pixel-perfect Figma design crafted to maximize conversions.",
      fullDesc: `Transform your product's visual presence with an extraordinary design system built in Figma.
      
Includes:
- Distinctive logo suite, typography, and color harmony
- Component design system with autolayout and variants
- Interactive prototypes ready for engineer handoff
- Dark and light theme tokens`,
      category: "Graphic Design",
      tags: ["UI/UX", "Figma", "Branding", "Design System", "Product Design"],
      packages: [
        {
          id: "basic",
          name: "Brand Essentials",
          description: "Primary logo, color palette, typography guidelines, and brand asset export",
          price: 350,
          deliveryDays: 3,
          revisions: 2,
          features: ["Vector Logo Assets", "Color Palette & Type", "Brand Style Guide"],
        },
        {
          id: "standard",
          name: "Product UI Kit",
          description: "Complete design system with 10 high-fidelity screens + interactive Figma prototype",
          price: 850,
          deliveryDays: 6,
          revisions: 4,
          features: ["Full Brand Kit", "10 High-Fidelity Screens", "Interactive Figma Prototype", "Design Tokens"],
        },
        {
          id: "premium",
          name: "Complete Platform Suite",
          description: "End-to-end design for web & mobile app with 25+ screens, animations, and developer guide",
          price: 1800,
          deliveryDays: 12,
          revisions: 6,
          features: ["Complete Platform Suite", "Web & Mobile Breakpoints", "Interactive Prototyping", "Design System Library", "Dev Handoff Sessions"],
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80",
      ],
      coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80",
      status: "published",
      rating: 4.9,
      reviewCount: 38,
      completedOrders: 42,
      createdAt: new Date(now.getTime() - d * 55).toISOString(),
      updatedAt: new Date(now.getTime() - d * 1).toISOString(),
    },
    {
      _id: "s_content_1",
      sellerId: "u_freelancer_1",
      seller: {
        _id: "u_freelancer_1",
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 38,
      },
      title: "In-Depth Technical Architecture & Developer Documentation Writing",
      slug: "technical-architecture-developer-documentation-writing",
      shortDesc: "High-impact developer guides, API references, architecture whitepapers, and engineering blog posts.",
      fullDesc: `Engineering documentation that developers actually love reading. Clear, structured, and developer-tested.`,
      category: "Content Writing",
      tags: ["Technical Writing", "API Docs", "Architecture", "Whitepaper"],
      packages: [
        {
          id: "basic",
          name: "Quick Guide",
          description: "1,500-word deep-dive technical article or README guide",
          price: 200,
          deliveryDays: 2,
          revisions: 2,
          features: ["1,500 Words", "Code Examples", "SEO Meta Data"],
        },
        {
          id: "standard",
          name: "API & Dev Portal",
          description: "Comprehensive API docs with endpoint specs, authentication guides, and schemas",
          price: 550,
          deliveryDays: 5,
          revisions: 3,
          features: ["Full API Documentation", "Swagger/OpenAPI Sync", "SDK Quickstarts", "Diagrams"],
        },
        {
          id: "premium",
          name: "Whitepaper Suite",
          description: "20-page technical whitepaper with industry research, benchmark analysis, and architecture diagrams",
          price: 1100,
          deliveryDays: 10,
          revisions: 5,
          features: ["20-page Whitepaper", "Original Architecture Diagrams", "Executive Summary", "PDF & Markdown Formats"],
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80",
      ],
      coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80",
      status: "published",
      rating: 4.88,
      reviewCount: 14,
      completedOrders: 16,
      createdAt: new Date(now.getTime() - d * 30).toISOString(),
      updatedAt: new Date(now.getTime() - d * 3).toISOString(),
    },
    {
      _id: "s_ai_1",
      sellerId: "u_freelancer_1",
      seller: {
        _id: "u_freelancer_1",
        name: "Sarah Chen",
        username: "sarahchen",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 38,
      },
      title: "AI Agent & RAG Pipeline Integration with Vector Database",
      slug: "ai-agent-rag-pipeline-integration-vector-database",
      shortDesc: "Production-grade generative AI workflows, intelligent chatbots, semantic search, and autonomous agents.",
      fullDesc: `Supercharge your product with state-of-the-art AI workflows. I integrate LLMs (OpenAI, Anthropic, Gemini) with semantic search and vector stores.`,
      category: "AI & Machine Learning",
      tags: ["AI", "OpenAI", "Vector DB", "RAG", "Automation"],
      packages: [
        {
          id: "basic",
          name: "Prompt & LLM API",
          description: "Single LLM integration with structured schema output and error fallback",
          price: 350,
          deliveryDays: 2,
          revisions: 2,
          features: ["LLM API Integration", "JSON Output Schemas", "Prompt Optimization"],
        },
        {
          id: "standard",
          name: "RAG Knowledge Base",
          description: "Retrieval-Augmented Generation pipeline connected to your documents with vector search",
          price: 850,
          deliveryDays: 5,
          revisions: 3,
          features: ["Vector Database Setup", "Chunking & Embedding", "Context-Aware Responses", "Chat UI"],
        },
        {
          id: "premium",
          name: "Autonomous Agent System",
          description: "Multi-agent autonomous system with function calling, external tool usage, and memory persistence",
          price: 1750,
          deliveryDays: 9,
          revisions: 5,
          features: ["Multi-Agent Orchestration", "Tool & API Calling", "Conversation Memory", "Production Telemetry"],
        },
      ],
      images: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80",
      ],
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&auto=format&fit=crop&q=80",
      status: "published",
      rating: 5.0,
      reviewCount: 11,
      completedOrders: 13,
      createdAt: new Date(now.getTime() - d * 25).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const orders: Order[] = [
    {
      _id: "ord_101",
      clientId: "u_client_1",
      freelancerId: "u_freelancer_1",
      serviceId: "s_web_1",
      client: {
        _id: "u_client_1",
        name: "Alex Vance",
        email: "client@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
      },
      freelancer: {
        _id: "u_freelancer_1",
        name: "Sarah Chen",
        email: "freelancer@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
      },
      service: {
        _id: "s_web_1",
        title: "Build Production-Ready Full-Stack Web App with Next.js & TypeScript",
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80",
        category: "Web Development",
      },
      packageSnapshot: {
        id: "standard",
        name: "Full Application",
        description: "Complete full-stack web application with authentication, database persistence, and API integration",
        price: 1250,
        deliveryDays: 7,
        revisions: 4,
        features: ["Full-Stack App Router", "Authentication & Roles", "Database Setup", "API Route Handlers"],
      },
      requirements: "We need an inventory analytics dashboard with role-based access for our warehouse managers.",
      price: 1250,
      currency: "USD",
      status: "IN_PROGRESS",
      dueAt: new Date(now.getTime() + d * 5).toISOString(),
      deliveries: [],
      revisionRequests: [],
      createdAt: new Date(now.getTime() - d * 2).toISOString(),
      updatedAt: new Date(now.getTime() - d * 2).toISOString(),
    },
    {
      _id: "ord_102",
      clientId: "u_client_1",
      freelancerId: "u_freelancer_2",
      serviceId: "s_design_1",
      client: {
        _id: "u_client_1",
        name: "Alex Vance",
        email: "client@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
      },
      freelancer: {
        _id: "u_freelancer_2",
        name: "Marcus Miller",
        email: "marcus@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&q=80",
      },
      service: {
        _id: "s_design_1",
        title: "Comprehensive Brand Identity & Modern SaaS UI/UX Design System",
        coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&auto=format&fit=crop&q=80",
        category: "Graphic Design",
      },
      packageSnapshot: {
        id: "standard",
        name: "Product UI Kit",
        description: "Complete design system with 10 high-fidelity screens + interactive Figma prototype",
        price: 850,
        deliveryDays: 6,
        revisions: 4,
        features: ["Full Brand Kit", "10 High-Fidelity Screens", "Interactive Figma Prototype"],
      },
      requirements: "Dark mode SaaS dashboard designs for our crypto liquidity platform.",
      price: 850,
      currency: "USD",
      status: "DELIVERED",
      dueAt: new Date(now.getTime() + d * 2).toISOString(),
      deliveries: [
        {
          deliveredAt: new Date(now.getTime() - d * 1).toISOString(),
          message: "Hi Alex! The complete Figma workspace has been prepared including color tokens, high-fidelity components, and interactive prototypes. Check out the link below!",
          files: [
            { name: "Figma_Board_Link.pdf", url: "https://example.com/figma-deliverable", size: "1.4 MB" },
            { name: "Brand_Tokens_v2.json", url: "https://example.com/tokens", size: "320 KB" }
          ],
          status: "submitted",
        }
      ],
      revisionRequests: [],
      createdAt: new Date(now.getTime() - d * 5).toISOString(),
      updatedAt: new Date(now.getTime() - d * 1).toISOString(),
    },
    {
      _id: "ord_103",
      clientId: "u_client_1",
      freelancerId: "u_freelancer_1",
      serviceId: "s_web_1",
      client: {
        _id: "u_client_1",
        name: "Alex Vance",
        email: "client@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
      },
      freelancer: {
        _id: "u_freelancer_1",
        name: "Sarah Chen",
        email: "freelancer@taskflow.com",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80",
      },
      service: {
        _id: "s_web_1",
        title: "Build Production-Ready Full-Stack Web App with Next.js & TypeScript",
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80",
        category: "Web Development",
      },
      packageSnapshot: {
        id: "basic",
        name: "MVP Starter",
        description: "High-converting landing page + responsive layout + contact form integration",
        price: 450,
        deliveryDays: 3,
        revisions: 2,
        features: ["1-3 Responsive Pages", "SEO Optimization", "Mobile-first Design"],
      },
      requirements: "Quick landing page for our new AI waitlist launch.",
      price: 450,
      currency: "USD",
      status: "COMPLETED",
      dueAt: new Date(now.getTime() - d * 10).toISOString(),
      deliveries: [
        {
          deliveredAt: new Date(now.getTime() - d * 11).toISOString(),
          message: "All code deployed to production with perfect Lighthouse scores!",
          files: [{ name: "Release_Bundle.zip", url: "https://example.com/bundle", size: "8.2 MB" }],
          status: "approved",
        }
      ],
      revisionRequests: [],
      completedAt: new Date(now.getTime() - d * 9).toISOString(),
      createdAt: new Date(now.getTime() - d * 14).toISOString(),
      updatedAt: new Date(now.getTime() - d * 9).toISOString(),
    },
  ];

  const reviews: Review[] = [
    {
      _id: "rev_201",
      orderId: "ord_103",
      clientId: "u_client_1",
      freelancerId: "u_freelancer_1",
      serviceId: "s_web_1",
      client: {
        _id: "u_client_1",
        name: "Alex Vance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&q=80",
      },
      rating: 5,
      comment: "Sarah exceeded all our expectations! The Next.js architecture was clean, well documented, and delivered 2 days ahead of schedule. Truly top-tier engineering talent.",
      moderationStatus: "approved",
      createdAt: new Date(now.getTime() - d * 8).toISOString(),
      updatedAt: new Date(now.getTime() - d * 8).toISOString(),
    },
  ];

  const conversations: Conversation[] = [
    {
      _id: "conv_1",
      orderId: "ord_101",
      participantIds: ["u_client_1", "u_freelancer_1"],
      lastMessage: "I've started building the database schemas and auth handlers today.",
      lastMessageAt: new Date(now.getTime() - d * 1).toISOString(),
      createdAt: new Date(now.getTime() - d * 2).toISOString(),
      updatedAt: new Date(now.getTime() - d * 1).toISOString(),
    },
  ];

  const messages: Message[] = [
    {
      _id: "msg_1",
      conversationId: "conv_1",
      senderId: "u_client_1",
      body: "Hi Sarah! Excited to work together on this project.",
      createdAt: new Date(now.getTime() - d * 2).toISOString(),
    },
    {
      _id: "msg_2",
      conversationId: "conv_1",
      senderId: "u_freelancer_1",
      body: "Thanks Alex! Reviewing the specifications now. I've started building the database schemas and auth handlers today.",
      createdAt: new Date(now.getTime() - d * 1).toISOString(),
    },
  ];

  const notifications: Notification[] = [
    {
      _id: "notif_1",
      userId: "u_client_1",
      title: "Deliverables Ready for Review",
      message: "Marcus Miller submitted the deliverables for order #ord_102. Review and approve or request revision.",
      type: "order",
      link: "/dashboard/orders",
      read: false,
      createdAt: new Date(now.getTime() - d * 1).toISOString(),
    },
    {
      _id: "notif_2",
      userId: "u_freelancer_1",
      title: "New Order Activated",
      message: "Alex Vance placed an order for 'Full Application' ($1,250).",
      type: "order",
      link: "/dashboard/orders",
      read: true,
      createdAt: new Date(now.getTime() - d * 2).toISOString(),
    },
  ];

  return { users, services, orders, reviews, conversations, messages, notifications };
}

export const DataStore = {
  async isMongoConnected(): Promise<boolean> {
    const conn = await connectToDatabase();
    return !!conn;
  },

  async getUsers(): Promise<Array<User & { passwordHash: string }>> {
    const mongo = await connectToDatabase();
    if (mongo) {
      try {
        const docs = await UserModel.find().lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      } catch {}
    }
    const store = ensureDataFile();
    return store.users;
  },

  async findUserByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    const normalized = email.toLowerCase().trim();
    const mongo = await connectToDatabase();
    if (mongo) {
      try {
        const doc = await UserModel.findOne({ email: normalized }).lean();
        if (doc) {
          const user = { ...(doc as any), _id: (doc as any)._id.toString() } as User & { passwordHash: string };
          if (FIXTURE_ACCOUNT_EMAILS.has(normalized) && user.passwordHash) {
            await UserModel.updateOne({ _id: (doc as any)._id }, { $set: { passwordHash: "" } });
            user.passwordHash = "";
          }
          return user;
        }
      } catch (error) {
        console.error("MongoDB user lookup or fixture credential cleanup failed:", error);
      }
    }
    const store = ensureDataFile();
    const user = store.users.find((u) => u.email.toLowerCase() === normalized);
    if (!user) return null;
    if (FIXTURE_ACCOUNT_EMAILS.has(normalized) && user.passwordHash) {
      user.passwordHash = "";
      saveStoreData(store);
    }
    return user;
  },

  async findUserById(id: string): Promise<User | null> {
    const mongo = await connectToDatabase();
    if (mongo) {
      try {
        const doc = await UserModel.findById(id).lean();
        if (doc) {
          const userObj = { ...(doc as any), _id: (doc as any)._id.toString() };
          delete userObj.passwordHash;
          return userObj;
        }
      } catch {}
    }
    const store = ensureDataFile();
    const found = store.users.find((u) => u._id === id);
    if (!found) return null;
    const { passwordHash, ...safe } = found;
    return safe;
  },

  async createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role: "client" | "freelancer" | "admin";
    username: string;
  }): Promise<User> {
    const mongo = await connectToDatabase();
    if (mongo) {
      try {
        const doc = await UserModel.create({
          ...userData,
          status: "active",
          rating: 5.0,
          reviewCount: 0,
          completedOrders: 0,
        });
        const obj = doc.toObject();
        delete (obj as any).passwordHash;
        return { ...obj, _id: obj._id.toString() } as unknown as User;
      } catch {}
    }

    const store = ensureDataFile();
    const newUser: User & { passwordHash: string } = {
      _id: `u_${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      passwordHash: userData.passwordHash,
      role: userData.role,
      username: userData.username.toLowerCase().trim(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      status: "active",
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStoreData(store);
    const { passwordHash, ...safe } = newUser;
    return safe;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const mongo = await connectToDatabase();
    if (mongo) {
      try {
        const doc = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (doc) return { ...(doc as any), _id: (doc as any)._id.toString() };
      } catch {}
    }
    const store = ensureDataFile();
    const idx = store.users.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(store);
    const { passwordHash, ...safe } = store.users[idx];
    return safe;
  },

  async getServices(params?: {
    q?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sellerId?: string;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const store = ensureDataFile();
    let services = [...store.services];

    if (params?.sellerId) {
      services = services.filter((s) => s.sellerId === params.sellerId);
    }
    if (params?.status) {
      services = services.filter((s) => s.status === params.status);
    } else {
      services = services.filter((s) => s.status === "published" || !s.status);
    }

    if (params?.category && params.category !== "all") {
      const catLower = params.category.toLowerCase().replace(/-/g, " ");
      services = services.filter((s) => s.category.toLowerCase().replace(/-/g, " ") === catLower);
    }

    if (params?.q) {
      const qLower = params.q.toLowerCase();
      services = services.filter(
        (s) =>
          s.title.toLowerCase().includes(qLower) ||
          s.shortDesc.toLowerCase().includes(qLower) ||
          s.category.toLowerCase().includes(qLower) ||
          s.tags.some((t) => t.toLowerCase().includes(qLower))
      );
    }

    if (params?.minPrice !== undefined) {
      services = services.filter((s) => s.packages[0]?.price >= Number(params.minPrice));
    }
    if (params?.maxPrice !== undefined) {
      services = services.filter((s) => s.packages[0]?.price <= Number(params.maxPrice));
    }
    if (params?.minRating !== undefined) {
      services = services.filter((s) => (s.rating || 5) >= Number(params.minRating));
    }

    if (params?.sort === "price-asc") {
      services.sort((a, b) => (a.packages[0]?.price || 0) - (b.packages[0]?.price || 0));
    } else if (params?.sort === "price-desc") {
      services.sort((a, b) => (b.packages[0]?.price || 0) - (a.packages[0]?.price || 0));
    } else if (params?.sort === "rating") {
      services.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      services.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const total = services.length;
    const startIndex = (page - 1) * limit;
    const paginated = services.slice(startIndex, startIndex + limit);

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const store = ensureDataFile();
    return store.services.find((s) => s.slug === slug || s._id === slug) || null;
  },

  async createService(data: Partial<Service>): Promise<Service> {
    const store = ensureDataFile();
    const seller = store.users.find((u) => u._id === data.sellerId);
    const newService: Service = {
      _id: `s_${Date.now()}`,
      sellerId: data.sellerId || "u_freelancer_1",
      seller: seller
        ? {
            _id: seller._id,
            name: seller.name,
            username: seller.username,
            avatar: seller.avatar,
            rating: seller.rating,
            reviewCount: seller.reviewCount,
          }
        : undefined,
      title: data.title || "Untitled Service",
      slug: (data.title || "untitled-service").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDesc: data.shortDesc || "",
      fullDesc: data.fullDesc || "",
      category: data.category || "Web Development",
      tags: data.tags || [],
      packages: data.packages || [
        {
          id: "basic",
          name: "Basic",
          description: "Standard starter deliverable",
          price: 150,
          deliveryDays: 3,
          revisions: 1,
          features: ["Standard Delivery"],
        },
      ],
      images: data.images || [data.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"],
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      status: "published",
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.services.unshift(newService);
    saveStoreData(store);
    return newService;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    const store = ensureDataFile();
    const idx = store.services.findIndex((s) => s._id === id);
    if (idx === -1) return null;
    store.services[idx] = { ...store.services[idx], ...updates, updatedAt: new Date().toISOString() };
    saveStoreData(store);
    return store.services[idx];
  },

  async deleteService(id: string): Promise<boolean> {
    const store = ensureDataFile();
    const idx = store.services.findIndex((s) => s._id === id);
    if (idx === -1) return false;
    store.services.splice(idx, 1);
    saveStoreData(store);
    return true;
  },

  async getOrders(params?: { userId?: string; role?: string; status?: string }) {
    const store = ensureDataFile();
    let orders = [...store.orders];

    if (params?.userId) {
      if (params.role === "freelancer") {
        orders = orders.filter((o) => o.freelancerId === params.userId);
      } else if (params.role === "client") {
        orders = orders.filter((o) => o.clientId === params.userId);
      } else {
        orders = orders.filter((o) => o.clientId === params.userId || o.freelancerId === params.userId);
      }
    }

    if (params?.status) {
      orders = orders.filter((o) => o.status === params.status);
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const store = ensureDataFile();
    return store.orders.find((o) => o._id === id) || null;
  },

  async createOrder(data: {
    clientId: string;
    serviceId: string;
    packageId: string;
    requirements?: string;
  }): Promise<Order> {
    const store = ensureDataFile();
    const client = store.users.find((u) => u._id === data.clientId);
    const service = store.services.find((s) => s._id === data.serviceId);

    if (!service) throw new Error("Service not found");
    if (!client) throw new Error("Client not found");

    const pkg = service.packages.find((p) => p.id === data.packageId) || service.packages[0];
    const freelancer = store.users.find((u) => u._id === service.sellerId);

    const now = new Date();
    const dueAt = new Date(now.getTime() + (pkg.deliveryDays || 3) * 86400000).toISOString();

    const newOrder: Order = {
      _id: `ord_${Date.now()}`,
      clientId: client._id,
      freelancerId: service.sellerId,
      serviceId: service._id,
      client: {
        _id: client._id,
        name: client.name,
        email: client.email,
        avatar: client.avatar,
      },
      freelancer: freelancer
        ? {
            _id: freelancer._id,
            name: freelancer.name,
            email: freelancer.email,
            avatar: freelancer.avatar,
          }
        : undefined,
      service: {
        _id: service._id,
        title: service.title,
        coverImage: service.coverImage,
        category: service.category,
      },
      packageSnapshot: pkg,
      requirements: data.requirements || "",
      price: pkg.price,
      currency: "USD",
      status: "IN_PROGRESS",
      dueAt,
      deliveries: [],
      revisionRequests: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    store.orders.unshift(newOrder);

    // Create automatic alert notification for freelancer
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: service.sellerId,
      title: "New Order Received!",
      message: `${client.name} ordered '${pkg.name}' for ${service.title} ($${pkg.price}).`,
      type: "order",
      link: "/dashboard/orders",
      read: false,
      createdAt: now.toISOString(),
    });

    saveStoreData(store);
    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
    extra?: {
      delivery?: { message: string; files: Array<{ name: string; url: string; size?: string }> };
      revisionFeedback?: string;
    }
  ): Promise<Order | null> {
    const store = ensureDataFile();
    const order = store.orders.find((o) => o._id === orderId);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (extra?.delivery) {
      order.deliveries.push({
        deliveredAt: new Date().toISOString(),
        message: extra.delivery.message,
        files: extra.delivery.files,
        status: "submitted",
      });
      // Notify client
      store.notifications.unshift({
        _id: `notif_${Date.now()}`,
        userId: order.clientId,
        title: "Order Work Delivered",
        message: `Your freelancer submitted deliverables for order #${order._id.substring(0, 8)}. Please inspect and approve.`,
        type: "order",
        link: "/dashboard/orders",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (extra?.revisionFeedback) {
      order.revisionRequests.push({
        requestedAt: new Date().toISOString(),
        feedback: extra.revisionFeedback,
      });
      // Notify freelancer
      store.notifications.unshift({
        _id: `notif_${Date.now()}`,
        userId: order.freelancerId,
        title: "Revision Requested",
        message: `Client requested modifications for order #${order._id.substring(0, 8)}. Feedback: "${extra.revisionFeedback}"`,
        type: "order",
        link: "/dashboard/orders",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (status === "COMPLETED") {
      order.completedAt = new Date().toISOString();
      // Increment completed orders counters
      const s = store.services.find((serv) => serv._id === order.serviceId);
      if (s) s.completedOrders = (s.completedOrders || 0) + 1;

      const f = store.users.find((u) => u._id === order.freelancerId);
      if (f) f.completedOrders = (f.completedOrders || 0) + 1;

      const c = store.users.find((u) => u._id === order.clientId);
      if (c) c.completedOrders = (c.completedOrders || 0) + 1;
    }

    saveStoreData(store);
    return order;
  },

  async createReview(data: {
    orderId: string;
    clientId: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const store = ensureDataFile();
    const order = store.orders.find((o) => o._id === data.orderId);
    if (!order) throw new Error("Order not found");
    if (order.status !== "COMPLETED") throw new Error("Order must be completed before reviewing");

    const existing = store.reviews.find((r) => r.orderId === data.orderId);
    if (existing) throw new Error("Review already submitted for this order");

    const client = store.users.find((u) => u._id === data.clientId);

    const newReview: Review = {
      _id: `rev_${Date.now()}`,
      orderId: order._id,
      clientId: data.clientId,
      freelancerId: order.freelancerId,
      serviceId: order.serviceId,
      client: client
        ? {
            _id: client._id,
            name: client.name,
            avatar: client.avatar,
          }
        : undefined,
      rating: Math.max(1, Math.min(5, data.rating)),
      comment: data.comment,
      moderationStatus: "approved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.reviews.unshift(newReview);

    // Recalculate Service rating & review count aggregates
    const serviceReviews = store.reviews.filter(
      (r) => r.serviceId === order.serviceId && r.moderationStatus === "approved"
    );
    const service = store.services.find((s) => s._id === order.serviceId);
    if (service && serviceReviews.length > 0) {
      const avg = serviceReviews.reduce((acc, r) => acc + r.rating, 0) / serviceReviews.length;
      service.rating = Math.round(avg * 10) / 10;
      service.reviewCount = serviceReviews.length;
    }

    // Recalculate Freelancer rating & review count
    const freelancerReviews = store.reviews.filter(
      (r) => r.freelancerId === order.freelancerId && r.moderationStatus === "approved"
    );
    const freelancer = store.users.find((u) => u._id === order.freelancerId);
    if (freelancer && freelancerReviews.length > 0) {
      const fAvg = freelancerReviews.reduce((acc, r) => acc + r.rating, 0) / freelancerReviews.length;
      freelancer.rating = Math.round(fAvg * 10) / 10;
      freelancer.reviewCount = freelancerReviews.length;
    }

    saveStoreData(store);
    return newReview;
  },

  async getReviews(params?: { serviceId?: string; freelancerId?: string }): Promise<Review[]> {
    const store = ensureDataFile();
    let revs = [...store.reviews];
    if (params?.serviceId) {
      revs = revs.filter((r) => r.serviceId === params.serviceId);
    }
    if (params?.freelancerId) {
      revs = revs.filter((r) => r.freelancerId === params.freelancerId);
    }
    return revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    const store = ensureDataFile();
    const userConvs = store.conversations.filter((c) => c.participantIds.includes(userId));

    // Populate participant details
    return userConvs.map((c) => {
      const participants = store.users
        .filter((u) => c.participantIds.includes(u._id))
        .map(({ passwordHash, ...rest }) => rest as User);
      return { ...c, participants };
    }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const store = ensureDataFile();
    return store.messages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  async sendMessage(data: { conversationId: string; senderId: string; body: string }): Promise<Message> {
    const store = ensureDataFile();
    const conv = store.conversations.find((c) => c._id === data.conversationId);
    if (!conv) throw new Error("Conversation not found");

    const newMsg: Message = {
      _id: `msg_${Date.now()}`,
      conversationId: data.conversationId,
      senderId: data.senderId,
      body: data.body,
      createdAt: new Date().toISOString(),
    };

    store.messages.push(newMsg);
    conv.lastMessage = data.body;
    conv.lastMessageAt = new Date().toISOString();

    saveStoreData(store);
    return newMsg;
  },

  async getNotifications(userId: string): Promise<Notification[]> {
    const store = ensureDataFile();
    return store.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async markNotificationRead(id: string): Promise<void> {
    const store = ensureDataFile();
    const notif = store.notifications.find((n) => n._id === id);
    if (notif) {
      notif.read = true;
      saveStoreData(store);
    }
  },

  async getAdminMetrics() {
    const store = ensureDataFile();
    const usersCount = store.users.length;
    const servicesCount = store.services.length;
    const ordersCount = store.orders.length;
    const completedOrders = store.orders.filter((o) => o.status === "COMPLETED");
    const grossVolume = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const platformFee = Math.round(grossVolume * 0.1); // 10% marketplace commission

    return {
      usersCount,
      servicesCount,
      ordersCount,
      grossVolume,
      platformFee,
      activeOrdersCount: store.orders.filter((o) => o.status === "IN_PROGRESS" || o.status === "DELIVERED").length,
      ordersByStatus: {
        IN_PROGRESS: store.orders.filter((o) => o.status === "IN_PROGRESS").length,
        DELIVERED: store.orders.filter((o) => o.status === "DELIVERED").length,
        COMPLETED: completedOrders.length,
        REVISION: store.orders.filter((o) => o.status === "REVISION_REQUESTED").length,
        CANCELLED: store.orders.filter((o) => o.status === "CANCELLED").length,
      },
    };
  },
};
