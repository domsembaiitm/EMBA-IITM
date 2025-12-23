
import { embaCurriculum } from '@/lib/data/curriculum'

// 1. TYPE DEFINITIONS
export interface LevelDetail {
    title: string;
    rationale: string;
}

export interface Archetype {
    keywords: string[];
    domain: string;
    focus: string;
    courses: string[];
    quote: string;
    color: string;
    levels: {
        senior: LevelDetail;
        mid: LevelDetail;
        junior: LevelDetail;
    };
}

// 2. ARCHETYPE DEFINITIONS
// Refined mapping of Keywords -> Specific Titles & Specialized Courses
const ARCHETYPES: Archetype[] = [
    // 1. HIGH SPECIFICITY DOMAINS (Match these first to avoid generic traps)
    {
        keywords: ['real estate', 'infra', 'leasing', 'construction', 'civil', 'dlf', 'pn & co'],
        domain: 'Infrastructure',
        focus: 'Urban Development',
        courses: ['MS9351', 'MS9132', 'MS9612', 'MS9131'], // Biz Law, Valuation, Ops, Investment
        quote: "Building the future requires more than concrete; it requires a vision for sustainable, integrated communities.",
        color: "amber",
        levels: {
            senior: { title: 'Head of Real Assets Strategy', rationale: "Merging engineering precision with financial valuation and urban planning foresight." },
            mid: { title: 'Real Estate Portfolio Manager', rationale: "Optimizing asset performance through strategic leasing and verified valuation models." },
            junior: { title: 'Infrastructure Project Analyst', rationale: "Transitioning from site execution to asset valuation and strategic planning." }
        }
    },
    {
        keywords: ['defense', 'defence', 'ministry', 'government', 'gail', 'psu', 'avn', 'public sector'],
        domain: 'Public Leadership',
        focus: 'National Impact',
        courses: ['MS9351', 'MS9352', 'MS9635', 'MS9252'], // Biz Law, Global Biz, Decision Making, Cultural Intel
        quote: "Serving the nation means bringing private-sector efficiency to public-sector scale.",
        color: "stone",
        levels: {
            senior: { title: 'Public Sector Strategist', rationale: "Applying modern management science to large-scale public sector challenges." },
            mid: { title: 'Public Program Lead', rationale: "Driving efficiency and modernization within public sector frameworks." },
            junior: { title: 'Policy Implementation Analyst', rationale: "Bridging the gap between policy intent and operational execution." }
        }
    },
    {
        keywords: ['automotive', 'vehicle', 'motor', 'ford', 'daimler', 'renault', 'nissan', 'brakes', 'auto '], // space after auto to avoid automation
        domain: 'Mobility & Manufacturing',
        focus: 'Future Mobility',
        courses: ['MS9635', 'MS9411', 'MS9612', 'MS9353'], // Decision Making, Tech Strategy, Ops, Tech Strategy
        quote: "The future of mobility isn't just electric; it's connected, autonomous, and deeply integrated into the smart city fabric.",
        color: "red",
        levels: {
            senior: { title: 'Automotive Innovation Leader', rationale: "Steering traditional manufacturing expertise towards next-gen mobility ecosystems." },
            mid: { title: 'Mobility Product Manager', rationale: "Managing the lifecycle of next-generation automotive product lines." },
            junior: { title: 'Manufacturing Operations Lead', rationale: "Optimizing production efficiency with modern management techniques." }
        }
    },
    {
        keywords: ['supply chain', 'logistics', 'operations manager', 'plant head', 'manufacturing', 'quality', 'freight', 'shipping', 'bsh'],
        domain: 'Manufacturing',
        focus: 'Resilient Value Chains',
        courses: ['MS9612', 'MS9651', 'MS9613', 'MS9611'], // Manuf Ops, Global Risk, Managerial Econ, Quant Modeling
        quote: "In a volatile world, the most agile supply chain wins. I build systems that bend but never break.",
        color: "orange",
        levels: {
            senior: { title: 'Global Operations Commander', rationale: "Optimizing global asset utilization through advanced quantitative modeling." },
            mid: { title: 'Supply Chain Solution Architect', rationale: "Redesigning logistics networks for resilience and cost-efficiency." },
            junior: { title: 'Logistics Project Lead', rationale: "Implementing data-driven improvements in supply chain operations." }
        }
    },
    {
        keywords: ['r&d', 'scientist', 'research', 'lab', 'design engineer', 'gulf oil', 'caterpillar'],
        domain: 'R&D & Engineering',
        focus: 'Disruptive Innovation',
        courses: ['MS9731', 'MS9635', 'MS9431', 'MS9353'], // Issues Project, Decision Making, Data Mining, Tech Strategy
        quote: "True innovation is about turning scientific curiosity into scalable market value.",
        color: "cyan",
        levels: {
            senior: { title: 'Chief Innovation Officer', rationale: "Translating scientific breakthroughs into scalable, commercially viable market solutions." },
            mid: { title: 'R&D Program Manager', rationale: "Managing the bridge between technical research and product roadmap." },
            junior: { title: 'Technical Product Specialist', rationale: "Commercializing technical expertise into market-ready product features." }
        }
    },
    {
        keywords: ['security', 'cyber', 'infosec', 'ciso', 'risk analyst', 'wipro'],
        domain: 'Risk & Security',
        focus: 'Digital Resilience',
        courses: ['MS9451', 'MS9133', 'MS9411', 'MS9351'], // Cyber Security, Risk Mgmt, IS Transformation, Biz Law
        quote: "In the digital age, trust is the currency. I build the vaults that keep that currency secure.",
        color: "zinc",
        levels: {
            senior: { title: 'Chief Information Security Officer', rationale: "Elevating security from a technical control to a board-level risk management function." },
            mid: { title: 'Cyber-Risk Strategist', rationale: "Aligning cybersecurity initiatives with business continuity goals." },
            junior: { title: 'Security Compliance Lead', rationale: "Ensuring regulatory compliance and operational security resilience." }
        }
    },

    // 2. FUNCTIONAL LEADERS
    {
        keywords: ['product manager', 'product owner', 'product roadmap', 'salesforce', 'athenahealth', 'loyalty juggernaut'],
        domain: 'Product Management',
        focus: 'Value Provenance',
        courses: ['MS9531', 'MS9511', 'MS9434', 'MS9331'], // Consumer Behavior, Applied Mktg, Analytics, Strat Planning
        quote: "Great products aren't just built; they are crafted from the intersection of user empathy and market foresight.",
        color: "pink",
        levels: {
            senior: { title: 'Chief Product Officer', rationale: "Synthesizes market signals with operational delivery to drive product-led growth." },
            mid: { title: 'Group Product Manager', rationale: "Leading product portfolios with a strategic, data-driven mindset." },
            junior: { title: 'Product Strategy Lead', rationale: "Moving from execution to strategic product roadmap ownership." }
        }
    },
    {
        keywords: ['finance', 'wealth', 'investment', 'bank', 'compliance', 'audit', 'taxation', 'chartered accountant', 'sbi', 'indian bank', 'bnp'],
        domain: 'BFSI',
        focus: 'Capital Governance',
        courses: ['MS9131', 'MS9132', 'MS9133', 'MS9152'], // Investment Mgmt, Valuation, Hedging, Corp Gov
        quote: "Sustainable growth requires a symbiotic balance between aggressive investment and rigorous risk governance.",
        color: "emerald",
        levels: {
            senior: { title: 'Chief Financial Strategist', rationale: "Transitioning from transactional finance to strategic capital allocation and risk governance." },
            mid: { title: 'Investment Portfolio Manager', rationale: "Maximizing portfolio returns through advanced valuation and risk hedging." },
            junior: { title: 'Financial Analyst', rationale: "Leveraging academic finance principles for rigorous market analysis." }
        }
    },
    {
        keywords: ['human resources', 'talent acquisition', 'people partner', 'learning & development', 'hrbp', 'ssn', 'placement'],
        domain: 'Human Capital',
        focus: 'Organizational Culture',
        courses: ['MS9231', 'MS9252', 'MS9211', 'MS9331'], // HR Mgmt, Cultural Intel, Micro OB, Strat Planning
        quote: "Culture eats strategy for breakfast. I engineer cultures that devour the competition.",
        color: "rose",
        levels: {
            senior: { title: 'Chief People Officer', rationale: "Moving from administrative HR to strategic human capital leverage and cultural engineering." },
            mid: { title: 'Talent Strategy Director', rationale: "Aligning workforce planning with long-term organizational strategy." },
            junior: { title: 'HR Business Partner', rationale: "Connecting people operations directly to business unit performance." }
        }
    },
    {
        keywords: ['marketing manager', 'brand manager', 'sales manager', 'growth', 'customer success', 'zoomrx'],
        domain: 'Sales & Marketing',
        focus: 'Customer Centricity',
        courses: ['MS9534', 'MS9533', 'MS9551', 'MS9531'], // Brand Mgmt, Salesforce, Strat Marketing, Consumer Behavior
        quote: "The customer's voice is the only strategy that matters. I translate that voice into operational reality.",
        color: "purple",
        levels: {
            senior: { title: 'Chief Growth Officer', rationale: "Unifying brand strategy with rigorous consumer analytics and distribution logic." },
            mid: { title: 'Brand Strategy Lead', rationale: "Driving brand equity through data-backed consumer insights." },
            junior: { title: 'Marketing Analytics Lead', rationale: "Optimizing marketing ROI through customer behavior analysis." }
        }
    },

    // 3. BROAD TECHNICAL & STRATEGIC ROLES
    {
        keywords: ['power bi', 'data analytics', 'data scientist', 'decision science', 'fractal', 'adf'],
        domain: 'Technology',
        focus: 'Data Strategy',
        courses: ['MS9431', 'MS9434', 'MS9635', 'MS9331'], // Data Mining, Analytics for Society, Decision Making, Strat Planning
        quote: "Data is the new oil, but only if you have the engine to refine it. My leadership builds that engine.",
        color: "blue",
        levels: {
            senior: { title: 'Chief Data Officer', rationale: "Bridges deep technical analytics with executive decision-making frameworks." },
            mid: { title: 'Enterprise Data Architect', rationale: "Designing scalable data ecosystems for enterprise intelligence." },
            junior: { title: 'Data Science Lead', rationale: "Applying advanced analytics to solve critical business problems." }
        }
    },
    {
        keywords: ['cloud', 'aws', 'azure', 'devops', 'software', 'architect', 'technical', 'developer', 'engineer', 'tech lead', 'adobe', 'tcs', 'cognizant', 'technerds'],
        domain: 'Technology',
        focus: 'Cloud Ecosystems',
        courses: ['MS9433', 'MS9451', 'MS9353', 'MS9411'], // IT for Digital Econ, Cyber Security, Tech Strategy, IS Transformation
        quote: "Technology modernization is not an IT upgrade; it is a business survival strategy.",
        color: "indigo",
        levels: {
            senior: { title: 'CTO / CIO', rationale: "Elevates engineering execution to strategic digital infrastructure planning." },
            mid: { title: 'Digital Transformation Architect', rationale: "Leading the technical migration to modern, scalable cloud ecosystems." },
            junior: { title: 'Senior Software Architect', rationale: "Broadening technical expertise with business strategy and management." }
        }
    },
    {
        keywords: ['management consultant', 'strategy consultant', 'advisory', 'capgemini', 'accenture', 'thoughtworks', 'acuity'],
        domain: 'Consulting',
        focus: 'Business Transformation',
        courses: ['MS9331', 'MS9411', 'MS9352', 'MS9252'], // Strat Planning, IS Transformation, Global Biz, Cultural Intel
        quote: "I don't just solve problems; I reframe them to unlock opportunities others haven't even seen yet.",
        color: "slate",
        levels: {
            senior: { title: 'Principal Consultant', rationale: "Structuring ambiguity into actionable corporate strategy and global competitiveness." },
            mid: { title: 'Strategy Engagement Manager', rationale: "Leading complex consulting engagements with varied stakeholders." },
            junior: { title: 'Management Associate', rationale: "Applying rigorous problem-solving frameworks to business challenges." }
        }
    },
    {
        keywords: ['program manager', 'delivery manager', 'agile', 'scrum', 'project manager', 'pwc', 'genpact'],
        domain: 'Program Management',
        focus: 'Strategic Delivery',
        courses: ['MS9211', 'MS9635', 'MS9331', 'MS9611'], // Org Behavior, Decision Making, Strat Planning, Quant Modeling
        quote: "Strategy is potential; execution is profit. I am the bridge that ensures the former leads to the latter.",
        color: "violet",
        levels: {
            senior: { title: 'Program Director', rationale: "Converting complex organizational objectives into delivered operational reality." },
            mid: { title: 'Senior Program Manager', rationale: "Managing large-scale delivery portfolios with cross-functional teams." },
            junior: { title: 'Agile Delivery Lead', rationale: "Driving operational efficiency and agile delivery within project teams." }
        }
    }
]

// Fallback for No Match
const DEFAULT_ARCHETYPE: Archetype = {
    keywords: [], // Empty keywords for fallback
    domain: 'General Management',
    focus: 'Cross-Functional Synergy',
    courses: ['MS9331', 'MS9352', 'MS9351', 'MS9731'], // Strat Planning, Global Biz, Biz Law, Issues Project
    quote: "Leadership is the art of aligning diverse forces toward a singular, transformative vision.",
    color: "blue",
    levels: {
        senior: { title: 'Strategic Enterprise Leader', rationale: "Developing a holistic general management perspective to lead cross-functional organizations." },
        mid: { title: 'Business Unit Head', rationale: "Transitioning from functional mastery to P&L and general management responsibility." },
        junior: { title: 'Business Operations Manager', rationale: "Building a broad foundation in business operations and strategy." }
    }
}

export const getTransformationNarrative = (headline: string, org: string | undefined, exp: number) => {
    const text = (headline + ' ' + (org || '')).toLowerCase()

    // 1. Find Matching Archetype
    let archetype = ARCHETYPES.find(a => a.keywords.some(k => text.includes(k))) || DEFAULT_ARCHETYPE

    // 2. Resolve Courses (Hydrate with Names)
    const catalystCourses = archetype.courses.map(code => {
        const c = embaCurriculum.find(curr => curr.code === code)
        return c ? { code: c.code, name: c.name.split('(')[0].trim() } : { code: code, name: 'Advanced Strategy' }
    })

    // 3. Select Level based on Experience
    const years = Math.floor(exp / 12)
    let selectedLevel = archetype.levels.mid // Default to mid
    let beforeState = "Functional Specialist"

    if (years < 8) {
        selectedLevel = archetype.levels.junior
        beforeState = "Emerging Specialist"
    } else if (years >= 8 && years < 16) {
        selectedLevel = archetype.levels.mid
        beforeState = "Functional Manager"
    } else {
        selectedLevel = archetype.levels.senior
        beforeState = "Domain Authority"
    }

    return {
        identity: {
            title: selectedLevel.title,
            domain: archetype.domain,
            focus: archetype.focus
        },
        journey: {
            before: beforeState,
            after: selectedLevel.title,
            intervention_desc: `Targeted specialization in ${archetype.focus} via IITM EMBA`
        },
        catalysts: catalystCourses,
        rationale: selectedLevel.rationale,
        quote: archetype.quote,
        color: archetype.color
    }
}
