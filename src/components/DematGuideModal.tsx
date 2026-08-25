import React from 'react';
import { X, CheckCircle2, Building2, Smartphone, FileText, ArrowRight, ExternalLink } from 'lucide-react';

interface DematGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  primaryBank?: string;
  language: 'en' | 'np';
}

export const DematGuideModal: React.FC<DematGuideModalProps> = ({
  isOpen,
  onClose,
  primaryBank = 'NIC Asia Bank',
  language
}) => {
  if (!isOpen) return null;
  const isNp = language === 'np';

  const steps = [
    {
      step: 1,
      title: isNp ? '१. बैंक वा क्यापिटलमा डिम्याट खाता खोल्ने' : '1. Open Demat Account at Bank or Capital',
      desc: isNp 
        ? `${primaryBank} वा यसको क्यापिटल शाखामा गएर वा अनलाइनबाट डिम्याट (BOID) फारम भर्नुहोस्। नागरिकता र पासपोर्ट साइज फोटो चाहिन्छ।`
        : `Visit your ${primaryBank} branch or apply online via their Capital portal. You will receive a 16-digit Beneficiary Owner Identification Number (BOID).`,
      tag: 'Time: 24 Hours'
    },
    {
      step: 2,
      title: isNp ? '२. मेरो सेयर (MeroShare) दर्ता' : '2. Register for MeroShare Portal',
      desc: isNp
        ? 'डिम्याट नम्बर पाएपछि मेरो सेयर युजरनेम र पासवर्ड लिनुहोस् (वार्षिक शुल्क रू ५०)। मोबाइल एप वा meroshare.cdsc.com.np मा लग-इन गर्न सकिन्छ।'
        : 'Get your MeroShare credentials from your bank (costs NPR 50/yr). Log in on the MeroShare mobile app or web to manage investments and apply for IPOs.',
      tag: 'Web & Mobile'
    },
    {
      step: 3,
      title: isNp ? '३. C-ASBA र CRN नम्बर प्रमाणीकरण' : '3. Get CRN (C-ASBA) Verified',
      desc: isNp
        ? 'आफ्नो बैंक खातालाई डिम्याटसँग जोड्न CRN (C-ASBA Registration Number) लिनुहोस्। यसले सिधै बैंकबाट रकम कट्टी गरेर एसआईपी र सेयर किन्न मद्दत गर्दछ।'
        : 'Obtain your C-ASBA Registration Number (CRN) from your bank. This links your bank account to auto-debit for SIP units and IPO applications.',
      tag: 'One-time setup'
    },
    {
      step: 4,
      title: isNp ? '४. खुलामुखी म्युचुअल फण्डमा मासिक एसआईपी सुरु' : '4. Start Monthly SIP in Open-Ended Funds',
      desc: isNp
        ? 'मेरो सेयर वा क्यापिटल (जस्तै NIMB Ace, Nabil, Sanima Capital) को पोर्टलबाट आफ्नो मनपर्ने फण्डमा मासिक एसआईपी (SIP) सुरु गर्नुहोस्।'
        : 'Log in to your Capital portal (NIMB Ace, Nabil, NIC Asia, Sanima) or MeroShare and set an auto-SIP deduction on your monthly salary day.',
      tag: 'Wealth Compounding'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#6C5CE7] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider">
              Nepal Stock Exchange (NEPSE) & CDSC
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isNp ? 'नेपालमा डिम्याट र मेरो सेयर सुरु गर्ने तरिका' : 'Beginner Guide: Demat & MeroShare in Nepal'}
            </h2>
          </div>
        </div>

        {/* Step by Step Cards */}
        <div className="space-y-3">
          {steps.map(s => (
            <div key={s.step} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#6C5CE7] text-white flex items-center justify-center text-xs">
                    {s.step}
                  </span>
                  <span>{s.title}</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C5CE7] border border-indigo-100">
                  {s.tag}
                </span>
              </div>
              <p className="text-xs text-gray-600 pl-7 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Helpful External Links */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Ready to log in? Visit official CDSC portal.</span>
          </div>

          <a
            href="https://meroshare.cdsc.com.np"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors self-start sm:self-auto"
          >
            <span>meroshare.cdsc.com.np</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Got It!
        </button>

      </div>
    </div>
  );
};
