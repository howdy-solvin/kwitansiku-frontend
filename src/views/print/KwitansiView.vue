<script>
import CetakKuitansi from '@/components/icons/CetakKuitansi.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  components: { CetakKuitansi },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = ref(true)
    const kwitansi = computed(() => store.getters['getterRekap'])
    const kwitansiSection = ref(null)
    const pasienSection = ref(null)

    const admin = computed(() => store.getters['admin'])

    const isAdminLoggedIn = computed(() => {
      if (admin.value.data && admin.value.data.nama) {
        return admin.value.data.nama
      } else {
        return 'SRI MARYANA'
      }
    })

    onBeforeMount(async () => {
      const uuid = router.currentRoute.value.query.id
      await store
        .dispatch('fetchReceiptsPatient', uuid)
        .then((res) => {
          console.log(res)
          if (res.data === undefined) router.replace('/rekap-kwitansi')
        })
        .finally(() => (isLoading.value = false))
    })

    const printModal = () => {
      if (kwitansiSection.value) {
        kwitansiSection.value.classList.add('enable-print-view-kwitansi')
        pasienSection.value.classList.remove('enable-print-view-kwitansi')
        window.print()
      }
    }
    const printDetailModal = () => {
      if (pasienSection.value) {
        kwitansiSection.value.classList.remove('enable-print-view-kwitansi') // Menghapus kelas 'enable-print-view-kwitansi' dari kwitansi-section
        pasienSection.value.classList.add('enable-print-view-kwitansi')
        window.print()
      }
    }

    return {
      kwitansi,
      kwitansiSection,
      printModal,
      printDetailModal,
      isAdminLoggedIn,
      isLoading,
      pasienSection
    }
  }
}
</script>
<template>
  <div class="screen bg-[#1a1a1a] p-0 m-0 w-screen min-h-screen h-full">
    <div class="container max-w-[950px] bg-white p-0 m-0 h-fit mx-auto pt-3">
      <header class="px-5">
        <div
          class="w-full border rounded-lg ps-5 py-1 pe-1 mb-10 flex items-stretch gap-2 justify-between"
        >
          <div class="grow">
            <h4 class="font-bold text-lg">
              Kwitansi
              <span v-if="kwitansi.no_pendaftaran">
                {{ kwitansi.no_pendaftaran }}
              </span>
              <span
                v-else
                class="w-14 inline-block h-6 translate-y-1 animate-pulse bg-gray-400 rounded-md"
              ></span>
            </h4>
            <p>
              <span v-if="kwitansi.tanggal" class="text-blue-500 font-semibold"
                >{{ kwitansi.tanggal }} </span
              ><span
                v-else
                class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
              ></span>
              |
              <span v-if="kwitansi.nama_sponsor">
                {{ kwitansi.nama_sponsor }}
              </span>
              <span
                v-else
                class="w-14 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
              ></span>
            </p>
          </div>
          <button
            :disabled="isLoading"
            @click="printModal"
            class="bg-[#0075FF] group p-[13px] hover:bg-[#2260a8] transition-all rounded-lg flex items-center justify-center hover:gap-3 gap-0 text-white"
          >
            <p class="w-0 h-0 group-hover:w-fit group-hover:h-fit overflow-hidden">
              Cetak Kuitansi
            </p>
            <CetakKuitansi></CetakKuitansi>
          </button>
          <button
            :disabled="isLoading"
            @click="printDetailModal"
            class="bg-[#20b648] group p-[13px] transition-all hover:bg-[#219a41] rounded-lg flex justify-center items-center hover:gap-3 gap-0 text-white"
          >
            <p class="w-0 h-0 group-hover:w-fit group-hover:h-fit overflow-hidden">Cetak Pasien</p>
            <CetakKuitansi></CetakKuitansi>
          </button>
        </div>
      </header>
      <main class="bg-[#1a1a1a] pb-10">
        <section ref="kwitansiSection" id="kwitansi" class="bg-white px-5 pb-5">
          <div class="flex justify-between items-center">
            <img
              class="w-[80px] h-[80px] object-contain"
              src="../../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-right">
              <h1 class="font-bold text-lg">KLINIK GORA MATARAM</h1>
              <p>Jl. RA. Kartini No. 77 Mojok - Mataram - NTB Mataram</p>
              <p>Indonesia - Telp.(0370) 635661 Fax (0370) 635661</p>
              <p>goraklinik@gmail.com</p>
            </div>
          </div>

          <div>
            <div
              v-if="kwitansi.total_harga <= kwitansi.total_pembayaran"
              class="absolute left-1/2 -translate-x-1/2 top-1/2 transform rotate-45 text-black/10 -translate-y-1/2 text-[130px] font-semibold"
            >
              LUNAS
            </div>
            <div class="flex flex-col items-center">
              <h1 class="font-bold text-[25px] text-center">KWITANSI PEMBAYARAN</h1>
              <div class="w-[40%] border h-1 bg-black" />
              <p v-if="kwitansi.tanggal" class="text-center">
                NO :
                {{
                  kwitansi.tanggal.split('-')[0].slice(2, 4) +
                  kwitansi.tanggal.split('-')[1] +
                  kwitansi.tanggal.split('-')[2]
                }}01{{ kwitansi.no_pendaftaran }}
              </p>
              <p v-else class="text-center">
                NO :
                <span
                  class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </p>
            </div>
            <div class="flex w-full justify-end gap-2 mt-3">
              <p class="w-[180px] text-end">Tanggal / No. Daftar</p>
              <p v-if="kwitansi.tanggal && kwitansi.no_pendaftaran" class="text-end">
                : {{ kwitansi.tanggal }} / {{ kwitansi.no_pendaftaran }}
              </p>
              <p v-else>
                <span
                  class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                ></span>
                /
                <span
                  class="w-5 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </p>
            </div>
            <ul class="flex flex-col gap-2">
              <li class="flex justify-between">
                <div class="flex gap-8">
                  <p class="w-[150px]">Nama PJ-TKI</p>
                  <p v-if="kwitansi.nama_penanggungjawab">: {{ kwitansi.nama_penanggungjawab }}</p>
                  <p v-else>
                    :
                    <span
                      class="w-40 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span>
                  </p>
                </div>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Nama Sponsor</p>
                <p v-if="kwitansi.nama_sponsor">: {{ kwitansi.nama_sponsor }}</p>
                <p v-else>
                  :
                  <span
                    class="w-16 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Untuk Pembayaran</p>
                <p>:</p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Jumlah Peserta</p>
                <p v-if="kwitansi.total_pendaftar">: {{ kwitansi.total_pendaftar }} Orang</p>
                <p v-else>
                  :
                  <span
                    class="w-4 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                  Orang
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Total Harga</p>
                <p v-if="kwitansi.total_harga">: Rp. {{ kwitansi.total_harga }},-</p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Pembayaran</p>
                <p v-if="kwitansi.total_pembayaran">: Rp. {{ kwitansi.total_pembayaran }},-</p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Sisa Kredit</p>
                <p v-if="kwitansi.total_harga && kwitansi.total_pembayaran">
                  : Rp. {{ kwitansi.total_harga - kwitansi.total_pembayaran }},-
                </p>
                <p v-else>
                  :
                  <span
                    class="w-16 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
            </ul>
            <div class="mt-7 flex justify-betweens w-full">
              <div class="w-full">
                <p>NB. -Detail Terlampir</p>
              </div>
              <div class="w-full flex flex-col items-center">
                <p v-if="kwitansi.tanggal">Mataram, {{ kwitansi.tanggal }}</p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
                <p>Kasir</p>
                <p class="mt-16">{{ isAdminLoggedIn }}</p>
              </div>
            </div>
          </div>
        </section>
        <section ref="pasienSection" id="pasien" class="bg-white px-5 mt-5 pb-5">
          <div class="flex justify-between items-center">
            <img
              class="w-[80px] h-[80px] object-contain"
              src="../../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-right">
              <h1 class="font-bold text-lg">KLINIK GORA MATARAM</h1>
              <p>Jl. RA. Kartini No. 77 Mojok - Mataram - NTB Mataram</p>
              <p>Indonesia - Telp.(0370) 635661 Fax (0370) 635661</p>
              <p>goraklinik@gmail.com</p>
            </div>
          </div>

          <div>
            <ul class="flex flex-col gap-1 mt-10">
              <li class="flex gap-8">
                <p class="w-[150px]">Tanggal / No. Daftar</p>
                <p v-if="kwitansi.tanggal && kwitansi.no_pendaftaran">
                  : {{ kwitansi.tanggal }}/{{ kwitansi.no_pendaftaran }}
                </p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Nama PJ-TKI</p>
                <p v-if="kwitansi.nama_penanggungjawab">: {{ kwitansi.nama_penanggungjawab }}</p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
              <li class="flex gap-8">
                <p class="w-[150px]">Nama Sponsor</p>
                <p v-if="kwitansi.nama_sponsor">: {{ kwitansi.nama_sponsor }}</p>
                <p v-else>
                  :
                  <span
                    class="w-24 inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </p>
              </li>
            </ul>
            <table class="w-full mt-5">
              <thead>
                <tr class="border-b-4 border-b-black">
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">No.</h1>
                  </th>
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">Nama Lengkap</h1>
                  </th>
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">Jenis Medikal</h1>
                  </th>
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">Register</h1>
                  </th>
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">Harga</h1>
                  </th>
                  <th class="border border-black px-3 py-1">
                    <h1 class="font-medium text-start">Bayar</h1>
                  </th>
                </tr>
              </thead>
              <tbody class="text-sm" v-for="(item, index) in kwitansi.pasien_tkis" :key="index">
                <tr>
                  <td class="px-3 py-1">
                    <p class="text-start">{{ index + 1 }}</p>
                  </td>
                  <td class="px-3 py-1">
                    <p class="text-start">{{ item.nama_lengkap }}</p>
                  </td>
                  <td class="px-3 py-1">
                    <p class="text-start">{{ item.negara_tujuan }}</p>
                  </td>
                  <td class="px-3 py-1">
                    <p class="text-start">{{ item.no_form }}</p>
                  </td>
                  <td class="px-3 py-1">
                    <p class="text-start">{{ item.harga }}</p>
                  </td>
                  <td class="px-3 py-1">
                    <p class="text-start">
                      {{ kwitansi.total_pembayaran / kwitansi.pasien_tkis.length }}
                    </p>
                  </td>
                </tr>
              </tbody>
              <tbody class="text-sm font-semibold italic">
                <tr>
                  <td class="px-3 py-1 border border-black" colspan="4">Total Keseluruhan</td>
                  <td class="px-3 py-1 border border-black">{{ kwitansi.total_harga }}</td>
                  <td class="px-3 py-1 border border-black">
                    {{ kwitansi.total_pembayaran }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
<style scoped>
@media print {
  html,
  body,
  header,
  main {
    visibility: hidden;
    font-size: 12px;
  }

  *:not(.enable-print-view-kwitansi *) {
    visibility: hidden;
    height: 0 !important;
    padding: 0;
    margin: 0;
  }

  header {
    height: 0;
    padding: 0;
    margin: 0;
  }

  #pasien {
    padding: 0;
    margin: 0;
  }

  .screen,
  .container {
    padding: 0;
    margin: 0;
    background-color: transparent;
    width: 100%;
  }

  .screen {
    padding: 15px 15px;
  }

  @page kwitansi {
    size: 21.7cm 13.8cm !important;
}

.enable-print-view-kwitansi, .enable-print-view-kwitansi * {
    page: kwitansi;
    visibility: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
