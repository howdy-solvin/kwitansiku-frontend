<script>
import CetakKuitansi from '@/components/icons/CetakKuitansi.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import printJS from 'print-js'

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
        // kwitansiSection.value.classList.add('enable-print-view-kwitansi')
        // pasienSection.value.classList.remove('enable-print-view-kwitansi')
        // window.print()
        printJS({
          printable: 'kwitansi',
          type: 'html',
          targetStyles: ['*'],
          showModal: true,
          modalMessage: 'Sedang memproses dokumen, harap tunggu...',
          font_size: '',
          onError: (error) => {
            console.error(error)
          },
          style: `
          .screen {
            padding: 0;
            margin: 0;
          }
          
          @media print {
            #kwitansi {
              width: auto;
              padding: 0 !important;
              margin: 0 !important;
            }
            @page {
                size: 21.7cm 13.8cm;
                margin: 0 !important;
                padding: 0 !important;
              }
            }
          `
        })
      }
    }
    const printDetailModal = () => {
      if (pasienSection.value) {
        // kwitansiSection.value.classList.remove('enable-print-view-kwitansi') // Menghapus kelas 'enable-print-view-kwitansi' dari kwitansi-section
        // pasienSection.value.classList.add('enable-print-view-kwitansi')
        // window.print()
        printJS({
          printable: 'pasien',
          type: 'html',
          css: ['https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css'],
          targetStyles: ['*'],
          showModal: true,
          modalMessage: 'Sedang memproses dokumen, harap tunggu...',
          font_size: '',
          onError: (error) => {
            console.error(error)
          },
          style: `
          .class-pasien {
            margin: 0 !important;
          }
            #pasien {
              width: auto;
              padding: 0 !important; 
              margin: 10px !important;
            }
            @media print {
              @page {
                size: 21.7cm 13.8cm;
                margin: 0 !important;
              }
            }
          `
        })
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
  <div class="bg-[#1a1a1a] w-screen min-h-screen h-full">
    <div class="max-w-[950px] screen bg-white h-fit mx-auto pt-3">
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
        <section ref="kwitansiSection" id="kwitansi" class="bg-white relative w-full px-5 h-fit">
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
              class="absolute left-1/2 -translate-x-[65%] top-1/2 transform rotate-45 text-black/10 -translate-y-1/2 text-[140px] font-semibold"
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
            <div class="flex w-full justify-end gap-2">
              <p class="text-end">Tanggal / No. Daftar</p>
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
            <ul class="flex flex-col gap-0">
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
            <div class="mt-3 flex justify-betweens w-full">
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
                <p class="mt-10">{{ isAdminLoggedIn }}</p>
              </div>
            </div>
          </div>
        </section>
        <section ref="pasienSection" id="pasien" class="px-5 mt-5 pb-5 mx-auto bg-white max-w-[25cm]">
          <div class="flex justify-between items-center w-full">
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

          <div class="w-full relative">
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
            <div
              class="class-pasien max-w-[21.1cm] mx-auto mt-5 grid grid-cols-[repeat(16,minmax(0,1fr))]"
            >
              <div class="border border-black px-3 py-1">
                <h1 class="font-medium text-start">No.</h1>
              </div>
              <div class="border border-black px-3 py-1 col-span-4">
                <h1 class="font-medium text-start w-fit">Nama Lengkap</h1>
              </div>
              <div class="border border-black px-3 py-1 col-span-3">
                <h1 class="font-medium text-start w-fit">Jenis Medikal</h1>
              </div>
              <div class="border border-black px-3 py-1 col-span-4">
                <h1 class="font-medium text-start w-fit">Register</h1>
              </div>
              <div class="border border-black px-3 py-1 col-span-2">
                <h1 class="font-medium text-start w-fit">Harga</h1>
              </div>
              <div class="border border-black px-3 py-1 col-span-2">
                <h1 class="font-medium text-start w-fit">Bayar</h1>
              </div>

              <template v-for="(item, index) in kwitansi.pasien_tkis" :key="index">
                <div class="px-3 py-1">
                  <p class="text-start w-fit">{{ index + 1 }}</p>
                </div>
                <div class="px-3 py-1 col-span-4">
                  <p class="text-start w-fit">{{ item.nama_lengkap }}</p>
                </div>
                <div class="px-3 py-1 col-span-3">
                  <p class="text-start w-fit">{{ item.negara_tujuan }}</p>
                </div>
                <div class="px-3 py-1 col-span-4">
                  <p class="text-start w-fit">{{ item.no_form }}</p>
                </div>
                <div class="px-3 py-1 col-span-2">
                  <p class="text-start w-fit">{{ item.harga }}</p>
                </div>
                <div class="px-3 py-1 col-span-2">
                  <p class="text-start w-fit">
                    {{ kwitansi.total_pembayaran / kwitansi.pasien_tkis.length }}
                  </p>
                </div>
              </template>
              <div class="px-3 py-1 border border-black text-sm font-semibold italic col-span-12">
                Total Keseluruhan
              </div>
              <div class="px-3 py-1 border border-black text-sm font-semibold italic col-span-2">
                {{ kwitansi.total_harga }}
              </div>
              <div class="px-3 py-1 border border-black text-sm font-semibold italic col-span-2">
                {{ kwitansi.total_pembayaran }}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
<!-- <style scoped>
@media print {
  html,
  body,
  header,
  main {
    visibility: hidden;
    font-size: 12px;
  }

  *:not(.enable-print-view-kwitansi, .enable-print-view-kwitansi *) {
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

  @page {
    size: 21.7cm 21.7cm;
  }

  .enable-print-view-kwitansi,
  .enable-print-view-kwitansi * {
    visibility: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style> -->
