<script>
import ProfileInfo from '@/components/ProfileInfo.vue'
import IconFoto from '@/components/icons/IconFoto.vue'
import router from '@/router'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useStore } from 'vuex'

export default {
  components: { ProfileInfo, IconFoto },

  setup() {
    const store = useStore()

    // SECTION - Getters
    const receipt = computed(() => store.getters['getReceipt'])
    const praData = computed(() => store.getters['getPraData'])
    const fullData = computed(() => store.getters['getFullData'])
    const listPasienFull = computed(() => store.getters['getListPasienFull'])
    const listPasien = computed(() => store.getters['getListPasien'])

    // SECTION - Handle form medical type
    const jenis_medikal = ref('pra')

    const handleChange = (event) => {
      if (event) {
        jenis_medikal.value = event.target.value
        store.commit('setStatusMedical', event.target.value)

        if (event.target.value === 'full') {
          store.dispatch('checkCreatedBlankoPra')
          if (
            listPasienFull.value.length !== 0 &&
            !listPasienFull.value.includes(pra_medical.data_diri.id_pasien)
          ) {
            const selectedPasien = listPasien.value.find(
              (pasien) => pasien.uuid === listPasienFull.value[0]
            )
            selectPasien(selectedPasien.uuid, selectedPasien.nama_lengkap)
          }
        }
      }
    }

    onMounted(() => {
      handleChange()
      store.dispatch('checkCreatedBlankoPra')
      if (receipt.value.pasien_tkis.length === 0) {
        // redirect to rekap kwitansi
        router.replace('/rekap-kwitansi')
      }
    })

    // SECTION - Pra medical

    //ANCHOR State pra medical
    const pra_medical_init = {
      data_diri: {
        id_pasien: '',
        foto: '',
        bn_bt: '',
        tgl_cetak: '',
        tgl_lahir: '',
        usia: '',
        kelamin: '',
        status: null,
        negara_tujuan: ''
      },
      alamat: {
        negara: '',
        provinsi: '',
        daerah: '',
        pekerjaan_di_negara_tujuan: '',
        no_visa: '',
        no_passport: '',
        masa_berlaku: '',
        sampai_dengan: ''
      },
      fisik: {
        tinggi: '',
        berat: '',
        mata_kanan: '',
        mata_kiri: '',
        tekanan_darah_atas: '',
        tekanan_darah_bawah: '',
        tekanan_darah_nadi: '',
        golongan_darah: '',
        suhu_tubuh: '',
        rontgen: ''
      },
      laboratorium: {
        gula: '',
        ph: '',
        vdrl: '',
        protein: '',
        hbs_ag: '',
        tpha: ''
      },
      radiologi: {
        thorax_pa: ''
      },
      hasil_pemeriksaan: {
        hasil: '',
        keterangan: '',
        status_pemeriksaan: '',
        penanggung_jawab: ''
      }
    }
    const pra_medical = reactive({ ...pra_medical_init })

    //SECTION Select the patient of blanko
    const selectedPasien = computed(() => {
      return (
        receipt.value.pasien_tkis.find(
          (pasien) => pasien.uuid === pra_medical.data_diri.id_pasien
        ) || {}
      )
    })

    const valueJk = ref('')
    watch(
      () => pra_medical.data_diri.kelamin,
      (newVal) => {
        if (newVal) {
          valueJk.value = newVal === 'L' ? 'Laki-laki' : 'Perempuan'
        } else {
          valueJk.value = ''
        }
      }
    )
    const dropdownListPasien = ref(false)

    const toggleNamaPasien = () => {
      dropdownListPasien.value = !dropdownListPasien.value
    }

    const resetFormPra = () => {
      Object.assign(pra_medical, { ...pra_medical_init })
      Object.assign(hasilPemeriksaan, { ...hasilPemeriksaanInit })
      selectedNamaPasien.value = ''
    }

    const selectedNamaPasien = ref('')
    const selectPasienLoading = ref(false)
    const selectPasien = async (pasienId, namaPasien) => {
      selectPasienLoading.value = true
      await store.dispatch('getOneBlankoPra', pasienId).then(async (res) => {
        if (res.status !== 200) {
          resetFormPra()
          selectedNamaPasien.value = namaPasien
          pra_medical.data_diri.id_pasien = pasienId
          pra_medical.data_diri.usia = selectedPasien.value.usia
          pra_medical.data_diri.negara_tujuan = selectedPasien.value.negara_tujuan
          pra_medical.data_diri.kelamin = selectedPasien.value.jenis_kelamin
        } else {
          const blanko = res.data.data
          selectedNamaPasien.value = namaPasien
          hasilPemeriksaan['pernihakan'] = blanko.status
          hasilPemeriksaan['golDarah'] = blanko.blanko_pra.golongan_darah
          hasilPemeriksaan['rontgen'] = blanko.blanko_pra.rontgen ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['gula'] = blanko.blanko_pra.gula ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['protein'] = blanko.blanko_pra.protein ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['hbs_ag'] = blanko.blanko_pra.hbs_ag ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['vdrl'] = blanko.blanko_pra.vdrl ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['tpha'] = blanko.blanko_pra.tpha ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['thorax_pa'] = blanko.blanko_pra.thorax_pa ? 'Normal' : 'Tidak Normal'
          hasilPemeriksaan['hasil_pemeriksaan'] = blanko.blanko_pra.hasil
            ? 'Normal'
            : 'Tidak Normal'

          pra_medical.data_diri = {
            id_pasien: pasienId,
            foto: blanko.image_blob,
            bn_bt: blanko.bn_bt,
            tgl_cetak: blanko.tanggal_cetak.split('T')[0],
            tgl_lahir: blanko.tanggal_lahir.split('T')[0],
            usia: blanko.usia,
            kelamin: blanko.jenis_kelamin,
            status: blanko.status,
            negara_tujuan: blanko.negara
          }
          pra_medical.alamat = {
            negara: blanko.negara,
            provinsi: blanko.provinsi,
            daerah: blanko.daerah,
            pekerjaan_di_negara_tujuan: blanko.pekerjaan_negara_tujuan,
            no_visa: blanko.no_visa,
            no_passport: blanko.no_passpor,
            masa_berlaku: blanko.masa_berlaku.split('T')[0],
            sampai_dengan: blanko.sampai_dengan.split('T')[0]
          }
          pra_medical.fisik = {
            tinggi: blanko.blanko_pra.tinggi,
            berat: blanko.blanko_pra.berat,
            mata_kanan: blanko.blanko_pra.mata_kanan,
            mata_kiri: blanko.blanko_pra.mata_kiri,
            tekanan_darah_atas: blanko.blanko_pra.tekanan_darah_atas,
            tekanan_darah_bawah: blanko.blanko_pra.tekanan_darah_bawah,
            tekanan_darah_nadi: blanko.blanko_pra.tekanan_darah_nadi,
            golongan_darah: blanko.blanko_pra.golongan_darah,
            suhu_tubuh: blanko.blanko_pra.suhu_tubuh,
            rontgen: blanko.blanko_pra.rontgen
          }
          pra_medical.laboratorium = {
            gula: blanko.blanko_pra.gula,
            ph: blanko.blanko_pra.ph,
            vdrl: blanko.blanko_pra.vdrl,
            protein: blanko.blanko_pra.protein,
            hbs_ag: blanko.blanko_pra.hbs_ag,
            tpha: blanko.blanko_pra.tpha
          }
          pra_medical.radiologi = {
            thorax_pa: blanko.blanko_pra.thorax_pa
          }
          pra_medical.hasil_pemeriksaan = {
            hasil: blanko.blanko_pra.hasil,
            keterangan: blanko.blanko_pra.keterangan,
            status_pemeriksaan: '',
            penanggung_jawab: blanko.blanko_pra.pic
          }
          if (jenis_medikal.value === 'full') {
            await store.dispatch('getOneBlankoFull', {
              uuid_pasien: pasienId,
              blanko_uuid: blanko.uuid
            })
          }
        }
        dropdownListPasien.value = false
        selectPasienLoading.value = false
      })
    }

    //SECTION Handle Dropdown input
    //ANCHOR State
    const statusPemeriksaan = ['Normal', 'Tidak Normal']
    const listGolonganDarah = ['A', 'B', 'AB', 'O']
    const statusPernikahan = ['Menikah', 'Belum menikah', 'Cerai hidup', 'Cerai mati']
    const hasilPemeriksaanInit = {
      pernihakan: '',
      golDarah: '',
      rontgen: '',
      gula: '',
      protein: '',
      hbs_ag: '',
      vdrl: '',
      tpha: '',
      thorax_pa: '',
      hasil_pemeriksaan: ''
    }
    const hasilPemeriksaan = reactive({ ...hasilPemeriksaanInit })

    //ANCHOR Dropdown states
    const dropDownStatusPernikahan = ref(false)
    const dropdownGolDarah = ref(false)
    const dropdownRontgen = ref(false)
    const dropdownGula = ref(false)
    const dropDownProtein = ref(false)
    const dropDownHbsAg = ref(false)
    const dropDownVdrl = ref(false)
    const dropDownTpha = ref(false)
    const dropDownThoraxPa = ref(false)
    const dropDownHasilPemeriksaan = ref(false)

    // ANCHOR Toggle Dropdown
    const toggleStatusNikah = () => {
      dropDownStatusPernikahan.value = !dropDownStatusPernikahan.value
    }
    const toggleGolDarah = () => {
      dropdownGolDarah.value = !dropdownGolDarah.value
    }
    const toggleRontgen = () => {
      dropdownRontgen.value = !dropdownRontgen.value
    }
    const toggleGula = () => {
      dropdownGula.value = !dropdownGula.value
    }
    const toggleProtein = () => {
      dropDownProtein.value = !dropDownProtein.value
    }
    const toggleHbsAg = () => {
      dropDownHbsAg.value = !dropDownHbsAg.value
    }
    const toggleVdrl = () => {
      dropDownVdrl.value = !dropDownVdrl.value
    }
    const toggleTpha = () => {
      dropDownTpha.value = !dropDownTpha.value
    }
    const toggleThoraxPa = () => {
      dropDownThoraxPa.value = !dropDownThoraxPa.value
    }
    const toggleHasilPemeriksaan = () => {
      dropDownHasilPemeriksaan.value = !dropDownHasilPemeriksaan.value
    }

    //ANCHOR Handle Function state
    const selectStatus = (type, status) => {
      hasilPemeriksaan[type] = status
      if (type === 'pernihakan') {
        pra_medical.data_diri.status = status
        dropDownStatusPernikahan.value = false
      } else if (type === 'golDarah') {
        pra_medical.fisik.golongan_darah = status
        dropdownGolDarah.value = false
      } else if (type === 'rontgen') {
        pra_medical.fisik.rontgen = status
        dropdownRontgen.value = false
      } else if (type === 'gula') {
        pra_medical.laboratorium.gula = status === 'Normal'
        dropdownGula.value = false
      } else if (type === 'protein') {
        pra_medical.laboratorium.protein = status === 'Normal'
        dropDownProtein.value = false
      } else if (type === 'hbs_ag') {
        pra_medical.laboratorium.hbs_ag = status === 'Normal'
        dropDownHbsAg.value = false
      } else if (type === 'vdrl') {
        pra_medical.laboratorium.vdrl = status === 'Normal'
        dropDownVdrl.value = false
      } else if (type === 'tpha') {
        pra_medical.laboratorium.tpha = status === 'Normal'
        dropDownTpha.value = false
      } else if (type === 'thorax_pa') {
        pra_medical.radiologi.thorax_pa = status
        dropDownThoraxPa.value = false
      } else if (type === 'hasil_pemeriksaan') {
        pra_medical.hasil_pemeriksaan.hasil = status === 'Normal'
        dropDownHasilPemeriksaan.value = false
      }
      inputPraMedical()
    }

    //ANCHOR Handle Commit form input
    const inputPraMedical = () => {
      store.commit('setDataDiri', {
        pasien_id: pra_medical.data_diri.id_pasien,
        bn_bt: pra_medical.data_diri.bn_bt,
        tanggal_cetak: pra_medical.data_diri.tgl_cetak,
        tanggal_lahir: pra_medical.data_diri.tgl_lahir,
        usia: pra_medical.data_diri.usia,
        jenis_kelamin: pra_medical.data_diri.kelamin,
        status: pra_medical.data_diri.status
      })
      store.commit('setAlamat', {
        negara: pra_medical.alamat.negara,
        provinsi: pra_medical.alamat.provinsi,
        daerah: pra_medical.alamat.daerah,
        pekerjaan_negara_tujuan: pra_medical.alamat.pekerjaan_di_negara_tujuan,
        no_visa: pra_medical.alamat.no_visa,
        no_passpor: pra_medical.alamat.no_passport,
        masa_berlaku: pra_medical.alamat.masa_berlaku,
        sampai_dengan: pra_medical.alamat.sampai_dengan
      })
      store.commit('setFisik', {
        tinggi: pra_medical.fisik.tinggi,
        berat: pra_medical.fisik.berat,
        mata_kanan: pra_medical.fisik.mata_kanan,
        mata_kiri: pra_medical.fisik.mata_kiri,
        tekanan_darah_atas: pra_medical.fisik.tekanan_darah_atas,
        tekanan_darah_bawah: pra_medical.fisik.tekanan_darah_bawah,
        tekanan_darah_nadi: pra_medical.fisik.tekanan_darah_nadi,
        golongan_darah: pra_medical.fisik.golongan_darah,
        suhu_tubuh: pra_medical.fisik.suhu_tubuh,
        rontgen: pra_medical.fisik.rontgen
      })
      store.commit('setLaboratorium', {
        gula: pra_medical.laboratorium.gula,
        protein: pra_medical.laboratorium.protein,
        ph: pra_medical.laboratorium.ph,
        hbs_ag: pra_medical.laboratorium.hbs_ag,
        vdrl: pra_medical.laboratorium.vdrl,
        tpha: pra_medical.laboratorium.tpha
      })
      store.commit('setRadiologi', {
        thorax_pa: pra_medical.radiologi.thorax_pa
      })
      store.commit('setHasilPemeriksaan', {
        hasil: pra_medical.hasil_pemeriksaan.hasil,
        keterangan: pra_medical.hasil_pemeriksaan.keterangan,
        pic: pra_medical.hasil_pemeriksaan.penanggung_jawab
      })
      store.commit('setStatusMedical', 'pra')
    }

    //ANCHOR Handle input image
    const fileInput = ref(null)

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      console.log('filenya', file)
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target.result
          // Check if the result is a valid data URL
          if (result.startsWith('data:')) {
            // Split the data URL to get type and base64 parts
            const [metadata, base64String] = result.split(',')
            // Extract the MIME type from the metadata part
            const mimeType = metadata.match(/data:(.*);base64/)[1]
            // Store the base64 string and the image type
            store.commit('setFoto', base64String) // Commit base64 string
            store.commit('setImageType', mimeType) // Commit image type
            // Optionally, if you need to use the full data URL somewhere
            pra_medical.data_diri.foto = result
          } else {
            toast.error('Invalid data URL', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: true,
              closeOnClick: true,
              closeButton: true
            })
          }
          pra_medical.data_diri.foto = result
        }
        reader.readAsDataURL(file)
      }
    }

    //ANCHOR Submit Pra Medical
    const submitPraMedical = async () => {
      const promiseToast = toast.loading('Sending data...', {
        position: toast.POSITION.TOP_CENTER
      })

      try {
        // Memanggil aksi createPraMedical dan meneruskan data praMedical
        let response
        console.log('praData.value', praData.value)
        if (praData.value.type === 'update') {
          response = await store.dispatch('updatePraMedical', praData.value)
        } else {
          response = await store.dispatch('createPraMedical', praData.value)
        }

        if (response.data.code === 201 || response.data.code === 200) {
          toast.update(promiseToast, {
            render: response.data.message,
            autoClose: true,
            closeOnClick: true,
            closeButton: true,
            type: 'success',
            isLoading: false
          })
          store.commit('resetFormPra')
          resetFormPra()
          // store.commit('resetReceipt')
          // router.push('/rekap-kwitansi')
        } else {
          toast.update(promiseToast, {
            render: response.data.message,
            autoClose: true,
            closeOnClick: true,
            closeButton: true,
            type: 'error',
            isLoading: false
          })
        }
      } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error('Error submitting Pra Medical:', error)
        toast.update(promiseToast, {
          render: 'Error submitting Pra Medical. Please try again later.',
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: 'error',
          isLoading: false
        })
      }
    }

    // SECTION - Full Medical
    //ANCHOR Handle form full - medical
    const inputFullMedical = (value) => {
      console.log('Anjyas')
      store.commit('setFormFull', { ...value })
    }

    const submitFullMedical = async () => {
      const promiseToast = toast.loading('Sending data...', {
        position: toast.POSITION.TOP_CENTER
      })

      try {
        // Memanggil aksi createPraMedical dan meneruskan data praMedical
        let response
        if (fullData.value.type === 'update') {
          response = await store.dispatch('updateFullMedical', fullData.value)
        } else {
          response = await store.dispatch('createFullMedical', fullData.value)
        }

        if (response.data.code === 201 || response.data.code === 200) {
          toast.update(promiseToast, {
            render: response.data.message,
            autoClose: true,
            closeOnClick: true,
            closeButton: true,
            type: 'success',
            isLoading: false
          })
          store.commit('resetFormFull')
          resetFormPra()
          // store.commit('resetReceipt')
          // router.push('/rekap-kwitansi')
        } else {
          toast.update(promiseToast, {
            render: response.data.message,
            autoClose: true,
            closeOnClick: true,
            closeButton: true,
            type: 'error',
            isLoading: false
          })
        }
      } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error('Error submitting Pra Medical:', error)
        toast.update(promiseToast, {
          render: 'Error submitting Pra Medical. Please try again later.',
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: 'error',
          isLoading: false
        })
      }
    }

    // Handle router
    watch(
      receipt,
      (newBlanko) => {
        if (!newBlanko || Object.keys(newBlanko).length === 0) {
          router.push('/rekap-kwitansi')
        }
      },
      { immediate: true }
    )

    //SECTION Return session
    return {
      jenis_medikal,
      handleChange,
      pra_medical,
      inputPraMedical,
      fileInput,
      handleFileUpload,
      receipt,
      dropdownListPasien,
      selectedNamaPasien,
      toggleNamaPasien,
      selectPasien,
      submitPraMedical,
      praData,
      valueJk,
      listGolonganDarah,
      toggleGolDarah,
      dropdownGolDarah,
      dropdownRontgen,
      statusPemeriksaan,
      hasilPemeriksaan,
      toggleRontgen,
      dropdownGula,
      toggleGula,
      selectStatus,
      dropDownProtein,
      toggleProtein,
      statusPernikahan,
      dropDownStatusPernikahan,
      toggleStatusNikah,
      toggleHbsAg,
      dropDownHbsAg,
      dropDownVdrl,
      dropDownTpha,
      toggleVdrl,
      toggleTpha,
      dropDownThoraxPa,
      toggleThoraxPa,
      dropDownHasilPemeriksaan,
      toggleHasilPemeriksaan,
      selectPasienLoading,
      listPasienFull,
      fullData,
      inputFullMedical,
      submitFullMedical
    }
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto">
    <header class="w-full py-6 sticky top-0 bg-white z-50">
      <div class="flex justify-between w-full font-poppins items-center">
        <div>
          <h1 class="font-semibold text-[35px]">Blanko Kwitansi Pasien</h1>
          <p class="mt-1">
            Blanko kwitansi bisa dibilang juga sebagai
            <span class="text-[#0075FF] font-semibold"> test medikal pasien</span>
          </p>
        </div>
        <div class="flex gap-5">
          <ProfileInfo></ProfileInfo>
        </div>
      </div>
    </header>
    <main class="font-poppins mt-6">
      <!-- SECTION - Pramedical -->
      <form @submit.prevent="submitPraMedical" v-if="jenis_medikal === 'pra'">
        <!-- ANCHOR - Data Diri -->
        <section class="data-diri">
          <div>
            <header class="flex items-center gap-20">
              <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Data Diri</h1>
              <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
            </header>
            <div class="mt-[20px] flex gap-5">
              <aside class="flex flex-col items-center min-w-max">
                <input
                  type="file"
                  id="inputGambar"
                  ref="fileInput"
                  @change="handleFileUpload"
                  style="display: none"
                />
                <label
                  v-if="!pra_medical.data_diri.foto"
                  class="bg-[#0075FF] text-white justify-center rounded-md flex flex-col items-center gap-3 font-poppins font-semibold cursor-pointer w-[130px] h-[130px]"
                  for="inputGambar"
                >
                  <IconFoto />
                  Unggah Foto
                </label>
                <div v-else>
                  <img
                    :src="pra_medical.data_diri.foto"
                    alt="Unggah Foto"
                    class="w-[130px] h-[130px] object-cover rounded-md"
                  />
                  <!-- <img
                    v-else
                    :src="'data:image/png;base64,' + pra_medical.data_diri.foto"
                    alt="Unggah Foto"
                    class="w-[130px] h-[130px] object-cover rounded-md"
                  /> -->
                  <label
                    class="bg-[#0075FF] text-white justify-center rounded-md flex flex-col items-center gap-3 font-poppins font-semibold cursor-pointer w-[130px] h-[36px] mt-2"
                    for="inputGambar"
                  >
                    Edit Foto
                  </label>
                </div>
                <div class="flex flex-col mt-[20px]">
                  <label for="jenis-medical">Jenis Medical</label>
                  <select
                    class="bg-white border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[130px]"
                    @change="handleChange($event)"
                  >
                    <option value="pra" selected>Pra</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </aside>
              <main class="w-full">
                <section class="flex flex-col gap-[13px] w-full">
                  <div class="flex gap-[20px] items-center">
                    <label class="min-w-max">Nama Pasien</label>
                    <div class="relative w-[50%] bg-white border border-[#A2A2A2] rounded-md">
                      <div
                        placeholder="Pilih nama pasien"
                        :class="selectedNamaPasien ? 'text-black' : 'text-[#A2A2A2]'"
                        class="px-[10px] py-[11px] rounded-md w-full cursor-pointer"
                        @click="toggleNamaPasien"
                        readonly
                      >
                        {{ selectedNamaPasien ? selectedNamaPasien : 'Pilih nama pasien' }}
                      </div>
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <i
                          :class="
                            dropdownListPasien
                              ? 'fas fa-chevron-down rotate-180'
                              : 'fas fa-chevron-down rotate-0'
                          "
                          class="transition-transform duration-300 ease-in-out"
                        ></i>
                      </span>
                      <transition name="dropdown">
                        <div
                          v-if="dropdownListPasien"
                          class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                        >
                          <ul
                            v-for="namaPasien in receipt.pasien_tkis"
                            :key="namaPasien.id"
                            @click="selectPasien(namaPasien.uuid, namaPasien.nama_lengkap)"
                            class="py-1 px-3 cursor-pointer flex justify-between items-center hover:bg-gray-100 border rounded-sm"
                          >
                            <li>{{ namaPasien.nama_lengkap }}</li>

                            <div
                              role="status"
                              v-if="
                                selectedNamaPasien === namaPasien.nama_lengkap &&
                                selectPasienLoading
                              "
                            >
                              <svg
                                aria-hidden="true"
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
                              <span class="sr-only">Loading...</span>
                            </div>
                          </ul>
                        </div>
                      </transition>
                    </div>

                    <label for="bn/bt" class="min-w-max">BN/BT</label>
                    <input
                      id="bn/bt"
                      v-model="pra_medical.data_diri.bn_bt"
                      @input="inputPraMedical"
                      type="text"
                      class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[10%]"
                    />
                    <label for="tgl-cetak" class="min-w-max">Tgl. Cetak</label>
                    <input
                      id="tgl-cetak"
                      v-model="pra_medical.data_diri.tgl_cetak"
                      @input="inputPraMedical"
                      type="date"
                      placeholder="Pilih Tanggal"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[30%]"
                    />
                  </div>
                  <div class="flex gap-[13px] items-center w-full">
                    <div class="flex gap-[48px] items-center w-[40%]">
                      <label for="tgl-lahir" class="min-w-max">Tgl. Lahir</label>
                      <input
                        id="tgl-lahir"
                        v-model="pra_medical.data_diri.tgl_lahir"
                        @input="inputPraMedical"
                        type="date"
                        placeholder="Pilih Nama Pasien"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                    </div>
                    <label for="usia" class="min-w-max">Usia</label>
                    <input
                      id="usia"
                      v-model="pra_medical.data_diri.usia"
                      @input="inputPraMedical"
                      type="number"
                      placeholder=""
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[10%]"
                    />
                    <label class="min-w-max">Kelamin</label>
                    <div
                      class="relative border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[20%] bg-[#F4F4F4]"
                    >
                      <div
                        type="text"
                        placeholder="Pilih nama pasien"
                        :class="selectedNamaPasien ? 'text-black' : 'text-[#A2A2A2]'"
                      >
                        {{ valueJk ? valueJk : 'Jenis Kelamin' }}
                      </div>
                    </div>
                    <label class="min-w-max">Status</label>

                    <div
                      class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                    >
                      <div
                        type="text"
                        placeholder="Pilih nama pasien"
                        :class="
                          hasilPemeriksaan.pernihakan
                            ? 'text-black '
                            : 'text-[#A2A2A2] px-[10px] py-[11px]'
                        "
                        class="rounded-md w-full cursor-pointer"
                        @click="toggleStatusNikah"
                      >
                        {{ hasilPemeriksaan.pernihakan }}
                      </div>
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <i
                          :class="
                            dropDownStatusPernikahan
                              ? 'fas fa-chevron-down rotate-180'
                              : 'fas fa-chevron-down rotate-0'
                          "
                          class="transition-transform duration-300 ease-in-out"
                        ></i>
                      </span>
                      <transition name="dropdown">
                        <div
                          v-if="dropDownStatusPernikahan"
                          class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                        >
                          <ul
                            v-for="(status, index) in statusPernikahan"
                            :key="index"
                            @click="selectStatus('pernihakan', status)"
                            class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                          >
                            <li>{{ status }}</li>
                          </ul>
                        </div>
                      </transition>
                    </div>
                  </div>
                </section>
                <section class="mt-[10px]">
                  <div class="bg-[#F4F4F4] flex flex-col gap-2 px-[16px] py-[13px] rounded-md">
                    <div class="w-full flex gap-[30px] items-center">
                      <label for="pj-tki" class="min-w-max">PJ-TKI</label>
                      <output
                        id="pj-tki"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{ receipt.nama_sponsor }}</output
                      >
                    </div>

                    <div class="flex gap-[20px] items-center w-full">
                      <label for="no-reg" class="min-w-max">No. Reg</label>
                      <output
                        id="no-reg"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >Pending</output
                      >
                      <label for="tgl-daftar" class="min-w-max">Tgl & No. Daftar</label>
                      <output
                        id="tgl-daftar"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{ receipt.no_pendaftaran }}</output
                      >
                      <label for="negara-tujuan" class="min-w-max">Negara Tujuan</label>
                      <output
                        id="negara-tujuan"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                      >
                        {{
                          pra_medical.data_diri.negara_tujuan
                            ? pra_medical.data_diri.negara_tujuan
                            : 'Data belum diisi'
                        }}</output
                      >
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </section>

        <!-- ANCHOR - Alamat -->
        <section class="alamat mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Alamat</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center w-full">
              <address class="negara flex gap-[20px] items-center w-[65%]">
                <label for="negara" class="min-w-max">Negara</label>
                <input
                  id="negara"
                  v-model="pra_medical.alamat.negara"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Pilih Negara"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%]"
                />
                <label for="provinsi" class="min-w-max">Provinsi</label>
                <input
                  id="provinsi"
                  v-model="pra_medical.alamat.provinsi"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Pilih Provinsi"
                  class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%]"
                />
              </address>
              <address class="daerah flex gap-[20px] items-center flex-grow">
                <label for="daerah" class="min-w-max">Daerah</label>
                <input
                  id="daerah"
                  v-model="pra_medical.alamat.daerah"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Pilih Daerah"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                />
              </address>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center">
              <address class="flex gap-[20px] w-[65%] items-center">
                <label for="pekerjaan-negara-tujuan" class="min-w-max"
                  >Pekerjaan di Negara Tujuan</label
                >
                <input
                  id="pekerjaan-negara-tujuan"
                  v-model="pra_medical.alamat.pekerjaan_di_negara_tujuan"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Masukan Pekerjaan"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                />
              </address>

              <address class="daerah flex gap-[20px] items-center flex-grow">
                <label for="no-visa" class="min-w-max">No. Visa</label>
                <input
                  id="no-visa"
                  v-model="pra_medical.alamat.no_visa"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Masukan No Visa"
                  class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-full"
                />
              </address>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center">
              <address class="flex gap-[20px] items-center w-[65%]">
                <label for="no-passport" class="min-w-max">No. Passport</label>
                <input
                  id="no-passport"
                  v-model="pra_medical.alamat.no_passport"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Masukan No Passport"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%]"
                />
                <label for="masa-berlaku" class="min-w-max">Massa Berlaku</label>
                <input
                  id="masa-berlaku"
                  v-model="pra_medical.alamat.masa_berlaku"
                  @input="inputPraMedical"
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%]"
                />
              </address>
              <address class="daerah flex gap-[20px] items-center flex-grow">
                <label for="sampai-dengan" class="min-w-max">Sampai Dengan</label>
                <input
                  id="sampai-dengan"
                  v-model="pra_medical.alamat.sampai_dengan"
                  @input="inputPraMedical"
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                />
              </address>
            </div>
          </div>
        </section>

        <!-- ANCHOR - Fisik -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Fisik</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <div class="parent flex justify-between mt-[20px]">
            <!-- SECTION - Fisik -->
            <section class="baris-1">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Fisik</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="tinggi">Tinggi</label>
                  <input
                    id="tinggi"
                    v-model="pra_medical.fisik.tinggi"
                    @input="inputPraMedical"
                    type="number"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Cm</p>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="berat">Berat</label>
                  <input
                    id="berat"
                    v-model="pra_medical.fisik.berat"
                    @input="inputPraMedical"
                    type="number"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Kg</p>
                </div>
              </div>
            </section>

            <!-- SECTION - Mata -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Mata</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="mata-kanan">Kanan</label>
                  <input
                    id="mata-kanan"
                    v-model="pra_medical.fisik.mata_kanan"
                    @input="inputPraMedical"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="mata-kiri">Kiri</label>
                  <input
                    id="mata-kiri"
                    v-model="pra_medical.fisik.mata_kiri"
                    @input="inputPraMedical"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                </div>
              </div>
            </section>

            <!-- SECTION - Tekanan Darah -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center"
                  >Tekanan Darah</span
                >

                <section class="flex gap-[25px]">
                  <div>
                    <div class="mt-[18px] gap-[5px] flex items-center">
                      <label class="w-[60px]" for="atas">Atas</label>
                      <input
                        id="atas"
                        v-model="pra_medical.fisik.tekanan_darah_atas"
                        @input="inputPraMedical"
                        type="number"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70px]"
                      />
                      <p>mm Hg</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[60px]" for="bawah">Bawah</label>
                      <input
                        id="bawah"
                        v-model="pra_medical.fisik.tekanan_darah_bawah"
                        @input="inputPraMedical"
                        type="number"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70px]"
                      />
                      <p>mm Hg</p>
                    </div>
                  </div>

                  <div>
                    <div class="mt-[18px] gap-[5px] flex items-center">
                      <label class="w-[50px]" for="nadi">Nadi</label>
                      <input
                        id="nadi"
                        v-model="pra_medical.fisik.tekanan_darah_nadi"
                        @input="inputPraMedical"
                        type="number"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70px]"
                      />
                      <p>/Mnt</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[50px]">Gol</label>
                      <div
                        class="relative border border-[#A2A2A2] rounded-md w-[100px] px-[10px] py-[11px]"
                      >
                        <div
                          type="text"
                          placeholder="Pilih nama pasien"
                          :class="
                            pra_medical.fisik.golongan_darah
                              ? 'text-black '
                              : 'text-[#A2A2A2] px-[10px] py-[11px]'
                          "
                          class="rounded-md w-full cursor-pointer"
                          @click="toggleGolDarah"
                        >
                          {{
                            pra_medical.fisik.golongan_darah ? pra_medical.fisik.golongan_darah : ''
                          }}
                        </div>
                        <span
                          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <i
                            :class="
                              dropdownGolDarah
                                ? 'fas fa-chevron-down rotate-180'
                                : 'fas fa-chevron-down rotate-0'
                            "
                            class="transition-transform duration-300 ease-in-out"
                          ></i>
                        </span>
                        <transition name="dropdown">
                          <div
                            v-if="dropdownGolDarah"
                            class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                          >
                            <ul
                              v-for="(status, index) in listGolonganDarah"
                              :key="index"
                              @click="selectStatus('golDarah', status)"
                              class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                            >
                              <li>{{ status }}</li>
                            </ul>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <!-- SECTION - Lainnya -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Lainnya</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[100px]" for="suhu-tubuh">Suhu Tubuh</label>
                  <input
                    id="suhu-tubuh"
                    v-model="pra_medical.fisik.suhu_tubuh"
                    @input="inputPraMedical"
                    type="number"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>C</p>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[100px]">Rontgen</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="
                        hasilPemeriksaan.rontgen
                          ? 'text-black '
                          : 'text-[#A2A2A2] px-[10px] py-[11px]'
                      "
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleRontgen"
                    >
                      {{ hasilPemeriksaan.rontgen ? hasilPemeriksaan.rontgen : '' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropdownRontgen
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropdownRontgen"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('rontgen', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <!-- ANCHOR - Laboratorium -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Laboratorium</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-max flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]">Gula</label>

                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.gula ? 'text-black ' : 'text-[#A2A2A2]'"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleGula"
                    >
                      {{ hasilPemeriksaan.gula || 'Pilih Status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropdownGula
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropdownGula"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('gula', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]">Protein</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.protein ? 'text-black ' : 'text-[#A2A2A2]'"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleProtein"
                    >
                      {{ hasilPemeriksaan.protein || 'Pilih Status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownProtein
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownProtein"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('protein', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]">PH</label>
                  <input
                    id="ph"
                    v-model="pra_medical.laboratorium.ph"
                    @input="inputPraMedical"
                    placeholder="Masukan PH"
                    type="number"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]">HBs-AG</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.hbs_ag ? 'text-black ' : 'text-[#A2A2A2]'"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleHbsAg"
                    >
                      {{ hasilPemeriksaan.hbs_ag ? hasilPemeriksaan.hbs_ag : 'Pilih status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownHbsAg
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownHbsAg"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('hbs_ag', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]">VDRL</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.vdrl ? 'text-black ' : 'text-[#A2A2A2] '"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleVdrl"
                    >
                      {{ hasilPemeriksaan.vdrl ? hasilPemeriksaan.vdrl : 'Pilih status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownVdrl
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownVdrl"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('vdrl', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]">TPHA</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.tpha ? 'text-black ' : 'text-[#A2A2A2] '"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleTpha"
                    >
                      {{ hasilPemeriksaan.tpha ? hasilPemeriksaan.tpha : 'Pilih status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownTpha
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownTpha"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('tpha', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </section>

        <!-- ANCHOR - Radiologi -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Radiologi</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-max flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[20px] flex items-center">
                  <label class="max-w-max">Thorax PA</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.thorax_pa ? 'text-black ' : 'text-[#A2A2A2]'"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleThoraxPa"
                    >
                      {{ hasilPemeriksaan.thorax_pa || 'Pilih Status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownThoraxPa
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownThoraxPa"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('thorax_pa', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </section>

        <!-- ANCHOR - Hasil Pemeriksaan -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Hasil Pemeriksaan</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-full flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]">Hasil</label>
                  <div
                    class="relative border border-[#A2A2A2] rounded-md w-[150px] px-[10px] py-[11px]"
                  >
                    <div
                      type="text"
                      placeholder="Pilih nama pasien"
                      :class="hasilPemeriksaan.hasil_pemeriksaan ? 'text-black ' : 'text-[#A2A2A2]'"
                      class="rounded-md w-full cursor-pointer"
                      @click="toggleHasilPemeriksaan"
                    >
                      {{ hasilPemeriksaan.hasil_pemeriksaan || 'Pilih Status' }}
                    </div>
                    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i
                        :class="
                          dropDownHasilPemeriksaan
                            ? 'fas fa-chevron-down rotate-180'
                            : 'fas fa-chevron-down rotate-0'
                        "
                        class="transition-transform duration-300 ease-in-out"
                      ></i>
                    </span>
                    <transition name="dropdown">
                      <div
                        v-if="dropDownHasilPemeriksaan"
                        class="absolute z-10 mt-1 left-0 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                      >
                        <ul
                          v-for="(status, index) in statusPemeriksaan"
                          :key="index"
                          @click="selectStatus('hasil_pemeriksaan', status)"
                          class="py-1 px-3 cursor-pointer hover:bg-gray-100 border rounded-sm"
                        >
                          <li>{{ status }}</li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]" for="protein">Status</label>
                  <h1 class="text-[20px] text-[#0075FF]">FIT</h1>
                </div>
              </div>
              <div class="flex flex-col w-full">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[200px]" for="keterangan">Keterangan</label>
                  <input
                    id="keterangan"
                    v-model="pra_medical.hasil_pemeriksaan.keterangan"
                    @input="inputPraMedical"
                    placeholder="Masukan Keterangan"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[200px]" for="penanggung-jawab">Penanggung Jawab</label>

                  <select
                    v-model="pra_medical.hasil_pemeriksaan.penanggung_jawab"
                    @change="inputPraMedical"
                    class="col-span-3 w-full border border-[#A2A2A2] bg-white px-[10px] py-[9px] rounded-lg"
                  >
                    <option value="" disabled selected>Pilih Nama Dokter</option>
                    <option value="dr. SUPANA">dr. SUPANA</option>
                    <option value="dr. DAFA">dr. DAFA</option>
                  </select>
                </div>
              </div>
            </section>
          </main>
        </section>

        <!-- ANCHOR - Button Sumbit -->
        <button
          @click.prevent="submitPraMedical()"
          class="cetak-blanko mt-[37px] bg-[#0075FF] text-white py-[13px] w-full font-semibold rounded-md"
        >
          <span>
            {{ praData.type === 'create' ? 'Cetak Blanko' : 'Update Blanko' }}
          </span>
        </button>
      </form>

      <!-- SECTION - Full Medical -->
      <form v-else>
        <!-- ANCHOR - Data Diri -->
        <section class="data-diri">
          <div>
            <header class="flex items-center gap-20">
              <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Data Diri</h1>
              <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
            </header>
            <div class="mt-[20px] flex gap-5">
              <aside class="flex flex-col items-center min-w-max">
                <div v-if="pra_medical.data_diri.foto != ''">
                  <img
                    :src="pra_medical.data_diri.foto"
                    alt="Unggah Foto"
                    class="w-[130px] h-[130px] object-cover rounded-md"
                  />
                </div>

                <label
                  v-else
                  class="bg-[#0075FF] text-white justify-center rounded-md flex flex-col items-center gap-3 font-poppins font-semibold w-[130px] h-[130px]"
                  for="inputGambar"
                >
                  <IconFoto />
                  Tidak ada foto
                </label>
                <div class="flex flex-col mt-[20px]">
                  <label for="jenis-medical">Jenis Medical</label>

                  <select
                    class="bg-white border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[130px]"
                    @change="handleChange($event)"
                  >
                    <option value="pra">Pra</option>
                    <option value="full" selected>Full</option>
                  </select>
                </div>
              </aside>
              <main class="w-full bg-[#F4F4F4] px-[16px] py-[13px] rounded-md">
                <section class="flex flex-col gap-[13px] w-full">
                  <div class="flex gap-[20px] items-center">
                    <label for="name" class="min-w-max">Nama Pasien</label>
                    <!-- <output
                      id="name"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50%] text-[#A2A2A2]"
                      >{{ selectedNamaPasien }}</output
                    > -->
                    <div class="relative w-[50%] bg-white border border-[#A2A2A2] rounded-md">
                      <div
                        placeholder="Pilih nama pasien"
                        :class="selectedNamaPasien ? 'text-black' : 'text-[#A2A2A2]'"
                        class="px-[10px] py-[11px] rounded-md w-full cursor-pointer"
                        @click="toggleNamaPasien"
                        readonly
                      >
                        {{ selectedNamaPasien ? selectedNamaPasien : 'Pilih nama pasien' }}
                      </div>
                      <span
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        <i
                          :class="
                            dropdownListPasien
                              ? 'fas fa-chevron-down rotate-180'
                              : 'fas fa-chevron-down rotate-0'
                          "
                          class="transition-transform duration-300 ease-in-out"
                        ></i>
                      </span>
                      <transition name="dropdown">
                        <div
                          v-if="dropdownListPasien"
                          class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md p-2 flex flex-col gap-2"
                        >
                          <ul
                            v-if="listPasienFull.length > 0"
                            v-for="pasien in receipt.pasien_tkis.filter((pasien) =>
                              listPasienFull.includes(pasien.uuid)
                            )"
                            :key="pasien.id"
                            @click="selectPasien(pasien.uuid, pasien.nama_lengkap)"
                            class="py-1 px-3 cursor-pointer flex justify-between items-center hover:bg-gray-100 border rounded-sm"
                          >
                            <li>{{ pasien.nama_lengkap }}</li>

                            <div
                              role="status"
                              v-if="
                                selectedNamaPasien === pasien.nama_lengkap && selectPasienLoading
                              "
                            >
                              <svg
                                aria-hidden="true"
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
                              <span class="sr-only">Loading...</span>
                            </div>
                          </ul>
                          <ul
                            v-else
                            class="py-1 px-3 cursor-not-allowed flex justify-between items-center rounded-sm"
                          >
                            <li class="w-full text-center">Data Pasien Pra tidak ada</li>
                          </ul>
                        </div>
                      </transition>
                    </div>

                    <label for="bn/bt" class="min-w-max">BN/BT</label>
                    <output
                      id="bn/bt"
                      class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[10%] text-[#A2A2A2]"
                    >
                      {{ pra_medical.data_diri.bn_bt ? pra_medical.data_diri.bn_bt : '' }}</output
                    >
                    <label for="tgl-cetak" class="min-w-max">Tgl. Cetak</label>
                    <output
                      id="tgl-cetak"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[30%] text-[#A2A2A2]"
                      >{{
                        pra_medical.data_diri.tgl_cetak
                          ? pra_medical.data_diri.tgl_cetak
                          : 'Pilih Tanggal'
                      }}</output
                    >
                  </div>
                  <div class="flex gap-[13px] items-center w-full">
                    <div class="flex gap-[48px] items-center w-[40%]">
                      <label for="tgl-lahir" class="min-w-max">Tgl. Lahir</label>
                      <output
                        id="tgl-lahir"
                        type="date"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{
                          pra_medical.data_diri.tgl_lahir
                            ? pra_medical.data_diri.tgl_lahir
                            : 'Pilih Tanggal'
                        }}</output
                      >
                    </div>
                    <label for="usia" class="min-w-max">Usia</label>
                    <output
                      id="usia"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[10%] text-[#A2A2A2]"
                      >{{ pra_medical.data_diri.usia ? pra_medical.data_diri.usia : '' }}</output
                    >
                    <label for="kelamin" class="min-w-max">Kelamin</label>
                    <output
                      id="kelamin"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[10%] text-[#A2A2A2]"
                      >{{
                        pra_medical.data_diri.kelamin
                          ? pra_medical.data_diri.kelamin
                          : 'Jenis kelamin'
                      }}</output
                    >
                    <label for="status" class="min-w-max">Status</label>
                    <output
                      id="status"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[30%] text-[#A2A2A2]"
                      >{{
                        pra_medical.data_diri.status ? pra_medical.data_diri.status : 'Status'
                      }}</output
                    >
                  </div>
                </section>
                <section class="mt-[10px]">
                  <div class="flex flex-col gap-2">
                    <div class="w-full flex gap-[30px] items-center">
                      <label for="pj-tki" class="min-w-max">PJ-TKI</label>
                      <output
                        id="pj-tki"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{ receipt.nama_sponsor }}</output
                      >
                    </div>

                    <div class="flex gap-[20px] items-center w-full">
                      <label for="no-reg" class="min-w-max">No. Reg</label>
                      <output
                        id="no-reg"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >Pending</output
                      >
                      <label for="tgl-daftar" class="min-w-max">Tgl & No. Daftar</label>
                      <output
                        id="tgl-daftar"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{ receipt.no_pendaftaran }}</output
                      >
                      <label for="negara-tujuan" class="min-w-max">Negara Tujuan</label>
                      <output
                        id="negara-tujuan"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                        >{{
                          pra_medical.data_diri.negara_tujuan
                            ? pra_medical.data_diri.negara_tujuan
                            : 'Data belum diisi'
                        }}</output
                      >
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </section>

        <!-- ANCHOR - Alamat -->
        <section class="alamat mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Alamat</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </header>
          <div class="bg-[#F4F4F4] rounded-lg p-4">
            <div>
              <div class="flex gap-[20px] items-center w-full">
                <address class="negara flex gap-[20px] items-center w-[65%]">
                  <label for="negara" class="min-w-max">Negara</label>
                  <output
                    id="negara"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%] text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.negara ? pra_medical.alamat.negara : 'Pilih Negara'
                    }}</output
                  >
                  <label for="provinsi" class="min-w-max">Provinsi</label>
                  <output
                    id="provinsi"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%] text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.provinsi ? pra_medical.alamat.provinsi : 'Pilih Provinsi'
                    }}</output
                  >
                </address>
                <address class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="daerah" class="min-w-max">Daerah</label>
                  <output
                    id="daerah"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.daerah ? pra_medical.alamat.daerah : 'Pilih Daerah'
                    }}</output
                  >
                </address>
              </div>
            </div>
            <div class="mt-[20px]">
              <div class="flex gap-[20px] items-center">
                <address class="flex gap-[20px] w-[65%] items-center">
                  <label for="pekerjaan-negara-tujuan" class="min-w-max"
                    >Pekerjaan di Negara Tujuan</label
                  >
                  <output
                    id="pekerjaan-negara-tujuan"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.pekerjaan_di_negara_tujuan
                        ? pra_medical.alamat.pekerjaan_di_negara_tujuan
                        : 'Masukan Pekerjaan'
                    }}</output
                  >
                </address>

                <address class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="no-visa" class="min-w-max">No. Visa</label>
                  <output
                    id="no-visa"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-full text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.no_visa ? pra_medical.alamat.no_visa : 'Masukan No Visa'
                    }}</output
                  >
                </address>
              </div>
            </div>
            <div class="mt-[20px]">
              <div class="flex gap-[20px] items-center">
                <address class="flex gap-[20px] items-center w-[65%]">
                  <label for="no-passport" class="min-w-max">No. Passport</label>
                  <output
                    id="no-passport"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%] text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.no_passport
                        ? pra_medical.alamat.no_passport
                        : 'Masukan No Passport'
                    }}</output
                  >
                  <label for="masa-berlaku" class="min-w-max">Massa Berlaku</label>
                  <output
                    id="masa-berlaku"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%] text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.masa_berlaku
                        ? pra_medical.alamat.masa_berlaku
                        : 'Pilih Tanggal'
                    }}</output
                  >
                </address>
                <address class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="sampai-dengan" class="min-w-max">Sampai Dengan</label>
                  <output
                    id="sampai-dengan"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full text-[#A2A2A2]"
                    >{{
                      pra_medical.alamat.sampai_dengan
                        ? pra_medical.alamat.sampai_dengan
                        : 'Pilih Tanggal'
                    }}</output
                  >
                </address>
              </div>
            </div>
          </div>
        </section>

        <!-- ANCHOR - Riwayat Kesehatan -->
        <section class="riwayat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Riwayat Kesehatan</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </div>
          <p class="mt-[10px] font-poppins">
            Apakah Pekerja Pernah Menderita atau mendapat pengobatan untuk penyakit dan kondisi
            berikut ini? Jika “'YA' Harap Cantumkan Tanggal Deskripsi/Deteksi.
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[20px]">
            <section class="section1">
              <div class="grid-container gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class="">HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.hiv_status"
                  @input="inputFullMedical({ hiv_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hiv_status"
                  @input="inputFullMedical({ hiv_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.hiv_date.split('T')[0]"
                  @input="inputFullMedical({ hiv_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Tuberculosis <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.tbc_status"
                  @input="inputFullMedical({ tbc_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.tbc_status"
                  @input="inputFullMedical({ tbc_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.tbc_date.split('T')[0]"
                  @input="inputFullMedical({ tbc_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Malaria <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.malaria_status"
                  @input="inputFullMedical({ malaria_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.malaria_status"
                  @input="inputFullMedical({ malaria_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.malaria_date.split('T')[0]"
                  @input="inputFullMedical({ malaria_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Leprosy <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.leprosy_status"
                  @input="inputFullMedical({ leprosy_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.leprosy_status"
                  @input="inputFullMedical({ leprosy_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.leprosy_date.split('T')[0]"
                  @input="inputFullMedical({ leprosy_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">STD <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.std_status"
                  @input="inputFullMedical({ std_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.std_status"
                  @input="inputFullMedical({ std_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.std_date.split('T')[0]"
                  @input="inputFullMedical({ std_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Bronchial Asthma</label>
                <input
                  type="checkbox"
                  :checked="fullData.asma_status"
                  @input="inputFullMedical({ asma_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.asma_status"
                  @input="inputFullMedical({ asma_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.asma_date.split('T')[0]"
                  @input="inputFullMedical({ asma_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class="">Heart Disease</label>
                <input
                  type="checkbox"
                  :checked="fullData.hd_status"
                  @input="inputFullMedical({ hd_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hd_status"
                  @input="inputFullMedical({ hd_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.hd_date.split('T')[0]"
                  @input="inputFullMedical({ hd_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Hypertension</label>
                <input
                  type="checkbox"
                  :checked="fullData.hypt_status"
                  @input="inputFullMedical({ hypt_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hypt_status"
                  @input="inputFullMedical({ hypt_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.hypt_date.split('T')[0]"
                  @input="inputFullMedical({ hypt_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Diabetes Mellitus</label>
                <input
                  type="checkbox"
                  :checked="fullData.dbm_status"
                  @input="inputFullMedical({ dbm_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.dbm_status"
                  @input="inputFullMedical({ dbm_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.dbm_date.split('T')[0]"
                  @input="inputFullMedical({ dbm_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Peptic Ulcer</label>
                <input
                  type="checkbox"
                  :checked="fullData.ptu_status"
                  @input="inputFullMedical({ ptu_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.ptu_status"
                  @input="inputFullMedical({ ptu_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.ptu_date.split('T')[0]"
                  @input="inputFullMedical({ ptu_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Kidney Disease</label>
                <input
                  type="checkbox"
                  :checked="fullData.kidney_status"
                  @input="inputFullMedical({ kidney_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.kidney_status"
                  @input="inputFullMedical({ kidney_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.kidney_date.split('T')[0]"
                  @input="inputFullMedical({ kidney_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Cancer</label>
                <input
                  type="checkbox"
                  :checked="fullData.cancer_status"
                  @input="inputFullMedical({ cancer_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.cancer_status"
                  @input="inputFullMedical({ cancer_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.cancer_date.split('T')[0]"
                  @input="inputFullMedical({ cancer_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
            <section class="section3">
              <div class="grid-container gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class="">Epylepsy <span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.epylepsy_status"
                  @input="inputFullMedical({ epylepsy_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.epylepsy_status"
                  @input="inputFullMedical({ epylepsy_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.epylepsy_date.split('T')[0]"
                  @input="inputFullMedical({ epylepsy_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Psychiatric Illnes <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.psin_status"
                  @input="inputFullMedical({ psin_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.psin_status"
                  @input="inputFullMedical({ psin_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.psin_date.split('T')[0]"
                  @input="inputFullMedical({ psin_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Hearing Problem</label>
                <input
                  type="checkbox"
                  :checked="fullData.hepo_status"
                  @input="inputFullMedical({ hepo_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hepo_status"
                  @input="inputFullMedical({ hepo_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.hepo_date.split('T')[0]"
                  @input="inputFullMedical({ hepo_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.hpts_status"
                  @input="inputFullMedical({ hpts_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hpts_status"
                  @input="inputFullMedical({ hpts_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.hpts_date.split('T')[0]"
                  @input="inputFullMedical({ hpts_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Other</label>
                <input
                  type="checkbox"
                  :checked="fullData.other_status"
                  @input="inputFullMedical({ other_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.other_status"
                  @input="inputFullMedical({ other_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="date"
                  :value="fullData.other_date.split('T')[0]"
                  @input="inputFullMedical({ other_date: $event.target.value })"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
          </div>
          <p class="mt-5 text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Dianggap Tidak Layak apabila didapati
            positif (Untuk penyakit lain terserah pada dokter pemeriksa)
          </p>
        </section>

        <!-- ANCHOR - Riwayat Kesehatan Saat ini-->
        <section class="riwayat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Riwayat Kesehatan Saat Ini</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </div>
          <p class="mt-[10px] font-poppins">
            Apakah Pekerja Pernah Menderita atau mendapat pengobatan untuk penyakit dan kondisi
            berikut ini? Jika “'YA' Harap Cantumkan Tanggal Deskripsi/Deteksi.
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[20px]">
            <section class="section1">
              <div class="grid-container-2 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>

                <label class=""
                  >Sesak napas saat beraktivitas
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.snf_status"
                  @input="inputFullMedical({ snf_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.snf_status"
                  @input="inputFullMedical({ snf_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Nyeri dada saat beraktivitas
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.nyd_status"
                  @input="inputFullMedical({ nyd_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.nyd_status"
                  @input="inputFullMedical({ nyd_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Debaran jantung <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.dbj_status"
                  @input="inputFullMedical({ dbj_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.dbj_status"
                  @input="inputFullMedical({ dbj_status: false })"
                  class="h-[20px]"
                />

                <label class="">Pembengkakan kaki</label>
                <input
                  type="checkbox"
                  :checked="fullData.pbk_status"
                  @input="inputFullMedical({ pbk_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.pbk_status"
                  @input="inputFullMedical({ pbk_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Rasa pusing karena sakit kepala
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.rspks_status"
                  @input="inputFullMedical({ rspks_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.rspks_status"
                  @input="inputFullMedical({ rspks_status: false })"
                  class="h-[20px]"
                />

                <label class="">Batuk lebih dari 2 minggu atau hemoptisis</label>
                <input
                  type="checkbox"
                  :checked="fullData.hmp_status"
                  @input="inputFullMedical({ hmp_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hmp_status"
                  @input="inputFullMedical({ hmp_status: false })"
                  class="h-[20px]"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-2 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>

                <label class=""
                  >Kehilangan selera makan <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.ksm_status"
                  @input="inputFullMedical({ ksm_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.ksm_status"
                  @input="inputFullMedical({ ksm_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Rasa haus yang berlebihan dan sering buang air kecil
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.rhb_sbk_status"
                  @input="inputFullMedical({ rhb_sbk_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.rhb_sbk_status"
                  @input="inputFullMedical({ rhb_sbk_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Disuria, hematuria, dan gejala saluran kemih lainnya
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.gskl_status"
                  @input="inputFullMedical({ gskl_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.gskl_status"
                  @input="inputFullMedical({ gskl_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Keluarnya cairan dari uretra/vagina
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.kcuv_status"
                  @input="inputFullMedical({ kcuv_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.kcuv_status"
                  @input="inputFullMedical({ kcuv_status: false })"
                  class="h-[20px]"
                />

                <label class=""
                  >Nyeri sendi multipel <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.nsm_status"
                  @input="inputFullMedical({ nsm_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.nsm_status"
                  @input="inputFullMedical({ nsm_status: false })"
                  class="h-[20px]"
                />

                <label class="">Masalah penglihatan/buta warna</label>
                <input
                  type="checkbox"
                  :checked="fullData.mpbw_status"
                  @input="inputFullMedical({ mpbw_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.mpbw_status"
                  @input="inputFullMedical({ mpbw_status: false })"
                  class="h-[20px]"
                />
              </div>
            </section>
          </div>
          <p class="mt-5 text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Untuk konfirmasi lebih lanjut pada saat
            pemeriksaan dan penyidikan terhadap pemohon
          </p>
        </section>

        <!-- ANCHOR - Fisik & penyidikan -->
        <section class="fisik_penyidikan mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[100px] font-bold text-[20px] text-wrap">Fisik dan Penyidikan</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </div>

          <!-- SECTION - Bagian A -->

          <h1 class="mt-[20px] text-[16px] font-bold">
            Bagian A: <span class="font-thin">Pemeriksaan Umum</span>
          </h1>

          <div class="bg-slate-200 rounded-lg p-4 parent flex justify-between mt-[20px]">
            <!-- SECTION - Fisik -->
            <section class="baris-1">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Fisik</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="tinggi">Tinggi</label>
                  <input
                    id="tinggi"
                    v-model="pra_medical.fisik.tinggi"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Cm</p>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="berat">Berat</label>
                  <input
                    id="berat"
                    v-model="pra_medical.fisik.berat"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Kg</p>
                </div>
              </div>
            </section>

            <!-- SECTION - Mata -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Mata</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="mata-kanan">Kanan</label>
                  <input
                    id="mata-kanan"
                    v-model="pra_medical.fisik.mata_kanan"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Cm</p>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="mata-kiri">Kiri</label>
                  <input
                    id="mata-kiri"
                    v-model="pra_medical.fisik.mata_kiri"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Kg</p>
                </div>
              </div>
            </section>

            <!-- SECTION - Tekanan Darah -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center"
                  >Tekanan Darah</span
                >

                <section class="flex gap-[25px]">
                  <div>
                    <div class="mt-[18px] gap-[5px] flex items-center">
                      <label class="w-[60px]" for="atas">Atas</label>
                      <input
                        id="atas"
                        v-model="pra_medical.fisik.tekanan_darah_atas"
                        @input="inputPraMedical"
                        disabled
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50px]"
                      />
                      <p>mm Hg</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[60px]" for="bawah">Bawah</label>
                      <input
                        id="bawah"
                        v-model="pra_medical.fisik.tekanan_darah_bawah"
                        @input="inputPraMedical"
                        disabled
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50px]"
                      />
                      <p>mm Hg</p>
                    </div>
                  </div>

                  <div>
                    <div class="mt-[18px] gap-[5px] flex items-center">
                      <label class="w-[50px]" for="nadi">Nadi</label>
                      <input
                        id="nadi"
                        v-model="pra_medical.fisik.tekanan_darah_nadi"
                        @input="inputPraMedical"
                        disabled
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50px]"
                      />
                      <p>/Mnt</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[50px]" for="gol">Gol</label>
                      <input
                        id="gol"
                        v-model="pra_medical.fisik.golongan_darah"
                        @input="inputPraMedical"
                        disabled
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <!-- SECTION - Lainnya -->
            <section class="baris-2">
              <div class="flex flex-col min-w-max">
                <span
                  class="font-semibold px-[47px] py-[7px] bg-[#F4F4F4] border-2 border-[#A2A2A2] border-dashed rounded-md text-center w-full"
                  >Lainnya</span
                >
                <div class="mt-[18px] gap-[5px] flex items-center">
                  <label class="w-[100px]" for="suhu-tubuh">Suhu Tubuh</label>
                  <input
                    id="suhu-tubuh"
                    v-model="pra_medical.fisik.suhu_tubuh"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>C</p>
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[100px]" for="rontgen">Rontgen</label>
                  <input
                    id="rontgen"
                    v-model="pra_medical.fisik.rontgen"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
            </section>
          </div>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[20px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Pernah</label>
                <label class="text-center font-semibold">Tidak</label>

                <label>Ruam kulit kronis</label>
                <input
                  type="checkbox"
                  :checked="fullData.rkk_status"
                  @input="inputFullMedical({ rkk_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.rkk_status"
                  @input="inputFullMedical({ rkk_status: false })"
                  class="h-[20px]"
                />

                <label>Pach kulit anestesi, pembesaran saraf tepi atau lesi nodular</label>
                <input
                  type="checkbox"
                  :checked="fullData.pkln_status"
                  @input="inputFullMedical({ pkln_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.pkln_status"
                  @input="inputFullMedical({ pkln_status: false })"
                  class="h-[20px]"
                />

                <label>Deformitas anggota badan</label>
                <input
                  type="checkbox"
                  :checked="fullData.dfab_status"
                  @input="inputFullMedical({ dfab_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.dfab_status"
                  @input="inputFullMedical({ dfab_status: false })"
                  class="h-[20px]"
                />

                <label>Anemia</label>
                <input
                  type="checkbox"
                  :checked="fullData.anemia_status"
                  @input="inputFullMedical({ anemia_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.anemia_status"
                  @input="inputFullMedical({ anemia_status: false })"
                  class="h-[20px]"
                />

                <label>Penyakit kuning</label>
                <input
                  type="checkbox"
                  :checked="fullData.pkn_status"
                  @input="inputFullMedical({ pkn_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.pkn_status"
                  @input="inputFullMedical({ pkn_status: false })"
                  class="h-[20px]"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Tes penglihatan</h1>
                <label class="col-start-2 text-center font-semibold">Kanan</label>
                <label class="text-center font-semibold">Kiri</label>

                <label>Tanpa bantuan</label>
                <input
                  type="checkbox"
                  :checked="fullData.tb_mt_kiri"
                  @input="inputFullMedical({ tb_mt_kiri: $event.target.checked })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.tb_mt_kanan"
                  @input="inputFullMedical({ tb_mt_kanan: $event.target.checked })"
                  class="h-[20px]"
                />

                <label>Dengan bantuan</label>
                <input
                  type="checkbox"
                  :checked="fullData.db_mt_kiri"
                  @input="inputFullMedical({ db_mt_kiri: $event.target.checked })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.db_mt_kanan"
                  @input="inputFullMedical({ db_mt_kanan: $event.target.checked })"
                  class="h-[20px]"
                />

                <label>Terdapat gangguan pendengaran</label>
                <input
                  type="checkbox"
                  :checked="fullData.tgp_kiri"
                  @input="inputFullMedical({ tgp_kiri: $event.target.checked })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.tgp_kanan"
                  @input="inputFullMedical({ tgp_kanan: $event.target.checked })"
                  class="h-[20px]"
                />

                <label>Kebutaan warna</label>
                <input
                  type="checkbox"
                  :checked="fullData.kbw_kiri"
                  @input="inputFullMedical({ kbw_kiri: $event.target.checked })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.kbw_kanan"
                  @input="inputFullMedical({ kbw_kanan: $event.target.checked })"
                  class="h-[20px]"
                />
              </div>
            </section>
          </div>

          <!-- SECTION - Bagian B -->

          <h1 class="mt-[20px] text-[16px] font-bold">
            Bagian B: <span class="font-thin">Pemeriksaan Sistem Tubuh</span>
          </h1>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[16px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Sistem kardiovaskular</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Ukuran jantung</label>
                <input
                  type="checkbox"
                  :checked="fullData.ukj_status"
                  @input="inputFullMedical({ ukj_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.ukj_status"
                  @input="inputFullMedical({ ukj_status: false })"
                  class="h-[20px]"
                />

                <label>Suara Jantung</label>
                <input
                  type="checkbox"
                  :checked="fullData.saj_status"
                  @input="inputFullMedical({ saj_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.saj_status"
                  @input="inputFullMedical({ saj_status: false })"
                  class="h-[20px]"
                />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Temuan Lain</label>
                  <input
                    type="text"
                    :value="fullData.tl_jantung"
                    @input="inputFullMedical({ tl_jantung: $event.target.value })"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Temuan"
                  />
                </div>

                <h1 class="text-[16px] font-bold col-span-3">Sistem Pernapasan</h1>

                <label>Suara Pernapasan</label>
                <input
                  type="checkbox"
                  :checked="fullData.sps_status"
                  @input="inputFullMedical({ sps_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.sps_status"
                  @input="inputFullMedical({ sps_status: false })"
                  class="h-[20px]"
                />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Temuan Lain</label>
                  <input
                    type="text"
                    :value="fullData.tl_sps"
                    @input="inputFullMedical({ tl_sps: $event.target.value })"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Temuan"
                  />
                </div>

                <h1 class="text-[16px] font-bold col-span-3">Saluran Pencernaan</h1>

                <label>Hati</label>
                <input
                  type="checkbox"
                  :checked="fullData.hati_status"
                  @input="inputFullMedical({ hati_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.hati_status"
                  @input="inputFullMedical({ hati_status: false })"
                  class="h-[20px]"
                />

                <label>Limpa</label>
                <input
                  type="checkbox"
                  :checked="fullData.limpa_status"
                  @input="inputFullMedical({ limpa_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.limpa_status"
                  @input="inputFullMedical({ limpa_status: false })"
                  class="h-[20px]"
                />

                <label>Ginjal</label>
                <input
                  type="checkbox"
                  :checked="fullData.ginjal_status"
                  @input="inputFullMedical({ ginjal_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.ginjal_status"
                  @input="inputFullMedical({ ginjal_status: false })"
                  class="h-[20px]"
                />

                <label
                  >Apakah terjadi pembengkakan tidak normal? YA /TIDAK. Tunjukkan jika YA
                  .............</label
                >
                <input
                  type="checkbox"
                  :checked="fullData.pbk_sp_status"
                  @input="inputFullMedical({ pbk_sp_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.pbk_sp_status"
                  @input="inputFullMedical({ pbk_sp_status: false })"
                  class="h-[20px]"
                />

                <input
                  type="text"
                  :value="fullData.tl_sp"
                  @input="inputFullMedical({ tl_sp: $event.target.value })"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <label>Pemeriksaan Rektal (jika ada indikasi)</label>
                <input
                  type="checkbox"
                  :checked="fullData.pr_sp_status"
                  @input="inputFullMedical({ pr_sp_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.pr_sp_status"
                  @input="inputFullMedical({ pr_sp_status: false })"
                  class="h-[20px]"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Sistem Saraf dan Status Mental</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Status mental umum </label>
                <input
                  type="checkbox"
                  :checked="fullData.smu_status"
                  @input="inputFullMedical({ smu_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.smu_status"
                  @input="inputFullMedical({ smu_status: false })"
                  class="h-[20px]"
                />

                <label>Berbicara</label>
                <input
                  type="checkbox"
                  :checked="fullData.berbicara_status"
                  @input="inputFullMedical({ berbicara_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.berbicara_status"
                  @input="inputFullMedical({ berbicara_status: false })"
                  class="h-[20px]"
                />

                <label>Fungsi Kognitif</label>
                <input
                  type="checkbox"
                  :checked="fullData.fk_status"
                  @input="inputFullMedical({ fk_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.fk_status"
                  @input="inputFullMedical({ fk_status: false })"
                  class="h-[20px]"
                />

                <label>Ukuran saraf perifer</label>
                <input
                  type="checkbox"
                  :checked="fullData.usp_status"
                  @input="inputFullMedical({ usp_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.usp_status"
                  @input="inputFullMedical({ usp_status: false })"
                  class="h-[20px]"
                />

                <label>Kekuatan motorik</label>
                <input
                  type="checkbox"
                  :checked="fullData.km_status"
                  @input="inputFullMedical({ km_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.km_status"
                  @input="inputFullMedical({ km_status: false })"
                  class="h-[20px]"
                />

                <label>Sensorik</label>
                <input
                  type="checkbox"
                  :checked="fullData.sensorik_status"
                  @input="inputFullMedical({ sensorik_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.sensorik_status"
                  @input="inputFullMedical({ sensorik_status: false })"
                  class="h-[20px]"
                />

                <label>Reflek</label>
                <input
                  type="checkbox"
                  :checked="fullData.reflek_status"
                  @input="inputFullMedical({ reflek_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.reflek_status"
                  @input="inputFullMedical({ reflek_status: false })"
                  class="h-[20px]"
                />

                <h1 class="text-[16px] font-bold col-span-3">Pemeriksaan sistem genitourinari</h1>

                <label>Pembuangan</label>
                <input
                  type="checkbox"
                  :checked="fullData.psg_pbn_status"
                  @input="inputFullMedical({ psg_pbn_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.psg_pbn_status"
                  @input="inputFullMedical({ psg_pbn_status: false })"
                  class="h-[20px]"
                />

                <label>Luka/Bisul</label>
                <input
                  type="checkbox"
                  :checked="fullData.luka_status"
                  @input="inputFullMedical({ luka_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.luka_status"
                  @input="inputFullMedical({ luka_status: false })"
                  class="h-[20px]"
                />
              </div>
            </section>
          </div>

          <!-- SECTION - Bagian C -->
          <h1 class="mt-[20px] text-[16px] font-bold">
            Bagian C: <span class="font-thin">Hasil Laboratorium dan Temuan X-Ray</span>
          </h1>

          <p class="text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Spesimen untuk pemeriksaan laboratorium
            harus dikumpulkan oleh dokter pemeriksa
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[16px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Darah</h1>
                <label class="text-center font-bold">Negatif</label>
                <label class="text-center font-bold">Positif</label>

                <label>Antibodi HIV (ELISA)</label>
                <input
                  type="checkbox"
                  :checked="!fullData.elisa_status"
                  @input="inputFullMedical({ elisa_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.elisa_status"
                  @input="inputFullMedical({ elisa_status: true })"
                  class="h-[20px]"
                />

                <label>HBsAg <span class="text-red-500 text-[20px]">*</span> </label>
                <input
                  type="checkbox"
                  :checked="!fullData.hbsag_status"
                  @input="inputFullMedical({ hbsag_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.hbsag_status"
                  @input="inputFullMedical({ hbsag_status: true })"
                  class="h-[20px]"
                />

                <label>HCT <span class="text-red-500 text-[20px]">*</span> </label>
                <input
                  type="checkbox"
                  :checked="!fullData.hct_status"
                  @input="inputFullMedical({ hct_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.hct_status"
                  @input="inputFullMedical({ hct_status: true })"
                  class="h-[20px]"
                />

                <label>VDRL & TPHA <span class="text-red-500 text-[20px]">*</span> </label>
                <input
                  type="checkbox"
                  :checked="!fullData.vdrl_tpha_status"
                  @input="inputFullMedical({ vdrl_tpha_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.vdrl_tpha_status"
                  @input="inputFullMedical({ vdrl_tpha_status: true })"
                  class="h-[20px]"
                />

                <label>Parasit Malaria<span class="text-red-500 text-[20px]">*</span> </label>
                <input
                  type="checkbox"
                  :checked="!fullData.pama_status"
                  @input="inputFullMedical({ pama_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.pama_status"
                  @input="inputFullMedical({ pama_status: true })"
                  class="h-[20px]"
                />

                <label>Parasit Filaria<span class="text-red-500 text-[20px]">*</span> </label>
                <input
                  type="checkbox"
                  :checked="!fullData.pafil_status"
                  @input="inputFullMedical({ pafil_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.pafil_status"
                  @input="inputFullMedical({ pafil_status: true })"
                  class="h-[20px]"
                />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Untuk Malaria, bila positif berikan pengobatan yang sesuai dan ulangi tes 1 bulan
                  setelah pengobatan. Tanggal tes darah untuk parasit malaria
                </p>

                <label>Celah Kulit (bila ada indikasi) </label>
                <input
                  type="checkbox"
                  :checked="!fullData.ck_status"
                  @input="inputFullMedical({ ck_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.ck_status"
                  @input="inputFullMedical({ ck_status: true })"
                  class="h-[20px]"
                />

                <label class="col-span-3">Chest X-Ray Report (Valid For 6 month)</label>
                <input
                  type="text"
                  :value="fullData.cxray_report"
                  @input="inputFullMedical({ cxray_report: $event.target.value })"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <label>Sputum AFB (bila diindikasikan) </label>
                <input
                  type="checkbox"
                  :checked="!fullData.sptm_afb_status"
                  @input="inputFullMedical({ sptm_afb_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.sptm_afb_status"
                  @input="inputFullMedical({ sptm_afb_status: true })"
                  class="h-[20px]"
                />

                <label class="col-span-3">Serum Kreatinin</label>
                <input
                  type="text"
                  :value="fullData.serum_krtnn"
                  @input="inputFullMedical({ serum_krtnn: $event.target.value })"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Dilakukan di negara asal bagi pekerja yang mempunyai riwayat penyakit ginjal,
                  hipertensi, dan diabetes melitus
                </p>
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] col-span-3 font-bold">Pemeriksaan Urin</h1>
                <h1 class="text-[16px] col-span-3 font-bold">Pemeriksaan Rutin:</h1>
                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Warna</label>
                  <input
                    type="text"
                    :value="fullData.warna_urin"
                    @input="inputFullMedical({ warna_urin: $event.target.value })"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Warna"
                  />
                </div>

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Gravitasi Spesifik</label>
                  <input
                    type="text"
                    :value="fullData.gravitasi_spesifik"
                    @input="inputFullMedical({ gravitasi_spesifik: $event.target.value })"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Angka"
                  />
                </div>

                <label class="col-start-2 text-center font-bold">Negatif</label>
                <label class="text-center font-bold">Positif</label>

                <label>Gula</label>
                <input
                  type="checkbox"
                  :checked="!fullData.gula_status"
                  @input="inputFullMedical({ gula_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.gula_status"
                  @input="inputFullMedical({ gula_status: true })"
                  class="h-[20px]"
                />

                <label>Albumin</label>
                <input
                  type="checkbox"
                  :checked="!fullData.albumin_status"
                  @input="inputFullMedical({ albumin_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.albumin_status"
                  @input="inputFullMedical({ albumin_status: true })"
                  class="h-[20px]"
                />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Pemeriksaan miroskopi</label>
                  <input
                    type="text"
                    :value="fullData.pm_miros"
                    @input="inputFullMedical({ pm_miros: $event.target.value })"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Hasil"
                  />
                </div>

                <label class="col-start-2 text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label
                  >Opiat / Ganja / Amfetamin <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  :checked="fullData.oga_status"
                  @input="inputFullMedical({ oga_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.oga_status"
                  @input="inputFullMedical({ oga_status: false })"
                  class="h-[20px]"
                />

                <label>Kehamilan<span class="text-red-500 text-[20px]">*</span></label>
                <input
                  type="checkbox"
                  :checked="fullData.kehamilan_status"
                  @input="inputFullMedical({ kehamilan_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.kehamilan_status"
                  @input="inputFullMedical({ kehamilan_status: false })"
                  class="h-[20px]"
                />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Dianggap Tidak Layak jika ditemukan Positif
                </p>

                <label>Usap Rektal untuk Salmonella</label>
                <input
                  type="checkbox"
                  :checked="fullData.urus_status"
                  @input="inputFullMedical({ urus_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.urus_status"
                  @input="inputFullMedical({ urus_status: false })"
                  class="h-[20px]"
                />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Hanya mereka yang berada di Industri Makanan
                </p>
              </div>
            </section>
          </div>
        </section>

        <!-- ANCHOR - Sertifikasi Dokter yang Menghadiri -->
        <section class="Sertifikasi_Dokter mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[200px] font-bold text-[20px]">Sertifikasi Dokter yang Menghadiri</h1>
            <hr class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line" />
          </div>
          <h1 class="mt-[20px] text-[16px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Saya telah memeriksa hal di atas dan
            menemukan:
          </h1>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[16px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Dia bebas penyakit berikut</h1>
                <label class="text-center font-semibold">Negatif</label>
                <label class="text-center font-semibold">Positif</label>

                <label>HIV/AIDS</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_hiv_status"
                  @input="inputFullMedical({ stm_hiv_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_hiv_status"
                  @input="inputFullMedical({ stm_hiv_status: true })"
                  class="h-[20px]"
                />

                <label>TBC</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_tbc_status"
                  @input="inputFullMedical({ stm_tbc_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_tbc_status"
                  @input="inputFullMedical({ stm_tbc_status: true })"
                  class="h-[20px]"
                />

                <label>Malaria</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_malaria_status"
                  @input="inputFullMedical({ stm_malaria_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_malaria_status"
                  @input="inputFullMedical({ stm_malaria_status: true })"
                  class="h-[20px]"
                />

                <label>Kusta</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_kusta_status"
                  @input="inputFullMedical({ stm_kusta_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_kusta_status"
                  @input="inputFullMedical({ stm_kusta_status: true })"
                  class="h-[20px]"
                />

                <label>PMS</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_pms_status"
                  @input="inputFullMedical({ stm_pms_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_pms_status"
                  @input="inputFullMedical({ stm_pms_status: true })"
                  class="h-[20px]"
                />

                <label>Hepatitis B</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_hpb_status"
                  @input="inputFullMedical({ stm_hpb_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_hpb_status"
                  @input="inputFullMedical({ stm_hpb_status: true })"
                  class="h-[20px]"
                />

                <label>Hepatitis C</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_hpc_status"
                  @input="inputFullMedical({ stm_hpc_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_hpc_status"
                  @input="inputFullMedical({ stm_hpc_status: true })"
                  class="h-[20px]"
                />

                <label>Filariasis</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_filariasis_status"
                  @input="inputFullMedical({ stm_filariasis_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_filariasis_status"
                  @input="inputFullMedical({ stm_filariasis_status: true })"
                  class="h-[20px]"
                />

                <label>Gangguan Psikiatri Utama</label>
                <input
                  type="checkbox"
                  :checked="!fullData.gpu_status"
                  @input="inputFullMedical({ gpu_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.gpu_status"
                  @input="inputFullMedical({ gpu_status: true })"
                  class="h-[20px]"
                />

                <p class="col-span-3 mt-[20px] text-[16px] font-bold">
                  <span class="text-red-500 text-[20px]">*</span>Skizofrenia, Gangguan Afektif
                  Bipolar, Depresi Besar, Gangguan Delusi dan Psikosis lainnya
                </p>

                <label>Penyakit Kronis Lainnya</label>
                <input
                  type="checkbox"
                  :checked="!fullData.stm_pkl_status"
                  @input="inputFullMedical({ stm_pkl_status: false })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="fullData.stm_pkl_status"
                  @input="inputFullMedical({ stm_pkl_status: true })"
                  class="h-[20px]"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Simpulkan Pernyataan Berikut</h1>
                <label class="text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>

                <label>Urine dia tidak mengandung opiat/kannabis/amfetamin </label>
                <input
                  type="checkbox"
                  :checked="fullData.urine_oka_status"
                  @input="inputFullMedical({ urine_oka_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.urine_oka_status"
                  @input="inputFullMedical({ urine_oka_status: false })"
                  class="h-[20px]"
                />

                <label>Dia sedang hamil</label>
                <input
                  type="checkbox"
                  :checked="fullData.dsh_status"
                  @input="inputFullMedical({ dsh_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.dsh_status"
                  @input="inputFullMedical({ dsh_status: false })"
                  class="h-[20px]"
                />

                <label>Dia dalam keadaan sehat untuk bekerja</label>
                <input
                  type="checkbox"
                  :checked="fullData.sehat_bekerja_status"
                  @input="inputFullMedical({ sehat_bekerja_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.sehat_bekerja_status"
                  @input="inputFullMedical({ sehat_bekerja_status: false })"
                  class="h-[20px]"
                />

                <label
                  >Oleh karena itu, saya merekomendasikan agar dia dipertimbangkan untuk pekerjaan
                  tersebut</label
                >
                <input
                  type="checkbox"
                  :checked="fullData.rekom_status"
                  @input="inputFullMedical({ rekom_status: true })"
                  class="h-[20px]"
                />
                <input
                  type="checkbox"
                  :checked="!fullData.rekom_status"
                  @input="inputFullMedical({ rekom_status: false })"
                  class="h-[20px]"
                />

                <p class="col-span-3 mt-[20px] text-[16px] font-bold">
                  <span class="text-red-500 text-[20px]">*</span> Jika tidak dipertimbangkan, tolong
                  sebutkan alasannya.
                </p>

                <div v-if="!fullData.rekom_status" class="col-span-3 items-center">
                  <label>Alasan penolakan</label>
                  <textarea
                    type="text"
                    :value="fullData.rekom_alasan"
                    @input="inputFullMedical({ rekom_alasan: $event.target.value })"
                    class="w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Berikan alasan"
                  />
                </div>

                <label>Pilih nama dokter</label>
                <select
                  :value="fullData.dokter"
                  @input="inputFullMedical({ dokter: $event.target.value })"
                  class="col-span-3 w-full border border-[#A2A2A2] bg-white px-[10px] py-[9px] rounded-lg"
                >
                  <option value="" disabled selected>Pilih Nama Dokter</option>
                  <option value="SUPANA">dr. SUPANA</option>
                  <option value="DAFA">dr. DAFA</option>
                </select>

                <div
                  class="items-center text-center col-span-3 grid-container-masaberlaku mt-[20px]"
                >
                  <label>Masa Berlaku</label>
                  <input
                    type="date"
                    :value="fullData.masa_berlaku.split('T')[0]"
                    @input="inputFullMedical({ masa_berlaku: $event.target.value })"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                  />

                  <label for="">Sampai Dengan</label>
                  <input
                    type="date"
                    :value="fullData.sampai_dengan.split('T')[0]"
                    @input="inputFullMedical({ sampai_dengan: $event.target.value })"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>

        <button
          @click.prevent="submitFullMedical()"
          class="cetak-blanko mt-[37px] bg-[#0075FF] text-white py-[13px] w-full font-semibold rounded-md"
        >
          <span>
            {{ fullData.type === 'create' ? 'Cetak Blanko' : 'Update Blanko' }}
          </span>
        </button>
      </form>
    </main>
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 150px 50px 50px 150px;
  /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-2 {
  display: grid;
  grid-template-columns: 300px 50px 50px;
  /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-3 {
  display: grid;
  grid-template-columns: 400px 50px 50px;
  /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-masukan-temuan {
  display: grid;
  grid-template-columns: 200px auto auto auto;
  /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-masaberlaku {
  display: grid;
  grid-template-columns: auto auto auto auto;
  /* Kolom dengan lebar tetap */
  gap: 10px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
