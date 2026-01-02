import { BaseModal } from './BaseModal.tsx';

const LEGAL_SECTIONS = [
  {
    title: "1. Project Purpose",
    content:
      "GScribe is an educational demonstration platform developed to illustrate Clean Architecture principles and secure Full Stack development. It is not a commercial product and offers no service guarantees.",
  },
  {
    title: "2. Project Design",
    content:
      "GScribe is built using the following technologies: React, TypeScript, Vite, Supabase, and Tailwind CSS. The version 1.0 has been designed exclusively for desktop environments. Please note that mobile responsiveness is not currently supported. ",
  },
  {
    title: "3. Privacy & Data (RLS)",
    content:
      "Security is managed via Supabase Row Level Security (RLS). Your data is strictly private and only accessible by your authenticated user. We do not share information with third parties.",
  },
  {
    title: "4. Right to be Forgotten",
    content:
      "In compliance with privacy regulations, you have a 'Delete Account' option in the dashboard that will permanently erase all your data from our records.",
  },
  {
    title: "5. Cookie Usage",
    content:
      "We use only essential technical cookies to maintain a secure session (Supabase Auth). We do not use tracking or advertising cookies.",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalNoticeModal({ isOpen, onClose }: Props) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Legal Notice & Project Info"
      maxWidth="max-w-2xl"
    >
      <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
        
        {LEGAL_SECTIONS.map((section, index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-md font-medium text-white/90 border-b border-white/5 pb-1">
              {section.title}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed text-justify">
              {section.content}
            </p>
          </div>
        ))}

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500 italic">
            Last updated: December 2025
          </p>
        </div>

      </div>
    </BaseModal>
  );
}