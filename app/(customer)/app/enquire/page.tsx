"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  EnvelopeSimple,
  Phone,
  MapPin,
  IdentificationCard,
  Airplane,
  Globe,
  Flag,
  Heart,
  CheckCircle,
  Warning,
  CalendarBlank,
  CaretDown,
  ClipboardText,
  Sparkle,
  Download,
  Share,
} from "@phosphor-icons/react";
import Link from "next/link";

/* ── Types ──────────────────────────────────────────────────────────────── */

type TravelType = "national" | "international";

interface NationalForm {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  city: string;
  state: string;
  idType: string;
  idNumber: string;
  emergencyName: string;
  emergencyMobile: string;
  dietary: string;
  travelStyle: string;
  requests: string;
}

interface InternationalForm {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  dob: string;
  gender: string;
  nationality: string;
  countryOfResidence: string;
  passportNumber: string;
  passportExpiry: string;
  emergencyName: string;
  emergencyCountryCode: string;
  emergencyPhone: string;
  visaStatus: string;
  dietary: string;
  travelStyle: string;
  requests: string;
}

/* ── Constants ──────────────────────────────────────────────────────────── */

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi (NCT)", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Australia", "Canada",
  "Germany", "France", "Japan", "Singapore", "UAE", "New Zealand",
  "Netherlands", "Italy", "Spain", "Switzerland", "Sweden", "Norway",
  "Denmark", "South Korea", "China", "Brazil", "Mexico", "South Africa",
  "Israel", "Russia", "Thailand", "Malaysia", "Indonesia", "Philippines",
];

const COUNTRY_CODES = [
  { code: "+91", country: "🇮🇳 India" },
  { code: "+1", country: "🇺🇸 USA/Canada" },
  { code: "+44", country: "🇬🇧 UK" },
  { code: "+61", country: "🇦🇺 Australia" },
  { code: "+49", country: "🇩🇪 Germany" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+81", country: "🇯🇵 Japan" },
  { code: "+65", country: "🇸🇬 Singapore" },
  { code: "+971", country: "🇦🇪 UAE" },
  { code: "+64", country: "🇳🇿 New Zealand" },
  { code: "+82", country: "🇰🇷 South Korea" },
  { code: "+55", country: "🇧🇷 Brazil" },
  { code: "+27", country: "🇿🇦 South Africa" },
  { code: "+66", country: "🇹🇭 Thailand" },
  { code: "+60", country: "🇲🇾 Malaysia" },
];

const DIETARY_OPTIONS = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain", "Gluten-Free", "No Preference"];
const TRAVEL_STYLES = ["Adventure & Trekking", "Backpacking", "Luxury", "Cultural Immersion", "Beach & Coastal", "Wildlife & Nature", "Road Trip", "Food & Culinary"];
const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const VISA_OPTIONS = ["Already have visa", "Applied, awaiting approval", "Will apply on arrival", "Need assistance with visa"];
const ID_TYPES = ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"];

const defaultNational: NationalForm = {
  fullName: "", email: "", mobile: "", dob: "", gender: "",
  city: "", state: "", idType: "", idNumber: "",
  emergencyName: "", emergencyMobile: "", dietary: "", travelStyle: "", requests: "",
};

const defaultInternational: InternationalForm = {
  fullName: "", email: "", countryCode: "+1", phone: "", dob: "", gender: "",
  nationality: "", countryOfResidence: "", passportNumber: "", passportExpiry: "",
  emergencyName: "", emergencyCountryCode: "+1", emergencyPhone: "",
  visaStatus: "", dietary: "", travelStyle: "", requests: "",
};

/* ── Sub-components ─────────────────────────────────────────────────────── */

function FieldWrapper({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "var(--glass-bg)",
  border: "1px solid var(--glass-border)",
  color: "var(--text)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
};

function Field({
  label, required, type = "text", value, onChange, placeholder,
}: {
  label: string; required?: boolean; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <FieldWrapper label={label} required={required}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
      />
    </FieldWrapper>
  );
}

function SelectField({
  label, required, value, onChange, options, placeholder,
}: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <FieldWrapper label={label} required={required}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        >
          <option value="">{placeholder ?? "Select..."}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <CaretDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-faint)" }}
        />
      </div>
    </FieldWrapper>
  );
}

function PhoneField({
  label, required, code, onCode, phone, onPhone, codeName,
}: {
  label: string; required?: boolean; code: string; onCode: (v: string) => void;
  phone: string; onPhone: (v: string) => void; codeName?: string;
}) {
  return (
    <FieldWrapper label={label} required={required}>
      <div className="flex gap-2">
        <div className="relative">
          <select
            value={code}
            onChange={(e) => onCode(e.target.value)}
            style={{ ...inputStyle, width: "auto", paddingRight: "28px", appearance: "none", cursor: "pointer", fontSize: "13px" }}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          <CaretDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-faint)" }} />
        </div>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
          placeholder="Phone number"
          style={{ ...inputStyle, flex: 1 }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
        />
      </div>
    </FieldWrapper>
  );
}

/* ── Result Card ─────────────────────────────────────────────────────────── */

function ResultCard({
  type,
  national,
  international,
  onReset,
}: {
  type: TravelType;
  national: NationalForm;
  international: InternationalForm;
  onReset: () => void;
}) {
  const isNational = type === "national";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
        {title}
      </p>
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
      >
        {children}
      </div>
    </div>
  );

  const Row = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
    value ? (
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <Icon size={13} style={{ color: "var(--accent)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>{label}</p>
          <p className="text-sm font-medium mt-0.5" style={{ color: "var(--text)" }}>{value}</p>
        </div>
      </div>
    ) : null
  );

  const data = isNational ? national : international;
  const name = data.fullName || "Traveler";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="mt-6"
    >
      {/* Hero card */}
      <div
        className="relative rounded-3xl p-6 mb-6 overflow-hidden"
        style={{
          background: isNational
            ? "linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(19,136,8,0.12) 50%, rgba(6,65,170,0.12) 100%)"
            : "linear-gradient(135deg, rgba(var(--accent),0.15) 0%, rgba(6,182,212,0.1) 100%)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: isNational ? "#FF9933" : "var(--accent)" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={20} weight="fill" className="text-green-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-green-400">
              Details Captured
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
            {name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-lg">{isNational ? "🇮🇳" : "🌍"}</span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "var(--surface)", color: "var(--text-dim)", border: "1px solid var(--border)" }}
            >
              {isNational ? "National · India" : "International · Global"}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <Section title="Personal Information">
        <Row icon={User} label="Full Name" value={data.fullName} />
        <Row icon={EnvelopeSimple} label="Email" value={data.email} />
        {isNational ? (
          <Row icon={Phone} label="Mobile" value={`+91 ${national.mobile}`} />
        ) : (
          <Row icon={Phone} label="Phone" value={`${international.countryCode} ${international.phone}`} />
        )}
        <Row icon={CalendarBlank} label="Date of Birth" value={data.dob} />
        <Row icon={User} label="Gender" value={data.gender} />
      </Section>

      <Section title={isNational ? "Location" : "Origin & Nationality"}>
        {isNational ? (
          <>
            <Row icon={MapPin} label="City" value={national.city} />
            <Row icon={Flag} label="State" value={national.state} />
          </>
        ) : (
          <>
            <Row icon={Globe} label="Nationality" value={international.nationality} />
            <Row icon={MapPin} label="Country of Residence" value={international.countryOfResidence} />
          </>
        )}
      </Section>

      <Section title={isNational ? "Identity Proof" : "Travel Documents"}>
        {isNational ? (
          <>
            <Row icon={IdentificationCard} label="ID Type" value={national.idType} />
            <Row icon={IdentificationCard} label="ID Number" value={national.idNumber} />
          </>
        ) : (
          <>
            <Row icon={IdentificationCard} label="Passport Number" value={international.passportNumber} />
            <Row icon={CalendarBlank} label="Passport Expiry" value={international.passportExpiry} />
            <Row icon={Airplane} label="Visa Status" value={international.visaStatus} />
          </>
        )}
      </Section>

      <Section title="Emergency Contact">
        <Row icon={User} label="Contact Name" value={data.emergencyName} />
        {isNational ? (
          <Row icon={Phone} label="Contact Mobile" value={`+91 ${national.emergencyMobile}`} />
        ) : (
          <Row icon={Phone} label="Contact Phone" value={`${international.emergencyCountryCode} ${international.emergencyPhone}`} />
        )}
      </Section>

      <Section title="Preferences">
        <Row icon={Heart} label="Dietary" value={data.dietary} />
        <Row icon={Airplane} label="Travel Style" value={data.travelStyle} />
        {data.requests && <Row icon={ClipboardText} label="Special Requests" value={data.requests} />}
      </Section>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-dim)" }}
        >
          <Download size={16} />
          Save PDF
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, var(--accent), #06B6D4)" }}
        >
          <Share size={16} />
          Submit to Agency
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full mt-3 py-3 rounded-2xl text-sm font-medium"
        style={{ color: "var(--text-faint)" }}
      >
        ← Fill new enquiry
      </button>
    </motion.div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */

export default function EnquirePage() {
  const [travelType, setTravelType] = useState<TravelType>("national");
  const [national, setNational] = useState<NationalForm>(defaultNational);
  const [international, setInternational] = useState<InternationalForm>(defaultInternational);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const updateN = <K extends keyof NationalForm>(k: K, v: string) =>
    setNational((p) => ({ ...p, [k]: v }));
  const updateI = <K extends keyof InternationalForm>(k: K, v: string) =>
    setInternational((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const errs: string[] = [];
    if (travelType === "national") {
      if (!national.fullName.trim()) errs.push("Full name is required");
      if (!national.email.includes("@")) errs.push("Valid email is required");
      if (national.mobile.length < 10) errs.push("Valid mobile number is required");
      if (!national.dob) errs.push("Date of birth is required");
      if (!national.state) errs.push("State is required");
      if (!national.idType) errs.push("ID proof type is required");
      if (!national.idNumber.trim()) errs.push("ID number is required");
    } else {
      if (!international.fullName.trim()) errs.push("Full name is required");
      if (!international.email.includes("@")) errs.push("Valid email is required");
      if (international.phone.length < 6) errs.push("Valid phone number is required");
      if (!international.dob) errs.push("Date of birth is required");
      if (!international.nationality) errs.push("Nationality is required");
      if (!international.passportNumber.trim()) errs.push("Passport number is required");
      if (!international.passportExpiry) errs.push("Passport expiry date is required");
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setSubmitted(false);
    setNational(defaultNational);
    setInternational(defaultInternational);
    setErrors([]);
  };

  return (
    <div className="page-mobile min-h-screen">
      <div className="px-4 pt-12 pb-8 lg:max-w-2xl lg:mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              <ArrowLeft size={16} style={{ color: "var(--text)" }} />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              Traveler Enquiry
            </h1>
            <p className="text-xs" style={{ color: "var(--text-faint)" }}>
              Capture customer details for your trip
            </p>
          </div>
          <div className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, var(--accent), #06B6D4)" }}>
            <Sparkle size={16} weight="fill" className="text-white" />
          </div>
        </div>

        {/* ── National / International toggle ─────────────────────────── */}
        <div
          className="flex gap-1 rounded-2xl p-1.5 mb-6"
          style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
        >
          {(["national", "international"] as TravelType[]).map((t) => (
            <motion.button
              key={t}
              onClick={() => { setTravelType(t); setErrors([]); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: travelType === t ? "var(--accent)" : "transparent",
                color: travelType === t ? "#fff" : "var(--text-dim)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-base">{t === "national" ? "🇮🇳" : "🌍"}</span>
              <span>{t === "national" ? "National · India" : "International · Global"}</span>
            </motion.button>
          ))}
        </div>

        {/* Validation errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 rounded-2xl p-4 overflow-hidden"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Warning size={16} className="text-red-400 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-400">Please fix the following:</p>
              </div>
              <ul className="space-y-1">
                {errors.map((e, i) => (
                  <li key={i} className="text-xs text-red-400/80 flex items-start gap-1.5">
                    <span className="mt-0.5">·</span>{e}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form or Result ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <ResultCard
              key="result"
              type={travelType}
              national={national}
              international={international}
              onReset={handleReset}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* ── NATIONAL FORM ─────────────────────────────────────── */}
              {travelType === "national" && (
                <div className="space-y-4">
                  {/* Section: Personal */}
                  <SectionDivider label="Personal Details" emoji="👤" />
                  <Field label="Full Name" required value={national.fullName} onChange={(v) => updateN("fullName", v)} placeholder="As per ID proof" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" required type="email" value={national.email} onChange={(v) => updateN("email", v)} placeholder="you@email.com" />
                    <FieldWrapper label="Mobile" required>
                      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
                        <span className="px-3 text-sm font-medium" style={{ color: "var(--text-dim)", borderRight: "1px solid var(--glass-border)" }}>+91</span>
                        <input
                          type="tel"
                          value={national.mobile}
                          onChange={(e) => updateN("mobile", e.target.value)}
                          placeholder="10-digit number"
                          maxLength={10}
                          style={{ flex: 1, padding: "12px", background: "transparent", color: "var(--text)", fontSize: "14px", outline: "none" }}
                        />
                      </div>
                    </FieldWrapper>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date of Birth" required type="date" value={national.dob} onChange={(v) => updateN("dob", v)} />
                    <SelectField label="Gender" value={national.gender} onChange={(v) => updateN("gender", v)} options={GENDER_OPTIONS} />
                  </div>

                  {/* Section: Location */}
                  <SectionDivider label="Location" emoji="📍" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="City" required value={national.city} onChange={(v) => updateN("city", v)} placeholder="Your city" />
                    <SelectField label="State" required value={national.state} onChange={(v) => updateN("state", v)} options={INDIAN_STATES} placeholder="Select state" />
                  </div>

                  {/* Section: ID Proof */}
                  <SectionDivider label="Identity Proof" emoji="🪪" />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="ID Type" required value={national.idType} onChange={(v) => updateN("idType", v)} options={ID_TYPES} placeholder="Select ID type" />
                    <Field label="ID Number" required value={national.idNumber} onChange={(v) => updateN("idNumber", v)} placeholder="Enter number" />
                  </div>

                  {/* Section: Emergency */}
                  <SectionDivider label="Emergency Contact" emoji="🚨" />
                  <Field label="Contact Name" required value={national.emergencyName} onChange={(v) => updateN("emergencyName", v)} placeholder="Full name" />
                  <FieldWrapper label="Contact Mobile" required>
                    <div className="flex items-center rounded-xl overflow-hidden" style={{ border: "1px solid var(--glass-border)", background: "var(--glass-bg)" }}>
                      <span className="px-3 text-sm font-medium" style={{ color: "var(--text-dim)", borderRight: "1px solid var(--glass-border)" }}>+91</span>
                      <input
                        type="tel"
                        value={national.emergencyMobile}
                        onChange={(e) => updateN("emergencyMobile", e.target.value)}
                        placeholder="10-digit number"
                        maxLength={10}
                        style={{ flex: 1, padding: "12px", background: "transparent", color: "var(--text)", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </FieldWrapper>

                  {/* Section: Preferences */}
                  <SectionDivider label="Travel Preferences" emoji="✈️" />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Dietary" value={national.dietary} onChange={(v) => updateN("dietary", v)} options={DIETARY_OPTIONS} placeholder="Select preference" />
                    <SelectField label="Travel Style" value={national.travelStyle} onChange={(v) => updateN("travelStyle", v)} options={TRAVEL_STYLES} placeholder="Select style" />
                  </div>
                  <FieldWrapper label="Special Requests">
                    <textarea
                      value={national.requests}
                      onChange={(e) => updateN("requests", e.target.value)}
                      placeholder="Any special needs, medical info, or requests..."
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
                    />
                  </FieldWrapper>
                </div>
              )}

              {/* ── INTERNATIONAL FORM ─────────────────────────────────── */}
              {travelType === "international" && (
                <div className="space-y-4">
                  <SectionDivider label="Personal Details" emoji="👤" />
                  <Field label="Full Name" required value={international.fullName} onChange={(v) => updateI("fullName", v)} placeholder="As per passport" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" required type="email" value={international.email} onChange={(v) => updateI("email", v)} placeholder="you@email.com" />
                    <PhoneField
                      label="Phone" required
                      code={international.countryCode} onCode={(v) => updateI("countryCode", v)}
                      phone={international.phone} onPhone={(v) => updateI("phone", v)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date of Birth" required type="date" value={international.dob} onChange={(v) => updateI("dob", v)} />
                    <SelectField label="Gender" value={international.gender} onChange={(v) => updateI("gender", v)} options={GENDER_OPTIONS} />
                  </div>

                  <SectionDivider label="Nationality & Residence" emoji="🌍" />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Nationality" required value={international.nationality} onChange={(v) => updateI("nationality", v)} options={COUNTRIES} placeholder="Select country" />
                    <SelectField label="Country of Residence" required value={international.countryOfResidence} onChange={(v) => updateI("countryOfResidence", v)} options={COUNTRIES} placeholder="Select country" />
                  </div>

                  <SectionDivider label="Travel Documents" emoji="🛂" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Passport Number" required value={international.passportNumber} onChange={(v) => updateI("passportNumber", v)} placeholder="e.g. A1234567" />
                    <Field label="Passport Expiry" required type="date" value={international.passportExpiry} onChange={(v) => updateI("passportExpiry", v)} />
                  </div>
                  <SelectField label="Visa Status" value={international.visaStatus} onChange={(v) => updateI("visaStatus", v)} options={VISA_OPTIONS} placeholder="Select visa status" />

                  <SectionDivider label="Emergency Contact" emoji="🚨" />
                  <Field label="Contact Name" required value={international.emergencyName} onChange={(v) => updateI("emergencyName", v)} placeholder="Full name" />
                  <PhoneField
                    label="Contact Phone" required
                    code={international.emergencyCountryCode} onCode={(v) => updateI("emergencyCountryCode", v)}
                    phone={international.emergencyPhone} onPhone={(v) => updateI("emergencyPhone", v)}
                  />

                  <SectionDivider label="Travel Preferences" emoji="✈️" />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectField label="Dietary" value={international.dietary} onChange={(v) => updateI("dietary", v)} options={DIETARY_OPTIONS} placeholder="Select preference" />
                    <SelectField label="Travel Style" value={international.travelStyle} onChange={(v) => updateI("travelStyle", v)} options={TRAVEL_STYLES} placeholder="Select style" />
                  </div>
                  <FieldWrapper label="Special Requests">
                    <textarea
                      value={international.requests}
                      onChange={(e) => updateI("requests", e.target.value)}
                      placeholder="Any special needs, medical info, or requests..."
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--glass-border)")}
                    />
                  </FieldWrapper>
                </div>
              )}

              {/* Submit */}
              <motion.button
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-8 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, var(--accent), #06B6D4)" }}
              >
                <CheckCircle size={18} weight="fill" />
                Capture Details
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionDivider({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-base">{emoji}</span>
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}
