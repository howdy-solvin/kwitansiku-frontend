<script setup>
import ProfileInfo from "@/components/ProfileInfo.vue";
import IconCetak from "@/components/icons/IconCetak.vue";
import IconSearch from "@/components/icons/IconSearch.vue";
import IconRekap from "@/components/icons/IconRekap.vue";
</script>
<template>
  <header class="w-full py-6">
    <div class="flex justify-between w-full font-poppins items-center">
      <div>
        <h1 class="font-semibold text-[35px]">Rekap Kwitansi Pasien</h1>
        <p class="mt-1">
          Rekap guna<span class="text-[#0075FF] font-semibold">
            mempermudah pendataan</span
          >
          dengan kwitansi !!
        </p>
      </div>
      <div class="flex gap-5">
        <button
          class="bg-[#0075FF] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]"
        >
          <IconCetak></IconCetak>
        </button>
        <ProfileInfo></ProfileInfo>
      </div>
    </div>
  </header>
  <main class="font-poppins mt-6">
    <section class="grid grid-cols-2">
      <div class="border border-gray-400 flex gap-3 w-fit rounded-md">
        <label class="text-center self-center px-4" for="search">
          <IconSearch></IconSearch>
        </label>
        <input
          class="w-[298px] outline-none"
          type="text"
          placeholder="Cari Berdasarkan Nama Sponsor"
          id="search"
          name="search"
        />
        <button class="bg-[#0075FF] p-4 text-white">Cari</button>
      </div>
      <div class="flex items-center place-self-end">
        <button
          type="button"
          class="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-[16px] text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          Filter Kwitansi Bulan Ini
          <svg
            class="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </section>
    <section>
      <table class="w-full mt-10 border-separate border border-slate-500">
        <thead class="bg-[#E3E3E3]">
          <tr>
            <th class="border border-slate-600">No</th>
            <th class="border border-slate-600">No. Kwitansi</th>
            <th class="border border-slate-600">Negara Tujuan</th>
            <th class="border border-slate-600">Nama Sponsor</th>
            <th class="border border-slate-600">Jumlah Pasien</th>
            <th class="border border-slate-600">Tanggal</th>
            <th class="border border-slate-600">Total Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border border-slate-600">
            <td class="border border-slate-600">1</td>
            <td class="border border-slate-600">001-KWITKI01423</td>
            <td class="border border-slate-600">PRA-HONGKONG</td>
            <td class="border border-slate-600">M SARIPUDIN</td>
            <td class="border border-slate-600">3 Orang</td>
            <td class="border border-slate-600">20-03-2024</td>
            <td class="border border-slate-600">150.000</td>
            <td class="border border-slate-600 text-center">
              <button class="bg-[#000000] p-2">
                <IconRekap></IconRekap>
              </button>
            </td>
          </tr>
          <tr class="border border-slate-600">
            <td class="border border-slate-600">2</td>
            <td class="border border-slate-600">002-KWITKI01427</td>
            <td class="border border-slate-600">PRA-HONGKONG</td>
            <td class="border border-slate-600">M SARIPUDIN</td>
            <td class="border border-slate-600">5 Orang</td>
            <td class="border border-slate-600">20-03-2024</td>
            <td class="border border-slate-600">150.000</td>
            <td class="border border-slate-600 text-center">
              <button class="bg-[#000000] p-2">
                <IconRekap></IconRekap>
              </button>
            </td>
          </tr>
          <tr class="border border-slate-600">
            <td class="border border-slate-600">3</td>
            <td class="border border-slate-600">001-KWITKI01423</td>
            <td class="border border-slate-600">PRA-HONGKONG</td>
            <td class="border border-slate-600">M SARIPUDIN</td>
            <td class="border border-slate-600">18 Orang</td>
            <td class="border border-slate-600">20-03-2024</td>
            <td class="border border-slate-600">2.700.000</td>
            <td class="border border-slate-600 text-center">
              <button class="bg-[#000000] p-2">
                <IconRekap></IconRekap>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>
