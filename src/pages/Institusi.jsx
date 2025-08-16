import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Search, Building2, MapPin, User } from 'lucide-react';

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9; // jumlah per halaman

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/institute`);
        if (!response.ok) {
          throw new Error('Failed to fetch institutes');
        }
        const data = await response.json();
        setInstitutes(data.institutes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, []);

  const filteredInstitutes = institutes.filter(institute =>
    institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institute.pic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institute.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalResults = filteredInstitutes.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredInstitutes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#000080]"></div>
          <div className="text-lg text-gray-700">Loading...</div>
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
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-[#000080] to-blue-600 p-4 rounded-xl shadow-lg">
                <Building2 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Master Institusi</h1>
                <p className="text-gray-600 text-lg">Kelola data institusi dengan mudah dan efisien</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-[#000080] to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              <Plus size={20} />
              <span className="font-medium">Tambah Institusi</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari institusi, PIC, atau lokasi..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {totalResults} hasil untuk "{searchTerm}"
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#000080] to-blue-600 text-white">
            <div className="grid grid-cols-12 gap-4 px-8 py-5">
              <div className="col-span-1 text-sm font-semibold uppercase tracking-wider">No</div>
              <div className="col-span-3 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} />
                Nama Institusi
              </div>
              <div className="col-span-3 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <User size={16} />
                Nama PIC
              </div>
              <div className="col-span-4 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} />
                Lokasi
              </div>
              <div className="col-span-1 text-sm font-semibold uppercase tracking-wider">Opsi</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {currentData.length === 0 ? (
              <div className="text-center py-16">
                <Building2 size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Tidak ada data institusi yang ditemukan</p>
              </div>
            ) : (
              currentData.map((institute, index) => (
                <div key={institute.id} className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-all duration-200 group">
                  <div className="col-span-1 text-sm font-bold text-[#000080]">
                    {startIndex + index + 1}
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[#000080] transition-colors">
                      {institute.name}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-700 font-medium">
                      {institute.pic}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="text-sm text-gray-600 flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      {institute.address}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button className="text-gray-400 hover:text-[#000080] hover:bg-blue-100 p-2 rounded-lg transition-all duration-200">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {currentData.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-bold text-[#000080]">{startIndex + 1}</span> -{" "}
                  <span className="font-bold text-[#000080]">{startIndex + currentData.length}</span> dari{" "}
                  <span className="font-bold text-[#000080]">{totalResults}</span> data
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Sebelumnya
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-[#000080] to-blue-600 text-white shadow-lg"
                            : "text-gray-600 hover:text-[#000080] hover:bg-blue-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstituteManagement;