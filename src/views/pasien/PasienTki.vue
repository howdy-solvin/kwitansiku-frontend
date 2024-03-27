<script setup>
import ProfileInfo from '@/components/ProfileInfo.vue';
import IconCetak from '@/components/icons/IconCetak.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import IconPlus from '@/components/icons/IconPlus.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue'
</script>
<template>
    <header class="w-full py-6">
        <div class="flex justify-between w-full font-poppins items-center">
            <div>
                <h1 class="font-semibold text-[35px]">Kwitansi Pasien TKI</h1>
                <p class="mt-1">Isikan data<span class="text-[#0075FF] font-semibold"> Pasien-TKI</span>
                    dengan benar !!
                </p>
            </div>
            <div class="flex gap-5">
                <button
                    class="btn-refresh bg-[#00AD8F] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
                    <IconRefresh></IconRefresh>
                </button>
                <button
                    class=" bg-[#0075FF] py-[21px] px-[27px] rounded-md shadow-[inset_0_-5px_10px_5px_rgba(100,100,100,0.3)]">
                    <IconCetak></IconCetak>
                </button>
                <ProfileInfo></ProfileInfo>
            </div>
        </div>
    </header>
    <main>
        <div class="grid grid-cols-2 gap-3 ">
            <form action="" class="grid grid-cols-4 gap-y-3">
                <label class=" self-center" for="date">Masukan Medikal</label>
                <input class="col-span-1 border border-gray-400 px-[14px] py-[10px] rounded-md" type="date" id="date"
                    name="date">

                <div class="col-span-2 grid grid-cols-3 gap-5">
                    <label class="col-span-2 w-fit self-center place-self-end" for="no-pen">No. Pendaftaran</label>
                    <input class="items-center self-center border border-gray-400 px-[14px] py-[10px] rounded-md"
                        type="number" id="no-pen" name="no-pen" placeholder="001">
                </div>

                <label class="w-[200px] self-center" for="nama-pj-tki">Nama PJ-TKI</label>
                <input class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text"
                    id="nama-pj-tki" name="nama-pj-tki" placeholder="Masukan Nama">

                <label class="w-[200px] self-center" for="sponsor">Nama Sponsor</label>
                <input class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text"
                    id="sponsor" name="sponsor" placeholder="Masukan Nama">

                <label class="w-[200px] self-center" for="keterangan">Keterangan</label>
                <input class="col-span-3 border border-gray-400 px-[14px] py-[10px] w-full rounded-md" type="text"
                    id="keterangan" name="keterangan" placeholder="Tuliskan Keterangan">
            </form>

            <aside class="grid grid-cols-1 gap-y-3">
                <ul class="grid grid-cols-1 gap-y-3">
                    <li class="flex w-full ">
                        <p class="w-[200px] self-center">Total Daftar</p>
                        <p class="w-full bg-black px-[25px] rounded-md py-[10px] text-white">3 Orang</p>
                    </li>
                    <li class="flex w-full justify-between white ">
                        <p class="w-[200px] self-center">Total Harga</p>
                        <p class="w-full bg-[#0075FF] rounded-md px-[25px] py-[10px] text-white">Rp 450.000</p>
                    </li>
                    <li class="flex w-full justify-between white ">
                        <p class="w-[200px] self-center">Pembayaran</p>
                        <p class="w-full bg-[#71CDBD] rounded-md px-[25px] py-[10px] text-white">Rp 450.000</p>
                    </li>
                    <li class="flex w-full justify-between white ">
                        <p class="w-[200px] self-center">Sisa</p>
                        <p class="w-full bg-[#F00000] rounded-md px-[25px] py-[10px] text-white">Rp 450.000</p>
                    </li>
                </ul>
            </aside>
        </div>
        <table class="w-full mt-10 border-separate border border-slate-500">
            <thead class="bg-[#E3E3E3]">
                <tr>
                    <th class="border border-slate-600">No</th>
                    <th class="border border-slate-600">No. Form</th>
                    <th class="border border-slate-600">Negara Tujuan</th>
                    <th class="border border-slate-600">Nama Lengkap</th>
                    <th class="border border-slate-600">Usia</th>
                    <th class="border border-slate-600">JK</th>
                    <th class="border border-slate-600">Harga</th>
                    <th class="border border-slate-600">Edit</th>
                    <th class="border border-slate-600">Hapus</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border border-slate-600">
                    <td class="border border-slate-600">1</td>
                    <td class="border border-slate-600">H012939</td>
                    <td class="border border-slate-600">PRA-HONGKONG</td>
                    <td class="border border-slate-600">M SARIPUDIN</td>
                    <td class="border border-slate-600">32</td>
                    <td class="border border-slate-600">M</td>
                    <td class="border border-slate-600">150.000</td>
                    <td class="border border-slate-600 text-center"><Button class="bg-[#FFB800] p-2">
                            <IconEdit></IconEdit>
                        </Button></td>
                    <td class="border border-slate-600 text-center"><button class="bg-[#F00000] p-2">
                            <IconTrash></IconTrash>
                        </button></td>
                </tr>
                <tr class="border border-slate-600">
                    <td class="border border-slate-600">1</td>
                    <td class="border border-slate-600">H012939</td>
                    <td class="border border-slate-600">PRA-HONGKONG</td>
                    <td class="border border-slate-600">M SARIPUDIN</td>
                    <td class="border border-slate-600">32</td>
                    <td class="border border-slate-600">M</td>
                    <td class="border border-slate-600">150.000</td>
                    <td class="border border-slate-600 text-center"><Button class="bg-[#FFB800] p-2">
                            <IconEdit></IconEdit>
                        </Button></td>
                    <td class="border border-slate-600 text-center"><button class="bg-[#F00000] p-2">
                            <IconTrash></IconTrash>
                        </button></td>
                </tr>
                <tr class="border border-slate-600">
                    <td class="border border-slate-600">1</td>
                    <td class="border border-slate-600">H012939</td>
                    <td class="border border-slate-600">PRA-HONGKONG</td>
                    <td class="border border-slate-600">M SARIPUDIN</td>
                    <td class="border border-slate-600">32</td>
                    <td class="border border-slate-600">M</td>
                    <td class="border border-slate-600">150.000</td>
                    <td class="border border-slate-600 text-center"><Button class="bg-[#FFB800] p-2">
                            <IconEdit></IconEdit>
                        </Button></td>
                    <td class="border border-slate-600 text-center"><button class="bg-[#F00000] p-2">
                            <IconTrash></IconTrash>
                        </button></td>
                </tr>
                <tr class="border border-slate-600">
                    <td class="border border-slate-600">1</td>
                    <td class="border border-slate-600">H012939</td>
                    <td class="border border-slate-600">PRA-HONGKONG</td>
                    <td class="border border-slate-600">M SARIPUDIN</td>
                    <td class="border border-slate-600">32</td>
                    <td class="border border-slate-600">M</td>
                    <td class="border border-slate-600">150.000</td>
                    <td class="border border-slate-600 text-center"><Button class="bg-[#FFB800] p-2">
                            <IconEdit></IconEdit>
                        </Button></td>
                    <td class="border border-slate-600 text-center"><button class="bg-[#F00000] p-2">
                            <IconTrash></IconTrash>
                        </button></td>
                </tr>
                <tr class="border border-slate-600">
                    <td class="border border-slate-600">1</td>
                    <td class="border border-slate-600">H012939</td>
                    <td class="border border-slate-600">PRA-HONGKONG</td>
                    <td class="border border-slate-600">M SARIPUDIN</td>
                    <td class="border border-slate-600">32</td>
                    <td class="border border-slate-600">M</td>
                    <td class="border border-slate-600">150.000</td>
                    <td class="border border-slate-600 text-center"><Button class="bg-[#FFB800] p-2">
                            <IconEdit></IconEdit>
                        </Button></td>
                    <td class="border border-slate-600 text-center"><button class="bg-[#F00000] p-2">
                            <IconTrash></IconTrash>
                        </button></td>
                </tr>
            </tbody>
        </table>
        <button class="border border-dashed border-gray-400 mt-5 py-3 rounded-md w-full flex justify-center">
            <IconPlus></IconPlus> Tambah Data
        </button>
    </main>
</template>
