"use client";
import { useState } from "react";

interface DetailsProps {
  totalChickens: number;
  totalPotatoes: number;
  deliveredChickens: number;
  deliveredPotatoes: number;
}

export default function Details({
  totalChickens,
  totalPotatoes,
  deliveredChickens,
  deliveredPotatoes,
}: DetailsProps) {
  const [hornoP, setHornoP] = useState(0);
  const [hornoPTT, setHornoPTT] = useState(0);

  return (
    <div className="p-4 space-y-4">
      {/* Grupo 1: Totales */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-600">
        <h1 className="text-xl font-semibold text-white mb-4">
          Pollo Total: {hornoP + totalChickens - deliveredChickens}
        </h1>
        <h1 className="text-xl font-semibold text-white mb-4">
          Patatas Total: {hornoPTT + totalPotatoes - deliveredPotatoes}
        </h1>
      </div>

      {/* Horno P */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-l-gray-600">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
          Horno P: {hornoP}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          {[1, 5, 6, 12].map((num) => (
            <button
              key={num}
              onClick={() => setHornoP(hornoP + num)}
              className="flex-1 min-w-[80px] h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              +{num}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {[1, 5, 6, 12].map((num) => (
            <button
              key={num}
              onClick={() => setHornoP(hornoP - num)}
              className="flex-1 min-w-[80px] h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
            >
              -{num}
            </button>
          ))}
        </div>
      </div>

      {/* Horno PTT */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-l-gray-600">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">
          Horno PTT: {hornoPTT}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setHornoPTT(hornoPTT + 10)}
            className="flex-1 min-w-[80px] h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            +10
          </button>
          <button
            onClick={() => setHornoPTT(hornoPTT - 10)}
            className="flex-1 min-w-[80px] h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
          >
            -10
          </button>
          <button
            onClick={() => setHornoPTT(hornoPTT - 1)}
            className="flex-1 min-w-[80px] h-12 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
          >
            -1
          </button>
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