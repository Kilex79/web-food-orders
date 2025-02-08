import { useState, useEffect } from "react";

// Definir el tipo de una orden
export interface Order {
  chickens: number;
  potatoes: number;
  time: string;
  name: string;
  paid: boolean;
  phone: boolean;
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
      phone: false,
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
        phone: false,
      });
    }
  }, [initialOrder, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClose = () => {
    // Restablece los valores al cerrar
    setOrder({
      chickens: 1,
      potatoes: 0,
      time: getCurrentTime(),
      name: "",
      paid: false,
      phone: false,
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
        <input
          type="number"
          name="chickens"
          min="0"
          value={order.chickens}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
        <input
          type="number"
          name="potatoes"
          min="0"
          value={order.potatoes}
          onChange={handleChange}
          className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
        />
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
            />
            <span>Teléfono</span>
          </label>
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
