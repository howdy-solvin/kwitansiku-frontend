<script>
import ProfileInfo from '@/components/ProfileInfo.vue'
import IconCetak from '@/components/icons/IconCetak.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconRekap from '@/components/icons/IconRekap.vue'
import { watchEffect, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalBase from '@/components/ModalBase.vue'
import IconBlanko from '@/components/icons/IconBlanko.vue'

export default {
  components: { ProfileInfo, IconRekap, IconSearch, IconCetak, ModalBase, IconBlanko },

  setup() {
    const store = useStore()
    const router = useRouter()

    //TODO - Session Computed
    const admin = computed(() => store.getters['admin'])
    const blanko = computed(() => store.getters['getterBlanko'])

    const isAdminLoggedIn = computed(() => {
      // Jika admin.data.nama tidak null, kembalikan nilai true
      if (admin.value.data && admin.value.data.nama) {
        return admin.value.data.nama
      } else {
        // Jika admin.data.nama null, kembalikan default nama "admin"
        return 'SRI MARYANA'
      }
    })

    // Ambil data kwitansi dari state menggunakan getter
    // Simpan originalReceipts sebagai variabel terpisah
    const originalReceipts = computed(() => store.getters['allReceipts'])

    // Reverse originalReceipts jika diperlukan
    const receipts = computed(() => originalReceipts.value.slice().reverse())

    //SECTION - Get AllRekap
    const kwitansi = computed(() => store.getters['getterRekap'])

    // Panggil action fetchReceipts saat komponen dimuat
    watchEffect(() => {
      store.dispatch('fetchReceipts')
    })

    const getUid = async (index) => {
      // Gunakan originalReceipts untuk mendapatkan uuid
      const uuid = receipts.value[index].uuid
      const response = await store.dispatch('fetchReceiptsPatient', uuid)

      if (response.code === 200) {
        showPrintButton.value = true
        showPrintDetailButton.value = true
        router.push('/pasien-tki')
      }
    }

    //TODO - Interace With modal
    const showPrintButton = ref(false)
    const showPrintDetailButton = ref(false)
    const popUpTriggers = ref({
      buttonTrigger: false
    })

    const tooglePopUp = async (trigger, index) => {
      popUpTriggers.value[trigger] = !popUpTriggers.value[trigger]
      if (popUpTriggers.value[trigger]) {
        try {
          // Kirim permintaan GET untuk mengambil data pasien
          const uuid = receipts.value[index].uuid
          const response = await store.dispatch('fetchReceiptsPatient', uuid)
          response.code === 200 ? (showPrintButton.value = true) : (showPrintButton.value = false)
          response.code === 200
            ? (showPrintDetailButton.value = true)
            : (showPrintDetailButton.value = false)
        } catch (error) {
          console.error('Error fetching patient data:', error)
        }
      } else {
        // Atur showPrintButton menjadi false jika popUpTriggers.value[trigger] adalah false
        showPrintButton.value = false
        showPrintDetailButton.value = false
      }
    }

    // SECTION - Blanko Section

    // TODO: Function to handle get data form receipt
    const getOneRekap = async (index) => {
      // Gunakan originalReceipts untuk mendapatkan uuid
      const uuid = receipts.value[index].uuid
      const response = await store.dispatch('fetchReceiptsPatient', uuid)

      if (response.code === 200) {
        showPrintButton.value = true
        showPrintDetailButton.value = true
        router.push('/pasien-tki')
      }
    }
    const getBlanko = async (uuid) => {
      try {
        await store.dispatch('getReceiptId', uuid)
        router.push('/blanko-kwitansi')
      } catch (error) {
        return error
      }
    }

    //ANCHOR - Bagian untuk handling print data data blanko
    const openedKwitansiIndex = ref(null)
    const loadingOpenedKwitansi = ref(false)
    const openedKwitansiData = computed(() => store.getters['getSelectedReceipt'])

    const handleKwitansiPasien = async (kwitansi, i) => {
      loadingOpenedKwitansi.value = true
      if (openedKwitansiIndex.value === i) {
        openedKwitansiIndex.value = null
        loadingOpenedKwitansi.value = false
        store.dispatch('resetSelectedReceipt')
        return
      }
      openedKwitansiIndex.value = i
      await store.dispatch('getSelectedReceipt', kwitansi.uuid).finally(() => {
        loadingOpenedKwitansi.value = false
      })
    }

    return {
      getBlanko,
      blanko,
      getOneRekap,
      receipts,
      getUid,
      popUpTriggers,
      tooglePopUp,
      kwitansi,
      admin,
      isAdminLoggedIn,
      showPrintButton,
      showPrintDetailButton,
      handleKwitansiPasien,
      openedKwitansiIndex,
      openedKwitansiData,
      loadingOpenedKwitansi
    }
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <header class="w-full py-6 sticky top-0 bg-white">
      <div class="flex justify-between w-full font-poppins items-center">
        <div>
          <h1 class="font-semibold text-[35px]">Rekap Kwitansi Pasien</h1>
          <p class="mt-1">
            Rekap guna<span class="text-[#0075FF] font-semibold"> mempermudah pendataan</span>
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
          <thead>
            <tr>
              <th
                class="font-normal rounded-tl-md rounded-bl-md text-[#888888] bg-[#E3E3E3] text-left px-4 py-3"
              >
                No
              </th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">
                No. Kwitansi
              </th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">
                Nama Sponsor
              </th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">J. Pasien</th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">Tanggal</th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">T. Harga</th>
              <th class="font-normal text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">Bayar</th>
              <th
                class="font-normal text-[#888888] bg-[#E3E3E3] pl-4 py-3 flex justify-end gap-[17px]"
              >
                <p class="text-right">Detail</p>
                <p class="">Kwt</p>
                <p class="">Blanko</p>
              </th>
              <th
                class="font-normal rounded-tr-md rounded-br-md text-[#888888] bg-[#E3E3E3] text-left pl-4 py-3"
              >
                <p>Pasien</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(receipt, index) in receipts" :key="receipt.id">
              <tr class="mt-4">
                <td class="border-[#A2A2A2] rounded-s-md border-t border-b border-l px-4 py-3">
                  {{ index + 1 }}
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{ receipt.no_pendaftaran }}
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{ receipt.nama_sponsor }}
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{ receipt.total_pendaftar }} <span>Orang</span>
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{
                    new Date(receipt.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Asia/Makassar',
                      localeMatcher: 'best fit'
                    })
                  }}
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{ receipt.total_harga }}
                </td>
                <td class="border-[#A2A2A2] border-t border-b px-4 py-3">
                  {{ receipt.total_pembayaran }}
                </td>
                <td class="h-full flex justify-end border-[#A2A2A2] border-t border-b">
                  <button
                    @click="getUid(index)"
                    class="bg-black hover:bg-[#434343] hover:ring-[#434343] transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-black h-full"
                  >
                    <IconRekap class=""></IconRekap>
                  </button>
                  <button
                    type="button"
                    @click="tooglePopUp('buttonTrigger', index)"
                    class="bg-[#0075FF] hover:bg-[#0456b8] hover:ring-[#0456b8] text-white transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-[#0075FF] h-full"
                  >
                    <IconCetak></IconCetak>
                  </button>
                  <button
                    type="button"
                    @click="getBlanko(receipt.uuid)"
                    class="bg-[#00C2FF] hover:bg-[#289bbd] hover:ring-[#289bbd] transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-[#00C2FF] h-full"
                  >
                    <IconBlanko></IconBlanko>
                  </button>
                </td>
                <td
                  :key="receipt.id"
                  @click="handleKwitansiPasien(receipt, index)"
                  class="border-[#A2A2A2] hover:bg-[#e8e8e8] border-t border-b border-e rounded-r-md h-full"
                >
                  <div class="flex justify-center">
                    <svg
                      v-if="loadingOpenedKwitansi && openedKwitansiIndex === index"
                      class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <svg
                      v-else
                      class="h-8 aspect-square transition-all duration-300 ease-out text-[#A2A2A2]"
                      :class="
                        openedKwitansiIndex === index
                          ? 'rotate-180 text-[#0075FF]'
                          : 'rotate-0 text-[#A2A2A2]'
                      "
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
              <div class="contents" v-if="index === openedKwitansiIndex && !loadingOpenedKwitansi">
                <template v-for="(pasien, index) in openedKwitansiData.pasien_tkis">
                  <tr>
                    <td class=""></td>
                    <td class="border-[#d7d7d7] rounded-s-md border-t border-b border-l px-4 py-3">
                      {{ pasien.no_form }}
                    </td>
                    <td class="border-[#d7d7d7] border-t border-b px-4 py-3">
                      {{ pasien.negara_tujuan }}
                    </td>
                    <td colspan="2" class="border-[#d7d7d7] border-t border-b px-4 py-3">
                      {{ pasien.nama_lengkap }}
                    </td>
                    <td colspan="2" class="border-[#d7d7d7] border-t border-b px-4 py-3">
                      {{ pasien.harga }}
                    </td>
                    <td
                      colspan="2"
                      class="border-[#d7d7d7]"
                    >
                      <div class="h-full flex">
                        <button class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3">
                          Pra
                          <IconCetak></IconCetak>
                        </button>
                        <button class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3 rounded-e-md">
                          Full
                          <IconCetak></IconCetak>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr>
                  <td colspan="9">
                    <div class="flex flex-row">
                      <button
                        type="button"
                        class="bg-transparent rounded-s-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full"
                      >
                        Cetak Semua Blanko Pra
                        <IconCetak></IconCetak>
                      </button>
                      <button
                        type="button"
                        class="bg-transparent rounded-e-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full"
                      >
                        Cetak Semua Blanko Full
                        <IconCetak></IconCetak>
                      </button>
                    </div>
                  </td>
                </tr>
                <br />
              </div>
            </template>
          </tbody>
        </table>
      </section>
      //TODO - creating Modal for blanko pra and blanko full per people, and creating for one kwitansi for pra and full
      <ModalBase
        v-if="popUpTriggers.buttonTrigger"
        :tooglePopUp="() => tooglePopUp('buttonTrigger')"
        :showPrintButton="showPrintButton"
        :showPrintDetailButton="showPrintDetailButton"
        class="font-poppins"
      >
        <template #header>
          <div>
            <h4 class="font-bold text-lg">Kwitansi {{ kwitansi.no_pendaftaran }}</h4>
            <p>
              <span class="text-blue-500 font-semibold">{{ kwitansi.tanggal }} </span>
              | {{ kwitansi.nama_sponsor }}
            </p>
          </div>
        </template>
        <template #banner>
          <div class="flex justify-between items-center">
            <img
              class="w-[80px] h-[80px] object-contain"
              src="../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-right">
              <h1 class="font-bold text-lg">KLINIK GORA MATARAM</h1>
              <p>Jl. RA. Kartini No. 77 Mojok - Mataram - NTB Mataram</p>
              <p>Indonesia - Telp.(0370) 635661 Fax (0370) 635661</p>
              <p>goraklinik@gmail.com</p>
            </div>
          </div>
        </template>

        <!-- //NOTE - Kwitansi -->
        <template #main>
          <div
            v-if="kwitansi.total_harga <= kwitansi.total_pembayaran"
            class="absolute left-1/2 -translate-x-1/2 top-1/2 transform rotate-45 text-black/10 -translate-y-1/2 text-[130px] font-semibold"
          >
            LUNAS
          </div>
          <div class="flex flex-col items-center">
            <h1 class="font-bold text-[25px] text-center">KWITANSI PEMBAYARAN</h1>
            <div class="w-[40%] border h-1 bg-black" />
            <p class="text-center">
              NO :
              {{
                kwitansi.tanggal.split('-')[0].slice(2, 4) +
                kwitansi.tanggal.split('-')[1] +
                kwitansi.tanggal.split('-')[2]
              }}01{{ kwitansi.no_pendaftaran }}
            </p>
          </div>
          <div class="flex w-full justify-end gap-2 mt-3">
            <p class="w-[180px] text-end">Tanggal / No. Daftar</p>
            <p class="text-end">: {{ kwitansi.tanggal }} / {{ kwitansi.no_pendaftaran }}</p>
          </div>
          <ul class="flex flex-col gap-2">
            <li class="flex justify-between">
              <div class="flex gap-8">
                <p class="w-[150px]">Nama PJ-TKI</p>
                <p>: {{ kwitansi.nama_penanggungjawab }}</p>
              </div>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Nama Sponsor</p>
              <p>: {{ kwitansi.nama_sponsor }}</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Untuk Pembayaran</p>
              <p>:</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Jumlah Peserta</p>
              <p>: {{ kwitansi.total_pendaftar }} Orang</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Total Harga</p>
              <p>: Rp. {{ kwitansi.total_harga }},-</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Pembayaran</p>
              <p>: Rp. {{ kwitansi.total_pembayaran }},-</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Sisa Kredit</p>
              <p>: Rp. {{ kwitansi.total_harga - kwitansi.total_pembayaran }},-</p>
            </li>
          </ul>
          <div class="mt-7 flex justify-betweens w-full">
            <div class="w-full">
              <p>NB. -Detail Terlampir</p>
            </div>
            <div class="w-full flex flex-col items-center">
              <p>Mataram, {{ kwitansi.tanggal }}</p>
              <p>Kasir</p>
              <p class="mt-20">{{ isAdminLoggedIn }}</p>
            </div>
          </div>
        </template>

        <!-- //NOTE - Detail Pasien -->
        <template #pasien>
          <ul class="flex flex-col gap-1 mt-10">
            <li class="flex gap-8">
              <p class="w-[150px]">Tanggal / No. Daftar</p>
              <p>: {{ kwitansi.tanggal }}/{{ kwitansi.no_pendaftaran }}</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Nama PJ-TKI</p>
              <p>: {{ kwitansi.nama_penanggungjawab }}</p>
            </li>
            <li class="flex gap-8">
              <p class="w-[150px]">Nama Sponsor</p>
              <p>: {{ kwitansi.nama_sponsor }}</p>
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
        </template>
      </ModalBase>
    </main>
  </div>
</template>
