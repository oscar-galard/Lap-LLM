import { TypeAnimation } from 'react-type-animation';

const Terminos = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-400 border-b border-green-800 pb-2 flex items-center gap-3">
        <span className="text-xl">📋</span>
        <TypeAnimation
          sequence={['Terminos y Condiciones', 1000]}
          speed={50}
          cursor={false}
        />
      </h1>

      <div className="space-y-6 text-green-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
            <span>✅</span> Consentimiento de Datos
          </h2>
          <p className="mb-4">
            Al utilizar esta aplicación, usted reconoce y acepta que los datos de su hardware serán recolectados y procesados por un modelo de lenguaje de gran tamaño (LLM) con el propósito de generar recomendaciones personalizadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
            <span>🔒</span> Privacidad y Seguridad
          </h2>
          <p className="mb-4">
            Sus datos de hardware se envían de forma segura a través de conexiones cifradas. No almacenamos información personal identificable ni utilizamos sus datos para fines distintos a la generación de recomendaciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
            <span>🔄</span> Uso de la Información
          </h2>
          <p className="mb-4">
            La información recolectada se utiliza exclusivamente para analizar su configuración de hardware y proporcionarle recomendaciones específicas sobre cómo optimizarla para ejecutar modelos de IA locales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
            <span>📝</span> Aceptación de Términos
          </h2>
          <p className="mb-4">
            Al continuar usando este servicio, usted acepta estos términos y condiciones. Si no está de acuerdo con estos términos, por favor deje de usar este servicio.
          </p>
        </section>

        <section className="border-t border-green-800/50 pt-6 mt-8">
          <p className="text-green-500 italic">
            "Al usar esta página, el usuario está de acuerdo con que los datos de su hardware son enviados a un LLM para análisis."
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terminos;