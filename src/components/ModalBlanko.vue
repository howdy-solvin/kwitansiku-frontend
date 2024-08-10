<script>
import CetakKuitansi from './icons/CetakKuitansi.vue'
import CloseIcon from './icons/CloseIcon.vue'
import { ref } from 'vue'

export default {
  name: 'ModalBlanko',
  components: { CloseIcon, CetakKuitansi },
  props: {
    togglePopUp: Boolean,
    showPrintButton: Boolean
  },
  setup() {
    const blankoSection = ref(null)

    const printModal = () => {
      blankoSection.value.classList.add('enable-print-view')
      window.print()
    }
    return { printModal, blankoSection }
  }
}
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
          <button @click="togglePopUp()" class="bg-[#F00000] p-[17px] rounded-lg">
            <CloseIcon></CloseIcon>
          </button>
        </div>
      </section>
      <section class="overflow-y-auto flex flex-col gap-4">
        <div class="bg-slate-300 p-6 relative" ref="blankoSection" id="blanko-section">
          <slot name="banner" />
          <slot name="main" />
        </div>
      </section>
    </main>
  </div>
</template>
<style scoped>
@media print {
  html,
  body {
    height: 100%;
    overflow: hidden;
    visibility: hidden;
    font-size: 12px;
  }

  @page {
    size: 21.7cm 13.8cm portrait;
    margin: 0 0 !important;
  }

  .print-view {
    width: 100vw;
    height: 100%;
    margin: 0 3%;
  }

  .enable-print-view {
    visibility: visible !important;
  }

  #blanko-section {
    width: 100%;
    display: block;
    /* height: 100%; */
    /* visibility: hidden !important; */
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
