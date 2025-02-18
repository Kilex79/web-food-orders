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
  preferences: string[], // Opcional: preferencias seleccionadas
}

// Props para el modal unificado
interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveOrder: (order: Order) => void;
  onDeleteOrder?: () => void; // Opcional, solo se usa en modo edición
  initialOrder?: Order; // Si se provee, el modal estará en modo edición
}

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
}: OrderModalProps) {
  // Si se está editando, se usará el pedido recibido; de lo contrario, se inicializa con los valores por defecto
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
    }
  );

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
      });
    }
  }, [initialOrder, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "paid" && checked) {
      // Si se marca "Pagado", desmarcar y deshabilitar "Teléfono"
      setOrder((prevOrder) => ({
        ...prevOrder,
        paid: true,
        phone: false, // Desmarcar teléfono
      }));
    } else if (name === "phone" && checked) {
      // Si se marca "Teléfono", desmarcar y deshabilitar "Pagado"
      setOrder((prevOrder) => ({
        ...prevOrder,
        phone: true,
        paid: false, // Desmarcar pagado
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
      const preferences = prevOrder.preferences.includes(preference)
        ? prevOrder.preferences.filter((pref) => pref !== preference)
        : [...prevOrder.preferences, preference];
      return { ...prevOrder, preferences };
    });
  };

  const handleClose = () => {
    // Restablece los valores al cerrar
    setOrder({
      chickens: 1,
      potatoes: 0,
      time: getCurrentTime(),
      name: "",
      paid: false,
      delivered: false,
      phone: false,
      preferences: [],
    });
    onClose();
  };

  // Validación: el nombre no debe estar vacío y debe haber al menos 1 producto
  const isValidOrder =
    order.name.trim() !== "" &&
    Number(order.chickens) + Number(order.potatoes) > 0;

  const handleSave = () => {
    if (isValidOrder) {
      onSaveOrder(order);
      handleClose();
    }
  };

  if (!isOpen) return null;

  const isEditing = initialOrder !== undefined;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
      <h2 className="text-xl font-bold text-white mb-4">
        {isEditing ? "Editar Pedido" : "Agregar Pedido"}
      </h2>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={order.name}
        onChange={handleChange}
        className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
      />
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
            disabled={order.phone} // Deshabilita si se marcó teléfono
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
            disabled={order.paid} // Deshabilita si se marcó pagado
          />
          <span>Teléfono</span>
        </label>
      </div>

      {/* Sección de Preferencias */}
      <div className="mt-4">
        <label className="text-white block mb-2">Preferencias:</label>
        <div className="flex gap-2">
          {["(MS)", "(S/S)", "(BH)", "(PH)"].map(
            (preference) => (
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
            )
          )}
        </div>
      </div>

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
