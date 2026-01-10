import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { modulesData } from './data';
import './App.css'; 

import 'swiper/css';

import { 
  Play, 
  Clock, 
  MagnifyingGlass, 
  CirclesThreePlus, 
  CaretDown,
  Faders, 
  Bell,
  InstagramLogo,
  YoutubeLogo,
  LinkedinLogo
} from '@phosphor-icons/react';

function App() {
  // --- Estados de Dados e Navegação ---
  const [activeModuleId, setActiveModuleId] = useState(modulesData[0]?.id || 1);
  const [lastSession, setLastSession] = useState({ 
    moduleId: 1, 
    submoduleIndex: 0, 
    title: modulesData[0]?.submodules?.[0]?.title || "Introdução"
  });
  const [activeModuleData, setActiveModuleData] = useState(modulesData[0] || {});
  
  // --- Estados de Interface ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Estado para controlar qual link do menu superior está ativo (branco)
  const [activeNavLink, setActiveNavLink] = useState('Home');

  const swiperRef = useRef(null);

  // Atualiza dados do módulo ativo
  useEffect(() => {
    const found = modulesData.find(m => m.id === activeModuleId);
    if (found) setActiveModuleData(found);
  }, [activeModuleId]);

  // Função "Continuar de onde parei"
  const handleContinueSession = () => {
    setActiveModuleId(lastSession.moduleId);
    if (swiperRef.current) {
        const moduleIndex = modulesData.findIndex(m => m.id === lastSession.moduleId);
        if (moduleIndex >= 0) swiperRef.current.slideToLoop(moduleIndex);
    }
    setTimeout(() => {
      const cardId = `submodule-${lastSession.moduleId}-${lastSession.submoduleIndex}`;
      const element = document.getElementById(cardId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-pulse');
        setTimeout(() => element.classList.remove('highlight-pulse'), 3000);
      }
    }, 300);
  };

  // Lógica de Busca
  const getFilteredSubmodules = () => {
    if (searchQuery.length < 2) return null;
    let results = [];
    modulesData.forEach(mod => {
        if(mod.submodules) {
            mod.submodules.forEach((sub, idx) => {
                if (
                    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    sub.title.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    results.push({ ...sub, moduleId: mod.id, modTitle: mod.title, subIdx: idx });
                }
            });
        }
    });
    return results;
  };

  const searchResults = getFilteredSubmodules();
  const displayingSubmodules = searchResults ? searchResults : (activeModuleData.submodules || []);

  // Estatísticas Seguras
  const statsMaterials = activeModuleData?.stats?.materials || 0;
  const statsFlashcards = activeModuleData?.stats?.flashcards || 0;
  const statsSubmodules = activeModuleData?.submodules ? activeModuleData.submodules.length : 0;

  // Clique no Carrossel
  const handleSlideClick = (mod, index) => {
    setActiveModuleId(mod.id);
    if (swiperRef.current) {
        swiperRef.current.slideToLoop(index); 
    }
  };

  // Lista de links do menu para facilitar a renderização
  const navLinksList = ['Home', 'Acompanhamento', 'Cronograma', 'Material de Apoio', 'QBank'];

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020617] text-slate-50 font-sans">
      
      {/* =================================================================================
          CABEÇALHO (HEADER) - Visual Ajustado
      ================================================================================== */}
      <header className="bg-[#0b1121] border-b border-slate-800 px-6 py-3 z-50 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo (Sem roxo, apenas azul e branco/cinza) */}
            <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold italic group-hover:scale-110 transition text-white">
                    E
                </div>
                <span className="font-bold text-xl hidden md:block tracking-tight text-slate-200">
                    Ensino<span className="text-blue-500">Med</span>
                </span>
            </div>
            
            {/* Nav Links (Cinza -> Branco ao clicar) */}
            <nav className="hidden lg:flex gap-6 text-sm font-medium">
              {navLinksList.map((link) => (
                <a 
                    key={link}
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setActiveNavLink(link); }}
                    className={`transition-colors ${activeNavLink === link ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'}`}
                >
                    {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex-1 flex justify-end md:justify-end gap-4">
             {/* Dropdown Curso */}
             <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between gap-2 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl min-w-[280px] transition-all"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-bold">MC</span>
                        </div>
                        <span>MedCof USA 2025</span>
                    </div>
                    <CaretDown size={14} className="text-slate-400 opacity-70" />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[350px] bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-[100] p-2">
                        <a href="#" className="bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 mb-2 rounded-lg flex gap-3 py-3 px-3 items-center transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 text-xs font-bold">MC</span>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-sm text-white">MedCof USA 2025</span>
                                <span className="text-[11px] text-slate-400">Selecionado</span>
                            </div>
                        </a>
                        <a href="#" className="hover:bg-slate-800/50 text-slate-300 mb-1 rounded-lg flex gap-3 py-3 px-3 items-center transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">EX</span>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-sm">Extensivo 2025 - R1</span>
                                <span className="text-[11px] opacity-60">Disponível</span>
                            </div>
                        </a>
                    </div>
                )}
             </div>
             
             {/* Ícones (Sino e Perfil - Estilo da Imagem 3/HTML original) */}
             <div className="flex items-center gap-4 border-l border-slate-700 pl-4 relative">
                {/* Sino com notificação vermelha */}
                <div className="relative cursor-pointer hover:bg-white/5 p-2 rounded-full transition">
                    <Bell size={20} className="text-gray-300" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020617]"></span>
                </div>

                {/* Círculo de Perfil com gradiente e sombra */}
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#1e293b] cursor-pointer hover:scale-105 transition shadow-lg shadow-purple-500/20 text-white">
                    US
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* =================================================================================
          BARRA DE AÇÕES (PESQUISA + BOTÕES)
      ================================================================================== */}
      <div className="w-full bg-[#020617] px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 z-40 relative">
        <div className="relative w-full md:w-[480px]">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlass size={18} className="text-slate-500" />
           </div>
           <input 
             type="text" 
             placeholder="Pesquisar Módulos, Aulas, Questões..." 
             className="w-full bg-[#0b1121] border border-slate-800 focus:border-blue-600 text-slate-200 text-sm rounded-full pl-11 pr-4 h-12 transition-all outline-none placeholder:text-slate-600"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={handleContinueSession} 
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 h-10 rounded-full shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105"
            >
                Continuar de onde parei
            </button>
            
            <button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white text-sm font-bold px-6 h-10 rounded-full shadow-lg shadow-fuchsia-900/20 transition-all transform hover:scale-105 flex items-center gap-2">
                <Faders size={16} weight="bold" />
                Customizar a página
            </button>
        </div>
      </div>

      {/* --- BARRA PRÓXIMA SESSÃO --- */}
      <div className="w-full bg-[#020617] px-6 py-2 flex flex-col md:flex-row items-center justify-center text-xs md:text-sm gap-3 z-30 mb-4">
        <span className="text-slate-500 font-medium tracking-wide">Sua próxima sessão de estudos:</span>
        <button 
            onClick={handleContinueSession} 
            className="group flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] border border-slate-800 px-4 py-1.5 rounded-lg transition-all cursor-pointer"
        >
            <span className="text-blue-500 font-bold group-hover:text-blue-400 transition-colors">
                {modulesData.find(m => m.id === lastSession.moduleId)?.title}: <span className="text-blue-400 font-normal">{lastSession.title}</span>
            </span>
        </button>
        <button className="text-xs border border-slate-700 rounded-full px-3 py-1 text-slate-400 hover:text-white hover:border-slate-500 transition">
            Fazer agora
        </button>
      </div>

      {/* =================================================================================
          HERO DASHBOARD
      ================================================================================== */}
      <section className="relative w-full overflow-hidden group border-b border-slate-800 pb-0">
         <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 transform group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
         </div>

         <div className="relative z-10 w-full h-full flex items-center px-6 lg:px-12 pt-12 pb-6">
            <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center h-full">
                
                <div className="flex flex-col gap-6 w-full lg:w-3/4 transition-all duration-500 items-center text-center">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
                            {activeModuleData?.title || "Carregando..."}
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            Fundamentos essenciais para sua jornada.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <StatCard label="MATERIAIS" value={statsMaterials} />
                        <StatCard label="FLASHCARDS" value={statsFlashcards} />
                        <StatCard label="SUBMÓDULOS" value={statsSubmodules} isPurple={true} />
                    </div>
                </div>

                <div className="hidden lg:w-1/3 h-full flex flex-col justify-end lg:justify-center items-center pointer-events-none mt-6 lg:mt-0">
                    <div className="relative robot-float pointer-events-auto">
                        <img 
                            src={`public/assets/modules/robo.png`}
                            onError={(e) => {
                                e.target.style.display='none';
                            }}
                            alt="Robô Cofbot" 
                            className="w-64 h-auto object-contain drop-shadow-2xl" 
                        />
                    </div>
                </div>
            </div>
         </div>

         <div className="absolute bottom-0 left-0 w-full bg-[#0b1121]/90 backdrop-blur-md border-t border-white/10 py-3 z-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                <span className="font-semibold text-white">
                    Estudando: {lastSession.title}
                </span>
                
                <div className="w-64 h-3 bg-slate-700/50 rounded-full overflow-hidden shadow-inner relative">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-[10%] relative">
                         <div className="absolute right-0 top-0 h-full w-2 bg-white/30 blur-[2px]"></div> 
                    </div>
                </div>
                
                <span className="text-slate-300">Faltam 7 sessões para concluir</span>
            </div>
         </div>
      </section>

      {/* =================================================================================
          SELEÇÃO DE MÓDULOS (INFINITO)
      ================================================================================== */}
      <div className="w-full bg-[#020617] pt-0 pb-12 relative z-30">
        <div className="w-full max-w-7xl mx-auto px-4 mt-10">
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                loop={true} 
                slidesPerView="auto" 
                spaceBetween={40} 
                centeredSlides={true}
                slideToClickedSlide={true}
                grabCursor={true}
                className="mySwiper"
                onSlideChange={(swiper) => {
                    const newModule = modulesData[swiper.realIndex];
                    if(newModule) setActiveModuleId(newModule.id);
                }}
            >
                {modulesData.map((mod, index) => (
                    <SwiperSlide key={mod.id} className={`!w-[217.6px] ${activeModuleId === mod.id ? 'is-active' : ''}`}>
                        <div className="relative w-[180px] h-full flex flex-col justify-end cursor-pointer group"
                             onClick={() => handleSlideClick(mod, index)}>
                            <div className="relative w-full pb-2">
                                <div className="block-container">
                                    <div className="block-content">
                                        {mod.title}
                                    </div>
                                </div>
                                <div className="robot-wrapper">
                                    <img 
                                        src="public/assets/modules/robo.png" 
                                        onError={(e) => e.target.style.display='none'} 
                                        alt="" 
                                        className="robot-img" 
                                    />
                                </div>
                            </div>
                            <div className="base-line"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

        {/* --- GRID DE SUBMÓDULOS --- */}
        <div className="w-full bg-slate-900/50 border-t border-slate-800 min-h-[400px] py-12 relative z-40 mt-6">
            <div className="max-w-6xl mx-auto px-6" id="submodules-section">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <CirclesThreePlus size={32} className="text-blue-500" weight="fill" />
                            <span>{searchResults ? "Resultados da Busca" : activeModuleData?.title}</span>
                        </h3>
                        <p className="text-slate-400 mt-2 text-sm">Conteúdo programático completo.</p>
                    </div>
                    <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-xs font-semibold border border-blue-900/50">
                        <span>{statsSubmodules}</span> Submódulos Disponíveis
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayingSubmodules.length === 0 ? (
                        <p className="col-span-full text-center text-slate-500">Nenhum conteúdo encontrado.</p>
                    ) : (
                        displayingSubmodules.map((sub, idx) => (
                            <a 
                                key={idx} 
                                href={sub.link || "#"} // Lê o link do data.js
                                // target="_blank" // Tire esse comentário se quiser abrir em nova aba
                                // rel="noopener noreferrer" // Segurança para nova aba
                                className="submodule-card rounded-xl p-5 relative overflow-hidden group cursor-pointer block text-left"
                                onClick={() => setLastSession({
                                    moduleId: activeModuleId,
                                    submoduleIndex: idx,
                                    title: sub.title
                                })}
                            >
                                <img 
                                    src={`public/assets/wallpapers/mod-${activeModuleId}-sub-${idx}.png`} 
                                    className="card-bg-image" 
                                    alt="Background"
                                    onError={(e) => {
                                        e.target.src = `https://source.unsplash.com/featured/?medical,abstract&sig=${idx}`
                                    }}
                                />
                                <div className="card-overlay"></div>
                                
                                <div className="card-content-wrapper">
                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <span className="text-[10px] font-bold text-white bg-blue-600/80 px-2 py-0.5 rounded uppercase tracking-wider">
                                            {`SUBMÓDULO ${idx + 1}`}
                                        </span>
                                    </div>
                                    
                                    <div className="play-overlay">
                                       <Play size={32} weight="fill" color="white" />
                                    </div>
                                    
                                    <div className="mt-auto relative z-10">
                                        <h4 className="text-lg font-bold text-white mb-1 leading-tight drop-shadow-md group-hover:text-blue-400 transition-colors">
                                            {sub.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-slate-300 text-xs line-clamp-1 opacity-80 w-2/3">{sub.desc}</p>
                                            <div className="flex items-center gap-1 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                                                <Clock weight="fill" /> 
                                                <span>{sub.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* =================================================================================
          RODAPÉ (FOOTER)
      ================================================================================== */}
      <footer className="bg-[#0b1121] border-t border-slate-800 pt-10 pb-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6 text-sm text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Suporte</a>
                    <a href="#" className="hover:text-white transition-colors">Termos</a>
                    <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                </div>
                
                <div className="text-center">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Medicina JVS
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Excelência em Preparação Médica</p>
                </div>
                
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                        <InstagramLogo size={20} weight="fill" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                        <YoutubeLogo size={20} weight="fill" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                        <LinkedinLogo size={20} weight="fill" />
                    </a>
                </div>
            </div>
            
            <div className="border-t border-slate-800/50 mt-8 pt-4 text-center text-xs text-slate-600">
                &copy; 2025 MedCof USA. Todos os direitos reservados.
            </div>
        </div>
      </footer>
    </div>
  );
}

// Componente StatCard
function StatCard({ label, value, isPurple = false }) {
    return (
        <div className={`
            bg-white/5 backdrop-blur-md 
            border border-white/10 
            rounded-3xl p-6 
            flex flex-col items-center justify-center 
            transition cursor-pointer 
            hover:bg-white/10 hover:-translate-y-1 
            group/card
        `}>
            <div className={`flex items-center justify-center gap-3 mb-4 ${isPurple ? 'text-blue-400' : 'text-slate-300'} group-hover/card:text-white`}>
                 <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-4xl font-bold text-white">
                {value}
            </div>
        </div>
    );
}

export default App;