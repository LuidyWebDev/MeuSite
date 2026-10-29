import { Moon, Sun } from "lucide-react"
import { PROFILE } from "../../data/profile"

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

interface FooterSectionProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function FooterSection({ isDarkMode, onToggleTheme }: FooterSectionProps) {
  const footerBg = isDarkMode
    ? "bg-neutral-950/55 backdrop-blur-xl text-neutral-100 border-white/10"
    : "bg-white/60 backdrop-blur-xl text-neutral-900 border-neutral-200/80"
  const subtextColor = isDarkMode ? "text-neutral-400" : "text-neutral-600"
  const headingColor = isDarkMode ? "text-white" : "text-neutral-950"
  const hoverText = isDarkMode ? "hover:text-white" : "hover:text-neutral-950"
  const accentTextColor = isDarkMode ? "text-neutral-300" : "text-neutral-700"
  const socialLinks = [
    {
      name: "GitHub",
      icon: GithubIcon,
      href: PROFILE.socialLinks.github,
      colorClass: "bg-white text-black border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 shadow-sm",
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      href: PROFILE.socialLinks.linkedin,
      colorClass: isDarkMode
        ? "bg-white/5 backdrop-blur-md border-white/15 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/15"
        : "bg-white/80 backdrop-blur-md border-neutral-200 text-[#0A66C2] hover:border-[#0A66C2] hover:bg-[#0A66C2]/10",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: PROFILE.socialLinks.facebook,
      colorClass: isDarkMode
        ? "bg-white/5 backdrop-blur-md border-white/15 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/15"
        : "bg-white/80 backdrop-blur-md border-neutral-200 text-[#1877F2] hover:border-[#1877F2] hover:bg-[#1877F2]/10",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      href: PROFILE.socialLinks.instagram,
      colorClass: isDarkMode
        ? "bg-white/5 backdrop-blur-md border-white/15 text-[#E4405F] hover:border-[#E4405F] hover:bg-[#E4405F]/15"
        : "bg-white/80 backdrop-blur-md border-neutral-200 text-[#E4405F] hover:border-[#E4405F] hover:bg-[#E4405F]/10",
    },
  ]

  return (
    <footer className={`relative border-t transition-colors duration-300 ${footerBg}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          <div>
            <div className={`font-mono text-xs tracking-widest ${accentTextColor} mb-3 flex items-center gap-2`}>
              {PROFILE.name.toUpperCase()} <span className="text-neutral-500">// {PROFILE.descriptor}</span>
            </div>
            <h3 className={`mb-3 text-2xl font-bold uppercase tracking-tight ${headingColor}`}>
              Vamos conversar
            </h3>
            <p className={`mb-6 text-sm leading-relaxed ${subtextColor}`}>
              Desenvolvo sites e aplicações web para apresentar negócios, serviços e produtos digitais.
            </p>
            <a href={`mailto:${PROFILE.email}`} className={`font-mono text-sm underline underline-offset-4 ${headingColor}`}>
              {PROFILE.email}
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className={`mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] ${accentTextColor}`}>
              Navegação Rápida
            </h3>
            <nav className="space-y-2.5 text-sm" aria-label="Links do rodapé">
              <a href="#" className={`block transition-colors ${subtextColor} ${hoverText}`}>
                Início
              </a>
              <a href="#about" className={`block transition-colors ${subtextColor} ${hoverText}`}>
                Sobre mim
              </a>
              <a href="#works" className={`block transition-colors ${subtextColor} ${hoverText}`}>
                Projetos Selecionados
              </a>
              <a href="#capabilities" className={`block transition-colors ${subtextColor} ${hoverText}`}>
                Capacidades Técnicas
              </a>
              <a href="#inquiry" className={`block transition-colors ${subtextColor} ${hoverText}`}>
                Iniciar Projeto
              </a>
            </nav>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h3 className={`mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] ${accentTextColor}`}>
              Contato Direto
            </h3>
            <address className={`space-y-2.5 text-sm not-italic ${subtextColor}`}>
              <p>{PROFILE.location} — {PROFILE.serviceArea}</p>
              <p className="font-mono text-xs pt-1">
                <a href={`mailto:${PROFILE.email}`} className={`${hoverText} transition-colors`}>
                  {PROFILE.email}
                </a>
              </p>
              <p className="font-mono text-xs pt-1">
                <a href={PROFILE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${hoverText} transition-colors`}>
                  WhatsApp · {PROFILE.phoneDisplay}
                </a>
              </p>
            </address>
          </div>

          {/* Column 4: Follow Us & Theme Switch */}
          <div className="relative">
            <h3 className={`mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] ${accentTextColor}`}>
              Redes e conexões
            </h3>
            <div className="mb-6 flex flex-wrap gap-3" aria-label="Perfis sociais">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Perfil de ${social.name} de ${PROFILE.name}`}
                    title={social.name}
                    className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 ${social.colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>

            {/* Theme Switch integrated with page state (Yellow Sun / Blue Moon) */}
            <div className="flex items-center space-x-3 pt-2">
              <Sun className="h-4 w-4 text-amber-400" />
              <button
                type="button"
                role="switch"
                aria-checked={isDarkMode}
                aria-label="Alternar entre modo claro e modo escuro"
                onClick={onToggleTheme}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 focus:outline-none ${
                  isDarkMode
                    ? "bg-white border-white"
                    : "bg-neutral-300 border-neutral-400"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                  }`}
                />
              </button>
              <Moon className="h-4 w-4 text-sky-400" />
              <span className={`font-mono text-xs uppercase tracking-wider ${subtextColor}`}>
                {isDarkMode ? "Modo Escuro" : "Modo Claro"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row ${
          isDarkMode ? "border-white/10" : "border-neutral-200/80"
        }`}>
          <p className={`font-mono text-xs ${subtextColor}`}>
            © 2026 {PROFILE.name.toUpperCase()}. PORTFÓLIO PESSOAL.
          </p>
          <nav className="flex flex-wrap justify-center gap-6 font-mono text-xs" aria-label="Links do portfólio">
            <a href="#works" className={`transition-colors ${subtextColor} ${hoverText}`}>
              Modelos de exemplo
            </a>
            <a href="#inquiry" className={`transition-colors ${subtextColor} ${hoverText}`}>
              Contato
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
export default FooterSection
