<script>
import CetakKuitansi from '@/components/icons/CetakKuitansi.vue'
import { computed, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Blanko',
  components: { CetakKuitansi },
  setup() {
    const store = useStore()
    const router = useRouter()
    const isLoading = ref(true)
    const blankoFull = computed(() => store.getters['getBlankoFull'])
    const blankoAllFull = computed(() => store.getters['getBlankoAllFull'])
    const blankoSection = ref(null)
    const blankoAllSection = ref(null)
    const type = router.currentRoute.value.query.type

    onBeforeMount(async () => {
      isLoading.value = true
      const uuid = router.currentRoute.value.query.id
      if (type === 'single') {
        await store
          .dispatch('fetchBlankoFull', uuid)
          .then((res) => {
            console.log(res)
            if (res.data === undefined) router.replace('/rekap-kwitansi')
          })
          .finally(() => (isLoading.value = false))
      } else {
        const uuids = router.currentRoute.value.query.id.split(',')
        await store
          .dispatch('fetchAllBlankoFull', uuids)
          .then((isSuccess) => {
            console.log(isSuccess)
            if (!isSuccess) router.replace('/rekap-kwitansi')
          })
          .finally(() => (isLoading.value = false))
      }
    })

    const printModal = () => {
      const printOptions = (targetID) => ({
        printable: targetID,
        type: 'html',
        targetStyles: ['*', 'page-break-after'],
        showModal: true,
        documentTitle: type === 'single' ? 'Blanko Full - Single' : 'Blanko Full - All',
        targetStyle: ['page-break-after'],
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
          
          #${targetID} {
            padding: 0 !important;
            margin: 0 !important;
            page-break-after: always;
          }

          @media print {
            @page {
              size: A4 portrait;
              margin: 10px !important;
              padding: 0 !important;
            }
          }
          `
      })
      if (type === 'single') {
        printJS(printOptions('blanko-full'))
      } else {
        printJS(printOptions('blanko-full-all'))
      }
      // window.print()
    }

    //NOTE - V-Html
    const checkGender = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        if (blankoFull.value.blanko_full.urine_oka_status === true) {
          return 'HIS/<s>HER</s> URINE IS TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE'
        } else {
          return 'HIS/<s>HER</s> URINE IS NOT TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE'
        }
      } else {
        if (blankoFull.value.blanko_full.urine_oka_status === true) {
          return '<s>HIS</s>/HER URINE IS TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE'
        } else {
          return '<s>HIS</s>/HER URINE IS NOT TO CONTAIN OPIATE/CANNABIS/AMPHETAMINE'
        }
      }
    })

    const checkPregnant = computed(() => {
      if (blankoFull.value.jenis_kelamin === 'L') {
        return 'HE/<s>SHE</s> IS NOT PREGNANT'
      } else if (blankoFull.value.blanko_full.dsh_status === 'P') {
        if (blankoFull.value.blanko_full.dsh_status === true) {
          return '<s>HE</s>/SHE IS PREGNANT'
        } else {
          return '<s>HE</s>/SHE IS NOT PREGNANT'
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
      printModal,
      isLoading,
      blankoSection,
      blankoFull,
      checkPregnant,
      checkFit,
      checkGender,
      considerEmployment,
      blankoAllSection,
      blankoAllFull,
      type
    }
  }
}
</script>
<template>
  <div class="screen min-h-screen bg-[#1a1a1a] p-0 m-0 w-screen h-full">
    <div class="container max-w-[950px] bg-white p-0 m-0 h-fit mx-auto px-5 pb-5 pt-3">
      <header
        class="w-full border rounded-lg ps-5 py-1 pe-1 mb-10 flex items-stretch gap-4 justify-between"
      >
        <div>
          <h4 class="font-bold text-lg">Blanko Full</h4>
          <p>Cetak data untuk Blanko Full</p>
        </div>
        <button
          @click="printModal"
          class="p-[13px] transition-all rounded-lg flex items-center justify-center gap-3 text-white"
          :class="[isLoading ? 'bg-[#91accc]' : 'bg-[#0075FF] hover:bg-[#2260a8]']"
        >
          <p>Cetak Blanko Full</p>
          <CetakKuitansi></CetakKuitansi>
        </button>
      </header>

      <main v-if="type === 'single'" ref="blankoSection" id="blanko-full" class="bg-white w-full">
        <div class="bg-black/50 w-full">
          <h1 class="mt-2 text-center text-xl font-bold py-2">MEDICAL REPORT</h1>
          <div class="flex justify-end font-bold">
            <span class="label1 w-full">No. Register</span>
            <span class="w-auto">092834ASd</span>
          </div>

          <div class="text-center mx-auto">
            <p class="font-bold">Part I. Personal Information</p>
            <p class="font-bold">(To be completed by application)</p>
          </div>
          <section class="flex items-center w-full border-b-4 border-b-black py-2">
            <aside class="shrink self-start mt-4">
              <div class="w-20 mr-4">
                <img v-if="blankoFull.image_blob" :src="blankoFull.image_blob" class="w-full" />
                <div v-else class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"></div>
              </div>
            </aside>

            <div class="grow">
              <div class="mt-2 flex flex-col gap-1">
                <div class="flex justify-between">
                  <div class="flex flex-col gap-y-1">
                    <p>
                      <span class="label1 inline-block">1. FULL NAME</span>
                      <span v-if="blankoFull.usia">: a</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                    <p>
                      <span class="label1">2. SEX</span>
                      <span v-if="blankoFull.jenis_kelamin"
                        >: {{ blankoFull.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span
                      >
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                    <p>
                      <span class="label1">3. AGE</span>
                      <span v-if="blankoFull.usia">: {{ blankoFull.usia }} YEAR</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                  </div>
                </div>
                <div class="flex flex-col gap-y-1">
                  <p>
                    <span class="inline-block">FATHER'S NAME</span>
                    <span v-if="blankoFull.usia">:a</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                  <p>
                    <span class="inline-block">PASSPORT NO</span>
                    <span v-if="blankoFull.no_passpor">: {{ blankoFull.no_passpor }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                  <p>
                    <span class="inline-block">TYPE OF JOB APPLIED</span>
                    <span v-if="blankoFull.pekerjaan_negara_tujuan"
                      >: {{ blankoFull.pekerjaan_negara_tujuan }}</span
                    >
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                </div>
                <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                <div class="flex gap-4 justify-start ml-4">
                  <p>
                    <span class="">Distric</span>
                    <span v-if="blankoFull.daerah">: {{ blankoFull.daerah }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                  <p>
                    <span class="">Province</span>
                    <span v-if="blankoFull.provinsi">: {{ blankoFull.provinsi }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                  <p>
                    <span class="">Country</span>
                    <span v-if="blankoFull.negara">: {{ blankoFull.negara }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                </div>

                <!-- NOTE untuk nama employee masih belum di tentukan -->
                <p>
                  <span class="inline-block">5. NAME OF EMPLOYER/RECRUITING AGENCY</span>
                  <span v-if="blankoFull.usia">: {{ blankoFull.usia }}</span>
                  <span v-else
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
                <p>
                  <span class="inline-block">6. ADDRESS OF EMPLOYER/RECRUITING AGENCY </span>
                  <span v-if="blankoFull.usia">: {{ blankoFull.usia }}</span>
                  <span v-else
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
              </div>
            </div>
          </section>
        </div>

        <div>
          <!-- ANCHOR Part 2 -->
          <section class="mt-2 relative z-[1]">
            <img
              class="w-[50%] opacity-15 top-1/2 -translate-y-1/2 left-1/2 -translate-x-2/3 absolute -z-10 aspect-auto object-contain"
              src="../../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-center">
              <p class="font-poppins font-bold">Part II : Medical History</p>
              <p class="font-poppins font-bold">(To be completed by attending physician)</p>
            </div>
            <div class="parent flex gap-2 mt-[20px] justify-between">
              <section class="section1">
                <div class="grid grid-cols-7 gap-y-2 items-center">
                  <label class="col-start-4 text-center font-semibold">YES</label>
                  <label class="text-center font-semibold">NO</label>
                  <label class="col-span-2 text-center font-semibold">Tanggal</label>

                  <label class="w-fit col-span-3"
                    >HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.hiv_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.hiv_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.hiv_date"
                    type="date"
                    :value="blankoFull.blanko_full.hiv_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] col-span-2 px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3"
                    >Tuberculosis <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.tbc_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.tbc_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.tbc_date"
                    type="date"
                    :value="blankoFull.blanko_full.tbc_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3"
                    >Malaria <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.malaria_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.malaria_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.malaria_date"
                    type="date"
                    :value="blankoFull.blanko_full.malaria_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3"
                    >Leprosy <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.leprosy_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.leprosy_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.leprosy_date"
                    type="date"
                    :value="blankoFull.blanko_full.leprosy_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3"
                    >STD <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.std_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.std_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.std_date"
                    type="date"
                    :value="blankoFull.blanko_full.std_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3">Bronchial Asthma </label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.asma_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.asma_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.asma_date"
                    type="date"
                    :value="blankoFull.blanko_full.asma_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3">Heart Disease </label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.hd_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.hd_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.hd_date"
                    type="date"
                    :value="blankoFull.blanko_full.hd_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3">Hypertension </label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.hypt_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.hypt_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.hypt_date"
                    type="date"
                    :value="blankoFull.blanko_full.hypt_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="w-fit col-span-3">Diabetes Mellitus </label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.dbm_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.dbm_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.dbm_date"
                    type="date"
                    :value="blankoFull.blanko_full.dbm_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </section>
              <section class="section2">
                <div class="grid grid-cols-7 gap-y-2 items-center">
                  <label class="col-start-4 text-center font-semibold">YES</label>
                  <label class="text-center font-semibold">NO</label>
                  <label class="col-span-2 font-semibold text-center" for="">Tanggal</label>

                  <label class="col-span-3">Peptic Ulcer</label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.ptu_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.ptu_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.ptu_date"
                    type="date"
                    :value="blankoFull.blanko_full.ptu_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3">Kidney Disease</label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.kidney_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.kidney_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.kidney_date"
                    type="date"
                    :value="blankoFull.blanko_full.kidney_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3">Cancer</label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.cancer_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.cancer_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.cancer_date"
                    type="date"
                    :value="blankoFull.blanko_full.cancer_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3"
                    >Epylepsy <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.epylepsy_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.epylepsy_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.epylepsy_date"
                    type="date"
                    :value="blankoFull.blanko_full.epylepsy_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3"
                    >Psychiatric Illnes <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.psin_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.psin_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.psin_date"
                    type="date"
                    :value="blankoFull.blanko_full.psin_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3">Hearing Problem</label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.hepo_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.hepo_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.hepo_date"
                    type="date"
                    :value="blankoFull.blanko_full.hepo_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3"
                    >Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label
                  >
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.hpts_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.hpts_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.hpts_date"
                    type="date"
                    :value="blankoFull.blanko_full.hpts_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>

                  <label class="col-span-3">Other</label>
                  <input
                    type="checkbox"
                    :checked="blankoFull.blanko_full.other_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    type="checkbox"
                    :checked="!blankoFull.blanko_full.other_status"
                    class="h-[20px]"
                    disabled
                  />
                  <input
                    v-if="blankoFull.blanko_full.other_date"
                    type="date"
                    :value="blankoFull.blanko_full.other_date.split('T')[0]"
                    placeholder="Pilih Tanggal"
                    class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                    disabled
                  />
                  <span
                    v-else
                    class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </section>
            </div>
            <h1 class="grow w-full flex-1 border-b-4 border-black font-bold">
              * To be considered Unfit if found positive (For other diseases it is up to the
              descreation’s of the examining Doctor)
            </h1>
          </section>

          <!-- ANCHOR Part 3 -->
          <section class="mt-2">
            <div class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">Part III : Present Medical History</p>
              <p class="font-poppins font-bold">(To be completed by attending Doctor)</p>
            </div>
            <div class="flex gap-7 mt-5">
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
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.snf_status"
                        class="h-[20px] items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.snf_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Chest pain during exertion <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.nyd_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.nyd_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Palpitation <span class="text-red-500 text-[20px]">*</span></td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.dbj_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.dbj_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Swelling of feet</td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.pbk_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.pbk_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Giddiness of headache <span class="text-red-500 text-[20px]">*</span></td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.rspks_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.rspks_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Cough for more than 2 weeks or haemoplysis</td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.hmp_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.hmp_status"
                        class="h-[20px] text-center items-center w-full"
                        disabled
                      />
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
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.ksm_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.ksm_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      excessive thirst and frequent urination
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.rhb_sbk_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.rhb_sbk_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Dysuria, hematuria & other urinary symptoms
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.gskl_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.gskl_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Urethral/Vaginal discharge
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.kcuv_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.kcuv_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Multiple joint pain
                      <span class="text-red-500 text-[20px]">*</span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.nsm_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.nsm_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Visual problem/colour blindness</td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="blankoFull.blanko_full.mpbw_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="!blankoFull.blanko_full.mpbw_status"
                        class="h-[20px] w-full"
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h1 class="border-b-4 border-black font-bold mt-3">
              To confirm further during examination and investigation of the applicant
            </h1>
          </section>

          <!-- ANCHOR Part 4 -->
          <section class="mt-2">
            <div class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">Part IV : Physical Examination and Investigation</p>
              <p class="font-poppins font-bold">(To be completed by the attending Doctor)</p>
            </div>
            <div class="mt-2">
              <!-- NOTE SECTION A belum mengambil data dari pra -->
              <h4 class="font-bold mt-2" for="section-a">
                (Section A : General Physical Examination)
              </h4>
              <section class="flex gap-2">
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p>Height : 170 Cm</p>
                  <p>Weight : 55 Kg</p>
                </div>
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p>Pulse : 80 /min</p>
                </div>
                <div class="border-2 border-black p-2 rounded-md flex gap-4">
                  <p>Blood Pressure : 124/68 mm/hg</p>
                </div>
              </section>
              <section class="flex gap-7 mt-5 bg-black/50 w-full">
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
                      <td class="w-full">Chronic Skin Rash</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.rkk_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.rkk_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Anaesthetic Skin Pach, Peripheral Nerve Enlargement or Nodular Lesion</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.pkln_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.pkln_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Deformities of Limbs</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.dfab_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.dfab_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Anemia</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Juandice</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.anemia_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
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
                      <td class="flex flex-col">UNAIDED</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.tb_mt_kiri"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.tb_mt_kanan"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="flex flex-col">AIDED</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.db_mt_kiri"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.db_mt_kanan"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Hearing Impairment Present</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.tgp_kiri"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.tgp_kanan"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Colour Blindness</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.kbw_kiri"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.kbw_kanan"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <!-- SECTION Medical Report 2 -->
              <!-- NOTE SECTION B... -->
              <h4 class="font-bold mt-4 bg-black/50">Section B : System Examination</h4>
              <section class="flex gap-7 bg-red-400/40">
                <table class="w-[50%]">
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
                        <h4 class="font-bold">Cardiovascular System</h4>
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">Heart Size</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.ukj_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.ukj_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Heart sounds</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.saj_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.saj_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Other findings</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.tl_sps
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.tl_sps">
                            {{ blankoFull.blanko_full.tl_sps }}
                          </p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <h4 class="font-bold w-full">Respiratory System</h4>
                      </td>
                    </tr>

                    <tr>
                      <td>Breath Sounds</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.sps_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.sps_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Other findings</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.tl_jantung
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] bg-inherit px-2">
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
                      <td class="w-full">General Mental Status</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.smu_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.smu_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">Speech</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.berbicara_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.berbicara_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">Cognitive Function</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.fk_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.fk_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">Size of Peripheral Nerves</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.usp_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.usp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr class="">
                      <td class="w-full">Motor Power</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.km_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.km_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>NORMAL</th>
                      <th class="ml-3 inline-block">ABNORMAL</th>
                    </tr>
                  </thead>
                  <tbody class="overflow-visible">
                    <h4 for="" class="font-bold inline-block w-fit">Gastrointestinal</h4>
                    <tr>
                      <td>Liver</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.hati_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.hati_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Spleen</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.limpa_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.limpa_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Kidney</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.ginjal_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.ginjal_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Is There Abnormal Sweling ? <br />
                        YES / NO Indicate if YES .............
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.pbk_sp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.pbk_sp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr class="">
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.tl_sps
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.tl_sp">
                            {{ blankoFull.blanko_full.tl_sp }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Rectal Examination (if indicated)</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.pr_sp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.pr_sp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Sensory</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.sensorik_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.sensorik_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Reflexes</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.reflek_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.reflek_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>

                    <tr>
                      <td colspan="3">
                        <h4 for="" class="font-bold inline-block w-fit">
                          Examination of The Genitourinay System
                        </h4>
                      </td>
                    </tr>

                    <tr>
                      <td>Discharge</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.psg_pbn_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.psg_pbn_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Sores/Ulcers</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.luka_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.luka_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <!-- NOTE SECTION C...-->
              <h4 class="font-bold mt-4" for="section-b">
                Section C : Laboratory Result and X-Ray Findings
              </h4>
              <p>
                Specimens for laboratory investigation must be collected by the examining doctors
              </p>
              <section class="flex gap-7">
                <table class="w-[50%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th class="ml-3 inline-block">NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">Blood</h4>
                    <tr>
                      <td>HIV Antibody (ELISA)</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.elisa_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.elisa_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HBsAg<span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.hbsag_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.hbsag_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HCT<span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.hct_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.hct_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>VDRL & TPHA<span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.vdrl_tpha_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.vdrl_tpha_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Malaria Parasite</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.pama_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.pama_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">
                          For Malaria, if positive give appropriate treatment and then repeat test 1
                          month after treatment. Date when blood test for malaria parasite
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Filaria Parasite</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.pafil_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.pafil_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Slit Skin Smear (if indicated)</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.ck_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.ck_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="mt-2">Chest X-Ray Report (Valid For 6 month) :</p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.cxray_report
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
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
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.sptm_afb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.sptm_afb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="w-[50%]">
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
                      <td>Colour</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.warna_urin
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.warna_urin">
                            {{ blankoFull.blanko_full.warna_urin }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Specific Gravity</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.gravitasi_spesifik
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.gravitasi_spesifik">
                            {{ blankoFull.blanko_full.gravitasi_spesifik }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Sugar</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.gula_status
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.gula_status !== undefined">
                            {{
                              blankoFull.blanko_full.gula_status === true ? 'POSITIVE' : 'NEGATIVE'
                            }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Albumin</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.albumin_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.albumin_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="mt-2">Miroscopicexamination :</p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colspan="3"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.pm_miros
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.pm_miros">
                            {{ blankoFull.blanko_full.pm_miros }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Opiates / Cannabis / Amphetamine<span class="text-red-500 text-[20px]"
                          >*</span
                        >
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.oga_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.oga_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Pregnancy<span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.kehamilan_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.kehamilan_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">*to be considered Unfit if found Positive</p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">Serum Creatinine</td>
                      <td
                        colspan="2"
                        class="border"
                        :class="[
                          blankoFull.blanko_full.tl_sps
                            ? 'bg-gray-200 border-gray-400'
                            : 'bg-gray-400 border-gray-500 animate-pulse'
                        ]"
                      >
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="blankoFull.blanko_full.serum_krtnn">
                            {{ blankoFull.blanko_full.serum_krtnn }}
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">
                          done in country of origin for worker with history of renal diseases,
                          hipertension, and diabetes mellitus
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Rectal Swab for Salmonella</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.urus_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.urus_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
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
            </div>
          </section>

          <!-- ANCHOR Part 5 -->
          <section style="page-break-after: always" class="mt-2">
            <div class="justify-center justify-items-center text-center">
              <p class="font-poppins font-bold">(Part V : Certification by Attending Doctor)</p>
            </div>
            <div class="mt-2">
              <h4 class="font-bold mt-2" for="section-a">I HAVE EXAMINED THE ABOVE AND FOUND :</h4>

              <section class="flex flex-col gap-7">
                <table class="w-[100%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th>NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">
                      HE/SHE IS FREE FROM THE FOLLOWING DISEASES
                    </h4>
                    <tr>
                      <td>HIV/AIDS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>TUBERCULOSIS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>MALARIA</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>LEPROSY</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>STDS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HEPATITIS B</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HEPATITIS C</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>FILARIASIS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>MAJOR PSYCHIATRIC DISORDERS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">
                          (Schizophrenia, Bipolar Affective Disorder, Major Depression, Delusional
                          Disorder and other Psychosis)
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>OTHER CHRONIC DISEASES</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
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
                    <p class="italic text-[10px]">
                      (If not considered for employment please state the reason)
                    </p>
                    <tr>
                      <td colspan="3" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.rekom_status">
                            {{ blankoFull.blanko_full.rekom_alasan }}
                          </p>
                          <p class="font-bold" v-if="blankoFull.blanko_full.rekom_status"></p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr class="w-full border border-black" />

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
                        {{ blankoFull.blanko_full.dokter }} <br />
                        Qualification of the Doctor
                      </td>
                      <td
                        v-if="blankoFull.blanko_full.masa_berlaku"
                        class="text-center font-bold border border-slate-600"
                      >
                        {{ blankoFull.blanko_full.masa_berlaku.split('T')[0] }}
                      </td>
                      <td
                        v-if="blankoFull.blanko_full.sampai_dengan"
                        class="text-center font-bold border border-slate-600"
                      >
                        {{ blankoFull.blanko_full.sampai_dengan.split('T')[0] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </section>

          <!-- SECTION Medical Report 3 -->
          <section class="mt-10">
            <div>
              <h1 class="mt-5 text-center font-bold text-2xl">MEDICAL REPORT</h1>
              <p class="font-bold text-center text-lg">
                To be retained by The Imigration Departement
              </p>
              <div class="flex justify-end font-bold text-lg">
                <span class="label1 w-full">No. Register</span>
                <span class="w-auto">092834ASd</span>
              </div>
              <section class="flex items-center w-full border-b-4 border-b-black py-2">
                <aside class="self-start mt-4">
                  <div class="w-20 mr-4">
                    <img v-if="blankoFull.image_blob" :src="blankoFull.image_blob" class="w-full" />
                    <div
                      v-else
                      class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"
                    ></div>
                  </div>
                </aside>
                <div class="flex flex-col mt w-full">
                  <div class="mt-2 flex flex-col gap-1">
                    <div class="flex justify-between">
                      <div class="flex flex-col gap-y-1">
                        <p>
                          <span class="label1 inline-block">1. FULL NAME</span>
                          <span v-if="blankoFull.usia">: a</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="label1">2. SEX</span>
                          <span v-if="blankoFull.jenis_kelamin"
                            >: {{ blankoFull.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span
                          >
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="label1">3. AGE</span>
                          <span v-if="blankoFull.usia">: {{ blankoFull.usia }} YEAR</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                      </div>
                      <div class="flex flex-col gap-y-1">
                        <p>
                          <span class="w-[200px] inline-block">FATHER'S NAME</span>
                          <span v-if="blankoFull.usia">:a</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="w-[200px] inline-block">PASSPORT NO</span>
                          <span v-if="blankoFull.no_passpor">: {{ blankoFull.no_passpor }}</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                          <span v-if="blankoFull.pekerjaan_negara_tujuan"
                            >: {{ blankoFull.pekerjaan_negara_tujuan }}</span
                          >
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                      </div>
                    </div>
                    <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                    <div class="flex gap-4 justify-start ml-4">
                      <p>
                        <span class="">Distric</span>
                        <span v-if="blankoFull.daerah">: {{ blankoFull.daerah }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="">Province</span>
                        <span v-if="blankoFull.provinsi">: {{ blankoFull.provinsi }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="">Country</span>
                        <span v-if="blankoFull.negara">: {{ blankoFull.negara }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                    </div>
                    <!-- NOTE untuk nama employee masih belum di tentukan -->

                    <p>
                      <span class="w-[400px] inline-block"
                        >5. NAME OF EMPLOYER/RECRUITING AGENCY</span
                      >
                      <span v-if="blankoFull.usia">: {{ blankoFull.usia }}</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                    <p>
                      <span class="w-[400px] inline-block"
                        >6. ADDRESS OF EMPLOYER/RECRUITING AGENCY
                      </span>
                      <span v-if="blankoFull.usia">: {{ blankoFull.usia }}</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <div class="mt-5">
              <h1 class="font-bold">I HAVE EXAMINED THE ABOVE AND FOUND :</h1>

              <section class="flex flex-col gap-7">
                <table class="w-[100%]">
                  <thead>
                    <tr>
                      <th></th>
                      <th>POSITIVE</th>
                      <th>NEGATIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <h4 for="" class="font-bold inline-block w-fit">
                      HE/SHE IS FREE FROM THE FOLLOWING DISEASES
                    </h4>
                    <tr>
                      <td>HIV/AIDS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hiv_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>TUBERCULOSIS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_tbc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>MALARIA</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_malaria_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>LEPROSY</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_kusta_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>STDS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_pms_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HEPATITIS B</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hpb_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>HEPATITIS C</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_hpc_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>FILARIASIS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_filariasis_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>MAJOR PSYCHIATRIC DISORDERS</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.gpu_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <p class="italic text-[10px]">
                          (Schizophrenia, Bipolar Affective Disorder, Major Depression, Delusional
                          Disorder and other Psychosis)
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>OTHER CHRONIC DISEASES</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blankoFull.blanko_full.stm_pkl_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
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
                    <p class="italic text-[10px]">
                      (If not considered for employment please state the reason)
                    </p>
                    <tr>
                      <td colspan="3" class="bg-gray-200 border border-gray-400">
                        <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                          <p v-if="!blankoFull.blanko_full.rekom_status">
                            {{ blankoFull.blanko_full.rekom_alasan }}
                          </p>
                          <p class="font-bold" v-if="blankoFull.blanko_full.rekom_status"></p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr class="w-full border border-black" />

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
                        {{ blankoFull.blanko_full.dokter }} <br />
                        Qualification of the Doctor
                      </td>
                      <td
                        v-if="blankoFull.blanko_full.masa_berlaku"
                        class="text-center font-bold border border-slate-600"
                      >
                        {{ blankoFull.blanko_full.masa_berlaku.split('T')[0] }}
                      </td>
                      <td
                        v-if="blankoFull.blanko_full.sampai_dengan"
                        class="text-center font-bold border border-slate-600"
                      >
                        {{ blankoFull.blanko_full.sampai_dengan.split('T')[0] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>
          </section>
        </div>
      </main>
      <main
        v-if="type === 'multi'"
        ref="blankoSection"
        id="blanko-full-all"
        class="bg-white w-full"
      >
        <div v-for="(blanko, i) in blankoAllFull">
          <div>
            <h1 class="mt-2 text-center text-xl font-bold py-2">MEDICAL REPORT</h1>
            <div class="flex justify-end font-bold">
              <span class="label1 w-full">No. Register</span>
              <span class="w-auto">092834ASd</span>
            </div>

            <div class="text-center mx-auto">
              <p class="font-bold">Part I. Personal Information</p>
              <p class="font-bold">(To be completed by application)</p>
            </div>
            <section class="flex items-center w-full border-b-4 border-b-black py-2">
              <aside class="shrink self-start mt-4">
                <div class="w-20 mr-4">
                  <img v-if="blanko.image_blob" :src="blanko.image_blob" class="w-full" />
                  <div
                    v-else
                    class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"
                  ></div>
                </div>
              </aside>

              <div class="grow">
                <div class="mt-2 flex flex-col gap-1">
                  <div class="flex justify-between">
                    <div class="flex flex-col gap-y-1">
                      <p>
                        <span class="label1 inline-block">1. FULL NAME</span>
                        <span v-if="blanko.usia">: a</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="label1">2. SEX</span>
                        <span v-if="blanko.jenis_kelamin"
                          >: {{ blanko.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span
                        >
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="label1">3. AGE</span>
                        <span v-if="blanko.usia">: {{ blanko.usia }} YEAR</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                    </div>
                    <div class="flex flex-col gap-y-1">
                      <p>
                        <span class="w-[200px] inline-block">FATHER'S NAME</span>
                        <span v-if="blanko.usia">:a</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="w-[200px] inline-block">PASSPORT NO</span>
                        <span v-if="blanko.no_passpor">: {{ blanko.no_passpor }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                        <span v-if="blanko.pekerjaan_negara_tujuan"
                          >: {{ blanko.pekerjaan_negara_tujuan }}</span
                        >
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                    </div>
                  </div>
                  <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                  <div class="flex gap-4 justify-start ml-4">
                    <p>
                      <span class="">Distric</span>
                      <span v-if="blanko.daerah">: {{ blanko.daerah }}</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                    <p>
                      <span class="">Province</span>
                      <span v-if="blanko.provinsi">: {{ blanko.provinsi }}</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                    <p>
                      <span class="">Country</span>
                      <span v-if="blanko.negara">: {{ blanko.negara }}</span>
                      <span v-else
                        >:
                        <span
                          class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                        ></span
                      ></span>
                    </p>
                  </div>

                  <!-- NOTE untuk nama employee masih belum di tentukan -->
                  <p>
                    <span class="w-[400px] inline-block"
                      >5. NAME OF EMPLOYER/RECRUITING AGENCY</span
                    >
                    <span v-if="blanko.usia">: {{ blanko.usia }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                  <p>
                    <span class="w-[400px] inline-block"
                      >6. ADDRESS OF EMPLOYER/RECRUITING AGENCY
                    </span>
                    <span v-if="blanko.usia">: {{ blanko.usia }}</span>
                    <span v-else
                      >:
                      <span
                        class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                      ></span
                    ></span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div>
            <!-- ANCHOR Part 2 -->
            <section class="mt-2">
              <div class="text-center">
                <p class="font-poppins font-bold">Part II : Medical History</p>
                <p class="font-poppins font-bold">(To be completed by attending physician)</p>
              </div>
              <div class="parent flex gap-2 mt-[20px] justify-between">
                <section class="section1">
                  <div class="grid grid-cols-7 gap-y-2 items-center">
                    <label class="col-start-4 text-center font-semibold">YES</label>
                    <label class="text-center font-semibold">NO</label>
                    <label class="col-span-2 text-center font-semibold">Tanggal</label>

                    <label class="w-fit col-span-3"
                      >HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.hiv_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.hiv_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.hiv_date"
                      type="date"
                      :value="blanko.blanko_full.hiv_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] col-span-2 px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3"
                      >Tuberculosis <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.tbc_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.tbc_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.tbc_date"
                      type="date"
                      :value="blanko.blanko_full.tbc_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3"
                      >Malaria <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.malaria_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.malaria_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.malaria_date"
                      type="date"
                      :value="blanko.blanko_full.malaria_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3"
                      >Leprosy <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.leprosy_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.leprosy_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.leprosy_date"
                      type="date"
                      :value="blanko.blanko_full.leprosy_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3"
                      >STD <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.std_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.std_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.std_date"
                      type="date"
                      :value="blanko.blanko_full.std_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3">Bronchial Asthma </label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.asma_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.asma_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.asma_date"
                      type="date"
                      :value="blanko.blanko_full.asma_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3">Heart Disease </label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.hd_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.hd_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.hd_date"
                      type="date"
                      :value="blanko.blanko_full.hd_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3">Hypertension </label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.hypt_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.hypt_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.hypt_date"
                      type="date"
                      :value="blanko.blanko_full.hypt_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="w-fit col-span-3">Diabetes Mellitus </label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.dbm_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.dbm_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.dbm_date"
                      type="date"
                      :value="blanko.blanko_full.dbm_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>
                  </div>
                </section>
                <section class="section2">
                  <div class="grid grid-cols-7 gap-y-2 items-center">
                    <label class="col-start-4 text-center font-semibold">YES</label>
                    <label class="text-center font-semibold">NO</label>
                    <label class="col-span-2 font-semibold text-center" for="">Tanggal</label>

                    <label class="col-span-3">Peptic Ulcer</label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.ptu_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.ptu_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.ptu_date"
                      type="date"
                      :value="blanko.blanko_full.ptu_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3">Kidney Disease</label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.kidney_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.kidney_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.kidney_date"
                      type="date"
                      :value="blanko.blanko_full.kidney_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3">Cancer</label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.cancer_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.cancer_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.cancer_date"
                      type="date"
                      :value="blanko.blanko_full.cancer_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3"
                      >Epylepsy <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.epylepsy_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.epylepsy_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.epylepsy_date"
                      type="date"
                      :value="blanko.blanko_full.epylepsy_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3"
                      >Psychiatric Illnes <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.psin_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.psin_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.psin_date"
                      type="date"
                      :value="blanko.blanko_full.psin_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3">Hearing Problem</label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.hepo_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.hepo_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.hepo_date"
                      type="date"
                      :value="blanko.blanko_full.hepo_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3"
                      >Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label
                    >
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.hpts_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.hpts_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.hpts_date"
                      type="date"
                      :value="blanko.blanko_full.hpts_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>

                    <label class="col-span-3">Other</label>
                    <input
                      type="checkbox"
                      :checked="blanko.blanko_full.other_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      type="checkbox"
                      :checked="!blanko.blanko_full.other_status"
                      class="h-[20px]"
                      disabled
                    />
                    <input
                      v-if="blanko.blanko_full.other_date"
                      type="date"
                      :value="blanko.blanko_full.other_date.split('T')[0]"
                      placeholder="Pilih Tanggal"
                      class="col-span-2 border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                      disabled
                    />
                    <span
                      v-else
                      class="w-28 col-span-2 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                    ></span>
                  </div>
                </section>
              </div>
              <h1 class="grow w-full flex-1 border-b-4 border-black font-bold">
                * To be considered Unfit if found positive (For other diseases it is up to the
                descreation’s of the examining Doctor)
              </h1>
            </section>

            <!-- ANCHOR Part 3 -->
            <section class="mt-2">
              <div class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">Part III : Present Medical History</p>
                <p class="font-poppins font-bold">(To be completed by attending Doctor)</p>
              </div>
              <div class="flex gap-7 mt-5">
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
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.snf_status"
                          class="h-[20px] items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.snf_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Chest pain during exertion <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.nyd_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.nyd_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Palpitation <span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.dbj_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.dbj_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Swelling of feet</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.pbk_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.pbk_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Giddiness of headache <span class="text-red-500 text-[20px]">*</span></td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.rspks_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.rspks_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Cough for more than 2 weeks or haemoplysis</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.hmp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.hmp_status"
                          class="h-[20px] text-center items-center w-full"
                          disabled
                        />
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
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.ksm_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.ksm_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        excessive thirst and frequent urination
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.rhb_sbk_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.rhb_sbk_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Dysuria, hematuria & other urinary symptoms
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.gskl_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.gskl_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Urethral/Vaginal discharge
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.kcuv_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.kcuv_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Multiple joint pain
                        <span class="text-red-500 text-[20px]">*</span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.nsm_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.nsm_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Visual problem/colour blindness</td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="blanko.blanko_full.mpbw_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          :checked="!blanko.blanko_full.mpbw_status"
                          class="h-[20px] w-full"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h1 class="border-b-4 border-black font-bold mt-3">
                To confirm further during examination and investigation of the applicant
              </h1>
            </section>

            <!-- ANCHOR Part 4 -->
            <section class="mt-2">
              <div class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">
                  Part IV : Physical Examination and Investigation
                </p>
                <p class="font-poppins font-bold">(To be completed by the attending Doctor)</p>
              </div>
              <div class="mt-2">
                <!-- NOTE SECTION A belum mengambil data dari pra -->
                <h4 class="font-bold mt-2" for="section-a">
                  (Section A : General Physical Examination)
                </h4>
                <section class="flex gap-2">
                  <div class="border-2 border-black p-2 rounded-md flex gap-4">
                    <p>Height : 170 Cm</p>
                    <p>Weight : 55 Kg</p>
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
                        <td class="w-full">Chronic Skin Rash</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.rkk_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.rkk_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Anaesthetic Skin Pach, Peripheral Nerve Enlargement or Nodular Lesion
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.pkln_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.pkln_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Deformities of Limbs</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.dfab_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.dfab_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Anemia</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Juandice</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.anemia_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
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
                        <td class="flex flex-col">UNAIDED</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.tb_mt_kiri"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.tb_mt_kanan"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td class="flex flex-col">AIDED</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.db_mt_kiri"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.db_mt_kanan"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Hearing Impairment Present</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.tgp_kiri"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.tgp_kanan"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Colour Blindness</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.kbw_kiri"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.kbw_kanan"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <!-- SECTION Medical Report 2 -->
                <!-- NOTE SECTION B... -->
                <h4 class="font-bold mt-4" for="section-b">Section B : System Examination</h4>
                <section class="flex gap-7">
                  <table class="w-[50%]">
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
                        <td class="w-full">Heart Size</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.ukj_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.ukj_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Heart sounds</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.saj_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.saj_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Other findings</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.tl_sps
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.tl_sps">
                              {{ blanko.blanko_full.tl_sps }}
                            </p>
                          </div>
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <h4 class="font-bold w-full">Respiratory System</h4>
                        </td>
                      </tr>

                      <tr>
                        <td>Breath Sounds</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.sps_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.sps_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Other findings</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.tl_jantung
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.tl_jantung">
                              {{ blanko.blanko_full.tl_jantung }}
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
                        <td class="w-full">General Mental Status</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.smu_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.smu_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">Speech</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.berbicara_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.berbicara_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">Cognitive Function</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.fk_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.fk_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">Size of Peripheral Nerves</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.usp_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.usp_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr class="">
                        <td class="w-full">Motor Power</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.km_status"
                            class="h-[20px] items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.km_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>NORMAL</th>
                        <th class="ml-3 inline-block">ABNORMAL</th>
                      </tr>
                    </thead>
                    <tbody class="overflow-visible">
                      <h4 for="" class="font-bold inline-block w-fit">Gastrointestinal</h4>
                      <tr>
                        <td>Liver</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.hati_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.hati_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Spleen</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.limpa_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.limpa_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Kidney</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.ginjal_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.ginjal_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Is There Abnormal Sweling ? <br />
                          YES / NO Indicate if YES .............
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.pbk_sp_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.pbk_sp_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr class="">
                        <td
                          colspan="3"
                          class="border"
                          :class="[
                            blanko.blanko_full.tl_sps
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] bg-inherit px-2">
                            <p v-if="blanko.blanko_full.tl_sp">
                              {{ blanko.blanko_full.tl_sp }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Rectal Examination (if indicated)</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.pr_sp_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.pr_sp_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Sensory</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.sensorik_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.sensorik_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Reflexes</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.reflek_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.reflek_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>

                      <tr>
                        <td colspan="3">
                          <h4 for="" class="font-bold inline-block w-fit">
                            Examination of The Genitourinay System
                          </h4>
                        </td>
                      </tr>

                      <tr>
                        <td>Discharge</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.psg_pbn_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.psg_pbn_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Sores/Ulcers</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.luka_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.luka_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>

                <!-- NOTE SECTION C...-->
                <h4 class="font-bold mt-4" for="section-b">
                  Section C : Laboratory Result and X-Ray Findings
                </h4>
                <p>
                  Specimens for laboratory investigation must be collected by the examining doctors
                </p>
                <section class="flex gap-7">
                  <table class="w-[50%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th class="ml-3 inline-block">NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">Blood</h4>
                      <tr>
                        <td>HIV Antibody (ELISA)</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.elisa_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.elisa_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HBsAg<span class="text-red-500 text-[20px]">*</span></td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.hbsag_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.hbsag_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HCT<span class="text-red-500 text-[20px]">*</span></td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.hct_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.hct_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>VDRL & TPHA<span class="text-red-500 text-[20px]">*</span></td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.vdrl_tpha_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.vdrl_tpha_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Malaria Parasite</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.pama_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.pama_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">
                            For Malaria, if positive give appropriate treatment and then repeat test
                            1 month after treatment. Date when blood test for malaria parasite
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Filaria Parasite</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.pafil_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.pafil_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Slit Skin Smear (if indicated)</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.ck_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.ck_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="mt-2">Chest X-Ray Report (Valid For 6 month) :</p>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.cxray_report
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.cxray_report">
                              {{ blanko.blanko_full.cxray_report }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p class="mt-2">Sputum AFB (if indicated)</p>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.sptm_afb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.sptm_afb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="w-[50%]">
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
                        <td>Colour</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.warna_urin
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.warna_urin">
                              {{ blanko.blanko_full.warna_urin }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Specific Gravity</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.gravitasi_spesifik
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.gravitasi_spesifik">
                              {{ blanko.blanko_full.gravitasi_spesifik }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Sugar</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.gula_status
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="!blanko.blanko_full.gula_status !== undefined">
                              {{
                                blanko.blanko_full.gula_status === true ? 'POSITIVE' : 'NEGATIVE'
                              }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Albumin</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.albumin_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.albumin_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="mt-2">Miroscopicexamination :</p>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colspan="3"
                          class="border"
                          :class="[
                            blanko.blanko_full.pm_miros
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.pm_miros">
                              {{ blanko.blanko_full.pm_miros }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Opiates / Cannabis / Amphetamine<span class="text-red-500 text-[20px]"
                            >*</span
                          >
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.oga_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.oga_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Pregnancy<span class="text-red-500 text-[20px]">*</span></td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.kehamilan_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.kehamilan_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">
                            *to be considered Unfit if found Positive
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="1">Serum Creatinine</td>
                        <td
                          colspan="2"
                          class="border"
                          :class="[
                            blanko.blanko_full.tl_sps
                              ? 'bg-gray-200 border-gray-400'
                              : 'bg-gray-400 border-gray-500 animate-pulse'
                          ]"
                        >
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="blanko.blanko_full.serum_krtnn">
                              {{ blanko.blanko_full.serum_krtnn }}
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">
                            done in country of origin for worker with history of renal diseases,
                            hipertension, and diabetes mellitus
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Rectal Swab for Salmonella</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.urus_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.urus_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
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
              </div>
            </section>

            <!-- ANCHOR Part 5 -->
            <section style="page-break-after: always" class="mt-2">
              <div class="justify-center justify-items-center text-center">
                <p class="font-poppins font-bold">(Part V : Certification by Attending Doctor)</p>
              </div>
              <div class="mt-2">
                <h4 class="font-bold mt-2" for="section-a">
                  I HAVE EXAMINED THE ABOVE AND FOUND :
                </h4>

                <section class="flex flex-col gap-7">
                  <table class="w-[100%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th>NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">
                        HE/SHE IS FREE FROM THE FOLLOWING DISEASES
                      </h4>
                      <tr>
                        <td>HIV/AIDS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>TUBERCULOSIS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>MALARIA</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>LEPROSY</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>STDS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HEPATITIS B</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HEPATITIS C</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>FILARIASIS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>MAJOR PSYCHIATRIC DISORDERS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">
                            (Schizophrenia, Bipolar Affective Disorder, Major Depression, Delusional
                            Disorder and other Psychosis)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>OTHER CHRONIC DISEASES</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
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
                      <p class="italic text-[10px]">
                        (If not considered for employment please state the reason)
                      </p>
                      <tr>
                        <td colspan="3" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="!blanko.blanko_full.rekom_status">
                              {{ blanko.blanko_full.rekom_alasan }}
                            </p>
                            <p class="font-bold" v-if="blanko.blanko_full.rekom_status"></p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <hr class="w-full border border-black" />

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
                          {{ blanko.blanko_full.dokter }} <br />
                          Qualification of the Doctor
                        </td>
                        <td
                          v-if="blanko.blanko_full.masa_berlaku"
                          class="text-center font-bold border border-slate-600"
                        >
                          {{ blanko.blanko_full.masa_berlaku.split('T')[0] }}
                        </td>
                        <td
                          v-if="blanko.blanko_full.sampai_dengan"
                          class="text-center font-bold border border-slate-600"
                        >
                          {{ blanko.blanko_full.sampai_dengan.split('T')[0] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </section>

            <!-- SECTION Medical Report 3 -->
            <section style="page-break-after: always" class="mt-10">
              <div>
                <h1 class="mt-5 text-center font-bold text-2xl">MEDICAL REPORT</h1>
                <p class="font-bold text-center text-lg">
                  To be retained by The Imigration Departement
                </p>
                <div class="flex justify-end font-bold text-lg">
                  <span class="label1 w-full">No. Register</span>
                  <span class="w-auto">092834ASd</span>
                </div>
                <section class="flex items-center w-full border-b-4 border-b-black py-2">
                  <aside class="self-start mt-4">
                    <div class="w-20 mr-4">
                      <img v-if="blanko.image_blob" :src="blanko.image_blob" class="w-full" />
                      <div
                        v-else
                        class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"
                      ></div>
                    </div>
                  </aside>
                  <div class="flex flex-col mt w-full">
                    <div class="mt-2 flex flex-col gap-1">
                      <div class="flex justify-between">
                        <div class="flex flex-col gap-y-1">
                          <p>
                            <span class="label1 inline-block">1. FULL NAME</span>
                            <span v-if="blanko.usia">: a</span>
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                          <p>
                            <span class="label1">2. SEX</span>
                            <span v-if="blanko.jenis_kelamin"
                              >: {{ blanko.jenis_kelamin === 'L' ? 'MALE' : 'FEMALE' }}</span
                            >
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                          <p>
                            <span class="label1">3. AGE</span>
                            <span v-if="blanko.usia">: {{ blanko.usia }} YEAR</span>
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                        </div>
                        <div class="flex flex-col gap-y-1">
                          <p>
                            <span class="w-[200px] inline-block">FATHER'S NAME</span>
                            <span v-if="blanko.usia">:a</span>
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                          <p>
                            <span class="w-[200px] inline-block">PASSPORT NO</span>
                            <span v-if="blanko.no_passpor">: {{ blanko.no_passpor }}</span>
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                          <p>
                            <span class="w-[200px] inline-block">TYPE OF JOB APPLIED</span>
                            <span v-if="blanko.pekerjaan_negara_tujuan"
                              >: {{ blanko.pekerjaan_negara_tujuan }}</span
                            >
                            <span v-else
                              >:
                              <span
                                class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                              ></span
                            ></span>
                          </p>
                        </div>
                      </div>
                      <span>4. RESIDENCE IN COUNTRY OF ORIGIN</span>
                      <div class="flex gap-4 justify-start ml-4">
                        <p>
                          <span class="">Distric</span>
                          <span v-if="blanko.daerah">: {{ blanko.daerah }}</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="">Province</span>
                          <span v-if="blanko.provinsi">: {{ blanko.provinsi }}</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                        <p>
                          <span class="">Country</span>
                          <span v-if="blanko.negara">: {{ blanko.negara }}</span>
                          <span v-else
                            >:
                            <span
                              class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                            ></span
                          ></span>
                        </p>
                      </div>
                      <!-- NOTE untuk nama employee masih belum di tentukan -->

                      <p>
                        <span class="w-[400px] inline-block"
                          >5. NAME OF EMPLOYER/RECRUITING AGENCY</span
                        >
                        <span v-if="blanko.usia">: {{ blanko.usia }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                      <p>
                        <span class="w-[400px] inline-block"
                          >6. ADDRESS OF EMPLOYER/RECRUITING AGENCY
                        </span>
                        <span v-if="blanko.usia">: {{ blanko.usia }}</span>
                        <span v-else
                          >:
                          <span
                            class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                          ></span
                        ></span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
              <div class="mt-5">
                <h1 class="font-bold">I HAVE EXAMINED THE ABOVE AND FOUND :</h1>

                <section class="flex flex-col gap-7">
                  <table class="w-[100%]">
                    <thead>
                      <tr>
                        <th></th>
                        <th>POSITIVE</th>
                        <th>NEGATIVE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <h4 for="" class="font-bold inline-block w-fit">
                        HE/SHE IS FREE FROM THE FOLLOWING DISEASES
                      </h4>
                      <tr>
                        <td>HIV/AIDS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hiv_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>TUBERCULOSIS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_tbc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>MALARIA</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_malaria_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>LEPROSY</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_kusta_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>STDS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_pms_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HEPATITIS B</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hpb_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>HEPATITIS C</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_hpc_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>FILARIASIS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_filariasis_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>MAJOR PSYCHIATRIC DISORDERS</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.gpu_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colspan="3">
                          <p class="italic text-[10px]">
                            (Schizophrenia, Bipolar Affective Disorder, Major Depression, Delusional
                            Disorder and other Psychosis)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>OTHER CHRONIC DISEASES</td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="blanko.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            :checked="!blanko.blanko_full.stm_pkl_status"
                            class="h-[20px] text-center items-center w-full"
                            disabled
                          />
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
                      <p class="italic text-[10px]">
                        (If not considered for employment please state the reason)
                      </p>
                      <tr>
                        <td colspan="3" class="bg-gray-200 border border-gray-400">
                          <div class="flex items-center h-[30px] w-full bg-inherit px-2">
                            <p v-if="!blanko.blanko_full.rekom_status">
                              {{ blanko.blanko_full.rekom_alasan }}
                            </p>
                            <p class="font-bold" v-if="blanko.blanko_full.rekom_status"></p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <hr class="w-full border border-black" />

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
                          {{ blanko.blanko_full.dokter }} <br />
                          Qualification of the Doctor
                        </td>
                        <td
                          v-if="blanko.blanko_full.masa_berlaku"
                          class="text-center font-bold border border-slate-600"
                        >
                          {{ blanko.blanko_full.masa_berlaku.split('T')[0] }}
                        </td>
                        <td
                          v-if="blanko.blanko_full.sampai_dengan"
                          class="text-center font-bold border border-slate-600"
                        >
                          {{ blanko.blanko_full.sampai_dengan.split('T')[0] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
