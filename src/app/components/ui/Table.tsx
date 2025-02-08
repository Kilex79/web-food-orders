import { PencilSquareIcon } from "@heroicons/react/16/solid"; // Icono de editar

interface Order {
  chickens: number;
  potatoes: number;
  time: string;
  name: string;
  paid: boolean;
  delivered: boolean;
  phone: boolean;
}

interface TableProps {
  orders: Order[];
  title?: string;
  onEditOrder: (order: Order, index: number) => void; // Nueva función para editar
}

export function Table({ orders, title, onEditOrder }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-700">
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
              Editar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
          {orders.map((order, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {order.chickens}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {order.potatoes}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {order.time}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {order.name} {order.phone ? " (📞)" : ""}
              </td>
              <td className="px-6 py-4 text-sm">{order.paid ? "✅" : "❌"}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onEditOrder(order, index)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Editar pedido"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
