"use client";

import { useState, useEffect } from "react";
import Details from "./components/ui/Details";
import { Table } from "./components/ui/Table";
import { OrderModal, Order } from "./components/ui/OrderModal";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Estados para Horno P y Horno PTT
  const [pollosHorno, setPollosHorno] = useState(0);
  const [patatasHorno, setPatatasHorno] = useState(0);

  const dayTitles: { [key: number]: string } = {
    0: "Santa María",
    1: "Manacor",
    2: "Pedidos",
    3: "Santañí",
    4: "Inca",
    5: "Llucmajor",
    6: "Santañí",
  };

  const prices = {
    chicken: 11,
    halfChicken: 6,
    potatoes: 2,
    halfPotatoes: 1,
  };

  const today = new Date();
  const currentDay = today.getDay();
  const currentDayTitle = dayTitles[currentDay];

  const getDateKey = () => {
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const dateKey = getDateKey();

  // Cargar datos del localStorage: orders, pollosHorno y patatasHorno
  const loadDataFromStorage = () => {
    const storedData = localStorage.getItem(dateKey);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.orders) {
          setPollosHorno(parsedData.pollosHorno || 0);
          setPatatasHorno(parsedData.patatasHorno || 0);
          return parsedData.orders;
        }
      } catch (error) {
        console.error("Error parsing stored orders:", error);
      }
    }
    return [];
  };

  useEffect(() => {
    const storedOrders = loadDataFromStorage();
    setOrders(storedOrders);
  }, [dateKey]);

  useEffect(() => {
    // Consideramos solo los pedidos activos (no eliminados)
    const activeOrders = orders.filter((order) => !order.deleted);
    if (activeOrders.length > 0) {
      const totalChickens = activeOrders.reduce(
        (total, order) => total + Number(order.chickens),
        0
      );
      const totalPotatoes = activeOrders.reduce(
        (total, order) => total + Number(order.potatoes),
        0
      );

      const weekday = today.toLocaleDateString("es-ES", { weekday: "long" });
      const dailySummary = {
        title: currentDayTitle,
        date: `${dateKey} - ${weekday}`,
        orders: orders, // se guardan todos, incluso los eliminados
        chickensSold: totalChickens,
        potatoesSold: totalPotatoes,
        pollosHorno: pollosHorno,
        patatasHorno: patatasHorno,
      };

      localStorage.setItem(dateKey, JSON.stringify(dailySummary));
    }
  }, [orders, pollosHorno, patatasHorno, dateKey]);

  const sortOrdersByTime = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
      if (a.delivered === b.delivered) {
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);
        const timeA = new Date().setHours(hoursA, minutesA, 0, 0);
        const timeB = new Date().setHours(hoursB, minutesB, 0, 0);
        return timeA - timeB;
      }
      return a.delivered ? 1 : -1;
    });
  };

  const saveOrder = (order: Order) => {
    let updatedOrders: Order[];

    if (orderToEdit && editIndex !== null) {
      updatedOrders = [...orders];
      updatedOrders[editIndex] = order;
    } else {
      updatedOrders = [...orders, order];
    }

    setOrders(sortOrdersByTime(updatedOrders));
  };

  // En lugar de eliminar, marcamos el pedido como eliminado
  const deleteOrder = () => {
    if (editIndex !== null) {
      const updatedOrders = [...orders];
      updatedOrders[editIndex].deleted = true;
      setOrders(updatedOrders);
      closeModal();
    }
  };

  const openAddModal = () => {
    setOrderToEdit(null);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (order: Order, index: number) => {
    setOrderToEdit(order);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setOrderToEdit(null);
    setEditIndex(null);
    setIsModalOpen(false);
  };

  const toggleDelivered = (index: number) => {
    const updatedOrders = [...orders];
    updatedOrders[index].delivered = !updatedOrders[index].delivered;

    const sortedOrders = sortOrdersByTime(updatedOrders);
    setOrders(sortedOrders);
    localStorage.setItem(dateKey, JSON.stringify(sortedOrders));
  };

  // Filtrar para mostrar solo pedidos activos
  const activeOrders = orders.filter((order) => !order.deleted);

  return (
    <main className="bg-gray-900 dark:bg-gray-900 min-h-screen">
      {/* Grid: 1 columna en mobile y 4 columnas en pantallas md y superiores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3 p-4 md:p-8 overflow-auto">
          <h1 className="relative text-2xl md:text-4xl font-bold text-gray-100 mb-4 border-4 border-gray-700 rounded-lg p-4">
            <span className="block text-center w-full">{currentDayTitle}</span>
            <Link
              href="/info"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <InformationCircleIcon className="h-8 w-8 text-blue-500 cursor-pointer" />
            </Link>
          </h1>
          {/* Versión móvil: Details se muestra justo después del h1 */}
          <div className="md:hidden mb-4">
            <Details
              totalChickens={activeOrders.reduce(
                (total, order) => total + Number(order.chickens),
                0
              )}
              totalPotatoes={activeOrders.reduce(
                (total, order) => total + Number(order.potatoes),
                0
              )}
              deliveredChickens={activeOrders
                .filter((order) => order.delivered)
                .reduce(
                  (total, order) => total + Number(order.chickens),
                  0
                )}
              deliveredPotatoes={activeOrders
                .filter((order) => order.delivered)
                .reduce(
                  (total, order) => total + Number(order.potatoes),
                  0
                )}
              hornoP={pollosHorno}
              hornoPTT={patatasHorno}
              onHornoPChange={setPollosHorno}
              onHornoPTTChange={setPatatasHorno}
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={openAddModal}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Añadir Pedido
            </button>
            <Table
              orders={orders} // La tabla se encargará de no mostrar los eliminados
              prices={prices}
              onEditOrder={openEditModal}
              onToggleDelivered={toggleDelivered}
            />
          </div>
        </div>

        {/* Versión escritorio: Details se muestra en la columna derecha */}
        <div className="hidden md:block md:col-span-1 h-auto md:h-screen border-l-4 border-gray-700 dark:border-gray-700 bg-gray-800 dark:bg-gray-800">
          <Details
            totalChickens={activeOrders.reduce(
              (total, order) => total + Number(order.chickens),
              0
            )}
            totalPotatoes={activeOrders.reduce(
              (total, order) => total + Number(order.potatoes),
              0
            )}
            deliveredChickens={activeOrders
              .filter((order) => order.delivered)
              .reduce(
                (total, order) => total + Number(order.chickens),
                0
              )}
            deliveredPotatoes={activeOrders
              .filter((order) => order.delivered)
              .reduce(
                (total, order) => total + Number(order.potatoes),
                0
              )}
            hornoP={pollosHorno}
            hornoPTT={patatasHorno}
            onHornoPChange={setPollosHorno}
            onHornoPTTChange={setPatatasHorno}
          />
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaveOrder={saveOrder}
        onDeleteOrder={orderToEdit ? deleteOrder : undefined}
        initialOrder={orderToEdit || undefined}
        pueblo={currentDayTitle} // PASAMOS EL NOMBRE DEL PUEBLO
      />
    </main>
  );
}
