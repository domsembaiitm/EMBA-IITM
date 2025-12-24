import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { embaCurriculum } from '@/lib/data/curriculum'
import { createClient } from '@/lib/supabase/server'
import { resolveAvatarUrl } from '@/lib/image-helper'
// import { embaStudents } from '@/lib/data/seeds' // REMOVED

export default async function Home() {
  const supabase = await createClient()

  // 2. Fetch Featured Profiles (Random 3) form DB
  const { data: featuredProfiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .eq('is_hidden', false)
    .limit(3)

  // Fallback stats (Real-time DB query via RPC to bypass RLS for aggregates)
  const { data: stats } = await supabase.rpc('get_cohort_stats')
  const totalStudents = stats?.[0]?.total_students || 49
  const avgExperience = stats?.[0]?.avg_experience ? Math.floor(stats[0].avg_experience / 12) : 15

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100">

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative w-full pt-24 pb-20 md:pt-32 md:pb-32 px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-8 max-w-3xl">
              <Badge variant="outline" className="border-slate-300 text-slate-500 uppercase tracking-widest text-[11px] px-3 py-1 bg-transparent">
                Executive MBA Profiles from DOMS IIT-Madras
              </Badge>

              <h1 className="text-6xl md:text-8xl font-serif font-medium text-slate-900 dark:text-white leading-[0.9] tracking-tight">
                Executive Talent,<br />
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Engineered</span> for Impact.
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-light leading-relaxed">
                Access a curated cohort of {totalStudents} senior professionals, transforming from functional experts to strategic enterprise leaders.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/recruiter/discover">
                  <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-none px-8 py-7 text-lg font-medium transition-all flex items-center gap-2 group">
                    Explore The Cohort
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:text-slate-900 rounded-none px-8 py-7 text-lg font-medium">
                    Manage Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Stat Box */}
            <div className="hidden md:block w-72 bg-slate-50 dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-serif text-slate-900 dark:text-white">{avgExperience}+</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Avg Years Exp.</div>
                </div>
                <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <div className="text-4xl font-serif text-slate-900 dark:text-white">14</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Domains</div>
                </div>
                <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
                <div>
                  <div className="text-4xl font-serif text-slate-900 dark:text-white">100%</div>
                  <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Verified Impact</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5. THE NATURE OF KNOWLEDGE (Curriculum Structure) */}
      <section className="py-20 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">The Nature of Knowledge</h2>
            <p className="text-slate-500 text-lg">A holistic composition of business acumen built over 123 credits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "Functional Foundation", credits: 30, desc: "Core business mechanics: Finance, Ops, Marketing, HR.", color: "bg-blue-100 text-blue-700" },
              { title: "Integrated Perspective", credits: 45, desc: "Cross-functional strategy & decision making.", color: "bg-purple-100 text-purple-700" },
              { title: "Global Leadership", credits: 30, desc: "Ethics, Governance, & Global Strategy.", color: "bg-amber-100 text-amber-700" },
              { title: "Applied Intelligence", credits: 18, desc: "3 Major Capstone Projects.", color: "bg-emerald-100 text-emerald-700" },
            ].map((item, i) => (
              <div key={i} className="group p-6 border border-slate-100 rounded-lg hover:border-slate-300 hover:shadow-md transition-all">
                <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold mb-4 ${item.color}`}>
                  {item.credits} Credits
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. THE COHORT FACT SHEET */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white">
                Beyond the Resume.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Traditional hiring relies on static history. The EMBA Talent Discovery Platform reveals candidate&apos;s trajectory and how they think, lead, and solve complex problems.
              </p>

              <ul className="space-y-4 pt-4">
                {[
                  "Coursework-Validated Competencies",
                  "Strategic Thinking Style Analysis",
                  "Transformation Arc Narratives",
                  "Verified Professional Identity"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 shadow-sm border border-slate-100">
                <Briefcase className="h-8 w-8 text-slate-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900">Industry</div>
                <div className="text-sm text-slate-500">Veterans</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-slate-100">
                <Users className="h-8 w-8 text-slate-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900">Leadership</div>
                <div className="text-sm text-slate-500">Ready</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-slate-100">
                <BookOpen className="h-8 w-8 text-slate-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900">Academic</div>
                <div className="text-sm text-slate-500">Rigor</div>
              </div>
              <div className="bg-white p-6 shadow-sm border border-slate-100">
                <ArrowUpRight className="h-8 w-8 text-slate-400 mb-4" />
                <div className="text-2xl font-bold text-slate-900">Growth</div>
                <div className="text-sm text-slate-500">Mindset</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TALENT SPOTLIGHT (Minimalist) */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">Featured Profiles</h2>
              <p className="text-slate-500">A glimpse into the diverse leadership profiles.</p>
            </div>
            <Link href="/recruiter/discover" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-blue-600 hover:underline">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProfiles && featuredProfiles.map((student) => (
              <Link href={`/recruiter/candidate/${student.id}`} key={student.id} className="group block">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:border-blue-100">
                  <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img src={resolveAvatarUrl(student.avatar_url)} alt={student.full_name || 'Candidate'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{student.headline?.split(' at ')[0] || 'Executive'}</div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-700 transition-colors">
                      {student.full_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                      <span>{student.work_experience ? Math.floor(student.work_experience / 12) : 10} Years Exp.</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      {/* Simple org display for now */}
                      <span className="truncate max-w-[120px]">{student.organization || 'Corporate'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link href="/recruiter/discover">
              <Button variant="outline" className="w-full">View All Profiles</Button>
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center text-slate-400 text-sm">
        <p>© 2026 Executive MBA Profiles from DOMS IIT-Madras. All rights reserved.</p>
      </footer>
    </div>
  )
}
