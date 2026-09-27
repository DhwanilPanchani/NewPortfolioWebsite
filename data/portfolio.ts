// Single source of truth for all site content.
// Sourced from the Obsidian vault (resume.md, projects.md, project folders).

export const profile = {
  name: 'Dhwanil Panchani',
  handle: 'dhwanil',
  role: 'Software Engineer · Full-Stack & AI Systems',
  location: 'United States',
  email: 'dhwanilpanchani@gmail.com',
  status: 'Open to SWE & AI engineering roles',
  headline: 'Software should show its work.',
  // Hero renders the headline as stacked lines with the last word accented.
  headlineLines: ['Software should', 'show its'],
  headlineAccent: 'work.',
  subhead:
    'From fraud models that had to justify every flag, to payment engines that explain each decision in milliseconds, to AI agents that have to cite their sources: I believe a system earns trust by proving how it got its answer.',
  summary:
    'Full-stack engineer with 3+ years designing APIs, building financial data systems, and shipping React/TypeScript frontends backed by MongoDB and SQL at scale. Strong track record in performance optimization, secure system design, and production debugging — with hands-on experience in payment routing, AWS infrastructure, and high-throughput data pipelines.',
  thesis: [
    'Three jobs, one rule. At TechVizor I built fraud models and payment systems for banks, where a flag nobody can explain is a flag nobody acts on. At IpserLab I shipped startup products end to end and learned what actually holds up in production. In between, grad school at Northeastern taught me to trust a benchmark only after running it myself.',
    "Now the systems I care about most have AI inside them, and the rule hasn't changed. Show the reason code. Cite the source. Trace the call. Score the result against ground truth. If software can't show its work, it hasn't earned trust yet.",
  ],
  links: {
    github: 'https://github.com/DhwanilPanchani',
    linkedin: 'https://linkedin.com/in/dhwanilpanchani',
    resume: '/documents/resume.pdf',
  },
};

export type Metric = { value: string; label: string };
export type Stage = { label: string; detail: string; parallel?: string[] };

export type Project = {
  id: string;
  name: string;
  kicker: string;
  tagline: string;
  problem: string;
  build: string;
  metrics: Metric[];
  stack: string[];
  pipeline: Stage[];
  status: 'Shipped' | 'In progress' | 'Research';
  domain: string;
  year: string;
  github?: string;
  live?: string;
  hue: number; // accent hue for the project's node / window glow
};

export const featured: Project[] = [
  {
    id: 'vantage',
    name: 'Vantage',
    kicker: 'Pre-settlement risk & recovery fabric',
    tagline:
      'Decides approve / delay / challenge / reject on an ISO 20022 instant payment in milliseconds — before the money moves.',
    problem:
      'Instant payments (FedNow, RTP) settle in seconds and can’t be pulled back, so every fraud decision has to happen before settlement.',
    build:
      'Four parallel signal sources — Neo4j mule-ring graph detection, Flink velocity features, an XGBoost model served via ONNX, and policy rules — fused into one explainable decision with machine-readable reason codes. Includes degraded-mode handling, DLQ + replay, and shadow-policy comparison.',
    metrics: [
      { value: '2.33ms', label: 'p50 decision latency' },
      { value: '23.04ms', label: 'p99 under load' },
      { value: '95%', label: 'mule-ring recall (38/40)' },
      { value: '0 / 1,480', label: 'legit payments falsely flagged' },
      { value: '26,510', label: 'payments replayed, 0 disagreements' },
      { value: '94', label: 'tests · 49 ADRs' },
    ],
    stack: [
      'Java 21',
      'Spring Boot 3.5',
      'ISO 20022',
      'Redpanda',
      'Flink',
      'Neo4j',
      'PostgreSQL',
      'Redis',
      'XGBoost → ONNX',
      'FastAPI',
      'OpenTelemetry',
      'Grafana',
    ],
    pipeline: [
      { label: 'Ingest', detail: 'Prowide ISO 20022 parse · dedup · transactional outbox' },
      { label: 'Stream', detail: 'Redpanda payment.requests.raw' },
      {
        label: 'Fan-out',
        detail: 'Parallel CompletableFuture signals',
        parallel: ['Flink velocity', 'Neo4j mule graph', 'ONNX model'],
      },
      { label: 'Policy', detail: 'Rule cascade + reason codes + shadow decision' },
      { label: 'Decide', detail: 'APPROVE · DELAY · CHALLENGE · REJECT' },
    ],
    status: 'Shipped',
    domain: 'Fintech · Streaming',
    year: '2026',
    github: 'https://github.com/DhwanilPanchani/vantage-payments',
    hue: 158,
  },
  {
    id: 'cordon',
    name: 'CORDON',
    kicker: 'Provenance-enforcing MCP proxy',
    tagline:
      'A deterministic checkpoint between an AI agent and its tools — untrusted content can’t quietly steer a tool call.',
    problem:
      'Agents that read web pages, emails, or tool outputs can be hijacked by prompt injection into actions they were never meant to take.',
    build:
      'A byte-transparent MCP relay applying Denning-lattice information-flow control. Every value carries integrity and confidentiality seals, tools declare capabilities (READ_LOCAL → EGRESS → PRIVILEGE), and a policy gate decides in OBSERVE, SHADOW, or ENFORCE mode. Same defense class as DeepMind’s CaMeL — but at the protocol boundary, so it protects any agent framework unmodified.',
    metrics: [
      { value: '949', label: 'AgentDojo attack/utility cases' },
      { value: '3 / 6', label: 'phases complete' },
      { value: '3', label: 'modes: observe · shadow · enforce' },
      { value: '$0', label: 'infra — local models only' },
    ],
    stack: [
      'Java 26',
      'Virtual threads',
      'Structured concurrency',
      'Gradle (Kotlin DSL)',
      'Jackson JSON-RPC',
      'jqwik',
      'Python 3.13',
      'AgentDojo',
      'Ollama',
      'Prometheus',
    ],
    pipeline: [
      { label: 'Client', detail: 'Any MCP client — e.g. Claude Code' },
      { label: 'Checkpoint', detail: 'Forwards bytes verbatim, parses a copy' },
      { label: 'Seals', detail: 'Integrity × confidentiality lattice labels' },
      { label: 'Gate', detail: 'Capability × taint policy decision' },
      { label: 'Tool', detail: 'MCP server — or blocked' },
    ],
    status: 'In progress',
    domain: 'Agent security',
    year: '2026',
    hue: 4,
  },
  {
    id: 'clarion',
    name: 'Clarion',
    kicker: 'Prior-authorization evidence & decision network',
    tagline:
      'Lets an LLM propose clinical evidence for a coverage decision — and refuses to let any unverified claim through.',
    problem:
      'CMS-0057-F pushes payers onto FHIR prior-auth APIs by January 2027. The hard part isn’t the API — it’s using AI on clinical notes without trusting it blindly.',
    build:
      'HAPI FHIR is the source of truth, projected into a Neo4j evidence graph. Deterministic rules evaluate each criterion of a real CMS policy (LCD L34220, lumbar MRI). A local LLM extracts candidate evidence that must pass a verbatim-citation gate and a relevance gate before it can even propose — never satisfy — a criterion.',
    metrics: [
      { value: '27% → 0%', label: 'citation fabrication' },
      { value: '188,996', label: 'FHIR resources ingested' },
      { value: '25,883+', label: 'evidence-graph relationships' },
      { value: '0', label: 'false positives on relevance drift' },
      { value: '78', label: 'tests passing' },
    ],
    stack: [
      'Java 21',
      'Spring Boot',
      'HAPI FHIR (R4)',
      'Neo4j',
      'PostgreSQL',
      'Ollama',
      'Python',
      'Synthea',
      'Docker Compose',
    ],
    pipeline: [
      { label: 'Request', detail: 'FHIR ServiceRequest arrives' },
      { label: 'Graph', detail: 'Projected into Neo4j evidence graph' },
      {
        label: 'Evaluate',
        detail: 'Rules and LLM run side by side',
        parallel: ['Deterministic rules', 'LLM extraction'],
      },
      { label: 'Gates', detail: 'Verbatim citation + relevance checks' },
      { label: 'Triage', detail: 'Reviewer UI — blocking → judgment → info' },
    ],
    status: 'Shipped',
    domain: 'Healthcare · Trustworthy AI',
    year: '2026',
    github: 'https://github.com/DhwanilPanchani/Clarion',
    hue: 200,
  },
  {
    id: 'sre',
    name: 'Agentic SRE',
    kicker: 'Multi-agent AWS incident response',
    tagline:
      'Two independent Bedrock agents diagnose a live fault, an orchestrator reconciles them, and severity-gated logic auto-fixes or pages a human.',
    problem:
      'Agent demos rarely show the hard parts: persistent state, a measurable eval signal, and a defined escalation path.',
    build:
      'A CDK-deployed victim service with SSM-driven chaos modes. Log and metrics agents run on Claude Haiku 4.5 via Bedrock; an orchestrator judges their agreement and severity; a narrow-IAM remediation Lambda auto-resets or escalates with a DynamoDB-conditional cooldown. Scored by a deterministic ground-truth eval loop — no LLM judge.',
    metrics: [
      { value: '378', label: 'tests passing' },
      { value: '15 / 15', label: 'severity calls correct' },
      { value: '15 / 15', label: 'root cause plausible' },
      { value: '$0.61', label: 'total AWS spend, 9 phases' },
    ],
    stack: [
      'AWS CDK',
      'Lambda',
      'API Gateway',
      'DynamoDB',
      'SSM',
      'Bedrock',
      'Claude Haiku 4.5',
      'CloudWatch EMF',
      'SNS',
      'Python',
    ],
    pipeline: [
      { label: 'Chaos', detail: 'Injector flips SSM chaos mode' },
      { label: 'Service', detail: 'API Gateway → Lambda → DynamoDB' },
      { label: 'Diagnose', detail: 'Independent Bedrock agents', parallel: ['Log agent', 'Metrics agent'] },
      { label: 'Reconcile', detail: 'Agreement + deterministic severity' },
      { label: 'Act', detail: 'Auto-remediate · escalate · log' },
    ],
    status: 'Shipped',
    domain: 'Cloud · AI agents',
    year: '2026',
    github: 'https://github.com/DhwanilPanchani/Agentic-SRE-Simulator',
    hue: 32,
  },
  {
    id: 'ares',
    name: 'Project Ares',
    kicker: 'Observable multi-agent execution platform',
    tagline:
      'Compiles a natural-language goal into a parallel DAG, runs it with local agents, and traces every decision.',
    problem: 'Agents fail silently, and nobody can explain why.',
    build:
      'A DAG compiler (qwen2.5:3b + Pydantic validation, 3-retry loop) feeds a dynamically built LangGraph StateGraph. Parallel ReAct workers use sandboxed tools; a phi4-mini critic scores trust; OpenTelemetry spans stream over SSE to a live React Flow canvas. Any failed node replays from its checkpoint.',
    metrics: [
      { value: '10', label: 'parallel agent nodes per run' },
      { value: '100%', label: 'LLM + tool calls traced (OTel)' },
      { value: '65–74%', label: 'critic trust on web research' },
      { value: '$0', label: 'API cost — fully local' },
    ],
    stack: [
      'Python 3.12',
      'FastAPI',
      'LangGraph',
      'LangChain',
      'Pydantic AI',
      'OpenTelemetry',
      'Ollama',
      'Next.js 15',
      'React Flow',
      'Zustand',
    ],
    pipeline: [
      { label: 'Goal', detail: 'Natural-language objective' },
      { label: 'Compile', detail: 'Typed DAGPlan, validated + retried' },
      { label: 'Execute', detail: 'LangGraph fan-out', parallel: ['Worker', 'Worker', 'Worker'] },
      { label: 'Critic', detail: 'phi4-mini trust score' },
      { label: 'Trace', detail: 'OTel → SSE → live canvas' },
    ],
    status: 'Shipped',
    domain: 'AI agents · Observability',
    year: '2026',
    github: 'https://github.com/DhwanilPanchani/ares',
    hue: 276,
  },
  {
    id: 'waymo',
    name: 'Waymo Coverage',
    kicker: 'Kinematic coverage analysis for AV datasets',
    tagline: 'Finds the driving scenarios a self-driving dataset is quietly missing.',
    problem:
      'Under-represented edge cases in autonomous-vehicle training data become under-tested behaviour on the road.',
    build:
      'A hand-written protobuf parser (no Waymo SDK) feeds a C++20 kinematics engine — speed, jerk, curvature, time-to-collision — exposed zero-copy to Python via pybind11. Scenarios become 15-feature vectors, clustered with KMeans + PCA into a Plotly dashboard that flags rare clusters and outliers.',
    metrics: [
      { value: '200 / 200', label: 'shards parsed, 0 errors' },
      { value: '94 : 1', label: 'cluster imbalance surfaced' },
      { value: '0.38s', label: 'TTC near-miss found' },
      { value: '~7×', label: 'faster than NumPy (M2)' },
    ],
    stack: [
      'C++20',
      'Eigen3',
      'pybind11',
      'GoogleTest',
      'Python',
      'scikit-learn',
      'Plotly',
      'Pydantic v2',
      'GitHub Actions',
    ],
    pipeline: [
      { label: 'Records', detail: 'Waymo Motion .tfrecord' },
      { label: 'Parse', detail: 'Hand-written protobuf decoder' },
      { label: 'Kinematics', detail: 'C++20 engine via pybind11' },
      { label: 'Cluster', detail: 'KMeans + PCA on 15-D vectors' },
      { label: 'Gaps', detail: 'Rare-scenario dashboard' },
    ],
    status: 'Shipped',
    domain: 'Autonomy · Data',
    year: '2026',
    github: 'https://github.com/DhwanilPanchani/WaymoCoverageAnalyzer',
    hue: 52,
  },
];

export type MiniProject = {
  id: string;
  name: string;
  blurb: string;
  metric: string;
  stack: string[];
  github?: string;
  live?: string;
};

export const secondary: MiniProject[] = [
  {
    id: 'fieldpulse',
    name: 'FieldPulse',
    blurb:
      'Open-source Claude Code plugin + web app that fuses satellite, soil, and weather signals into a crop-risk score.',
    metric: '3 MCP servers · 57/57 tests',
    stack: ['Python', 'MCP', 'Claude agents', 'NASA POWER', 'Next.js'],
    github: 'https://github.com/DhwanilPanchani/fieldpulse',
    live: 'https://fieldpulseagent.vercel.app',
  },
  {
    id: 'astroframe',
    name: 'AstroFrame',
    blurb:
      'Distributed astronomical time-series analysis over real Gaia DR3 HATS catalogs, benchmarked on Northeastern’s HPC.',
    metric: '2.90× speedup · 34.7s → 12.0s',
    stack: ['Python', 'LSDB', 'Dask', 'HEALPix', 'SLURM'],
    github: 'https://github.com/DhwanilPanchani/AstroFrame',
  },
  {
    id: 'edgeinfer',
    name: 'EdgeInfer',
    blurb: 'DistilBERT inference benchmarking on ONNX Runtime, profiled on a real Snapdragon 8 Elite device.',
    metric: 'p99 2.264ms · 205/205 NPU ops',
    stack: ['ONNX Runtime', 'DistilBERT', 'Qualcomm AI Hub'],
    github: 'https://github.com/DhwanilPanchani/EdgeInfer',
  },
  {
    id: 'mltoolchain',
    name: 'MLToolchain',
    blurb: 'PyTorch → ONNX → INT8 lowering pipeline, validated on the Hexagon NPU.',
    metric: '251µs NPU vs 37.55ms CPU — 150×',
    stack: ['PyTorch', 'ONNX', 'INT8', 'MobileNetV2'],
    github: 'https://github.com/DhwanilPanchani/MLToolchain',
  },
  {
    id: 'socperfkit',
    name: 'SoCPerfKit',
    blurb: 'SoC-level performance profiler with Prometheus export and automatic regression detection.',
    metric: 'p99 5.08ms · 3 regression types',
    stack: ['ONNX Runtime', 'Prometheus', 'matplotlib'],
    github: 'https://github.com/DhwanilPanchani/SoCPerfKit',
  },
  {
    id: 'echoai',
    name: 'EchoAI',
    blurb: 'AI public-speaking coach: real-time eye contact, pace, and filler-word scoring in the browser.',
    metric: '500ms feedback latency',
    stack: ['Next.js 15', 'React 19', 'Socket.IO', 'face-api.js', 'MongoDB'],
    github: 'https://github.com/DhwanilPanchani/EchoAI-AI-powered-public-speaking-coach',
  },
  {
    id: 'skin',
    name: 'Skin Disease DDP',
    blurb: 'EfficientNet-B3 classifier trained with PyTorch DDP + AMP on Northeastern’s H200/A100 cluster.',
    metric: '96.79% acc · 3.38× on 4 GPUs',
    stack: ['PyTorch DDP', 'NCCL', 'AMP', 'SLURM'],
    github: 'https://github.com/DhwanilPanchani/Skin-Disease-Classification-using-Parallel-Deep-Learning',
  },
];

export const archive: MiniProject[] = [
  {
    id: 'securecode',
    name: 'SecureCode AI',
    blurb: 'GNN + CodeBERT hybrid vulnerability detection.',
    metric: '98% detection accuracy',
    stack: ['PyTorch Geometric', 'CodeBERT'],
    github: 'https://github.com/DhwanilPanchani/SecureCode-AI-based-Intelligent-Vulnerability-Detection-System',
  },
  {
    id: 'gridsentry',
    name: 'GridSentry',
    blurb: 'TCN + Transformer grid demand forecasting with EV load shifting.',
    metric: '−25% simulated peak load',
    stack: ['PyTorch', 'Quantile regression'],
    github: 'https://github.com/DhwanilPanchani/GridSentry---AI-Powered-Electric-Grid-Forecasting-system',
  },
  {
    id: 'medlens',
    name: 'MedLens AR',
    blurb: 'AR medical training with OWL-ViT, SAM, and clinical VQA.',
    metric: '92% clinical VQA accuracy',
    stack: ['FastAPI', 'React Native', 'SAM'],
    github: 'https://github.com/DhwanilPanchani/MedLens-AR',
  },
  {
    id: 'prism',
    name: 'PRISM',
    blurb: 'Hospital financial-stability and readmission analytics with causal ML.',
    metric: '$1.2B+ TAM identified',
    stack: ['DuckDB', 'EconML', 'Streamlit'],
    github: 'https://github.com/DhwanilPanchani/PRISM--Payment-Ratio-Insights-for-Socioeconomic-Mapping',
  },
  {
    id: 'fx',
    name: 'Cross-Border FX Routing',
    blurb: 'Hidden FX markup detection and payment-route optimization.',
    metric: 'up to −35% fee leakage',
    stack: ['XGBoost', 'SHAP', 'DoWhy'],
    github: 'https://github.com/DhwanilPanchani/Cross-Border-Payment-Routing-Arbitrage-Analyzer',
  },
  {
    id: 'skilhire',
    name: 'SkilHire',
    blurb: 'MERN freelance marketplace with JWT role-based access.',
    metric: '12 REST endpoints',
    stack: ['MERN', 'JWT'],
    github: 'https://github.com/DhwanilPanchani/SkilHire--MERN-Stack',
  },
  {
    id: 'diffusion',
    name: 'Latent Diffusion + CLIP',
    blurb: 'Custom text-to-image pipeline with fine-tuned CLIP alignment.',
    metric: '−40% inference latency',
    stack: ['Diffusers', 'CLIP'],
    github:
      'https://github.com/DhwanilPanchani/Generative-AI-Projects/tree/main/Custom%20Diffusion%20Model(Flickr%2CCIFAR)',
  },
  {
    id: 'caption',
    name: 'Image Captioning',
    blurb: 'InceptionV3 + LSTM/GRU captioning on Flickr8k.',
    metric: '85%+ contextual relevance',
    stack: ['TensorFlow', 'GloVe'],
    github: 'https://github.com/DhwanilPanchani/Generative-AI-Projects/tree/main/Caption_Generation',
  },
  {
    id: 'plant',
    name: 'Plant Disease Multi-Task',
    blurb: 'Dual-head ResNet-50 for disease class + severity.',
    metric: '97.35% across 39 classes',
    stack: ['PyTorch', 'DeepLabV3+'],
    github: 'https://github.com/DhwanilPanchani/Plant-Disease-Detection',
  },
  {
    id: 'walmart',
    name: 'Walmart Retail Intelligence',
    blurb: 'Sales forecasting with Chronos and an LLM analytics copilot.',
    metric: '+22% forecast accuracy',
    stack: ['PyMC3', 'Chronos', 'LangChain'],
    github: 'https://github.com/DhwanilPanchani/Walmart-Sales-Analysis',
  },
  {
    id: 'cosmoplan',
    name: 'CosmoPlan',
    blurb: 'Space-agency management system with an OLTP → Snowflake pipeline.',
    metric: '3NF · zero redundancy',
    stack: ['Java Swing', 'SQL Server', 'dbt'],
    github: 'https://github.com/DhwanilPanchani/CosmoPlan-DMDD',
  },
  {
    id: 'datahub',
    name: 'Data Intelligence Hub',
    blurb: 'Django + Flask microservices with Gemini natural-language queries.',
    metric: '2 services · JWT inter-service auth',
    stack: ['Django', 'Flask', 'Gemini'],
    github: 'https://github.com/DhwanilPanchani/Data-Intelligence-Hub',
  },
];

export type Role = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  summary?: string;
  bullets: { label?: string; text: string }[];
  stack: string[];
};

export const experience: Role[] = [
  {
    id: 'ipserlab',
    company: 'IpserLab LLC',
    title: 'Software Engineer',
    location: 'Boston, MA',
    start: 'Aug 2025',
    end: 'Jul 2026',
    summary: 'Startup foundry — built JetSetGo (AI travel planner) and MarketFusion (B2B manufacturing marketplace).',
    bullets: [
      {
        text: 'Delivered JetSetGo FastAPI backend with async pipeline and Sentry telemetry sustaining p95 latency under 1,500ms across 10K+ production sessions.',
      },
      {
        text: 'Built React/Vite/TypeScript frontend with SSE streaming and circuit-breaker retry across 3 third-party API integrations, maintaining 99% SLA.',
      },
      {
        text: 'Designed MarketFusion with 60+ REST endpoints, 19-table PostgreSQL schema, and 4-role RBAC enforcing authorization across all API surface area.',
      },
      {
        text: 'Shipped GitHub Actions CI/CD with automated test gates and Redis/ElastiCache caching across 2 production services, cutting defect detection time by 55%.',
      },
      {
        text: 'Collaborated across product and engineering in Agile sprints on system design, code reviews, and technical documentation for 2 cross-functional teams.',
      },
    ],
    stack: [
      'FastAPI',
      'React',
      'TypeScript',
      'Vite',
      'SSE',
      'Redis',
      'PostgreSQL',
      'Java 21',
      'Jakarta EE',
      'GitHub Actions',
      'Sentry',
    ],
  },
  {
    id: 'techvizor',
    company: 'TechVizor',
    title: 'Software Engineer',
    location: 'Gujarat, India',
    start: 'May 2021',
    end: 'Jul 2023',
    summary:
      'Contracted across 5 enterprise clients spanning fintech, e-commerce, pharma, and telecom — fraud ML pipelines, high-concurrency Java/Spring Boot APIs, FastAPI microservices, and PySpark data infrastructure.',
    bullets: [
      {
        label: 'Infosys (Client)',
        text: 'Deployed XGBoost fraud classifier as a FastAPI microservice achieving sub-50ms real-time inference during live payment flows, improving fraud detection rate by 18% through feature engineering on 2M+ monthly transactions; built React admin dashboards that cut manual fraud review time by 30%.',
      },
      {
        label: 'Reliance / JioMart',
        text: 'Scaled FastAPI collaborative-filtering recommendation endpoints to 15K concurrent RPS during peak festive sales; reduced PySpark ML training batch time by 35% via Airflow ETL optimization; maintained 99.99% uptime on Java/Spring Boot session APIs.',
      },
      {
        label: 'ICICI Bank',
        text: 'Migrated a monolithic payment gateway to decoupled Java/Spring Boot microservices enabling cross-bank UPI interoperability on iMobile Pay; automated PySpark extraction over millions of daily UPI logs, cutting SME loan data-gathering time by 40%.',
      },
    ],
    stack: ['Python', 'FastAPI', 'PySpark', 'XGBoost', 'Java', 'Spring Boot', 'Airflow', 'React', 'Node.js'],
  },
];

export const education = [
  {
    id: 'neu',
    school: 'Northeastern University',
    degree: 'M.S. Information Systems',
    location: 'Boston, MA',
    start: 'Sep 2023',
    end: 'May 2025',
    courses: [
      'Data Science & ML',
      'Generative AI',
      'Parallel ML',
      'Data Structures & Algorithms',
      'Application Engineering',
      'Web Design',
    ],
  },
  {
    id: 'gtu',
    school: 'Gujarat Technological University',
    degree: 'B.E. Computer Engineering',
    location: 'Gujarat, India',
    start: 'Jul 2019',
    end: 'May 2023',
    courses: [],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Languages',
    items: ['Python', 'Java', 'TypeScript', 'JavaScript', 'C++', 'SQL', 'Go (learning)', 'Ruby (learning)'],
  },
  { group: 'Frontend', items: ['React', 'Next.js', 'TailwindCSS', 'Socket.IO', 'SSE', 'Recharts', 'Framer Motion'] },
  {
    group: 'Backend & APIs',
    items: ['FastAPI', 'Spring Boot', 'Node.js', 'Express', 'REST', 'GraphQL', 'Django', 'Flask', 'Pydantic v2', 'JWT'],
  },
  {
    group: 'Data',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Neo4j', 'Kafka / Redpanda', 'Flink', 'DuckDB', 'SQLAlchemy', 'PySpark'],
  },
  {
    group: 'AI / ML',
    items: ['LangGraph', 'LangChain', 'MCP', 'Bedrock', 'Ollama', 'PyTorch', 'ONNX', 'XGBoost', 'OpenTelemetry'],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      'AWS (Lambda, ECS, MSK, ElastiCache, S3)',
      'AWS CDK',
      'GCP',
      'Docker',
      'GitHub Actions',
      'Sentry',
      'Prometheus',
      'Grafana',
    ],
  },
];
