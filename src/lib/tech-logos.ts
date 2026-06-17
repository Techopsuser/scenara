/**
 * Maps each technology (by name) to its official logo from the
 * Simple Icons CDN (https://cdn.simpleicons.org/{slug}).
 *
 * The CDN serves real, brand SVGs. For any technology without a known
 * mapping, the TechLogo component falls back to a letter avatar.
 *
 * Slugs verified against https://simpleicons.org.
 */

// name -> simple-icons slug
const LOGO_MAP: Record<string, string> = {
  // Programming Languages
  Python: 'python',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Java: 'openjdk',
  'C#': 'dotnet',
  'Go (Golang)': 'go',
  Rust: 'rust',
  'C++': 'cplusplus',
  PHP: 'php',
  Kotlin: 'kotlin',
  Swift: 'swift',
  Dart: 'dart',
  R: 'r',
  'Bash/Shell Scripting': 'gnubash',
  PowerShell: 'powershell',

  // Web Development
  HTML5: 'html5',
  CSS3: 'css3',
  React: 'react',
  Angular: 'angular',
  'Vue.js': 'vuedotjs',
  'Next.js': 'nextdotjs',
  'Node.js': 'nodedotjs',
  'Express.js': 'express',
  'ASP.NET Core': 'dotnet',
  Django: 'django',
  Flask: 'flask',
  FastAPI: 'fastapi',
  'Spring Boot': 'springboot',

  // Databases
  SQL: 'mysql',
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  MariaDB: 'mariadb',
  'Microsoft SQL Server': 'microsoftsqlserver',
  'Oracle Database': 'oracle',
  MongoDB: 'mongodb',
  Redis: 'redis',
  Cassandra: 'apachecassandra',
  DynamoDB: 'amazondynamodb',
  Elasticsearch: 'elasticsearch',

  // Cloud Computing
  'Microsoft Azure': 'microsoftazure',
  'Amazon Web Services (AWS)': 'amazonwebservices',
  'Google Cloud Platform (GCP)': 'googlecloud',
  'Azure Virtual Machines': 'microsoftazure',
  'Azure App Service': 'microsoftazure',
  'Azure Kubernetes Service (AKS)': 'microsoftazure',
  'Azure Functions': 'microsoftazure',
  'AWS EC2': 'amazonwebservices',
  'AWS Lambda': 'awslambda',
  'AWS ECS/EKS': 'amazonecs',
  'Google Kubernetes Engine (GKE)': 'googlecloud',

  // DevOps
  Git: 'git',
  GitHub: 'github',
  GitLab: 'gitlab',
  'Azure DevOps': 'azuredevops',
  Jenkins: 'jenkins',
  Docker: 'docker',
  Kubernetes: 'kubernetes',
  Helm: 'helm',
  ArgoCD: 'argo',
  'CI/CD Pipelines': 'githubactions',
  Terraform: 'terraform',
  Ansible: 'ansible',
  Pulumi: 'pulumi',

  // Networking (mostly generic, best-effort)
  'TCP/IP': 'wireshark',
  DNS: 'cloudflare',
  'HTTP/HTTPS': 'googlechrome',
  VPN: 'wireguard',
  'Load Balancing': 'nginx',
  Firewalls: 'fortinet',
  'Routing & Switching': 'cisco',
  'SD-WAN': 'cisco',
  'Network Security': 'fortinet',

  // Cybersecurity
  'Ethical Hacking': 'kalilinux',
  'Penetration Testing': 'kalilinux',
  'SOC Operations': 'elasticstack',
  SIEM: 'splunk',
  'Microsoft Sentinel': 'microsoftazure',
  'Identity Management': 'okta',
  'Zero Trust': 'cloudflare',
  'Cloud Security': 'cloudflare',
  'Threat Hunting': 'crowdstrike',
  'Incident Response': 'thehive',

  // Artificial Intelligence
  'AI Fundamentals': 'openai',
  'Machine Learning': 'tensorflow',
  'Deep Learning': 'pytorch',
  'Generative AI': 'openai',
  'Large Language Models (LLMs)': 'huggingface',
  'Prompt Engineering': 'openai',
  'AI Agents': 'openai',
  'Retrieval-Augmented Generation (RAG)': 'pinecone',
  'Fine-Tuning Models': 'pytorch',
  'Computer Vision': 'opencv',
  'Natural Language Processing (NLP)': 'huggingface',

  // Data Engineering & Analytics
  'Power BI': 'powerbi',
  Tableau: 'tableau',
  'Apache Spark': 'apachespark',
  'Apache Kafka': 'apachekafka',
  Databricks: 'databricks',
  'ETL Pipelines': 'apacheairflow',
  'Data Warehousing': 'snowflake',
  'Data Lakes': 'amazonaws',
  Hadoop: 'apachehadoop',

  // Monitoring & Observability
  Grafana: 'grafana',
  Prometheus: 'prometheus',
  'ELK Stack': 'elasticstack',
  OpenTelemetry: 'opentelemetry',
  'Azure Monitor': 'microsoftazure',
  'Application Insights': 'microsoftazure',

  // Mobile Development
  'Android Development': 'android',
  'iOS Development': 'ios',
  Flutter: 'flutter',
  'React Native': 'react',

  // Emerging Technologies
  Blockchain: 'blockchaindotcom',
  Web3: 'web3dotjs',
  'Internet of Things (IoT)': 'internetofthings',
  'Edge Computing': 'cloudflare',
  'Digital Twins': 'siemens',
  'AR/VR': 'unity',
  'Quantum Computing': 'ibm',
  Robotics: 'ros',

  // user-added example
  Bun: 'bun',
}

/**
 * Returns the logo URL for a technology via the Iconify API
 * (https://api.iconify.design), which serves official Simple Icons SVGs.
 * Logos are rendered in white so they are clearly visible on the dark
 * red/black theme. Returns null if the technology has no known logo mapping.
 *
 * Iconify is used instead of cdn.simpleicons.org because the latter blocks
 * requests with a 403 in some sandboxed environments.
 */
export function getTechLogoUrl(name: string): string | null {
  const slug = LOGO_MAP[name]
  if (!slug) return null
  return `https://api.iconify.design/simple-icons:${slug}.svg?color=ffffff`
}

/**
 * Returns the logo URL with a custom hex color (without the #).
 */
export function getTechLogoUrlColored(name: string, hex: string): string | null {
  const slug = LOGO_MAP[name]
  if (!slug) return null
  return `https://api.iconify.design/simple-icons:${slug}.svg?color=${hex}`
}
