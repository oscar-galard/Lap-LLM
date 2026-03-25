import { useState, type ChangeEvent } from 'react';
import { type HardwareSpecs, sendHardwareSpecs } from '../api-conn/requests';
import ReactMarkdown from 'react-markdown';

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
    const ramMatch = rawText.match(/RAM:\s*(\d+)\/(\d+)\s*\((\d+)\s*free\)/);
    const storageMatch = rawText.match(/Disk free:\s*(\d+)/);
    const isDual = rawText.includes("Detected via SMBIOS");
    
    const parsedSpecs: HardwareSpecs = {
      cpu_model: rawText.match(/CPU:\s*(.*)/)?.[1]?.trim() || "Unknown CPU",
      used_ram: ramMatch ? parseInt(ramMatch[1], 10) : 0,
      total_ram: ramMatch ? parseInt(ramMatch[2], 10) : 0,
      free_ram: ramMatch ? parseInt(ramMatch[3], 10) : 0,
      os: rawText.match(/OS:\s*(.*)/)?.[1]?.trim() || "Unknown OS",
      free_storage: storageMatch ? parseInt(storageMatch[1], 10) : 0,
      gpu_model: rawText.match(/GPU:\s*(.*)/)?.[1]?.trim() || "Unknown GPU",
      is_dual_channel: isDual
    };

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
      setMessage(`Success! ${data.message}`);
      
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
    <div className="p-4 relative">
      <h1 className="text-3xl font-bold underline mb-4">Hardware Specs</h1>
      <p>Copia y ejecuta el siguiente script en tu Laptop</p>
      
      <div className="flex items-center gap-2 my-4">
        <span className="cursor-pointer" onClick={copyCommand}>📋</span>
        <code className="bg-gray-100 p-1 rounded text-sm">
          curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e
        </code>
      </div>

      <textarea
        placeholder="Pega aquí la salida del script"
        className="border border-gray-300 rounded px-3 py-2 w-full font-mono text-sm"
        rows={8}
        onChange={handlePaste}
      />

      <div className="mt-4">
        <button
          onClick={handleSendToBackend}
          disabled={!specs || isSending}
          className={`px-4 py-2 rounded font-bold transition-colors ${
            !specs || isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          }`}
        >
          {isSending ? 'Enviando...' : 'Analizar'}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded font-medium ${
            message.includes('Error') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'
          }`}>
            {message}
          </div>
        )}
      </div>

      {specs && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">Ver JSON crudo</summary>
          <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg text-xs overflow-auto shadow-inner border border-gray-700">
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
                onClick={() => setShowModal(false)}
                className="bg-green-900 hover:bg-green-700 text-green-100 px-6 py-1.5 rounded font-mono text-sm border border-green-500 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] font-bold"
              >
                ACEPTAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hardware;
