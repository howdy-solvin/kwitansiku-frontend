<script>
import ProfileInfo from '@/components/ProfileInfo.vue'
import IconCetak from '@/components/icons/IconCetak.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconRekap from '@/components/icons/IconRekap.vue'
import { watchEffect, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import IconBlanko from '@/components/icons/IconBlanko.vue'

export default {
  components: {
    ProfileInfo,
    IconRekap,
    IconSearch,
    IconCetak,
    IconBlanko
  },

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
        showPrintKwitansiBtn.value = true
        showPrintPasienBtn.value = true
        router.push('/pasien-tki')
      }
    }

    //TODO - Interace With modal
    const showPrintBlankoFullBtn = ref(false)
    const showPrintBlankoPraBtn = ref(false)
    const showPrintBlankoAllPraBtn = ref(false)
    const showPrintBlankoAllFullBtn = ref(false)
    const showPrintKwitansiBtn = ref(false)
    const showPrintPasienBtn = ref(false)
    const popUpTriggers = ref({
      triggerRekap: false,
      triggerBlankoPra: false,
      triggerBlankoFull: false,
      triggerBlankoAllPra: false,
      triggerBlankoAllFull: false
    })

    const togglePopUpKwitansi = async (trigger, index) => {
      popUpTriggers.value[trigger] = !popUpTriggers.value[trigger]
      if (popUpTriggers.value[trigger]) {
        try {
          // Kirim permintaan GET untuk mengambil data pasien
          const uuid = receipts.value[index].uuid
          const response = await store.dispatch('fetchReceiptsPatient', uuid)
          if (response.code === 200) {
            showPrintKwitansiBtn.value = true
            showPrintPasienBtn.value = true
          } else {
            showPrintKwitansiBtn.value = false
            showPrintPasienBtn.value = false
            store.commit('resetRekap')
          }
        } catch (error) {
          console.error('Error fetching patient data:', error)
        }
      } else {
        // Atur showPrintKwitansiBtn menjadi false jika popUpTriggers.value[trigger] adalah false
        showPrintKwitansiBtn.value = false
        showPrintPasienBtn.value = false
        store.commit('resetRekap')
      }
    }

    // SECTION - Blanko Section
    const selectedPasienKey = ref(null)
    const loadingSelectedPasien = ref(false)
    const togglePopUpBlanko = async (trigger, index = 0, isClosing = false) => {
      try {
        if (isClosing) return (popUpTriggers.value[trigger] = false)

        const uuid = openedKwitansiData.value.pasien_tkis[index].uuid
        switch (trigger) {
          case 'triggerBlankoPra':
            selectedPasienKey.value = `pra-${index}`
            loadingSelectedPasien.value = true
            const resPra = await store.dispatch('fetchBlankoPra', uuid)
            if (resPra.code === 200) {
              popUpTriggers.value[trigger] = true
              showPrintBlankoPraBtn.value = true
            } else {
              popUpTriggers.value[trigger] = false
              showPrintBlankoPraBtn.value = false
            }
            break

          case 'triggerBlankoFull':
            selectedPasienKey.value = `full-${index}`
            loadingSelectedPasien.value = true
            const resFull = await store.dispatch('fetchBlankoFull', uuid)
            if (resFull.code === 200) {
              popUpTriggers.value[trigger] = true
              showPrintBlankoFullBtn.value = true
            } else {
              popUpTriggers.value[trigger] = false
              showPrintBlankoFullBtn.value = false
            }
            break

          case 'triggerBlankoAllPra':
            selectedPasienKey.value = 'all-pra'
            loadingSelectedPasien.value = true
            const resAllPra = await store.dispatch(
              'fetchAllBlankoPras',
              openedKwitansiData.value.pasien_tkis
            )
            if (resAllPra === true) {
              popUpTriggers.value[trigger] = true
              showPrintBlankoAllPraBtn.value = true
            } else {
              popUpTriggers.value[trigger] = false
              showPrintBlankoAllPraBtn.value = false
            }
            break

          case 'triggerBlankoAllFull':
            selectedPasienKey.value = 'all-full'
            loadingSelectedPasien.value = true
            const resAllFull = await store.dispatch(
              'fetchAllBlankoFull',
              openedKwitansiData.value.pasien_tkis
            )
            if (resAllFull === true) {
              popUpTriggers.value[trigger] = true
              showPrintBlankoAllFullBtn.value = true
            } else {
              popUpTriggers.value[trigger] = false
              showPrintBlankoAllFullBtn.value = false
            }
            break

          default:
            throw new Error('Invalid trigger')
        }
        selectedPasienKey.value = index
        loadingSelectedPasien.value = true
        if (!popUpTriggers.value[trigger]) {
          selectedPasienKey.value = null
          loadingSelectedPasien.value = false
          showPrintBlankoPraBtn.value = false
          showPrintBlankoFullBtn.value = false
          showPrintBlankoAllPraBtn.value = false
          showPrintBlankoAllFullBtn.value = false
          store.commit('resetBlankoPra')
          store.commit('resetBlankoFull')
          store.commit('resetAllBlankoPra')
          store.commit('resetAllBlankoFull')
        }
      } catch (error) {
        console.error('Error fetching blanko data:', error)
      }
    }

    // TODO: Function to handle get data form receipt
    const getOneRekap = async (index) => {
      // Gunakan originalReceipts untuk mendapatkan uuid
      const uuid = receipts.value[index].uuid
      const response = await store.dispatch('fetchReceiptsPatient', uuid)

      if (response.code === 200) {
        showPrintKwitansiBtn.value = true
        showPrintPasienBtn.value = true
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
    const blankoPra = computed(() => store.getters['getBlankoPra'])
    const blankoFull = computed(() => store.getters['getBlankoFull'])
    const blankoAllPra = computed(() => store.getters['getBlankoAllPra'])
    const blankoAllFull = computed(() => store.getters['getBlankoAllFull'])

    const handleKwitansiPasien = async (kwitansi, i) => {
      loadingOpenedKwitansi.value = true
      if (openedKwitansiIndex.value === i) {
        openedKwitansiIndex.value = null
        loadingOpenedKwitansi.value = false
        store.commit('resetSelectedReceipt')
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
      togglePopUpKwitansi,
      togglePopUpBlanko,
      kwitansi,
      admin,
      isAdminLoggedIn,
      showPrintKwitansiBtn,
      showPrintPasienBtn,
      showPrintBlankoPraBtn,
      showPrintBlankoFullBtn,
      showPrintBlankoAllPraBtn,
      showPrintBlankoAllFullBtn,
      handleKwitansiPasien,
      openedKwitansiIndex,
      openedKwitansiData,
      blankoPra,
      blankoFull,
      blankoAllPra,
      blankoAllFull,
      loadingOpenedKwitansi,
      selectedPasienKey,
      loadingSelectedPasien,
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
                  <router-link
                    :to="{
                      name: 'PrintKwitansi',
                      query: { id: receipt.uuid }
                    }"
                    target="_blank"
                    class="bg-[#0075FF] hover:bg-[#0456b8] hover:ring-[#0456b8] text-white transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-[#0075FF] h-full"
                  >
                    <IconCetak></IconCetak>
                  </router-link>
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
                    <td colspan="2" class="border-[#d7d7d7]">
                      <div class="h-full flex">
                        <router-link
                          :to="{
                            name: 'PrintBlankoPra',
                            query: {
                              type: 'single',
                              id: pasien.uuid
                            }
                          }"
                          target="_blank"
                          class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3"
                        >
                          Pra
                          <div class="flex items-center justify-center aspect-square w-6">
                            <svg
                              v-if="loadingSelectedPasien && selectedPasienKey === `pra-${index}`"
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
                            <IconCetak v-else></IconCetak>
                          </div>
                        </router-link>
                        <router-link
                          :to="{
                            name: 'PrintBlankoFull',
                            query: {
                              type: 'single',
                              id: pasien.uuid
                            }
                          }"
                          target="_blank"
                          class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3 rounded-e-md"
                        >
                          Full
                          <div class="flex items-center justify-center aspect-square w-6">
                            <svg
                              v-if="loadingSelectedPasien && selectedPasienKey === `full-${index}`"
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
                            <IconCetak v-else></IconCetak>
                          </div>
                        </router-link>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr>
                  <td colspan="9">
                    <div class="flex flex-row">
                      <router-link
                        :to="{
                          name: 'PrintBlankoPra',
                          query: {
                            type: 'multi',
                            id: openedKwitansiData.pasien_tkis
                              .map((pasien) => pasien.uuid)
                              .join(',')
                          }
                        }"
                        target="_blank"
                        class="bg-transparent rounded-s-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full"
                      >
                        Cetak Semua Blanko Pra
                        <div class="flex items-center justify-center aspect-square w-6">
                          <svg
                            v-if="loadingSelectedPasien && selectedPasienKey === 'all-pra'"
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
                          <IconCetak v-else></IconCetak>
                        </div>
                      </router-link>
                      <button
                        type="button"
                        @click="togglePopUpBlanko('triggerBlankoAllFull')"
                        class="bg-transparent rounded-e-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full"
                      >
                        Cetak Semua Blanko Full
                        <div class="flex items-center justify-center aspect-square w-6">
                          <svg
                            v-if="loadingSelectedPasien && selectedPasienKey === 'all-full'"
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
                          <IconCetak v-else></IconCetak>
                        </div>
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
    </main>
  </div>
</template>

<style scoped>
.flex {
  display: flex;
}

.items-start {
  align-items: flex-start;
}

.w-20 {
  width: 5rem;
}

.mr-4 {
  margin-right: 1rem;
}

.label1 {
  display: inline-block;
  width: 120px;
  /* Set this width according to your needs */
}

.label2 {
  display: inline-block;
  width: 90px;
  /* Set this width according to your needs */
}
</style>
