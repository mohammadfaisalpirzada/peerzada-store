'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingBag, FaSpinner, FaSignOutAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaBoxOpen, FaExclamationCircle, FaSearch } from 'react-icons/fa';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  customDetails?: string;
}

interface Order {
  orderId: string;
  userEmail: string;
  customerName: string;
  itemsJson: string;
  totalAmount: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  transactionId?: string;
}

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const STATUS_ICONS: Record<string, any> = {
  pending: FaClock,
  processing: FaBoxOpen,
  shipped: FaTruck,
  delivered: FaCheckCircle,
  cancelled: FaTimesCircle,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/admin/verify-session');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const ordersRes = await fetch('/api/admin/orders');
        if (!ordersRes.ok) throw new Error('Failed');
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  useEffect(() => {
    const activityTimer = setInterval(() => {
      if (Date.now() - lastActivity > 15 * 60 * 1000) {
        fetch('/api/admin/verify-session', { method: 'POST' });
        router.push('/admin/login');
      }
    }, 60000);
    return () => clearInterval(activityTimer);
  }, [lastActivity, router]);

  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/verify-session', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  const parseItems = (itemsJson: string): OrderItem[] => {
    try { return JSON.parse(itemsJson); } catch { return []; }
  };

  const filteredOrders = orders.filter(order => {
    const matchSearch = !searchQuery || 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery) ||
      order.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-[#B80000]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaShoppingBag className="text-[#B80000] text-xl" />
            <div>
              <h1 className="font-bold text-sm sm:text-base">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">{orders.length} total orders</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-900 text-white' },
            { label: 'Pending', value: stats.pending, color: 'bg-amber-500 text-white' },
            { label: 'Processing', value: stats.processing, color: 'bg-blue-500 text-white' },
            { label: 'Shipped', value: stats.shipped, color: 'bg-purple-500 text-white' },
            { label: 'Delivered', value: stats.delivered, color: 'bg-green-500 text-white' },
            { label: 'Revenue', value: `Rs.${stats.revenue.toLocaleString()}`, color: 'bg-[#B80000] text-white' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-3 shadow-sm`}>
              <p className="text-xs opacity-80">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, name, phone, email..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B80000]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#B80000]"
          >
            <option value="all">All Status</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-4">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const items = parseItems(order.itemsJson);
              const StatusIcon = STATUS_ICONS[order.status] || FaClock;

              return (
                <motion.div
                  key={order.orderId}
                  layout
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${STATUS_COLORS[order.status]}`}>
                      <StatusIcon className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                      <p className="text-xs text-gray-500 truncate">{order.orderId} • {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">Rs. {Number(order.totalAmount).toLocaleString()}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedOrder === order.orderId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-4 space-y-4">
                          {/* Customer Details */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3">Customer Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <FaUser className="text-gray-400 text-xs" />
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium text-gray-900">{order.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaEnvelope className="text-gray-400 text-xs" />
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-gray-900">{order.userEmail}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-gray-400 text-xs" />
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium text-gray-900">{order.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-gray-400 text-xs" />
                                <span className="text-gray-600">Address:</span>
                                <span className="font-medium text-gray-900">{order.address}</span>
                              </div>
                              {order.transactionId && (
                                <div className="flex items-center gap-2 sm:col-span-2">
                                  <span className="text-gray-600">Transaction ID:</span>
                                  <span className="font-mono font-medium text-gray-900">{order.transactionId}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 text-sm mb-3">Order Items ({items.length})</h3>
                            <div className="space-y-3">
                              {items.map((item, i) => (
                                <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                                  {item.image && (
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs. {item.price.toLocaleString()}</p>
                                    {item.customDetails && (
                                      <p className="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 inline-block">
                                        {item.customDetails}
                                      </p>
                                    )}
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Actions */}
                          <div className="flex flex-wrap gap-2">
                            {STATUSES.map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(order.orderId, status)}
                                disabled={order.status === status || (order.status === 'cancelled' && status !== 'cancelled') || (order.status === 'delivered' && status !== 'delivered')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  order.status === status
                                    ? `${STATUS_COLORS[status]} ring-2 ring-offset-1`
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FaUser({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
}
