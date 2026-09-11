import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  Baby,
  Bot,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Plus,
  ShieldCheck,
  Send,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  X,
} from 'lucide-react';
import { type ChangeEvent, type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const phone = '099945 55278';
const phoneHref = 'tel:+919994555278';
const whatsappHref = 'https://wa.me/919994555278?text=Hello%20Aazhi%20Dental%20Care%2C%20I%27d%20like%20to%20enquire%20about%20an%20appointment.';
const mapHref = 'https://www.google.com/maps/dir/?api=1&destination=Aazhi+Dental+Care%2C+526+Marudhamalai+Rd%2C+P+N+Pudur%2C+Coimbatore';

type AssistantActionKind = 'book' | 'call' | 'whatsapp';
type AssistantAction = { label: string; kind: AssistantActionKind };
type AssistantMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  actions?: AssistantAction[];
};

const initialAssistantMessages: AssistantMessage[] = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hi, I’m the Aazhi assistant. I can help with treatments, timings, directions, or getting your visit started.',
    actions: [
      { label: 'Book a visit', kind: 'book' },
      { label: 'Call the clinic', kind: 'call' },
    ],
  },
];

function getAssistantReply(question: string): Omit<AssistantMessage, 'id' | 'role'> {
  const query = question.toLowerCase();

  if (/(book|appointment|visit|schedule|slot|consult)/.test(query)) {
    return {
      text: 'I can help you get started. Choose a preferred date and time in the enquiry form, and the Aazhi team will confirm the visit by phone. This chat does not book appointments automatically.',
      actions: [{ label: 'Open appointment form', kind: 'book' }],
    };
  }

  if (/(hour|open|close|timing|time)/.test(query)) {
    return {
      text: 'Aazhi Dental Care is open today until 8:30 PM. Call before visiting if you would like the team to help find a time that works for you.',
      actions: [{ label: 'Call 099945 55278', kind: 'call' }],
    };
  }

  if (/(where|address|location|direction|reach|map)/.test(query)) {
    return {
      text: 'You’ll find us at 526, Marudhamalai Road, opposite N.S.R Bakery, P N Pudur, Coimbatore, Tamil Nadu 641041.',
      actions: [{ label: 'Get directions', kind: 'whatsapp' }],
    };
  }

  if (/(phone|call|number|contact)/.test(query)) {
    return {
      text: 'You can reach Aazhi Dental Care on 099945 55278. The team can answer questions about your concern and help with a visit.',
      actions: [{ label: 'Call the clinic', kind: 'call' }],
    };
  }

  if (/(whatsapp|message|text)/.test(query)) {
    return {
      text: 'WhatsApp is a quick way to share your question or request a visit with the clinic team.',
      actions: [{ label: 'Message on WhatsApp', kind: 'whatsapp' }],
    };
  }

  if (/(treatment|service|do you|offer|provide|care)/.test(query)) {
    return {
      text: 'The clinic offers general dentistry, wisdom tooth removal, root canal treatment, dental implants, teeth whitening, cosmetic dentistry, braces and aligners, and children’s dentistry.',
      actions: [{ label: 'Talk about my care', kind: 'book' }],
    };
  }

  if (/(price|cost|fee|afford|expensive)/.test(query)) {
    return {
      text: 'Treatment cost depends on your concern and the plan that is right for you. A consultation is the best way to get clear options and an accurate estimate before treatment.',
      actions: [{ label: 'Ask the clinic', kind: 'whatsapp' }],
    };
  }

  if (/(child|kid|children|young)/.test(query)) {
    return {
      text: 'Yes — children’s dentistry is part of the clinic’s care offering, with a gentle approach designed to make early visits feel positive.',
      actions: [{ label: 'Book a consultation', kind: 'book' }],
    };
  }

  if (/(pain|emergency|urgent|swelling|bleed)/.test(query)) {
    return {
      text: 'For urgent pain, swelling, bleeding, or a dental injury, please call the clinic directly so the team can guide you on the next step. This assistant cannot diagnose or triage emergencies.',
      actions: [{ label: 'Call 099945 55278', kind: 'call' }],
    };
  }

  return {
    text: 'I can help with appointment enquiries, treatments, clinic timings, directions, phone details, and WhatsApp support. What would you like to know?',
    actions: [
      { label: 'What treatments do you offer?', kind: 'book' },
      { label: 'When are you open?', kind: 'call' },
    ],
  };
}

const treatments = [
  { title: 'General dentistry', note: 'The everyday care that keeps you ahead.', icon: Stethoscope },
  { title: 'Wisdom tooth removal', note: 'A gentler plan for a tricky tooth.', icon: ShieldCheck },
  { title: 'Root canal treatment', note: 'Relief, precision, and a natural finish.', icon: HeartPulse },
  { title: 'Dental implants', note: 'Strong, considered replacements that feel like you.', icon: SmilePlus },
  { title: 'Teeth whitening', note: 'A brighter smile, never an artificial one.', icon: Sparkles },
  { title: 'Cosmetic dentistry', note: 'Small refinements. A big shift in confidence.', icon: Star },
  { title: 'Braces & aligners', note: 'A straighter smile at your own pace.', icon: Plus },
  { title: "Children's dentistry", note: 'Positive first visits that stay with them.', icon: Baby },
];

const reviews = [
  {
    name: 'Sadana Maha',
    text: 'The doctors are very patient and explain everything clearly. The clinic feels clean, calm and genuinely caring. I am very happy with the treatment and would recommend Aazhi to anyone.',
    detail: 'Google review',
  },
  {
    name: 'Aruna',
    text: 'A very pleasant experience from the first appointment. The team is warm, professional and never rushes you. I finally feel comfortable going to the dentist.',
    detail: 'Google review',
  },
  {
    name: 'Saktthevel KV',
    text: 'Excellent care and a very friendly team. They took time to understand my concern and gave me a clear treatment plan. The result has made a real difference.',
    detail: 'Google review',
  },
];

const navItems = [
  { label: 'Our approach', href: '#approach' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Patient stories', href: '#stories' },
  { label: 'Find us', href: '#visit' },
];

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-3" data-testid="link-logo">
      <img src="/Aazhi%20logo.png" alt="Aazhi Dental Care Logo" className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105" />
      <span className="leading-none">
        <span className={`block font-display text-[1.4rem] italic ${light ? 'text-white' : 'text-slate-900'}`}>Aazhi</span>
        <span className={`block text-[9px] font-bold uppercase tracking-[0.26em] ${light ? 'text-teal-100/80' : 'text-teal-700'}`}>Dental care</span>
      </span>
    </a>
  );
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] ${light ? 'text-teal-100/75' : 'text-teal-700'}`}>
      <span className={`h-px w-8 ${light ? 'bg-teal-200/70' : 'bg-teal-500'}`} />
      {children}
    </div>
  );
}

function AppointmentModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', reason: '' });
  const [error, setError] = useState('');

  const update = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError('');
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time || !form.reason) {
      setError('Please fill in each field so our team can prepare for your visit.');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-labelledby="appointment-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-[#f8fffd] p-6 shadow-2xl sm:max-w-xl sm:rounded-[2rem] sm:p-9" initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }} onClick={(event) => event.stopPropagation()}>
        <div className="mb-7 flex items-start justify-between">
          <div>
            <SectionLabel>Start here</SectionLabel>
            <h2 id="appointment-title" className="font-display text-4xl leading-none text-slate-900">Let’s make time<br /><em>for your smile.</em></h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close appointment form" className="grid h-10 w-10 place-items-center rounded-full border border-teal-100 text-teal-800 transition-colors hover:bg-teal-50" data-testid="button-close-appointment"><X size={18} /></button>
        </div>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl bg-teal-50 p-7 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-teal-700 text-white"><Check size={25} /></div>
            <h3 className="font-display text-3xl text-slate-900">Thank you, {form.name.split(' ')[0]}.</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">Your enquiry is noted. This demo does not make a real booking — our team would confirm your preferred time by phone.</p>
            <a href={phoneHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5" data-testid="link-call-confirmation"><Phone size={16} /> Call {phone}</a>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Your name<input required value={form.name} onChange={update('name')} placeholder="e.g. Aruna Krishnan" className="mt-2 w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="input-appointment-name" /></label>
              <label className="text-sm font-medium text-slate-700">Phone number<input required type="tel" value={form.phone} onChange={update('phone')} placeholder="10-digit mobile number" className="mt-2 w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="input-appointment-phone" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Preferred date<input required type="date" value={form.date} onChange={update('date')} className="mt-2 w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="input-appointment-date" /></label>
              <label className="text-sm font-medium text-slate-700">Preferred time<select required value={form.time} onChange={update('time')} className="mt-2 w-full rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="select-appointment-time"><option value="">Choose a time</option><option>Morning · 9:30 AM</option><option>Late morning · 11:30 AM</option><option>Afternoon · 2:30 PM</option><option>Evening · 6:30 PM</option></select></label>
            </div>
            <label className="block text-sm font-medium text-slate-700">What can we help with?<textarea required rows={3} value={form.reason} onChange={update('reason')} placeholder="Tell us briefly about your concern or treatment you have in mind." className="mt-2 w-full resize-none rounded-xl border border-teal-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="textarea-appointment-reason" /></label>
            {error && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800" role="alert" data-testid="status-appointment-error">{error}</p>}
            <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-700/15 transition hover:-translate-y-0.5 hover:bg-teal-800" data-testid="button-submit-appointment">Send appointment enquiry <ArrowUpRight size={16} /></button>
            <p className="text-center text-[11px] text-slate-400">No payment required. We’ll only use these details to respond to your enquiry.</p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function AssistantChat({
  messages,
  input,
  loading,
  onInputChange,
  onSubmit,
  onAction,
}: {
  messages: AssistantMessage[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAction: (kind: AssistantActionKind) => void;
}) {
  return (
    <motion.section
      role="dialog"
      aria-modal="false"
      aria-labelledby="assistant-title"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.97 }}
      className="fixed bottom-40 right-4 z-50 flex h-[min(620px,calc(100dvh-12rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-[1.6rem] border border-teal-100 bg-[#f8fffd] shadow-2xl shadow-teal-950/20 sm:bottom-28 sm:h-[min(620px,calc(100dvh-9rem))] sm:right-6"
      data-testid="panel-assistant-chat"
    >
      <div className="flex items-center justify-between bg-teal-900 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 text-amber-950">
            <Bot size={20} />
          </span>
          <div>
            <h2 id="assistant-title" className="text-sm font-bold">Aazhi assistant</h2>
            <p className="mt-0.5 text-[11px] text-teal-100/70">Care guidance, anytime</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-100/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Online
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite" data-testid="assistant-messages">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[87%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-teal-700 text-white' : 'rounded-bl-md bg-white text-slate-600 shadow-sm ring-1 ring-teal-100'}`}>
                {message.text}
              </div>
              {message.actions && message.role === 'assistant' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.actions.map((action) => (
                    action.kind === 'book' ? (
                      <button key={action.label} type="button" onClick={() => onAction(action.kind)} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-[11px] font-bold text-teal-800 transition hover:-translate-y-0.5 hover:bg-teal-100" data-testid={`assistant-action-${action.kind}`}>
                        {action.label}
                      </button>
                    ) : (
                      <a key={action.label} href={action.kind === 'call' ? phoneHref : whatsappHref} target={action.kind === 'whatsapp' ? '_blank' : undefined} rel={action.kind === 'whatsapp' ? 'noreferrer' : undefined} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-[11px] font-bold text-teal-800 transition hover:-translate-y-0.5 hover:bg-teal-100" data-testid={`assistant-action-${action.kind}`}>
                        {action.label}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-teal-100" aria-label="Assistant is typing">
              {[0, 1, 2].map((dot) => <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" style={{ animationDelay: `${dot * 100}ms` }} />)}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-teal-100 bg-white px-4 py-4">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {['What treatments do you offer?', 'When are you open?', 'Where are you located?'].map((prompt) => (
            <button key={prompt} type="button" onClick={() => { onInputChange(prompt); }} className="shrink-0 rounded-full bg-teal-50 px-3 py-2 text-[10px] font-bold text-teal-800 transition hover:bg-teal-100" data-testid="assistant-suggested-question">
              {prompt}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <label className="sr-only" htmlFor="assistant-input">Ask Aazhi assistant</label>
          <input id="assistant-input" value={input} onChange={(event) => onInputChange(event.target.value)} placeholder="Ask about your visit..." className="min-w-0 flex-1 rounded-full border border-teal-100 bg-[#f8fffd] px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100" data-testid="input-assistant-message" />
          <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-send-assistant">
            <Send size={17} />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-slate-400">For urgent concerns, please call the clinic directly.</p>
      </div>
    </motion.section>
  );
}

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(initialAssistantMessages);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 110]);

  const nextReview = () => setReviewIndex((current) => (current + 1) % reviews.length);
  const previousReview = () => setReviewIndex((current) => (current - 1 + reviews.length) % reviews.length);
  const handleAssistantSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = assistantInput.trim();
    if (!question || assistantLoading) return;
    setAssistantMessages((current) => [...current, { id: Date.now(), role: 'user', text: question }]);
    setAssistantInput('');
    setAssistantLoading(true);
    window.setTimeout(() => {
      const reply = getAssistantReply(question);
      setAssistantMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', ...reply }]);
      setAssistantLoading(false);
    }, reduce ? 0 : 450);
  };
  const handleAssistantAction = (kind: AssistantActionKind) => {
    if (kind === 'book') {
      setModalOpen(true);
      setAssistantOpen(false);
    }
  };

  return (
    <div id="top" className="noise-layer min-h-[100dvh] overflow-hidden bg-[#f0fdfa] font-body text-slate-900">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Logo light />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} className="text-xs font-semibold text-teal-50/75 transition-colors hover:text-white" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <a href={phoneHref} className="flex items-center gap-2 text-xs font-bold text-teal-50/80 transition-colors hover:text-white" data-testid="link-header-phone"><Phone size={14} /> {phone}</a>
            <button type="button" onClick={() => setModalOpen(true)} className="rounded-full bg-amber-400 px-5 py-3 text-xs font-bold text-amber-950 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300" data-testid="button-header-book">Book a visit <ArrowUpRight className="ml-1 inline" size={14} /></button>
          </div>
          <button type="button" aria-label="Open navigation menu" onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-teal-100/30 text-white sm:hidden" data-testid="button-open-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-4 rounded-2xl border border-white/15 bg-teal-950/95 p-3 shadow-2xl sm:hidden" aria-label="Mobile navigation">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-teal-50 hover:bg-white/10" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}<button type="button" onClick={() => { setModalOpen(true); setMenuOpen(false); }} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-amber-950" data-testid="button-mobile-book">Book an appointment <ArrowUpRight size={15} /></button></motion.nav>}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative isolate min-h-[720px] overflow-hidden bg-teal-950 pt-28 text-white sm:min-h-[790px] lg:min-h-[850px]" aria-labelledby="hero-title">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="absolute -right-32 top-24 h-[480px] w-[480px] rounded-full border border-teal-400/20 sm:h-[700px] sm:w-[700px]" />
          <div className="absolute -right-20 top-36 h-[360px] w-[360px] rounded-full border border-teal-400/10 sm:h-[540px] sm:w-[540px]" />
          <motion.div style={{ y: heroY }} className="absolute right-0 top-0 h-[620px] w-[55%] opacity-35 mix-blend-screen sm:h-[800px] lg:w-[49%]"><div className="h-full w-full bg-[url('/aazhi-clinic-hero.jpg')] bg-cover bg-center [mask-image:linear-gradient(to_left,black,transparent)]" /></motion.div>
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15 }} className="relative z-10 max-w-2xl">
              <div className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-teal-200"><span className="h-px w-9 bg-amber-300" /> Dentistry, with a softer touch</div>
              <h1 id="hero-title" className="display-shadow max-w-3xl font-display text-[3.65rem] leading-[.96] tracking-[-.035em] text-white sm:text-7xl lg:text-[6.7rem]">A healthier<br /><em className="text-teal-200">smile starts</em><br />with trust.</h1>
              <p className="mt-8 max-w-md text-base leading-7 text-teal-50/75 sm:text-lg">Thoughtful dental care for P N Pudur and beyond. Clear answers, gentle hands, and treatment that feels like it belongs to your life.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setModalOpen(true)} className="group inline-flex items-center justify-center gap-3 rounded-full bg-amber-400 px-6 py-4 text-sm font-bold text-amber-950 shadow-xl shadow-amber-950/20 transition hover:-translate-y-1 hover:bg-amber-300" data-testid="button-hero-book">Book an appointment <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-950/10 transition-transform group-hover:rotate-45"><ArrowUpRight size={15} /></span></button>
                <a href="#approach" className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-100/25 px-6 py-4 text-sm font-semibold text-teal-50 transition hover:border-teal-100/60 hover:bg-white/5" data-testid="link-hero-approach">See our approach <ChevronRight size={16} /></a>
              </div>
              <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-teal-100/60"><span className="flex items-center gap-2"><span className="text-amber-300">★★★★★</span> 4.9/5 on Google</span><span className="h-1 w-1 rounded-full bg-teal-300/50" /><span>174+ patient reviews</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .9, delay: .35 }} className="relative hidden min-h-[410px] lg:block">
              <div className="float-soft absolute right-5 top-12 h-[360px] w-[290px] overflow-hidden rounded-[10rem_10rem_1.5rem_1.5rem] border border-white/20 bg-teal-800 shadow-2xl shadow-teal-950/40">
                <div className="h-full w-full bg-[url('/aazhi-clinic-hero.jpg')] bg-cover bg-center opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-5 left-0 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-amber-300 text-amber-950"><HeartPulse size={17} /></div>
                <p className="text-xs font-bold text-white">Open today</p><p className="mt-1 text-[11px] text-teal-100/65">Until 8:30 PM</p>
              </div>
              <div className="pulse-ring absolute right-0 top-0 grid h-20 w-20 place-items-center rounded-full border border-amber-300/60 bg-amber-300 text-xs font-bold leading-tight text-amber-950 shadow-xl"><span>care<br />first</span></div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f0fdfa] to-transparent" />
        </section>

        <section className="relative z-10 -mt-1 border-b border-teal-100 bg-[#f0fdfa]" aria-label="Clinic highlights">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-teal-100 px-5 py-7 sm:px-8 lg:grid-cols-4 lg:px-10">
            {[['4.9/5', 'Google rating'], ['174+', 'patient reviews'], ['8:30 PM', 'open until today'], ['P N Pudur', 'Coimbatore']].map(([value, label], index) => <Reveal key={label} delay={index * .05} className="px-4 first:pl-0 last:pr-0 sm:px-8"><p className="font-display text-2xl text-teal-800 sm:text-3xl" data-testid={`text-highlight-value-${index}`}>{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p></Reveal>)}
          </div>
        </section>

        <section id="approach" className="relative scroll-mt-16 px-5 py-24 sm:px-8 sm:py-32 lg:px-10" aria-labelledby="approach-title">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.86fr_1.14fr] lg:items-center">
            <Reveal className="relative">
              <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full border border-teal-200" />
              <div className="clinic-image-alt relative min-h-[410px] overflow-hidden rounded-[1.75rem] shadow-xl shadow-teal-900/10 sm:min-h-[520px]">
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/50 via-transparent to-teal-900/5" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/25 bg-white/15 p-4 backdrop-blur-md"><p className="text-xs leading-5 text-white">A space designed to help you exhale<br />before we begin.</p></div>
              </div>
              <div className="absolute -bottom-7 -right-3 rounded-2xl bg-amber-300 px-5 py-4 text-amber-950 shadow-xl sm:-right-7"><p className="font-display text-3xl">01</p><p className="text-[10px] font-bold uppercase tracking-widest">listen first</p></div>
            </Reveal>
            <Reveal delay={.12}>
              <SectionLabel>The Aazhi way</SectionLabel>
              <h2 id="approach-title" className="max-w-2xl font-display text-5xl leading-[.98] tracking-[-.03em] text-slate-900 sm:text-6xl">Good dentistry is<br /><em className="text-teal-700">personal.</em></h2>
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-600">We built Aazhi around a simple belief: you deserve to understand your care, feel comfortable asking questions, and leave with more confidence than you arrived with.</p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {[['01', 'We listen', 'No rushed consultations. We start with what you feel and what matters to you.'], ['02', 'We explain', 'Clear options, honest timelines and no mysterious dental language.'], ['03', 'We care', 'Modern treatment, delivered with a human touch at every appointment.'], ['04', 'We follow through', 'A familiar team and thoughtful aftercare, from first visit onwards.']].map(([number, title, text]) => <div key={number} className="border-t border-teal-100 pt-4"><div className="flex items-center justify-between"><span className="text-xs font-bold text-amber-600">{number}</span><Plus size={15} className="text-teal-600" /></div><h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="treatments" className="scroll-mt-16 bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-10" aria-labelledby="treatments-title">
          <div className="mx-auto max-w-7xl">
            <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div><SectionLabel>Care, considered</SectionLabel><h2 id="treatments-title" className="max-w-xl font-display text-5xl leading-[.98] tracking-[-.03em] text-slate-900 sm:text-6xl">The right care<br /><em className="text-teal-700">for your life.</em></h2></div>
              <p className="max-w-xs text-sm leading-6 text-slate-500">From a regular check-up to a complete smile transformation, we make every step feel clear.</p>
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {treatments.map((treatment, index) => { 
                const Icon = treatment.icon; 
                return (
                  <Reveal key={treatment.title} delay={index * .05}>
                    <motion.button 
                      type="button" 
                      onClick={() => setModalOpen(true)} 
                      whileHover={{ scale: 1.03, y: -6 }} 
                      whileTap={{ scale: 0.98 }} 
                      className={`group relative flex min-h-[240px] w-full flex-col justify-between overflow-hidden rounded-3xl border p-7 text-left transition-colors duration-500 hover:shadow-2xl hover:shadow-teal-900/20 ${index === 1 || index === 6 ? 'border-teal-700 bg-teal-800 text-white' : 'border-teal-100 bg-[#f8fffd] text-slate-900'}`} 
                      data-testid={`button-treatment-${index}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${index === 1 || index === 6 ? 'to-white/10' : 'to-teal-500/5'}`} />
                      <div className="relative z-10 flex w-full items-start justify-between">
                        <span className={`grid h-14 w-14 place-items-center rounded-full transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${index === 1 || index === 6 ? 'bg-white/10 text-teal-100 group-hover:bg-white/20' : 'bg-teal-100 text-teal-700 group-hover:bg-teal-200'}`}>
                          <Icon size={24} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-12" />
                        </span>
                        <span className={`rounded-full p-2 transition-all duration-500 group-hover:scale-110 ${index === 1 || index === 6 ? 'bg-white/0 text-teal-100 group-hover:bg-white/10' : 'bg-teal-50/0 text-teal-600 group-hover:bg-teal-50'}`}>
                          <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                      <div className="relative z-10 mt-8">
                        <h3 className="text-lg font-bold tracking-tight">{treatment.title}</h3>
                        <p className={`mt-2.5 max-w-[18rem] text-sm leading-relaxed ${index === 1 || index === 6 ? 'text-teal-100/80' : 'text-slate-500 group-hover:text-slate-600'}`}>{treatment.note}</p>
                      </div>
                    </motion.button>
                  </Reveal>
                ); 
              })}
            </div>
            <Reveal className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-teal-50 px-6 py-5 sm:flex-row sm:items-center sm:px-8"><p className="text-sm text-teal-900"><span className="font-bold">Not sure what you need?</span> That’s exactly what your first consultation is for.</p><button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900" data-testid="button-treatment-enquiry">Talk to our team <ArrowUpRight size={15} /></button></Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-teal-900 px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-10" aria-labelledby="difference-title">
          <div className="absolute -right-20 -top-32 h-[30rem] w-[30rem] rounded-full border border-teal-400/15" /><div className="absolute right-20 top-20 h-64 w-64 rounded-full border border-teal-400/10" />
          <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <Reveal><SectionLabel light>Why people stay</SectionLabel><h2 id="difference-title" className="max-w-2xl font-display text-5xl leading-[.98] tracking-[-.03em] sm:text-7xl">The little things<br />make a <em className="text-teal-200">big</em> difference.</h2><p className="mt-7 max-w-lg text-base leading-7 text-teal-50/70">Aazhi is not designed to feel like a dental factory. It is a calm, well-equipped clinic where your time, comfort and questions are taken seriously.</p><a href={mapHref} target="_blank" rel="noreferrer" className="mt-9 inline-flex items-center gap-3 rounded-full border border-teal-200/30 px-5 py-3 text-sm font-bold text-teal-50 transition hover:bg-white/10" data-testid="link-difference-map"><MapPin size={16} /> Visit us in P N Pudur <ArrowUpRight size={14} /></a></Reveal>
            <Reveal delay={.12} className="grid grid-cols-2 gap-3 sm:gap-4">
              {[['15+', 'years of combined experience'], ['1:1', 'unhurried consultations'], ['8:30', 'open until in the evening'], ['4.9', 'Google rating from patients']].map(([value, label], i) => <div key={label} className={`rounded-2xl p-5 sm:p-7 ${i === 0 ? 'bg-amber-300 text-amber-950' : 'border border-teal-100/15 bg-teal-800/60 text-white'}`}><p className="font-display text-4xl sm:text-5xl">{value}</p><p className={`mt-3 max-w-[9rem] text-xs leading-5 ${i === 0 ? 'text-amber-900/70' : 'text-teal-100/60'}`}>{label}</p></div>)}
            </Reveal>
          </div>
        </section>

        <section id="stories" className="scroll-mt-16 bg-[#f0fdfa] px-5 py-24 sm:px-8 sm:py-32 lg:px-10" aria-labelledby="stories-title">
          <div className="mx-auto max-w-7xl">
            <Reveal className="flex items-end justify-between gap-6"><div><SectionLabel>Patient stories</SectionLabel><h2 id="stories-title" className="font-display text-5xl leading-[.98] tracking-[-.03em] text-slate-900 sm:text-6xl">A few kind<br /><em className="text-teal-700">words.</em></h2></div><div className="hidden gap-2 sm:flex"><button type="button" onClick={previousReview} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-teal-200 text-teal-700 transition hover:bg-teal-100" data-testid="button-previous-review"><ChevronLeft size={18} /></button><button type="button" onClick={nextReview} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full bg-teal-700 text-white transition hover:bg-teal-800" data-testid="button-next-review"><ChevronRight size={18} /></button></div></Reveal>
            <div className="mt-14 grid gap-4 lg:grid-cols-[.7fr_1.3fr]">
              <Reveal className="hidden rounded-2xl bg-amber-300 p-8 text-amber-950 sm:block"><QuoteMark /><div className="mt-24"><p className="font-display text-3xl leading-tight">“Comfortable care is not an extra. It is the whole point.”</p><p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-amber-900/60">The Aazhi promise</p></div></Reveal>
              <Reveal delay={.1} className="min-h-[300px] rounded-2xl bg-white p-7 shadow-sm sm:p-10"><AnimatePresence mode="wait"><motion.div key={reviewIndex} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .3 }}><div className="flex items-center justify-between"><div className="flex gap-1 text-amber-400">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><span className="text-xs font-semibold text-slate-400">{String(reviewIndex + 1).padStart(2, '0')} / 03</span></div><blockquote className="mt-10 max-w-2xl font-display text-3xl leading-[1.15] text-slate-900 sm:text-4xl">“{reviews[reviewIndex].text}”</blockquote><div className="mt-10 flex items-center justify-between border-t border-teal-100 pt-5"><div><p className="text-sm font-bold text-slate-900" data-testid={`text-review-name-${reviewIndex}`}>{reviews[reviewIndex].name}</p><p className="mt-1 text-xs text-slate-500">{reviews[reviewIndex].detail}</p></div><div className="flex gap-2 sm:hidden"><button type="button" onClick={previousReview} aria-label="Previous review" className="grid h-9 w-9 place-items-center rounded-full border border-teal-200 text-teal-700" data-testid="button-mobile-previous-review"><ChevronLeft size={16} /></button><button type="button" onClick={nextReview} aria-label="Next review" className="grid h-9 w-9 place-items-center rounded-full bg-teal-700 text-white" data-testid="button-mobile-next-review"><ChevronRight size={16} /></button></div></div></motion.div></AnimatePresence></Reveal>
            </div>
          </div>
        </section>

        <section id="visit" className="scroll-mt-16 bg-white px-5 py-24 sm:px-8 sm:py-32 lg:px-10" aria-labelledby="visit-title">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <Reveal><SectionLabel>Come say hello</SectionLabel><h2 id="visit-title" className="font-display text-5xl leading-[.98] tracking-[-.03em] text-slate-900 sm:text-6xl">Your next<br /><em className="text-teal-700">good decision.</em></h2><p className="mt-7 max-w-sm text-base leading-7 text-slate-600">Find us on Marudhamalai Road, opposite N.S.R Bakery. Easy to reach, easy to talk to.</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-teal-800" data-testid="button-visit-book">Book a visit <ArrowUpRight size={16} /></button><a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-5 py-3.5 text-sm font-bold text-teal-800 transition hover:bg-teal-50" data-testid="link-visit-whatsapp"><MessageCircle size={16} /> WhatsApp us</a></div></Reveal>
            <Reveal delay={.1} className="grid gap-3 sm:grid-cols-2">
              <div className="clinic-image relative min-h-[290px] overflow-hidden rounded-2xl sm:row-span-2"><div className="absolute inset-0 bg-gradient-to-t from-teal-950/70 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-teal-100/70">Aazhi Dental Care</p><p className="mt-2 max-w-[14rem] font-display text-2xl leading-tight">A calmer kind of clinic.</p></div></div>
              <div className="rounded-2xl bg-teal-50 p-6"><MapPin size={19} className="text-teal-700" /><p className="mt-5 text-sm font-bold leading-5 text-slate-900">526, Marudhamalai Rd,<br />P N Pudur, Coimbatore</p><p className="mt-2 text-xs leading-5 text-slate-500">Opposite to N.S.R Bakery<br />Tamil Nadu 641041</p><a href={mapHref} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-teal-700" data-testid="link-get-directions">Get directions <ArrowUpRight size={13} /></a></div>
              <div className="rounded-2xl bg-slate-900 p-6 text-white"><Clock3 size={19} className="text-amber-300" /><p className="mt-5 text-sm font-bold">Open today until 8:30 PM</p><p className="mt-2 text-xs leading-5 text-slate-400">Call before you visit and we’ll find a time that works for you.</p><a href={phoneHref} className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-amber-300" data-testid="link-visit-phone"><Phone size={13} /> {phone}</a></div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-teal-950 px-5 pb-28 pt-16 text-white sm:px-8 sm:pb-16 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-700/60 via-teal-950 to-teal-950" />
        <div className="relative mx-auto max-w-7xl z-10">
          <div className="grid gap-12 border-b border-teal-100/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
            <Reveal delay={0}>
              <Logo light />
              <p className="mt-8 max-w-xs text-sm leading-relaxed text-teal-100/60">A thoughtful dental clinic in P N Pudur, Coimbatore — where good care feels human.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-teal-500">Explore</p>
              <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-teal-100/70">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} className="group flex w-fit items-center transition-colors hover:text-white" data-testid={`link-footer-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">{item.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-teal-500">Talk to us</p>
              <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-teal-100/70">
                {[
                  { label: phone, href: phoneHref, testid: 'phone', external: false },
                  { label: 'WhatsApp enquiry', href: whatsappHref, testid: 'whatsapp', external: true },
                  { label: 'Get directions', href: mapHref, testid: 'directions', external: true }
                ].map((link) => (
                  <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="group flex w-fit items-center transition-colors hover:text-white" data-testid={`link-footer-${link.testid}`}>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">{link.label}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.3} className="flex flex-col justify-between gap-4 pt-8 text-[11px] tracking-wide text-teal-100/40 sm:flex-row">
            <p className="transition-colors hover:text-teal-100/70">© {new Date().getFullYear()} Aazhi Dental Care. All rights reserved.</p>
            <p className="transition-colors hover:text-teal-100/70">Made for better visits.</p>
          </Reveal>
        </div>
      </footer>

      <a href={phoneHref} className="fixed bottom-4 left-4 right-4 z-30 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3.5 text-sm font-bold text-amber-950 shadow-xl shadow-amber-950/20 sm:hidden" data-testid="link-mobile-call"><Phone size={16} /> Call Aazhi Dental Care</a>
      <AnimatePresence>{assistantOpen && <AssistantChat messages={assistantMessages} input={assistantInput} loading={assistantLoading} onInputChange={setAssistantInput} onSubmit={handleAssistantSubmit} onAction={handleAssistantAction} />}</AnimatePresence>
      <motion.button type="button" onClick={() => setAssistantOpen((open) => !open)} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} aria-label={assistantOpen ? 'Close Aazhi assistant' : 'Open Aazhi assistant'} className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-teal-950/25 transition-colors hover:bg-teal-800 sm:bottom-12 sm:right-6" data-testid="button-open-assistant">
        {!assistantOpen && (
          <>
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-teal-600 opacity-75 animate-ping" style={{ animationDuration: '2.5s' }} />
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-teal-500 opacity-50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1.25s' }} />
          </>
        )}
        {assistantOpen ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="hidden sm:inline">{assistantOpen ? 'Close assistant' : 'Ask Aazhi'}</span>
      </motion.button>
      <AnimatePresence>{modalOpen && <AppointmentModal onClose={() => setModalOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function QuoteMark() {
  return <span className="font-display text-7xl leading-none text-amber-950/30">“</span>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;