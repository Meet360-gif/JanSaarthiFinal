import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Scale, Heart, Lock, UserCheck, Database, AlertTriangle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const safeguards = [
  { icon: <Lock size={24} />, title: 'DPDP Act 2023 Compliance', items: ['Explicit consent before data processing', 'Right to erasure — users can request data deletion', 'Purpose limitation — data used only for stated purposes', 'Data minimization — collect only what\'s needed', 'Grievance redressal mechanism'] },
  { icon: <Database size={24} />, title: 'RBI Data Localization', items: ['All financial data stored within India', 'Payment data mirrored domestically per RBI circular 2018', 'No cross-border data transfer without explicit consent', 'Compliance with CERT-In reporting guidelines'] },
  { icon: <UserCheck size={24} />, title: 'Consent Management', items: ['Granular consent controls — users choose what AI can access', 'Opt-in for personalized recommendations', 'Opt-out anytime without service degradation', 'Consent audit trail maintained', 'Annual consent renewal prompts'] },
  { icon: <Heart size={24} />, title: 'Anti-Predatory Lending', items: ['AI suppresses loan recommendations when stress score > 70%', 'No repeat loan offers within 30 days of rejection', 'Cooling-off period after loan disbursement', 'Total EMI-to-income ratio capped at 50%', 'Affordability assessment before every recommendation'] },
  { icon: <Scale size={24} />, title: 'Algorithmic Bias Monitoring', items: ['Regular bias audits across demographics', 'No discrimination by caste, religion, gender, or geography', 'Equal recommendation access for rural and urban users', 'Fairness metrics tracked: demographic parity, equal opportunity', 'Human-in-the-loop review for high-impact decisions'] },
  { icon: <Eye size={24} />, title: 'Explainable AI (XAI)', items: ['Every recommendation includes human-readable "why" reasoning', 'Right-moment triggers are transparent to users', 'Stress score breakdown visible to customers', 'No black-box decisions — all logic is rule-based and auditable', 'Model decision logs retained for regulatory review'] },
];

export default function EthicsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-sm text-gray-300 mb-6">
          <Shield size={14} className="text-india-green" /> Ethical AI Framework
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">Ethics & <span className="gradient-text">Privacy</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">How JanSaarthi AI ensures responsible, compliant, and customer-first AI in banking</p>
      </motion.div>

      {/* Principle Banner */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass rounded-2xl p-8 mb-12 text-center border border-india-green/20">
        <h2 className="text-xl font-bold text-white mb-3">🛡️ Our Core Principle</h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto italic">
          "Technology should empower, not exploit. Every feature we build asks: does this genuinely help the customer,
          or does it just help us sell more?"
        </p>
      </motion.div>

      {/* Safeguard Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {safeguards.map((sg, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6 hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-india-green/20 flex items-center justify-center text-india-green">{sg.icon}</div>
              <h3 className="font-semibold text-white">{sg.title}</h3>
            </div>
            <ul className="space-y-2">
              {sg.items.map((item, j) => (
                <li key={j} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-india-green mt-1">✓</span>{item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Critical Scenarios */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <AlertTriangle className="text-saffron" size={22} /> How We Handle Critical Scenarios
        </h2>
        <div className="space-y-4">
          {[
            { scenario: 'Customer shows signs of financial stress (missed EMIs, declining balance)', response: 'System suppresses loan/credit card recommendations. Instead, suggests debt counseling, balance restructuring, and budgeting tools. Empathetic messaging replaces punitive alerts.', color: 'border-red-500/20' },
            { scenario: 'Anomalous transaction pattern detected (potential fraud)', response: 'Real-time alert sent. System distinguishes between fraud and distress signals. No account freeze without verification. Human escalation path always available.', color: 'border-yellow-500/20' },
            { scenario: 'Rural user with limited digital literacy', response: 'Vernacular chatbot guides in preferred language. Simplified 3-step processes. Voice input support. Larger touch targets. No complex jargon.', color: 'border-blue-500/20' },
            { scenario: 'Customer opts out of AI recommendations', response: 'Service continues without personalization. No feature degradation. Consent withdrawal processed immediately. Data marked for deletion within 30 days.', color: 'border-green-500/20' },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl p-5 border ${item.color} bg-white/[0.02]`}>
              <p className="text-sm font-medium text-white mb-2">Scenario: {item.scenario}</p>
              <p className="text-sm text-gray-400">Response: {item.response}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
