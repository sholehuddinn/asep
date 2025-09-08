"use client";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  Edit,
  Trash2,
  QrCode,
  ExternalLink,
  Building,
  User,
  ArrowLeft,
  Search,
  Hash,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { MoreHorizontal } from "lucide-react";

const DataTablePage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("table"); // 'table' | 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    name: "",
    pic: "",
    status: "",
    type: "",
  });

  // 🔹 Sample data (bisa diganti fetch API)
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        name: "Fakultas Ilmu Administrasi",
        pic: "Dr. Priyanto, M.Si",
        type: "Fakultas",
        status: "Active",
        website: "https://fia.unitomo.ac.id",
        email: "fia@unitomo.ac.id",
        phone: "031-1234567",
        address: "Jl. Semolowaru 84 Surabaya",
      },
      {
        id: 2,
        name: "Fakultas Pertanian",
        pic: "Dr. Kejora, M.Si",
        type: "Fakultas",
        status: "Active",
        website: "https://fp.unitomo.ac.id",
        email: "fp@unitomo.ac.id",
        phone: "031-7654321",
        address: "Jl. Semolowaru 84 Surabaya",
      },
      {
        id: 3,
        name: "Fakultas Teknik",
        pic: "Prof. Dr. Bambang",
        type: "Fakultas",
        status: "Inactive",
        website: "https://ft.unitomo.ac.id",
        email: "ft@unitomo.ac.id",
        phone: "031-9876543",
        address: "Jl. Semolowaru 84 Surabaya",
      },
      {
        id: 4,
        name: "Fakultas Hukum",
        pic: "Dr. Sari Wijaya",
        type: "Fakultas",
        status: "Active",
        website: "https://fh.unitomo.ac.id",
        email: "fh@unitomo.ac.id",
        phone: "031-5555555",
        address: "Jl. Semolowaru 84 Surabaya",
      },
    ];

    setTimeout(() => {
      setData(sampleData);
      setFilteredData(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  // 🔹 Filtering
  useEffect(() => {
    let filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        item.pic.toLowerCase().includes(filters.pic.toLowerCase()) &&
        (filters.status === "" || item.status === filters.status) &&
        (filters.type === "" || item.type === filters.type)
    );

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, data, searchTerm]);

  // 🔹 Handler
  const handleFilterChange = (column, value) =>
    setFilters((prev) => ({ ...prev, [column]: value }));

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setCurrentView("detail");
  };

  const handleBackToTable = () => {
    setCurrentView("table");
    setSelectedItem(null);
  };

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-action")) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action, item, e) => {
    e.stopPropagation();

    switch (action) {
      case "edit":
        Swal.fire({
          title: "Edit Data",
          input: "text",
          inputValue: item.name,
          showCancelButton: true,
          confirmButtonText: "Simpan",
          cancelButtonText: "Batal",
          customClass: {
            confirmButton:
              "bg-gradient-to-r from-[#000080] to-blue-600 hover:from-blue-700 hover:to-blue-800",
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            setData((prev) =>
              prev.map((d) =>
                d.id === item.id ? { ...d, name: result.value } : d
              )
            );
            Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
          }
        });
        break;

      case "delete":
        Swal.fire({
          icon: "warning",
          title: "Konfirmasi Hapus",
          text: `Apakah Anda yakin ingin menghapus ${item.name}?`,
          showCancelButton: true,
          confirmButtonText: "Ya, Hapus!",
          cancelButtonText: "Batal",
          customClass: {
            confirmButton: "bg-red-600 hover:bg-red-700",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            setData((prev) => prev.filter((d) => d.id !== item.id));
            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          }
        });
        break;

      case "qrcode":
        Swal.fire({
          title: "QR Code",
          html: `
          <div style="display:flex;justify-content:center;align-items:center;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${item.id}" alt="QR Code" />
          </div>
        `,
          showConfirmButton: true,
          confirmButtonText: "Tutup",
          customClass: {
            confirmButton:
              "bg-gradient-to-r from-[#000080] to-blue-600 hover:from-blue-700 hover:to-blue-800",
          },
        });
        break;

      default:
        break;
    }
  };

  // 🔹 Loading state
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

  // 🔹 Detail View
  if (currentView === "detail" && selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-8">
          <button
            onClick={handleBackToTable}
            className="bg-white hover:bg-blue-50 text-[#000080] hover:text-blue-700 px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali ke Table</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-[#000080] to-blue-600 p-4 rounded-xl shadow-lg">
                <Building size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Detail {selectedItem.name}
                </h1>
                <p className="text-gray-600 text-lg">Informasi lengkap unit</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  label: "Nama Unit",
                  value: selectedItem.name,
                  icon: Building,
                },
                { label: "Nama PIC", value: selectedItem.pic, icon: User },
                { label: "Type", value: selectedItem.type, icon: Hash },
                { label: "Status", value: selectedItem.status, icon: Hash },
                {
                  label: "Website",
                  value: selectedItem.website,
                  icon: Globe,
                  isLink: true,
                },
                { label: "Email", value: selectedItem.email, icon: Mail },
                { label: "Phone", value: selectedItem.phone, icon: Phone },
                { label: "Address", value: selectedItem.address, icon: MapPin },
              ].map(({ label, value, icon: Icon, isLink }) => (
                <div
                  key={label}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={20} className="text-[#000080]" />
                    <label className="text-sm font-semibold text-[#000080] uppercase tracking-wider">
                      {label}
                    </label>
                  </div>
                  {isLink ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 flex items-center gap-2 font-medium"
                    >
                      {value} <ExternalLink size={16} />
                    </a>
                  ) : label === "Status" ? (
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        value === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {value}
                    </span>
                  ) : (
                    <p className="text-gray-900 font-medium">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Table View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#000080] to-blue-600 p-4 rounded-xl shadow-lg">
              <Building size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Data Management
              </h1>
              <p className="text-gray-600 text-lg">
                Advanced datatable with filters and actions
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari nama unit atau PIC..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-gray-900 transition-all duration-200"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">Semua Type</option>
                <option value="Fakultas">Fakultas</option>
              </select>

              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent text-gray-900 transition-all duration-200"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {(searchTerm || filters.type || filters.status) && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredData.length} hasil
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#000080] to-blue-600 text-white">
            <div className="grid grid-cols-12 gap-4 px-8 py-5">
              <div className="col-span-1 text-sm font-semibold uppercase tracking-wider">
                No
              </div>
              <div className="col-span-3 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Building size={16} />
                Nama Unit
              </div>
              <div className="col-span-2 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <User size={16} />
                PIC
              </div>
              <div className="col-span-2 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} />
                Website
              </div>
              <div className="col-span-1 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Hash size={16} />
                Type
              </div>
              <div className="col-span-1 text-sm font-semibold uppercase tracking-wider">
                Status
              </div>
              <div className="col-span-2 text-sm font-semibold uppercase tracking-wider">
                Action
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {filteredData.length === 0 ? (
              <div className="text-center py-16">
                <Building size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Tidak ada data yang ditemukan
                </p>
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-8 py-6 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                  onClick={() => handleRowClick(item)}
                >
                  <div className="col-span-1 text-sm font-bold text-[#000080]">
                    {index + 1}
                  </div>
                  <div className="col-span-3">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-[#000080] transition-colors">
                      {item.name}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-700 font-medium">
                      {item.pic}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <a
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit <ExternalLink size={14} />
                    </a>
                  </div>
                  <div className="col-span-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#000080]">
                      {item.type}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div
                    className="col-span-2 flex justify-start"
                    ref={dropdownRef}
                  >
                    <div className="relative dropdown-action">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(
                            openDropdownId === item.id ? null : item.id
                          );
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
                      >
                        <MoreHorizontal size={16} className="text-gray-600" />
                      </button>

                      {openDropdownId === item.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("edit", item, e);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                            >
                              <Edit size={16} className="mr-3 text-blue-600" />
                              Edit
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("qrcode", item, e);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                            >
                              <QrCode
                                size={16}
                                className="mr-3 text-purple-600"
                              />
                              QR Code
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("delete", item, e);
                                setOpenDropdownId(null);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center text-sm text-red-600"
                            >
                              <Trash2 size={16} className="mr-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredData.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-8 py-6 mt-7">
              <div className="text-sm text-gray-700">
                Menampilkan{" "}
                <span className="font-bold text-[#000080]">
                  {filteredData.length}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#000080]">{data.length}</span>{" "}
                total data
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTablePage;
