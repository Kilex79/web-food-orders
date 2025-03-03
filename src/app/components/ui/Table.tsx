import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/16/solid"; // Icono de editar

interface Order {
  chickens: number;
  potatoes: number;
  time: string;
  name: string;
  paid: boolean;
  delivered: boolean;
  phone: boolean;
  preferences: string[];
  blacklisted: boolean;
  deleted?: boolean; // Nueva propiedad para marcar eliminados
}

interface TableProps {
  orders: Order[];
  title?: string;
  prices: {
    chicken: number;
    halfChicken: number;
    potatoes: number;
    halfPotatoes: number;
  };
  onEditOrder: (order: Order, index: number) => void;
  onToggleDelivered: (index: number) => void;
}

// Función que asigna las clases de borde según el tiempo del pedido
const getBorderClass = (order: Order, now: Date) => {
  if (order.delivered) return "";

  const [orderHours, orderMinutes] = order.time.split(":").map(Number);
  const orderTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    orderHours,
    orderMinutes,
    0
  );
  const diffMinutes = (now.getTime() - orderTime.getTime()) / 60000;

  if (diffMinutes < -10) return "";
  if (diffMinutes >= -10 && diffMinutes <= 15)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-green-500";
  if (diffMinutes > 15 && diffMinutes <= 30)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-orange-500";
  if (diffMinutes > 30)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-red-500";

  return "";
};

// Función que calcula el precio total teniendo en cuenta medias raciones
const calculatePrice = (
  order: Order,
  prices: {
    chicken: number;
    halfChicken: number;
    potatoes: number;
    halfPotatoes: number;
  }
) => {
  // Cálculo para los pollos:
  // Se asume que order.chickens es múltiplo de 0.5.
  const fullChickenCount = Math.floor(order.chickens);
  const hasHalfChicken = order.chickens - fullChickenCount > 0;
  const chickenPrice =
    fullChickenCount * prices.chicken +
    (hasHalfChicken ? prices.halfChicken : 0);

  // Cálculo para las patatas:
  const fullPotatoesCount = Math.floor(order.potatoes);
  const hasHalfPotato = order.potatoes - fullPotatoesCount > 0;
  const potatoesPrice =
    fullPotatoesCount * prices.potatoes +
    (hasHalfPotato ? prices.halfPotatoes : 0);

  return chickenPrice + potatoesPrice;
};

export function Table({
  orders,
  title,
  onEditOrder,
  onToggleDelivered,
  prices,
}: TableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {/* Vista de tabla para pantallas medianas y grandes */}
      <div className="hidden xl:block">
        <table className="table table-compact w-full text-sm md:text-lg">
          <thead>
            <tr className="text-lg bg-gray-800 border-t-4 border-l-4 border-r-4 border-gray-500 text-white">
              <th className="w-4">Pollos</th>
              <th className="w-4">Patatas</th>
              <th>Hora</th>
              <th>Nombre</th>
              <th>Pagado</th>
              <th>Preferencias</th>
              <th>Precio</th>
              <th>Editar</th>
              <th>Entregado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              if (order.deleted) return null;
              return (
                <tr
                  key={index}
                  className={`${getBorderClass(
                    order,
                    currentTime
                  )} hover:bg-slate-600 ${
                    order.delivered
                      ? "bg-gray-700 border-gray-500 border-4 opacity-35"
                      : ""
                  }`}
                >
                  <td>{order.chickens}</td>
                  <td>{order.potatoes}</td>
                  <td>{order.time}</td>
                  <td>
                    {order.name} {order.phone ? " (📞)" : ""}
                  </td>
                  <td>{order.paid ? "✅" : "❌"}</td>
                  <td>{order.preferences?.join(", ") || ""}</td>
                  <td>{calculatePrice(order, prices)} €</td>
                  <td>
                    <button
                      onClick={() => onEditOrder(order, index)}
                      title="Editar pedido"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="w-8 h-8" />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => onToggleDelivered(index)}
                      className={`px-3 py-1 text-white font-bold rounded transition-colors ${
                        order.delivered
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {order.delivered ? "✔️" : "❌"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para dispositivos móviles */}
<div className="block xl:hidden space-y-2 text-xs">
  {orders.map((order, index) => {
    if (order.deleted) return null;
    return (
      <div
        key={index}
        className={`card relative shadow-lg p-2 ${getBorderClass(
          order,
          currentTime
        )} ${
          order.delivered
            ? "bg-gray-700 border-gray-500 border-4 opacity-35"
            : ""
        }`}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-2">
          <span className="text-xl font-semibold">
            {order.name} {order.phone && <span>(📞)</span>}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEditOrder(order, index)}
              title="Editar pedido"
              className="text-blue-500 hover:text-blue-700"
            >
              <PencilSquareIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => onToggleDelivered(index)}
              className={`w-36 py-2 text-white font-bold rounded transition-colors ${
                order.delivered
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {order.delivered ? "Entregado ✔️" : "No entregado ❌"}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex gap-2">
              <p>
                <strong>🐔:</strong> {order.chickens}
              </p>
              <p>
                <strong>🥔:</strong> {order.potatoes}
              </p>
            </div>
            <p>
              <strong>Hora:</strong> {order.time}
            </p>
            <p>
              <strong>Preferencias:</strong>{" "}
              {order.preferences?.join(", ") || "-"}
            </p>
          </div>
          {/* Columna Derecha */}
          <div className="flex flex-col justify-between text-sm">
            <p>
              <strong>Pagado:</strong> {order.paid ? "✅" : "❌"}
            </p>
            <p className="text-end">
              <strong>Precio:</strong> {calculatePrice(order, prices)} €
            </p>
          </div>
        </div>
      </div>
    );
  })}
</div>

    </>
  );
}

/* TABLA ORIGINAL */
/*
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/16/solid"; // Icono de editar

interface Order {
  chickens: number;
  potatoes: number;
  time: string;
  name: string;
  paid: boolean;
  delivered: boolean;
  phone: boolean;
  preferences: string[];
  blacklisted: boolean;
  deleted?: boolean; // Nueva propiedad para marcar eliminados
}

interface TableProps {
  orders: Order[];
  title?: string;
  prices: {
    chicken: number;
    halfChicken: number;
    potatoes: number;
    halfPotatoes: number;
  };
  onEditOrder: (order: Order, index: number) => void;
  onToggleDelivered: (index: number) => void;
}

const getBorderClass = (order: Order, now: Date) => {
  if (order.delivered) return "";

  const [orderHours, orderMinutes] = order.time.split(":").map(Number);
  const orderTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    orderHours,
    orderMinutes,
    0
  );
  const diffMinutes = (now.getTime() - orderTime.getTime()) / 60000;

  if (diffMinutes < -10) return "";
  if (diffMinutes >= -10 && diffMinutes <= 15)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-green-500";
  if (diffMinutes > 15 && diffMinutes <= 30)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-orange-500";
  if (diffMinutes > 30)
    return "border-l-4 border-r-4 border-t-4 border-b-4 border-red-500";

  return "";
};

export function Table({
  orders,
  title,
  onEditOrder,
  onToggleDelivered,
  prices,
}: TableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div
        className="overflow-x-auto rounded-md"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <table className="table table-xl w-full text-lg">
          <thead>
            <tr className="text-lg bg-gray-800 border-t-4 border-l-4 border-r-4 border-gray-500 text-white">
              <th className="w-4">Pollos</th>
              <th className="w-4">Patatas</th>
              <th>Hora</th>
              <th>Nombre</th>
              <th>Pagado</th>
              <th>Preferencias</th>
              <th>Precio</th>
              <th>Editar</th>
              <th>Entregado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => {
              // Si el pedido está marcado como eliminado, no se renderiza
              if (order.deleted) return null;
              return (
                <tr
                  key={index}
                  className={`${getBorderClass(
                    order,
                    currentTime
                  )} hover:bg-slate-600 ${
                    order.delivered
                      ? "bg-gray-700 border-gray-500 border-4 opacity-35 "
                      : ""
                  }`}
                >
                  <td>{order.chickens}</td>
                  <td>{order.potatoes}</td>
                  <td>{order.time}</td>
                  <td>
                    {order.name}{" "}
                    {order.phone ? " (📞)" : ""}
                  </td>
                  <td>{order.paid ? "✅" : "❌"}</td>
                  <td>{order.preferences?.join(", ") || ""}</td>
                  <td>
                    {order.chickens * prices.chicken +
                      order.potatoes * prices.potatoes} €
                  </td>
                  <td>
                    <button
                      onClick={() => onEditOrder(order, index)}
                      title="Editar pedido"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="w-8 h-8" />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => onToggleDelivered(index)}
                      className={`px-3 py-1 text-white font-bold rounded transition-colors ${
                        order.delivered
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      {order.delivered ? "✔️" : "❌"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}*/
