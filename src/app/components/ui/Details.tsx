"use client";
import { useState } from "react";

export default function Details() {
  const [hornoP, setHornoP] = useState(0);
  const [hornoPTT, setHornoPTT] = useState(0);

  return (
    <div className="p-4">
      {/* Horno P */}
      <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-4 border-4 border-gray-700 dark:border-gray-700 rounded-lg p-4">
        Horno P: {hornoP}
      </h1>
      <div className="flex gap-2 mb-4">
        {[1, 5, 6, 12].map((num) => (
          <button
            key={num}
            onClick={() => setHornoP(hornoP + num)}
            className="w-16 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-center"
          >
            +{num}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {[1, 5, 6, 12].map((num) => (
          <button
            key={num}
            onClick={() => setHornoP(hornoP - num)}
            className="w-16 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-center"
          >
            -{num}
          </button>
        ))}
      </div>

      {/* Horno PTT */}
      <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100 mb-4 border-4 border-gray-700 dark:border-gray-700 rounded-lg p-4">
        Horno PTT: {hornoPTT}
      </h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setHornoPTT(hornoPTT + 10)}
          className="w-16 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-center"
        >
          +10
        </button>
        <button
          onClick={() => setHornoPTT(hornoPTT - 10)}
          className="w-16 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-center"
        >
          -10
        </button>
        <button
          onClick={() => setHornoPTT(hornoPTT - 1)}
          className="w-16 h-10 bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-center"
        >
          -1
        </button>
      </div>
    </div>
  );
}

/* OTRO ESTILO PARA A CONFIRMAR */
/*
"use client";
import { useState } from "react";

export default function Details() {
  const [hornoP, setHornoP] = useState(0);
  const [hornoPTT, setHornoPTT] = useState(0);

  return (
    <div className="">
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Horno P */ /*}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            Horno P: <span className="text-blue-600 dark:text-blue-400">{hornoP}</span>
          </h1>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1, 5, 6, 12].map((num) => (
              <button
                key={`plus-${num}`}
                onClick={() => setHornoP(hornoP + num)}
                className="w-full h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md shadow-sm transition"
              >
                +{num}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 6, 12].map((num) => (
              <button
                key={`minus-${num}`}
                onClick={() => setHornoP(hornoP - num)}
                className="w-full h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md shadow-sm transition"
              >
                -{num}
              </button>
            ))}
          </div>
        </div>

        {/* Horno PTT */ /*}
        <div>
          <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-100 mb-4">
            Horno PTT: <span className="text-blue-600 dark:text-blue-400">{hornoPTT}</span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setHornoPTT(hornoPTT + 10)}
              className="w-full h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md shadow-sm transition"
            >
              +10
            </button>
            <button
              onClick={() => setHornoPTT(hornoPTT - 10)}
              className="w-full h-10 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-md shadow-sm transition"
            >
              -10
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

*/