"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import SuccesAlert from "../components/alerts/SuccesAlert";
import ErrorAlert from "../components/alerts/ErrorAlert";

interface JSONEntry {
  key: string;
  content: Record<string, unknown>;
}

export default function InfoPage() {
  const [jsonEntries, setJsonEntries] = useState<JSONEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JSONEntry | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // Función para parsear la fecha en formato dd-mm-yyyy
  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // meses de 0 a 11
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

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
        } catch {
          // Si no es un JSON válido, lo omitimos.
          console.error(`Error parsing JSON for key "${key}":`);
        }
      }
    }
    entries.sort((a, b) => {
      const dateA = parseDate(a.key);
      const dateB = parseDate(b.key);
      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      }
      return dateA ? -1 : 1;
    });
    setJsonEntries(entries);
  }, []);

  // Actualizar el contenido editado al cambiar la selección
  useEffect(() => {
    if (selectedEntry) {
      setEditedContent(JSON.stringify(selectedEntry.content, null, 2));
    }
  }, [selectedEntry]);

  // Autoajuste de la altura del textarea según el contenido
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedContent]);
  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    setJsonEntries((prev) => prev.filter((entry) => entry.key !== key));
    if (selectedEntry && selectedEntry.key === key) {
      setSelectedEntry(null);
    }
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editedContent);
      localStorage.setItem(selectedEntry!.key, editedContent);
      setJsonEntries((prev) =>
        prev.map((entry) =>
          entry.key === selectedEntry!.key
            ? { ...entry, content: parsed }
            : entry
        )
      );
      setSelectedEntry({ key: selectedEntry!.key, content: parsed });
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch {
      setShowErrorAlert(true);
      setTimeout(() => setShowErrorAlert(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="mt-6 flex items-center justify-between">
        <Link href="/" className="text-blue-500 hover:underline flex">
          <ChevronLeftIcon className="h-6 w-6" /> Volver a la página principal
        </Link>

        {/* Alerta de éxito */}
        {showSuccessAlert && <SuccesAlert />}
        {/* Alerta de éxito */}
        {showErrorAlert && <ErrorAlert />}
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
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save ✨
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEntry.key)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded text-sm text-gray-800 dark:text-gray-100 overflow-hidden font-mono resize-none"
              />
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
