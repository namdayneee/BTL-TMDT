'use client';

import { io, type Socket } from 'socket.io-client';
import type { OrderStatus } from './order-utils';

export type OrderStatusPayload = {
  orderId: number;
  status: string;
  userId?: number;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_GATEWAY_URL;

let socket: Socket | null = null;

function getSocket(): Socket | null {
  if (typeof window === 'undefined' || !SOCKET_URL) return null;
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
}

export function joinAdminOrdersRoom() {
  getSocket()?.emit('join-admin-orders');
}

export function joinUserOrdersRoom(userId: number) {
  getSocket()?.emit('join-user-orders', userId);
}

export function joinOrderRoom(orderId: number) {
  getSocket()?.emit('join-order-room', orderId);
}

export function subscribeOrderStatusUpdates(
  handler: (payload: OrderStatusPayload) => void
): () => void {
  const s = getSocket();
  if (!s) return () => {};

  const listener = (payload: OrderStatusPayload) => handler(payload);
  s.on('order-status-updated', listener);

  return () => {
    s.off('order-status-updated', listener);
  };
}

export function disconnectOrderSocket() {
  socket?.disconnect();
  socket = null;
}
