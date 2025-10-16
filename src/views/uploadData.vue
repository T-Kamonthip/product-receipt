<template>
  <div>
    <div class="card-upload mt-3 p-3">
      <span class="fontsize-h3 font-weight-600 font-info"
        ><i class="pi pi-id-card mr-3" style="font-size: 1.5rem"></i
        >ข้อมูลคู่ค้า</span
      >
      <div class="mt-3">
        <FileUpload
          ref="customerUpload"
          mode="basic"
          name="customerUpload[]"
          url="/api/upload"
          accept=".xls, .xlsx"
          @select="onUploadCustomer($event)"
        />
        <i
          v-if="isUploadCustomerDone"
          class="pi pi-check ml-3"
          style="font-size: 1.5rem; color: green"
        ></i>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
          v-if="isUploadCustomer"
        />
      </div>
    </div>

    <div class="card-upload mt-3 p-3">
      <span class="fontsize-h3 font-weight-600 font-info"
        ><i class="pi pi-shopping-cart mr-3" style="font-size: 1.5rem"></i
        >ข้อมูลสินค้า</span
      >
      <div class="mt-3">
        <FileUpload
          ref="customerUpload"
          mode="basic"
          name="customerUpload[]"
          url="/api/upload"
          accept=".xls, .xlsx"
          @select="onUploadItem($event)"
        />
        <i
          v-if="isUploadItemDone"
          class="pi pi-check ml-3"
          style="font-size: 1.5rem; color: green"
        ></i>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
          v-if="isUploadItem"
        />
      </div>
    </div>

    <div class="card-upload mt-3 p-3">
      <span class="fontsize-h3 font-weight-600 font-info"
        ><i class="pi pi-shopping-cart mr-3" style="font-size: 1.5rem"></i
        >ข้อมูลรายการซื้อขาย</span
      >
      <div class="mt-3">
        <FileUpload
          ref="customerUpload"
          mode="basic"
          name="customerUpload[]"
          url="/api/upload"
          accept=".xls, .xlsx"
          @select="onUploadPurchase($event)"
        />
        <i
          v-if="isUploadPurchaseDone"
          class="pi pi-check ml-3"
          style="font-size: 1.5rem; color: green"
        ></i>
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
          v-if="isUploadPurchase"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import readXlsxFile from "read-excel-file";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/index";
import { db } from "@/stores/db.js";

const store = useStore();
const { dataList } = storeToRefs(store);

const customersList = ref([]);
const customerUpload = ref();

const isUploadCustomer = ref(false);
const isUploadCustomerDone = ref(false);
const isUploadItem = ref(false);
const isUploadItemDone = ref(false);
const isUploadPurchase = ref(false);
const isUploadPurchaseDone = ref(false);

// const getCustomerList = () => {
//   customersList.value = [...dataList.value?.customers] || [];
// };

const onUploadCustomer = (file) => {
  // console.log("file > ", file.files[0]);
  if (file.files[0]) {
    isUploadCustomer.value = true;
    isUploadCustomerDone.value = false;

    readXlsxFile(file.files[0]).then((rows) => {
      // console.log("row > ", rows);
      let customers = [];
      rows.forEach((row) => {
        customers.push({
          code: row[0],
          customer: row[1],
          address: row[2],
          tel: row[3],
          car: row[4],
        });
      });

      store.updateDataList({
        customers: (dataList.value.customers = customers),
      });

      isUploadCustomer.value = false;
      isUploadCustomerDone.value = true;
    });
  }
};

const onUploadItem = (file) => {
  if (file.files[0]) {
    isUploadItem.value = true;
    isUploadItemDone.value = false;
    readXlsxFile(file.files[0]).then((rows) => {
      // console.log("row > ", rows);
      let items = [];
      rows.forEach((row) => {
        items.push({
          code: row[0],
          name: row[1],
          itemShow: `${row[0]} - ${row[1]}`,
        });
      });
      store.updateDataList({
        items: (dataList.value.items = items),
      });
      isUploadItem.value = false;
      isUploadItemDone.value = true;
    });
  }
};

const onUploadPurchase = (file) => {
  if (file.files[0]) {
    isUploadPurchase.value = true;
    isUploadPurchaseDone.value = false;
    readXlsxFile(file.files[0]).then(async (rows) => {
      // console.log("row > ", rows);
      let items = {};
      let detail = [];
      let isPush = false;
      for (const row of rows) {
        if (row[2] && row[2]?.startsWith("HP")) {
          items = { code: row[2] };
          detail = [];
        }

        if (row[5] && row[5] > 0) {
          isPush = false;
          detail.push({
            code: row[6],
            name: row[7],
            itemShow: `${row[6]} - ${row[7]}`,
            mass: row[8],
            price: row[10],
            total: row[12],
            sum: row[8],
          });
        }

        if (!row[5] && !isPush) {
          isPush = true;
          items = { ...items, detail: detail };

          await db.purchase.add({
            code: items.code,
            detail: items.detail,
          });

          // console.log(`Purchase with id ${id} added to the database.`);
        }
      }

      isUploadPurchase.value = false;
      isUploadPurchaseDone.value = true;
    });
  }
};
</script>
