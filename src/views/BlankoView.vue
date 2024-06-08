<script>
import ProfileInfo from "@/components/ProfileInfo.vue";
import IconFoto from "@/components/icons/IconFoto.vue";
import { reactive, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  components: { ProfileInfo, IconFoto },

  setup() {
    const store = useStore();
    const jm = ref(true);

    //!SECTION - Handle form medical
    const handleChange = (event) => {
      jm.value = event.target.value === "P";
    };

    //!SECTION - handle form submissions
    const pra_medical = reactive({
      data_diri: {
        foto: "",
        nama_pasien: "",
        bn_bt: "",
        tgl_cetak: "",
        tgl_lahir: "",
        usia: "",
        kelamin: "",
        status: "",
      },
      alamat: {
        negara: "",
        provinsi: "",
        daerah: "",
        pekerjaan_di_negara_tujuan: "",
        no_visa: "",
        no_passport: "",
        masa_berlaku: "",
        sampai_dengan: "",
      },
      fisik: {
        tinggi: "",
        berat: "",
        kanan: "",
        kiri: "",
        atas: "",
        bawah: "",
        nadi: "",
        gol: "",
        suhu_tubuh: "",
        rontgen: "",
      },
      laboratorium: {
        gula: "",
        ph: "",
        vdrl: "",
        protein: "",
        hbs_ag: "",
        tpha: "",
      },
      radiologi: {
        thorax_pa: "",
      },
      hasil_pemeriksaan: {
        hasil: "",
        keterangan: "",
        status_pemeriksaan: "",
        penanggung_jawab: "",
      },
    });

    const full_medical = reactive({
      riwayat_kesehatan: {
        hiv: {
          hiv_status: "",
          tanggal: "",
        },
        tuberculosis: {
          tuberculosis_status: "",
          tanggal: "",
        },
        malaria: {
          malaria_status: "",
          tanggal: "",
        },
        leprosy: {
          leprosy_status: "",
          tanggal: "",
        },
        std: {
          std_status: "",
          tanggal: "",
        },
        bronchial_asthma: {
          bronchial_asthma_status: "",
          tanggal: "",
        },
        heart_disease: {
          heart_disease_status: "",
          tanggal: "",
        },
        hypertension: {
          hypertension_status: "",
          tanggal: "",
        },
        diabetes_mellitus: {
          diabetes_mellitus_status: "",
          tanggal: "",
        },
        peptic_ulcer: {
          peptic_ulcer_status: "",
          tanggal: "",
        },
        kidney_disease: {
          kidney_disease_status: "",
          tanggal: "",
        },
        cancer: {
          cancer_status: "",
          tanggal: "",
        },
        epylepsy: {
          epylepsy_status: "",
          tanggal: "",
        },
        psychiatric_illnes: {
          psychiatric_illnes_status: "",
          tanggal: "",
        },
        hearing_problem: {
          hearing_problem_status: "",
          tanggal: "",
        },
        hepatitis: {
          hepatitis_status: "",
          tanggal: "",
        },
        other: {
          other_status: "",
          tanggal: "",
        },
      },
      riwayat_kesehatan_saat_ini: {
        sesak_napas_saat_beraktivitas: {
          status: "",
        },
        nyeri_dada_saat_beraktivitas: {
          status: "",
        },
        debaran_jantung: {
          status: "",
        },
        pembengkakan_kaki: {
          status: "",
        },
        rasa_pusing_karena_sakit_kepala: {
          status: "",
        },
        batuk_lebih_dari_2_minggu_atau_hemoptisis: {
          status: "",
        },
        kehilangan_selera_makan: {
          status: "",
        },
        rasa_haus_yang_berlebihan_dan_sering_buang_air_kecil: {
          status: "",
        },
        disuria_hematuria_dan_gejala_saluran_kemih_lainnya: {
          status: "",
        },
        keluarnya_cairan_dari_uretra_atau_vagina: {
          status: "",
        },
        nyeri_sendi_multipel: {
          status: "",
        },
        masalah_penglihatan_buta_warna: {
          status: "",
        },
      },
    });

    //!SECTION - Handle form input pra-medical
    const inputPraMedical = () => {
      store.commit("setDataDiri", {
        nama_pasien: pra_medical.data_diri.nama_pasien,
        bn_bt: pra_medical.data_diri.bn_bt,
        tgl_cetak: pra_medical.data_diri.tgl_cetak,
        tgl_lahir: pra_medical.data_diri.tgl_lahir,
        usia: pra_medical.data_diri.usia,
        kelamin: pra_medical.data_diri.kelamin,
        status: pra_medical.data_diri.status,
      });
      store.commit("setAlamat", {
        negara: pra_medical.alamat.negara,
        provinsi: pra_medical.alamat.provinsi,
        daerah: pra_medical.alamat.daerah,
        pekerjaan_negara_tujuan: pra_medical.alamat.pekerjaan_di_negara_tujuan,
        no_visa: pra_medical.alamat.no_visa,
        no_passport: pra_medical.alamat.no_passport,
        masa_berlaku: pra_medical.alamat.masa_berlaku,
        sampai_dengan: pra_medical.alamat.sampai_dengan,
      });
      store.commit("setFisik", {
        tinggi: pra_medical.fisik.tinggi,
        berat: pra_medical.fisik.berat,
        kanan: pra_medical.fisik.kanan,
        kiri: pra_medical.fisik.kiri,
        atas: pra_medical.fisik.atas,
        bawah: pra_medical.fisik.bawah,
        nadi: pra_medical.fisik.nadi,
        gol: pra_medical.fisik.gol,
        suhu_tubuh: pra_medical.fisik.suhu_tubuh,
        rontgen: pra_medical.fisik.rontgen,
      });
      store.commit("setLaboratorium", {
        gula: pra_medical.laboratorium.gula,
        protein: pra_medical.laboratorium.protein,
        ph: pra_medical.laboratorium.ph,
        hbs_ag: pra_medical.laboratorium.hbs_ag,
        vdrl: pra_medical.laboratorium.vdrl,
        tpha: pra_medical.laboratorium.tpha,
      });
      store.commit("setRadiologi", {
        thorax_pa: pra_medical.radiologi.thorax_pa,
      });
      store.commit("setHasilPemeriksaan", {
        hasil: pra_medical.hasil_pemeriksaan.hasil,
        keterangan: pra_medical.hasil_pemeriksaan.keterangan,
        penanggung_jawab: pra_medical.hasil_pemeriksaan.penanggung_jawab,
      });
    };

    //!SECTION - Handle form full-medical
    const hivStatus = ref(null);
    watch(hivStatus, (newVal) => {
      // watch perubahan pada hivStatus
      if (newVal !== null) {
        // cek jika sudah terisi
        inputRiwayatKesehatan(newVal);
      }
    });
    const inputRiwayatKesehatan = (value) => {
      store.commit("statusHiv", value);
    };

    //!SECTION - Handle input image
    const fileInput = ref(null);

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          pra_medical.data_diri.foto = e.target.result;
          store.commit("setFoto", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    //!Return session
    return {
      jm,
      handleChange,
      pra_medical,
      full_medical,
      inputPraMedical,
      hivStatus,
      inputRiwayatKesehatan,
      fileInput,
      handleFileUpload,
    };
  },
};
</script>
<template>
  <div class="h-full overflow-y-auto">
    <header class="w-full py-6 sticky top-0 bg-white">
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
    <form action="" class="font-poppins mt-6">
      <!-- //SECTION - Pramedical -->
      <div v-if="jm">
        <!-- //ANCHOR - Data Diri -->
        <section class="data-diri">
          <div>
            <div class="flex items-center gap-20">
              <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Data Diri</h1>
              <hr
                class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
              />
            </div>
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
                    <option value="P" selected>Pra</option>
                    <option value="F">Full</option>
                  </select>
                </div>
              </aside>
              <main class="w-full">
                <section class="flex flex-col gap-[13px] w-full">
                  <div class="flex gap-[20px] items-center">
                    <label for="name" class="min-w-max">Nama Pasien</label>
                    <input
                      id="name"
                      v-model="pra_medical.data_diri.nama_pasien"
                      @input="inputPraMedical"
                      type="text"
                      placeholder="Pilih Nama Pasien"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50%]"
                    />
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
                    <label for="kelamin" class="min-w-max">Kelamin</label>
                    <select
                      id="kelamin"
                      v-model="pra_medical.data_diri.kelamin"
                      @change="inputPraMedical"
                      class="bg-white border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[20%]"
                    >
                      <option value="" disabled selected>Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <label for="status" class="min-w-max">Status</label>
                    <input
                      id="status"
                      v-model="pra_medical.data_diri.status"
                      @input="inputPraMedical"
                      type="text"
                      placeholder="Status"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[30%]"
                    />
                  </div>
                </section>
                <section class="mt-[10px]">
                  <div
                    class="bg-[#F4F4F4] flex flex-col gap-2 px-[16px] py-[13px] rounded-md"
                  >
                    <div class="w-full flex gap-[30px] items-center">
                      <label for="pj-tki" class="min-w-max">PJ-TKI</label>
                      <input
                        id="pj-tki"
                        type="text"
                        disabled
                        placeholder="Private"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                    </div>

                    <div class="flex gap-[20px] items-center w-full">
                      <label for="no-reg" class="min-w-max">No. Reg</label>
                      <input
                        id="no-reg"
                        type="text"
                        disabled
                        placeholder="H004038"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                      <label for="tgl-daftar" class="min-w-max">Tgl & No. Daftar</label>
                      <input
                        id="tgl-daftar"
                        type="text"
                        disabled
                        placeholder="08-05-2024/001"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                      <label for="negara-tujuan" class="min-w-max">Negara Tujuan</label>
                      <input
                        id="negara-tujuan"
                        type="text"
                        disabled
                        placeholder="HONGKONG"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </section>

        <!-- //ANCHOR - Alamat -->
        <section class="alamat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Alamat</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center w-full">
              <div class="negara flex gap-[20px] items-center w-[65%]">
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
              </div>
              <div class="daerah flex gap-[20px] items-center flex-grow">
                <label for="daerah" class="min-w-max">Daerah</label>
                <input
                  id="daerah"
                  v-model="pra_medical.alamat.daerah"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Pilih Daerah"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                />
              </div>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center">
              <div class="flex gap-[20px] w-[65%] items-center">
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
              </div>

              <div class="daerah flex gap-[20px] items-center flex-grow">
                <label for="no-visa" class="min-w-max">No. Visa</label>
                <input
                  id="no-visa"
                  v-model="pra_medical.alamat.no_visa"
                  @input="inputPraMedical"
                  type="text"
                  placeholder="Masukan No Visa"
                  class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-full"
                />
              </div>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex gap-[20px] items-center">
              <div class="flex gap-[20px] items-center w-[65%]">
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
              </div>
              <div class="daerah flex gap-[20px] items-center flex-grow">
                <label for="sampai-dengan" class="min-w-max">Sampai Dengan</label>
                <input
                  id="sampai-dengan"
                  v-model="pra_medical.alamat.sampai_dengan"
                  @input="inputPraMedical"
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- //ANCHOR - Fisik -->
        <section class="mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Fisik</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <div class="parent flex justify-between mt-[20px]">
            <!-- //SECTION - Fisik -->
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
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Kg</p>
                </div>
              </div>
            </section>

            <!-- //SECTION - Mata -->
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
                    v-model="pra_medical.fisik.kanan"
                    @input="inputPraMedical"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[60px]" for="mata-kiri">Kiri</label>
                  <input
                    id="mata-kiri"
                    v-model="pra_medical.fisik.kiri"
                    @input="inputPraMedical"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                </div>
              </div>
            </section>

            <!-- //SECTION - Tekanan Darah -->
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
                        v-model="pra_medical.fisik.atas"
                        @input="inputPraMedical"
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50px]"
                      />
                      <p>mm Hg</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[60px]" for="bawah">Bawah</label>
                      <input
                        id="bawah"
                        v-model="pra_medical.fisik.bawah"
                        @input="inputPraMedical"
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
                        v-model="pra_medical.fisik.nadi"
                        @input="inputPraMedical"
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50px]"
                      />
                      <p>/Mnt</p>
                    </div>
                    <div class="mt-[10px] gap-[5px] flex items-center">
                      <label class="w-[50px]" for="gol">Gol</label>
                      <input
                        id="gol"
                        v-model="pra_medical.fisik.gol"
                        @input="inputPraMedical"
                        type="text"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </section>

            <!-- //SECTION - Lainnya -->
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
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>

        <!-- //ANCHOR - Laboratorium -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Laboratorium</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-max flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]" for="gula">Gula</label>
                  <input
                    id="gula"
                    v-model="pra_medical.laboratorium.gula"
                    @input="inputPraMedical"
                    placeholder="Pilih Status"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]" for="protein">Protein</label>
                  <input
                    id="protein"
                    v-model="pra_medical.laboratorium.protein"
                    @input="inputPraMedical"
                    type="text"
                    placeholder="Pilih Status"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]" for="ph">PH</label>
                  <input
                    id="ph"
                    v-model="pra_medical.laboratorium.ph"
                    @input="inputPraMedical"
                    placeholder="Masukan PH"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]" for="HBs-AG">HBs-AG</label>
                  <input
                    id="HBs-AG"
                    v-model="pra_medical.laboratorium.hbs_ag"
                    @input="inputPraMedical"
                    type="text"
                    placeholder="Pilih Status"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]" for="VDRL">VDRL</label>
                  <input
                    id="VDRL"
                    v-model="pra_medical.laboratorium.vdrl"
                    @input="inputPraMedical"
                    placeholder="Pilih Status"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
                <div class="mt-[10px] gap-[5px] flex items-center">
                  <label class="w-[70px]" for="TPHA">TPHA</label>
                  <input
                    id="TPHA"
                    v-model="pra_medical.laboratorium.tpha"
                    @input="inputPraMedical"
                    type="text"
                    placeholder="Pilih Status"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
            </section>
          </main>
        </section>

        <!-- //ANCHOR - Radiologi -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Radiologi</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-max flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[20px] flex items-center">
                  <label class="max-w-max" for="Thorax-PA">Thorax PA</label>
                  <input
                    id="Thorax-PA"
                    v-model="pra_medical.radiologi.thorax_pa"
                    @input="inputPraMedical"
                    placeholder="Pilih Status"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[150px]"
                  />
                </div>
              </div>
            </section>
          </main>
        </section>

        <!-- //ANCHOR - Hasil Pemeriksaan -->
        <section class="mt-[20px]">
          <header class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Hasil Pemeriksaan</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </header>
          <main class="mt-[20px] w-full">
            <section class="baris-1 w-full flex gap-[20px]">
              <div class="flex flex-col">
                <div class="gap-[5px] flex items-center">
                  <label class="w-[70px]" for="Hasil">Hasil</label>
                  <input
                    id="Hasil"
                    v-model="pra_medical.hasil_pemeriksaan.hasil"
                    @input="inputPraMedical"
                    placeholder="Pilih Status"
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[250px]"
                  />
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
                  <label class="w-[200px]" for="penanggung-jawab">Penaggung Jawab</label>

                  <select
                    type="text"
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
      </div>

      <!-- //SECTION - Full Medical -->
      <div v-else>
        <!-- //ANCHOR - Data Diri -->
        <section class="data-diri">
          <div>
            <div class="flex items-center gap-20">
              <h1 class="w-[80px] font-bold text-[20px] text-nowrap">Data Diri</h1>
              <hr
                class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
              />
            </div>
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
                    <option value="P">Pra</option>
                    <option value="F" selected>Full</option>
                  </select>
                </div>
              </aside>
              <main class="w-full">
                <section class="flex flex-col gap-[13px] w-full">
                  <div class="flex gap-[20px] items-center">
                    <label for="name" class="min-w-max">Nama Pasien</label>
                    <input
                      id="name"
                      v-model="pra_medical.data_diri.nama_pasien"
                      @input="inputPraMedical"
                      type="text"
                      placeholder="Pilih Nama Pasien"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[50%]"
                    />
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
                    <label for="kelamin" class="min-w-max">Kelamin</label>
                    <select
                      id="kelamin"
                      v-model="pra_medical.data_diri.kelamin"
                      @change="inputPraMedical"
                      class="bg-white border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[20%]"
                    >
                      <option value="" disabled selected>Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <label for="status" class="min-w-max">Status</label>
                    <input
                      id="status"
                      v-model="pra_medical.data_diri.status"
                      @input="inputPraMedical"
                      type="text"
                      placeholder="Status"
                      class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[30%]"
                    />
                  </div>
                </section>
                <section class="mt-[10px]">
                  <div
                    class="bg-[#F4F4F4] flex flex-col gap-2 px-[16px] py-[13px] rounded-md"
                  >
                    <div class="w-full flex gap-[30px] items-center">
                      <label for="pj-tki" class="min-w-max">PJ-TKI</label>
                      <input
                        id="pj-tki"
                        type="text"
                        disabled
                        placeholder="Private"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                    </div>

                    <div class="flex gap-[20px] items-center w-full">
                      <label for="no-reg" class="min-w-max">No. Reg</label>
                      <input
                        id="no-reg"
                        type="text"
                        disabled
                        placeholder="H004038"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                      <label for="tgl-daftar" class="min-w-max">Tgl & No. Daftar</label>
                      <input
                        id="tgl-daftar"
                        type="text"
                        disabled
                        placeholder="08-05-2024/001"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                      <label for="negara-tujuan" class="min-w-max">Negara Tujuan</label>
                      <input
                        id="negara-tujuan"
                        type="text"
                        disabled
                        placeholder="HONGKONG"
                        class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                      />
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        </section>

        <!-- //ANCHOR - Alamat -->
        <section class="alamat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Alamat</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <div class="bg-slate-200 rounded-lg p-4">
            <div>
              <div class="flex gap-[20px] items-center w-full">
                <div class="negara flex gap-[20px] items-center w-[65%]">
                  <label for="negara" class="min-w-max">Negara</label>
                  <input
                    id="negara"
                    v-model="pra_medical.alamat.negara"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Pilih Negara"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%]"
                  />
                  <label for="provinsi" class="min-w-max">Provinsi</label>
                  <input
                    id="provinsi"
                    v-model="pra_medical.alamat.provinsi"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Pilih Provinsi"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%]"
                  />
                </div>
                <div class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="daerah" class="min-w-max">Daerah</label>
                  <input
                    id="daerah"
                    v-model="pra_medical.alamat.daerah"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Pilih Daerah"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            <div class="mt-[20px]">
              <div class="flex gap-[20px] items-center">
                <div class="flex gap-[20px] w-[65%] items-center">
                  <label for="pekerjaan-negara-tujuan" class="min-w-max"
                    >Pekerjaan di Negara Tujuan</label
                  >
                  <input
                    id="pekerjaan-negara-tujuan"
                    v-model="pra_medical.alamat.pekerjaan_di_negara_tujuan"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Masukan Pekerjaan"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                  />
                </div>

                <div class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="no-visa" class="min-w-max">No. Visa</label>
                  <input
                    id="no-visa"
                    v-model="pra_medical.alamat.no_visa"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Masukan No Visa"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-full"
                  />
                </div>
              </div>
            </div>
            <div class="mt-[20px]">
              <div class="flex gap-[20px] items-center">
                <div class="flex gap-[20px] items-center w-[65%]">
                  <label for="no-passport" class="min-w-max">No. Passport</label>
                  <input
                    id="no-passport"
                    v-model="pra_medical.alamat.no_passport"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    placeholder="Masukan No Passport"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[70%]"
                  />
                  <label for="masa-berlaku" class="min-w-max">Massa Berlaku</label>
                  <input
                    id="masa-berlaku"
                    v-model="pra_medical.alamat.masa_berlaku"
                    @input="inputPraMedical"
                    disabled
                    type="date"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[10px] rounded-md w-[30%]"
                  />
                </div>
                <div class="daerah flex gap-[20px] items-center flex-grow">
                  <label for="sampai-dengan" class="min-w-max">Sampai Dengan</label>
                  <input
                    id="sampai-dengan"
                    v-model="pra_medical.alamat.sampai_dengan"
                    @input="inputPraMedical"
                    disabled
                    type="date"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- //ANCHOR - Riwayat Kesehatan -->
        <section class="riwayat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Riwayat Kesehatan</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <p class="mt-[10px] font-poppins">
            Apakah Pekerja Pernah Menderita atau mendapat pengobatan untuk penyakit dan
            kondisi berikut ini? Jika “'YA' Harap Cantumkan Tanggal Deskripsi/Deteksi.
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[20px]">
            <section class="section1">
              <div class="grid-container gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class=""
                  >HIV/AIDS <span class="text-red-500 text-[20px]">*</span></label
                >
                <input
                  type="checkbox"
                  class="h-[20px]"
                  :true-value="'ya'"
                  :false-value="null"
                  v-model="hivStatus"
                />
                <input
                  type="checkbox"
                  class="h-[20px]"
                  value="tidak"
                  :true-value="'tidak'"
                  :false-value="null"
                  v-model="hivStatus"
                />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Tuberculosis <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Malaria <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Leprosy <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >STD <span class="text-red-500 text-[20px]">*</span></label
                >

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Bronchial Asthma</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
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
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Hypertension</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Diabetes Mellitus</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Peptic Ulcer</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Kidney Disease</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Cancer</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
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

                <label class=""
                  >Epylepsy <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Psychiatric Illnes
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Hearing Problem</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Hepatitis B & C <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Other</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
          </div>
          <p class="mt-5 text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Dianggap Tidak Layak apabila
            didapati positif (Untuk penyakit lain terserah pada dokter pemeriksa)
          </p>
        </section>

        <!-- //ANCHOR - Riwayat Kesehatan Saat ini-->
        <section class="riwayat mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[80px] font-bold text-[20px]">Riwayat Kesehatan Saat Ini</h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <p class="mt-[10px] font-poppins">
            Apakah Pekerja Pernah Menderita atau mendapat pengobatan untuk penyakit dan
            kondisi berikut ini? Jika “'YA' Harap Cantumkan Tanggal Deskripsi/Deteksi.
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[20px]">
            <section class="section1">
              <div class="grid-container-2 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class=""
                  >Sesak napas saat beraktivitas
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Nyeri dada saat beraktivitas
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Debaran jantung <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Pembengkakan kaki</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Rasa pusing karena sakit kepala
                  <span class="text-red-500 text-[20px]">*</span></label
                >

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Batuk lebih dari 2 minggu atau hemoptisis</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-2 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>
                <label class="text-center font-semibold">Tanggal</label>

                <label class=""
                  >Kehilangan selera makan
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Rasa haus yang berlebihan dan sering buang air kecil
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Disuria, hematuria, dan gejala saluran kemih lainnya
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Keluarnya cairan dari uretra/vagina
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class=""
                  >Nyeri sendi multipel
                  <span class="text-red-500 text-[20px]">*</span></label
                >

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />

                <label class="">Masalah penglihatan/buta warna</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
                <input
                  type="date"
                  placeholder="Pilih Tanggal"
                  class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                />
              </div>
            </section>
          </div>
          <p class="mt-5 text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Untuk konfirmasi lebih lanjut
            pada saat pemeriksaan dan penyidikan terhadap pemohon
          </p>
        </section>

        <!-- //ANCHOR - Fisik & penyidikan -->
        <section class="fisik_penyidikan mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[100px] font-bold text-[20px] text-wrap">
              Fisik dan Penyidikan
            </h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>

          <!-- //SECTION - Bagian A -->

          <h1 class="mt-[20px] text-[16px] font-bold">
            Bagian A: <span class="font-thin">Pemeriksaan Umum</span>
          </h1>

          <div class="bg-slate-200 rounded-lg p-4 parent flex justify-between mt-[20px]">
            <!-- //SECTION - Fisik -->
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

            <!-- //SECTION - Mata -->
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
                    v-model="pra_medical.fisik.kanan"
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
                    v-model="pra_medical.fisik.kiri"
                    @input="inputPraMedical"
                    disabled
                    type="text"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md w-[100px]"
                  />
                  <p>Kg</p>
                </div>
              </div>
            </section>

            <!-- //SECTION - Tekanan Darah -->
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
                        v-model="pra_medical.fisik.atas"
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
                        v-model="pra_medical.fisik.bawah"
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
                        v-model="pra_medical.fisik.nadi"
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
                        v-model="pra_medical.fisik.gol"
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

            <!-- //SECTION - Lainnya -->
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
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label
                  >Pach kulit anestesi, pembesaran saraf tepi atau lesi nodular</label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Deformitas anggota B\badan</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Anemia</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Penyakit kuning</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <label class="col-start-2 text-center font-semibold">Kanan</label>
                <label class="text-center font-semibold">Kiri</label>

                <label>Tes penglihatan: </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Tanpa bantuan</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Dengan bantuan</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Terdapat gangguan pendengaran</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Kebutaan warna</label>

                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
              </div>
            </section>
          </div>

          <!-- //SECTION - Bagian B -->

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
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Suara Jantung</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Temuan Lain</label>
                  <input
                    type="text"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Temuan"
                  />
                </div>

                <h1 class="text-[16px] font-bold">Sistem Pernapasan</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Suara Pernapasan</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Temuan Lain</label>
                  <input
                    type="text"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Temuan"
                  />
                </div>

                <h1 class="text-[16px] font-bold">Saluran Pencernaan</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Hati</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Limpa</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Ginjal</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label
                  >Apakah terjadi pembengkakan tidak normal? YA /TIDAK. Tunjukkan jika YA
                  .............</label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <input
                  type="text"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <label>Pemeriksaan Rektal (jika ada indikasi)</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Sistem Saraf dan Status Mental</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Status mental umum </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Berbicara</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Fungsi Kognitif</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Ukuran saraf perifer</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Kekuatan motorik</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Sensorik</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Reflek</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <h1 class="text-[16px] font-bold">Pemeriksaan sistem genitourinari</h1>
                <label class="text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label>Pembuangan</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Luka/Bisul</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
              </div>
            </section>
          </div>

          <!-- //SECTION - Bagian C -->
          <h1 class="mt-[20px] text-[16px] font-bold">
            Bagian C: <span class="font-thin">Hasil Laboratorium dan Temuan X-Ray</span>
          </h1>

          <p class="text-[18px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Spesimen untuk pemeriksaan
            laboratorium harus dikumpulkan oleh dokter pemeriksa
          </p>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[16px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Darah</h1>
                <label class="text-center font-bold">Negatif</label>
                <label class="text-center font-bold">Positif</label>

                <label>Antibodi HIV (ELISA)</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>HBsAg <span class="text-red-500 text-[20px]">*</span> </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>HCT <span class="text-red-500 text-[20px]">*</span> </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label
                  >VDRL & TPHA <span class="text-red-500 text-[20px]">*</span>
                </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label
                  >Parasit Malaria<span class="text-red-500 text-[20px]">*</span>
                </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Untuk Malaria, bila positif berikan pengobatan yang sesuai dan ulangi
                  tes 1 bulan setelah pengobatan. Tanggal tes darah untuk parasit malaria
                </p>

                <label>Celah Kulit (bila ada indikasi) </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label class="col-span-3">Chest X-Ray Report (Valid For 6 month)</label>
                <input
                  type="text"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <label>Sputum AFB (bila diindikasikan) </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label class="col-span-3">Serum Kreatinin</label>
                <input
                  type="text"
                  class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                  placeholder="Masukan Temuan"
                />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Dilakukan di negara asal bagi pekerja yang mempunyai riwayat penyakit
                  ginjal, hipertensi, dan diabetes melitus
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
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Warna"
                  />
                </div>

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Gravitasi Spesifik</label>
                  <input
                    type="text"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Angka"
                  />
                </div>

                <label class="col-start-2 text-center font-bold">Negatif</label>
                <label class="text-center font-bold">Positif</label>

                <label>Gula</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Albumin</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <div class="col-span-3 items-center grid-container-masukan-temuan">
                  <label class="col-span-1">Pemeriksaan miroskopi</label>
                  <input
                    type="text"
                    class="col-span-3 w-full border border-[#A2A2A2] px-[10px] py-[9px] rounded-lg"
                    placeholder="Masukan Hasil"
                  />
                </div>

                <label class="col-start-2 text-center font-bold">Normal</label>
                <label class="text-center font-bold">Tidak</label>

                <label
                  >Opiat / Ganja / Amfetamin
                  <span class="text-red-500 text-[20px]">*</span></label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Kehamilan<span class="text-red-500 text-[20px]">*</span></label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Dianggap Tidak Layak jika ditemukan Positif
                </p>

                <label>Usap Rektal untuk Salmonella</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <p class="col-span-3">
                  <span class="text-red-500 text-[20px]">*</span>
                  Hanya mereka yang berada di Industri Makanan
                </p>
              </div>
            </section>
          </div>
        </section>

        <!-- //ANCHOR - Sertifikasi Dokter yang Menghadiri -->
        <section class="Sertifikasi_Dokter mt-[20px]">
          <div class="flex items-center gap-20">
            <h1 class="w-[200px] font-bold text-[20px]">
              Sertifikasi Dokter yang Menghadiri
            </h1>
            <hr
              class="w-full border-[2px] border-[#0075FF] border-dashed custom-dashed-line"
            />
          </div>
          <h1 class="mt-[20px] text-[16px] font-bold">
            <span class="text-red-500 text-[20px]">*</span>Saya telah memeriksa hal di
            atas dan menemukan:
          </h1>

          <div class="parent flex justify-between gap-[28px] px-5 mt-[16px]">
            <section class="section1">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Dia bebas penyakit berikut</h1>
                <label class="text-center font-semibold">Negatif</label>
                <label class="text-center font-semibold">Positif</label>

                <label>HIV/AIDS</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>TBC</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Malaria</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Kusta</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>PMS</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Hepatitis B</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Hepatitis C</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Filariasis</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Gangguan Psikiatri Utama</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <p class="col-span-3 mt-[20px] text-[16px] font-bold">
                  <span class="text-red-500 text-[20px]">*</span>Skizofrenia, Gangguan
                  Afektif Bipolar, Depresi Besar, Gangguan Delusi dan Psikosis lainnya
                </p>

                <label>Penyakit Kronis Lainnya</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />
              </div>
            </section>
            <section class="section2">
              <div class="grid-container-3 gap-y-2 min-w-max items-center">
                <h1 class="text-[16px] font-bold">Simpulkan Pernyataan Berikut</h1>
                <label class="text-center font-semibold">Iya</label>
                <label class="text-center font-semibold">Tidak</label>

                <label>Urine dia tidak mengandung opiat/kannabis/amfetamin </label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Dia sedang hamil</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label>Dia dalam keadaan sehat untuk bekerja</label>
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <label
                  >Oleh karena itu, saya merekomendasikan agar dia dipertimbangkan untuk
                  pekerjaan tersebut</label
                >
                <input type="checkbox" class="h-[20px]" />
                <input type="checkbox" class="h-[20px]" />

                <p class="col-span-3 mt-[20px] text-[16px] font-bold">
                  <span class="text-red-500 text-[20px]">*</span> Jika tidak
                  dipertimbangkan, tolong sebutkan alasannya.
                </p>

                <label>Pilih nama dokter</label>
                <select
                  type="text"
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
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                  />

                  <label for="">Sampai Dengan</label>
                  <input
                    type="date"
                    placeholder="Pilih Tanggal"
                    class="border border-[#A2A2A2] px-[10px] py-[11px] rounded-md"
                  />
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      <!-- //ANCHOR - Button Sumbit -->
      <button
        class="cetak-blanko mt-[37px] bg-[#0075FF] text-white py-[13px] w-full font-semibold rounded-md"
      >
        <span>Cetak Blanko</span>
      </button>
    </form>
  </div>
</template>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 150px 50px 50px 150px; /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-2 {
  display: grid;
  grid-template-columns: 400px 50px 50px 200px; /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-3 {
  display: grid;
  grid-template-columns: 400px 50px 50px; /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-masukan-temuan {
  display: grid;
  grid-template-columns: 200px auto auto auto; /* Kolom dengan lebar tetap */
  gap: 10px;
}

.grid-container-masaberlaku {
  display: grid;
  grid-template-columns: auto auto auto auto; /* Kolom dengan lebar tetap */
  gap: 10px;
}
</style>
