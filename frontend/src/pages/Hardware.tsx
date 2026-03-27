import { useState, type ChangeEvent } from 'react';
import { type HardwareSpecs, sendHardwareSpecs } from '../api-conn/requests';
import ReactMarkdown from 'react-markdown';
import { TypeAnimation } from 'react-type-animation';

interface BackendResponse {
  message: string;
  memory_info: string;
  recommendations: string;
}

function Hardware() {
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [recommendations, setRecommendations] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handlePaste = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const rawText = e.target.value;

    if (!rawText.trim()) {
      setSpecs(null);
      setMessage('');
      return;
    }

    // Prevención básica de inyección: limitar longitud
    if (rawText.length > 2000) {
      setMessage("Error: El texto pegado es demasiado largo. Posible intento de inyección.");
      setSpecs(null);
      return;
    }

    // Validación básica de formato esperado
    if (!rawText.includes("CPU:") || !rawText.includes("RAM:")) {
      setMessage("Error: Formato incorrecto. Asegúrate de pegar la salida completa del script.");
      setSpecs(null);
      return;
    }

    const ramMatch = rawText.match(/RAM:\s*(\d+)\/(\d+)\s*\((\d+)\s*free\)/);
    const storageMatch = rawText.match(/Disk free:\s*(\d+)/);
    const isDual = /Dual.*Channel.*detected/i.test(rawText);

    // Sanear cadenas de texto (limitar longitud)
    const sanitizeString = (str: string | undefined, defaultVal: string) => {
      if (!str) return defaultVal;
      const cleanStr = str.trim().substring(0, 100); // Limitar a 100 caracteres
      return cleanStr || defaultVal;
    };

    const parsedSpecs: HardwareSpecs = {
      cpu_model: sanitizeString(rawText.match(/CPU:\s*(.*)/)?.[1], "Unknown CPU"),
      used_ram: ramMatch ? Math.max(0, parseInt(ramMatch[1], 10)) : 0,
      total_ram: ramMatch ? Math.max(0, parseInt(ramMatch[2], 10)) : 0,
      free_ram: ramMatch ? Math.max(0, parseInt(ramMatch[3], 10)) : 0,
      os: sanitizeString(rawText.match(/OS:\s*(.*)/)?.[1], "Unknown OS"),
      free_storage: storageMatch ? Math.max(0, parseInt(storageMatch[1], 10)) : 0,
      gpu_model: sanitizeString(rawText.match(/GPU:\s*(.*)/)?.[1], "Unknown GPU"),
      is_dual_channel: isDual
    };

    // Validaciones de valores sospechosos
    if (parsedSpecs.total_ram === 0 || parsedSpecs.cpu_model === "Unknown CPU") {
      setMessage("Advertencia: No se pudieron extraer algunos datos clave (RAM o CPU).");
    } else if (parsedSpecs.total_ram > 1024 * 1024) { // Suponiendo MB, 1TB es exagerado
      setMessage("Advertencia: Los valores de RAM parecen inusualmente altos.");
    } else if (parsedSpecs.free_storage > 500000) { // Suponiendo GB, 500TB es exagerado
      setMessage("Advertencia: El almacenamiento parece inusualmente alto.");
    } else {
      setMessage(""); // Limpiar mensaje si todo parece bien
    }

    setSpecs(parsedSpecs);
    console.log("Ready for Backend:", parsedSpecs);
  };

  const handleSendToBackend = async () => {
    if (!specs) {
      setMessage('Pegar la salida del Script!');
      return;
    }

    setIsSending(true);
    setMessage('');
    setRecommendations('');

    try {
      const response = await sendHardwareSpecs(specs);
      const data: BackendResponse = await response.json();
      setMessage(`Enviado! ${data.message}`);

      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setShowModal(true);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const copyCommand = () => {
    const command = "curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e";
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="p-4 relative min-h-screen bg-transparent text-green-400 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-green-400 border-b border-green-800 pb-2">
          <TypeAnimation
            sequence={['Hardware Specs', 1000]}
            speed={50}
            cursor={false}
          />
        </h1>

        <div className="mb-6 p-4 bg-gray-900 border border-green-800 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <p className="text-green-300 mb-3 min-h-[1.5em]">
            <TypeAnimation
              sequence={[ 1000, 'Copia y ejecuta el siguiente script en tu Laptop', 1000]}
              speed={70}
              cursor={true}
            />
          </p>

          <div className="flex items-center gap-3 my-4 group">
            {/* Contenedor del Botón Neón */}
            <div className="relative p-[2px] overflow-hidden rounded-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform" 
                 onClick={copyCommand}>
              
              {/* Capa 1: El Brillo Rotativo (Luz Neón 80s) */}
              <div className="absolute inset-[-1000%] animate-glow-rotate bg-[conic-gradient(from_90deg_at_50%_50%,#000_0%,#003300_40%,#00FF00_50%,#003300_60%,#000_100%)]"></div>

              {/* Capa 2: Fondo del Botón (Crea el efecto de borde fino) */}
              <div className="relative flex items-center justify-center bg-gray-900 rounded-[6px] px-3 py-2 w-full h-full">
                <svg 
                  className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                <span className="ml-2 text-xs font-mono font-bold text-green-400 uppercase tracking-widest hidden group-hover:block">
                  Copy
                </span>
              </div>
            </div>

            {/* El Comando (Terminal Style) */}
            <code className="relative flex-1 bg-black/80 text-green-300 p-3 rounded border border-green-900/50 font-mono text-xs overflow-x-auto shadow-[inset_0_0_10px_rgba(0,255,0,0.05)]">
              <span className="text-green-600 mr-2">$</span>
              curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e
            </code>
          </div>
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Pega aquí la salida del script"
            className="w-full font-mono text-sm bg-gray-900 text-green-300 border border-green-700 rounded-lg p-4 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors resize-none"
            rows={8}
            onChange={handlePaste}
          />
        </div>

        <div className="mb-6">
          <button
            onClick={handleSendToBackend}
            disabled={!specs || isSending}
            className={`px-6 py-3 rounded font-bold transition-all duration-200 shadow-[0_0_15px_rgba(34,197,94,0.2)] ${
              !specs || isSending
                ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                : 'bg-green-900 hover:bg-green-800 text-green-100 border border-green-500 hover:border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]'
            }`}
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">█</span> Enviando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">█</span> Analizar
              </span>
            )}
          </button>

          {message && (
            <div className={`mt-4 p-4 rounded font-medium border ${
              message.includes('Error')
                ? 'bg-red-900/30 text-red-300 border-red-700'
                : 'bg-green-900/30 text-green-300 border-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>

        {specs && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-green-500 hover:text-green-300 font-medium flex items-center gap-2">
              <span className="animate-pulse">▶</span> Ver RAW JSON 
            </summary>
            <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto shadow-inner border border-green-800">
              {JSON.stringify(specs, null, 2)}
            </pre>
          </details>
        )}

        {/* Terminal/Hacker Style Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-950 border-2 border-green-500 rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col shadow-[0_0_30px_rgba(34,197,94,0.3)] relative overflow-hidden">
              {/* Scanline effect overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-20"></div>

              <div className="flex justify-between items-center p-3 border-b-2 border-green-800 bg-gray-900 z-20">
                <h2 className="text-green-400 font-mono text-lg font-bold flex items-center gap-2">
                  <span className="animate-pulse text-green-500">█</span> SYS_RECOMENDACIONES.exe
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-green-600 hover:text-green-300 hover:bg-green-900/50 px-2 py-1 rounded transition-colors font-mono font-bold"
                >
                  [ CERRAR ]
                </button>
              </div>

              <div className="p-6 overflow-y-auto font-mono text-sm z-20 custom-scrollbar bg-gray-950">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-green-400 mt-5 mb-3 uppercase tracking-wider" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold text-green-400 mt-6 mb-3 border-b border-green-800 pb-2 uppercase tracking-wide flex items-center gap-2 before:content-['>'] before:text-green-600" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-green-300 mt-4 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-green-200 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-none pl-4 mb-4 space-y-2 text-green-200" {...props} />,
                    li: ({node, ...props}) => <li className="relative pl-5 before:content-['[*]'] before:absolute before:left-0 before:text-green-600" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-green-400 bg-green-900/30 px-1 rounded" {...props} />,
                    em: ({node, ...props}) => <em className="italic text-green-300" {...props} />,
                    code: ({node, ...props}) => <code className="bg-green-950 text-green-300 px-1.5 py-0.5 rounded border border-green-800 font-mono text-xs shadow-[0_0_10px_rgba(34,197,94,0.1)]" {...props} />,
                  }}
                >
                  {recommendations}
                </ReactMarkdown>
              </div>

              <div className="p-3 border-t-2 border-green-800 bg-gray-900 z-20 flex justify-between items-center">
                <span className="text-green-600 text-xs font-mono animate-pulse">STATUS: READY</span>
                <button
                  onClick={() => {
                    try {
                      // Create a blob with the recommendations as markdown
                      const blob = new Blob([recommendations], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'recomendaciones-hardware.md';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error downloading file:', error);
                      alert('Error al descargar el archivo. Por favor, inténtelo de nuevo.');
                    }
                  }}
                  className="bg-green-900 hover:bg-green-700 text-green-100 px-6 py-1.5 rounded font-mono text-sm border border-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] font-bold"
                >
                  DESCARGAR .md
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hardware;
