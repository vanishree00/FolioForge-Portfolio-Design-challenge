import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import profileImg from './profile.jpeg';



// --- THREE.JS INTERACTIVE 3D ENVIRONMENT COMPONENT ---
const ThreeBackground = ({ activeSection, mousePos }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let scene, camera, renderer, particles, sphere, ring, torus;

    const container = mountRef.current;
    if (!container) return;

    // Use window inner dimensions to ensure immediate sizing
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (typeof THREE !== 'undefined') {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 30;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create Particle Field
      const count = 1200;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 80;
        positions[i + 1] = (Math.random() - 0.5) * 80;
        positions[i + 2] = (Math.random() - 0.5) * 80;

        colors[i] = 0.5 + Math.random() * 0.5;
        colors[i + 1] = 0.2 + Math.random() * 0.5;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Core Geometric AI Representation
      const sphereGeo = new THREE.IcosahedronGeometry(4.5, 2);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      const ringGeo = new THREE.TorusGeometry(12, 0.1, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      scene.add(ring);

      const torusGeo = new THREE.TorusGeometry(16, 0.06, 16, 100);
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.y = Math.PI / 4;
      scene.add(torus);

      // Active Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Continuous rotation speeds
        particles.rotation.y += 0.0012;
        particles.rotation.x += 0.0005;

        sphere.rotation.x += 0.006;
        sphere.rotation.y += 0.008;

        ring.rotation.z += 0.005;
        torus.rotation.x -= 0.004;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
 const [userPhoto, setUserPhoto] = useState<string>(profileImg)
  const [selectedProject, setSelectedProject] = useState(null);
  const [customCursor, setCustomCursor] = useState({ x: 0, y: 0, hovered: false });
  const [activeSkillCategory, setActiveSkillCategory] = useState('all');

  const mouseRef = useRef({ x: 0, y: 0 });
mouseRef.current = mousePos;

  // Interactive 3D Mouse Movement Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
      setCustomCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  

  // Sections navigation data
  const navItems = [
    { id: 'hero', label: 'Universe Core', icon: '🌌' },
    { id: 'about', label: 'Story & Journey', icon: '🚀' },
    { id: 'skills', label: 'Tech Constellation', icon: '⚡' },
    { id: 'projects', label: 'Project Holo-Lab', icon: '💎' },
    { id: 'achievements', label: 'Milestones', icon: '🏆' },
    { id: 'certifications', label: 'Certs Vault', icon: '📜' },
    { id: 'beyond', label: 'Beyond Tech', icon: '🎭' },
    { id: 'contact', label: 'Signal Link', icon: '📡' },
  ];
  

  // Detailed Projects Data
  const projectsData = [
    {
      id: 'travel-pilot',
      number: '01',
      title: 'TRAVEL PILOT',
      tagline: 'AI-Powered Intelligent Travel Planner',
      description: 'An AI-powered travel planning application that helps users create personalized travel itineraries, explore destinations, and organize trips based on their preferences, dates, and budget.',
      technologies: ['Python', 'Streamlit', 'Gemini API', 'Custom CSS'],
      contributions: [
        'Independently designed and architected the application from scratch.',
        'Integrated Gemini API for real-time generative itinerary synthesis.',
        'Crafted custom CSS Streamlit UI for an intuitive user journey.',
        'Implemented persistent saved-plan functionality and budget estimations.',
      ],
      status: 'Funcitonal, its in deployment stage',
      github: 'https://github.com/vanishree00/Travel-pilot',
      demo: 'https://lnkd.in/p/gRCayz5f',
      visualTheme: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40',
      icon: '✈️',
    },
    {
      id: 'inclusionlens',
      number: '02',
      title: 'INCLUSIONLENS AI',
      tagline: 'AI for an Inclusive Workforce',
      description: 'An innovative AI-driven concept focused on promoting workplace inclusivity by identifying potential accessibility gaps and proposing intelligent recommendations for a more inclusive work environment.-SAP Hackfest 2026',
      technologies: ['React.js', 'Tailwind CSS', 'Generative AI', 'Accessibility API' ,'-->future intergration'],
      team: 'Team LumiLens – MSRUAS',
      contributions: [
        'Contributed to the ideation and conceptualization of an AI-driven inclusive workforce solution, focusing on identifying workplace accessibility gaps and proposing features to promote inclusivity.',
        'Delivered the live pitch.',
        'Collaborated on prompt strategy for unbiased candidate assessment models.',
      ],
      status: 'SAP Hackfest Bengaluru 2026 idea',
      github: 'https://github.com/vanishree00/InclusionLens-AI',
    
      visualTheme: 'from-purple-500/20 to-pink-600/20 border-purple-500/40',
      icon: '👁️',
    },
    {
      id: 'palash',
      number: '03',
      title: 'PALASH',
      tagline: 'AI-Powered Multilingual Translation Application',
      description: 'An Android-based language translation application designed to break communication barriers by making information more accessible across different languages.I contributed to frotend part. Developed as part of the SIH 2026 project.',
      technologies: ['HTML5/CSS3', 'Jetpack compose', 'Kotlin', 'AI Translation Node'],
      team: 'Team Nexora',
      achievement: 'SIH 2026 College-Level Qualifier (MSRUAS)',
      contributions: [
        'Prototyped interactive multilingual frontend layout components.',
        'Designed real-time visual feedback indicators for dynamic dynamic language shifts.',
        'Engineered accessible layout structures for multi-script rendering.',
      ],
      status: 'SIH 2026 Qualified Project',
      github: 'https://github.com/niranjanamahendran2006-afk/palash-mtb-mle-bridge',
      demo: 'https://youtu.be/d5RqjKunTU4',
      visualTheme: 'from-amber-500/20 to-orange-600/20 border-amber-500/40',
      icon: '🌐',
    },
    {
      id: 'expense-tracker',
      number: '04',
      title: 'PERSONAL EXPENSE TRACKER',
      tagline: 'Simple Personal Expense Management Program',
      description: 'A simple expense-tracking application designed to record daily expenses, monitor spending habits, and help users manage their personal finances more effectively.',
      technologies: ['Python'],
      contributions: [
        'Designed and developed a simple expense-tracking program to record daily expenses, calculate total spending, and help users monitor their personal finances'
      ],
      status: 'Only the python program',
      github: 'https://github.com/vanishree00/personal-expense-tracker',
      
      visualTheme: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40',
      icon: '📊',
    },
  ];

  // Skills Data Array
  const skillsData = [
    { name: 'Python', category: 'prog', status: 'Proficient', icon: '🐍' },
    { name: 'Java', category: 'prog', status: 'Learning', icon: '☕' },
    { name: 'JavaScript', category: 'prog', status: 'Intermediate', icon: '🟨' },
    { name: 'HTML5 / CSS3', category: 'front', status: 'Advanced', icon: '🌐' },
    { name: 'React.js', category: 'front', status: 'Learning', icon: '⚛️' },
    { name: 'Tailwind CSS', category: 'front', status: 'Learning', icon: '🎨' },
    { name: 'Generative AI Fundamentals', category: 'ai', status: 'Core Focus', icon: '🤖' },
    { name: 'LLM Architectures', category: 'ai', status: 'Active Study', icon: '🧠' },
    { name: 'Prompt Engineering', category: 'ai', status: 'Learning', icon: '💬' },
    { name: 'Gemini API', category: 'ai', status: 'Hands-on', icon: '✨' },
    { name: 'Streamlit Framework', category: 'ai', status: 'Beginner', icon: '🎈' },
    { name: 'Full Stack AI Engineering', category: 'ai', status: 'Target Goal', icon: '🎯' },
    { name: 'Git & GitHub', category: 'tools', status: 'Proficient', icon: '🐙' },
    { name: 'VS Code', category: 'tools', status: 'Daily Driver', icon: '💻' },
    { name: 'Google AI Studio', category: 'tools', status: 'Proficient', icon: '🔮' },
    { name: 'Hugging Face Ecosystem', category: 'tools', status: 'Exploring', icon: '🤗' },
  ];

  // Achievements Data
  const achievements = [
    {
      title: 'Naukri Campus Young Turks 2026',
      subtitle: 'Top Percentile Qualifier',
      detail: 'Scored an outstanding 92.22 percentile in Round 1, successfully qualifying for Skill Assessment Round 2.',
      badge: '92.22 Percentile',
      icon: '🔥',
    },
    {
      title: 'SAP Hackfest Bengaluru 2026',
      subtitle: 'Hackathon Contender',
      detail: 'Represented MSRUAS as part of Team LumiLens, designing AI solutions focused on workforce inclusion.',
      badge: 'Hackfest regional round',
      icon: '🚀',
    },
    {
      title: 'Smart India Hackathon (SIH) 2026',
      subtitle: 'College-Level Qualifier',
      detail: 'Qualified(Team NEX_ORA) through internal round at MSRUAS with Project PALASH (Multilingual AI Translation).',
      badge: 'Internal Qualifier',
      icon: '💡',
    },
    {
      title: 'Agentic AI Hackathon – Product Space',
      subtitle: '2-Day Intensive Build',
      detail: 'Participated in a high-intensity 48-hour hackathon, designing and prototyping autonomous AI workflows.',
      badge: 'Hackathon Builder',
      icon: '⚡',
    },
    {
      title: 'National Entrepreneurship Challenge (NEC) 2026',
      subtitle: 'National Top 150 Rank',
      detail: 'Achieved Team Rank 150 across India with Team Couch Catalyst through strategic execution.',
      badge: 'Rank 150 India',
      icon: '🌟',
    },
  ];

  // Certifications Data
  const certifications = [
    {
      title: 'AWS Educate',
      name: 'Introduction to Generative AI',
      issuer: 'Amazon Web Services',
      desc: 'Foundational concepts of GenAI models, foundation model fine-tuning, and cloud AI services.',
      link: 'https://lnkd.in/p/ggMJDVNS',
    },
    {
      title: 'Jio Institute (JIOPC)',
      name: 'AI Fundamentals',
      issuer: 'Jio Institute',
      desc: 'Core principles of machine intelligence, data pipelines, and practical AI applications.',
      link: 'https://www.linkedin.com/in/vanishree-malli-8372a8389/overlay/Certifications/477222245/treasury/?profileId=ACoAAF-eDKsBwTKz5z3OcGXdGW-Lztf2ODDnAKQ&lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BgdNx3D7FRayI%2BsRDZwpDDg%3D%3D',
    },
    {
      title: 'Anthropic Academy',
      name: 'Claude 101',
      issuer: 'Anthropic',
      desc: 'Mastery in Claude prompt design, context management, and safety protocols.',
      link: 'https://lnkd.in/p/gurxXJgM',
    },
    {
      title: 'BE10x AI Mastery',
      name: 'Generative AI Workshop',
      issuer: 'BE10x',
      desc: 'Applied AI toolsets, developer productivity frameworks, and workflow automation.',
      link: 'https://lnkd.in/p/gq88FsWM',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#070714] text-slate-100 font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Three.js Background Canvas */}
      <ThreeBackground activeSection={activeSection} mousePos={mousePos} />

      {/* Custom Glowing Cursor Tracker */}
      <div
        className="fixed w-8 h-8 rounded-full border-2 border-cyan-400/60 pointer-events-none z-50 transition-transform duration-75 ease-out transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        style={{ left: `${customCursor.x}px`, top: `${customCursor.y}px` }}
      />
      <div
        className="fixed w-2 h-2 rounded-full bg-pink-500 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#ec4899]"
        style={{ left: `${customCursor.x}px`, top: `${customCursor.y}px` }}
      />

      {/* --- TOP ORBITAL INTERACTIVE NAVIGATION --- */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-1 sm:gap-2 shadow-2xl shadow-purple-900/30 max-w-[95vw] overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* MAIN CONTENT WRAPPER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HERO SECTION ================= */}
        <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative pt-24 pb-16 px-4">
          {/* Spatial Holographic Avatar Container */}
          <div className="relative group mb-8">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-slate-950 flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
              {userPhoto ? (
                <img src={userPhoto} alt="Vanishree Malli" className="w-full h-full object-cover rounded-full" style={{ objectPosition: 'center 5%' }} />
              ) : (
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="text-4xl mb-1">👩‍💻</div>
                  <p className="text-[11px] text-cyan-300 font-mono leading-tight mb-2">
                    Upload Photograph
                  </p>
                  
                </div>
              )}
            </div>

            {/* Orbiting Tech Badges */}
            <div className="absolute -top-2 -right-2 bg-slate-950/90 border border-purple-400/60 text-purple-200 text-[10px] sm:text-xs font-mono px-3 py-1 rounded-full shadow-lg backdrop-blur-md animate-bounce">
              Future AI Engineer 🎯
            </div>
            <div className="absolute -bottom-2 -left-2 bg-slate-950/90 border border-cyan-400/60 text-cyan-200 text-[10px] sm:text-xs font-mono px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              MSRUAS 2029 🎓
            </div>
          </div>

          {/* High-Contrast Glassmorphic Card Container for Typography */}
          <div className="text-center max-w-4xl mx-auto space-y-5 bg-slate-950/70 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10">
            
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/40 bg-cyan-950/50 text-cyan-300 text-xs sm:text-sm font-mono tracking-widest uppercase shadow-md">
              ✦ THE WORLD OF VANISHREE • IDEAS INTO INTELLIGENCE ✦
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
                VANISHREE MALLI
              </span>
            </h1>

            <p className="text-base sm:text-2xl text-cyan-300 font-semibold italic max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              "Building Tomorrow, One Intelligent Idea at a Time."
            </p>

            <div className="inline-block px-4 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs sm:text-base font-mono font-medium tracking-wide max-w-xl mx-auto shadow-inner">
              Aspiring Full Stack AI Engineer & Generative AI Specialist
            </div>

            <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5 shadow-inner font-normal">
              Curiosity leads my way. Creativity shapes my ideas. Technology is how I bring them to life.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-3.5 justify-center items-center">
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/40 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 border border-white/30"
              >
                Explore My World 🚀
              </button>
              
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-400/50 font-bold text-xs sm:text-sm backdrop-blur-md hover:scale-105 transition-all duration-300 shadow-md"
              >
                View My Projects 💎
              </button>

              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-pink-300 border border-pink-400/50 font-bold text-xs sm:text-sm backdrop-blur-md hover:scale-105 transition-all duration-300 shadow-md"
              >
                Connect With Me 📡
              </button>
            </div>
          </div>

          {/* Scroll Down Visual Indicator */}
          <div className="mt-8 flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition cursor-pointer"
               onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-300 uppercase bg-slate-900/80 px-3 py-1 rounded-full border border-cyan-500/30">Scroll to Discover</span>
            <div className="w-5 h-9 rounded-full border-2 border-cyan-400/80 p-1 flex justify-center bg-slate-950/60">
              <div className="w-1.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ================= ABOUT ME (INTERACTIVE STORYTELLING) ================= */}
        <section id="about" className="py-24 border-t border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">// SPATIAL JOURNEY</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">THE WORLD OF VANISHREE</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Computer Science & Engineering Undergraduate passionate about GenAI, intelligent software architectures, and human-centric innovation.
            </p>
          </div>

          {/* Grid Layout: Profile & Interactive Semester SGPA Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Story Card */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-purple-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <span>🧠</span> Curiosity Driven • Technology Empowered
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                I am currently pursuing my <strong>B.Tech in Computer Science and Engineering</strong> at 
                <span className="text-purple-300 font-semibold"> M. S. Ramaiah University of Applied Sciences (MSRUAS), Bengaluru</span> (2025–2029).
              </p>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Currently in my second year, my academic focus centers on <strong>Artificial Intelligence, Generative AI, and Full Stack Architecture</strong>. I thrive on translating abstract ideas into intuitive, high-impact digital products.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Beyond coding, I am deeply involved in public speaking, anchoring major events, creative expression, and collaborative leadership—bringing strong communication and storytelling to technology engineering.
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-cyan-400 font-mono text-xs font-bold">FOCUS</div>
                  <div className="text-slate-200 text-xs mt-1">Generative AI & LLMs</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-purple-400 font-mono text-xs font-bold">COLLEGE</div>
                  <div className="text-slate-200 text-xs mt-1">MSRUAS Bengaluru</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-pink-400 font-mono text-xs font-bold">PASSION</div>
                  <div className="text-slate-200 text-xs mt-1">Anchoring & Tech</div>
                </div>
              </div>
            </div>

            {/* Academic Matrix & Future SGPA Vault */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-cyan-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative shadow-2xl">
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <span>🎓</span> Academic Trajectory & Performance
              </h3>
              
              <div className="space-y-3">
                {/* Completed Semesters */}
                <div className="p-3.5 bg-cyan-950/40 rounded-2xl border border-cyan-500/40 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 block">SEMESTER 1</span>
                    <span className="text-sm font-semibold text-white">EM1, CHEMISTRY, INTRODUCTION TO CSE, KANNADA KALI</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-cyan-300">9.11</span>
                    <span className="text-[10px] text-cyan-400/80 block">SGPA</span>
                  </div>
                </div>

                <div className="p-3.5 bg-purple-950/40 rounded-2xl border border-purple-500/40 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono text-purple-400 block">SEMESTER 2</span>
                    <span className="text-sm font-semibold text-white">EM2, PHYSICS, COMMUNICATIVE ENGLISH, EVS, C PROGRAM, WORKSHOP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-bold text-purple-300">9.75</span>
                    <span className="text-[10px] text-purple-400/80 block">SGPA</span>
                  </div>
                </div>

                {/* Future Semesters Curiosity Vault */}
                <div className="pt-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Upcoming Academic Horizons</div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {['Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map((sem, idx) => (
                      <div key={sem} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-400/50 transition">
                        <span className="text-[10px] font-mono text-slate-400 block">{sem}</span>
                        <span className="text-xs font-mono text-cyan-400 animate-pulse">🔒 Target 9+</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= SKILLS (INTERACTIVE CONSTELLATION) ================= */}
       {/* ================= SKILLS ================= */}
<section id="skills" className="py-24 border-t border-white/10">
  {/* Glassmorphic Container to Ensure High Contrast Against Background */}
  <div className="max-w-4xl mx-auto bg-slate-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative z-10">
    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">// TECH MATRIX</span>
    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 drop-shadow-md">TECHNOLOGY CONSTELLATION</h2>
    <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2">
      Interactive node ecosystem showcasing technologies mastered and actively being explored.
    </p>

    {/* Category Filter Pills */}
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      {[
        { id: 'all', label: 'All Nodes' },
        { id: 'ai', label: 'AI & Generative AI' },
        { id: 'prog', label: 'Programming Languages' },
        { id: 'front', label: 'Frontend Development' },
        { id: 'tools', label: 'Tools & Ecosystem' },
      ].map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveSkillCategory(cat.id)}
          className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all ${
            activeSkillCategory === cat.id
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/10 hover:bg-white/20 text-slate-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  </div>

          {/* Interactive Constellation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {skillsData
              .filter((item) => activeSkillCategory === 'all' || item.category === activeSkillCategory)
              .map((skill, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md flex flex-col justify-between shadow-xl"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{skill.icon}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        skill.status === 'Learning' || skill.status === 'Exploring'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {skill.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ================= PROJECTS (4 INTERACTIVE 3D CASE STUDIES) ================= */}
        {/* ================= PROJECTS ================= */}
<section id="projects" className="py-24 border-t border-white/10">
  {/* Glassmorphic Container for Crystal-Clear Readability */}
  <div className="max-w-4xl mx-auto bg-slate-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative z-10">
    <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">// HOLO-LAB SHOWCASE</span>
    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 drop-shadow-md">FEATURED CASE STUDIES</h2>
    <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2">
      Four distinct technology implementations spanning GenAI, inclusive accessibility, multilingual translation, and software systems.
    </p>
  </div>

          {/* Projects Display Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className={`group relative rounded-3xl border bg-gradient-to-br ${project.visualTheme} p-6 sm:p-8 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] shadow-2xl flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-cyan-950/60 rounded-full border border-cyan-500/30">
                      PROJECT {project.number}
                    </span>
                    <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">
                      {project.icon}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-mono text-purple-300 mb-4">{project.tagline}</p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">{project.description}</p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Open Modal trigger */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wider uppercase border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/30"
                >
                  <span>Inspect Case Study</span>
                  <span>🔍</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ================= DEDICATED PROJECT DETAIL MODAL ================= */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedProject.icon}</span>
                <div>
                  <span className="text-xs font-mono text-cyan-400">PROJECT {selectedProject.number}</span>
                  <h3 className="text-2xl font-black text-white">{selectedProject.title}</h3>
                </div>
              </div>

              <p className="text-sm font-mono text-purple-300 mb-6">{selectedProject.tagline}</p>

              <div className="space-y-4 text-sm text-slate-300 mb-6">
                <div>
                  <h4 className="font-bold text-white mb-1 text-xs font-mono uppercase text-cyan-400">// Overview</h4>
                  <p className="leading-relaxed">{selectedProject.description}</p>
                </div>

                {selectedProject.team && (
                  <div>
                    <h4 className="font-bold text-white mb-1 text-xs font-mono uppercase text-cyan-400">// Team</h4>
                    <p className="font-mono text-purple-300">{selectedProject.team}</p>
                  </div>
                )}

                {selectedProject.achievement && (
                  <div>
                    <h4 className="font-bold text-white mb-1 text-xs font-mono uppercase text-cyan-400">// Achievement</h4>
                    <p className="font-mono text-amber-300">{selectedProject.achievement}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-white mb-2 text-xs font-mono uppercase text-cyan-400">// Key Contributions</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                    {selectedProject.contributions.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1 text-xs font-mono uppercase text-cyan-400">// Status</h4>
                  <p className="font-mono text-emerald-400">{selectedProject.status}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold border border-white/20 flex items-center gap-2 transition"
                >
                  <span>GitHub Repository 🐙</span>
                </a>
                <a
                  href={selectedProject.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
                >
                  <span>Live Demo / Prototype 🚀</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ================= ACHIEVEMENTS TIMELINE ================= */}
        <section id="achievements" className="py-24 border-t border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">// MILESTONE NEXUS</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">ACHIEVEMENTS & HACKATHONS</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Competitive hackathons, percentile scores, and national-level recognitions.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {achievements.map((item, index) => (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-3 bg-white/5 rounded-2xl border border-white/10">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <div className="text-xs font-mono text-amber-300 mb-1">{item.subtitle}</div>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-xl">{item.detail}</p>
                  </div>
                </div>

                <div className="whitespace-nowrap">
                  <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-inner">
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CERTIFICATIONS VAULT ================= */}
        {/* ================= CERTIFICATIONS ================= */}
<section id="certifications" className="py-24 border-t border-white/10">
  {/* Glassmorphic Container for Readability */}
  <div className="max-w-4xl mx-auto bg-slate-950/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative z-10">
    <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">// CREDENTIALS</span>
    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 drop-shadow-md">CERTIFICATIONS VAULT</h2>
    <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2">
      Verified credentials and technical proficiency certificates.
    </p>
  </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-400/50 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-xl group"
              >
                <div>
                  <div className="text-xs font-mono text-emerald-400 mb-2">{cert.issuer}</div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                    {cert.name}
                  </h3>
                  <div className="text-xs text-purple-300 font-semibold mb-3">{cert.title}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{cert.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500">VERIFIED</span>
                  <a 
    href={cert.link} 
    target="_blank" 
    rel="noreferrer" 
    className="text-emerald-400 text-xs font-mono hover:underline flex items-center gap-1"
  >
    📜 Certificate Link ↗
  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= BEYOND TECHNOLOGY ================= */}
        <section id="beyond" className="py-24 border-t border-white/10">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-pink-400 uppercase tracking-widest">// CREATIVE EXPRESSION</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">BEYOND TECHNOLOGY</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
              Public speaking, event hosting, and creative performance that enrich engineering leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Anchoring & Public Speaking',
                desc: 'Hosting institutional events, managing stage engagement, and delivering tech presentations with clarity and charisma.',
                icon: '🎙️',
              },
              {
                title: 'Event Coordination & Hosting',
                desc: 'Organizing collegiate activities, driving team synergy, and leading cross-functional creative initiatives.',
                icon: '🎪',
              },
              {
                title: 'Creative Arts & Expression',
                desc: 'Passion for singing, dancing, and artistic expression—bringing empathy and design intuition to technological solutions.',
                icon: '🎭',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-pink-500/50 backdrop-blur-xl transition-all duration-300 text-center shadow-xl group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CONTACT & SIGNAL LINK ================= */}
        <section id="contact" className="py-24 border-t border-white/10 mb-12">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900/90 to-purple-950/60 border border-purple-500/30 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center mb-10">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">// SIGNAL TRANSMISSION</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">
                "Every Great Idea Starts With a Connection."
              </h2>
              <p className="text-slate-300 text-sm mt-3">
                Reach out for collaborations, AI hackathons, or project inquiries.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert("Signal transmitted! Thank you for reaching out."); }} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <textarea
                rows={4}
                placeholder="Your Message / Transmission..."
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-purple-600/30 hover:scale-[1.01] transition-all"
              >
                Transmit Message 📡
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs font-mono text-slate-400">
              <a href="mailto:vanishreemalli@example.com" className="hover:text-cyan-400 transition">
                📧 Email: vanishreemalli2007@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/vanishree-malli-8372a8389/" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition">
                💼 LinkedIn: Vanishree Malli
              </a>
              <a href="https://github.com/vanishree00" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition">
                🐙 GitHub: vanishree00
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 text-center text-xs font-mono text-slate-400 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        <p>THE WORLD OF VANISHREE • Designed & Built by Vanishree Malli • MSRUAS Bengaluru</p>
      </footer>
    </div>
  );
}