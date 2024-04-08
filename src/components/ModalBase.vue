<script>
import CetakKuitansi from "./icons/CetakKuitansi.vue";
import CloseIcon from "./icons/CloseIcon.vue";
import { ref } from "vue";
// import { useStore } from "vuex";
// import { toast } from "vue3-toastify";
// import { useRouter } from "vue-router";

export default {
  name: "ModalBase",
  components: { CloseIcon, CetakKuitansi },
  props: {
    tooglePopUp: Boolean,
    showPrintButton: Boolean,
    showPrintDetailButton: Boolean,
  },
  setup() {
    // const store = useStore();
    // const router = useRouter();

    const kwitansiSection = ref(null); //
    const pasienSection = ref(null);
    // const printModal = () => {
    //   window.print();
    // };

    // watchEffect(() => {
    //   const dataRekap = store.getters["getterRekap"];
    //   if (dataRekap) {
    //     const pasien_tkis = dataRekap.pasien_tkis;
    //     const updatedPasien_tkis = pasien_tkis.map((item) => {
    //       // Menghindari properti yang tidak diinginkan
    //       // eslint-disable-next-line no-unused-vars
    //       const { createdAt, receipt_id, updatedAt, ...rest } = item;
    //       return rest;
    //     });
    //     store.commit("setFormEditPasien", updatedPasien_tkis);

    //     const {
    //       keterangan,
    //       nama_penanggungjawab,
    //       nama_sponsor,
    //       no_pendaftaran,
    //       tanggal,
    //       total_pembayaran,
    //     } = dataRekap;
    //     store.commit("setFormKuitansiForCetak", {
    //       keterangan,
    //       nama_penanggungjawab,
    //       nama_sponsor,
    //       no_pendaftaran,
    //       tanggal,
    //       total_pembayaran,
    //     });
    //   }
    // });

    //NOTE - metode print status true / false masih belum di butuhkan
    // const printModal = async () => {
    //   if (kwitansiSection.value) {
    //     kwitansiSection.value.classList.add("enable-print-view");
    //     pasienSection.value.classList.remove("enable-print-view");
    //     const dataEditt = store.getters["data"];
    //     const promiseToast = toast.loading("Please wait...", {
    //       position: toast.POSITION.TOP_CENTER,
    //     });
    //     const response = await store.dispatch("editReceiptsPatient", dataEditt);
    //     if (response.data.code == 201) {
    //       toast.update(promiseToast, {
    //         render: response.data.message,
    //         autoClose: true,
    //         closeOnClick: true,
    //         closeButton: true,
    //         type: "success",
    //         isLoading: false,
    //       });
    //       router.push("/rekap-kwitansi");
    //     } else {
    //       toast.update(promiseToast, {
    //         render: response.data.message,
    //         autoClose: true,
    //         closeOnClick: true,
    //         closeButton: true,
    //         type: "error",
    //         isLoading: false,
    //       });
    //     }
    //     window.print();
    //   }
    // };

    const printModal = () => {
      if (kwitansiSection.value) {
        kwitansiSection.value.classList.add("enable-print-view");
        pasienSection.value.classList.remove("enable-print-view");
        window.print();
      }
    };
    const printDetailModal = () => {
      if (pasienSection.value) {
        kwitansiSection.value.classList.remove("enable-print-view"); // Menghapus kelas 'enable-print-view' dari kwitansi-section
        pasienSection.value.classList.add("enable-print-view");
        window.print();
      }
    };
    return { printModal, kwitansiSection, pasienSection, printDetailModal };
  },
};
</script>

<template>
  <div
    class="kwitansi fixed inset-0 flex justify-center bg-[#000000] bg-opacity-50 z-50 overflow-y-auto"
  >
    <div class="fixed top-0 bottom-0 left-0 right-0" @click="$emit('close-modal')" />
    <main
      class="w-[750px] print-view h-[90%] relative flex flex-col rounded-xl overflow-hidden bg-white self-center transition duration-150 ease-in-out"
    >
      <section class="flex justify-between p-6 w-full border-b-2">
        <slot name="header" />
        <div class="flex gap-3">
          <div></div>
          <button
            v-if="showPrintButton"
            @click="printModal"
            class="bg-[#0075FF] p-[17px] rounded-lg"
          >
            <CetakKuitansi></CetakKuitansi>
          </button>
          <button
            v-if="showPrintDetailButton"
            @click="printDetailModal"
            class="bg-[#20b648] p-[17px] rounded-lg"
          >
            <CetakKuitansi></CetakKuitansi>
          </button>
          <button @click="tooglePopUp()" class="bg-[#F00000] p-[17px] rounded-lg">
            <CloseIcon></CloseIcon>
          </button>
        </div>
      </section>
      <section class="overflow-y-auto flex flex-col gap-4">
        <div
          class="bg-slate-300 p-6 relative"
          ref="kwitansiSection"
          id="kwitansi-section"
        >
          <slot name="banner" />
          <slot name="main" />
        </div>
        <div class="p-6 bg-slate-300 relative" ref="pasienSection" id="pasien-section">
          <slot name="banner" />
          <slot name="pasien" />
        </div>
      </section>
    </main>
  </div>
</template>
<style>
@media print {
  html,
  body {
    height: 100%;
    overflow: hidden;
    visibility: hidden;
    font-size: 12px;
  }

  @page {
    size: 21.7cm 13.8cm;
    margin: 0 0 !important;
  }

  #pasien {
    page-break-after: always;
    break-after: page;
    display: block;
    width: 100%;
    height: 100%;
    page-break-after: always;
    position: absolute;
    left: 0;
    top: 0;
  }

  .print-view {
    width: 100vw;
    height: 100%;
    margin: 0 3%;
  }

  .enable-print-view {
    visibility: visible !important;
  }

  #kwitansi-section {
    display: block;
    width: 100%;
    /* height: 100%; */
    page-break-after: always;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
