import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  Globe,
  Monitor,
  Smartphone,
  X,
} from "lucide-react"

export interface ProjectItem {
  id: string
  title: string
  tag: string
  year: string
  client: string
  role: string
  metrics: string
  stack: string[]
  desc: string
  fullDesc: string
  highlights: string[]
  img: string
  liveUrl: string
}

interface ProjectPreviewModalProps {
  project: ProjectItem | null
  isDarkMode: boolean
  onClose: () => void
  onRequestSimilar: (projectTitle: string) => void
}

export function ProjectPreviewModal({
  project,
  isDarkMode,
  onClose,
  onRequestSimilar,
}: ProjectPreviewModalProps) {
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop")

  useEffect(() => {
    if (!project) return
    setViewportMode("desktop")

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [project, onClose])

  const modalSurface = isDarkMode
    ? "bg-[#0D0D0F] border-neutral-800 text-neutral-100"
    : "bg-white border-neutral-300 text-neutral-950"
  const headerSurface = isDarkMode
    ? "bg-[#08080A] border-neutral-800"
    : "bg-neutral-100 border-neutral-200"
  const stageSurface = isDarkMode
    ? "bg-[#050506] border-neutral-800"
    : "bg-neutral-100/80 border-neutral-200"
  const subtextColor = isDarkMode ? "text-neutral-400" : "text-neutral-600"
  const headingColor = isDarkMode ? "text-white" : "text-neutral-950"
  const hoverText = isDarkMode ? "hover:text-white" : "hover:text-neutral-950"
  const accentTextColor = isDarkMode ? "text-neutral-300" : "text-neutral-700"
  const primaryBtn = isDarkMode
    ? "bg-white text-black hover:bg-neutral-200"
    : "bg-neutral-950 text-white hover:bg-neutral-800"

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          {/* Animated Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className={`fixed inset-0 ${
              isDarkMode ? "bg-black/80" : "bg-neutral-900/60"
            } backdrop-blur-md cursor-pointer`}
          />

          {/* Modal Window Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={`relative z-10 w-full max-w-6xl max-h-[90vh] flex flex-col border rounded-lg shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden ${modalSurface}`}
          >
            {/* Top Browser Window Bar */}
            <div
              className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b ${headerSurface}`}
            >
              {/* Left: Window Dots & Tag */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar janela de preview"
                    className="h-3 w-3 rounded-full bg-neutral-600 hover:bg-neutral-400 transition-colors cursor-pointer"
                  />
                  <span className="h-3 w-3 rounded-full bg-neutral-700" />
                  <span className="h-3 w-3 rounded-full bg-neutral-700" />
                </div>
                <span className={`hidden sm:inline-block font-mono text-[11px] uppercase tracking-[0.2em] ${accentTextColor}`}>
                  {project.tag}
                </span>
              </div>

              {/* Center: Simulated Live URL Bar & Viewport Switcher */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`hidden md:flex items-center gap-2 px-3.5 py-1 rounded-md border font-mono text-xs ${
                    isDarkMode
                      ? "bg-neutral-900 border-neutral-800 text-neutral-300"
                      : "bg-white border-neutral-300 text-neutral-700"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="truncate max-w-[240px]">{project.liveUrl}</span>
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-neutral-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-pulse" />
                    ONLINE
                  </span>
                </div>

                {/* Desktop / Mobile Preview Toggle */}
                <div
                  className={`flex items-center p-0.5 rounded-md border ${
                    isDarkMode ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewportMode("desktop")}
                    aria-label="Visualização Desktop"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                      viewportMode === "desktop"
                        ? `${primaryBtn} font-bold`
                        : `${subtextColor} ${hoverText}`
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewportMode("mobile")}
                    aria-label="Visualização Mobile"
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[11px] uppercase transition-colors cursor-pointer ${
                      viewportMode === "mobile"
                        ? `${primaryBtn} font-bold`
                        : `${subtextColor} ${hoverText}`
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>
              </div>

              {/* Right: Direct Live Preview Link & Close Button */}
              <div className="flex items-center gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-1.5 font-mono font-bold text-[11px] uppercase tracking-widest rounded-md transition-all ${primaryBtn}`}
                >
                  Live Preview <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar preview"
                  className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                    isDarkMode
                      ? "border-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-white"
                      : "border-neutral-300 text-neutral-700 hover:border-neutral-600 hover:text-black"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Split Interactive Stage + Technical Brief */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
              
              {/* Left Column (7 cols): Interactive Project Preview Viewport */}
              <div
                className={`lg:col-span-7 p-6 sm:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r relative overflow-hidden ${stageSurface}`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  className={`relative overflow-hidden rounded-md border ${
                    isDarkMode ? "border-neutral-700 bg-black" : "border-neutral-300 bg-black"
                  } shadow-2xl ${
                    viewportMode === "desktop"
                      ? "w-full aspect-[16/10]"
                      : "w-[270px] sm:w-[300px] aspect-[9/16] max-h-[460px]"
                  }`}
                >
                  {/* Simulated Browser Preview Screen */}
                  <img
                    src={project.img}
                    alt={`Preview do projeto ${project.title}`}
                    className="h-full w-full object-cover object-center contrast-110 transition-transform duration-700 hover:scale-105"
                  />

                  {/* Interactive Live Preview Overlay UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent flex flex-col justify-between p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-black/85 border border-white/20 text-neutral-200 px-3 py-1 backdrop-blur-sm">
                        {project.client} // {project.year}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider bg-white/10 border border-white/20 text-white px-2.5 py-1 backdrop-blur-sm">
                        {project.metrics}
                      </span>
                    </div>

                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-300 mb-1">
                        {project.role}
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-4">
                        {project.title}
                      </h4>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-md hover:bg-neutral-200 transition-all"
                      >
                        Acessar Site ao Vivo <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom Caption inside Stage */}
                <div className={`mt-4 flex items-center justify-between w-full font-mono text-[11px] ${subtextColor}`}>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    MODO DE INSPEÇÃO: {viewportMode === "desktop" ? "1440PX DESKTOP" : "390PX MOBILE"}
                  </span>
                  <span>ESC PARA FECHAR</span>
                </div>
              </div>

              {/* Right Column (5 cols): Project Specifications & Actions */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className={`font-mono text-xs uppercase tracking-[0.2em] ${accentTextColor} mb-2`}>
                    ESTUDO DE CASO // {project.year}
                  </div>
                  <h3
                    id="modal-project-title"
                    className={`text-3xl sm:text-4xl font-bold uppercase tracking-tight mb-4 ${headingColor}`}
                  >
                    {project.title}
                  </h3>

                  {/* Stack Badges */}
                  <div className="flex flex-wrap gap-2 mb-6 font-mono text-[11px] uppercase tracking-wider">
                    {project.stack.map((tech, i) => (
                      <span
                        key={i}
                        className={`${
                          isDarkMode
                            ? "bg-neutral-900 text-neutral-300 border border-neutral-800"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-300"
                        } px-2.5 py-1 rounded-sm`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className={`text-sm sm:text-base leading-relaxed mb-6 ${subtextColor}`}>
                    {project.fullDesc}
                  </p>

                  {/* Key Deliverables / Highlights */}
                  <div
                    className={`border-t pt-5 mb-8 ${
                      isDarkMode ? "border-neutral-800" : "border-neutral-200"
                    }`}
                  >
                    <div className={`font-mono text-xs uppercase tracking-widest mb-3 ${headingColor}`}>
                      Destaques da Engenharia
                    </div>
                    <ul className="space-y-2.5">
                      {project.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className={`flex items-start gap-2.5 text-sm ${subtextColor}`}
                        >
                          <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${headingColor}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className={`space-y-3 pt-4 border-t ${isDarkMode ? "border-neutral-800" : "border-neutral-200"}`}>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 font-mono font-bold text-xs uppercase tracking-widest rounded-md transition-all flex items-center justify-center gap-2.5 ${primaryBtn}`}
                  >
                    Abrir Live Preview em Nova Guia <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onRequestSimilar(project.title)}
                    className={`w-full py-3.5 px-6 border font-mono font-semibold text-xs uppercase tracking-widest rounded-md transition-all cursor-pointer ${
                      isDarkMode
                        ? "border-neutral-700 text-white hover:bg-neutral-900 hover:border-neutral-500"
                        : "border-neutral-300 text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    Solicitar Projeto Similar ↓
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
export default ProjectPreviewModal
