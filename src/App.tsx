import React, { useState } from 'react'
import { ShaderHero } from './components/ui/shader-hero'
import { Aurora } from './components/ui/aurora'
import { Dock, DockIcon, DockItem, DockLabel } from './components/ui/dock'
import { FooterSection } from './components/ui/footer-section'
import { ProjectPreviewModal, type ProjectItem } from './components/ui/project-preview-modal'
import { PROFILE } from './data/profile'
import profilePhoto from '../assets/WhatsApp Image 2026-07-18 at 15.09.43.jpeg'
import { 
  ExternalLink, 
  Eye,
  Home, 
  Layers, 
  Briefcase, 
  User, 
  Mail, 
  Sun,
  Moon
} from 'lucide-react'

const PROJECTS: ProjectItem[] = [
  {
    id: "casa-nativa",
    title: "Casa Nativa — Arquitetura",
    tag: "MODELO // LANDING PAGE",
    year: "DEMO",
    client: "Marca fictícia Casa Nativa",
    role: "Landing page editorial",
    metrics: "Conteúdo demonstrativo",
    stack: ["Landing Page", "Arquitetura", "Design responsivo"],
    desc: "Página modelo para um estúdio de arquitetura residencial, com destaque para projetos, materiais e conversa inicial.",
    fullDesc: "Protótipo demonstrativo de uma landing page para a Casa Nativa. A composição editorial apresenta uma residência-conceito, explica a abordagem do estúdio e conduz o visitante para um contato por e-mail.",
    highlights: [
      "Abertura editorial com imagem de referência arquitetônica.",
      "Seções para apresentar abordagem, materiais e projeto-conceito.",
      "Ação de contato preparada como mensagem de e-mail."
    ],
    img: "/src/imgs/casa-grande.jpg",
    liveUrl: "/modelos/landing-page/index.html"
  },
  {
    id: "ritmo-web-app",
    title: "Ritmo — Gestão de Projetos",
    tag: "MODELO // APLICAÇÃO WEB",
    year: "DEMO",
    client: "Produto fictício Ritmo",
    role: "Quadro de trabalho interativo",
    metrics: "Dados locais de demonstração",
    stack: ["Web App", "Kanban", "HTML / CSS / JS"],
    desc: "Aplicação web demonstrativa para organizar tarefas de uma equipe em um quadro de projetos interativo.",
    fullDesc: "Protótipo funcional de uma aplicação web para organizar o trabalho de uma equipe. É possível filtrar tarefas, marcar itens como concluídos e adicionar uma tarefa de exemplo; os dados ficam apenas na página.",
    highlights: [
      "Filtros para localizar tarefas por estado.",
      "Ação para incluir uma tarefa demonstrativa no quadro.",
      "Controles de conclusão com atualização imediata da interface."
    ],
    img: "/src/imgs/web-app.png",
    liveUrl: "/modelos/web-app/index.html"
  },
  {
    id: "nimbo-saas",
    title: "Nimbo — Operação de Estúdio",
    tag: "MODELO // SAAS",
    year: "DEMO",
    client: "Produto fictício Nimbo",
    role: "Workspace para equipes criativas",
    metrics: "Dados de exemplo",
    stack: ["SaaS", "Workspace", "Interface interativa"],
    desc: "Modelo de SaaS para acompanhar projetos, entregas e rotinas de um pequeno estúdio em um painel de trabalho.",
    fullDesc: "Demonstração de um workspace SaaS fictício para equipes criativas. O painel organiza projetos e tarefas com dados de exemplo e permite alternar o período exibido sem enviar informações para um serviço externo.",
    highlights: [
      "Visão geral com projetos e tarefas ilustrativas.",
      "Alternância de período para explorar diferentes dados de exemplo.",
      "Layout adaptado para telas menores e navegação por teclado."
    ],
    img: "/src/imgs/nimbo-saas.png",
    liveUrl: "/modelos/saas/index.html"
  },
  {
    id: "farol-seguros",
    title: "Farol Seguros — Site institucional",
    tag: "MODELO // SITE MULTIPÁGINA",
    year: "DEMO",
    client: "Corretora fictícia Farol Seguros",
    role: "Site demonstrativo adaptado",
    metrics: "Contatos e dados fictícios",
    stack: ["Seguros", "Site multipágina", "HTML / CSS / JS"],
    desc: "Modelo de site para uma corretora fictícia, com apresentação de produtos, páginas internas e canais de contato demonstrativos.",
    fullDesc: "Versão demonstrativa baseada em um projeto fornecido. Identidade, contatos e credenciais foram substituídos; o conteúdo não representa uma corretora real, parcerias ou apólices.",
    highlights: [
      "Página inicial com navegação para diferentes modalidades de seguro.",
      "Páginas internas e estilos responsivos copiados para este projeto.",
      "Informações pessoais e registros reais removidos da versão demonstrativa."
    ],
    img: "/modelos/farol-seguros/img/Banner/sport-car-with-black-white-autotuning-driving-forest_11zon1.webp",
    liveUrl: "/modelos/farol-seguros/index.html"
  }
];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [briefingStatus, setBriefingStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const scrollToSection = (targetHash: string) => {
    if (!targetHash || targetHash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = targetHash.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 48;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, elementPosition - headerOffset),
        behavior: 'smooth',
      });
    }
  };

  const handleGlobalAnchorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
    }
  };

  const handleBriefingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setBriefingStatus("sending");

    try {
      const response = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          service: formData.get("service"),
          details: formData.get("details"),
        }),
      });

      if (!response.ok) {
        throw new Error(`Briefing submission failed with status ${response.status}`);
      }

      form.reset();
      setBriefingStatus("success");
    } catch (error) {
      console.error("Could not send the project briefing.", error);
      setBriefingStatus("error");
    }
  };

  const navItems = [
    {
      title: 'Início',
      icon: <Home className={`h-full w-full ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`} />,
      href: '#',
    },
    {
      title: 'Serviços',
      icon: <Layers className={`h-full w-full ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`} />,
      href: '#capabilities',
    },
    {
      title: 'Projetos',
      icon: <Briefcase className={`h-full w-full ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`} />,
      href: '#works',
    },
    {
      title: 'Sobre',
      icon: <User className={`h-full w-full ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`} />,
      href: '#about',
    },
    {
      title: 'Contato',
      icon: <Mail className={`h-full w-full ${isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}`} />,
      href: '#inquiry',
    },
    {
      title: isDarkMode ? 'Modo Claro' : 'Modo Escuro',
      icon: isDarkMode ? <Sun className='h-full w-full text-amber-400' /> : <Moon className='h-full w-full text-sky-400' />,
      action: toggleTheme,
      href: '#',
    },
  ];

  const bgColor = isDarkMode ? 'bg-black text-neutral-100' : 'bg-white text-neutral-900';
  const cardBg = isDarkMode 
    ? 'bg-neutral-950/65 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]' 
    : 'bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]';
  const subtextColor = isDarkMode ? 'text-neutral-400' : 'text-neutral-600';
  const headingColor = isDarkMode ? 'text-white' : 'text-neutral-950';
  const accentTextColor = isDarkMode ? 'text-neutral-300' : 'text-neutral-700';
  const primaryBtn = isDarkMode ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800';

  return (
    <div
      onClick={handleGlobalAnchorClick}
      className={`min-h-screen pb-20 md:pb-0 ${bgColor} font-sans selection:bg-neutral-400 selection:text-black transition-colors duration-300`}
    >
      
      {/* Technical Header - Completely transparent background per user request */}
      <header className="fixed top-0 left-0 w-full h-[72px] bg-transparent flex items-center justify-between px-6 md:px-12 z-50">
        <a
          href="#"
          className={`font-mono text-sm tracking-widest font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-950'} flex items-center gap-2`}
        >
          {PROFILE.name.toUpperCase()} <span className="font-normal text-neutral-500">// {PROFILE.descriptor}</span>
        </a>

        {/* Floating Apple Dock Navbar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 hidden md:block">
          <Dock className="items-end gap-4 px-4 pb-1 bg-transparent dark:bg-transparent shadow-none">
            {navItems.map((item, idx) => (
              <a 
                key={idx} 
                href={item.href} 
                aria-label={item.title}
                title={item.title}
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.action();
                  }
                }}
              >
                <DockItem className={`aspect-square rounded-full ${
                  isDarkMode 
                    ? 'bg-neutral-900/80 border border-white/15 text-white backdrop-blur-md' 
                    : 'bg-white/80 border border-neutral-300 text-neutral-900 backdrop-blur-md'
                } hover:scale-110 transition-transform`}>
                  <DockLabel>{item.title}</DockLabel>
                  <DockIcon>{item.icon}</DockIcon>
                </DockItem>
              </a>
            ))}
          </Dock>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <a href="#inquiry" className={`px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-colors ${primaryBtn}`}>
            Iniciar Projeto
          </a>
        </div>
      </header>

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-2 md:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <Dock
          panelHeight={56}
          magnification={52}
          className={`items-center gap-0.5 rounded-2xl border px-1 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ${
            isDarkMode
              ? 'border-white/10 bg-neutral-950/85 dark:bg-neutral-950/85'
              : 'border-neutral-300 bg-white/90 dark:bg-white/90'
          }`}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              aria-label={item.title}
              title={item.title}
              onClick={(e) => {
                if (item.action) {
                  e.preventDefault();
                  e.stopPropagation();
                  item.action();
                }
              }}
            >
              <DockItem className={`aspect-square min-h-11 min-w-11 rounded-full ${
                isDarkMode
                  ? 'bg-neutral-900/80 border border-white/15 text-white backdrop-blur-md'
                  : 'bg-white/80 border border-neutral-300 text-neutral-900 backdrop-blur-md'
              } active:scale-95 transition-transform`}>
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </a>
          ))}
        </Dock>
      </nav>

      {/* Hero Section — beratberkayg/shader-hero (monochrome mesh gradient, theme-aware) */}
      <ShaderHero isDarkMode={isDarkMode} whatsappCtaHref={PROFILE.whatsappUrl} />

      {/* Aurora Background Effect for the rest of the page (21st.dev/kevingirelli/aurora) */}
      <Aurora
        colors={
          isDarkMode
            ? ["#ffffff", "#a1a1aa", "#71717a"]
            : ["#71717a", "#a1a1aa", "#52525b"]
        }
        intensity={isDarkMode ? 0.22 : 0.28}
        className="relative z-10"
      >
        {/* Selected Works Section */}
        <section id="works" className="py-28 px-12 max-w-7xl mx-auto">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} pb-6`}>
            <div>
              <div className={`font-mono text-xs uppercase tracking-[0.2em] ${accentTextColor} mb-3`}>01 // ESTUDOS DE INTERFACE</div>
              <h2 className={`text-4xl md:text-6xl font-bold uppercase tracking-tight ${headingColor}`}>Modelos de Exemplo</h2>
            </div>
            <div className={`font-mono text-sm ${subtextColor} mt-4 md:mt-0`}>
              [ 4 protótipos independentes ]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((work) => (
              <article
                key={work.id}
                role="button"
                tabIndex={0}
                aria-label={`Abrir preview do projeto ${work.title}`}
                onClick={() => setSelectedProject(work)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProject(work);
                  }
                }}
                className={`group cursor-pointer text-left ${cardBg} border ${
                  isDarkMode ? 'border-neutral-800/80 hover:border-neutral-500' : 'border-neutral-200 hover:border-neutral-400'
                } rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] focus:outline-none focus:border-neutral-500`}
              >
                <div className="relative h-72 overflow-hidden bg-black">
                  <span className="absolute top-4 left-4 font-mono text-xs bg-black/90 border border-white/15 text-neutral-200 px-3 py-1 tracking-widest z-10">
                    {work.tag}
                  </span>
                  <span className="absolute top-4 right-4 font-mono text-[11px] bg-black/80 border border-white/15 text-neutral-300 px-2.5 py-1 tracking-wider z-10">
                    {work.year}
                  </span>
                  <img
                    src={work.img}
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Interactive Hover Overlay */}
                  <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-4 h-4" /> Abrir Janela de Preview
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4 font-mono text-[10px] uppercase tracking-wider">
                    {work.stack.map((s, i) => (
                      <span
                        key={i}
                        className={`${
                          isDarkMode
                            ? 'bg-neutral-900/80 backdrop-blur-sm text-neutral-300 border border-neutral-700/60'
                            : 'bg-white/90 backdrop-blur-sm text-neutral-700 border border-neutral-300/80'
                        } px-2.5 py-1 rounded-sm`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <h3 className={`text-3xl font-bold uppercase tracking-wide mb-3 group-hover:opacity-70 transition-colors ${headingColor}`}>
                    {work.title}
                  </h3>
                  <p className={`${subtextColor} text-sm leading-relaxed mb-6`}>
                    {work.desc}
                  </p>
                  <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                    <span className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest ${accentTextColor} font-bold group-hover:translate-x-1 transition-transform`}>
                      <Eye className="w-3.5 h-3.5" /> Ver Preview do Projeto
                    </span>
                    <a
                      href={work.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-colors ${
                        isDarkMode
                          ? 'border-white/15 text-neutral-200 hover:bg-neutral-950 hover:text-white hover:border-neutral-950'
                          : 'border-neutral-300 text-neutral-800 hover:bg-neutral-950 hover:text-white hover:border-neutral-950'
                      }`}
                    >
                      Live Preview <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section id="capabilities" className={`py-28 px-12 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="mb-16">
            <div className={`font-mono text-xs uppercase tracking-[0.2em] ${accentTextColor} mb-3`}>02 // DOMÍNIOS DE ATUAÇÃO</div>
            <h2 className={`text-4xl md:text-6xl font-bold uppercase tracking-tight ${headingColor}`}>Capacidades Técnicas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Arquitetura Front-End", desc: "Organização de componentes e interfaces para estruturar projetos web.", span: "" },
              { num: "02", title: "Direção de Arte UI/UX", desc: "Definição de elementos visuais, cores e tipografia de acordo com cada projeto.", span: "" },
              { num: "03", title: "Animação & Motion", desc: "Animações e microinterações aplicadas à navegação e aos elementos da interface.", span: "" },
              { num: "04", title: "Performance & SEO", desc: "Ajustes de desempenho, metadados e estrutura semântica conforme as necessidades do projeto.", span: "" },
              { num: "05", title: "Sistemas de Design", desc: "Organização de componentes e padrões visuais para manter consistência entre as páginas de um projeto.", span: "lg:col-span-2" }
            ].map((cap, idx) => (
              <div key={idx} className={`${cardBg} border ${isDarkMode ? 'border-neutral-800/80 hover:border-neutral-500' : 'border-neutral-200 hover:border-neutral-400'} p-8 rounded-sm transition-all ${cap.span}`}>
                <div className={`font-mono text-xs ${accentTextColor} mb-6 tracking-widest`}>{cap.num} / DISCIPLINA</div>
                <h3 className={`text-2xl font-bold uppercase tracking-wide mb-3 ${headingColor}`}>{cap.title}</h3>
                <p className={`${subtextColor} text-sm leading-relaxed`}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Section ("Sobre") */}
        <section id="about" className={`py-28 px-6 md:px-12 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Professional Portrait Frame */}
            <div className="lg:col-span-5">
              <div className={`relative ${cardBg} border ${isDarkMode ? 'border-white/15' : 'border-neutral-300'} rounded-sm p-3 shadow-2xl group`}>
                {/* Corner HUD Crosshairs */}
                <span className={`absolute -top-2 -left-2 font-mono text-xs ${accentTextColor} select-none`}>+</span>
                <span className={`absolute -top-2 -right-2 font-mono text-xs ${accentTextColor} select-none`}>+</span>
                <span className={`absolute -bottom-2 -left-2 font-mono text-xs ${accentTextColor} select-none`}>+</span>
                <span className={`absolute -bottom-2 -right-2 font-mono text-xs ${accentTextColor} select-none`}>+</span>

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-black">
                  {/* Top HUD Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/85 border border-white/15 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-neutral-300" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-200">
                      ID // {PROFILE.name}
                    </span>
                  </div>

                  {/* Professional Image (easily replaceable) */}
                  <img
                    src={profilePhoto}
                    alt={`Retrato profissional de ${PROFILE.name}`}
                    className="h-full w-full object-cover object-[center_34%] transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Bottom Overlay Telemetry Bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-5 pt-12">
                    <div className="font-mono text-xs uppercase tracking-widest text-white font-bold">
                      {PROFILE.name}
                    </div>
                    <div className="font-mono text-[11px] text-neutral-200 tracking-wider">
                      {PROFILE.role}
                    </div>
                  </div>
                </div>

                {/* Technical Caption Footer */}
                <div className={`mt-3 flex items-center justify-between px-2 py-1 font-mono text-[11px] ${subtextColor}`}>
                  <span>{PROFILE.location}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bio & Work Presentation */}
            <div className="lg:col-span-7">
              <div className={`font-mono text-xs uppercase tracking-[0.2em] ${accentTextColor} mb-3`}>
                03 // SOBRE O PROFISSIONAL &amp; O TRABALHO
              </div>
              <h2 className={`text-4xl md:text-6xl font-bold uppercase tracking-tight mb-8 leading-[0.98] ${headingColor}`}>
                ONDE A ENGENHARIA DE SOFTWARE ENCONTRA A DIREÇÃO DE ARTE.
              </h2>

              <div className={`space-y-5 text-base md:text-lg leading-relaxed ${subtextColor} mb-10`}>
                <p>
                  <strong className={headingColor}>Sou {PROFILE.name}, {PROFILE.role}.</strong> Desenvolvo sites e aplicações web, incluindo landing pages, portfólios e interfaces para produtos digitais.
                </p>
                <p>
                  Procuro organizar o código e a interface para que cada projeto seja claro, funcional e adequado ao seu objetivo.
                </p>
                <p>
                  Cuido da implementação e busco manter uma comunicação clara ao longo do trabalho.
                </p>
              </div>

              {/* Key Pillars / Metrics Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <div className={`${cardBg} border ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} p-5 rounded-sm`}>
                  <div className={`font-mono text-2xl md:text-3xl font-bold ${accentTextColor} mb-1`}>4</div>
                  <div className={`font-mono text-[11px] uppercase tracking-wider ${subtextColor}`}>
                    Modelos demonstrativos
                  </div>
                </div>
                <div className={`${cardBg} border ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} p-5 rounded-sm`}>
                  <div className={`font-mono text-2xl md:text-3xl font-bold ${accentTextColor} mb-1`}>3</div>
                  <div className={`font-mono text-[11px] uppercase tracking-wider ${subtextColor}`}>
                    Tipos de produto digital
                  </div>
                </div>
                <div className={`${cardBg} border ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} p-5 rounded-sm`}>
                  <div className={`font-mono text-2xl md:text-3xl font-bold ${accentTextColor} mb-1`}>1</div>
                  <div className={`font-mono text-[11px] uppercase tracking-wider ${subtextColor}`}>
                    Site multipágina adaptado
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Inquiry & Contact Section */}
        <section id="inquiry" className={`py-28 px-12 max-w-7xl mx-auto border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'} grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
          <div>
            <div className={`font-mono text-xs uppercase tracking-[0.2em] ${accentTextColor} mb-3`}>04 // INICIE SEU PROJETO</div>
            <h2 className={`text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6 leading-[0.95] ${headingColor}`}>VAMOS CRIAR ALGO ICÔNICO.</h2>
            <p className={`${subtextColor} text-lg leading-relaxed mb-10 max-w-lg`}>
              Tem um projeto em mente? Envie uma mensagem com seus objetivos e vamos conversar sobre a melhor solução.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono">
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Localização</div>
                <div className={`text-sm ${headingColor} font-semibold`}>{PROFILE.location} — {PROFILE.serviceArea}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Atuação</div>
                <div className={`text-sm ${headingColor} font-semibold`}>{PROFILE.role}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">WhatsApp</div>
                <a href={PROFILE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`text-sm ${headingColor} font-semibold underline underline-offset-4`}>
                  {PROFILE.phoneDisplay}
                </a>
              </div>
              <div>
                <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Contato Direto</div>
                <a href={`mailto:${PROFILE.email}`} className={`text-sm ${headingColor} font-semibold underline underline-offset-4`}>{PROFILE.email}</a>
              </div>
            </div>
          </div>

          <div className={`${cardBg} border ${isDarkMode ? 'border-neutral-700/80' : 'border-neutral-300'} p-10 rounded-sm shadow-2xl`}>
            <form onSubmit={handleBriefingSubmit}>
              <div className="mb-6">
                <label htmlFor="briefing-name" className={`block font-mono text-xs uppercase tracking-widest ${accentTextColor} mb-2`}>Seu Nome / Empresa</label>
                <input id="briefing-name" name="name" type="text" maxLength={120} autoComplete="name" className={`w-full ${isDarkMode ? 'bg-black/60 backdrop-blur-md border-neutral-800 text-white' : 'bg-white/80 backdrop-blur-md border-neutral-300 text-neutral-900'} border px-4 py-3 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors`} placeholder="Seu nome ou empresa" required />
              </div>
              <div className="mb-6">
                <label htmlFor="briefing-email" className={`block font-mono text-xs uppercase tracking-widest ${accentTextColor} mb-2`}>E-mail para retorno</label>
                <input id="briefing-email" name="email" type="email" maxLength={254} autoComplete="email" className={`w-full ${isDarkMode ? 'bg-black/60 backdrop-blur-md border-neutral-800 text-white' : 'bg-white/80 backdrop-blur-md border-neutral-300 text-neutral-900'} border px-4 py-3 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors`} placeholder="voce@empresa.com" required />
              </div>
              <div className="mb-6">
                <label htmlFor="briefing-service" className={`block font-mono text-xs uppercase tracking-widest ${accentTextColor} mb-2`}>Escopo do Projeto</label>
                <select id="briefing-service" name="service" className={`w-full ${isDarkMode ? 'bg-black/60 backdrop-blur-md border-neutral-800 text-white' : 'bg-white/80 backdrop-blur-md border-neutral-300 text-neutral-900'} border px-4 py-3 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors`}>
                  <option>Landing Page</option>
                  <option>Site Institucional / Portfólio</option>
                  <option>Aplicação Web / Dashboard (SaaS)</option>
                  <option>E-Commerce de Luxo</option>
                </select>
              </div>
              <div className="mb-8">
                <label htmlFor="briefing-details" className={`block font-mono text-xs uppercase tracking-widest ${accentTextColor} mb-2`}>Detalhes do Projeto</label>
                <textarea id="briefing-details" name="details" maxLength={5000} className={`w-full ${isDarkMode ? 'bg-black/60 backdrop-blur-md border-neutral-800 text-white' : 'bg-white/80 backdrop-blur-md border-neutral-300 text-neutral-900'} border px-4 py-3 rounded-sm focus:outline-none focus:border-neutral-500 transition-colors h-32 resize-none`} placeholder="Conte brevemente sobre os objetivos do projeto..." required></textarea>
              </div>
              <button type="submit" disabled={briefingStatus === "sending"} className={`w-full ${primaryBtn} font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-md transition-all shadow-lg hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60`}>
                {briefingStatus === "sending" ? "Enviando..." : "Enviar Briefing de Projeto ↗"}
              </button>
              <p className={`mt-4 text-sm ${subtextColor}`} role="status" aria-live="polite">
                {briefingStatus === "success" && "Briefing enviado com sucesso. Obrigado pelo contato."}
                {briefingStatus === "error" && "Não foi possível enviar agora. Tente novamente ou entre em contato pelo WhatsApp."}
              </p>
            </form>
          </div>
        </section>

        <FooterSection isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      </Aurora>

      {/* Interactive Project Preview Window Modal */}
      <ProjectPreviewModal
        project={selectedProject}
        isDarkMode={isDarkMode}
        onClose={() => setSelectedProject(null)}
        onRequestSimilar={() => {
          setSelectedProject(null);
          setTimeout(() => scrollToSection('#inquiry'), 150);
        }}
      />

    </div>
  )
}