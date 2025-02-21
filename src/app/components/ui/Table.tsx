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
  blacklisted?: boolean;
}

interface TableProps {
  orders: Order[];
  title?: string;
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
  if (diffMinutes > 30) return "border-l-4 border-r-4 border-t-4 border-b-4 border-red-500";

  return "";
};

export function Table({
  orders,
  title,
  onEditOrder,
  onToggleDelivered,
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
              <th>Pollos</th>
              <th>Patatas</th>
              <th>Hora</th>
              <th>Nombre</th>
              <th>Pagado</th>
              <th>Preferencias</th>
              <th>Editar</th>
              <th>Entregado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className={`${getBorderClass(order, currentTime)} hover:bg-slate-600 ${order.delivered ? "bg-gray-700 border-gray-500 border-4 opacity-35 " : ""}`}>
                <td>{order.chickens}</td>
                <td>{order.potatoes}</td>
                <td>{order.time}</td>
                <td>
                  {order.blacklisted ? "(🏴)" : ""} {order.name} {order.phone ? " (📞)" : ""}
                </td>
                <td>{order.paid ? "✅" : "❌"}</td>
                <td>{order.preferences?.join(", ") || ""}</td>
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
            ))}
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
}


/* TABLA SIN DAISYUI
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
}

interface TableProps {
  orders: Order[];
  title?: string;
  onEditOrder: (order: Order, index: number) => void;
  onToggleDelivered: (index: number) => void; // Nuevo manejador
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
    return "border-4 border-green-500";
  if (diffMinutes > 15 && diffMinutes <= 30)
    return "border-4 border-orange-500";
  if (diffMinutes > 30) return "border-4 border-red-500";

  return "";
};

export function Table({
  orders,
  title,
  onEditOrder,
  onToggleDelivered,
}: TableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000); // cada 30 seg
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pollos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patatas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pagado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preferencias
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Editar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entregado
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
          {orders.map((order, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <td
                colSpan={8}
                className={`p-0 ${getBorderClass(order, currentTime)}`}
              >
                <div className="flex">
                  <div className="flex-1 px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {order.chickens}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {order.potatoes}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {order.time}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {order.name} {order.phone ? " (📞)" : ""}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm">
                    {order.paid ? "✅" : "❌"}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {order.preferences.join(", ")}
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm">
                    <button
                      onClick={() => onEditOrder(order, index)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar pedido"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 px-6 py-4 text-sm">
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
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/