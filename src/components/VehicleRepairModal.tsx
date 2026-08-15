"use client";

import React, { useState, useEffect } from 'react';
import { X, Info, Wrench, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { createClient } from "@/lib/supabase"; 

interface ItemDetail {
  id: number;
  namaBarang: string;
  banyaknya: number;
  unit: string;
  jumlah: number;
  keterangan: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleRepairModal({ isOpen, onClose }: ModalProps) {
  const supabase = createClient();

  // State untuk Informasi Pengajuan (Header)
  const [tanggal, setTanggal] = useState('');
  const [bengkel, setBengkel] = useState('');
  const [kendaraanId, setKendaraanId] = useState('');

  // State untuk menyimpan data dropdown kendaraan dari Supabase
  const [kendaraanList, setKendaraanList] = useState<any[]>([]);
  const [isLoadingKendaraan, setIsLoadingKendaraan] = useState(false);

  // State untuk item dinamis (Detail Pemeliharaan)
  const [items, setItems] = useState<ItemDetail[]>([
    { id: Date.now(), namaBarang: '', banyaknya: 1, unit: 'PCS', jumlah: 0, keterangan: '' }
  ]);
  const [totalBiaya, setTotalBiaya] = useState(0);

  // FASE 1 UPDATE: Fetch Data dengan Kategori yang lebih rapi
  useEffect(() => {
    if (isOpen) {
      const fetchKendaraan = async () => {
        setIsLoadingKendaraan(true);
        try {
          // Query baru menggunakan filter kategori sesuai arahan gambar
          const { data, error } = await supabase
            .from('inventaris_kib_b')
            .select('id, nama_barang, merk_type, no_polisi')
            .in('kategori', ['roda 2', 'roda 4']); // <-- Diubah agar mengambil Roda 2 & Roda 4

          if (error) throw error;
          
          if (data) {
            setKendaraanList(data);
          }
        } catch (error) {
          console.error("Gagal mengambil data kendaraan:", error);
        } finally {
          setIsLoadingKendaraan(false);
        }
      };

      fetchKendaraan();
    }
  }, [isOpen]);

  // Auto-calculate Total Biaya keseluruhan
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (Number(item.jumlah) || 0), 0);
    setTotalBiaya(total);
  }, [items]);

  if (!isOpen) return null;

  // Fungsi Tambah Baris
  const addItem = () => {
    setItems([...items, { id: Date.now(), namaBarang: '', banyaknya: 1, unit: 'PCS', jumlah: 0, keterangan: '' }]);
  };

  // Fungsi Hapus Baris
  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Fungsi Update Data Baris
  const updateItem = (id: number, field: keyof ItemDetail, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Fungsi Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'Berhasil!',
      text: 'Pengajuan pemeliharaan kendaraan berhasil disimpan.',
      icon: 'success',
      confirmButtonColor: '#3b82f6',
    }).then(() => {
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col mx-4">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ajukan Pemeliharaan Kendaraan</h2>
            <p className="text-sm text-gray-500">Lengkapi informasi pengajuan pemeliharaan kendaraan di bawah ini.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
          <form id="repair-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* SECTION 1: Informasi Pengajuan */}
            <div className="bg-white p-5 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                <Info size={18} />
                <h3>INFORMASI PENGAJUAN</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengajuan</label>
                  <input 
                    type="date" 
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bengkel Rekanan</label>
                  <input 
                    type="text" 
                    value={bengkel}
                    onChange={(e) => setBengkel(e.target.value)}
                    placeholder="Contoh: Gede Jaya Motor" 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black font-medium placeholder:text-gray-400 placeholder:font-normal" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kendaraan</label>
                  <select 
                    value={kendaraanId}
                    onChange={(e) => setKendaraanId(e.target.value)}
                    required 
                    disabled={isLoadingKendaraan}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="" className="text-gray-400">
                      {isLoadingKendaraan ? 'Memuat data kendaraan...' : 'Pilih kendaraan...'}
                    </option>
                    
                    {/* Render Data Kendaraan dari Database dengan format PDF */}
                    {kendaraanList.map((k) => (
                      <option key={k.id} value={k.id}>
                        [{k.no_polisi}] {k.nama_barang} {k.merk_type ? `- ${k.merk_type}` : ''}
                      </option>
                    ))}

                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: Detail Pemeliharaan */}
            <div className="bg-white p-5 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                <Wrench size={18} />
                <h3>DETAIL PEMELIHARAAN</h3>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => {
                  const hargaUnit = (item.jumlah > 0 && item.banyaknya > 0) ? (item.jumlah / item.banyaknya) : 0;

                  return (
                    <div key={item.id} className="flex gap-2 items-start border-b pb-4 last:border-0 group">
                      
                      {/* Grid Input Form */}
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        
                        <div className="col-span-12 md:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Nama Barang / Jasa</label>
                          <input 
                            type="text" 
                            placeholder="Contoh: Aki Kering" 
                            required 
                            value={item.namaBarang} 
                            onChange={(e) => updateItem(item.id, 'namaBarang', e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-medium placeholder:text-gray-400 placeholder:font-normal" 
                          />
                        </div>
                        
                        <div className="col-span-4 md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Banyaknya</label>
                          <input 
                            type="number" 
                            min="1" 
                            required 
                            value={item.banyaknya || ''} 
                            onChange={(e) => updateItem(item.id, 'banyaknya', Number(e.target.value))} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          />
                        </div>
                        
                        <div className="col-span-4 md:col-span-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                          <select 
                            value={item.unit} 
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-medium bg-white"
                          >
                            <option value="PCS">PCS</option>
                            <option value="Buah">Buah</option>
                            <option value="Set">Set</option>
                            <option value="Liter">Liter</option>
                          </select>
                        </div>
                        
                        <div className="col-span-4 md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Harga / Unit</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-600 text-sm font-medium">Rp</span>
                            <input 
                              type="text" 
                              disabled 
                              value={hargaUnit.toLocaleString('id-ID')} 
                              className="w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-sm font-semibold text-black" 
                            />
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah Biaya</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-600 text-sm font-medium">Rp</span>
                            <input 
                              type="number" 
                              required 
                              placeholder="0" 
                              value={item.jumlah || ''} 
                              onChange={(e) => updateItem(item.id, 'jumlah', Number(e.target.value))} 
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm text-black font-medium placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                            />
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Keterangan</label>
                          <input 
                            type="text" 
                            placeholder="Catatan..." 
                            value={item.keterangan} 
                            onChange={(e) => updateItem(item.id, 'keterangan', e.target.value)} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black font-medium placeholder:text-gray-400 placeholder:font-normal" 
                          />
                        </div>
                      </div>

                      {/* Tombol Hapus Baris */}
                      <div className="w-10 pt-6 flex justify-end shrink-0">
                        {items.length > 1 ? (
                          <button type="button" onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-md transition-colors" title="Hapus Item">
                            <Trash2 size={18} />
                          </button>
                        ) : (
                          <div className="w-9"></div> 
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              <div className="mt-4">
                <button type="button" onClick={addItem} className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 font-medium rounded-md hover:bg-blue-100 transition border border-blue-200">
                  <Plus size={16} /> Item Lain
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-right ml-auto mr-6">
            <span className="text-sm font-medium text-gray-500">Total Biaya:</span>
            <div className="text-xl font-bold text-blue-700">Rp {totalBiaya.toLocaleString('id-ID')}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition text-sm">
              Batal
            </button>
            <button type="submit" form="repair-form" className="px-4 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 transition shadow-sm text-sm flex items-center gap-2">
              <Wrench size={16} /> Ajukan Pemeliharaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}