<script>
import CetakKuitansi from "./icons/CetakKuitansi.vue";
import CloseIcon from "./icons/CloseIcon.vue";

export default {
  name: "ModalBase",
  components: { CloseIcon, CetakKuitansi },
  props: { tooglePopUp: Boolean, showPrintButton: Boolean },
  setup() {
    const printModal = () => {
      window.print();
    };
    return { printModal };
  },
};
</script>

<template>
  <div
    class="kwitansi fixed inset-0 flex justify-center bg-[#000000] bg-opacity-50 z-50 overflow-y-auto"
  >
    <div class="fixed top-0 bottom-0 left-0 right-0" @click="$emit('close-modal')" />
    <main
      class="w-[750px] h-[90%] relative flex flex-col rounded-xl overflow-hidden bg-white self-center transition duration-150 ease-in-out"
    >
      <section class="flex justify-between p-6 w-full border-b-2">
        <slot name="header" />
        <div class="flex gap-3">
          <button
          v-if="showPrintButton"
          @click="printModal"
          class="bg-[#0075FF] p-[17px] rounded-lg"
          >
          <CetakKuitansi></CetakKuitansi>
        </button>
        <button @click="tooglePopUp()" class="bg-[#F00000] p-[17px] rounded-lg">
          <CloseIcon></CloseIcon>
        </button>
        </div>
      </section>

      <section class="bg-slate-300 p-6 overflow-y-auto">
        <div>
          <slot name="banner"></slot>
        </div>
        <slot name="main"></slot>
      </section>
    </main>
  </div>
</template>
<style scope="this api replaced by slot-scope in 2.5.0+">
@media print {
  @page {
    font-size: 20pt;
  }
}
</style>
