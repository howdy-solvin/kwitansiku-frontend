<script>
import ProfileInfo from "@/components/ProfileInfo.vue";
import IconRefresh from "@/components/icons/IconRefresh.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import { useStore } from "vuex";
import IconTrash from "@/components/icons/IconTrash.vue";
import { reactive, computed, ref, watchEffect, onUnmounted } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import IconCeklist from "@/components/icons/IconCeklist.vue";

export default {
  components: { ProfileInfo, IconRefresh, IconPlus, IconEdit, IconCeklist, IconTrash },

  setup() {
    const store = useStore();
    const router = useRouter();

    const isDisabled = ref(true);

    // Gunakan ref untuk variabel totalDaftar
    const data = reactive({
      form: {
        receipt: {
          tanggal: "",
          no_pendaftaran: "Mengambil antrian...",
          nama_penanggungjawab: "",
          nama_sponsor: "",
          keterangan: "",
          total_pembayaran: "",
        },
        patient: [],
      },
    });

    //TODO - Menhitung Total Daftar Pasien
    const totalDaftar = computed(() => {
      return data.form.patient.length;
    });

    //TODO -  Menghitung total harga dari semua pasien
    // Mendefinisikan variabel untuk menyimpan total harga
    let totalHargaValue;
    const totalHarga = computed(() => {
      const totalPrice = data.form.patient.reduce((total, patient) => {
        const harga = parseFloat(patient.harga);
        return total + (isNaN(harga) ? 0 : harga);
        // return total + (isNaN() ? 0 : parseFloat(patient.harga));
      }, 0);

      // Format total harga ke format yang diinginkan
      totalHargaValue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalPrice);

      return totalHargaValue;
    });

    //TODO - Menambahkan Pasien
    const addPatient = () => {
      const newPatient = {
        no_form: "",
        negara_tujuan: "",
        nama_lengkap: "",
        usia: "",
        jenis_kelamin: "",
        harga: "",
      };

      // Tambahkan objek baru ke dalam array patient
      data.form.patient.push(newPatient);
    };

    const addRekapPatient = () => {
      const newPatient = {
        no_form: "",
        negara_tujuan: "",
        nama_lengkap: "",
        usia: "",
        jenis_kelamin: "",
        harga: "",
      };

      // Tambahkan objek baru ke dalam array patient
      dataRekap.pasien_tkis.push(newPatient);
    };

    //TODO -  Menghapus Pasien
    const deletePatient = (patient) => {
      const index = data.form.patient.indexOf(patient);
      if (index !== -1) {
        data.form.patient.splice(index, 1);
      }
    };

    const deletePatientRekap = (patient) => {
      const index = dataRekap.pasien_tkis.indexOf(patient);
      if (index !== -1) {
        dataRekap.pasien_tkis.splice(index, 1);
      }
    };

    //TODO - Menghapus semua inputan
    const refreshPage = () => {
      store.commit("setRekapStatus", false);
      store.commit("setTotalPembayaran", null);
      store.commit("setTotalPembayaranPasien", null);
      const no_pendaftaran = data.form.receipt.no_pendaftaran;
      data.form = {
        receipt: {
          tanggal: "",
          no_pendaftaran: no_pendaftaran,
          nama_penanggungjawab: "",
          nama_sponsor: "",
          keterangan: "",
          total_pembayaran: "",
        },
        patient: [],
      };
    };

    //STUB - Submit Pasien
    const submitPatient = async () => {
      const promiseToast = toast.loading("Please wait...", {
        position: toast.POSITION.TOP_CENTER,
      });

      const response = await store.dispatch("createRekap", data.form);
      if (response.code == 201) {
        toast.update(promiseToast, {
          render: response.data.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "success",
          isLoading: false,
        });
        refreshPage();
        router.push("/rekap-kwitansi");
      } else {
        toast.update(promiseToast, {
          render: response.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      }
    };

    //TODO -  melakukan vuex untuk menghitung total sisa
    const inputTotalPembayaran = () => {
      store.commit("setTotalPembayaran", data.form.receipt.total_pembayaran);
    };

    const inputTotalPembayaranPasien = () => {
      if (data.form && data.form.patient) {
        const totalHarga = data.form.patient.reduce((total, item) => {
          // Mengonversi nilai harga menjadi float dan menambahkannya ke total
          return total + parseFloat(item.harga || 0); // Jika harga tidak valid, gunakan nilai 0
        }, 0);
        store.commit("setTotalPembayaranPasien", totalHarga);
      } else {
        console.error("Data pasien tidak terdefinisi atau tidak valid.");
      }
    };

    const sisa = computed(() => {
      const kekurangan = store.getters["sisaPembayaran"];
      if (isNaN(kekurangan)) {
        return "0";
      }
      const formattedTotalHarga = new Intl.NumberFormat("id-ID").format(kekurangan);
      return formattedTotalHarga;
    });

    const sisaRekap = computed(() => {
      const kekurangan = store.getters["getterRekapSisa"];
      if (isNaN(kekurangan)) {
        return "0";
      }
      const formattedTotalHarga = new Intl.NumberFormat("id-ID").format(kekurangan);
      return formattedTotalHarga;
    });

    let rekapitulasi;
    const totalRekap = computed(() => {
      const totalHargaRekap = dataRekap.total_harga;

      // Format total harga ke format yang diinginkan
      totalHargaValue = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalHargaRekap);

      return totalHargaValue;
    });
    onUnmounted(() => {
      refreshPage();
    });

    //TODO - Disable if lunas

    //TODO - Session Get Data
    const dataRekap = store.getters["getterRekap"];
    const dataEdit = store.getters["getDataSetForm"];

    //TODO - load form edit
    watchEffect(() => {
      store
        .dispatch("fetchRegistNumber")
        .then((registNumber) => {
          data.form.receipt.no_pendaftaran = registNumber.data.new_regist_id;
        })
        .catch((error) => {
          console.error("Gagal mengambil nomor pendaftaran:", error);
        });

      const dataRekap = store.getters["getterRekap"];
      if (dataRekap) {
        const pasien_tkis = dataRekap.pasien_tkis;
        const updatedPasien_tkis = pasien_tkis.map((item) => {
          // Menghindari properti yang tidak diinginkan
          // eslint-disable-next-line no-unused-vars
          const { createdAt, receipt_id, updatedAt, ...rest } = item;
          return rest;
        });
        store.commit("setFormEditPasien", updatedPasien_tkis);

        const {
          keterangan,
          nama_penanggungjawab,
          nama_sponsor,
          no_pendaftaran,
          tanggal,
          total_pembayaran,
        } = dataRekap;
        store.commit("setFormEditKuitansi", {
          keterangan,
          nama_penanggungjawab,
          nama_sponsor,
          no_pendaftaran,
          tanggal,
          total_pembayaran,
        });
      }
    });

    //TODO - watcheffect input no form

    //TODO - session edit
    const editForm = ref([]);
    const toggleEdit = (index) => {
      editForm.value[index] = !editForm.value[index];
    };

    const enablePembayaran = ref(false);

    const togglePembayaran = () => {
      enablePembayaran.value = !enablePembayaran.value;
      console.log("enablePembayaran:", enablePembayaran.value);
    };

    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);

    const isPassedDay = computed(() => currentDate > targetDate);

    const editTotalPembayaran = () => {
      if (dataRekap && dataRekap.pasien_tkis) {
        const totalHarga = dataRekap.pasien_tkis.reduce((total, item) => {
          // Mengonversi nilai harga menjadi float dan menambahkannya ke total
          return total + parseFloat(item.harga || 0); // Jika harga tidak valid, gunakan nilai 0
        }, 0);
        store.commit("setRekapTotalPembayaranPasien", totalHarga);
      } else {
        console.error("Data pasien tidak terdefinisi atau tidak valid.");
      }
    };

    const editNamaPj = (newValue) => {
      store.commit("setEditNamaPj", newValue);
    };
    const editNamaSponsor = (newValue) => {
      store.commit("setEditNamaSponsor", newValue);
    };
    const editJk = (index, newValue) => {
      store.commit("setEditJk", index, newValue);
    };
    const editUsia = (index, newValue) => {
      store.commit("setEditUsia", index, newValue);
    };

    //SECTION - submit edit
    const submitEdit = async () => {
      const dataEditt = store.getters["data"];
      const promiseToast = toast.loading("Please wait...", {
        position: toast.POSITION.TOP_CENTER,
      });
      const response = await store.dispatch("editReceiptsPatient", dataEditt);
      if (response.data.code == 201) {
        toast.update(promiseToast, {
          render: response.data.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "success",
          isLoading: false,
        });
        refreshPage();
        router.push("/rekap-kwitansi");
      } else {
        toast.update(promiseToast, {
          render: response.data.message,
          autoClose: true,
          closeOnClick: true,
          closeButton: true,
          type: "error",
          isLoading: false,
        });
      }
      console.log(response, "submit edit");
    };

    //TODO - Generate No Form
    const generateNoForm = (index) => {
      const patient = data.form.patient[index];
      const negaraTujuan = patient.negara_tujuan || "";
      const namaLengkap = patient.nama_lengkap || "";
      const noForm =
        (negaraTujuan.substring(0, 3).toUpperCase() || "") +
        "-" +
        (namaLengkap.substring(0, 2).toUpperCase() || "") +
        "-" +
        ("000" + (index + 1)).slice(-3);
      patient.no_form = noForm;
    };

    const generateNoFormEdit = (index) => {
      const patient = dataRekap.pasien_tkis[index];
      const negaraTujuan = patient.negara_tujuan || "";
      const namaLengkap = patient.nama_lengkap || "";
      const noForm =
        (negaraTujuan.substring(0, 3).toUpperCase() || "") +
        "-" +
        (namaLengkap.substring(0, 2).toUpperCase() || "") +
        "-" +
        ("000" + (index + 1)).slice(-3);
      patient.no_form = noForm;
      store.commit("setEditNoForm", noForm);
    };

    return {
      data,
      addPatient,
      deletePatient,
      totalDaftar,
      totalHarga,
      submitPatient,
      inputTotalPembayaran,
      inputTotalPembayaranPasien,
      sisa,
      refreshPage,
      isDisabled,
      dataRekap,
      editForm,
      toggleEdit,
      deletePatientRekap,
      generateNoForm,
      generateNoFormEdit,
      rekapitulasi,
      totalRekap,
      editTotalPembayaran,
      sisaRekap,
      addRekapPatient,
      editNamaPj,
      editNamaSponsor,
      editJk,
      editUsia,
      submitEdit,
      dataEdit,
      togglePembayaran,
      enablePembayaran,
      currentDate,
      targetDate,
      isPassedDay,
    };
  },
};
</script>

<template>
  <!-- SECTION - Edit Kuitansi -->
  <form @submit.prevent="submitEdit" v-if="dataRekap.status === true" class="h-full flex flex-col">
    <div v-if="sisaRekap === '0'"
      class="absolute left-1/2 -translate-x-1/2 top-1/2 transform rotate-45 text-red-600/20 -translate-y-1/2 text-[130px] font-semibold">
      LUNAS
    </div>
    <header class="w-full py-6">
      <div class="flex justify-between w-full font-poppins items-center">
        <div>
          <h1 class="font-semibold text-[35px]">Kwitansi Pasien TKI</h1>
          <p class="mt-1">
            Isikan data<span class="text-[#0075FF] font-semibold"> Pasien-TKI</span>
            dengan benar !!
          </p>
        </div>
        <div class="flex gap-5">
          <button @click="refreshPage" type="button"
            class="btn-refresh bg-[#00AD8F] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
            <IconRefresh></IconRefresh>
          </button>
          <button type="submit"
            class="bg-[#0075FF] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
            <img src="../../components/icons/save.png" class="w-6 text-white" style="filter: invert(100%)" alt="" />
          </button>
          <ProfileInfo></ProfileInfo>
        </div>
      </div>
    </header>

    <main v-if="dataRekap.status === true" class="flex flex-col flex-grow overflow-auto">
      <h1 class="font-semibold text-[23px] mb-5">Anda Sedang Melakukan Edit Kwitansi</h1>
      <section class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-4 gap-y-3">
          <label class="self-center" for="date">Tanggal Medikal</label>
          <input :disabled="sisaRekap === '0'" v-model="dataRekap.tanggal"
            class="col-span-1 border border-gray-400 px-[14px] py-[10px] rounded-md" type="date" id="date"
            name="date" />

          <div class="col-span-2 flex justify-end gap-5">
            <label class="w-fit self-center place-self-end" for="no-pen">No. Pendaftaran</label>
            <div id="no-pen" class="items-center self-center border border-gray-400 px-[14px] py-[10px] rounded-md"
              v-html="dataRekap.no_pendaftaran" />
          </div>

          <label class="w-[200px] self-center" for="nama-pj-tki">Nama PJ-TKI</label>
          <input :disabled="sisaRekap === '0'" v-model="dataRekap.nama_penanggungjawab"
            @input="editNamaPj($event.target.value)"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="nama-pj-tki"
            name="nama-pj-tki" placeholder="Masukan Nama" />

          <label class="w-[200px] self-center" for="sponsor">Nama Sponsor</label>
          <input :disabled="sisaRekap === '0'" v-model="dataRekap.nama_sponsor"
            @input="editNamaSponsor($event.target.value)"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="sponsor"
            name="sponsor" placeholder="Masukan Nama" />

          <label class="w-[200px] self-center" for="keterangan">Keterangan</label>
          <input :disabled="sisaRekap === '0'" v-model="dataRekap.keterangan"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="keterangan"
            name="keterangan" placeholder="Tuliskan Keterangan" />
        </div>

        <aside class="grid grid-cols-1 gap-y-3">
          <ul class="grid grid-cols-1 gap-y-3">
            <li class="flex w-full">
              <p class="w-[200px] self-center">Total Daftar</p>
              <p class="w-full bg-black px-[25px] rounded-md py-[10px] text-white">
                {{ dataRekap.total_pendaftar }} Orang
              </p>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Total Harga</p>
              <p class="w-full bg-[#0075FF] rounded-md px-[25px] py-[10px] text-white">
                {{ totalRekap }}
              </p>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Pembayaran</p>
              <div class="w-full bg-[#71CDBD] rounded-md px-[25px] py-[10px] text-white flex gap-2">
                <label for="totalPembayaran" class="self-center">Rp</label>
                <!-- //FIXME  -->
                <input :disabled="sisaRekap === '0' && !enablePembayaran" name="totalPembayaran"
                  v-model="dataRekap.total_pembayaran" @input="inputTotalPembayaran"
                  class="bg-[#71CDBD] w-full outline-none pembayaran" placeholder="Masukan Total Pembayaran" />
                <button v-if="sisaRekap === '0' && !isPassedDay" @click="togglePembayaran" type="button" :class="{
                  'bg-[#FFB800] hover:bg-[#daae42]': !enablePembayaran,
                  'bg-[#00AD8F] hover:bg-[#059078]': enablePembayaran,
                }" class="transition-colors p-2 w-[50px] flex justify-center items-center rounded-md">
                  <IconCeklist v-if="enablePembayaran" />
                  <IconEdit v-else />
                </button>
              </div>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Sisa</p>
              <p class="w-full bg-[#F00000] rounded-md px-[25px] py-[10px] text-white">
                Rp {{ sisaRekap }}
              </p>
            </li>
          </ul>
        </aside>
      </section>

      <!-- ANCHOR Table  -->
      <section class="w-full mt-10 table-content flex flex-col gap-2 h-full overflow-auto">
        <div class="thead bg-[#E3E3E3] text-[#888888] rounded-md p-4">
          <ul class="flex justify-around">
            <li class="w-10 border">No</li>
            <li class="w-[150px] border">No. Form</li>
            <li class="w-[180px] border px-3">Negara Tujuan</li>
            <li class="w-[250px] border px-3">Nama Lengkap</li>
            <li class="w-[70px] border px-3">Usia</li>
            <li class="w-[150px] border px-3">Jenis Kelamin</li>
            <li class="w-[120px] border px-3">Harga</li>
            <div class="flex flex-row">
              <div class="w-[50px]">Edit</div>
              <div class="w-[50px]">Delete</div>
            </div>
          </ul>
        </div>

        <!-- ANCHOR - From -->
        <div class="flex flex-col gap-2 h-full flex-grow overflow-y-auto rounded-lg">
          <div v-for="(patient, index) in dataRekap.pasien_tkis" :key="patient" :class="{
            'border-[#00AD8F] bg-[#E4F5F2]': editForm[index],
            'border-[#A2A2A2]': !editForm[index],
          }" class="tbody px-4 rounded-md border transition-colors duration-200">
            <ul class="tbody flex justify-around text-base">
              <!-- //ANCHOR - Number -->
              <li class="self-center w-10 max-w-10">{{ index + 1 }}</li>

              <!-- //ANCHOR - No Form -->
              <li class="self-center w-[150px]">
                <div v-html="dataRekap.pasien_tkis[index].no_form" class="w-full" placeholder="Terisi Otomatis..." />
              </li>

              <!-- ANCHOR - Negara Tujuan -->
              <li class="self-center w-[180px]">
                <input :readonly="!editForm[index]" :disabled="!editForm[index]"
                  v-model="dataRekap.pasien_tkis[index].negara_tujuan" @input="generateNoFormEdit(index)" type="text"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-transparent focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  placeholder="Negara Tujuan" />
              </li>

              <!-- ANCHOR - Nama Lengkap -->
              <li class="self-center w-[250px]">
                <input v-model="dataRekap.pasien_tkis[index].nama_lengkap" :readonly="!editForm[index]"
                  :disabled="!editForm[index]" @input="generateNoFormEdit(index)"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-transparent focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  type="text" placeholder="Nama Lengkap" />
              </li>

              <!-- ANCHOR - Usia -->
              <li class="self-center w-[70px]">
                <input v-model="dataRekap.pasien_tkis[index].usia" :readonly="!editForm[index]"
                  :disabled="!editForm[index]" @input="editUsia(index, $event.target.value)"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-transparent focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  type="number" min="0" max="99" placeholder="Usia" />
              </li>

              <!-- ANCHOR - Jenis Kelamin -->
              <li class="self-center w-[150px]">
                <select v-model="dataRekap.pasien_tkis[index].jenis_kelamin" :readonly="!editForm[index]"
                  :disabled="!editForm[index]" @input="editJk(index, $event.target.value)"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-transparent focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none">
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </li>

              <!-- ANCHOR - Harga -->
              <li class="self-center w-[120px]">
                <input v-model="dataRekap.pasien_tkis[index].harga" :readonly="!editForm[index]"
                  :disabled="!editForm[index]" @input="editTotalPembayaran" type="number" min="0" max="999999999999"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-transparent focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  placeholder="Harga" />
              </li>
              <div class="flex flex-row justify-self-end">
                <button type="button" :disabled="sisaRekap === '0'" @click="toggleEdit(index)" :class="{
                  'bg-[#FFB800] hover:bg-[#daae42]': !editForm[index],
                  'bg-[#00AD8F] hover:bg-[#059078]': editForm[index],
                  'bg-gray-300 cursor-not-allowed hover:bg-gray-500': sisaRekap === '0',
                }" class="transition-colors p-2 w-[50px] flex justify-center items-center">
                  <IconCeklist v-if="editForm[index]" />
                  <IconEdit v-else />
                </button>

                <button @click="deletePatientRekap(patient)" :disabled="sisaRekap === '0'" :class="{
                  'bg-gray-300 cursor-not-allowed hover:bg-gray-500': sisaRekap === '0',
                }"
                  class="bg-[#F00000] hover:bg-red-800 transition-colors p-2 w-[50px] flex justify-center items-center">
                  <IconTrash></IconTrash>
                </button>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </form>

  <!-- SECTION - Create Kuitansi Pasien -->
  <form @submit.prevent="submitPatient" v-else class="h-full flex flex-col">
    <header class="w-full py-6">
      <div class="flex justify-between w-full font-poppins items-center">
        <div>
          <h1 class="font-semibold text-[35px]">Kwitansi Pasien TKI</h1>
          <p class="mt-1">
            Isikan data<span class="text-[#0075FF] font-semibold"> Pasien-TKI</span>
            dengan benar !!
          </p>
        </div>

        <div class="flex gap-5">
          <button @click="refreshPage" type="button"
            class="btn-refresh bg-[#00AD8F] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
            <IconRefresh></IconRefresh>
          </button>
          <button type="submit"
            class="bg-[#0075FF] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
            <img src="../../components/icons/save.png" class="w-6 text-white" style="filter: invert(100%)" alt="" />
          </button>
          <ProfileInfo></ProfileInfo>
        </div>
      </div>
    </header>

    <main class="flex flex-col flex-grow overflow-auto">
      <section class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-4 gap-y-3">
          <label class="self-center" for="date">Tanggal Medikal</label>
          <input v-model="data.form.receipt.tanggal"
            class="col-span-1 border border-gray-400 px-[14px] py-[10px] rounded-md" type="date" id="date"
            name="date" />

          <div class="col-span-2 flex justify-end gap-5">
            <label class="self-center place-self-end" for="no-pen">No. Pendaftaran
            </label>
            <div id="no-pen" class="items-center self-center border border-gray-400 px-[14px] py-[10px] rounded-md"
              v-html="data.form.receipt.no_pendaftaran" />
          </div>

          <label class="w-[200px] self-center" for="nama-pj-tki">Nama PJ-TKI</label>
          <input v-model="data.form.receipt.nama_penanggungjawab"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="nama-pj-tki"
            name="nama-pj-tki" placeholder="Masukan Nama" />

          <label class="w-[200px] self-center" for="sponsor">Nama Sponsor</label>
          <input v-model="data.form.receipt.nama_sponsor"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="sponsor"
            name="sponsor" placeholder="Masukan Nama" />

          <label class="w-[200px] self-center" for="keterangan">Keterangan</label>
          <input v-model="data.form.receipt.keterangan"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text" id="keterangan"
            name="keterangan" placeholder="Tuliskan Keterangan" />
        </div>

        <aside class="grid grid-cols-1 gap-y-3">
          <ul class="grid grid-cols-1 gap-y-3">
            <li class="flex w-full">
              <p class="w-[200px] self-center">Total Daftar</p>
              <p class="w-full bg-black px-[25px] rounded-md py-[10px] text-white">
                {{ totalDaftar }} Orang
              </p>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Total Harga</p>
              <p class="w-full bg-[#0075FF] rounded-md px-[25px] py-[10px] text-white">
                {{ totalHarga }}
              </p>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Pembayaran</p>
              <div class="w-full bg-[#71CDBD] rounded-md px-[25px] py-[10px] text-white flex gap-2">
                <label for="totalPembayaran">Rp</label>
                <input name="totalPembayaran" v-model="data.form.receipt.total_pembayaran" @input="inputTotalPembayaran"
                  class="bg-[#71CDBD] w-full outline-none pembayaran" placeholder="Masukan Total Pembayaran" />
              </div>
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Sisa</p>
              <p class="w-full bg-[#F00000] rounded-md px-[25px] py-[10px] text-white">
                Rp {{ sisa }}
              </p>
            </li>
          </ul>
        </aside>
      </section>

      <!-- //ANCHOR Table  -->
      <section class="w-full mt-10 table-content flex flex-col gap-2 h-full overflow-auto">
        <div class="thead bg-[#E3E3E3] text-[#888888] rounded-md p-4">
          <ul class="flex justify-around">
            <li class="w-10 border">No</li>
            <li class="w-[150px] border">No. Form</li>
            <li class="w-[180px] border ps-3">Negara Tujuan</li>
            <li class="w-[250px] border ps-3">Nama Lengkap</li>
            <li class="w-[70px] border ps-3">Usia</li>
            <li class="w-[150px] border ps-3">Jenis Kelamin</li>
            <li class="w-[120px] border ps-3">Harga</li>
            <div class="flex flex-row">
              <div class="w-[50px]">Edit</div>
              <div class="w-[50px]">Delete</div>
            </div>
          </ul>
        </div>

        <!-- //ANCHOR - From -->
        <div class="flex flex-col gap-2 h-full flex-grow overflow-y-auto rounded-lg">
          <div v-for="(patient, index) in data.form.patient" :key="patient"
            class="tbody px-4 rounded-md border border-[#A2A2A2]">
            <ul class="tbody flex justify-around text-base">
              <!-- //ANCHOR - Number -->
              <li class="self-center w-10 max-w-10">{{ index + 1 }}</li>

              <!-- //ANCHOR - No Form -->
              <li class="self-center w-[150px]">
                <div v-html="!data.form.patient[index].no_form
                  ? 'Terisi Otomatis...'
                  : data.form.patient[index].no_form
                  " class="w-full" />
              </li>

              <!-- //ANCHOR - Negara Tujuan -->
              <li class="self-center w-[180px]">
                <input v-model="data.form.patient[index].negara_tujuan" type="text"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  placeholder="Negara Tujuan" @input="generateNoForm(index)" />
              </li>

              <!-- //ANCHOR - Nama Lengkap -->
              <li class="self-center w-[250px]">
                <input v-model="data.form.patient[index].nama_lengkap" type="text"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  placeholder="Nama Lengkap" @input="generateNoForm(index)" />
              </li>

              <!-- //ANCHOR - Usia -->
              <li class="self-center w-[70px]">
                <input v-model="data.form.patient[index].usia"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  type="number" placeholder="Usia" min="0" max="99" />
              </li>

              <!-- //ANCHOR - Jenis Kelamin -->
              <li class="self-center w-[150px]">
                <select v-model="data.form.patient[index].jenis_kelamin"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] bg-white focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none">
                  <option value="" disabled>Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </li>

              <!-- //ANCHOR - Harga -->
              <li class="self-center w-[120px]">
                <input v-model="data.form.patient[index].harga" @input="inputTotalPembayaranPasien" type="number"
                  min="0" max="999999999999"
                  class="w-full px-3 py-3 focus:outline-[#A2A2A2] focus:outline-offset-0 focus:outline-1 focus:bg-gray-50 focus:outline-none"
                  placeholder="Harga" />
              </li>

              <div class="flex flex-row justify-self-end">
                <button :class="{
                  'bg-[#FFB800] ': !isDisabled,
                  'bg-[#969696] hover:bg-gray-500': isDisabled,
                }" class="p-2 w-[50px] flex justify-center items-center transition-colors" :disabled="isDisabled">
                  <IconEdit></IconEdit>
                </button>

                <button @click="deletePatient(patient)"
                  class="bg-[#F00000] hover:bg-red-800 transition-colors p-2 w-[50px] flex justify-center items-center">
                  <IconTrash></IconTrash>
                </button>
              </div>
            </ul>
          </div>
        </div>
        <button @click="addPatient" type="button"
          class="border border-dashed border-gray-400 mt-5 py-3 rounded-md w-full flex justify-center">
          <IconPlus></IconPlus> Tambah Data
        </button>
      </section>
    </main>
  </form>
</template>

<style scoped>
.pembayaran::placeholder {
  color: white;
}
</style>
