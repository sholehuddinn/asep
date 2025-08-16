import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Search, MapPin, User, Building } from 'lucide-react';

const MasterInstitusi = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/location`);
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        setLocations(data.locations || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.pic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredLocations.slice(startIndex, startIndex + itemsPerPage);
  
  // Smart pagination - show limited pages
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const goToPage = (page) => {
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
                <MapPin size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Master Institusi</h1>
                <p className="text-gray-600 text-lg">Kelola data lokasi institusi dengan mudah dan efisien</p>
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
              placeholder="Cari institusi, PIC, atau gedung..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredLocations.length} hasil untuk "{searchTerm}"
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
                <Building size={16} />
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
            {currentItems.length > 0 ? (
              currentItems.map((location, index) => (
                <div key={location.id} className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-all duration-200 group">
                  <div className="col-span-1 text-sm font-bold text-[#000080]">
                    {startIndex + index + 1}
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[#000080] transition-colors">
                      {location.name}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-700 font-medium">
                      {location.pic}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="text-sm text-gray-600 flex items-start gap-2">
                      <Building size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      {location.building}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button className="text-gray-400 hover:text-[#000080] hover:bg-blue-100 p-2 rounded-lg transition-all duration-200">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'Tidak ada hasil yang ditemukan untuk pencarian Anda.' : 'Tidak ada data tersedia.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer with Smart Pagination */}
          {filteredLocations.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-bold text-[#000080]">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLocations.length)}</span> dari{" "}
                  <span className="font-bold text-[#000080]">{filteredLocations.length}</span> data ditemukan
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {/* Show first page if not in visible range */}
                    {getVisiblePages()[0] > 1 && (
                      <>
                        <button 
                          className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg transition-all duration-200"
                          onClick={() => goToPage(1)}
                        >
                          1
                        </button>
                        {getVisiblePages()[0] > 2 && <span className="px-2 text-gray-400 text-sm">...</span>}
                      </>
                    )}
                    
                    {/* Visible page numbers */}
                    {getVisiblePages().map(page => (
                      <button
                        key={page}
                        className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                          page === currentPage 
                            ? 'bg-gradient-to-r from-[#000080] to-blue-600 text-white shadow-lg' 
                            : 'text-gray-600 hover:text-[#000080] hover:bg-blue-100'
                        }`}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    
                    {/* Show last page if not in visible range */}
                    {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
                      <>
                        {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && <span className="px-2 text-gray-400 text-sm">...</span>}
                        <button 
                          className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg transition-all duration-200"
                          onClick={() => goToPage(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button 
                    className="px-4 py-2 text-sm text-gray-600 hover:text-[#000080] hover:bg-blue-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
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

export default MasterInstitusi;