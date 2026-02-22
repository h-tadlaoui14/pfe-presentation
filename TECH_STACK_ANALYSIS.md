# STAYGENIE Tech Stack & Competitor Analysis

This document analyzes the best-in-class technology stack for STAYGENIE and compares it with the traditional portals dominating the Moroccan market.

## 🏛️ Competitor Landscape

| Competitor | Core Stack | Premium Services | AI Approach |
|---|---|---|---|
| **Avito.ma** | Flask, Tornado, MongoDB | Branded Boutiques, Premium Ads, Broad Marketplace | Basic ML for ads/recs |
| **Mubawab.ma** | Traditional PHP/Web | Mubawab Transaction (New builds), Lead Gen Tools | Smart pricing & recommendations |
| **Sarouty.ma** | PropTech focus | SAROUTY Real Estate (Valuation & Management) | AI virtual assistants (Market data) |
| **STAYGENIE** | **Next.js + FastAPI** | **Subsidy-as-a-Service, Contract Intelligence** | **Conversational Reasoning (GPT-4)** |

## 🧠 STAYGENIE's "AI-First" Advantage

Traditional portals are built as **Catalogs** (SQL-first) with premium visibility services. STAYGENIE is built as a **Reasoning Engine** (AI-first) with premium intelligence services.

| Feature | Portals (Avito/Mubawab/Sarouty) | STAYGENIE |
|---|---|---|
| **Search** | Keyword & Filters (Rigid) | **Conversational & Intent-based** |
| **Subsidies** | Static links or general info | **Real-time Eligibility Engine (Engine 02)** |
| **Management** | Listing tools & basic dashboards | **Property Management AI (Engine 06)** |
| **Trust** | Verified badges (Basic) | **Trust & Risk Scoring (Engine 05)** |
| **Expansion** | Volume-driven (More ads) | **Intelligence-driven (Better decisions)** |

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
