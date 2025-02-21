import { useState, useEffect } from "react";

// Definir el tipo de una orden
export interface Order {
  chickens: number;
  potatoes: number;
  time: string;
  name: string;
  paid: boolean;
  delivered: boolean;
  phone: boolean;
  preferences: string[]; // Opcional: preferencias seleccionadas
  blacklisted?: boolean; // Opcional: si el cliente está en lista negra
}

// Props para el modal unificado
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (order: Order) => void;
  onDeleteOrder?: () => void; // Opcional, solo se usa en modo edición
  initialOrder?: Order; // Si se provee, el modal estará en modo edición
  pueblo: string; // NUEVA: nombre del pueblo a usar para clientes
}

// Función para normalizar strings (elimina acentos y caracteres especiales, y pasa a minúsculas)
const normalizeString = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos
    .replace(/[^a-zA-Z0-9 ]/g, "") // elimina caracteres especiales
    .toLowerCase();
};

// Función para formatear a Title Case (primera letra de cada palabra en mayúsculas)
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Función para obtener la hora actual con minutos en "00"
const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  return `${hours}:00`;
};

export function OrderModal({
  isOpen,
  onClose,
  onSaveOrder,
  onDeleteOrder,
  initialOrder,
  pueblo,
}: OrderModalProps) {
  const [order, setOrder] = useState<Order>(
    initialOrder || {
      chickens: 1,
      potatoes: 0,
      time: getCurrentTime(),
      name: "",
      paid: false,
      delivered: false,
      phone: false,
      preferences: [],
      blacklisted: false,
    }
  );

  // Estado para las sugerencias de nombres
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // Estado para controlar si ya se ha seleccionado una sugerencia
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState<boolean>(false);

  // Actualiza el estado cuando cambie el pedido inicial o se abra el modal
  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    } else {
      setOrder({
        chickens: 1,
        potatoes: 0,
        time: getCurrentTime(),
        name: "",
        paid: false,
        delivered: false,
        phone: false,
        preferences: [],
        blacklisted: false,
      });
    }
    // Reseteamos el flag al abrir el modal
    setHasSelectedSuggestion(false);
  }, [initialOrder, isOpen]);

  // Actualiza las sugerencias cuando el nombre cambie,
  // pero solo si no se ha seleccionado una sugerencia previamente
  useEffect(() => {
    if (hasSelectedSuggestion) {
      setSuggestions([]);
      return;
    }
    const clientsRaw = localStorage.getItem("clients");
    let clients: { [key: string]: string[] } = {};
    if (clientsRaw) {
      try {
        clients = JSON.parse(clientsRaw);
      } catch (error) {
        console.error("Error al parsear clients:", error);
      }
    }
    const clientKey = normalizeString(pueblo);
    const names: string[] = clients[clientKey] || [];
    const inputNormalized = normalizeString(order.name);
    // Se filtra comparando la versión normalizada de cada nombre
    const filtered = names.filter(
      (name) => normalizeString(name).startsWith(inputNormalized) && inputNormalized !== ""
    );
    setSuggestions(filtered);
  }, [order.name, pueblo, hasSelectedSuggestion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    // Si el usuario modifica manualmente el input, reiniciamos el flag
    if (name === "name") {
      setHasSelectedSuggestion(false);
    }
    if (name === "paid" && checked) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        paid: true,
        phone: false,
      }));
    } else if (name === "phone" && checked) {
      setOrder((prevOrder) => ({
        ...prevOrder,
        phone: true,
        paid: false,
      }));
    } else {
      setOrder((prevOrder) => ({
        ...prevOrder,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    setOrder((prevOrder) => {
      let newPreferences = [...prevOrder.preferences];
      if (newPreferences.includes(preference)) {
        newPreferences = newPreferences.filter((pref) => pref !== preference);
      } else {
        if (preference === "(MS)" && newPreferences.includes("(S/S)")) {
          newPreferences = newPreferences.filter((pref) => pref !== "(S/S)");
        } else if (preference === "(S/S)" && newPreferences.includes("(MS)")) {
          newPreferences = newPreferences.filter((pref) => pref !== "(MS)");
        } else if (preference === "(BH)" && newPreferences.includes("(PH)")) {
          newPreferences = newPreferences.filter((pref) => pref !== "(PH)");
        } else if (preference === "(PH)" && newPreferences.includes("(BH)")) {
          newPreferences = newPreferences.filter((pref) => pref !== "(BH)");
        }
        newPreferences.push(preference);
      }
      return { ...prevOrder, preferences: newPreferences };
    });
  };

  const handleEyeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setOrder((prevOrder) => {
      let newPreferences = [...prevOrder.preferences];
      if (checked) {
        if (!newPreferences.includes("👁️")) {
          newPreferences.push("👁️");
        }
      } else {
        newPreferences = newPreferences.filter((pref) => pref !== "👁️");
      }
      return { ...prevOrder, preferences: newPreferences };
    });
  };

  // Al hacer click en una sugerencia se autocompleta el input y se activa el flag
  const handleSuggestionClick = (suggestion: string) => {
    setOrder((prevOrder) => ({ ...prevOrder, name: suggestion }));
    setHasSelectedSuggestion(true);
    setSuggestions([]);
  };

  const handleClose = () => {
    setOrder({
      chickens: 1,
      potatoes: 0,
      time: getCurrentTime(),
      name: "",
      paid: false,
      delivered: false,
      phone: false,
      preferences: [],
      blacklisted: false,
    });
    onClose();
  };

  const isValidOrder =
    order.name.trim() !== "" &&
    Number(order.chickens) + Number(order.potatoes) > 0;

  const handleSave = () => {
    if (isValidOrder) {
      const clientsRaw = localStorage.getItem("clients");
      let clients: { [key: string]: string[] } = {};
      if (clientsRaw) {
        try {
          clients = JSON.parse(clientsRaw);
        } catch (error) {
          console.error("Error al parsear clients:", error);
        }
      }
      const clientKey = normalizeString(pueblo);
      // Convertir el nombre a Title Case para guardarlo en el JSON
      const formattedName = toTitleCase(order.name);
      // Actualizamos el order para que también se guarde con el formato deseado
      const updatedOrder = { ...order, name: formattedName };
      if (!clients[clientKey]) {
        clients[clientKey] = [];
      }
      if (!clients[clientKey].includes(formattedName)) {
        clients[clientKey].push(formattedName);
      }
      localStorage.setItem("clients", JSON.stringify(clients));
      onSaveOrder(updatedOrder);
      handleClose();
    }
  };

  if (!isOpen) return null;
  const isEditing = initialOrder !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar Pedido" : "Agregar Pedido"}
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={order.name}
            onChange={handleChange}
            className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bottom-full left-0 bg-white text-black w-full z-10 border border-gray-300 rounded max-h-40 overflow-y-auto mb-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer hover:bg-gray-200 border-b border-gray-300"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2">
          <label className="text-white block mb-1">Pollos 🐔</label>
          <input
            type="number"
            name="chickens"
            min="0"
            step="0.5"
            value={order.chickens}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-2">
          <label className="text-white block mb-1">Patatas 🥔</label>
          <input
            type="number"
            name="potatoes"
            min="0"
            step="0.5"
            value={order.potatoes}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <input
          type="time"
          name="time"
          min={getCurrentTime()}
          value={order.time}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <div className="flex flex-col text-white mt-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="paid"
              checked={order.paid}
              onChange={handleChange}
              className="w-5 h-5"
              disabled={order.phone}
            />
            <span>Pagado</span>
          </label>
          <label className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              name="phone"
              checked={order.phone}
              onChange={handleChange}
              className="w-5 h-5"
              disabled={order.paid}
            />
            <span>Teléfono</span>
          </label>
        </div>
        <div className="mt-4">
          <label className="text-white block mb-2">Preferencias:</label>
          <div className="flex gap-2">
            {["(MS)", "(S/S)", "(BH)", "(PH)"].map((preference) => (
              <button
                key={preference}
                onClick={() => handlePreferenceToggle(preference)}
                className={`px-3 py-1 rounded ${
                  order.preferences.includes(preference)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-500 text-gray-200"
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            name="eye"
            checked={order.preferences.includes("👁️")}
            onChange={handleEyeChange}
            className="w-5 h-5"
          />
          <span>👁️</span>
        </label>
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={handleClose}
            className="bg-red-500 px-4 py-2 rounded mr-2"
          >
            Cancelar
          </button>
          {isEditing && onDeleteOrder && (
            <button
              onClick={onDeleteOrder}
              className="bg-yellow-700 px-4 py-2 rounded mr-2"
              title="Eliminar pedido"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isValidOrder}
            className={`px-4 py-2 rounded ${
              isValidOrder
                ? "bg-green-700 hover:bg-green-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
