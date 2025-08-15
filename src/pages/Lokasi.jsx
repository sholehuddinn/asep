import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Search } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-black mb-2">Master Institusi</h1>
            <p className="text-gray-600">Lorem ipsum commodo suspendisse rutrum</p>
          </div>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={16} />
            Tambah Institusi
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari institusi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {/* Table Header */}
          <div className="border-b border-gray-300">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-200">
              <div className="col-span-1 text-sm font-semibold text-black">No</div>
              <div className="col-span-3 text-sm font-semibold text-black">Nama Institusi</div>
              <div className="col-span-3 text-sm font-semibold text-black">Nama PIC</div>
              <div className="col-span-4 text-sm font-semibold text-black">Lokasi</div>
              <div className="col-span-1 text-sm font-semibold text-black">Opsi</div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {currentItems.length > 0 ? (
              currentItems.map((location, index) => (
                <div key={location.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <div className="col-span-1 text-sm text-black font-medium">
                    {startIndex + index + 1}
                  </div>
                  <div className="col-span-3 text-sm text-black">
                    {location.name}
                  </div>
                  <div className="col-span-3 text-sm text-black">
                    {location.pic}
                  </div>
                  <div className="col-span-4 text-sm text-black">
                    {location.building}
                  </div>
                  <div className="col-span-1">
                    <button className="text-gray-600 hover:text-gray-800">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                {searchTerm ? 'No results found for your search.' : 'No data available.'}
              </div>
            )}
          </div>

          {/* Footer with Smart Pagination */}
          {filteredLocations.length > 0 && (
            <div className="border-t border-gray-300 px-6 py-4 bg-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-black">
                  Showing <span className="font-semibold">{startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLocations.length)}</span> of <span className="font-semibold">{filteredLocations.length}</span> results found
                </div>
                
                <div className="flex items-center gap-1">
                  <button 
                    className="px-3 py-1 text-sm text-black hover:text-gray-700 disabled:opacity-50"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {/* Show first page if not in visible range */}
                  {getVisiblePages()[0] > 1 && (
                    <>
                      <button 
                        className="px-3 py-1 text-sm text-black hover:bg-gray-100 rounded"
                        onClick={() => goToPage(1)}
                      >
                        1
                      </button>
                      {getVisiblePages()[0] > 2 && <span className="px-2 text-gray-400">...</span>}
                    </>
                  )}
                  
                  {/* Visible page numbers */}
                  {getVisiblePages().map(page => (
                    <button
                      key={page}
                      className={`px-3 py-1 text-sm rounded ${
                        page === currentPage 
                          ? 'bg-blue-700 text-white' 
                          : 'text-black hover:bg-gray-100'
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {/* Show last page if not in visible range */}
                  {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
                    <>
                      {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                      <button 
                        className="px-3 py-1 text-sm text-black hover:bg-gray-100 rounded"
                        onClick={() => goToPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="px-3 py-1 text-sm text-black hover:text-gray-700 disabled:opacity-50"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
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