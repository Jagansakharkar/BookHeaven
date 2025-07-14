import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BackButton } from '../../Components/common/BackButton';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export const Analytics = () => {
  const { userid, token } = useSelector(state => state.auth);
  const headers = { userid, authorization: `Bearer ${token}` };

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [booksByCategory, setBooksByCategory] = useState([]);
  const [ordersPerDay, setOrdersPerDay] = useState([]);
  const [revenuePerDay, setRevenuePerDay] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overviewRes, catRes, orderRes, revRes] = await Promise.all([
          axios.get('http://localhost:3000/api/admin/analytics/overview', { headers }),
          axios.get('http://localhost:3000/api/admin/analytics/books-by-category', { headers }),
          axios.get('http://localhost:3000/api/admin/analytics/orders-per-day', { headers }),
          axios.get('http://localhost:3000/api/admin/analytics/revenue-per-day', { headers }),
        ]);
        setOverview(overviewRes.data.data);
        setBooksByCategory(catRes.data.data);
        setOrdersPerDay(orderRes.data.data);
        setRevenuePerDay(revRes.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const pieData = {
    labels: booksByCategory.map(b => b.category || 'Unknown'),
    datasets: [{
      label: 'Books',
      data: booksByCategory.map(b => b.count),
      backgroundColor: ['#6366f1', '#22c55e', '#facc15', '#ec4899', '#f97316']
    }]
  };

  const ordersBarData = {
    labels: ordersPerDay.map(item => item._id),
    datasets: [{
      label: 'Orders/Day',
      data: ordersPerDay.map(item => item.count),
      backgroundColor: '#3b82f6'
    }]
  };

  const revenueLineData = {
    labels: revenuePerDay.map(item => item._id),
    datasets: [{
      label: 'Revenue (₹)',
      data: revenuePerDay.map(item => item.revenue),
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20,184,166,0.1)',
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#14b8a6',
    }]
  };

  if (loading) {
    return <div className="text-white text-center p-10">Loading analytics...</div>;
  }

  return (
    <div className="p-6 text-white bg-zinc-950 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">📊 Admin Analytics Dashboard</h1>

      <BackButton to={"/admin/dashboard"} text='Back' />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <InfoCard title="👥 Total Customers" value={overview.customers?.total || 0} bg="bg-blue-700" />
        <InfoCard title="🧾 Total Orders" value={overview.orders?.total || 0} bg="bg-green-600" />
        <InfoCard title="💰 Total Revenue" value={`₹${(overview.revenue || 0).toLocaleString()}`} bg="bg-yellow-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ChartCard title="📚 Books by Category">
          {booksByCategory.length > 0 ? <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} /> : <EmptyChart />}
        </ChartCard>

        <ChartCard title="📦 Orders (Last 7 Days)">
          {ordersPerDay.length > 0 ? <Bar data={ordersBarData} options={{ responsive: true }} /> : <EmptyChart />}
        </ChartCard>

        <ChartCard title="💸 Revenue (Last 7 Days)" fullWidth>
          {revenuePerDay.length > 0 ? <Line data={revenueLineData} options={{ responsive: true }} /> : <EmptyChart />}
        </ChartCard>
      </div>
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ title, value, bg }) => (
  <div className={`p-6 rounded-xl text-center shadow-md ${bg}`}>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

// Reusable Chart Card
const ChartCard = ({ title, children, fullWidth = false }) => (
  <div className={`bg-zinc-900 p-6 rounded-xl shadow ${fullWidth ? 'lg:col-span-2' : ''}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

// Empty Chart Placeholder
const EmptyChart = () => (
  <div className="text-zinc-400 text-center py-10">No data available</div>
);
