export interface HardwareSpecs {
  cpu_model: string;
  total_ram: number;
  used_ram: number;
  free_ram: number;
  os: string;
  free_storage: number;
  gpu_model: string;
  is_dual_channel: boolean;
}

export const sendHardwareSpecs = async (specs: HardwareSpecs): Promise<Response> => {
  const response = await fetch('http://localhost:8000/hardware-specs/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(specs),
  });

  if (!response.ok) {
    throw new Error(`Error al enviar Specs: ${response.statusText}`);
  }

  return response;
};
