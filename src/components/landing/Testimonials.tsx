'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechFlow",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "BlueprintAI has completely transformed how we write PRDs. The AI suggestions are spot on and save us hours of work every week."
  },
  {
    name: "Michael Ross",
    role: "Frontend Lead at Vercel",
    image: "https://i.pravatar.cc/150?u=michael",
    content: "The visual canvas is a game changer. Being able to map out flows and generate tickets directly from them is exactly what we needed."
  },
  {
    name: "Jessica Stark",
    role: "CTO at StartupX",
    image: "https://i.pravatar.cc/150?u=jessica",
    content: "Finally, a tool that bridges the gap between design and engineering. The real-time collaboration features are buttery smooth."
  },
  {
    name: "David Kim",
    role: "Senior PM at Growth.io",
    image: "https://i.pravatar.cc/150?u=david",
    content: "I was skeptical about AI for documentation, but BlueprintAI proved me wrong. It's like having a senior PM pair writing with you."
  },
  {
    name: "Emily Watson",
    role: "Product Designer at Creative",
    image: "https://i.pravatar.cc/150?u=emily",
    content: "The interface is beautiful and intuitive. It helps me communicate complex logic to developers without writing endless documents."
  },
  {
    name: "James Carter",
    role: "Engineering Manager at BuildIt",
    image: "https://i.pravatar.cc/150?u=james",
    content: "Our sprint planning time has been cut in half. The automated ticket generation from user stories is a massive productivity boost."
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
            duration: 30 
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
            duration: 30 
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

function TestimonialCard({ name, role, image, content }: { name: string, role: string, image: string, content: string }) {
  return (
    <div className="w-[350px] bg-[#2ee6d6] border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-cyan/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-navy/10 relative">
          <Image 
            src={image} 
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <div className="font-bold text-navy text-sm">{name}</div>
          <div className="text-xs text-navy/70">{role}</div>
        </div>
      </div>
      <p className="text-sm text-navy/80 leading-relaxed">
        "{content}"
      </p>
    </div>
  );
}
