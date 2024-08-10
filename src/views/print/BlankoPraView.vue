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
    const blankoPra = computed(() => store.getters['getBlankoPra'])
    const blankoAllPra = computed(() => store.getters['getBlankoAllPra'])
    const blankoSection = ref(null)
    const blankoAllSection = ref(null)
    const type = router.currentRoute.value.query.type

    onBeforeMount(async () => {
      console.log('query', router.currentRoute.value)
      if (router.currentRoute.value.query.type === 'single') {
        const uuid = router.currentRoute.value.query.id
        await store
          .dispatch('fetchBlankoPra', uuid)
          .then((res) => {
            if (res.data === undefined) router.replace('/rekap-kwitansi')
          })
          .finally(() => (isLoading.value = false))
      } else {
        // multi
        const uuids = router.currentRoute.value.query.id.split(',')
        await store
          .dispatch('fetchAllBlankoPras', uuids)
          .then((isSuccess) => {
            if (!isSuccess) router.replace('/rekap-kwitansi')
          })
          .finally(() => (isLoading.value = false))
      }
    })

    const printModal = () => {
      if (type === 'single') {
        blankoSection.value.classList.add('enable-print-view-pra')
      } else {
        blankoAllSection.value.classList.add('enable-print-view-pra-all')
      }
      window.print()
    }
    return { printModal, isLoading, blankoSection, blankoAllSection, blankoPra, blankoAllPra, type }
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
          <h4 class="font-bold text-lg">Blanko Pra</h4>
          <p>Cetak data untuk Blanko Pra</p>
        </div>
        <button
          @click="printModal"
          :disabled="isLoading"
          class="p-[13px] transition-all rounded-lg flex items-center justify-center gap-3 text-white"
          :class="[isLoading ? 'bg-[#91accc]' : 'bg-[#0075FF] hover:bg-[#2260a8]']"
        >
          <p>Cetak Blanko Pra</p>
          <CetakKuitansi></CetakKuitansi>
        </button>
      </header>
      <main v-if="type === 'single'" ref="blankoSection" class="bg-white w-full">
        <div class="flex justify-around items-center">
          <img
            class="w-[80px] h-[80px] object-contain"
            src="../../components/icons/klinikGoraLogo.png"
            alt=""
          />
          <div class="text-center">
            <h1 class="text-xl text-green-500 font-semibold">
              Klinik <span class="text-yellow-500">GORA</span> Mataram
            </h1>
            <p class="text-yellow-500 font-semibold">
              Jl. RA. Kartini No. 77 Mojok Telp.(0370) 635661
            </p>
            <p class="italic text-green-700 font-semibold">Email : goraklinik@gmail.com</p>
          </div>
        </div>
        <div>
          <!-- SECTION Keterangan Sehat -->
          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
            KETERANGAN SEHAT
          </h1>
          <p class="font-poppins text-center">Informasi Hasil Pemeriksaan</p>

          <div class="flex justify-end mt-3">
            <span class="label1 w-full">No. Register</span>
            <span class="w-auto">092834ASd</span>
          </div>

          <section class="flex items-start mt-5">
            <div class="w-20 mr-4">
              <img v-if="blankoPra.image_blob" :src="blankoPra.image_blob" class="w-full" />
              <div v-else class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"></div>
            </div>
            <div>
              <div class="flex gap-3 items-center">
                <span class="label1">Jenis Kelamin: </span>
                <span v-if="blankoPra.jenis_kelamin">{{
                  blankoPra.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'
                }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label1">Usia</span>
                <span v-if="blankoPra.usia">: {{ blankoPra.usia }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>

              <div class="flex gap-3 items-center">
                <span class="label1">Daerah</span>
                <span v-if="blankoPra.daerah">: {{ blankoPra.daerah }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label1">Provinsi</span>
                <span v-if="blankoPra.provinsi">: {{ blankoPra.provinsi }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label1">Negara</span>
                <span v-if="blankoPra.negara">: {{ blankoPra.negara }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>
          </section>

          <!-- SECTION Pemeriksaan Fisik -->

          <h1 class="mt-5 text-center font-semibold border-2 border-t-black border-b-black">
            KETERANGAN SEHAT
          </h1>
          <div class="flex flex-col">
            <p class="flex gap-3 justify-end font-poppins">
              Beri tanda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Jika Normal
            </p>
            <p class="flex gap-3 font-poppins justify-end">
              Beri tanda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Jika Abnormal
            </p>
          </div>

          <section class="flex flex-wrap gap-x-14 gap-y-3 justify-center mt-5">
            <div>
              <h1 class="font-bold">Fisik</h1>
              <div class="flex gap-3 items-center">
                <span class="label2">Tinggi</span>
                <span v-if="blankoPra.blanko_pra.tinggi">: {{ blankoPra.blanko_pra.tinggi }}</span>
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Berat</span>
                <span v-if="blankoPra.blanko_pra.berat">: {{ blankoPra.blanko_pra.berat }}</span>
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>
            <div>
              <h1 class="font-bold">Penglihatan</h1>
              <div class="flex gap-3 items-center">
                <span class="label2">Mata kanan</span>
                <span v-if="blankoPra.blanko_pra.mata_kanan"
                  >: {{ blankoPra.blanko_pra.mata_kanan }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Mata kiri</span>
                <span v-if="blankoPra.blanko_pra.mata_kiri"
                  >: {{ blankoPra.blanko_pra.mata_kiri }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
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

            <div>
              <h1 class="font-bold">Tekanan Darah</h1>
              <div class="flex gap-3 items-center">
                <span class="label2">Atas</span>
                <span v-if="blankoPra.blanko_pra.tekanan_darah_atas"
                  >: {{ blankoPra.blanko_pra.tekanan_darah_atas }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Bawah</span>
                <span v-if="blankoPra.blanko_pra.tekanan_darah_bawah"
                  >: {{ blankoPra.blanko_pra.tekanan_darah_bawah }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Nadi</span>
                <span v-if="blankoPra.blanko_pra.tekanan_darah_nadi"
                  >: {{ blankoPra.blanko_pra.tekanan_darah_nadi }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Gol</span>
                <span v-if="blankoPra.blanko_pra.golongan_darah"
                  >: {{ blankoPra.blanko_pra.golongan_darah }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
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

            <div class="w-full px-4">
              <h1 class="font-bold">Lain-lain</h1>
              <div class="flex gap-3 items-center">
                <span class="label2">Suhu Tubuh</span>
                <span v-if="blankoPra.blanko_pra.suhu_tubuh"
                  >: {{ blankoPra.blanko_pra.suhu_tubuh }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Rontgen</span>
                <span v-if="blankoPra.blanko_pra.rontgen"
                  >: {{ blankoPra.blanko_pra.rontgen }}</span
                >
                <span
                  v-else
                  class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>
          </section>

          <!-- SECTION Pemeriksaan Laboratorium -->
          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
            PEMERIKSAAN LABORATORIUM
          </h1>
          <section class="flex gap-10 justify-around mt-5">
            <div>
              <div class="flex gap-3 items-center">
                <span class="label2">Gula</span>
                <span v-if="blankoPra.blanko_pra.gula"
                  >: {{ blankoPra.blanko_pra.gula === true ? 'Normal' : 'Abnormal' }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">Protein</span>
                <span v-if="blankoPra.blanko_pra.protein"
                  >: {{ blankoPra.blanko_pra.protein === true ? 'Normal' : 'Abnormal' }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>

            <div>
              <div class="flex gap-3 items-center">
                <span class="label2">PH</span>
                <span v-if="blankoPra.blanko_pra.ph">: {{ blankoPra.blanko_pra.ph }}</span>
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">HBs-AG</span>
                <span v-if="blankoPra.blanko_pra.hbs_ag"
                  >: {{ blankoPra.blanko_pra.hbs_ag === true ? 'Normal' : 'Abnormal' }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>

            <div>
              <div class="flex gap-3 items-center">
                <span class="label2">VDRL</span>
                <span v-if="blankoPra.blanko_pra.vdrl"
                  >: {{ blankoPra.blanko_pra.vdrl === true ? 'Normal' : 'Abnormal' }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
              <div class="flex gap-3 items-center">
                <span class="label2">TPHA</span>
                <span v-if="blankoPra.blanko_pra.tpha"
                  >: {{ blankoPra.blanko_pra.tpha === true ? 'Normal' : 'Abnormal' }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>
          </section>

          <!-- SECTION - RADIOLOGI -->

          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
            PEMERIKSAAN RADIOLOGI
          </h1>

          <section class="flex gap-10 justify-around mt-5">
            <div>
              <div class="flex gap-3 items-center">
                <span class="label2">Thorax PA</span>
                <span v-if="blankoPra.blanko_pra.thorax_pa"
                  >: {{ blankoPra.blanko_pra.thorax_pa }}</span
                >
                <span
                  v-else
                  class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                ></span>
              </div>
            </div>
          </section>

          <!-- SECTION - HASIL -->

          <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
            HASIL
          </h1>
          <section class="flex mt-5">
            <div class="w-full">
              <p class="">
                <span class="w-[230px] inline-block">Dinyatakan</span>
                <span v-if="blankoPra.blanko_pra.hasil" class="font-bold"
                  >: {{ blankoPra.blanko_pra.hasil === true ? 'SEHAT' : 'TIDAK SEHAT' }}</span
                >
                <span v-else class="font-bold"
                  >:
                  <span
                    class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span
                ></span>
              </p>
              <p class="">
                <span class="w-[230px] inline-block">Tanggal Pemeriksaan</span>
                <span v-if="blankoPra.tanggal_cetak" class="font-bold"
                  >: {{ blankoPra.tanggal_cetak }}</span
                >
                <span v-else class="font-bold"
                  >:
                  <span
                    class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span
                ></span>
              </p>
              <p class="">
                <span class="w-[230px] inline-block">Masa Berlaku</span>
                <span v-if="blankoPra.masa_berlaku" class="font-bold"
                  >: {{ blankoPra.masa_berlaku }}</span
                >
                <span v-else class="font-bold"
                  >:
                  <span
                    class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                  ></span
                ></span>
              </p>
            </div>
          </section>

          <section class="flex justify-end mt-3">
            <div class="text-center">
              <p class="mb-24">Dokter Pemeriksa,</p>
              <p v-if="blankoPra.blanko_pra.pic">{{ blankoPra.blanko_pra.pic }}</p>
              <p v-else class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></p>
            </div>
          </section>
        </div>
      </main>
      <main v-if="type === 'multi'" ref="blankoAllSection" class="bg-white w-full">
        <div v-if="isLoading">
          <div class="flex justify-around items-center">
            <img
              class="w-[80px] h-[80px] object-contain"
              src="../../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-center">
              <h1 class="text-xl text-green-500 font-semibold">
                Klinik <span class="text-yellow-500">GORA</span> Mataram
              </h1>
              <p class="text-yellow-500 font-semibold">
                Jl. RA. Kartini No. 77 Mojok Telp.(0370) 635661
              </p>
              <p class="italic text-green-700 font-semibold">Email : goraklinik@gmail.com</p>
            </div>
          </div>
          <div>
            <!-- SECTION Keterangan Sehat -->
            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              KETERANGAN SEHAT
            </h1>
            <p class="font-poppins text-center">Informasi Hasil Pemeriksaan</p>

            <div class="flex justify-end mt-3">
              <span class="label1 w-full">No. Register</span>
              <span class="w-auto">092834ASd</span>
            </div>

            <section class="flex items-start mt-5">
              <div class="w-20 mr-4">
                <div class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"></div>
              </div>
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Jenis Kelamin: </span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Usia</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>

                <div class="flex gap-3 items-center">
                  <span class="label1">Daerah</span>
                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Provinsi</span>
                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Negara</span>
                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Fisik -->

            <h1 class="mt-5 text-center font-semibold border-2 border-t-black border-b-black">
              KETERANGAN SEHAT
            </h1>
            <div class="flex flex-col">
              <p class="flex gap-3 justify-end font-poppins">
                Beri tanda
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Jika Normal
              </p>
              <p class="flex gap-3 font-poppins justify-end">
                Beri tanda
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Jika Abnormal
              </p>
            </div>

            <section class="flex flex-wrap gap-x-14 gap-y-3 justify-center mt-5">
              <div>
                <h1 class="font-bold">Fisik</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Tinggi</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Berat</span>
                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>
              <div>
                <h1 class="font-bold">Penglihatan</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Mata kanan</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Mata kiri</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
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

              <div>
                <h1 class="font-bold">Tekanan Darah</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Atas</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Bawah</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Nadi</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Gol</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
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

              <div class="w-full px-4">
                <h1 class="font-bold">Lain-lain</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Suhu Tubuh</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Rontgen</span>

                  <span class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Laboratorium -->
            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              PEMERIKSAAN LABORATORIUM
            </h1>
            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Gula</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Protein</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>

              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">PH</span>
                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">HBs-AG</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>

              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">VDRL</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">TPHA</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>
            </section>

            <!-- SECTION - RADIOLOGI -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              PEMERIKSAAN RADIOLOGI
            </h1>

            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Thorax PA</span>

                  <span class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></span>
                </div>
              </div>
            </section>

            <!-- SECTION - HASIL -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              HASIL
            </h1>
            <section class="flex mt-5">
              <div class="w-full">
                <p class="">
                  <span class="w-[230px] inline-block">Dinyatakan</span>

                  <span class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
                <p class="">
                  <span class="w-[230px] inline-block">Tanggal Pemeriksaan</span>

                  <span class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
                <p class="">
                  <span class="w-[230px] inline-block">Masa Berlaku</span>

                  <span class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
              </div>
            </section>

            <section class="flex justify-end mt-3">
              <div class="text-center">
                <p class="mb-24">Dokter Pemeriksa,</p>
                <p class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></p>
              </div>
            </section>
          </div>
        </div>
        <div v-for="(blanko, i) in blankoAllPra" :key="i">
          <div class="flex justify-around items-center">
            <img
              class="w-[80px] h-[80px] object-contain"
              src="../../components/icons/klinikGoraLogo.png"
              alt=""
            />
            <div class="text-center">
              <h1 class="text-xl text-green-500 font-semibold">
                Klinik <span class="text-yellow-500">GORA</span> Mataram
              </h1>
              <p class="text-yellow-500 font-semibold">
                Jl. RA. Kartini No. 77 Mojok Telp.(0370) 635661
              </p>
              <p class="italic text-green-700 font-semibold">Email : goraklinik@gmail.com</p>
            </div>
          </div>
          <div>
            <!-- SECTION Keterangan Sehat -->
            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              KETERANGAN SEHAT
            </h1>
            <p class="font-poppins text-center">Informasi Hasil Pemeriksaan</p>

            <div class="flex justify-end mt-3">
              <span class="label1 w-full">No. Register</span>
              <span class="w-auto">092834ASd</span>
            </div>

            <section class="flex items-start mt-5">
              <div class="w-20 mr-4">
                <img v-if="blanko.image_blob" :src="blanko.image_blob" class="w-full" />
                <div v-else class="w-full animate-pulse aspect-square bg-gray-400 rounded-lg"></div>
              </div>
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Jenis Kelamin: </span>
                  <span v-if="blanko.jenis_kelamin">{{
                    blanko.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'
                  }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Usia</span>
                  <span v-if="blanko.usia">: {{ blanko.usia }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>

                <div class="flex gap-3 items-center">
                  <span class="label1">Daerah</span>
                  <span v-if="blanko.daerah">: {{ blanko.daerah }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Provinsi</span>
                  <span v-if="blanko.provinsi">: {{ blanko.provinsi }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label1">Negara</span>
                  <span v-if="blanko.negara">: {{ blanko.negara }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Fisik -->

            <h1 class="mt-5 text-center font-semibold border-2 border-t-black border-b-black">
              KETERANGAN SEHAT
            </h1>
            <div class="flex flex-col">
              <p class="flex gap-3 justify-end font-poppins">
                Beri tanda
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Jika Normal
              </p>
              <p class="flex gap-3 font-poppins justify-end">
                Beri tanda
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Jika Abnormal
              </p>
            </div>

            <section class="flex flex-wrap gap-x-14 gap-y-3 justify-center mt-5">
              <div>
                <h1 class="font-bold">Fisik</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Tinggi</span>
                  <span v-if="blanko.blanko_pra.tinggi">: {{ blanko.blanko_pra.tinggi }}</span>
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Berat</span>
                  <span v-if="blanko.blanko_pra.berat">: {{ blanko.blanko_pra.berat }}</span>
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>
              <div>
                <h1 class="font-bold">Penglihatan</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Mata kanan</span>
                  <span v-if="blanko.blanko_pra.mata_kanan"
                    >: {{ blanko.blanko_pra.mata_kanan }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Mata kiri</span>
                  <span v-if="blanko.blanko_pra.mata_kiri"
                    >: {{ blanko.blanko_pra.mata_kiri }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
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

              <div>
                <h1 class="font-bold">Tekanan Darah</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Atas</span>
                  <span v-if="blanko.blanko_pra.tekanan_darah_atas"
                    >: {{ blanko.blanko_pra.tekanan_darah_atas }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Bawah</span>
                  <span v-if="blanko.blanko_pra.tekanan_darah_bawah"
                    >: {{ blanko.blanko_pra.tekanan_darah_bawah }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Nadi</span>
                  <span v-if="blanko.blanko_pra.tekanan_darah_nadi"
                    >: {{ blanko.blanko_pra.tekanan_darah_nadi }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Gol</span>
                  <span v-if="blanko.blanko_pra.golongan_darah"
                    >: {{ blanko.blanko_pra.golongan_darah }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
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

              <div class="w-full px-4">
                <h1 class="font-bold">Lain-lain</h1>
                <div class="flex gap-3 items-center">
                  <span class="label2">Suhu Tubuh</span>
                  <span v-if="blanko.blanko_pra.suhu_tubuh"
                    >: {{ blanko.blanko_pra.suhu_tubuh }}</span
                  >
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Rontgen</span>
                  <span v-if="blanko.blanko_pra.rontgen">: {{ blanko.blanko_pra.rontgen }}</span>
                  <span
                    v-else
                    class="w-10 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>
            </section>

            <!-- SECTION Pemeriksaan Laboratorium -->
            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              PEMERIKSAAN LABORATORIUM
            </h1>
            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Gula</span>
                  <span v-if="blanko.blanko_pra.gula"
                    >: {{ blanko.blanko_pra.gula === true ? 'Normal' : 'Abnormal' }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Protein</span>
                  <span v-if="blanko.blanko_pra.protein"
                    >: {{ blanko.blanko_pra.protein === true ? 'Normal' : 'Abnormal' }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>

              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">PH</span>
                  <span v-if="blanko.blanko_pra.ph">: {{ blanko.blanko_pra.ph }}</span>
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">HBs-AG</span>
                  <span v-if="blanko.blanko_pra.hbs_ag"
                    >: {{ blanko.blanko_pra.hbs_ag === true ? 'Normal' : 'Abnormal' }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>

              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">VDRL</span>
                  <span v-if="blanko.blanko_pra.vdrl"
                    >: {{ blanko.blanko_pra.vdrl === true ? 'Normal' : 'Abnormal' }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
                <div class="flex gap-3 items-center">
                  <span class="label2">TPHA</span>
                  <span v-if="blanko.blanko_pra.tpha"
                    >: {{ blanko.blanko_pra.tpha === true ? 'Normal' : 'Abnormal' }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>
            </section>

            <!-- SECTION - RADIOLOGI -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              PEMERIKSAAN RADIOLOGI
            </h1>

            <section class="flex gap-10 justify-around mt-5">
              <div>
                <div class="flex gap-3 items-center">
                  <span class="label2">Thorax PA</span>
                  <span v-if="blanko.blanko_pra.thorax_pa"
                    >: {{ blanko.blanko_pra.thorax_pa }}</span
                  >
                  <span
                    v-else
                    class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"
                  ></span>
                </div>
              </div>
            </section>

            <!-- SECTION - HASIL -->

            <h1 class="mt-5 text-center font-semibold py-2 border-2 border-t-black border-b-black">
              HASIL
            </h1>
            <section class="flex mt-5">
              <div class="w-full">
                <p class="">
                  <span class="w-[230px] inline-block">Dinyatakan</span>
                  <span v-if="blanko.blanko_pra.hasil" class="font-bold"
                    >: {{ blanko.blanko_pra.hasil === true ? 'SEHAT' : 'TIDAK SEHAT' }}</span
                  >
                  <span v-else class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
                <p class="">
                  <span class="w-[230px] inline-block">Tanggal Pemeriksaan</span>
                  <span v-if="blanko.tanggal_cetak" class="font-bold"
                    >: {{ blanko.tanggal_cetak }}</span
                  >
                  <span v-else class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
                <p class="">
                  <span class="w-[230px] inline-block">Masa Berlaku</span>
                  <span v-if="blanko.masa_berlaku" class="font-bold"
                    >: {{ blanko.masa_berlaku }}</span
                  >
                  <span v-else class="font-bold"
                    >:
                    <span
                      class="w-28 font-bold inline-block h-5 translate-y-1 animate-pulse bg-gray-400 rounded-md"
                    ></span
                  ></span>
                </p>
              </div>
            </section>

            <section class="flex justify-end mt-3">
              <div class="text-center">
                <p class="mb-24">Dokter Pemeriksa,</p>
                <p v-if="blanko.blanko_pra.pic">{{ blanko.blanko_pra.pic }}</p>
                <p v-else class="w-28 inline-block h-5 animate-pulse bg-gray-400 rounded-md"></p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<style scoped>
@media print {
  html,
  body,
  header {
    visibility: hidden;
    font-size: 12px;
  }

  header {
    height: 0;
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

  @page pra {
    size: A4 portrait !important;
    margin: 0 0 !important;
  }

  .enable-print-view-pra {
    page: pra;
    visibility: visible !important;
  }

  .enable-print-view-pra-all {
    page: pra;
    visibility: visible !important;
  }
}
</style>
