import { defineStore } from "pinia";
const SETTINGS_LOCAL_STORAGE_KEY = "datalist";
const STORE_NAME = "data";

const getDefaultSettings = () => ({
  customers: getCustomers(),
  items: getItems(),
});

export const useStore = defineStore(STORE_NAME, {
  state: () => ({
    dataList: getDefaultSettings(),
  }),
  actions: {
    updateDataList(partialSettings) {
      this.dataList = {
        ...this.dataList,
        ...partialSettings,
      };

      localStorage.setItem(STORE_NAME, JSON.stringify(this.dataList));
    },
  },
});

const getCustomers = () => {
  const customers = localStorage.getItem(STORE_NAME);

  const customer = customers ? JSON.parse(customers)?.customers : [];
  return customer;
};

const getItems = () => {
  const items = localStorage.getItem(STORE_NAME);

  const item = items ? JSON.parse(items)?.items : [];
  return item;
};
