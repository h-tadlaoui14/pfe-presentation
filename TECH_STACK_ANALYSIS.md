# STAYGENIE Tech Stack & Competitor Analysis

This document analyzes the best-in-class technology stack for STAYGENIE and compares it with the traditional portals dominating the Moroccan market.

## 🏛️ Competitor Landscape

| Competitor | Core Stack (Research Findings) | AI Approach | Strategy |
|---|---|---|---|
| **Avito.ma** | Flask, Tornado, MongoDB, Kafka | Basic ML for ads/recs | High-volume classifieds (Monolith legacy) |
| **Mubawab.ma** | Traditional PHP/Web | GA integration, Smart pricing | Listing management and ease-of-use |
| **Sarouty.ma** | Disruptive tendencies | AI virtual assistants (PropTech focus) | Innovation-led search |

## 🧠 STAYGENIE's "AI-First" Advantage

Traditional portals are built as **Catalogs** (SQL-first). STAYGENIE is built as a **Reasoning Engine** (AI-first).

| Layer | STAYGENIE Choice | Why it's the "Best" for you | Competitor Status |
|---|---|---|---|
| **Frontend** | **Next.js (React)** | Server-side rendering for SEO (Casablanca listings) + Instant interactivity. | Often older React or templated HTML. |
| **Backend** | **FastAPI (Python)** | Python is the language of AI. FastAPI is **10x faster** than Flask and handles async AI calls natively. | Flask/PHP (Slower for real-time AI). |
| **Retrieval** | **Vector Search (Pinecone)** | Allows users to search by *intent* (e.g. "Peaceful area near tramway") rather than just "3 rooms". | Keyword filtering (Limited). |
| **LLM Orchestration**| **GPT-4o + LangChain** | Industry gold standard for reasoning and complex Moroccan subsidy logic. | Basic rule-based systems. |
| **Real-time** | **Firebase** | Ensures renters and owners see notes and feed instantly without refreshing. | Traditional polling or page reloads. |

## 🚀 Recommendation

For an AI startup in Morocco, staying with **Next.js + FastAPI + PostgreSQL** is the strongest path.

### Why Python (FastAPI)?

1. **Talent Pool**: All modern AI engineers work in Python.
2. **Libraries**: Every LLM tool (OpenAI, Anthropic, Vector DBs) releases Python SDKs first.
3. **Speed**: FastAPI is one of the fastest Python frameworks in existence, matching Node.js performance.

### Why Next.js?

1. **SEO**: Vital for real estate. Next.js ensures Google indexes every single property page.
2. **Speed**: Extremely low "Time to First Byte" (TTFB).
