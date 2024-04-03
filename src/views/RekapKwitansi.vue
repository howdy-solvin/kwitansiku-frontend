<script>
import ProfileInfo from "@/components/ProfileInfo.vue";
import IconCetak from "@/components/icons/IconCetak.vue";
import IconSearch from "@/components/icons/IconSearch.vue";
import IconRekap from "@/components/icons/IconRekap.vue";
import { watchEffect, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  components: { ProfileInfo, IconRekap, IconSearch, IconCetak },

  setup() {
    const store = useStore();
    const router = useRouter();

    // Ambil data kwitansi dari state menggunakan getter
    const receipts = computed(() => store.getters["allReceipts"]);

    // Panggil action fetchReceipts saat komponen dimuat
    watchEffect(() => {
      store.dispatch("fetchReceipts");
    });

    const getUid = async (index) => {
      const receipts = store.getters["allReceipts"];
      const uuid = receipts[index].uuid;
      const response = await store.dispatch("fetchReceiptsPatient", uuid);
      if (response.code == 200) {
        router.push("/pasien-tki");
      }
    };
    return {
      receipts,
      getUid,
    };
  },
};
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
      <table class="w-full border-separate border-spacing-y-3 mt-10">
        <thead class="">
          <tr class="bg-[#E3E3E3]">
            <th class="rounded-s-md border-t-2 border-b-2 border-l-2 text-left px-4 py-3">
              No
            </th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">No. Kwitansi</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">Nama Sponsor</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">J. Pasien</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">Tanggal</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">T. Harga</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">Bayar</th>
            <th class="border-t-2 border-b-2 text-left px-4 py-3">Edit</th>
            <th class="rounded-e-md border-t-2 border-b-2 border-r-2 text-left px-4 py-3">
              Cetak
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="mt-4" v-for="(receipt, index) in receipts" :key="receipt.id">
            <td
              class="border-[#A2A2A2] rounded-s-md border-t-2 border-b-2 border-l-2 px-4 py-3"
            >
              {{ index + 1 }}
            </td>
            <td class="border-[#A2A2A2] border-t-2 border-b-2 px-4 py-3">
              001-KWITKI01423
            </td>
            <td class="border-[#A2A2A2] border-t-2 border-b-2 px-4 py-3">
              {{ receipt.nama_sponsor }}
            </td>
            <td class="border-[#A2A2A2] border-t-2 border-b-2 px-4 py-3">
              {{ receipt.total_pendaftar }} <span>Orang</span>
            </td>
            <td class="border-[#A2A2A2] border-t-2 border-b-2 px-4 py-3">
              {{ receipt.tanggal }}
            </td>
            <td class="border-[#A2A2A2] border-t-2 border-b-2 px-4 py-3">
              {{ receipt.total_harga }}
            </td>
            <td
              class="border-[#A2A2A2] border-t-2 border-b-2 border-r-2 rounded-e-md px-4 py-3"
            >
              {{ receipt.total_pembayaran }}
            </td>
            <td class="text-center">
              <button
                @click="getUid(index)"
                class="bg-[#000000] p-3 w-full flex items-center justify-center rounded-md h-full"
              >
                <IconRekap class=""></IconRekap>
              </button>
            </td>
            <td class="text-center">
              <button
                class="bg-[#0075FF] p-3 w-full flex items-center justify-center rounded-md h-full shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]"
              >
                <IconCetak></IconCetak>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>
