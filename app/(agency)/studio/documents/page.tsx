"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UploadSimple, FileText, FilePdf, Image, Trash, DownloadSimple } from "@phosphor-icons/react";

const DOCS = [
  { id: "doc_001", name: "GST Certificate", type: "pdf", size: "245 KB", date: "Jan 2024", verified: true },
  { id: "doc_002", name: "Business License", type: "pdf", size: "1.2 MB", date: "Mar 2024", verified: true },
  { id: "doc_003", name: "Agency Logo", type: "image", size: "85 KB", date: "Apr 2024", verified: false },
  { id: "doc_004", name: "Insurance Policy", type: "pdf", size: "3.4 MB", date: "Jun 2024", verified: false },
];

const ICONS: Record<string, React.ElementType> = {
  pdf: FilePdf,
  image: Image,
  doc: FileText,
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState(DOCS);

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Documents</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-faint)" }}>Manage your agency's official documents</p>

      {/* Upload area */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex flex-col items-center justify-center py-8 mb-6 rounded-2xl cursor-pointer"
        style={{
          background: "rgba(124,58,237,0.06)",
          border: "2px dashed rgba(124,58,237,0.3)",
        }}
      >
        <UploadSimple size={28} className="text-violet-400 mb-2" />
        <p className="text-sm font-semibold text-violet-400">Click to upload</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>PDF, PNG, JPG up to 10MB</p>
      </motion.div>

      {/* Doc list */}
      <div className="space-y-2.5">
        {docs.map((doc, i) => {
          const Icon = ICONS[doc.type] ?? FileText;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.12)" }}
              >
                <Icon size={20} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{doc.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{doc.size} · {doc.date}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {doc.verified ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
                    Pending
                  </span>
                )}
                <button style={{ color: "var(--text-faint)" }}>
                  <DownloadSimple size={16} />
                </button>
                <button onClick={() => setDocs((d) => d.filter((x) => x.id !== doc.id))} className="text-red-400">
                  <Trash size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
