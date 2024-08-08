<script>
import ProfileInfo from '@/components/ProfileInfo.vue'
import IconCetak from '@/components/icons/IconCetak.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconRekap from '@/components/icons/IconRekap.vue'
import { watchEffect, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import ModalRekap from '@/components/ModalRekap.vue'
import IconBlanko from '@/components/icons/IconBlanko.vue'
import ModalBlanko from '@/components/ModalBlanko.vue'

export default {
  components: {
    ProfileInfo,
    IconRekap,
    IconSearch,
    IconCetak,
    ModalRekap,
    ModalBlanko,
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

    //NOTE - V-Html
    const checkGender = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        if (blankoFull.value.blanko_full.urine_oka_status === true) {
          return "HIS/<s>HER</s> URINE IS TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE";
        } else {
          return "HIS/<s>HER</s> URINE IS NOT TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE";
        }
      } else {
        if (blankoFull.value.blanko_full.urine_oka_status === true) {
          return "<s>HIS</s>/HER URINE IS TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE";
        } else {
          return "<s>HIS</s>/HER URINE IS NOT TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE";
        }
      }
    });

    const checkPregnant = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        return "HE/<s>SHE</s> IS NOT PREGNANT";
      } else if (blankoFull.value.blanko_full.dsh_status === 'P') {
        if (blankoFull.value.blanko_full.dsh_status === true) {
          return "<s>HE</s>/SHE IS PREGNANT";
        } else {
          return "<s>HE</s>/SHE IS NOT PREGNANT";
        }
      }
    })

    const checkFit = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        if (blankoFull.value.blanko_full.sehat_bekerja_status === true) {
          return 'HE/<s>SHE</s> IS FIT TO WORK'
        } else {
          return 'HE/<s>SHE</s> IS NOT FIT TO WORK'
        }
      } else {
        if (blankoFull.value.blanko_full.sehat_bekerja_status === true) {
          return '<s>HE</s>/SHE IS FIT TO WORK'
        } else {
          return '<s>HE</s>/SHE IS NOT FIT TO WORK'
        }
      }
    })
    const considerEmployment = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        if (blankoFull.value.blanko_full.rekom_status === true) {
          return 'I THEREFORE RECOMMEND THAT HE/<s>SHE</s> BE CONSIDERED FOR EMPLOYMENT'
        } else {
          return 'I THEREFORE NOT RECOMMEND THAT HE/<s>SHE</s> BE CONSIDERED FOR EMPLOYMENT'
        }
      } else {
        if (blankoFull.value.blanko_full.rekom_status === true) {
          return 'I THEREFORE RECOMMEND THAT <s>HE</s>/SHE BE CONSIDERED FOR EMPLOYMENT'
        } else {
          return 'I THEREFORE NOT RECOMMEND THAT <s>HE</s>/SHE BE CONSIDERED FOR EMPLOYMENT'
        }
      }
    })

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
      checkGender,
      checkPregnant,
      checkFit,
      considerEmployment
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
          <input class="w-[298px] outline-none" type="text" placeholder="Cari Berdasarkan Nama Sponsor" id="search"
            name="search" />
          <button class="bg-[#0075FF] p-4 text-white">Cari</button>
        </div>
        <div class="flex items-center place-self-end">
          <button type="button"
            class="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-[16px] text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            id="menu-button" aria-expanded="true" aria-haspopup="true">
            Filter Kwitansi Bulan Ini
            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </section>
      <section>
        <table class="w-full border-separate border-spacing-y-3 mt-10">
          <thead>
            <tr>
              <th class="font-normal rounded-tl-md rounded-bl-md text-[#888888] bg-[#E3E3E3] text-left px-4 py-3">
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
              <th class="font-normal text-[#888888] bg-[#E3E3E3] pl-4 py-3 flex justify-end gap-[17px]">
                <p class="text-right">Detail</p>
                <p class="">Kwt</p>
                <p class="">Blanko</p>
              </th>
              <th class="font-normal rounded-tr-md rounded-br-md text-[#888888] bg-[#E3E3E3] text-left pl-4 py-3">
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
                  <button @click="getUid(index)"
                    class="bg-black hover:bg-[#434343] hover:ring-[#434343] transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-black h-full">
                    <IconRekap class=""></IconRekap>
                  </button>
                  <button type="button" @click="togglePopUpKwitansi('triggerRekap', index)"
                    class="bg-[#0075FF] hover:bg-[#0456b8] hover:ring-[#0456b8] text-white transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-[#0075FF] h-full">
                    <IconCetak></IconCetak>
                  </button>
                  <button type="button" @click="getBlanko(receipt.uuid)"
                    class="bg-[#00C2FF] hover:bg-[#289bbd] hover:ring-[#289bbd] transition-colors p-3 aspect-square flex items-center justify-center ring-2 ring-[#00C2FF] h-full">
                    <IconBlanko></IconBlanko>
                  </button>
                </td>
                <td :key="receipt.id" @click="handleKwitansiPasien(receipt, index)"
                  class="border-[#A2A2A2] hover:bg-[#e8e8e8] border-t border-b border-e rounded-r-md h-full">
                  <div class="flex justify-center">
                    <svg v-if="loadingOpenedKwitansi && openedKwitansiIndex === index"
                      class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
                      fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                    </svg>
                    <svg v-else class="h-8 aspect-square transition-all duration-300 ease-out text-[#A2A2A2]" :class="openedKwitansiIndex === index
                      ? 'rotate-180 text-[#0075FF]'
                      : 'rotate-0 text-[#A2A2A2]'
                      " viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd" />
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
                        <button @click="togglePopUpBlanko('triggerBlankoPra', index)"
                          class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3">
                          Pra
                          <div class="flex items-center justify-center aspect-square w-6">
                            <svg v-if="loadingSelectedPasien && selectedPasienKey === `pra-${index}`"
                              class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
                              fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                            </svg>
                            <IconCetak v-else></IconCetak>
                          </div>
                        </button>
                        <button @click="togglePopUpBlanko('triggerBlankoFull', index)"
                          class="flex transition-colors ring-1 ring-[#d7d7d7] hover:ring-[#0075FF] bg-white text-[#4c75a4] hover:text-white hover:bg-[#0075FF] py-3 grow justify-center gap-3 rounded-e-md">
                          Full
                          <div class="flex items-center justify-center aspect-square w-6">
                            <svg v-if="loadingSelectedPasien && selectedPasienKey === `full-${index}`"
                              class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
                              fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                            </svg>
                            <IconCetak v-else></IconCetak>
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr>
                  <td colspan="9">
                    <div class="flex flex-row">
                      <button type="button" @click="togglePopUpBlanko('triggerBlankoAllPra')"
                        class="bg-transparent rounded-s-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full">
                        Cetak Semua Blanko Pra
                        <div class="flex items-center justify-center aspect-square w-6">
                          <svg v-if="loadingSelectedPasien && selectedPasienKey === 'all-pra'"
                            class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor" />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill" />
                          </svg>
                          <IconCetak v-else></IconCetak>
                        </div>
                      </button>
                      <button type="button" @click="togglePopUpBlanko('triggerBlankoAllFull')"
                        class="bg-transparent rounded-e-md grow hover:bg-[#0075FF] hover:border-[#0075FF] hover:text-white text-[#4c75a4] gap-3 transition-colors p-3 flex items-center justify-center border border-[#699bd5] h-full">
                        Cetak Semua Blanko Full
                        <div class="flex items-center justify-center aspect-square w-6">
                          <svg v-if="loadingSelectedPasien && selectedPasienKey === 'all-full'"
                            class="w-5 aspect-square text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor" />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill" />
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

      <!-- SECTION - Modal blanko pra -->
      <ModalBlanko v-if="popUpTriggers.triggerBlankoPra"
        :togglePopUp="() => togglePopUpBlanko('triggerBlankoPra', null, true)" :showPrintButton="showPrintBlankoPraBtn"
        class="font-poppins">
        <template #header>
          <div>
            <h4 class="font-bold text-lg">Blanko Pra</h4>
            <p>Cetak data untuk Blanko Pra</p>
          </div>
        </template>
        <template #banner>
          <div class="flex justify-around items-center">
            <img class="w-[80px] h-[80px] object-contain" src="../components/icons/klinikGoraLogo.png" alt="" />
            <div class="text-center">
              <h1 class=" text-xl text-green-500 font-semibold">Klinik <span class="text-yellow-500">GORA</span> Mataram
              </h1>
              <p class="text-yellow-500 font-semibold">Jl. RA. Kartini No. 77 Mojok Telp.(0370) 635661</p>
              <p class="italic text-green-700 font-semibold">Email : goraklinik@gmail.com</p>
            </div>
          </div>
        </template>
        <template #main>
          <!-- SECTION Keterangan Sehat -->
          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">KETERANGAN SEHAT</h1>
          <p class="font-poppins text-center">Informasi Hasil Pemeriksaan</p>

          <div class="flex justify-end mt-3">
            <span class="label1 w-full">No. Register</span>
            <span class="w-auto">092834ASd</span>
          </div>

          <section class="flex items-start mt-5">
            <div class="w-20 mr-4">
              <img :src="blankoPra.image_blob" class="w-full" />
            </div>
            <div>
              <p v-if="blankoPra.jenis_kelamin">
                <span class="label1">Jenis Kelamin</span>
                <span>: {{ blankoPra.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
              </p>
              <p v-if="blankoPra.usia">
                <span class="label1">Usia</span>
                <span>: {{ blankoPra.usia }}</span>
              </p>

              <p v-if="blankoPra.daerah">
                <span class="label1">Daerah</span>
                <span>: {{ blankoPra.daerah }}</span>
              </p>
              <p v-if="blankoPra.provinsi">
                <span class="label1">Provinsi</span>
                <span>: {{ blankoPra.provinsi }}</span>
              </p>
              <p v-if="blankoPra.negara">
                <span class="label1">Negara</span>
                <span>: {{ blankoPra.negara }}</span>
              </p>
            </div>
          </section>

          <!-- SECTION Pemeriksaan Fisik -->

          <h1 class="mt-5 text-center font-semibold border-2 border-t-black border-b-black">KETERANGAN SEHAT</h1>
          <div class="flex flex-col ">
            <p class="flex gap-3 justify-end font-poppins">Beri tanda <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg> Jika Normal
            </p>
            <p class="flex gap-3 font-poppins justify-end">Beri tanda <svg xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Jika Abnormal
            </p>
          </div>

          <section class="flex flex-wrap gap-x-14 gap-y-3 justify-center mt-5">
            <div>
              <h1 class="font-bold">Fisik</h1>
              <p v-if="blankoPra.blanko_pra.tinggi">
                <span class="label2">Tinggi</span>
                <span>: {{ blankoPra.blanko_pra.tinggi }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.berat">
                <span class="label2">Berat</span>
                <span>: {{ blankoPra.blanko_pra.berat }}</span>
              </p>
            </div>
            <div>
              <h1 class="font-bold">Penglihatan</h1>
              <p v-if="blankoPra.blanko_pra.mata_kanan">
                <span class="label2">Mata kanan</span>
                <span>: {{ blankoPra.blanko_pra.mata_kanan }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.mata_kiri">
                <span class="label2">Mata kiri</span>
                <span>: {{ blankoPra.blanko_pra.mata_kiri }}</span>
              </p>
              <p>
                <span class="label2" for="mata-kanan">Mata kanan</span>
                <label for="">:<span class="fa-check fa ml-2"></span></label>
              </p>
              <p>
                <span class="label2" for="mata-kanan">Mata kiri</span>
                <label for="">:<span class="fa-check fa ml-2"></span></label>
              </p>
            </div>

            <div>
              <h1 class="font-bold">Tekanan Darah</h1>
              <p v-if="blankoPra.blanko_pra.tekanan_darah_atas">
                <span class=" label2">Atas</span>
                <span>: {{ blankoPra.blanko_pra.tekanan_darah_atas }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.tekanan_darah_bawah">
                <span class="label2">Bawah</span>
                <span>: {{ blankoPra.blanko_pra.tekanan_darah_bawah }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.tekanan_darah_nadi">
                <span class="label2">Nadi</span>
                <span>: {{ blankoPra.blanko_pra.tekanan_darah_nadi }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.golongan_darah">
                <span class="label2">Gol</span>
                <span>: {{ blankoPra.blanko_pra.golongan_darah }}</span>
              </p>
            </div>

            <div>
              <h1 class="font-bold">Pendengaran</h1>
              <p>
                <span class="w-[120px] inline-block" for="mata-kanan">Telingan kanan</span>
                <label for="">:<span class="fa-check fa ml-2"></span></label>
              </p>
              <p>
                <span class="w-[120px] inline-block" for="mata-kanan">Telinga kiri</span>
                <label for="">:<span class="fa-check fa ml-2"></span></label>
              </p>
            </div>

            <div class="w-full px-4">
              <h1 class="font-bold">Lain-lain</h1>
              <p v-if="blankoPra.blanko_pra.suhu_tubuh">
                <span class="label2">Suhu Tubuh</span>
                <span>: {{ blankoPra.blanko_pra.suhu_tubuh }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.rontgen">
                <span class="label2">Rontgen</span>
                <span>: {{ blankoPra.blanko_pra.rontgen }}</span>
              </p>
            </div>

          </section>

          <!-- SECTION Pemeriksaan Laboratorium -->
          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">PEMERIKSAAN
            LABORATORIUM</h1>
          <section class="flex gap-10 justify-around mt-5">
            <div>
              <p v-if="blankoPra.blanko_pra.gula">
                <span class="label2">Gula</span>
                <span>: {{ blankoPra.blanko_pra.gula === true ? "Normal" : "Abnormal" }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.protein">
                <span class="label2">Protein</span>
                <span>: {{ blankoPra.blanko_pra.protein === true ? "Normal" : "Abnormal" }}</span>
              </p>
            </div>

            <div>
              <p v-if="blankoPra.blanko_pra.ph">
                <span class="label2">PH</span>
                <span>: {{ blankoPra.blanko_pra.ph }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.hbs_ag">
                <span class="label2">HBs-AG</span>
                <span>: {{ blankoPra.blanko_pra.hbs_ag === true ? "Normal" : "Abnormal" }}</span>
              </p>
            </div>

            <div>
              <p v-if="blankoPra.blanko_pra.vdrl">
                <span class="label2">VDRL</span>
                <span>: {{ blankoPra.blanko_pra.vdrl === true ? "Normal" : "Abnormal" }}</span>
              </p>
              <p v-if="blankoPra.blanko_pra.tpha">
                <span class="label2">TPHA</span>
                <span>: {{ blankoPra.blanko_pra.tpha === true ? "Normal" : "Abnormal" }}</span>
              </p>
            </div>
          </section>

          <!-- SECTION - RADIOLOGI -->

          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">PEMERIKSAAN RADIOLOGI
          </h1>

          <section class="flex gap-10 justify-around mt-5">
            <div>
              <p v-if="blankoPra.blanko_pra.thorax_pa">
                <span class="label2">Thorax PA</span>
                <span>: {{ blankoPra.blanko_pra.thorax_pa }}</span>
              </p>
            </div>
          </section>

          <!-- SECTION - HASIL -->

          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">HASIL
          </h1>
          <section class="flex mt-5">
            <div class="w-full">
              <p class="" v-if="blankoPra.blanko_pra.hasil">
                <span class="font-poppins w-[230px] inline-block">Dinyatakan</span>
                <span class="font-bold">: {{ blankoPra.blanko_pra.hasil === true ? "SEHAT" : "TIDAK SEHAT" }}</span>
              </p>
              <p class="" v-if="blankoPra.tanggal_cetak">
                <span class="w-[230px] inline-block">Tanggal Pemeriksaan</span>
                <span class="font-bold">: {{ blankoPra.tanggal_cetak }}</span>
              </p>
              <p class="" v-if="blankoPra.masa_berlaku">
                <span class="w-[230px] inline-block">Masa Berlaku</span>
                <span class="font-bold">: {{ blankoPra.masa_berlaku }}</span>
              </p>
            </div>
          </section>

          <section class="flex justify-end mt-3">
            <div class="text-center">
              <p class="mb-24">Dokter Pemeriksa,</p>
              <p v-if="blankoPra.blanko_pra.pic">{{ blankoPra.blanko_pra.pic }}</p>
            </div>
          </section>
        </template>
      </ModalBlanko>

      <!-- SECTION - Modal blanko full -->
      <ModalBlanko v-if="popUpTriggers.triggerBlankoFull"
        :togglePopUp="() => togglePopUpBlanko('triggerBlankoFull', null, true)"
        :showPrintButton="showPrintBlankoFullBtn" class="font-poppins">
        <template #header>
          <div>
            <h4 class="font-bold text-lg">Blanko Full</h4>
            <p>Cetak data untuk Blanko Full</p>
          </div>
        </template>

        <!-- SECTION Medical Report 1 -->
        <!-- ANCHOR Part 1 -->
        <template #banner>
          <h1 class="mt-2 text-center text-xl font-bold py-2">MEDICAL REPORT</h1>
          <div class="flex justify-end font-bold">
            <span class="label1 w-full">No. Register</span>
            <span class="w-auto">092834ASd</span>
          </div>

          <section class="flex items-center w-full border-b-4 border-b-black py-2">

            <aside class="absolute justify-start mt-5">
              <div class="w-20 mr-4">
                <img :src="blankoFull.image_blob" class="w-full" />
              </div>
            </aside>

            <div class="flex flex-col mt w-full">
              <div class="justify-center justify-items-center text-center">
                <p class="font-bold">Part I. Personal Information</p>
                <p class="font-bold">(To be completed by application)</p>
              </div>
              <div class="ml-24 mt-2 flex flex-col gap-1">
                <div class="flex justify-between">
                  <div class="flex flex-col gap-y-1">
                    <p v-if="blankoFull.usia">
                      <span class="label1 inline-block">1. FULL NAME</span>
                      <span>:a</span>
                    </p>
                    <p v-if="blankoFull.jenis_kelamin">
                      <span class="label1">2. SEX</span>
                      <span>: {{ blankoFull.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span>
                    </p>
                    <p v-if="blankoFull.usia">
                      <span class="label1">3. AGE</span>
                      <span>: {{ blankoFull.usia }} YEAR</span>
                    </p>
                  </div>
                  <div class="flex flex-col gap-y-1">
                    <p v-if="blankoFull.usia">
                      <span class="w-[200px] inline-block">FATHER'S NAME</span>
                      <span>:a</span>
                    </p>
                    <p v-if="blankoFull.no_passpor">
                      <span class="w-[200px] inline-block">PASSPORT NO</span>
                      <span>: {{ blankoFull.no_passpor }}</span>
                    </p>
                    <p v-if="blankoFull.pekerjaan_negara_tujuan">
                      <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                      <span>: {{ blankoFull.pekerjaan_negara_tujuan }}</span>
                    </p>
                  </div>
                </div>
                <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                <div class="flex gap-4 justify-start ml-4">
                  <p v-if="blankoFull.daerah">
                    <span class="">Distric</span>
                    <span>: {{ blankoFull.daerah }}</span>
                  </p>
                  <p v-if="blankoFull.provinsi">
                    <span class="">Province</span>
                    <span>: {{ blankoFull.provinsi }}</span>
                  </p>
                  <p v-if="blankoFull.negara">
                    <span class="">Country</span>
                    <span>: {{ blankoFull.negara }}</span>
                  </p>
                </div>

                <!-- NOTE untuk nama employee masih belum di tentukan -->
                <p v-if="blankoFull.usia">
                  <span class="w-[400px] inline-block">5. NAME OF EMPLOYER/RECRUITING AGENCY</span>
                  <span>: {{ blankoFull.usia }}</span>
                </p>
                <p v-if="blankoFull.usia">
                  <span class="w-[400px] inline-block">6. ADDRESS OF EMPLOYER/RECRUITING AGENCY </span>
                  <span>: {{ blankoFull.usia }}</span>
                </p>


              </div>
            </div>

          </section>
        </template>

        <template #main>
          <!-- ANCHOR Part 2 -->
          <section class="mt-2">
            <header class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">Part II : Medical History</p>
              <p class="font-poppins font-bold"> (To be completed by attending physician)</p>
            </header>
            <main class="parent flex flex-wrap gap-2 justify-center px-5 mt-[20px]">
              <section class="section1">
                <div class="grid grid-cols-4 gap-y-2 items-center">
                  <label class="col-start-2 text-center font-semibold">YES</label>
                  <label class="text-center font-semibold">NO</label>
                  <label class="text-center font-semibold">Tanggal</label>

                  <label class="w-fit">HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.hiv_status"
                    class="h-[20px] custom-disabled-checkbox" disabled>
                  <input type="checkbox" :checked="!blankoFull.blanko_full.hiv_status"
                    class="h-[20px] custom-disabled-checkbox" disabled>
                  <input type="date" :value="blankoFull.blanko_full.hiv_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />


                  <label class="w-fit">Tuberculosis <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.tbc_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.tbc_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.tbc_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="w-fit">Malaria <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.malaria_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.malaria_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.malaria_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />

                  <label class="w-fit">Leprosy <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.leprosy_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.leprosy_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.leprosy_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />

                  <label class="w-fit">STD <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.std_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.std_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.std_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="w-fit">Bronchial Asthma </label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.asma_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.asma_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.asma_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="w-fit">Heart Disease </label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.hd_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.hd_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.hd_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="w-fit">Hypertension </label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.hypt_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.hypt_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.hypt_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="w-fit">Diabetes Mellitus </label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.dbm_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.dbm_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.dbm_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />
                </div>
              </section>
              <section class="section2">
                <div class="grid grid-cols-4  gap-y-2 items-center">
                  <label class="col-start-2 text-center font-semibold">YES</label>
                  <label class="text-center font-semibold">NO</label>
                  <label for="">Tanggal</label>

                  <label class="">Peptic Ulcer</label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.ptu_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.ptu_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.ptu_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="">Kidney Disease</label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.kidney_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.kidney_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.kidney_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />

                  <label class="">Cancer</label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.cancer_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.cancer_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.cancer_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />

                  <label class="">Epylepsy <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.epylepsy_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.epylepsy_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.epylepsy_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />

                  <label class="">Psychiatric Illnes <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.psin_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.psin_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.psin_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="">Hearing Problem</label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.hepo_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.hepo_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.hepo_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="">Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.hpts_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.hpts_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.hpts_date.split('T')[0]" placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                  <label class="">Other</label>
                  <input type="checkbox" :checked="blankoFull.blanko_full.other_status" class="h-[20px]" disabled />
                  <input type="checkbox" :checked="!blankoFull.blanko_full.other_status" class="h-[20px]" disabled />
                  <input type="date" :value="blankoFull.blanko_full.other_date.split('T')[0]"
                    placeholder="Pilih Tanggal" class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled />
                </div>
              </section>
              <h1 class=" border-b-4 border-black font-bold">* To be considered Unfit if found positive (For other
                diseases it is
                up to
                the descreation’s
                of the examining Doctor)</h1>
            </main>
          </section>

          <!-- ANCHOR Part 3 -->
          <section class="mt-2">
            <header class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">Part III : Present Medical History</p>
              <p class="font-poppins font-bold"> (To be completed by attending Doctor)</p>
            </header>
            <main class="flex gap-7 mt-5">
              <table class="w-[50%]">
                <thead>
                  <tr>
                    <th></th>
                    <th>YES</th>
                    <th class="inline-block px-3">NO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="">
                    <td class="w-full">
                      Shortness of breath during exertion
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.snf_status"
                        class="h-[20px] items-center w-full" disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.snf_status"
                        class="h-[20px] text-center items-center w-full" disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Chest pain during exertion <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.nyd_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.nyd_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Palpitation <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.dbj_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.dbj_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Swelling of feet
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.pbk_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.pbk_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Giddiness of headache <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.rspks_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.rspks_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Cough for more than 2 weeks or haemoplysis
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.hmp_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.hmp_status"
                        class="h-[20px] text-center items-center w-full" disabled />
                    </td>
                  </tr>
                </tbody>
              </table>

              <table class="w-[50%]">
                <thead>
                  <tr>
                    <th></th>
                    <th>YES</th>
                    <th class="inline-block px-3">NO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Loos of appelite
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.ksm_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.ksm_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      excessive thirst and frequent urination
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.rhb_sbk_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.rhb_sbk_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Dysuria, hematuria & other urinary symptoms
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.gskl_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.gskl_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Urethral/Vaginal discharge
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.kcuv_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.kcuv_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Multiple joint pain
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.nsm_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.nsm_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Visual problem/colour blindness
                    </td>
                    <td>
                      <input type="checkbox" :checked="blankoFull.blanko_full.mpbw_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                    <td>
                      <input type="checkbox" :checked="!blankoFull.blanko_full.mpbw_status" class="h-[20px] w-full"
                        disabled>
                    </td>
                  </tr>
                </tbody>
              </table>
            </main>
            <h1 class=" border-b-4 border-black font-bold mt-3">To confirm further during examination and investigation
              of
              the
              applicant</h1>
          </section>

          <!-- ANCHOR Part 4 -->
          <section class="mt-2">
            <header class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">Part IV : Physical Examination and Investigation</p>
              <p class="font-poppins font-bold"> (To be completed by the attending Doctor)</p>
            </header>
            <main class="mt-2">
              <!-- NOTE SECTION A belum mengambil data dari pra -->
              <h4 class="font-bold mt-2" for="section-a">(Section A : General Physical Examination)</h4>
              <section class="flex gap-2">
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p v-if="blankoPra">Height : 170 Cm</p>
                  <p v-if="blankoPra">Weight : 55 Kg</p>
                </div>
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p>Pulse : 80 /min</p>
                </div>
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p>Blood Pressure : 124/68 mm/hg</p>
                </div>
              </section>
              <section class="flex gap-7 mt-5">
                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>PRESENT</th>
                      <th class="ml-3 inline-block">ABSENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="">
                      <td class="w-full">
                        Chronic Skin Rash
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.rkk_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.rkk_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Anaesthetic Skin Pach, Peripheral Nerve Enlargement or Nodular Lesion
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.pkln_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.pkln_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Deformities of Limbs
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.dfab_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.dfab_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Anemia
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Juandice
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>

                  </tbody>
                </table>
                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>RIGHT</th>
                      <th class="ml-3 inline-block">LEFT</th>
                    </tr>
                  </thead>
                  <tbody>

                    <label for="" class="font-bold">Vision Test : </label>
                    <tr>
                      <td class="flex flex-col">
                        UNAIDED
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.tb_mt_kiri"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.tb_mt_kanan"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td class="flex flex-col">
                        AIDED
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.db_mt_kiri"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.db_mt_kanan"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Hearing Impairment Present
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.tgp_kiri"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.tgp_kanan"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Colour Blindness
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.kbw_kiri"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.kbw_kanan"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>

                  </tbody>
                </table>
              </section>

              <!-- SECTION Medical Report 2 -->
              <!-- NOTE SECTION B... -->
              <h4 class="font-bold mt-4" for="section-b">Section B : System Examination</h4>
              <section class="flex gap-7">
                <table class=" w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>NORMAL</th>
                      <th class="ml-3 inline-block">ABNORMAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="3">
                        <h4 for="" class="font-bold">Cardiovascular System</h4>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">
                        Heart Size
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.ukj_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.ukj_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Heart sounds
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.saj_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.saj_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Other findings
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.tl_sps">
                            {{ blankoFull.blanko_full.tl_sps }}
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <h4 class="font-bold w-full">Respiratory System </h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Breath Sounds
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.sps_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.sps_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Other findings
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.tl_jantung">
                            {{ blankoFull.blanko_full.tl_jantung }}
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <h4 for="" class="font-bold">Nervous System and Mental Status</h4>
                      </td>
                    </tr>

                    <tr class="">
                      <td class="w-full">
                        General Mental Status
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.smu_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.smu_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">
                        Speech
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.berbicara_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.berbicara_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">
                        Cognitive Function
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.fk_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.fk_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">
                        Size of Peripheral Nerves
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.usp_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.usp_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">
                        Motor Power
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.km_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.km_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>

                  </tbody>
                </table>
                <table class=" w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>NORMAL</th>
                      <th class="ml-3 inline-block">ABNORMAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">Gastrointestinal </h4>
                    <tr>
                      <td>
                        Liver
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.hati_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.hati_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Spleen
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.limpa_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.limpa_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Kidney
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.ginjal_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.ginjal_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Is There Abnormal Sweling ?YES /NO
                        Indicate if YES .............

                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.pbk_sp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.pbk_sp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.tl_sp">
                            {{ blankoFull.blanko_full.tl_sp }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Rectal Examination (if indicated)

                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.pr_sp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.pr_sp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Sensory

                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.sensorik_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.sensorik_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Reflexes
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.reflek_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.reflek_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <h4 for="" class="font-bold inline-block w-fit">Examination of The Genitourinay System </h4>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Discharge
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.psg_pbn_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.psg_pbn_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Sores/Ulcers
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.luka_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.luka_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <!-- NOTE SECTION C...-->
              <h4 class="font-bold mt-4" for="section-b">Section C : Laboratory Result and X-Ray Findings</h4>
              <p>Specimens for laboratory investigation must be collected by the examining doctors</p>
              <section class="flex gap-7">
                <table class=" w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th class="ml-3 inline-block">NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">Blood </h4>
                    <tr>
                      <td>
                        HIV Antibody (ELISA)
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.elisa_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.elisa_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HBsAg<span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.hbsag_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.hbsag_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HCT<span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.hct_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.hct_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        VDRL & TPHA<span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.vdrl_tpha_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.vdrl_tpha_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Malaria Parasite
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.pama_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.pama_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">For Malaria, if positive give appropriate treatment and then
                          repeat test 1 month after
                          treatment. Date when blood test for malaria parasite
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Filaria Parasite
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.pafil_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.pafil_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Slit Skin Smear (if indicated)
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.ck_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.ck_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="mt-2">Chest X-Ray Report (Valid For 6 month) : </p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.cxray_report">
                            {{ blankoFull.blanko_full.cxray_report }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p class="mt-2">Sputum AFB (if indicated)</p>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.sptm_afb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.sptm_afb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class=" w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th class="ml-3 inline-block">NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="3">
                        <p class="font-bold">Urine Examination</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Colour
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.warna_urin">
                            {{ blankoFull.blanko_full.warna_urin }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Specific Gravity
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.gravitasi_spesifik">
                            {{ blankoFull.blanko_full.gravitasi_spesifik }}
                          </p>

                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Sugar
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.gula_status !== undefined">
                            {{ blankoFull.blanko_full.gula_status === true ? "POSITIVE" : "NEGATIVE" }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Albumin
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.albumin_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.albumin_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="mt-2">Miroscopicexamination : </p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.pm_miros">
                            {{ blankoFull.blanko_full.pm_miros }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Opiates / Cannabis / Amphetamine<span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.oga_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.oga_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Pregnancy<span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.kehamilan_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.kehamilan_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">*to be considered Unfit if found Positive</p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">
                        Serum Creatinine
                      </td>
                      <td colspan="2" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.serum_krtnn">
                            {{ blankoFull.blanko_full.serum_krtnn }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]"> done in country of origin for worker with history of renal
                          diseases, hipertension, and diabetes mellitus
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Rectal Swab for Salmonella</td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.urus_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.urus_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">(Only those in Food Industry)</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>
          </section>

          <!-- ANCHOR Part 5 -->
          <section class="mt-2">
            <header class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">(Part V : Certification by Attending Doctor)</p>
            </header>
            <main class="mt-2">
              <h4 class="font-bold mt-2" for="section-a">I HAVE EXAMINED THE ABOVE AND FOUND :</h4>

              <section class="flex flex-col gap-7">
                <table class=" w-[100%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th>NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">HE/SHE IS FREE FROM THE FOLLOWING DISEASES </h4>
                    <tr>
                      <td>
                        HIV/AIDS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        TUBERCULOSIS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        MALARIA
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        LEPROSY
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        STDS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HEPATITIS B
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HEPATITIS C
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        FILARIASIS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        MAJOR PSYCHIATRIC DISORDERS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">(Schizophrenia, Bipolar Affective Disorder, Major Depression,
                          Delusional Disorder and other Psychosis)</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        OTHER CHRONIC DISEASES
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <p v-html="checkGender"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="checkPregnant"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="checkFit"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="considerEmployment"></p>
                      </td>
                    </tr>
                    <p class="italic text-[10px]">(If not considered for employment please state the reason)</p>
                    <tr>
                      <td colspan="3" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.rekom_status">
                            {{ blankoFull.blanko_full.rekom_alasan }}
                          </p>
                          <p class="font-bold" v-if="blankoFull.blanko_full.rekom_status">

                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr class="w-full border border-black ">

                <table class="w-full border-collapse border border-slate-500">
                  <thead>
                    <tr>
                      <th class="border border-slate-600">Signature and name of the Doctor</th>
                      <th class="border border-slate-600">Date of Examination</th>
                      <th class="border border-slate-600">Expired Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.dokter }} <br> Qualification of the Doctor
                      </td>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.masa_berlaku.split('T')[0] }}
                      </td>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.sampai_dengan.split('T')[0] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>
          </section>

          <!-- SECTION Medical Report 3 -->
          <section class="mt-10">
            <header>
              <h1 class="mt-5 text-center font-bold text-2xl">MEDICAL REPORT</h1>
              <p class="font-bold text-center text-lg">To be retained by The Imigration Departement</p>
              <div class="flex justify-end font-bold text-lg">
                <span class="label1 w-full">No. Register</span>
                <span class="w-auto">092834ASd</span>
              </div>
              <section class="flex items-center w-full border-b-4 border-b-black py-2">
                <aside class="absolute justify-start mt-5">
                  <div class="w-20 mr-4">
                    <img :src="blankoFull.image_blob" class="w-full" />
                  </div>
                </aside>
                <div class="flex flex-col mt w-full">

                  <div class="ml-24 mt-2 flex flex-col gap-1">
                    <div class="flex justify-between">
                      <div class="flex flex-col gap-y-1">
                        <p v-if="blankoFull.usia">
                          <span class="label1 inline-block">1. FULL NAME</span>
                          <span>:a</span>
                        </p>
                        <p v-if="blankoFull.jenis_kelamin">
                          <span class="label1">2. SEX</span>
                          <span>: {{ blankoFull.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span>
                        </p>
                        <p v-if="blankoFull.usia">
                          <span class="label1">3. AGE</span>
                          <span>: {{ blankoFull.usia }} YEAR</span>
                        </p>
                      </div>
                      <div class="flex flex-col gap-y-1">
                        <p v-if="blankoFull.usia">
                          <span class="w-[200px] inline-block">FATHER'S NAME</span>
                          <span>:a</span>
                        </p>
                        <p v-if="blankoFull.no_passpor">
                          <span class="w-[200px] inline-block">PASSPORT NO</span>
                          <span>: {{ blankoFull.no_passpor }}</span>
                        </p>
                        <p v-if="blankoFull.pekerjaan_negara_tujuan">
                          <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                          <span>: {{ blankoFull.pekerjaan_negara_tujuan }}</span>
                        </p>
                      </div>
                    </div>
                    <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                    <div class="flex gap-4 justify-start ml-4">
                      <p v-if="blankoFull.daerah">
                        <span class="">Distric</span>
                        <span>: {{ blankoFull.daerah }}</span>
                      </p>
                      <p v-if="blankoFull.provinsi">
                        <span class="">Province</span>
                        <span>: {{ blankoFull.provinsi }}</span>
                      </p>
                      <p v-if="blankoFull.negara">
                        <span class="">Country</span>
                        <span>: {{ blankoFull.negara }}</span>
                      </p>
                    </div>
                    <!-- NOTE untuk nama employee masih belum di tentukan -->

                    <p v-if="blankoFull.usia">
                      <span class="w-[400px] inline-block">5. NAME OF EMPLOYER/RECRUITING AGENCY</span>
                      <span>: {{ blankoFull.usia }}</span>
                    </p>
                    <p v-if="blankoFull.usia">
                      <span class="w-[400px] inline-block">6. ADDRESS OF EMPLOYER/RECRUITING AGENCY </span>
                      <span>: {{ blankoFull.usia }}</span>
                    </p>


                  </div>
                </div>
              </section>
            </header>
            <main class="mt-5">
              <h1 class="font-bold">I HAVE EXAMINED THE ABOVE AND FOUND :</h1>

              <section class="flex flex-col gap-7">
                <table class=" w-[100%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th>NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">HE/SHE IS FREE FROM THE FOLLOWING DISEASES </h4>
                    <tr>
                      <td>
                        HIV/AIDS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        TUBERCULOSIS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        MALARIA
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        LEPROSY
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        STDS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HEPATITIS B
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        HEPATITIS C
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        FILARIASIS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        MAJOR PSYCHIATRIC DISORDERS
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">(Schizophrenia, Bipolar Affective Disorder, Major Depression,
                          Delusional Disorder and other Psychosis)</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        OTHER CHRONIC DISEASES
                      </td>
                      <td>
                        <input type="checkbox" :checked="blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <p v-html="checkGender"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="checkPregnant"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="checkFit"></p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p v-html="considerEmployment"></p>
                      </td>
                    </tr>
                    <p class="italic text-[10px]">(If not considered for employment please state the reason)</p>
                    <tr>
                      <td colspan="3" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.rekom_status">
                            {{ blankoFull.blanko_full.rekom_alasan }}
                          </p>
                          <p class="font-bold" v-if="blankoFull.blanko_full.rekom_status">

                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr class="w-full border border-black ">

                <table class="w-full border-collapse border border-slate-500">
                  <thead>
                    <tr>
                      <th class="border border-slate-600">Signature and name of the Doctor</th>
                      <th class="border border-slate-600">Date of Examination</th>
                      <th class="border border-slate-600">Expired Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.dokter }} <br> Qualification of the Doctor
                      </td>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.masa_berlaku.split('T')[0] }}
                      </td>
                      <td class="text-center font-bold border border-slate-600">
                        {{ blankoFull.blanko_full.sampai_dengan.split('T')[0] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </main>
          </section>

          <!-- <p v-for="(value, key) in blankoFull">
            {{ key !== 'image_blob' ? `${key}: ${value}` : 'image_blob:' }}
            <img v-if="key === 'image_blob'" :src="value" class="w-20" />
          </p>

          <p class="ps-10" v-for="(value, key) in blankoFull.blanko_full">
            {{ `${key}: ${value}` }}
          </p> -->
        </template>
      </ModalBlanko>

      <!-- SECTION - Modal blanko All Pra -->
      <ModalBlanko v-if="popUpTriggers.triggerBlankoAllPra"
        :togglePopUp="() => togglePopUpBlanko('triggerBlankoAllPra', null, true)"
        :showPrintButton="showPrintBlankoAllPraBtn" class="font-poppins">
        <template #header>
          <div>
            <h4 class="font-bold text-lg">All Blanko Pra</h4>
            <p>Cetak data untuk semua Blanko Pra</p>
          </div>
        </template>
        <template #banner>

        </template>
        <template #main>
          <!-- <div v-for="(obj, i) in blankoAllPra">
            <div :key="i" v-for="(value, key) in obj">
              <p>
                {{ key !== 'image_blob' ? `${key}: ${value}` : 'image_blob:' }}
              </p>
              <img v-if="key === 'image_blob'" :src="value" class="w-20" />
            </div>

            <p class="ps-10" v-for="(value, key) in obj.blanko_pra">
              {{ `${key}: ${value}` }}
            </p>
          </div> -->

          <section v-for="(obj, i) in blankoAllPra" :key="i">
            <header class="flex justify-around items-center">
              <img class="w-[80px] h-[80px] object-contain" src="../components/icons/klinikGoraLogo.png" alt="" />
              <div class="text-center">
                <h1 class=" text-xl text-green-500 font-semibold">Klinik <span class="text-yellow-500">GORA</span>
                  Mataram
                </h1>
                <p class="text-yellow-500 font-semibold">Jl. RA. Kartini No. 77 Mojok Telp.(0370) 635661</p>
                <p class="italic text-green-700 font-semibold">Email : goraklinik@gmail.com</p>
              </div>
            </header>

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">KETERANGAN SEHAT</h1>
            <p class="font-poppins text-center">Informasi Hasil Pemeriksaan</p>

            <div class="flex justify-end mt-3">
              <span class="label1 w-full">No. Register</span>
              <span class="w-auto">092834ASd</span>
            </div>

            <!-- SECTION Keterangan Sehat -->
            <section class="flex items-start mt-5">
              <div class="w-20 mr-4">
                <img v-if="obj.image_blob" :src="obj.image_blob" class="w-full" />
              </div>
              <div>
                <p v-if="obj.jenis_kelamin">
                  <span class="label1">Jenis Kelamin</span>
                  <span>: {{ obj.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</span>
                </p>
                <p v-if="obj.usia">
                  <span class="label1">Usia</span>
                  <span>: {{ obj.usia }}</span>
                </p>
                <p v-if="obj.daerah">
                  <span class="label1">Daerah</span>
                  <span>: {{ obj.daerah }}</span>
                </p>
                <p v-if="obj.provinsi">
                  <span class="label1">Provinsi</span>
                  <span>: {{ obj.provinsi }}</span>
                </p>
                <p v-if="obj.negara">
                  <span class="label1">Negara</span>
                  <span>: {{ obj.negara }}</span>
                </p>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Fisik -->

            <h1 class="mt-5 text-center font-semibold border-2 border-t-black border-b-black">KETERANGAN SEHAT</h1>


            <section class="flex flex-wrap gap-10 justify-around mt-5">
              <div>
                <h1 class="font-bold">Fisik</h1>
                <div class="">
                  <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                    <p v-if="key === 'tinggi'">
                      <span class="label2">Tinggi</span>
                      <span>: {{ value }} </span>
                    </p>
                    <p v-if="key === 'berat'">
                      <span class="label2">Berat</span>
                      <span>: {{ value }} </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h1 class="font-bold">Penglihatan</h1>
                <div class="">
                  <div v-for="(value, key) in obj.blanko_pra" :key="key">
                    <p v-if="key === 'mata_kanan'">
                      <span class="label2">Mata kanan</span>
                      <span>: {{ value }}</span>
                    </p>
                    <p v-if="key === 'mata_kiri'">
                      <span class="label2">Mata kiri</span>
                      <span>: {{ value }}</span>
                    </p>
                  </div>
                  <p>
                    <span class="label2" for="mata-kanan">Mata kanan</span>
                    <label for="">:<span class="fa-check fa ml-2"></span></label>
                  </p>
                  <p>
                    <span class="label2" for="mata-kanan">Mata kiri</span>
                    <label for="">:<span class="fa-check fa ml-2"></span></label>
                  </p>
                </div>
              </div>

              <div>
                <h1 class="font-bold">Tekanan Darah</h1>
                <div class="">
                  <div v-for="(value, key) in obj.blanko_pra" :key="key">
                    <p v-if="key === 'tekanan_darah_atas'">
                      <span class="label2">Atas</span>
                      <span>: {{ value }} </span>
                    </p>
                    <p v-if="key === 'tekanan_darah_bawah'">
                      <span class="label2">Bawah</span>
                      <span>: {{ value }} </span>
                    </p>
                    <p v-if="key === 'tekanan_darah_nadi'">
                      <span class="label2">Nadi</span>
                      <span>: {{ value }}</span>
                    </p>
                    <p v-if="key === 'golongan_darah'">
                      <span class="label2">Gol</span>
                      <span>: {{ value }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h1 class="font-bold">Pendengaran</h1>
                <p>
                  <span class="w-[120px] inline-block" for="mata-kanan">Telingan kanan</span>
                  <label for="">:<span class="fa-check fa ml-2"></span></label>
                </p>
                <p>
                  <span class="w-[120px] inline-block" for="mata-kanan">Telinga kiri</span>
                  <label for="">:<span class="fa-check fa ml-2"></span></label>
                </p>
              </div>

              <div class="w-full">
                <h1 class="font-bold">Lain-lain</h1>
                <div class="">
                  <div v-for="(value, key) in obj.blanko_pra" :key="key">
                    <p v-if="key === 'suhu_tubuh'">
                      <span class="label2">Suhu Tubuh</span>
                      <span>: {{ value }} </span>
                    </p>
                    <p v-if="key === 'rontgen'">
                      <span class="label2">Rontgen</span>
                      <span>: {{ value === true ? "Normal" : "Abnormal" }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Laboratorium -->
            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">PEMERIKSAAN
              LABORATORIUM</h1>
            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                  <p v-if="key === 'gula'">
                    <span class="label2">Gula</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                  <p v-if="key === 'protein'">
                    <span class="label2">Protein</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                </div>
              </div>
              <div>
                <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                  <p v-if="key === 'ph'">
                    <span class="label2">PH</span>
                    <span>: {{ value }} </span>
                  </p>
                  <p v-if="key === 'hbs_ag'">
                    <span class="label2">HBs-AG</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                </div>
              </div>
              <div>
                <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                  <p v-if="key === 'vdrl'">
                    <span class="label2">VDRL</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                  <p v-if="key === 'tpha'">
                    <span class="label2">TPHA</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                </div>
              </div>
            </section>

            <!-- SECTION - RADIOLOGI -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">PEMERIKSAAN RADIOLOGI
            </h1>

            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                  <p v-if="key === 'thorax_pa'">
                    <span class="label2">Thorax PA</span>
                    <span>: {{ value === true ? "Normal" : "Abnormal" }} </span>
                  </p>
                </div>
              </div>
            </section>

            <!-- SECTION - HASIL -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">HASIL
            </h1>
            <section class="flex flex-col gap-2 justify-around mt-5 mb-28">
              <div>
                <div v-for="(value, key) in obj.blanko_pra" :key="key" class="">
                  <p v-if="key === 'hasil'">
                    <span class="w-[230px] inline-block">Hasil</span>
                    <span>: {{ value === true ? "SEHAT" : "TIDAK SEHAT" }} </span>
                  </p>
                </div>
              </div>
              <div>
                <div v-for="(value, key) in obj" :key="key" class="">
                  <p v-if="key === 'tanggal_cetak'">
                    <span class="w-[230px] inline-block">Tanggal Pemeriksaan</span>
                    <span>: {{ value }} </span>
                  </p>
                </div>
              </div>
              <div>
                <div v-for="(value, key) in obj" :key="key" class="">
                  <p v-if="key === 'masa_berlaku'">
                    <span class="w-[230px] inline-block">Masa Berlaku</span>
                    <span>: {{ value }} </span>
                  </p>
                </div>
              </div>
            </section>
          </section>
        </template>
      </ModalBlanko>

      <!-- SECTION - Modal blanko All Full -->
      <ModalBlanko v-if="popUpTriggers.triggerBlankoAllFull"
        :togglePopUp="() => togglePopUpBlanko('triggerBlankoAllFull', null, true)"
        :showPrintButton="showPrintBlankoAllFullBtn" class="font-poppins">
        <template #header>
          <div>
            <h4 class="font-bold text-lg">All Blanko Full</h4>
            <p>Cetak data untuk semua Blanko Full</p>
          </div>
        </template>
        <template #banner> </template>
        <template #main>
          <section v-for="(obj, i) in blankoAllFull">
            <header>
              <h1 class="mt-2 text-center text-xl font-bold py-2">MEDICAL REPORT</h1>
              <div class="flex justify-end font-bold">
                <span class="label1 w-full">No. Register</span>
                <span class="w-auto">092834ASd</span>
              </div>

              <section class="flex items-center w-full border-b-4 border-b-black py-2">

                <aside class="absolute justify-start mt-5">
                  <div class="w-20 mr-4">
                    <img :src="obj.image_blob" class="w-full" />
                  </div>
                </aside>

                <div class="flex flex-col mt w-full">
                  <div class="justify-center justify-items-center text-center">
                    <p class="font-bold">Part I. Personal Information</p>
                    <p class="font-bold">(To be completed by application)</p>
                  </div>
                  <div class="ml-24 mt-2 flex flex-col gap-1">
                    <div class="flex justify-between">
                      <div class="flex flex-col gap-y-1">
                        <p v-if="obj.usia">
                          <span class="label1 inline-block">1. FULL NAME</span>
                          <span>:a</span>
                        </p>
                        <p v-if="obj.jenis_kelamin">
                          <span class="label1">2. SEX</span>
                          <span>: {{ obj.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span>
                        </p>
                        <p v-if="obj.usia">
                          <span class="label1">3. AGE</span>
                          <span>: {{ obj.usia }} YEAR</span>
                        </p>
                      </div>
                      <div class="flex flex-col gap-y-1">
                        <p v-if="obj.usia">
                          <span class="w-[200px] inline-block">FATHER'S NAME</span>
                          <span>:a</span>
                        </p>
                        <p v-if="obj.no_passpor">
                          <span class="w-[200px] inline-block">PASSPORT NO</span>
                          <span>: {{ obj.no_passpor }}</span>
                        </p>
                        <p v-if="obj.pekerjaan_negara_tujuan">
                          <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                          <span>: {{ obj.pekerjaan_negara_tujuan }}</span>
                        </p>
                      </div>
                    </div>
                    <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                    <div class="flex gap-4 justify-start ml-4">
                      <p v-if="obj.daerah">
                        <span class="">Distric</span>
                        <span>: {{ obj.daerah }}</span>
                      </p>
                      <p v-if="obj.provinsi">
                        <span class="">Province</span>
                        <span>: {{ obj.provinsi }}</span>
                      </p>
                      <p v-if="obj.negara">
                        <span class="">Country</span>
                        <span>: {{ obj.negara }}</span>
                      </p>
                    </div>

                    <!-- NOTE untuk nama employee masih belum di tentukan -->
                    <p v-if="obj.usia">
                      <span class="w-[400px] inline-block">5. NAME OF EMPLOYER/RECRUITING AGENCY</span>
                      <span>: {{ obj.usia }}</span>
                    </p>
                    <p v-if="obj.usia">
                      <span class="w-[400px] inline-block">6. ADDRESS OF EMPLOYER/RECRUITING AGENCY </span>
                      <span>: {{ obj.usia }}</span>
                    </p>
                  </div>
                </div>
              </section>
            </header>

            <!-- ANCHOR Part 2 -->
            <section class="mt-2">
              <header class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">Part II : Medical History</p>
                <p class="font-poppins font-bold"> (To be completed by attending physician)</p>
              </header>
              <main class="parent flex flex-wrap gap-2 justify-center px-5 mt-[20px]">
                <section class="section1">
                  <div class="grid grid-cols-4 gap-y-2 items-center">
                    <label class="col-start-2 text-center font-semibold">YES</label>
                    <label class="text-center font-semibold">NO</label>
                    <label class="text-center font-semibold">Tanggal</label>

                    <label class="w-fit">HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.hiv_status"
                      class="h-[20px] custom-disabled-checkbox" disabled>
                    <input type="checkbox" :checked="!obj.blanko_full.hiv_status"
                      class="h-[20px] custom-disabled-checkbox" disabled>
                    <input type="date" :value="obj.blanko_full.hiv_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />


                    <label class="w-fit">Tuberculosis <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.tbc_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.tbc_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.tbc_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Malaria <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.malaria_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.malaria_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.malaria_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Leprosy <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.leprosy_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.leprosy_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.leprosy_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">STD <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.std_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.std_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.std_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Bronchial Asthma </label>
                    <input type="checkbox" :checked="obj.blanko_full.asma_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.asma_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.asma_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Heart Disease </label>
                    <input type="checkbox" :checked="obj.blanko_full.hd_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.hd_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.hd_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Hypertension </label>
                    <input type="checkbox" :checked="obj.blanko_full.hypt_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.hypt_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.hypt_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="w-fit">Diabetes Mellitus </label>
                    <input type="checkbox" :checked="obj.blanko_full.dbm_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.dbm_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.dbm_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />
                  </div>
                </section>
                <section class="section2">
                  <div class="grid grid-cols-4  gap-y-2 items-center">
                    <label class="col-start-2 text-center font-semibold">YES</label>
                    <label class="text-center font-semibold">NO</label>
                    <label for="">Tanggal</label>

                    <label class="">Peptic Ulcer</label>
                    <input type="checkbox" :checked="obj.blanko_full.ptu_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.ptu_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.ptu_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Kidney Disease</label>
                    <input type="checkbox" :checked="obj.blanko_full.kidney_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.kidney_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.kidney_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Cancer</label>
                    <input type="checkbox" :checked="obj.blanko_full.cancer_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.cancer_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.cancer_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Epylepsy <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.epylepsy_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.epylepsy_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.epylepsy_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Psychiatric Illnes <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.psin_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.psin_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.psin_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Hearing Problem</label>
                    <input type="checkbox" :checked="obj.blanko_full.hepo_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.hepo_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.hepo_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label>
                    <input type="checkbox" :checked="obj.blanko_full.hpts_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.hpts_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.hpts_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />

                    <label class="">Other</label>
                    <input type="checkbox" :checked="obj.blanko_full.other_status" class="h-[20px]" disabled />
                    <input type="checkbox" :checked="!obj.blanko_full.other_status" class="h-[20px]" disabled />
                    <input type="date" :value="obj.blanko_full.other_date.split('T')[0]" placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md" disabled />
                  </div>
                </section>
                <h1 class=" border-b-4 border-black font-bold">* To be considered Unfit if found positive (For other
                  diseases it is
                  up to
                  the descreation’s
                  of the examining Doctor)</h1>
              </main>
            </section>

            <!-- ANCHOR Part 3 -->
            <section class="mt-2">
              <header class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">Part III : Present Medical History</p>
                <p class="font-poppins font-bold"> (To be completed by attending Doctor)</p>
              </header>
              <main class="flex gap-7 mt-5">
                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>YES</th>
                      <th class="inline-block px-3">NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="">
                      <td class="w-full">
                        Shortness of breath during exertion
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.snf_status"
                          class="h-[20px] items-center w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.snf_status"
                          class="h-[20px] text-center items-center w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Chest pain during exertion <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.nyd_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.nyd_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Palpitation <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.dbj_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.dbj_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Swelling of feet
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.pbk_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.pbk_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Giddiness of headache <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.rspks_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.rspks_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Cough for more than 2 weeks or haemoplysis
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.hmp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.hmp_status"
                          class="h-[20px] text-center items-center w-full" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>YES</th>
                      <th class="inline-block px-3">NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        Loos of appelite
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.ksm_status" class="h-[20px] w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.ksm_status" class="h-[20px] w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        excessive thirst and frequent urination
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.rhb_sbk_status" class="h-[20px] w-full"
                          disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.rhb_sbk_status" class="h-[20px] w-full"
                          disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Dysuria, hematuria & other urinary symptoms
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.gskl_status" class="h-[20px] w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.gskl_status" class="h-[20px] w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Urethral/Vaginal discharge
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.kcuv_status" class="h-[20px] w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.kcuv_status" class="h-[20px] w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Multiple joint pain
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.nsm_status" class="h-[20px] w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.nsm_status" class="h-[20px] w-full" disabled>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Visual problem/colour blindness
                      </td>
                      <td>
                        <input type="checkbox" :checked="obj.blanko_full.mpbw_status" class="h-[20px] w-full" disabled>
                      </td>
                      <td>
                        <input type="checkbox" :checked="!obj.blanko_full.mpbw_status" class="h-[20px] w-full" disabled>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </main>
              <h1 class=" border-b-4 border-black font-bold mt-3">To confirm further during examination and
                investigation
                of
                the
                applicant</h1>
            </section>

            <!-- ANCHOR Part 4 -->
            <section class="mt-2">
              <header class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">Part IV : Physical Examination and Investigation</p>
                <p class="font-poppins font-bold"> (To be completed by the attending Doctor)</p>
              </header>
              <main class="mt-2">
                <!-- NOTE SECTION A belum mengambil data dari pra -->
                <h4 class="font-bold mt-2" for="section-a">(Section A : General Physical Examination)</h4>
                <section class="flex gap-2">
                  <div class="border-2 border-black p-2 rounded-md flex gap-4">
                    <p v-if="blankoPra">Height : 170 Cm</p>
                    <p v-if="blankoPra">Weight : 55 Kg</p>
                  </div>
                  <div class="border-2 border-black p-2 rounded-md flex gap-4">
                    <p>Pulse : 80 /min</p>
                  </div>
                  <div class="border-2 border-black p-2 rounded-md flex gap-4">
                    <p>Blood Pressure : 124/68 mm/hg</p>
                  </div>
                </section>
                <section class="flex gap-7 mt-5">
                  <table class="w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>PRESENT</th>
                        <th class="ml-3 inline-block">ABSENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="">
                        <td class="w-full">
                          Chronic Skin Rash
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.rkk_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.rkk_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Anaesthetic Skin Pach, Peripheral Nerve Enlargement or Nodular Lesion
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.pkln_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.pkln_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Deformities of Limbs
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.dfab_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.dfab_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Anemia
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Juandice
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>

                    </tbody>
                  </table>
                  <table class="w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>RIGHT</th>
                        <th class="ml-3 inline-block">LEFT</th>
                      </tr>
                    </thead>
                    <tbody>

                      <label for="" class="font-bold">Vision Test : </label>
                      <tr>
                        <td class="flex flex-col">
                          UNAIDED
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.tb_mt_kiri"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.tb_mt_kanan"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td class="flex flex-col">
                          AIDED
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.db_mt_kiri"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.db_mt_kanan"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Hearing Impairment Present
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.tgp_kiri"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.tgp_kanan"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Colour Blindness
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.kbw_kiri"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.kbw_kanan"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </section>

                <!-- SECTION Medical Report 2 -->
                <!-- NOTE SECTION B... -->
                <h4 class="font-bold mt-4" for="section-b">Section B : System Examination</h4>
                <section class="flex gap-7">
                  <table class=" w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>NORMAL</th>
                        <th class="ml-3 inline-block">ABNORMAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="3">
                          <h4 for="" class="font-bold">Cardiovascular System</h4>
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">
                          Heart Size
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.ukj_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.ukj_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Heart sounds
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.saj_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.saj_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Other findings
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.tl_sps">
                              {{ obj.blanko_full.tl_sps }}
                            </p>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <h4 class="font-bold w-full">Respiratory System </h4>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Breath Sounds
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.sps_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.sps_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Other findings
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.tl_jantung">
                              {{ obj.blanko_full.tl_jantung }}
                            </p>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <h4 for="" class="font-bold">Nervous System and Mental Status</h4>
                        </td>
                      </tr>

                      <tr class="">
                        <td class="w-full">
                          General Mental Status
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.smu_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.smu_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">
                          Speech
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.berbicara_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.berbicara_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">
                          Cognitive Function
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.fk_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.fk_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">
                          Size of Peripheral Nerves
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.usp_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.usp_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">
                          Motor Power
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.km_status"
                            class="h-[20px] items-center w-full" disabled>
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.km_status"
                            class="h-[20px] text-center items-center w-full" disabled>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                  <table class=" w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>NORMAL</th>
                        <th class="ml-3 inline-block">ABNORMAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">Gastrointestinal </h4>
                      <tr>
                        <td>
                          Liver
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.hati_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.hati_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Spleen
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.limpa_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.limpa_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Kidney
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.ginjal_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.ginjal_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Is There Abnormal Sweling ?YES /NO
                          Indicate if YES .............

                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.pbk_sp_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.pbk_sp_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.tl_sp">
                              {{ obj.blanko_full.tl_sp }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Rectal Examination (if indicated)

                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.pr_sp_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.pr_sp_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Sensory

                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.sensorik_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.sensorik_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Reflexes
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.reflek_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.reflek_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <h4 for="" class="font-bold inline-block w-fit">Examination of The Genitourinay System </h4>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          Discharge
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.psg_pbn_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.psg_pbn_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Sores/Ulcers
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.luka_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.luka_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <!-- NOTE SECTION C...-->
                <h4 class="font-bold mt-4" for="section-b">Section C : Laboratory Result and X-Ray Findings</h4>
                <p>Specimens for laboratory investigation must be collected by the examining doctors</p>
                <section class="flex gap-7">
                  <table class=" w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th class="ml-3 inline-block">NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">Blood </h4>
                      <tr>
                        <td>
                          HIV Antibody (ELISA)
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.elisa_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.elisa_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HBsAg<span class="text-red-500 text-[20px]">*</span>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.hbsag_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.hbsag_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HCT<span class="text-red-500 text-[20px]">*</span>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.hct_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.hct_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          VDRL & TPHA<span class="text-red-500 text-[20px]">*</span>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.vdrl_tpha_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.vdrl_tpha_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Malaria Parasite
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.pama_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.pama_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">For Malaria, if positive give appropriate treatment and then
                            repeat test 1 month after
                            treatment. Date when blood test for malaria parasite
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Filaria Parasite
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.pafil_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.pafil_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Slit Skin Smear (if indicated)
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.ck_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.ck_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="mt-2">Chest X-Ray Report (Valid For 6 month) : </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.cxray_report">
                              {{ obj.blanko_full.cxray_report }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="mt-2">Sputum AFB (if indicated)</p>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.sptm_afb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.sptm_afb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class=" w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th class="ml-3 inline-block">NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="3">
                          <p class="font-bold">Urine Examination</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Colour
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.warna_urin">
                              {{ obj.blanko_full.warna_urin }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Specific Gravity
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.gravitasi_spesifik">
                              {{ obj.blanko_full.gravitasi_spesifik }}
                            </p>

                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Sugar
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.gula_status">
                              {{ obj.blanko_full.gula_status === true ? "POSITIVE" : "NEGATIVE" }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Albumin
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.albumin_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.albumin_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="mt-2">Miroscopicexamination : </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.pm_miros">
                              {{ obj.blanko_full.pm_miros }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Opiates / Cannabis / Amphetamine<span class="text-red-500 text-[20px]">*</span>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.oga_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.oga_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Pregnancy<span class="text-red-500 text-[20px]">*</span>
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.kehamilan_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.kehamilan_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">*to be considered Unfit if found Positive</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="1">
                          Serum Creatinine
                        </td>
                        <td colspan="2" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="obj.blanko_full.serum_krtnn">
                              {{ obj.blanko_full.serum_krtnn }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]"> done in country of origin for worker with history of renal
                            diseases, hipertension, and diabetes mellitus
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Rectal Swab for Salmonella</td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.urus_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.urus_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">(Only those in Food Industry)</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </main>
            </section>

            <!-- ANCHOR Part 5 -->
            <section class="mt-2">
              <header class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">(Part V : Certification by Attending Doctor)</p>
              </header>
              <main class="mt-2">
                <h4 class="font-bold mt-2" for="section-a">I HAVE EXAMINED THE ABOVE AND FOUND :</h4>

                <section class="flex flex-col gap-7">
                  <table class=" w-[100%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th>NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">HE/SHE IS FREE FROM THE FOLLOWING DISEASES </h4>
                      <tr>
                        <td>
                          HIV/AIDS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          TUBERCULOSIS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          MALARIA
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          LEPROSY
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          STDS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HEPATITIS B
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HEPATITIS C
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          FILARIASIS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          MAJOR PSYCHIATRIC DISORDERS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">(Schizophrenia, Bipolar Affective Disorder, Major Depression,
                            Delusional Disorder and other Psychosis)</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          OTHER CHRONIC DISEASES
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <p v-html="checkGender"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="checkPregnant"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="checkFit"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="considerEmployment"></p>
                        </td>
                      </tr>
                      <p class="italic text-[10px]">(If not considered for employment please state the reason)</p>
                      <tr>
                        <td colspan="3" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="!obj.blanko_full.rekom_status">
                              {{ obj.blanko_full.rekom_alasan }}
                            </p>
                            <p class="font-bold" v-if="obj.blanko_full.rekom_status">

                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <hr class="w-full border border-black ">

                  <table class="w-full border-collapse border border-slate-500">
                    <thead>
                      <tr>
                        <th class="border border-slate-600">Signature and name of the Doctor</th>
                        <th class="border border-slate-600">Date of Examination</th>
                        <th class="border border-slate-600">Expired Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.dokter }} <br> Qualification of the Doctor
                        </td>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.masa_berlaku.split('T')[0] }}
                        </td>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.sampai_dengan.split('T')[0] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </main>
            </section>

            <!-- SECTION Medical Report 3 -->
            <section class="mt-10">
              <header>
                <h1 class="mt-5 text-center font-bold text-2xl">MEDICAL REPORT</h1>
                <p class="font-bold text-center text-lg">To be retained by The Imigration Departement</p>
                <div class="flex justify-end font-bold text-lg">
                  <span class="label1 w-full">No. Register</span>
                  <span class="w-auto">092834ASd</span>
                </div>
                <section class="flex items-center w-full border-b-4 border-b-black py-2">
                  <aside class="absolute justify-start mt-5">
                    <div class="w-20 mr-4">
                      <img :src="obj.image_blob" class="w-full" />
                    </div>
                  </aside>
                  <div class="flex flex-col mt w-full">

                    <div class="ml-24 mt-2 flex flex-col gap-1">
                      <div class="flex justify-between">
                        <div class="flex flex-col gap-y-1">
                          <p v-if="obj.usia">
                            <span class="label1 inline-block">1. FULL NAME</span>
                            <span>:a</span>
                          </p>
                          <p v-if="obj.jenis_kelamin">
                            <span class="label1">2. SEX</span>
                            <span>: {{ obj.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span>
                          </p>
                          <p v-if="obj.usia">
                            <span class="label1">3. AGE</span>
                            <span>: {{ obj.usia }} YEAR</span>
                          </p>
                        </div>
                        <div class="flex flex-col gap-y-1">
                          <p v-if="obj.usia">
                            <span class="w-[200px] inline-block">FATHER'S NAME</span>
                            <span>:a</span>
                          </p>
                          <p v-if="obj.no_passpor">
                            <span class="w-[200px] inline-block">PASSPORT NO</span>
                            <span>: {{ obj.no_passpor }}</span>
                          </p>
                          <p v-if="obj.pekerjaan_negara_tujuan">
                            <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                            <span>: {{ obj.pekerjaan_negara_tujuan }}</span>
                          </p>
                        </div>
                      </div>
                      <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                      <div class="flex gap-4 justify-start ml-4">
                        <p v-if="obj.daerah">
                          <span class="">Distric</span>
                          <span>: {{ obj.daerah }}</span>
                        </p>
                        <p v-if="obj.provinsi">
                          <span class="">Province</span>
                          <span>: {{ obj.provinsi }}</span>
                        </p>
                        <p v-if="obj.negara">
                          <span class="">Country</span>
                          <span>: {{ obj.negara }}</span>
                        </p>
                      </div>
                      <!-- NOTE untuk nama employee masih belum di tentukan -->

                      <p v-if="obj.usia">
                        <span class="w-[400px] inline-block">5. NAME OF EMPLOYER/RECRUITING AGENCY</span>
                        <span>: {{ obj.usia }}</span>
                      </p>
                      <p v-if="obj.usia">
                        <span class="w-[400px] inline-block">6. ADDRESS OF EMPLOYER/RECRUITING AGENCY </span>
                        <span>: {{ obj.usia }}</span>
                      </p>


                    </div>
                  </div>
                </section>
              </header>
              <main class="mt-5">
                <h1 class="font-bold">I HAVE EXAMINED THE ABOVE AND FOUND :</h1>

                <section class="flex flex-col gap-7">
                  <table class=" w-[100%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th>NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">HE/SHE IS FREE FROM THE FOLLOWING DISEASES </h4>
                      <tr>
                        <td>
                          HIV/AIDS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          TUBERCULOSIS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          MALARIA
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          LEPROSY
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          STDS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HEPATITIS B
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          HEPATITIS C
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          FILARIASIS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          MAJOR PSYCHIATRIC DISORDERS
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">(Schizophrenia, Bipolar Affective Disorder, Major Depression,
                            Delusional Disorder and other Psychosis)</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          OTHER CHRONIC DISEASES
                        </td>
                        <td>
                          <input type="checkbox" :checked="obj.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                        <td>
                          <input type="checkbox" :checked="!obj.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full" disabled />
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <p v-html="checkGender"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="checkPregnant"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="checkFit"></p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p v-html="considerEmployment"></p>
                        </td>
                      </tr>
                      <p class="italic text-[10px]">(If not considered for employment please state the reason)</p>
                      <tr>
                        <td colspan="3" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="!obj.blanko_full.rekom_status">
                              {{ obj.blanko_full.rekom_alasan }}
                            </p>
                            <p class="font-bold" v-if="obj.blanko_full.rekom_status">

                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <hr class="w-full border border-black ">

                  <table class="w-full border-collapse border border-slate-500">
                    <thead>
                      <tr>
                        <th class="border border-slate-600">Signature and name of the Doctor</th>
                        <th class="border border-slate-600">Date of Examination</th>
                        <th class="border border-slate-600">Expired Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.dokter }} <br> Qualification of the Doctor
                        </td>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.masa_berlaku.split('T')[0] }}
                        </td>
                        <td class="text-center font-bold border border-slate-600">
                          {{ obj.blanko_full.sampai_dengan.split('T')[0] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </main>
            </section>
          </section>
          <!-- <div v-for="(obj, i) in blankoAllFull">
            <div :key="i" v-for="(value, key) in obj">
              <header>

              </header>
              {{ key !== 'image_blob' ? `${key}: ${value}` : 'image_blob:' }}
              <img v-if="key === 'image_blob'" :src="value" class="w-20" />
            </div>

            <p class="ps-10" v-for="(value, key) in obj.blanko_full">
              {{ `${key}: ${value}` }}
            </p>
          </div> -->
        </template>
      </ModalBlanko>

      <ModalRekap v-if="popUpTriggers.triggerRekap" :togglePopUp="() => togglePopUpKwitansi('triggerRekap')"
        :showPrintButton="showPrintKwitansiBtn" :showPrintDetailButton="showPrintPasienBtn" class="font-poppins">
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
            <img class="w-[80px] h-[80px] object-contain" src="../components/icons/klinikGoraLogo.png" alt="" />
            <div class="text-right">
              <h1 class="font-bold text-lg">KLINIK GORA MATARAM</h1>
              <p>Jl. RA. Kartini No. 77 Mojok - Mataram - NTB Mataram</p>
              <p>Indonesia - Telp.(0370) 635661 Fax (0370) 635661</p>
              <p>goraklinik@gmail.com</p>
            </div>
          </div>
        </template>

        <!-- NOTE - Kwitansi -->
        <template #main>
          <div v-if="kwitansi.total_harga <= kwitansi.total_pembayaran"
            class="absolute left-1/2 -translate-x-1/2 top-1/2 transform rotate-45 text-black/10 -translate-y-1/2 text-[130px] font-semibold">
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

        <!-- NOTE - Detail Pasien -->
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
      </ModalRekap>
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