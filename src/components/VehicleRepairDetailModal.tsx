"use client";

import React, { useState, useEffect } from 'react';
import { X, Info, Wrench, Printer } from 'lucide-react';
import { createClient } from "@/lib/supabase";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pemeliharaanId: number | null;
}

export default function VehicleRepairDetailModal({ isOpen, onClose, pemeliharaanId }: DetailModalProps) {
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && pemeliharaanId) {
      const fetchDetail = async () => {
        setIsLoading(true);
        try {
          // Query sakti: Mengambil Header, Relasi Kendaraan, dan Array Detail Barang sekaligus!
          const { data: detailData, error } = await supabase
            .from('pemeliharaan')
            .select(`
              *,
              inventaris_kib_b ( nama_barang, merk_type, no_polisi ),
              pemeliharaan_detail ( * )
            `)
            .eq('id', pemeliharaanId)
            .single();

          if (error) throw error;
          setData(detailData);
        } catch (error) {
          console.error("Gagal mengambil detail:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDetail();
    } else {
      setData(null); // Reset data saat ditutup
    }
  }, [isOpen, pemeliharaanId, supabase]);

  if (!isOpen) return null;

  // Format Tanggal (Opsional, agar lebih enak dibaca)
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-7xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col mx-4">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Pemeliharaan Kendaraan</h2>
            <p className="text-sm text-gray-500">Rincian data pengajuan yang telah tersimpan di sistem.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal (Scrollable) */}
        <div className="overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar p-6">
          {isLoading || !data ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p>Memuat detail data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* SECTION 1: Informasi Pengajuan (Read-Only) */}
              <div className="bg-white p-5 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-semibold">
                  <Info size={18} />
                  <h3>INFORMASI PENGAJUAN</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Tanggal Pengajuan</label>
                    <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                      {formatDate(data.tanggal_pengajuan)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bengkel Rekanan</label>
                    <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                      {data.bengkel_rekanan}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kendaraan</label>
                    <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                      [{data.inventaris_kib_b?.no_polisi}] {data.inventaris_kib_b?.nama_barang} {data.inventaris_kib_b?.merk_type ? `- ${data.inventaris_kib_b?.merk_type}` : ''}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kategori Pengeluaran</label>
                    <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                      {data.kategori_pengeluaran || 'Pemeliharaan'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Detail Pemeliharaan (Read-Only) */}
              <div className="bg-white rounded-lg border shadow-sm flex flex-col">
                <div className="bg-gray-50 p-5 border-b rounded-t-lg">
                  <div className="flex items-center gap-2 text-blue-600 font-semibold">
                    <Wrench size={18} />
                    <h3>DETAIL PEMELIHARAAN BARANG / JASA</h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {data.pemeliharaan_detail && data.pemeliharaan_detail.length > 0 ? (
                    data.pemeliharaan_detail.map((item: any, index: number) => (
                      <div key={item.id} className="flex gap-2 items-start border-b pb-4 last:border-0">
                        <div className="grid grid-cols-12 gap-3 flex-1">
                          
                          <div className="col-span-12 md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nama Barang / Jasa</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                              {item.nama_barang}
                            </div>
                          </div>
                          
                          <div className="col-span-4 md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Banyaknya</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium text-center">
                              {item.banyaknya}
                            </div>
                          </div>
                          
                          <div className="col-span-4 md:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium text-center">
                              {item.unit}
                            </div>
                          </div>
                          
                          <div className="col-span-4 md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Harga / Unit</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium">
                              Rp {Number(item.harga_unit).toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Jumlah Biaya</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-emerald-50 rounded-md text-sm text-emerald-800 font-bold">
                              Rp {Number(item.jumlah).toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-3">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Keterangan</label>
                            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-sm text-gray-800 font-medium min-h-[38px] break-words">
                              {item.keterangan || '-'}
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">Tidak ada detail barang untuk pengajuan ini.</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between shrink-0">
          <div className="text-right ml-auto mr-6">
            <span className="text-sm font-medium text-gray-500">Total Keseluruhan:</span>
            <div className="text-xl font-bold text-blue-700">
              Rp {data ? Number(data.total_biaya).toLocaleString('id-ID') : 0}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition text-sm flex items-center gap-2">
               <Printer size={16} /> Cetak
            </button>
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 rounded-md text-white font-medium hover:bg-slate-900 transition shadow-sm text-sm">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}