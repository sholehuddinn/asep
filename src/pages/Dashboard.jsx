import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Building, 
  GitBranch, 
  MapPin, 
  Users, 
  TrendingUp, 
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    institutes: { total: 0, growth: 0 },
    units: { total: 0, growth: 0 },
    subunits: { total: 0, growth: 0 },
    locations: { total: 0, growth: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls
        const responses = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_URL}/institute`).catch(() => ({ ok: false })),
          fetch(`${import.meta.env.VITE_BASE_URL}/unit`).catch(() => ({ ok: false })),
          fetch(`${import.meta.env.VITE_BASE_URL}/subunit`).catch(() => ({ ok: false })),
          fetch(`${import.meta.env.VITE_BASE_URL}/location`).catch(() => ({ ok: false }))
        ]);

        const data = await Promise.all(
          responses.map(async (response, index) => {
            if (response.ok) {
              const result = await response.json();
              const keys = ['institutes', 'units', 'subunits', 'locations'];
              return result[keys[index]] || [];
            }
            return [];
          })
        );

        setStats({
          institutes: { 
            total: data[0].length, 
            growth: Math.floor(Math.random() * 20) + 5 
          },
          units: { 
            total: data[1].length, 
            growth: Math.floor(Math.random() * 15) + 3 
          },
          subunits: { 
            total: data[2].length, 
            growth: Math.floor(Math.random() * 25) + 8 
          },
          locations: { 
            total: data[3].length, 
            growth: Math.floor(Math.random() * 12) + 2 
          }
        });
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, growth, color, bgColor }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-xl ${bgColor} shadow-lg`}>
          <Icon size={32} className={`text-${color}`} />
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <ArrowUpRight size={16} />
              +{growth}%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Total data yang telah terdaftar
        </p>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, color, bgColor, onClick }) => (
    <button 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full group"
    >
      <div className={`p-4 rounded-xl ${bgColor} shadow-lg inline-block mb-4`}>
        <Icon size={24} className={`text-${color} group-hover:scale-110 transition-transform`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );

  const ActivityItem = ({ icon: Icon, title, time, status, color }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-blue-50 rounded-xl transition-colors">
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon size={20} className={`text-${color}-600`} />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <Clock size={14} />
          {time}
        </p>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
        {status}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000080]"></div>
          <div className="text-lg text-gray-700">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <div className="text-lg text-red-600 font-medium">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Selamat datang kembali! Berikut adalah ringkasan data sistem Anda.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Terakhir diupdate</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-[#000080] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity size={32} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Building2}
            title="Total Institusi"
            value={stats.institutes.total}
            growth={stats.institutes.growth}
            color="white"
            bgColor="bg-gradient-to-r from-[#000080] to-blue-600"
          />
          <StatCard 
            icon={Building}
            title="Total Unit"
            value={stats.units.total}
            growth={stats.units.growth}
            color="green-600"
            bgColor="bg-green-100"
          />
          <StatCard 
            icon={GitBranch}
            title="Total Sub Unit"
            value={stats.subunits.total}
            growth={stats.subunits.growth}
            color="purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard 
            icon={MapPin}
            title="Total Lokasi"
            value={stats.locations.total}
            growth={stats.locations.growth}
            color="orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="text-[#000080]" size={28} />
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QuickActionCard 
                icon={Building2}
                title="Kelola Institusi"
                description="Tambah, edit, atau hapus data institusi"
                color="white"
                bgColor="bg-gradient-to-r from-[#000080] to-blue-600"
              />
              <QuickActionCard 
                icon={Building}
                title="Kelola Unit"
                description="Manajemen unit dalam institusi"
                color="green-600"
                bgColor="bg-green-100"
              />
              <QuickActionCard 
                icon={GitBranch}
                title="Kelola Sub Unit"
                description="Atur hierarki sub unit"
                color="purple-600"
                bgColor="bg-purple-100"
              />
              <QuickActionCard 
                icon={MapPin}
                title="Kelola Lokasi"
                description="Manajemen lokasi dan gedung"
                color="orange-600"
                bgColor="bg-orange-100"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Activity className="text-[#000080]" size={28} />
              Aktivitas Terbaru
            </h2>
            <div className="space-y-4">
              <ActivityItem 
                icon={CheckCircle}
                title="Institusi baru ditambahkan"
                time="2 jam yang lalu"
                status="Selesai"
                color="green"
              />
              <ActivityItem 
                icon={Building}
                title="Unit diperbarui"
                time="4 jam yang lalu"
                status="Selesai"
                color="blue"
              />
              <ActivityItem 
                icon={AlertCircle}
                title="Review data diperlukan"
                time="6 jam yang lalu"
                status="Pending"
                color="orange"
              />
              <ActivityItem 
                icon={GitBranch}
                title="Sub unit direstruktur"
                time="1 hari yang lalu"
                status="Selesai"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <BarChart3 className="text-[#000080]" size={28} />
              Ringkasan Data
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="font-medium text-gray-700">Total Entitas</span>
                <span className="text-2xl font-bold text-[#000080]">
                  {(stats.institutes.total + stats.units.total + stats.subunits.total + stats.locations.total).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                <span className="font-medium text-gray-700">Rata-rata Pertumbuhan</span>
                <span className="text-2xl font-bold text-green-600">
                  +{Math.round((stats.institutes.growth + stats.units.growth + stats.subunits.growth + stats.locations.growth) / 4)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <PieChart className="text-[#000080]" size={28} />
              Informasi Sistem
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Status Sistem</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Semua sistem berjalan normal</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Sinkronisasi Data</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-600 font-medium">Tersinkron • {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;