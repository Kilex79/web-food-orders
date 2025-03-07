"use client";

interface DetailsProps {
  totalChickens: number;
  totalPotatoes: number;
  deliveredChickens: number;
  deliveredPotatoes: number;
  hornoP: number;
  hornoPTT: number;
  onHornoPChange: (value: number) => void;
  onHornoPTTChange: (value: number) => void;
}

export default function Details({
  totalChickens,
  totalPotatoes,
  deliveredChickens,
  deliveredPotatoes,
  hornoP,
  hornoPTT,
  onHornoPChange,
  onHornoPTTChange,
}: DetailsProps) {
  // Definición de los valores para incrementar y decrementar
  const hornoPValues = [0.5, 1, 5, 6, 12];
  const pttPlusValues = [0.5, 1, 10];
  const pttMinusValues = [10, 1, 0.5];

  // Clases base para los botones, para evitar repetir estilos
  const buttonBaseClasses =
    "flex-1 min-w-[80px] h-12 text-white font-medium rounded-lg transition duration-200";

  return (
    <div className="p-4 space-y-4">
      {/* Grupo 1: Totales (comentado, activar si lo deseas) */}
      {/*
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
        <h1 className="text-xl font-semibold text-white mb-4">
          Pollo Total: {hornoP + totalChickens - deliveredChickens}
        </h1>
        <h1 className="text-xl font-semibold text-white mb-4">
          Patatas Total: {hornoPTT + totalPotatoes - deliveredPotatoes}
        </h1>
      </div>
      */}

      {/* Sección para Horno P */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-l-gray-600">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
          Horno P: {hornoP}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {hornoPValues.map((num) => (
            <button
              key={`hp-plus-${num}`}
              onClick={() => onHornoPChange(hornoP + num)}
              className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700`}
            >
              +{num}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {hornoPValues.map((num) => (
            <button
              key={`hp-minus-${num}`}
              onClick={() => onHornoPChange(hornoP - num)}
              className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}
            >
              -{num}
            </button>
          ))}
        </div>
      </div>

      {/* Sección para Horno PTT */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-l-gray-600">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
          Horno PTT: {hornoPTT}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {pttPlusValues.map((num) => (
            <button
              key={`ptt-plus-${num}`}
              onClick={() => onHornoPTTChange(hornoPTT + num)}
              className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700`}
            >
              +{num}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {pttMinusValues.map((num) => (
            <button
              key={`ptt-minus-${num}`}
              onClick={() => onHornoPTTChange(hornoPTT - num)}
              className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}
            >
              -{num}
            </button>
          ))}
        </div>
      </div>

      {/* Grupo 2: Pedidos */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
        <h1 className="text-xl font-semibold text-white mb-4">
          Pollos Pedidos: {totalChickens - deliveredChickens}
        </h1>
        <h1 className="text-xl font-semibold text-white mb-4">
          Patatas Pedidas: {totalPotatoes - deliveredPotatoes}
        </h1>
      </div>

      {/* Grupo 3: Sobras */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border-l-4 border-red-500">
        <h1 className="text-xl font-semibold text-white mb-4">
          Sobran Pollos: {hornoP - totalChickens}
        </h1>
        <h1 className="text-xl font-semibold text-white mb-4">
          Sobran Patatas: {hornoPTT - totalPotatoes}
        </h1>
      </div>
    </div>
  );
}
