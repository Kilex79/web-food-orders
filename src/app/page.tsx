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

  // Mapear días a Strings
  const dayTitles: { [key: number]: string } = {
    0: "Santa María",
    1: "Manacor",
    2: "Pedidos",
    3: "Santañí",
    4: "Inca",
    5: "Llucmajor",
    6: "Santanyi",
  };

  // Obtener el día actual
  const currentDay = new Date().getDay(); // Esto devuelve un número entre 0 (domingo) y 6 (sábado)
  const currentDayTitle = dayTitles[currentDay]; // Esto obtiene el título correspondiente al día

  // Ordenar las órdenes por hora
  const sortOrdersByTime = (orders: Order[]) => {
    return [...orders].sort((a, b) => {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      const timeA = new Date().setHours(hoursA, minutesA, 0, 0);
      const timeB = new Date().setHours(hoursB, minutesB, 0, 0);
      return timeA - timeB; // Orden ascendente
    });
  };

  // Cargar órdenes desde localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders) as Order[];
      setOrders(sortOrdersByTime(parsedOrders)); // Ordenar las órdenes al cargarlas
    }
  }, []);

  // Guardar órdenes en localStorage cuando cambien
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  // Función para agregar o actualizar un pedido
  const saveOrder = (order: Order) => {
    let updatedOrders: Order[];

    if (orderToEdit && editIndex !== null) {
      // Actualizar pedido existente
      updatedOrders = [...orders];
      updatedOrders[editIndex] = order;
    } else {
      // Agregar nuevo pedido
      updatedOrders = [...orders, order];
    }

    setOrders(sortOrdersByTime(updatedOrders)); // Asegurarse de ordenar las órdenes después de actualizar
  };

  // Función para eliminar un pedido (solo en modo edición)
  const deleteOrder = () => {
    if (editIndex !== null) {
      const updatedOrders = orders.filter((_, index) => index !== editIndex);
      setOrders(sortOrdersByTime(updatedOrders)); // Asegurarse de ordenar las órdenes después de eliminar
      closeModal();
    }
  };

  // Al hacer clic en "Agregar Pedido", nos aseguramos de que no haya pedido a editar.
  const openAddModal = () => {
    setOrderToEdit(null);
    setEditIndex(null);
    setIsModalOpen(true);
  };

  // Al hacer clic en el botón de editar, se establece el pedido a editar y su índice.
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

    // Mover los pedidos entregados al final
    const sortedOrders = [...updatedOrders].sort((a, b) => {
      if (a.delivered === b.delivered) {
        // Si ambos tienen el mismo estado de entrega, ordenar por hora
        const [hoursA, minutesA] = a.time.split(":").map(Number);
        const [hoursB, minutesB] = b.time.split(":").map(Number);
        const timeA = new Date().setHours(hoursA, minutesA, 0, 0);
        const timeB = new Date().setHours(hoursB, minutesB, 0, 0);
        return timeA - timeB;
      }
      return a.delivered ? 1 : -1; // Los entregados al final
    });

    setOrders(sortedOrders);
    localStorage.setItem("orders", JSON.stringify(sortedOrders)); // Guardar en localStorage
  };

  // Calcular las cantidades totales de pollos y patatas
  const totalChickens = orders.reduce(
    (total, order) => total + Number(order.chickens),
    0
  );
  const totalPotatoes = orders.reduce(
    (total, order) => total + Number(order.potatoes),
    0
  );

  return (
    <main className="bg-gray-900 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-4">
        {/* Zona de Pedidos */}
        <div className="col-span-3 p-8 overflow-auto h-screen">
          <h1 className="relative text-4xl font-bold text-gray-100 dark:text-gray-100 mb-4 border-4 border-gray-700 dark:border-gray-700 rounded-lg p-4">
            <span className="block text-center w-full">{currentDayTitle}</span>
            <Link
              href="/info"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              <InformationCircleIcon className="h-8 w-8 text-blue-500 cursor-pointer" />
            </Link>
          </h1>

          <div className="flex flex-col gap-4">
            {/* Al hacer clic, se abre el modal en modo "agregar" */}
            <button
              onClick={openAddModal}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Añadir Pedido
            </button>
            <Table
              orders={orders}
              onEditOrder={openEditModal}
              onToggleDelivered={toggleDelivered}
            />
          </div>
        </div>

        {/* Zona de Detalles */}
        <div className="col-span-1 h-screen border-l-4 border-gray-700 dark:border-gray-700 bg-gray-800 dark:bg-gray-800">
          <Details
            totalChickens={totalChickens}
            totalPotatoes={totalPotatoes}
          />
        </div>
      </div>

      {/* Modal unificado para agregar/editar órdenes */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSaveOrder={saveOrder}
        onDeleteOrder={orderToEdit ? deleteOrder : undefined}
        initialOrder={orderToEdit || undefined}
      />
    </main>
  );
}
