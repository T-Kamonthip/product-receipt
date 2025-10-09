<template>
  <div class="card">
    <Menubar :model="items" @click="goTo" />
  </div>
  <router-view />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const items = ref([
  {
    label: "อัพโหลดข้อมูล",
    icon: "pi pi-cloud-upload",
  },
  {
    label: "ใบรับสินค้า",
    icon: "pi pi-file-pdf",
  },
]);

const goTo = ($event) => {
  if ($event?.target?.innerText === "อัพโหลดข้อมูล") {
    router.push({ name: "upload" });
  } else if ($event?.target?.innerText === "ใบรับสินค้า") {
    router.push({ name: "receipt" });
  }
};
</script>

<style lang="scss">
.start-view {
  top: 70px;
  left: 0px;
  width: 100vw;
}
</style>
