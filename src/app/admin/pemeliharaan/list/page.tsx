"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  Calendar,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

import { createClient } from "@/lib/supabase";

import VehicleRepairModal from "@/components/VehicleRepairModal";
import VehicleRepairDetailModal from "@/components/VehicleRepairDetailModal";
import VehicleRepairEditModal from "@/components/VehicleRepairEditModal";

// ==========================================
// TYPE
// ==========================================

interface VehicleRelation {
  nama_barang: string | null;
  merk_type: string | null;
  no_polisi: string | null;
}

interface PemeliharaanDetail {
  id: number;
  nama_barang: string | null;
  banyaknya: number | null;
  unit: string | null;
  harga_unit: number | null;
  jumlah: number | null;
  keterangan: string | null;
}

interface PemeliharaanItem {
  id: number;
  tanggal_pengajuan: string | null;
  bengkel_rekanan: string | null;
  total_biaya: number | null;
  kategori_pengeluaran: string | null;
  inventaris_kib_b:
    | VehicleRelation
    | VehicleRelation[]
    | null;
  pemeliharaan_detail:
    | PemeliharaanDetail[]
    | null;
}

interface YearData {
  tahun: number;
}

interface VehiclePlateData {
  no_polisi: string | null;
}

// ==========================================
// PAGE
// ==========================================

export default function PemeliharaanListPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  // ==========================================
  // DATA
  // ==========================================

  const [
    pemeliharaanList,
    setPemeliharaanList,
  ] = useState<PemeliharaanItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  // ==========================================
  // DATA FILTER TAHUN
  // ==========================================

  const [availableYears, setAvailableYears] =
    useState<number[]>([]);

  // ==========================================
  // DATA FILTER PLAT NOMOR
  // ==========================================

  const [availablePlates, setAvailablePlates] =
    useState<string[]>([]);

  // ==========================================
  // SEARCH
  // ==========================================

  const [searchQuery, setSearchQuery] =
    useState("");

  // ==========================================
  // FILTER
  // ==========================================

  const [showFilter, setShowFilter] =
    useState(false);

  const [filterTahun, setFilterTahun] =
    useState("");

  const [filterBulan, setFilterBulan] =
    useState("");

  const [
    filterKategori,
    setFilterKategori,
  ] = useState("");

  const [filterPlat, setFilterPlat] =
    useState("");

  // ==========================================
  // PAGINATION
  // ==========================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  // ==========================================
  // MODAL
  // ==========================================

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    isDetailModalOpen,
    setIsDetailModalOpen,
  ] = useState(false);

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [
    selectedDetailId,
    setSelectedDetailId,
  ] = useState<number | null>(null);

  const [
    selectedEditId,
    setSelectedEditId,
  ] = useState<number | null>(null);

  // ==========================================
  // EXPORT DROPDOWN
  // ==========================================

  const [
    isExportOpen,
    setIsExportOpen,
  ] = useState(false);

  // ==========================================
  // DAFTAR BULAN
  // ==========================================

  const months = [
    {
      value: "01",
      label: "Januari",
    },
    {
      value: "02",
      label: "Februari",
    },
    {
      value: "03",
      label: "Maret",
    },
    {
      value: "04",
      label: "April",
    },
    {
      value: "05",
      label: "Mei",
    },
    {
      value: "06",
      label: "Juni",
    },
    {
      value: "07",
      label: "Juli",
    },
    {
      value: "08",
      label: "Agustus",
    },
    {
      value: "09",
      label: "September",
    },
    {
      value: "10",
      label: "Oktober",
    },
    {
      value: "11",
      label: "November",
    },
    {
      value: "12",
      label: "Desember",
    },
  ];

  // ==========================================
  // FETCH AVAILABLE YEARS DARI PAGU
  // SAMA SEPERTI PAGE KENDARAAN
  // ==========================================

  const fetchAvailableYears = async () => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("pagu")
        .select("tahun")
        .order("tahun", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const years = (data || [])
        .map(
          (item) =>
            Number(
              (item as YearData).tahun
            )
        )
        .filter(
          (year) =>
            !Number.isNaN(year)
        );

      setAvailableYears(
        Array.from(
          new Set(years)
        ).sort(
          (a, b) => b - a
        )
      );
    } catch (error) {
      console.error(
        "Gagal mengambil daftar tahun PAGU:",
        error
      );

      setAvailableYears([]);
    }
  };

  // ==========================================
  // FETCH PLAT NOMOR DARI INVENTARIS
  // ==========================================

  const fetchAvailablePlates = async () => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("inventaris_kib_b")
        .select("no_polisi")
        .not(
          "no_polisi",
          "is",
          null
        )
        .order("no_polisi", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      const plates = (
        data || []
      )
        .map(
          (item) =>
            (
              item as VehiclePlateData
            ).no_polisi?.trim() || ""
        )
        .filter(
          (plate) =>
            plate !== ""
        );

      setAvailablePlates(
        Array.from(
          new Set(plates)
        )
      );
    } catch (error) {
      console.error(
        "Gagal mengambil daftar plat nomor:",
        error
      );

      setAvailablePlates([]);
    }
  };

  // ==========================================
  // FETCH DATA PEMELIHARAAN
  // ==========================================

  const fetchPemeliharaan = async () => {
    setIsLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase
        .from("pemeliharaan")
        .select(`
          id,
          tanggal_pengajuan,
          bengkel_rekanan,
          total_biaya,
          kategori_pengeluaran,
          inventaris_kib_b (
            nama_barang,
            merk_type,
            no_polisi
          ),
          pemeliharaan_detail (
            id,
            nama_barang,
            banyaknya,
            unit,
            harga_unit,
            jumlah,
            keterangan
          )
        `)
        .order(
          "tanggal_pengajuan",
          {
            ascending: false,
          }
        );

      if (error) {
        throw error;
      }

      const rawData =
        (data || []) as unknown as Array<{
          id: number;
          tanggal_pengajuan:
            | string
            | null;
          bengkel_rekanan:
            | string
            | null;
          total_biaya:
            | number
            | null;
          kategori_pengeluaran:
            | string
            | null;
          inventaris_kib_b:
            | VehicleRelation
            | VehicleRelation[]
            | null;
          pemeliharaan_detail:
            | PemeliharaanDetail[]
            | null;
        }>;

      const normalizedData: PemeliharaanItem[] =
        rawData.map((item) => ({
          id: item.id,

          tanggal_pengajuan:
            item.tanggal_pengajuan,

          bengkel_rekanan:
            item.bengkel_rekanan,

          total_biaya:
            item.total_biaya,

          kategori_pengeluaran:
            item.kategori_pengeluaran,

          inventaris_kib_b:
            Array.isArray(
              item.inventaris_kib_b
            )
              ? item.inventaris_kib_b[0] ??
                null
              : item.inventaris_kib_b,

          pemeliharaan_detail:
            item.pemeliharaan_detail ||
            [],
        }));

      setPemeliharaanList(
        normalizedData
      );
    } catch (error) {
      console.error(
        "Gagal mengambil data pemeliharaan:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengambil data.";

      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: message,
        confirmButtonColor:
          "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const loadInitialData =
      async () => {
        await Promise.all([
          fetchAvailableYears(),
          fetchAvailablePlates(),
          fetchPemeliharaan(),
        ]);
      };

    void loadInitialData();
    // Fetch hanya saat halaman dibuka
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // FILTER DATA
  // ==========================================

  const filteredPemeliharaanList =
    useMemo(() => {
      return pemeliharaanList.filter(
        (item) => {
          // ----------------------------------
          // SEARCH
          // ----------------------------------

          const search =
            searchQuery
              .trim()
              .toLowerCase();

          const namaKendaraan =
            Array.isArray(
              item.inventaris_kib_b
            )
              ? item
                  .inventaris_kib_b[0]
                  ?.nama_barang
                  ?.toLowerCase() ||
                ""
              : item
                  .inventaris_kib_b
                  ?.nama_barang
                  ?.toLowerCase() ||
                "";

          const merkType =
            Array.isArray(
              item.inventaris_kib_b
            )
              ? item
                  .inventaris_kib_b[0]
                  ?.merk_type
                  ?.toLowerCase() ||
                ""
              : item
                  .inventaris_kib_b
                  ?.merk_type
                  ?.toLowerCase() ||
                "";

          const platNomor =
            Array.isArray(
              item.inventaris_kib_b
            )
              ? item
                  .inventaris_kib_b[0]
                  ?.no_polisi
                  ?.toLowerCase() ||
                ""
              : item
                  .inventaris_kib_b
                  ?.no_polisi
                  ?.toLowerCase() ||
                "";

          const matchSearch =
            search === "" ||
            namaKendaraan.includes(
              search
            ) ||
            merkType.includes(search) ||
            platNomor.includes(
              search
            );

          // ----------------------------------
          // FILTER TAHUN
          // ----------------------------------

          const tahunData =
            item.tanggal_pengajuan
              ? item.tanggal_pengajuan.slice(
                  0,
                  4
                )
              : "";

          const matchTahun =
            filterTahun === "" ||
            tahunData ===
              filterTahun;

          // ----------------------------------
          // FILTER BULAN
          // ----------------------------------

          const bulanData =
            item.tanggal_pengajuan
              ? item.tanggal_pengajuan.slice(
                  5,
                  7
                )
              : "";

          const matchBulan =
            filterBulan === "" ||
            bulanData ===
              filterBulan;

          // ----------------------------------
          // FILTER KATEGORI
          // ----------------------------------

          const matchKategori =
            filterKategori === "" ||
            item.kategori_pengeluaran ===
              filterKategori;

          // ----------------------------------
          // FILTER PLAT NOMOR
          // ----------------------------------

          const matchPlat =
            filterPlat === "" ||
            (
              Array.isArray(
                item.inventaris_kib_b
              )
                ? item
                    .inventaris_kib_b[0]
                    ?.no_polisi || ""
                : item
                    .inventaris_kib_b
                    ?.no_polisi || ""
            ) === filterPlat;

          return (
            matchSearch &&
            matchTahun &&
            matchBulan &&
            matchKategori &&
            matchPlat
          );
        }
      );
    }, [
      pemeliharaanList,
      searchQuery,
      filterTahun,
      filterBulan,
      filterKategori,
      filterPlat,
    ]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalItems =
    filteredPemeliharaanList.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
          itemsPerPage
      )
    );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex +
    itemsPerPage;

  const paginatedList =
    filteredPemeliharaanList.slice(
      startIndex,
      endIndex
    );

  // ==========================================
  // SEARCH & FILTER HANDLER
  // ==========================================

  const handleSearchChange = (
    value: string
  ) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTahunChange = (
    value: string
  ) => {
    setFilterTahun(value);
    setCurrentPage(1);
  };

  const handleBulanChange = (
    value: string
  ) => {
    setFilterBulan(value);
    setCurrentPage(1);
  };

  const handleKategoriChange = (
    value: string
  ) => {
    setFilterKategori(value);
    setCurrentPage(1);
  };

  const handlePlatChange = (
    value: string
  ) => {
    setFilterPlat(value);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchQuery("");
    setFilterTahun("");
    setFilterBulan("");
    setFilterKategori("");
    setFilterPlat("");
    setCurrentPage(1);
  };

  // ==========================================
  // REFRESH DATA
  // ==========================================

  const refreshPageData =
    async () => {
      await Promise.all([
        fetchAvailableYears(),
        fetchAvailablePlates(),
        fetchPemeliharaan(),
      ]);

      setCurrentPage(1);
    };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    id: number,
    platNomor: string
  ) => {
    const result =
      await Swal.fire({
        title:
          "Apakah Anda yakin?",
        text: `Data pemeliharaan kendaraan ${platNomor} akan dihapus!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:
          "#dc2626",
        cancelButtonColor:
          "#cbd5e1",
        confirmButtonText:
          "Ya, Hapus!",
        cancelButtonText:
          "Batal",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const {
        error,
      } = await supabase
        .from("pemeliharaan")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data pemeliharaan berhasil dihapus.",
        confirmButtonColor:
          "#2563eb",
      });

      await refreshPageData();
    } catch (error) {
      console.error(
        "Gagal menghapus:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Gagal menghapus data.";

      Swal.fire({
        icon: "error",
        title: "Gagal Menghapus",
        text: message,
        confirmButtonColor:
          "#2563eb",
      });
    }
  };

// ==========================================
// DATA EXPORT DETAIL
// ==========================================

const exportRows: ExportRow[] =
  filteredPemeliharaanList.flatMap(
    (item, itemIndex): ExportRow[] => {
      const vehicle =
        Array.isArray(item.inventaris_kib_b)
          ? item.inventaris_kib_b[0] ?? null
          : item.inventaris_kib_b;

      const details =
        item.pemeliharaan_detail || [];

      // Jika tidak ada detail
      if (details.length === 0) {
        return [
          {
            no: itemIndex + 1,

            namaKendaraan:
              vehicle?.nama_barang || "-",

            platNomor:
              vehicle?.no_polisi || "-",

            kategori:
              item.kategori_pengeluaran || "-",

            totalBiaya:
              Number(item.total_biaya || 0),

            namaBarangJasa: "-",

            // HARUS NUMBER, jangan "-"
            banyaknya: 0,

            unit: "-",

            hargaUnit: 0,

            jumlahBiaya: 0,

            keterangan: "-",
          },
        ];
      }

      // Jika ada detail
      return details.map(
        (detail): ExportRow => ({
          no: itemIndex + 1,

          namaKendaraan:
            vehicle?.nama_barang || "-",

          platNomor:
            vehicle?.no_polisi || "-",

          kategori:
            item.kategori_pengeluaran || "-",

          totalBiaya:
            Number(item.total_biaya || 0),

          namaBarangJasa:
            detail.nama_barang || "-",

          banyaknya:
            Number(detail.banyaknya || 0),

          unit:
            detail.unit || "-",

          hargaUnit:
            Number(detail.harga_unit || 0),

          jumlahBiaya:
            Number(detail.jumlah || 0),

          keterangan:
            detail.keterangan || "-",
        })
      );
    }
  );

  // ==========================================
  // EXPORT EXCEL
  // ==========================================

  const exportToExcel = () => {
  if (exportRows.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Tidak Ada Data",
      text: "Tidak ada data yang dapat diekspor.",
      confirmButtonColor: "#2563eb",
    });

    return;
  }

  const exportData = exportRows.map((row: ExportRow) => ({
    No: row.no,
    "Nama Kendaraan": row.namaKendaraan,
    "Plat Nomor": row.platNomor,
    "Kategori Pengeluaran": row.kategori,
    "Total Biaya": row.totalBiaya,
    "Nama Barang / Jasa": row.namaBarangJasa,
    Banyaknya: row.banyaknya,
    Unit: row.unit,
    "Harga / Unit": row.hargaUnit,
    "Jumlah Biaya": row.jumlahBiaya,
    Keterangan: row.keterangan,
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 30 },
    { wch: 18 },
    { wch: 25 },
    { wch: 18 },
    { wch: 30 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 30 },
  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Pemeliharaan"
  );

  XLSX.writeFile(
    workbook,
    "daftar-pemeliharaan-kendaraan.xlsx"
  );

  setIsExportOpen(false);
};

  // ==========================================
  // EXPORT PDF
  // ==========================================

  const exportToPDF = () => {
  if (exportRows.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Tidak Ada Data",
      text: "Tidak ada data yang dapat diekspor.",
      confirmButtonColor: "#2563eb",
    });

    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(15);

  doc.text(
    "Daftar Pemeliharaan Kendaraan",
    14,
    15
  );

  const filterInfo: string[] = [];

  if (filterTahun) {
    filterInfo.push(
      `Tahun: ${filterTahun}`
    );
  }

  if (filterBulan) {
    const selectedMonth =
      months.find(
        (month) =>
          month.value === filterBulan
      );

    if (selectedMonth) {
      filterInfo.push(
        `Bulan: ${selectedMonth.label}`
      );
    }
  }

  if (filterPlat) {
    filterInfo.push(
      `Plat: ${filterPlat}`
    );
  }

  if (filterKategori) {
    filterInfo.push(
      `Kategori: ${filterKategori}`
    );
  }

  if (searchQuery) {
    filterInfo.push(
      `Pencarian: ${searchQuery}`
    );
  }

  if (filterInfo.length > 0) {
    doc.setFontSize(8);

    doc.text(
      filterInfo.join(" | "),
      14,
      21
    );
  }

  const body: (
    | string
    | number
  )[][] = exportRows.map(
    (row: ExportRow) => [
      row.no,
      row.namaKendaraan,
      row.platNomor,
      row.kategori,
      `Rp ${row.totalBiaya.toLocaleString(
        "id-ID"
      )}`,
      row.namaBarangJasa,
      row.banyaknya,
      row.unit,
      `Rp ${row.hargaUnit.toLocaleString(
        "id-ID"
      )}`,
      `Rp ${row.jumlahBiaya.toLocaleString(
        "id-ID"
      )}`,
      row.keterangan,
    ]
  );

  autoTable(doc, {
    startY:
      filterInfo.length > 0
        ? 27
        : 22,

    head: [
      [
        "No",
        "Nama Kendaraan",
        "Plat Nomor",
        "Kategori",
        "Total Biaya",
        "Nama Barang / Jasa",
        "Banyaknya",
        "Unit",
        "Harga / Unit",
        "Jumlah Biaya",
        "Keterangan",
      ],
    ],

    body,

    theme: "grid",

    styles: {
      fontSize: 6.5,
      cellPadding: 2,
      valign: "middle",
    },

    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 6.5,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 32 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 35 },
      6: { cellWidth: 16 },
      7: { cellWidth: 16 },
      8: { cellWidth: 25 },
      9: { cellWidth: 25 },
      10: { cellWidth: 35 },
    },
  });

  doc.save(
    "daftar-pemeliharaan-kendaraan.pdf"
  );

  setIsExportOpen(false);
};

  // ==========================================
  // FORMAT RUPIAH
  // ==========================================

  const formatRupiah = (
    value: number | null
  ) => {
    return `Rp ${Number(
      value || 0
    ).toLocaleString(
      "id-ID"
    )}`;
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daftar Pemeliharaan Kendaraan
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Kelola dan monitor data pemeliharaan kendaraan secara terpusat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">

          {/* SEARCH */}

          <div className="relative w-full sm:flex-1 sm:min-w-64 xl:w-72">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari plat nomor atau nama kendaraan..."
              value={
                searchQuery
              }
              onChange={(e) =>
                handleSearchChange(
                  e.target.value
                )
              }
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">

            {/* FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilter(
                  !showFilter
                )
              }
              className={`flex justify-center items-center gap-2 border text-sm font-semibold py-2.5 px-3 rounded-lg transition-all shadow-sm ${
                showFilter
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} />

              <span>
                Filter
              </span>
            </button>

            {/* EXPORT */}

            <div className="relative w-full sm:w-auto">

              <button
                type="button"
                onClick={() =>
                  setIsExportOpen(
                    !isExportOpen
                  )
                }
                className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm text-sm font-semibold py-2.5 px-3 rounded-lg transition-all"
              >
                <Download
                  size={16}
                  className="text-slate-500"
                />

                <span>
                  Export
                </span>

                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${
                    isExportOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {isExportOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30">

                  <button
                    type="button"
                    onClick={
                      exportToExcel
                    }
                    className="w-full text-left px-4 py-2.5 text-sm text-emerald-600 hover:bg-slate-50 transition-colors font-semibold"
                  >
                    Excel (.xlsx)
                  </button>

                  <button
                    type="button"
                    onClick={
                      exportToPDF
                    }
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-slate-50 transition-colors font-semibold"
                  >
                    PDF (.pdf)
                  </button>

                </div>
              )}

            </div>

            {/* AJUKAN */}

            <button
              type="button"
              onClick={() =>
                setIsModalOpen(
                  true
                )
              }
              className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={18} />

              <span>
                Ajukan
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* FILTER PANEL */}
      {/* ========================================== */}

      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row flex-wrap items-start xl:items-center gap-4 animate-in slide-in-from-top-2 duration-200">

          {/* TAHUN */}

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <Calendar
              size={16}
              className="text-slate-400"
            />

            <span className="text-sm font-semibold text-slate-700">
              Tahun:
            </span>

            <select
              value={
                filterTahun
              }
              onChange={(e) =>
                handleTahunChange(
                  e.target.value
                )
              }
              className="flex-1 sm:w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="">
                Semua
              </option>

              {availableYears.map(
                (year) => (
                  <option
                    key={
                      year
                    }
                    value={
                      year.toString()
                    }
                  >
                    Tahun Anggaran{" "}
                    {year}
                  </option>
                )
              )}

            </select>

          </div>

          {/* BULAN */}

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <span className="text-sm font-semibold text-slate-700">
              Bulan:
            </span>

            <select
              value={
                filterBulan
              }
              onChange={(e) =>
                handleBulanChange(
                  e.target.value
                )
              }
              className="flex-1 sm:w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="">
                Semua
              </option>

              {months.map(
                (month) => (
                  <option
                    key={
                      month.value
                    }
                    value={
                      month.value
                    }
                  >
                    {
                      month.label
                    }
                  </option>
                )
              )}

            </select>

          </div>

          {/* PLAT NOMOR */}

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <span className="text-sm font-semibold text-slate-700">
              Plat:
            </span>

            <select
              value={
                filterPlat
              }
              onChange={(e) =>
                handlePlatChange(
                  e.target.value
                )
              }
              className="flex-1 sm:w-44 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >

              <option value="">
                Semua Plat
              </option>

              {availablePlates.map(
                (plate) => (
                  <option
                    key={
                      plate
                    }
                    value={
                      plate
                    }
                  >
                    {plate}
                  </option>
                )
              )}

            </select>

          </div>

          {/* KATEGORI */}

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <span className="text-sm font-semibold text-slate-700">
              Kategori:
            </span>

            <select
              value={
                filterKategori
              }
              onChange={(e) =>
                handleKategoriChange(
                  e.target.value
                )
              }
              className="flex-1 sm:w-48 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >

              <option value="">
                Semua
              </option>

              <option value="Bensin">
                Bensin
              </option>

              <option value="Pemeliharaan">
                Pemeliharaan
              </option>

              <option value="Lainnya">
                Lainnya
              </option>

            </select>

          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={
              handleResetFilter
            }
            className="flex items-center justify-center gap-2 text-sm text-red-600 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg w-full sm:w-auto xl:ml-auto transition-colors"
          >
            <X size={15} />

            Reset Filter
          </button>

        </div>
      )}

      {/* ========================================== */}
      {/* TABLE */}
      {/* ========================================== */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full">

        <div className="overflow-x-auto w-full">

          <table className="min-w-full text-left border-collapse whitespace-nowrap">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">

                <th className="px-6 py-4 w-16">
                  No
                </th>

                <th className="px-6 py-4">
                  Nama Kendaraan
                </th>

                <th className="px-6 py-4">
                  Plat Nomor
                </th>

                <th className="px-6 py-4">
                  Kategori Pengeluaran
                </th>

                <th className="px-6 py-4">
                  Total Biaya
                </th>

                <th className="px-6 py-4 text-center w-40">
                  Aksi
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">

              {isLoading ? (
                Array.from(
                  {
                    length: 5,
                  }
                ).map(
                  (_, index) => (
                    <tr
                      key={
                        index
                      }
                      className="animate-pulse"
                    >

                      <td className="px-6 py-5">
                        <div className="h-4 w-6 bg-slate-200 rounded-md" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-4 w-48 bg-slate-200 rounded-md" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-4 w-28 bg-slate-200 rounded-md" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-6 w-24 bg-slate-200 rounded-full" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="h-4 w-28 bg-slate-200 rounded-md" />
                      </td>

                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-2">
                          <div className="h-7 w-7 bg-slate-200 rounded-md" />
                          <div className="h-7 w-7 bg-slate-200 rounded-md" />
                          <div className="h-7 w-7 bg-slate-200 rounded-md" />
                        </div>
                      </td>

                    </tr>
                  )
                )
              ) : paginatedList.length >
                0 ? (

                paginatedList.map(
                  (
                    item,
                    index
                  ) => {
                    const vehicle =
                      Array.isArray(
                        item.inventaris_kib_b
                      )
                        ? item
                            .inventaris_kib_b[0]
                        : item
                            .inventaris_kib_b;

                    return (
                      <tr
                        key={
                          item.id
                        }
                        className="hover:bg-slate-50/80 transition-colors"
                      >

                        <td className="px-6 py-4 text-slate-500">
                          {startIndex +
                            index +
                            1}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-900">
                          {
                            vehicle
                              ?.nama_barang ||
                            "-"
                          }

                          {vehicle
                            ?.merk_type
                            ? ` - ${vehicle.merk_type}`
                            : ""}
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-900">
                          {
                            vehicle
                              ?.no_polisi ||
                            "-"
                          }
                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {
                              item.kategori_pengeluaran ||
                              "Pemeliharaan"
                            }
                          </span>

                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {formatRupiah(
                            item.total_biaya
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">

                          <div className="flex items-center justify-center gap-1.5">

                            {/* DETAIL */}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDetailId(
                                  item.id
                                );

                                setIsDetailModalOpen(
                                  true
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEditId(
                                  item.id
                                );

                                setIsEditModalOpen(
                                  true
                                );
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Data"
                            >
                              <Edit
                                size={16}
                              />
                            </button>

                            {/* PRINT */}

                            <button
                              type="button"
                              onClick={() => {
                                Swal.fire({
                                  icon: "info",
                                  title:
                                    "Cetak",
                                  text:
                                    "Fitur cetak belum diubah dan tetap menggunakan aksi yang tersedia.",
                                  confirmButtonColor:
                                    "#2563eb",
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Cetak"
                            >
                              <Printer
                                size={16}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item.id,
                                  vehicle
                                    ?.no_polisi ||
                                    "-"
                                )
                              }
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus Data"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Tidak ada data pemeliharaan yang cocok dengan filter.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ========================================== */}
        {/* PAGINATION */}
        {/* ========================================== */}

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">

          <span className="text-sm text-slate-500 font-medium">

            Menampilkan{" "}

            {totalItems ===
            0
              ? 0
              : startIndex +
                1}

            -

            {Math.min(
              endIndex,
              totalItems
            )}{" "}

            dari{" "}
            {
              totalItems
            }{" "}
            data

          </span>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">

            {/* ROWS */}

            <div className="flex items-center gap-2">

              <span className="text-sm font-medium text-slate-700">
                Rows per page
              </span>

              <select
                value={
                  itemsPerPage
                }
                onChange={(e) => {
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(
                    1
                  );
                }}
                className="border border-slate-200 rounded-md px-2 py-1 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white cursor-pointer"
              >

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>

              </select>

            </div>

            {/* NAVIGATION */}

            <div className="flex items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      Math.max(
                        prev -
                          1,
                        1
                      )
                  )
                }
                disabled={
                  currentPage ===
                    1 ||
                  totalPages ===
                    0
                }
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-700 transition-colors"
              >

                <ChevronLeft
                  size={18}
                />

                Previous

              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      Math.min(
                        prev +
                          1,
                        totalPages
                      )
                  )
                }
                disabled={
                  currentPage ===
                    totalPages ||
                  totalPages ===
                    0
                }
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-700 transition-colors"
              >

                Next

                <ChevronRight
                  size={18}
                />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* MODALS */}
      {/* ========================================== */}

      <VehicleRepairModal
        isOpen={
          isModalOpen
        }
        onClose={() => {
          setIsModalOpen(
            false
          );

          void refreshPageData();
        }}
      />

      <VehicleRepairDetailModal
        isOpen={
          isDetailModalOpen
        }
        onClose={() =>
          setIsDetailModalOpen(
            false
          )
        }
        pemeliharaanId={
          selectedDetailId
        }
      />

      <VehicleRepairEditModal
        isOpen={
          isEditModalOpen
        }
        onClose={() =>
          setIsEditModalOpen(
            false
          )
        }
        pemeliharaanId={
          selectedEditId
        }
        onSaved={(updatedData) => {
          setPemeliharaanList(
            (prev) =>
              prev.map(
                (item) =>
                  item.id ===
                  updatedData.id
                    ? {
                        ...item,

                        tanggal_pengajuan:
                          updatedData.tanggal_pengajuan,

                        bengkel_rekanan:
                          updatedData.bengkel_rekanan,

                        total_biaya:
                          updatedData.total_biaya,

                        kategori_pengeluaran:
                          updatedData.kategori_pengeluaran,

                        inventaris_kib_b:
                          updatedData.inventaris_kib_b,
                      }
                    : item
              )
          );

          void refreshPageData();
        }}
      />

    </div>
  );
}