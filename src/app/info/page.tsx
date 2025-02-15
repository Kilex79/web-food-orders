"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

interface JSONEntry {
  key: string;
  content: Record<string, unknown>;
}

export default function InfoPage() {
  const [jsonEntries, setJsonEntries] = useState<JSONEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JSONEntry | null>(null);

  // Cargar todos los JSON desde localStorage
  useEffect(() => {
    const entries: JSONEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        try {
          if (value) {
            const parsed = JSON.parse(value);
            entries.push({ key, content: parsed });
          }
        } catch (error) {
          // Si no es un JSON válido, lo omitimos.
          console.error(`Error parsing JSON for key "${key}":`, error);
        }
      }
    }
    setJsonEntries(entries);
  }, []);

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    setJsonEntries((prev) => prev.filter((entry) => entry.key !== key));
    if (selectedEntry && selectedEntry.key === key) {
      setSelectedEntry(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="mt-6 flex items-center justify-between">
        <Link href="/" className="text-blue-500 hover:underline flex">
          <ChevronLeftIcon className="h-6 w-6" /> Volver a la página principal
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          JSON Data Viewer
        </h1>
      </div>

      <div className="flex gap-6">
        {/* Panel Izquierdo: Lista de JSON */}
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            JSON Keys
          </h2>
          <ul>
            {jsonEntries.map((entry) => (
              <li
                key={entry.key}
                className={`p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  selectedEntry?.key === entry.key
                    ? "bg-gray-300 dark:bg-gray-600"
                    : ""
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                {entry.key}
              </li>
            ))}
          </ul>
        </div>
        {/* Panel Derecho: Detalle del JSON seleccionado */}
        <div className="w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          {selectedEntry ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {selectedEntry.key}
                </h2>
                <button
                  onClick={() => handleDelete(selectedEntry.key)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
              <pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm text-gray-800 dark:text-gray-100 overflow-auto">
                {JSON.stringify(selectedEntry.content, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-300">
              Select a JSON key to view its content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
