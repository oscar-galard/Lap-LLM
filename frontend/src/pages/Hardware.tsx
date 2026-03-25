import { useState, ChangeEvent } from 'react';

interface HardwareSpecs {
  cpu_model: string;
  total_ram: number;
  used_ram: number;
  free_ram: number;
  os: string;
  free_storage: number;
  gpu_model: string;
  is_dual_channel: boolean;
}

function Hardware() {
  const [specs, setSpecs] = useState<Specs | null>(null);

  const handlePaste = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const rawText = e.target.value;

    // Helper function to extract data using Regex
    const ramMatch = rawText.match(/RAM:\s*(\d+)\/(\d+)\s*\((\d+)\s*free\)/);
    
    // 2. Extract Storage (removing the 'G' or 'M' suffix to get a number)
    const storageMatch = rawText.match(/Disk free:\s*(\d+)/);

    // 3. Determine Dual Channel boolean
    const isDual = rawText.includes("Detected via SMBIOS");

    const parsedSpecs: HardwareSpecs = {
      // Use .match()[1] to get the captured group, or fallback values
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

  const copyCommand = () => {
    const command = "curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e";
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold underline">Hardware Specs</h1>
      <p>Ejecuta el siguiente script en tu Laptop</p>
      <div className="flex items-center gap-2 my-4">
        <span className="cursor-pointer" onClick={copyCommand}>📋</span>
        <code className="bg-gray-100 p-1 rounded text-sm">
          curl -s https://raw.githubusercontent.com/oscar-galard/Lap-LLM/main/get_hostInfo.sh | bash -e
        </code>
      </div>

      <textarea 
        placeholder="Pega aquí la salida del script" 
        className="border border-gray-300 rounded px-3 py-2 w-full"
        onChange={handlePaste}
      />

      {/* Displaying the saved values */}
      {specs && (
	  <pre className="mt-4 p-4 bg-gray-800 text-green-400 rounded text-xs">
	      {JSON.stringify(specs, null, 2)}
	  </pre>
      )}
    </div>
  );
}

export default Hardware;
