/**
 * ScenarioForge - Prisma seed script
 *
 * Seeds the database with a comprehensive catalog of technologies across 12
 * categories, plus 3 demo scenarios (each with 1 demo solution) so the feed
 * isn't empty on first run.
 *
 * Run with:  bun run prisma/seed.ts
 *
 * NOTE: This script intentionally does NOT delete Users. It only clears
 * Technology, Scenario, Solution, Vote, and ScenarioTechnology rows.
 */

import { db } from '../src/lib/db'

// ─── Slug helper ───────────────────────────────────────────────────────────
//  - lowercase
//  - replace '#' with '-sharp-' (so "C#" -> "c-sharp")
//  - replace any run of non-alphanumeric chars with a single '-'
//  - strip leading/trailing dashes
//
// Examples:
//   "Go (Golang)"                  -> "go-golang"
//   "AWS ECS/EKS"                  -> "aws-ecs-eks"
//   "C++"                          -> "c"
//   "C#"                           -> "c-sharp"
//   "HTTP/HTTPS"                   -> "http-https"
//   "Amazon Web Services (AWS)"    -> "amazon-web-services-aws"
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/#/g, '-sharp-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Technology catalog ────────────────────────────────────────────────────
// Each entry: [name, category]. Slug is derived via slugify().
type TechEntry = [name: string, category: string]

const TECHNOLOGIES: TechEntry[] = [
  // 1. Programming Languages
  ['Python', 'Programming Languages'],
  ['JavaScript', 'Programming Languages'],
  ['TypeScript', 'Programming Languages'],
  ['Java', 'Programming Languages'],
  ['C#', 'Programming Languages'],
  ['Go (Golang)', 'Programming Languages'],
  ['Rust', 'Programming Languages'],
  ['C++', 'Programming Languages'],
  ['PHP', 'Programming Languages'],
  ['Kotlin', 'Programming Languages'],
  ['Swift', 'Programming Languages'],
  ['Dart', 'Programming Languages'],
  ['R', 'Programming Languages'],
  ['Bash/Shell Scripting', 'Programming Languages'],
  ['PowerShell', 'Programming Languages'],

  // 2. Web Development
  ['HTML5', 'Web Development'],
  ['CSS3', 'Web Development'],
  ['React', 'Web Development'],
  ['Angular', 'Web Development'],
  ['Vue.js', 'Web Development'],
  ['Next.js', 'Web Development'],
  ['Node.js', 'Web Development'],
  ['Express.js', 'Web Development'],
  ['ASP.NET Core', 'Web Development'],
  ['Django', 'Web Development'],
  ['Flask', 'Web Development'],
  ['FastAPI', 'Web Development'],
  ['Spring Boot', 'Web Development'],

  // 3. Databases
  ['SQL', 'Databases'],
  ['PostgreSQL', 'Databases'],
  ['MySQL', 'Databases'],
  ['MariaDB', 'Databases'],
  ['Microsoft SQL Server', 'Databases'],
  ['Oracle Database', 'Databases'],
  ['MongoDB', 'Databases'],
  ['Redis', 'Databases'],
  ['Cassandra', 'Databases'],
  ['DynamoDB', 'Databases'],
  ['Elasticsearch', 'Databases'],

  // 4. Cloud Computing
  ['Microsoft Azure', 'Cloud Computing'],
  ['Amazon Web Services (AWS)', 'Cloud Computing'],
  ['Google Cloud Platform (GCP)', 'Cloud Computing'],
  ['Azure Virtual Machines', 'Cloud Computing'],
  ['Azure App Service', 'Cloud Computing'],
  ['Azure Kubernetes Service (AKS)', 'Cloud Computing'],
  ['Azure Functions', 'Cloud Computing'],
  ['AWS EC2', 'Cloud Computing'],
  ['AWS Lambda', 'Cloud Computing'],
  ['AWS ECS/EKS', 'Cloud Computing'],
  ['Google Kubernetes Engine (GKE)', 'Cloud Computing'],

  // 5. DevOps
  ['Git', 'DevOps'],
  ['GitHub', 'DevOps'],
  ['GitLab', 'DevOps'],
  ['Azure DevOps', 'DevOps'],
  ['Jenkins', 'DevOps'],
  ['Docker', 'DevOps'],
  ['Kubernetes', 'DevOps'],
  ['Helm', 'DevOps'],
  ['ArgoCD', 'DevOps'],
  ['CI/CD Pipelines', 'DevOps'],
  ['Terraform', 'DevOps'],
  ['Ansible', 'DevOps'],
  ['Pulumi', 'DevOps'],

  // 6. Networking
  ['TCP/IP', 'Networking'],
  ['DNS', 'Networking'],
  ['HTTP/HTTPS', 'Networking'],
  ['VPN', 'Networking'],
  ['Load Balancing', 'Networking'],
  ['Firewalls', 'Networking'],
  ['Routing & Switching', 'Networking'],
  ['SD-WAN', 'Networking'],
  ['Network Security', 'Networking'],

  // 7. Cybersecurity
  ['Ethical Hacking', 'Cybersecurity'],
  ['Penetration Testing', 'Cybersecurity'],
  ['SOC Operations', 'Cybersecurity'],
  ['SIEM', 'Cybersecurity'],
  ['Microsoft Sentinel', 'Cybersecurity'],
  ['Identity Management', 'Cybersecurity'],
  ['Zero Trust', 'Cybersecurity'],
  ['Cloud Security', 'Cybersecurity'],
  ['Threat Hunting', 'Cybersecurity'],
  ['Incident Response', 'Cybersecurity'],

  // 8. Artificial Intelligence
  ['AI Fundamentals', 'Artificial Intelligence'],
  ['Machine Learning', 'Artificial Intelligence'],
  ['Deep Learning', 'Artificial Intelligence'],
  ['Generative AI', 'Artificial Intelligence'],
  ['Large Language Models (LLMs)', 'Artificial Intelligence'],
  ['Prompt Engineering', 'Artificial Intelligence'],
  ['AI Agents', 'Artificial Intelligence'],
  ['Retrieval-Augmented Generation (RAG)', 'Artificial Intelligence'],
  ['Fine-Tuning Models', 'Artificial Intelligence'],
  ['Computer Vision', 'Artificial Intelligence'],
  ['Natural Language Processing (NLP)', 'Artificial Intelligence'],

  // 9. Data Engineering & Analytics
  ['Power BI', 'Data Engineering & Analytics'],
  ['Tableau', 'Data Engineering & Analytics'],
  ['Apache Spark', 'Data Engineering & Analytics'],
  ['Apache Kafka', 'Data Engineering & Analytics'],
  ['Databricks', 'Data Engineering & Analytics'],
  ['ETL Pipelines', 'Data Engineering & Analytics'],
  ['Data Warehousing', 'Data Engineering & Analytics'],
  ['Data Lakes', 'Data Engineering & Analytics'],
  ['Hadoop', 'Data Engineering & Analytics'],

  // 10. Monitoring & Observability
  ['Grafana', 'Monitoring & Observability'],
  ['Prometheus', 'Monitoring & Observability'],
  ['ELK Stack', 'Monitoring & Observability'],
  ['OpenTelemetry', 'Monitoring & Observability'],
  ['Azure Monitor', 'Monitoring & Observability'],
  ['Application Insights', 'Monitoring & Observability'],

  // 11. Mobile Development
  ['Android Development', 'Mobile Development'],
  ['iOS Development', 'Mobile Development'],
  ['Flutter', 'Mobile Development'],
  ['React Native', 'Mobile Development'],

  // 12. Emerging Technologies
  ['Blockchain', 'Emerging Technologies'],
  ['Web3', 'Emerging Technologies'],
  ['Internet of Things (IoT)', 'Emerging Technologies'],
  ['Edge Computing', 'Emerging Technologies'],
  ['Digital Twins', 'Emerging Technologies'],
  ['AR/VR', 'Emerging Technologies'],
  ['Quantum Computing', 'Emerging Technologies'],
  ['Robotics', 'Emerging Technologies'],
]

// ─── Demo scenarios ────────────────────────────────────────────────────────
// Each scenario: title, summary, content (markdown), difficulty, technology
// names (must match the names in TECHNOLOGIES above), and one demo solution.
interface DemoSolution {
  content: string
  codeSnippet?: string
  language?: string
  isAccepted?: boolean
}

interface DemoScenario {
  title: string
  summary: string
  content: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  technologyNames: string[]
  solution: DemoSolution
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    title: 'Scaling a Real-Time Chat App Beyond a Single Node.js Process',
    summary:
      'A Node.js + Socket.IO chat service works fine on one box, but falls over the moment we horizontally scale to 3 pods behind a load balancer. Messages sent on pod A never reach users connected to pod B. How do we share session state and fan out messages across all instances?',
    content: `## Context

We run a customer-facing chat application built with **Node.js**, **Express.js**, and **Socket.IO**. Traffic has grown to the point where a single Node.js process can no longer keep up, so we deployed 3 replicas behind a Kubernetes Service.

## Problem

Once traffic is split across pods, users connected to pod A no longer receive messages that originate on pod B. The Socket.IO default in-memory adapter only knows about sockets in its own process.

## Constraints

- Must keep latency under 100ms p95 for message delivery.
- Cannot lose in-flight messages when a pod is evicted.
- Already running on **Kubernetes**; prefer not to introduce a new managed service if a self-hosted one will do.
- **Redis** is already in the stack for caching.

## What we've considered

1. Sticky sessions at the load balancer — but this breaks room-based fan-out and rebalances poorly on scale events.
2. A Kafka topic per room — overkill and adds too much latency for a chat UX.

## Question

What's the recommended adapter pattern for Socket.IO in a multi-pod deployment, and how should we configure the Redis cluster to survive a pod loss without dropping queued messages?`,
    difficulty: 'intermediate',
    technologyNames: ['Node.js', 'Redis', 'Docker', 'Kubernetes'],
    solution: {
      content: `Use the **Socket.IO Redis Streams adapter** (\`@socket.io/redis-streams-adapter\`) instead of the legacy Redis adapter. The streams adapter persists messages to a Redis stream, so if a pod is briefly disconnected from Redis it can replay missed messages rather than dropping them.

### Architecture

- Each pod connects to the same Redis (preferably a 3-node Redis Cluster for HA).
- The adapter publishes each emitted event to a stream keyed by \`socket.io:stream\`.
- Pods consume the stream via consumer groups; on reconnect they resume from the last acknowledged ID.

### Why this beats the alternatives

- **Sticky sessions** break \`io.to(room)\` fan-out because the emitting pod may not own the target sockets.
- **Kafka** works but adds 50-150ms of latency per hop and forces you to provision partitions per room.
- **Legacy Redis adapter** (pub/sub) drops messages if a subscriber is momentarily disconnected — streams solve this.

### Resilience notes

- Set \`EPHEMERAL: false\` semantics by trimming the stream with \`MAXLEN ~ 10000\` so it doesn't grow forever.
- Configure pod \`terminationGracePeriodSeconds: 30\` so Socket.IO can drain on \`SIGTERM\`.
- Use a Redis Sentinel or Cluster — a single Redis instance is the new SPOF.`,
      codeSnippet: `// server.ts
import { Server } from 'socket.io'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-streams-adapter'

const redis = createClient({ url: process.env.REDIS_URL })
await redis.connect()

const io = new Server(3000, {
  cors: { origin: process.env.WEB_ORIGIN },
})

io.adapter(createAdapter(redis, {
  streamName: 'socket.io:stream',
  maxLen: 10000,
}))

io.on('connection', (socket) => {
  socket.on('join', (room) => void socket.join(room))
  socket.on('message', ({ room, text }) => {
    io.to(room).emit('message', { from: socket.id, text })
  })
})`,
      language: 'typescript',
      isAccepted: true,
    },
  },
  {
    title: 'Designing a Zero Trust Architecture for a Hybrid Azure + On-Prem Estate',
    summary:
      'Leadership has mandated Zero Trust across our hybrid environment. We have ~40 on-prem file servers, an Azure Kubernetes Service (AKS) cluster running internal apps, and a Microsoft Sentinel SIEM. Where do we even start without ripping out everything we own?',
    content: `## Context

Our estate is hybrid:
- **On-prem**: ~40 Windows file servers in two datacenters, joined to a single AD forest.
- **Azure**: an **AKS** cluster running ~25 internal microservices, plus a handful of Azure Functions for ETL.
- **Identity**: on-prem AD synchronized to Azure AD via AD Connect.
- **SIEM**: **Microsoft Sentinel** is already ingesting sign-in logs and AKS activity.

## Problem

The CISO has decreed "Zero Trust by end of next fiscal year." That's a 12-month runway, and we cannot forklift everything. We need a phased plan that delivers visible risk reduction each quarter.

## Constraints

- Cannot break legacy SMB apps that still rely on NTLM.
- Budget for ~3 new platform-level investments (not 30).
- Must produce auditable evidence for Sentinel within 90 days.

## Question

What's the recommended sequence of Zero Trust pillars to deploy across this hybrid estate, and which specific Azure / Sentinel capabilities should we lean on so we get measurable signal into the SIEM fast?`,
    difficulty: 'advanced',
    technologyNames: [
      'Microsoft Azure',
      'Azure Kubernetes Service (AKS)',
      'Microsoft Sentinel',
      'Zero Trust',
    ],
    solution: {
      content: `Zero Trust is not a product; it's a sequence of controls. Build it pillar by pillar, **identity first**, because identity is the new perimeter and Sentinel already has the richest signal there.

### Recommended 12-month sequence

**Quarter 1 — Identity as the new perimeter**
- Roll out **Conditional Access** with device compliance checks; require MFA for all Azure, M365, and AKS kubectl access.
- Enable **Identity Protection** and pipe risk events into Sentinel via the built-in connector.
- For on-prem, deploy **Azure AD Application Proxy** for the 5 most-abused internal web apps so users stop VPN-ing in.

**Quarter 2 — Network segmentation**
- Replace flat on-prem VLANs with **micro-segmentation** using Azure Arc + Defender for Servers.
- Put AKS behind an internal **Azure Private Link** so services are not reachable from the public internet.
- Decommission legacy site-to-site VPN in favor of **Azure VPN + Conditional Access** (per-app tunneling).

**Quarter 3 — Workload & data**
- Move file shares to **Azure Files** with identity-based SMB; enable Defender for Storage.
- Tag every AKS workload with a service principal and enforce **workload identity federation** (no more long-lived secrets).

**Quarter 4 — Visibility & automation**
- Author **Sentinel analytics rules** that correlate Conditional Access failures with AKS API anomalies.
- Wire **Sentinel automation rules** to isolate compromised pods via an Azure Function calling \`kubectl cordon\`.

### Why this order

Identity gives you the fastest Sentinel signal (days), which buys political capital to fund the harder network and data work. Network segmentation without identity hygiene just gives you well-organized breach zones.

### Pitfalls to avoid

- Don't try to fix NTLM in Q1 — wrap it behind Application Proxy and let identity risk scoring do the heavy lifting until apps are modernized.
- Don't buy a separate microsegmentation appliance; Defender for Servers + Arc is enough at this estate size.`,
      language: 'markdown',
      isAccepted: true,
    },
  },
  {
    title: 'Building a RAG Customer Support Bot That Doesn\'t Hallucinate Return Policies',
    summary:
      'Our LLM-powered support bot gives correct answers 80% of the time — and confidently invents return policy details the other 20%. We have ~2,000 support articles in PostgreSQL. How do we architect a RAG pipeline that we can actually trust in production?',
    content: `## Context

- Stack: **Python** + **FastAPI** backend, **PostgreSQL** for the knowledge base (~2,000 articles, ~3GB of text).
- LLM: gpt-4-class model, called via the provider's hosted API.
- The bot serves a consumer e-commerce site; wrong return-policy answers create legal and refund exposure.

## Problem

A naive RAG prototype retrieves top-5 chunks via embedding similarity and feeds them to the LLM. It works for ~80% of queries, but the bot confidently hallucinates the remaining 20%, especially on edge cases like "can I return a final-sale item if it arrived damaged?"

## Constraints

- We need to *prove* to legal that answers are grounded in cited source text.
- Latency budget: <3s end-to-end p95.
- Articles are updated weekly by non-engineers; embedding refresh must be cheap.

## Question

What's the right RAG architecture for high-stakes retrieval — chunking strategy, retrieval depth, reranking, and grounding guardrails — that will get us from 80% to >97% correct without rewriting the knowledge base?`,
    difficulty: 'expert',
    technologyNames: [
      'Python',
      'Large Language Models (LLMs)',
      'Retrieval-Augmented Generation (RAG)',
      'PostgreSQL',
    ],
    solution: {
      content: `Move from "retrieve-and-pray" to a **retrieve-rerank-verify** pipeline. The hallucinations aren't an LLM problem; they're a retrieval-quality problem dressed up as a model problem.

### Architecture

1. **Chunking** — split articles into ~256-token semantic chunks with 50-token overlap, but preserve section headings as chunk metadata. Never chunk mid-sentence.
2. **Embedding store** — use **pgvector** inside your existing PostgreSQL so you don't operate a second database. Store one row per chunk with \`article_id\`, \`section_title\`, \`updated_at\`.
3. **Hybrid retrieval** — combine:
   - Dense vector search (top 20)
   - BM25 keyword search via Postgres \`tsvector\` (top 20)
   - Union + dedupe → ~30 candidates
4. **Cross-encoder reranking** — run a small reranker model (e.g., bge-reranker) on the 30 candidates, keep top 5.
5. **Grounded generation** — prompt the LLM with the 5 chunks *and* a hard instruction: "If the answer is not in the sources, respond with: I don't have enough information to answer that." Require the model to cite \`article_id:section_title\` for every claim.
6. **Post-hoc verifier** — a second, cheap LLM call verifies each citation actually supports its claim. If verification fails, downrank or suppress the answer.

### Latency math (p95)

- Embedding query: ~80ms
- Hybrid retrieval (pgvector + tsvector in parallel): ~120ms
- Reranker on 30 candidates: ~400ms
- Main LLM call: ~1.2s
- Verifier: ~600ms
- **Total: ~2.4s**, comfortably under the 3s budget.

### Why this works

The 20% hallucinations are almost always chunks that *looked* similar in embedding space but weren't actually the policy section. The BM25 + rerank combination catches policy queries that dense embeddings miss ("final sale damaged return" is mostly keyword-driven). The verifier is the legal team's safety net — even if the model hallucinates, the verifier catches it before the user sees anything.

### Operational notes

- Re-embed only chunks whose \`updated_at\` changed — keep a trigger on the articles table that marks chunks dirty.
- Log every query with its retrieved chunk IDs and verifier verdict; this is your eval dataset for free.
- Don't fine-tune the LLM on your KB; you'd lose the ability to update knowledge without retraining.`,
      codeSnippet: `# rag_pipeline.py (sketch)
from pgvector.sqlalchemy import Vector
from sqlalchemy import select, text

async def retrieve(engine, query_vec, query_text, k=20):
    async with engine.connect() as conn:
        dense = await conn.execute(
            select(Chunk).order_by(Chunk.embedding.l2_distance(query_vec)).limit(k)
        )
        sparse = await conn.execute(
            text("SELECT id FROM chunks WHERE tsv @@ plainto_tsquery(:q) LIMIT :k"),
            {"q": query_text, "k": k},
        )
        return dedupe(dense.fetchall(), sparse.fetchall())

async def answer(query: str):
    q_vec = await embed(query)
    candidates = await retrieve(engine, q_vec, query)
    top5 = reranker.rank(query, candidates, k=5)
    draft = await llm.generate(query, top5, require_citations=True)
    verified = await verifier.check(draft, top5)
    return draft if verified else FALLBACK_MESSAGE`,
      language: 'python',
      isAccepted: true,
    },
  },
]

// ─── Main ──────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('→ ScenarioForge seed: starting\n')

  // 1) Clear existing rows in FK-safe order. Users are intentionally preserved.
  console.log('→ Clearing existing rows (Vote, Solution, ScenarioTechnology, Scenario, Technology)...')
  await db.vote.deleteMany({})
  await db.solution.deleteMany({})
  await db.scenarioTechnology.deleteMany({})
  await db.scenario.deleteMany({})
  await db.technology.deleteMany({})
  console.log('   cleared.\n')

  // 2) Upsert a demo user to own the seed scenarios/solutions.
  //    passwordHash "demo-no-login" is a sentinel value; real auth goes through NextAuth.
  console.log('→ Upserting demo user (demo@scenara.dev)...')
  const demoUser = await db.user.upsert({
    where: { email: 'demo@scenara.dev' },
    update: {
      name: 'Demo Engineer',
      passwordHash: 'demo-no-login',
    },
    create: {
      email: 'demo@scenara.dev',
      name: 'Demo Engineer',
      passwordHash: 'demo-no-login',
      bio: 'Seed-owned demo account. Not used for real authentication.',
      role: 'member',
    },
  })
  console.log(`   demo user id: ${demoUser.id}\n`)

  // 3) Seed technologies.
  console.log(`→ Seeding ${TECHNOLOGIES.length} technologies...`)
  const techBySlug = new Map<string, string>() // slug -> id
  const techByName = new Map<string, string>() // name -> id

  for (const [name, category] of TECHNOLOGIES) {
    const slug = slugify(name)
    if (techBySlug.has(slug)) {
      console.warn(`   ! slug collision on "${slug}" (from "${name}") — skipping duplicate`)
      continue
    }
    const tech = await db.technology.create({
      data: {
        name,
        slug,
        category,
        createdById: null, // seeded technologies have no human creator
      },
    })
    techBySlug.set(slug, tech.id)
    techByName.set(name, tech.id)
  }
  console.log(`   inserted ${techBySlug.size} technologies.\n`)

  // Sanity-check: verify slugs for the tricky cases mentioned in the spec.
  const slugSpotChecks = [
    ['Go (Golang)', 'go-golang'],
    ['AWS ECS/EKS', 'aws-ecs-eks'],
    ['C++', 'c'],
    ['C#', 'c-sharp'],
    ['HTTP/HTTPS', 'http-https'],
  ] as const
  for (const [name, expectedSlug] of slugSpotChecks) {
    const actual = slugify(name)
    if (actual !== expectedSlug) {
      console.warn(`   ! slug spot-check failed: "${name}" -> "${actual}" (expected "${expectedSlug}")`)
    }
  }

  // 4) Seed demo scenarios + their solutions + ScenarioTechnology links.
  console.log(`→ Seeding ${DEMO_SCENARIOS.length} demo scenarios (with 1 solution each)...`)
  let scenariosSeeded = 0

  for (const s of DEMO_SCENARIOS) {
    // Resolve technology IDs, skipping any names we don't have (defensive).
    const techLinks: { technologyId: string }[] = []
    for (const techName of s.technologyNames) {
      const techId = techByName.get(techName)
      if (!techId) {
        console.warn(`   ! scenario "${s.title}" references unknown technology "${techName}" — skipping that link`)
        continue
      }
      techLinks.push({ technologyId: techId })
    }

    const scenario = await db.scenario.create({
      data: {
        title: s.title,
        summary: s.summary,
        content: s.content,
        difficulty: s.difficulty,
        status: 'open',
        authorId: demoUser.id,
        technologies: {
          create: techLinks.map((t) => ({ technologyId: t.technologyId })),
        },
      },
    })

    await db.solution.create({
      data: {
        scenarioId: scenario.id,
        authorId: demoUser.id,
        content: s.solution.content,
        codeSnippet: s.solution.codeSnippet ?? null,
        language: s.solution.language ?? null,
        isAccepted: s.solution.isAccepted ?? false,
        upvotes: 0,
      },
    })

    scenariosSeeded++
    console.log(`   • "${s.title}" [${s.difficulty}] — ${techLinks.length} techs linked`)
  }
  console.log(`   inserted ${scenariosSeeded} scenarios + ${scenariosSeeded} solutions.\n`)

  // 5) Summary.
  const techCount = await db.technology.count()
  const scenarioCount = await db.scenario.count()
  const solutionCount = await db.solution.count()
  console.log('═══════════════════════════════════════════════════════════')
  console.log('  SEED COMPLETE')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`  Technologies seeded : ${techCount}`)
  console.log(`  Scenarios seeded    : ${scenarioCount}`)
  console.log(`  Solutions seeded    : ${solutionCount}`)
  console.log(`  Demo user           : ${demoUser.email} (${demoUser.id})`)
  console.log('═══════════════════════════════════════════════════════════\n')
}

main()
  .catch((err) => {
    console.error('✗ Seed failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
