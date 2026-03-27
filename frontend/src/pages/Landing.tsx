import { TypeAnimation } from 'react-type-animation'

function Landing() {

    return (
<div className="text-green-500 font-mono overflow-x-hidden min-h-screen">
      {/* Hero Section */}
      <main>
        <section className="min-h-screen flex items-center relative pt-20 px-6">
          {/* Scanline Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
            <div className="text-left">
              <div className="inline-block bg-green-900/30 text-green-400 border border-green-500/50 px-3 py-1 rounded-sm text-sm mb-6">
                STATUS: KERNEL_OPTIMIZED_V01
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 text-white leading-tight uppercase min-h-[120px] md:min-h-[160px]">
                <TypeAnimation
                  sequence={['~$ Libera el Poder de la IA en tu Laptop!', 1000]}
                  wrapper="span"
                  speed={50}
                  cursor={true}
                />
              </h1>
              <p className="text-xl mb-10 text-green-400/80 leading-relaxed border-l-2 border-green-500 pl-4">
                ¿Cansado de que te digan que necesitas gastar una fortuna para correr IA en tu laptop? <br />
                <span className="text-white">Hackeamos el límite de la VRAM</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/Hardware" className="px-10 py-4 bg-green-500 text-black text-xl font-bold rounded-sm hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center justify-center group">
                  <span className="mr-2">&gt;_</span> Analizar mi Hardware!
                </a>
              </div>
            </div>

            {/* Terminal Mockup Visual */}
            <div className="hidden md:block">
              <div className="bg-black border border-green-500/30 p-4 rounded-md shadow-2xl relative overflow-hidden">
                <div className="flex space-x-2 mb-4 border-b border-green-500/20 pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-white">$ echo "amdgpu ttm_pages_limit=4954522" &gt;&gt; .config</p>
                  <p className="text-green-500/70">[SUCCESS] UMA Buffer Expanded to 18.9GB</p>
                  <p className="text-white">$ ollama create Qwen3-30B-A3B -f Modelfile</p>
                  <p className="text-green-500 animate-pulse">Loading MoE Weights... [DONE]</p>
                  <p className="text-white mt-4">"Soberanía Digital detectada..."</p>
                </div>
                {/* Decoration: Matrix code vibe */}
                <div className="absolute top-0 right-0 p-2 opacity-10 text-[10px] pointer-events-none">
                  01010101<br/>11001100<br/>00110011
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* section problem and solution*/}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-green-500/20">
        <h2 className="text-3xl font-black mb-12 text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] flex items-center gap-4">
            <span className="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">✨</span> 
            <TypeAnimation 
              sequence={[ 2500, 'El Muro de la VRAM... y como lo derribamos', 1000]} 
              wrapper="span" 
              speed={50} 
              cursor={true} 
            />
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="border border-fuchsia-500/40 p-6 space-y-6 text-green-400/90 bg-black/90 leading-relaxed">
            <p>
              Las grandes corporaciones como <strong>Capsule Corp, el Team Rocket</strong> y <strong>OpenAI</strong> quieren que creas que la IA local es solo para élites con hardware premium y te dicen que una laptop sirve solo para ver tus videos favoritos de <b>Midudev y la Rosa de guadalupe</b> en Youtube, dejando como unico camino las suscripciones que cambian cada 3 segundos. <strong className="text-white">¡Es hora de recuperar tu hardware!</strong>
            </p>
            <p>
            Con <strong className="text-green-500 underline">Lap-LLM</strong>, usamos pura ingeniería y algebra marsupial sobre <strong>sistemas GNU/Linux</strong> para aplicar un hack <code className="bg-green-900/30 px-2 py-0.5 rounded text-white">[ "$igpu" == "amd" ] && amdttm || [ "$igpu" == "intel" ] && gtt</code>, que aprovecha como el <strong>kernel</strong> maneja la memoria. Básicamente, engañamos al sistema para que trate tu RAM como VRAM súper rápida creando un pool de memoria parecido al de las MAC.
            </p>
          </div>
          <div className="bg-green-950/20 border-l-4 border-green-500 p-8 flex items-center text-xl text-white shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
            "Es como darle una ametralladora a un tiburon!... ¡Esta Extremo!"
          </div>
        </div>
      </section>

      {/* Los "Superpoderes" (Pilares Técnicos con Labia) */}
      <section className="relative py-20 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/30 via-purple-950/80 to-black border-t-2 border-fuchsia-500/30 shadow-[inset_0_10px_30px_rgba(217,70,239,0.1)]">
        {/* Retro Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" style={{ perspective: '500px', transform: 'rotateX(60deg) scale(2.5)', transformOrigin: 'top center', opacity: 0.3 }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-black mb-12 text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] flex items-center gap-4">
            <span className="text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">✨</span> 
            <TypeAnimation 
              sequence={[ 6000, 'Tus Nuevos Superpoderes de IA Local', 1000]} 
              wrapper="span" 
              speed={50} 
              cursor={true} 
            />
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-fuchsia-500/40 p-6 bg-black/50 hover:bg-black/80 hover:border-cyan-400 transition-all duration-300 group shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-fuchsia-400">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Hack de Memoria</h3>
              <p className="text-fuchsia-200/70 text-sm">Olvida la BIOS. Si tienes RAM libre, tienes VRAM. Hasta <span className="text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">20GB+</span> para tus modelos.</p>
            </div>
            <div className="border border-fuchsia-500/40 p-6 bg-black/50 hover:bg-black/80 hover:border-cyan-400 transition-all duration-300 group shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-cyan-400">🧠</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">IA de Élite</h3>
              <p className="text-fuchsia-200/70 text-sm">Con modelos <span className="text-fuchsia-400 font-bold italic">Mixture-of-Experts</span> (MoE), es posible correr modelos mas capaces, manteniendo tu laptop fresca.</p>
            </div>
            <div className="border border-fuchsia-500/40 p-6 bg-black/50 hover:bg-black/80 hover:border-cyan-400 transition-all duration-300 group shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-fuchsia-400">🐧</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Source Optimized</h3>
              <p className="text-fuchsia-200/70 text-sm">Compilando desde el código fuente (<code className="text-cyan-400 text-xs bg-cyan-900/30 px-1 py-0.5 rounded">ROCm/HIP</code>) para exprimir cada ciclo de reloj de tu iGPU.</p>
            </div>
            <div className="border border-fuchsia-500/40 p-6 bg-black/50 hover:bg-black/80 hover:border-cyan-400 transition-all duration-300 group shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform text-cyan-400">🔒</div>
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Soberanía Total</h3>
              <p className="text-fuchsia-200/70 text-sm">Tus datos nunca salen de tu laptop. Sin Cloud, sin APIs, sin suscripciones. Tú eres el dueño.</p>
            </div>
            
            {/* Destacada Card RAG */}
            <div className="md:col-span-2 lg:col-span-2 border-2 border-cyan-400 p-8 bg-cyan-950/40 hover:bg-cyan-900/50 transition-all duration-300 group shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] backdrop-blur-md relative overflow-hidden flex flex-col justify-center animate-pulse-slow">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 opacity-80"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="text-5xl sm:text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]">🤖</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-3 text-cyan-300 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Sistema RAG Inteligente</h3>
                  <p className="text-fuchsia-100 text-lg leading-relaxed">
                    El verdadero tazo dorado. Utilizamos <strong className="text-fuchsia-400">RAG (Retrieval-Augmented Generation)</strong> para analizar un estudio basado en papers y documentos técnicos . El resultado: <strong className="text-cyan-400">Recomendaciones milimétricas y personalizadas</strong> basadas en la arquitectura exacta de tu hardware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

    </div>

    )
}

export default Landing
