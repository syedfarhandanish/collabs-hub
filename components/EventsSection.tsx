'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const eventsList = [
  {
    id: 1,
    title: "Inaugural Launch Session",
    category: "Core Team Meeting",
    type: "Hybrid (Online + Physical Meeting)",
    date: "27",
    month: "Jun",
    year: "2026",
    description: "The inaugural launch session aimed to officially activate the Collabs Core Team, introduce the vision and long-term direction of the platform, and discuss early priorities before public launch.",
    image: "/kickoff-meeting.jpeg",
    participantsText: "27 Members",
    details: {
      dateFull: "Saturday, 27 June 2026 · 9:05 PM – 10:50 PM",
      hostedBy: "Ehan Ali & Amna Sahar",
      attendees: "27 members: Founder, Director, Collaboration Directors, Field Managers, Subject Leads, Club Leads, Coordinators, Ambassadors, Media & Content team",
      sections: [
        {
          title: "1. SESSION OVERVIEW",
          body: "The inaugural launch session of Collabs convened on the evening of Saturday, 27 June 2026, running from 9:05 PM to 10:50 PM. It brought together the full core team for the first time in a structured virtual plus physical setting, marking the transition of Collabs from a vision and structural framework into an active, operational community with every appointed role represented on the call. The meeting was facilitated by Ehan Ali and Amna and structured across three primary phases: the founder's address, an open member review and a closing discussion on execution priorities."
        },
        {
          title: "2. FOUNDER'S ADDRESS",
          body: "The session formally opened with an address from Syed Farhan Danish, Founder of Collabs. Farhan outlined the core vision driving the platform; to build a student-led digital community that bridges geographical and socioeconomic gaps between School students across Pakistan, with an initial focus on Chitral & Gilgit Baltistan. He emphasized that the real measure of the launch would not be the session itself, but what the team does in the weeks immediately following it."
        },
        {
          title: "3. OPEN MEMBER REVIEW",
          body: "Representatives from across the team were invited to share their perspectives, questions and initial thoughts on their respective roles. The review surfaced a consistent theme: enthusiasm for the platform's mission paired with a clear desire for structural clarity before execution begins. Insights and observations raised during the review included the importance of clear communication channels and understanding what the first visible milestone for students would look like once the platform goes live."
        },
        {
          title: "4. PLANS & PROPOSALS",
          body: "The most substantive proposal raised was the idea of hosting virtual events with a Model United Nations (MUN) cited as a flagship example. The proposal was met with unanimous agreement from the team on one condition: all events should be planned and executed only after a working operational framework is in place. Establishing an operational framework remains the immediate organizational priority."
        },
        {
          title: "5. ITEMS NOT ADDRESSED & PENDING DECISIONS",
          body: "The timeline for the Collabs website going live was not addressed and will be placed on the agenda for the next team meeting. Additionally, the communication platform remained under consideration between Google Chat and WhatsApp. (Note: Google Chats was finalized after a complete survey from the team)."
        },
        {
          title: "6. CONCLUSION",
          body: "The inaugural launch session achieved its core objective: bringing the full 27-member core team together, establishing a shared understanding of the platform’s vision and opening structured dialogue across all roles and departments. The foundation laid today positions Collabs to move into active operation with clarity, coordination and purpose."
        }
      ]
    }
  }
];

export default function EventsSection({ isLight, setSelectedEvent }: { isLight: boolean, setSelectedEvent: (val: any) => void }) {
  return (
    <section className="w-full pt-10 pb-16 md:pb-20 px-4 md:px-6 flex flex-col items-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-10 md:mb-12 px-4">
        <h2 className={`text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}>Journey & Milestones</h2>
        <p className={`max-w-xl mx-auto font-medium text-base md:text-lg transition-colors duration-500 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Celebrating our steps towards a connected digital future.</p>
      </motion.div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 gap-8 md:gap-12">
        {eventsList.map((event) => (
          <motion.div 
            key={event.id}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className={`group relative rounded-4xl md:rounded-[2.5rem] overflow-hidden border shadow-2xl transition-all duration-300 md:hover:-translate-y-2 flex flex-col lg:flex-row transform-gpu ${
              isLight 
                ? 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-slate-300/50 hover:shadow-indigo-500/20' 
                : 'bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10 shadow-black/80 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:border-white/20'
            }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${isLight ? 'bg-linear-to-tr from-indigo-50 to-transparent' : 'bg-linear-to-tr from-cyan-950/30 to-transparent'}`}></div>

            <div className="w-full lg:w-5/12 relative min-h-62.5 md:min-h-75 overflow-hidden shrink-0 bg-[#0a0a0a]">
              <Image src={event.image} alt={event.title} fill className="object-cover transition-transform duration-700 md:group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-transparent opacity-90"></div>
              
              <div className={`absolute top-4 left-4 md:top-6 md:left-6 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-xl flex flex-col items-center leading-none border transition-colors duration-300 ${isLight ? 'bg-white/95 border-white/50 text-slate-900' : 'bg-black/60 border-white/20 text-white'}`}>
                <span className="text-xl md:text-2xl font-black">{event.date}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{event.month}</span>
              </div>
            </div>

            <div className="w-full lg:w-7/12 p-6 md:p-8 lg:p-12 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-md uppercase tracking-widest border transition-colors ${
                  isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-cyan-950/40 text-cyan-400 border-cyan-800'
                }`}>
                  {event.category}
                </span>
              </div>
              
              <h3 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 md:mb-5 tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {event.title}
              </h3>
              
              <p className={`text-sm md:text-base leading-relaxed font-medium mb-6 md:mb-10 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {event.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-blue-100 text-blue-500' : 'border-[#0a0a0a] bg-blue-900/50 text-blue-300'}`}><i className="fa-solid fa-user text-[10px] md:text-xs"></i></div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-indigo-100 text-indigo-500' : 'border-[#0a0a0a] bg-indigo-900/50 text-indigo-300'}`}><i className="fa-solid fa-code text-[10px] md:text-xs"></i></div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center ${isLight ? 'border-white bg-cyan-100 text-cyan-500' : 'border-[#0a0a0a] bg-cyan-900/50 text-cyan-300'}`}><i className="fa-solid fa-lightbulb text-[10px] md:text-xs"></i></div>
                  </div>
                  <span className={`text-xs md:text-sm font-bold transition-colors ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{event.participantsText}</span>
                </div>

                <button 
                  onClick={() => setSelectedEvent(event)}
                  className={`px-5 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all flex items-center gap-2 border w-full md:w-auto justify-center ${
                    isLight 
                      ? 'bg-slate-900 text-white border-slate-900 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30' 
                      : 'bg-white text-black border-white hover:bg-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  Read Summary <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}