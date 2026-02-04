'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: "Adaeze Okoro",
    role: "Vibe Coder & Indie Hacker",
    initials: "AO",
    content: "I used to jump straight into code and waste days going in circles. BlueprintAI helped me plan my SaaS before writing a single line — now I ship features that actually make sense."
  },
  {
    name: "Michael Chen",
    role: "Product Manager at ScaleUp",
    initials: "MC",
    content: "Generating PRDs, user stories, and specs in minutes instead of weeks? This tool paid for itself on the first project. My engineering team finally gets clear requirements."
  },
  {
    name: "Priya Sharma",
    role: "UI/UX Designer at DesignLab",
    initials: "PS",
    content: "The visual canvas lets me map user journeys before opening Figma. I can finally see the full product flow and design with context, not guesswork."
  },
  {
    name: "James Okafor",
    role: "Senior Engineer at DevForge",
    initials: "JO",
    content: "For the first time, I'm getting specs with actual database schemas and API routes. No more translating vague requirements into code. BlueprintAI speaks my language."
  },
  {
    name: "Sofia Martinez",
    role: "Founder & Solo Builder",
    initials: "SM",
    content: "As a non-technical founder, I could never communicate my vision to developers. Now I hand them a BlueprintAI spec and they know exactly what to build."
  },
  {
    name: "David Kim",
    role: "Engineering Manager at BuildIt",
    initials: "DK",
    content: "Our planning time has been cut in half. The AI asks questions I didn't even think to ask, and the automated task creation from user stories is a massive boost."
  }
];

export function Testimonials() {
  return (
    <div className="relative w-full overflow-hidden py-10 mask-linear-fade">
      <div className="flex gap-6 items-stretch">
        {/* First copy of testimonials */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35
          }}
          className="flex gap-6 shrink-0"
        >
          {TESTIMONIALS.map((testimonial, idx) => (
            <TestimonialCard key={`t1-${idx}`} {...testimonial} />
          ))}
        </motion.div>

        {/* Second copy for seamless loop */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 35
          }}
          className="flex gap-6 shrink-0"
        >
          {TESTIMONIALS.map((testimonial, idx) => (
            <TestimonialCard key={`t2-${idx}`} {...testimonial} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, initials, content }: { name: string, role: string, initials: string, content: string }) {
  return (
    <div className="w-[85vw] md:w-[350px] bg-white/5 border border-white/10 p-6 rounded-md flex flex-col gap-4 hover:border-cyan/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md overflow-hidden bg-cyan/20 flex items-center justify-center text-cyan font-bold text-sm">
          {initials}
        </div>
        <div>
          <div className="font-bold text-white text-sm">{name}</div>
          <div className="text-xs text-cyan">{role}</div>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        &ldquo;{content}&rdquo;
      </p>
    </div>
  );
}
