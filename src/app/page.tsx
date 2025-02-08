"use client";

import { useState, useEffect } from "react";
import Details from "./components/ui/Details";
import { Table } from "./components/ui/Table";
import { OrderModal, Order } from "./components/ui/OrderModal";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Cargar órdenes desde localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders) as Order[]);
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
    if (orderToEdit && editIndex !== null) {
      // Actualizar pedido existente
      const updatedOrders = [...orders];
      updatedOrders[editIndex] = order;
      setOrders(updatedOrders);
    } else {
      // Agregar nuevo pedido
      setOrders((prevOrders) => [...prevOrders, order]);
    }
  };

  // Función para eliminar un pedido (solo en modo edición)
  const deleteOrder = () => {
    if (editIndex !== null) {
      const updatedOrders = orders.filter((_, index) => index !== editIndex);
      setOrders(updatedOrders);
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

  return (
    <main className="bg-gray-900 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-4">
        {/* Zona de Pedidos */}
        <div className="col-span-3 p-8 overflow-auto h-screen">
          <h1 className="text-center text-4xl font-bold text-gray-100 dark:text-gray-100 mb-4 border-4 border-gray-700 dark:border-gray-700 rounded-lg p-4">
            Pedidos
          </h1>
          <div className="flex flex-col gap-4">
            {/* Al hacer clic, se abre el modal en modo "agregar" */}
            <button
              onClick={openAddModal}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Agregar Pedido
            </button>
            <Table orders={orders} onEditOrder={openEditModal} />
          </div>
        </div>

        {/* Zona de Detalles */}
        <div className="col-span-1 p-8 h-screen border-l-4 border-gray-700 dark:border-gray-700 bg-gray-800 dark:bg-gray-800">
          <h1 className="text-4xl font-bold text-gray-100 dark:text-gray-100 mb-4">
            Detalles
          </h1>
          <Details />
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
