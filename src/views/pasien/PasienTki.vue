<script>
import ProfileInfo from "@/components/ProfileInfo.vue";
import IconCetak from "@/components/icons/IconCetak.vue";
import IconRefresh from "@/components/icons/IconRefresh.vue";
import IconPlus from "@/components/icons/IconPlus.vue";
import IconEdit from "@/components/icons/IconEdit.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import { reactive, computed } from "vue";

export default {
  components: { ProfileInfo, IconCetak, IconRefresh, IconPlus, IconEdit, IconTrash },

  setup() {
    // Gunakan ref untuk variabel totalDaftar
    const data = reactive({
      form: {
        kwitansi: {
          tanggal: "",
          id: "",
          nama_penanggungjawab: "",
          nama_sponsor: "",
          keterangan: "",
          total_pembayaran: "",
        },
        patient: [],
      },
    });

    //SECTION - Menhitung Total Daftar Pasien
    const totalDaftar = computed(() => {
      return data.form.patient.length;
    });

    //SECTION  -  Menghitung total harga dari semua pasien
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

    //SECTION - Total yang dibayarkan
    const totalPembayaran = () => {
      const mataUang = "Rp";
      let total = data.form.kwitansi.total_pembayaran.trim(); // Menghapus spasi di awal dan akhir

      // Memeriksa jika nilai input setelah dihapus adalah string kosong
      if (total === mataUang + "") {
        total = "0"; // Set nilai menjadi 0
      }

      total = total.toString().replace(/\D/g, ""); // Menghapus karakter selain angka
      data.form.kwitansi.total_pembayaran =
        "Rp " + parseInt(total, 10).toLocaleString("id-ID");
    };

    //TODO -  - Menghitung jumlah
    // Menghitung pengurangan antara total harga dan total pembayaran

    //SECTION - Menambahkan Pasien
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

    //SECTION - Menghapus Pasien
    const deletePatient = (patient) => {
      const index = data.form.patient.indexOf(patient);
      if (index !== -1) {
        data.form.patient.splice(index, 1);
      }
    };

    return {
      data,
      addPatient,
      deletePatient,
      totalDaftar,
      totalHarga,
      totalPembayaran,
      //   selisih,
    };
  },
};
</script>

<template>
  <form @submit.prevent="" class="h-full flex flex-col">
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
          <button
            class="btn-refresh bg-[#00AD8F] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]"
          >
            <IconRefresh></IconRefresh>
          </button>
          <button
            class="bg-[#0075FF] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]"
          >
            <IconCetak></IconCetak>
          </button>
          <ProfileInfo></ProfileInfo>
        </div>
      </div>
    </header>
    <main class="flex flex-col flex-grow overflow-auto">
      <section class="grid grid-cols-2 gap-3">
        <div class="grid grid-cols-4 gap-y-3">
          <label class="self-center" for="date">Tanggal Medikal</label>
          <input
            v-model="data.form.kwitansi.tanggal"
            class="col-span-1 border border-gray-400 px-[14px] py-[10px] rounded-md"
            type="date"
            id="date"
            name="date"
          />

          <div class="col-span-2 grid grid-cols-3 gap-5">
            <label class="col-span-2 w-fit self-center place-self-end" for="no-pen"
              >No. Pendaftaran</label
            >
            <input
              v-model="data.form.kwitansi.id"
              class="items-center self-center border border-gray-400 px-[14px] py-[10px] rounded-md"
              type="number"
              id="no-pen"
              name="no-pen"
              placeholder="001"
            />
          </div>

          <label class="w-[200px] self-center" for="nama-pj-tki">Nama PJ-TKI</label>
          <input
            v-model="data.form.kwitansi.nama_penanggungjawab"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md"
            type="text"
            id="nama-pj-tki"
            name="nama-pj-tki"
            placeholder="Masukan Nama"
          />

          <label class="w-[200px] self-center" for="sponsor">Nama Sponsor</label>
          <input
            v-model="data.form.kwitansi.nama_sponsor"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md"
            type="text"
            id="sponsor"
            name="sponsor"
            placeholder="Masukan Nama"
          />

          <label class="w-[200px] self-center" for="keterangan">Keterangan</label>
          <input
            v-model="data.form.kwitansi.keterangan"
            class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md"
            type="text"
            id="keterangan"
            name="keterangan"
            placeholder="Tuliskan Keterangan"
          />
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
              <input
                v-model="data.form.kwitansi.total_pembayaran"
                @input="totalPembayaran('kwitansi.total_pembayaran')"
                class="w-full bg-[#71CDBD] rounded-md px-[25px] py-[10px] text-white pembayaran"
                placeholder="Masukan Total Pembayaran"
              />
            </li>
            <li class="flex w-full justify-between white">
              <p class="w-[200px] self-center">Sisa</p>
              <p class="w-full bg-[#F00000] rounded-md px-[25px] py-[10px] text-white">
                Rp 450.000
              </p>
            </li>
          </ul>
        </aside>
      </section>

      <!-- //ANCHOR Table  -->
      <section
        class="w-full mt-10 table-content flex flex-col gap-2 h-full overflow-auto"
      >
        <div class="thead bg-[#E3E3E3] text-[#888888] rounded-md p-4">
          <ul class="flex justify-around">
            <li class="w-10 border">No</li>
            <li class="w-[150px] border">No. Form</li>
            <li class="w-[180px] border">Negara Tujuan</li>
            <li class="w-[250px] border">Nama Lengkap</li>
            <li class="w-[50px] border">Usia</li>
            <li class="w-[120px] border">Jenis Kelamin</li>
            <li class="w-[150px] border">Harga</li>
            <div class="w-[50px]">Edit</div>
            <div class="w-[50px]">Delete</div>
          </ul>
        </div>

        <!-- //ANCHOR - From -->
        <div
          class="flex flex-col gap-2 h-full flex-grow overflow-y-auto border border-gray-400 rounded-lg p-2"
        >
          <div
            v-for="(patient, index) in data.form.patient"
            :key="patient.no_form"
            class="tbody p-4 rounded-md border border-[#A2A2A2]"
          >
            <ul class="tbody flex justify-around">
              <!-- //ANCHOR - Number -->
              <li class="self-center w-10 max-w-10">{{ index + 1 }}</li>

              <!-- //ANCHOR - No Form -->
              <li class="self-center w-[150px]">
                <input
                  v-model="data.form.patient[index].no_form"
                  type="text"
                  value="H012939"
                  class="w-full"
                  placeholder="No Form"
                />
              </li>

              <!-- //ANCHOR - Negara Tujuan -->
              <li class="self-center w-[180px]">
                <input
                  v-model="data.form.patient[index].negara_tujuan"
                  type="text"
                  value="PRA-HONGKONG"
                  class="w-full"
                  placeholder="Negara Tujuan"
                />
              </li>

              <!-- //ANCHOR - Nama Lengkap -->
              <li class="self-center w-[250px]">
                <input
                  v-model="data.form.patient[index].nama_lengkap"
                  type="text"
                  value="M SARIPUDIN"
                  class="w-full"
                  placeholder="Nama Lengkap"
                />
              </li>

              <!-- //ANCHOR - Usia -->
              <li class="self-center w-[50px]">
                <input
                  v-model="data.form.patient[index].usia"
                  type="text"
                  value="32"
                  class="w-full"
                  placeholder="Usia"
                />
              </li>

              <!-- //ANCHOR - Jenis Kelamin -->
              <li class="self-center w-[120px]">
                <input
                  v-model="data.form.patient[index].jenis_kelamin"
                  type="text"
                  value="M"
                  class="w-full"
                  placeholder="Jenis kelamin"
                />
              </li>

              <!-- //ANCHOR - Harga -->
              <li class="self-center w-[150px]">
                <input
                  v-model="data.form.patient[index].harga"
                  type="text"
                  value="150.000"
                  class="w-full"
                  placeholder="Harga"
                />
              </li>

              <button
                class="bg-[#FFB800] p-2 w-[50px] flex justify-center items-center rounded-md"
              >
                <IconEdit></IconEdit>
              </button>

              <button
                @click="deletePatient(patient)"
                class="bg-[#F00000] p-2 w-[50px] flex justify-center items-center rounded-md"
              >
                <IconTrash></IconTrash>
              </button>
            </ul>
          </div>
        </div>
        <button
          @click="addPatient"
          type="button"
          class="border border-dashed border-gray-400 mt-5 py-3 rounded-md w-full flex justify-center"
        >
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
