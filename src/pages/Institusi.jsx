import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Search } from 'lucide-react';

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
            {filteredInstitutes.slice(0, 9).map((institute, index) => (
              <div key={institute.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <div className="col-span-1 text-sm text-black font-medium">
                  {index + 1}
                </div>
                <div className="col-span-3 text-sm text-black">
                  {institute.name}
                </div>
                <div className="col-span-3 text-sm text-black">
                  {institute.pic}
                </div>
                <div className="col-span-4 text-sm text-black">
                  {institute.address}
                </div>
                <div className="col-span-1">
                  <button className="text-gray-600 hover:text-gray-800">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-300 px-6 py-4 bg-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-black">
                Showing <span className="font-semibold">{Math.min(filteredInstitutes.length, 9)}</span> of <span className="font-semibold">{filteredInstitutes.length}</span> results found
              </div>
              
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 text-sm text-black hover:text-gray-700">
                  Previous
                </button>
                
                <button className="px-3 py-1 text-sm bg-blue-700 text-white rounded">
                  1
                </button>
                
                <button className="px-3 py-1 text-sm text-black hover:bg-gray-100 rounded">
                  2
                </button>
                
                <button className="px-3 py-1 text-sm text-black hover:text-gray-700">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteManagement;