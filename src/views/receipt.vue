<template>
  <!-- <div class="about">
    \
    <h1 class="px-5">
      <i class="pi pi-print mr-3" style="font-size: 1.5rem"></i>พิมพ์ใบรับสินค้า
    </h1>
  </div> -->
  <div class="grid mt-5">
    <div class="col-9 box-paper">
      <div ref="pdfContent" class="a4-paper">
        <div id="print-canvas" class="m-3 px-1">
          <div class="grid">
            <div class="col-6 font-header px-0">ใบรับสินค้า</div>
            <div class="col-6 font-receipt text-right font-weight-600 px-0">
              , โทร: {{ customer?.tel || "-" }}
            </div>
          </div>

          <div class="grid mt-1">
            <div class="col-7 px-0 py-1">
              <span class="font-receipt"
                ><span class="font-weight-600">เลขที่ตั๋ว:</span>
                {{ headerReceipt?.order || "-" }}</span
              >
            </div>
            <div class="col-5 px-0 text-right py-1">
              <span class="font-receipt"
                ><span class="font-weight-600">วันที่เข้า</span>
                {{ headerReceipt?.startDate || "-" }}</span
              >
            </div>
          </div>
          <div class="grid">
            <div class="col-7 px-0 py-1">
              <span class="font-receipt mr-2 font-weight-600"
                >[{{ customer?.code || "-" }}]</span
              >
              <span class="font-receipt font-weight-600">{{
                customer?.name || "-"
              }}</span>
            </div>
            <div class="col-5 px-0 text-right py-1">
              <span class="font-receipt"
                ><span class="font-weight-600">วันที่รับเงิน</span>
                {{ headerReceipt?.endDate || "-" }}</span
              >
            </div>
          </div>

          <div class="grid">
            <div class="col-7 px-0 py-1">
              <div class="font-receipt">
                {{ customer?.address }}, {{ customer?.tel }}
              </div>
            </div>
          </div>

          <div class="grid">
            <div class="col-7 px-0 py-1">
              <div class="font-receipt">
                {{ customer?.car }}
              </div>
            </div>
          </div>

          <div class="grid mt-1">
            <div class="col-12 border-line-bold px-0"></div>
          </div>

          <div class="grid">
            <div class="col-6 px-0 font-receipt">
              รายการ ({{ itemList?.length || 0 }})
            </div>
            <div class="col-1 px-0 text-right font-receipt">สุทธิ</div>
            <div class="col-3 px-0 text-right font-receipt">ราคา/หน่วย</div>
            <div class="col-2 px-0 text-right font-receipt">รวม</div>
          </div>

          <div class="grid py-1">
            <div class="col-12 border-line-normal px-0"></div>
          </div>

          <div v-if="itemList.length <= 0" class="text-center my-5">
            --- ไม่มีรายการ ---
          </div>
          <div v-if="itemList.length <= 0" class="border-line-normal"></div>
          <div
            class="grid font-receipt my-0 item-break"
            v-for="(item, i) in itemList"
            :key="`item-${i}`"
          >
            <!-- <div
              v-if="i === 12 || i === 28 || i === 44"
              class="col-12 py-6 seperate-page"
            ></div> -->
            <!-- <div class="col-12 top-line"></div> -->
            <div class="col-1 px-0 py-1">{{ i + 1 }}.</div>
            <div class="col-5 px-0 py-1">{{ item?.name }}</div>
            <div class="col-1 px-0 py-1 text-right">
              {{ toCommas(item?.mass || 0, 2) }}
            </div>
            <div class="col-3 px-0 py-1 text-right">
              {{ toCommas(item?.price || 0, 2) }}
            </div>
            <div class="col-2 px-0 py-1 text-right">
              {{ toCommas(parseFloat(item?.total || 0), 2) }}
            </div>

            <div
              v-if="!isPrinting"
              class="col-1 px-0 flex align-items-center gap-2 py-1"
            >
              <i
                class="cursor-pointer pi pi-pen-to-square font-info"
                style="font-size: 1rem"
                @click="openDialogItem('edit', item, i)"
              ></i>
              <i
                class="cursor-pointer pi pi-trash font-danger"
                style="font-size: 1rem"
                @click="delItem(i)"
              ></i>
            </div>
            <div v-else class="col-1 px-0"></div>

            <div class="col-2 px-0 py-1">
              รวม: {{ toCommas(item?.sum || 0, 2) }}
            </div>
            <div class="col-2 px-0 py-1">
              หัก: {{ toCommas(item?.minus || 0, 2) }}
            </div>
            <div class="col px-0 py-1">
              เจือปน: {{ toCommas(item?.alloy?.sum || 0, 2) }}
              <!-- <i
                v-if="item?.alloy?.detail?.length > 0"
                class="pi pi-arrow-right"
              ></i> -->
              <span
                v-if="item?.alloy?.detail?.length > 0"
                class="left-sign px-1"
                >-></span
              >
              <span v-if="item?.alloy?.detail?.length > 0">
                {{ item?.alloy?.detail?.join(", ") }}</span
              >
            </div>

            <div class="col-12 px-0 py-0 border-line-normal"></div>
          </div>

          <div class="grid font-receipt mt-1">
            <div class="col-1 px-0 py-1"></div>
            <div class="col-5 px-0 py-1">น้ำหนักสินค้าสุทธิ</div>
            <div class="col-1 px-0 py-1 text-right">
              <!-- {{ toCommas(allMass || 0, 2) }} -->
              {{ toCommas(massAll || 0, 2) }}
            </div>
          </div>
          <div class="grid font-receipt">
            <div class="col-1 px-0 py-1"></div>
            <div class="col-2 px-0 py-1">
              <!-- รวม: {{ toCommas(allSum || 0, 2) }} -->
              รวม: {{ toCommas(sumAll || 0, 2) }}
            </div>
            <div class="col-2 px-0 py-1">
              <!-- หัก: {{ toCommas(allMinus || 0, 2) }} -->
              หัก: {{ toCommas(sumMinus || 0, 2) }}
            </div>
            <div class="col px-0 py-1">
              <!-- เจือปน: {{ toCommas(allAlloy || 0, 2) }} -->
              เจือปน: {{ toCommas(sumAlloy || 0, 2) }}
            </div>
          </div>
          <div class="grid font-receipt">
            <div class="col-1 px-0 py-1"></div>
            <div class="col-11 px-0 py-1 border-line-normal"></div>
          </div>

          <div class="grid font-receipt mt-1">
            <div class="col-1 px-0 py-1"></div>
            <div class="col-5 px-0 py-1">น้ำหนักรถขนส่ง</div>
            <div class="col-1 px-0 py-1 text-right">
              {{
                toCommas(
                  parseFloat(car?.before || 0) - parseFloat(car?.after || 0),
                  2
                )
              }}
            </div>
          </div>
          <div class="grid font-receipt">
            <div class="col-1 px-0 py-1"></div>
            <div class="col-2 px-0 py-1">
              รวม: {{ toCommas(parseFloat(car?.before || 0), 2) }}
            </div>
            <div class="col-2 px-0 py-1">
              หัก: {{ toCommas(parseFloat(car?.after || 0), 2) }}
            </div>
          </div>
          <div class="grid font-receipt">
            <div class="col-12 px-0 py-1 border-line-normal"></div>
          </div>

          <div class="grid mt-1">
            <div class="col-7 px-0 py-0">
              <span class="font-receipt"
                ><span class="font-weight-600">ชั่งโดย:</span>
                {{ scaleList?.join(", ") || "-" }}</span
              >
            </div>
            <div class="col-5 px-0 text-right py-0">
              <span class="font-receipt"
                ><span class="font-weight-600">สั่งจ่ายโดย:</span>
                {{ adList?.join(", ") || "-" }}</span
              >
            </div>
          </div>

          <div class="grid">
            <div class="col-12 px-0 py-2 border-line-normal"></div>
          </div>

          <div class="grid flex align-items-center font-receipt mt-2">
            <div class="col-6 px-0 py-1">
              <span class="font-weight-600">ประเภทการชำระเงิน:</span>
              {{ paymentType === "1" ? "เงินสด" : "โอนเงิน" }}
            </div>
            <div v-if="isShowBank" class="col-6 px-0 py-1">
              <span class="font-weight-600">ธนาคาร:</span>
              {{ paymentDetail?.bank }}
            </div>
            <div v-if="isShowBank" class="col-6 px-0 py-1"></div>
            <div v-if="isShowBank" class="col-6 px-0 py-1">
              <span class="font-weight-600">สาขา:</span>
              {{ paymentDetail?.branch }}
            </div>
            <div v-if="isShowBank" class="col-6 px-0 py-1"></div>
            <div v-if="isShowBank" class="col-6 px-0 py-1">
              <span class="font-weight-600">เลขบัญชี:</span>
              {{ paymentDetail?.number }}
            </div>
            <div v-if="isShowBank" class="col-6 px-0 py-1"></div>
            <div v-if="isShowBank" class="col-6 px-0 py-1">
              <span class="font-weight-600">ชื่อบัญชี:</span>
              {{ paymentDetail?.name }}
            </div>
          </div>
          <div class="grid font-receipt">
            <div class="col-12 px-0 py-1 border-line-double"></div>
          </div>

          <div class="grid flex align-items-center font-receipt mt-1">
            <div class="col-6 px-0"></div>
            <div class="col-4 px-0 text-right">ยอดรวมก่อนเสียภาษี</div>
            <div class="col-2 px-0 text-right">
              <!-- {{ toCommas(allTotal || 0, 2) }} -->
              {{ toCommas(totalAll || 0, 2) }}
            </div>
          </div>
          <div class="grid flex align-items-center font-receipt">
            <div class="col-6"></div>
            <div class="col-4 px-0 text-right">ภาษีมูลค่าเพิ่ม (VAT 7%)</div>
            <div class="col-2 px-0 text-right">0.00</div>
          </div>
          <div class="grid flex align-items-start font-receipt">
            <div class="col-6 px-0">
              ({{ ThaiBahtText(toCommas(totalAll || 0), 2) }})
            </div>
            <div class="col-4 px-0 text-right">ยอดรวม</div>
            <div class="col-2 px-0 text-right">
              {{ toCommas(totalAll || 0, 2) }}
            </div>
          </div>

          <div
            class="grid flex align-items-center justify-content-between font-receipt mt-3"
          >
            <div>ลงชื่อ : _________________________(ผู้รับเงิน/ผู้ส่งของ)</div>
            <div>ลงชื่อ : _________________________(ผู้จ่าย)</div>
          </div>

          <div class="grid flex align-items-center font-receipt-2 mt-5">
            <div class="col-12 px-0">
              ข้าพเจ้า(ผู้ขาย)
              ขอรับรองว่าทรัพย์สินที่นำมาขายทั้งหมดนี้เป็นกรรมสิทธิ์ของข้าพเจ้าอย่างถูกต้องตามกฎหมาย
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-3 box-input">
      <ProgressSpinner
        style="width: 30px; height: 30px"
        strokeWidth="8"
        fill="transparent"
        animationDuration=".5s"
        aria-label="Custom ProgressSpinner"
        v-if="isPrinting"
      />
      <Button
        icon="pi pi-print"
        label="พิมพ์ใบรับสินค้า"
        class="mr-2 p-button-success"
        @click="printPDF()"
      ></Button>

      <Button
        icon="pi pi-refresh"
        label="ล้างข้อมูล"
        class="p-button-danger"
        @click="clearAll()"
      ></Button>
      <div>
        <div class="mt-3 fontsize-h4 font-weight-600">
          เพิ่มรายละเอียดหัวกระดาษ:
        </div>
        <div class="my-2">
          <Button
            icon="pi pi-plus"
            label="เพิ่มรายละเอียด"
            class="mr-2 p-button-info"
            @click="visibleHeader = true"
          ></Button>
        </div>
      </div>

      <div>
        <div class="mt-3 fontsize-h4 font-weight-600">
          เพิ่มรายการสินค้า (HP):
        </div>
        <!-- <div class="my-2">
          <Button
            icon="pi pi-plus"
            label="เพิ่มรายการสินค้า"
            class="mr-2 p-button-info"
            @click="openDialogItem()"
          ></Button>
        </div> -->
        <div class="my-2">
          <Button
            icon="pi pi-plus"
            label="เพิ่มรายการสินค้า"
            class="mr-2 p-button-info"
            @click="visibleHP = true"
          ></Button>
        </div>
      </div>

      <div>
        <div class="mt-3 fontsize-h4 font-weight-600">น้ำหนักรถขนส่ง:</div>
        <div class="flex align-items-center font-receipt mt-2 gap-2">
          <span>รวม: </span>
          <InputText type="text" v-model="car.before" />
        </div>
        <div class="flex align-items-center font-receipt mt-2 gap-2">
          <span>หัก: </span>
          <InputText type="text" v-model="car.after" />
        </div>
      </div>

      <div>
        <div class="mt-3 fontsize-h4 font-weight-600">ประเภทการชำระเงิน:</div>
        <div class="mt-2 font-receipt">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <RadioButton
                v-model="paymentType"
                inputId="payment2"
                name="payment"
                value="1"
                @change="changePayment()"
              />
              <label for="payment2" class="ml-2">เงินสด</label>
            </div>
            <div class="flex items-center">
              <RadioButton
                v-model="paymentType"
                inputId="payment3"
                name="payment"
                value="2"
                @change="changePayment()"
              />
              <label for="payment3" class="ml-2">โอนเงิน</label>
            </div>
          </div>
        </div>

        <div v-if="isShowBank" class="box-radius p-2 mt-2">
          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <RadioButton
                v-model="bankType"
                inputId="bankType1"
                name="bankType"
                value="1"
              />
              <label for="bankType1" class="ml-2">เลือกจากระบบ</label>
            </div>
            <div class="flex items-center">
              <RadioButton
                v-model="bankType"
                inputId="bankType2"
                name="bankType"
                value="2"
              />
              <label for="bankType2" class="ml-2">กรอกเอง</label>
            </div>
          </div>

          <div v-if="bankType == '1'">
            <Select
              v-model="paymentDetail.number"
              :options="bankOptions"
              option-label="label"
              option-value="accountNumber"
              class="w-full mt-3"
              filter
              :resetFilterOnHide="true"
              @change="mapBankAccount()"
            >
            </Select>
          </div>
          <div class="font-receipt mt-3">
            ธนาคาร:
            <div>
              <InputText
                class="w-full"
                type="text"
                v-model="paymentDetail.bank"
                :disabled="bankType == '1'"
              />
            </div>
          </div>
          <div class="mt-2 font-receipt">
            สาขา:
            <div>
              <InputText
                class="w-full"
                type="text"
                v-model="paymentDetail.branch"
                :disabled="bankType == '1'"
              />
            </div>
          </div>
          <div class="mt-2 font-receipt">
            เลขบัญชี:
            <div>
              <InputText
                class="w-full"
                type="text"
                v-model="paymentDetail.number"
                :disabled="bankType == '1'"
              />
            </div>
          </div>
          <div class="mt-2 font-receipt">
            ชื่อบัญชี:
            <div>
              <InputText
                class="w-full"
                type="text"
                v-model="paymentDetail.name"
                :disabled="bankType == '1'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dialog Header -->
  <Dialog
    v-model:visible="visibleHeader"
    modal
    header="รายละเอียดหัวกระดาษ"
    :style="{ width: '70vw' }"
  >
    <div>
      <div class="grid flex align-items-center">
        <div class="col-2 text-right">เลขที่ตั๋ว:</div>
        <div class="col-10">
          <InputText type="text" v-model="headerReceiptDialog.order" />
        </div>
      </div>
      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">วันที่เข้า:</div>
        <div class="col-4">
          <InputMask
            mask="99/99/9999"
            v-model="headerReceiptDialog.startDate"
            class="w-full"
          />
        </div>
        <div class="col-2 text-right">วันที่รับเงิน:</div>
        <div class="col-4">
          <InputMask
            mask="99/99/9999"
            v-model="headerReceiptDialog.endDate"
            class="w-full"
          />
        </div>
      </div>
      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">ชั่งโดย:</div>
        <div class="col-4">
          <!-- <InputText
            type="text"
            v-model="headerReceiptDialog.person1"
            class="w-full"
          /> -->
          <MultiSelect
            v-model="scaleList"
            :options="scalePer"
            filter
            class="w-full md:w-80"
          />
        </div>
        <div class="col-2 text-right">สั่งจ่ายโดย:</div>
        <div class="col-4">
          <!-- <InputText
            type="text"
            v-model="headerReceiptDialog.person2"
            class="w-full"
          /> -->
          <MultiSelect
            v-model="adList"
            :options="adPer"
            filter
            class="w-full md:w-80"
          />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">รหัสลูกค้า:</div>
        <div class="col-4">
          <InputGroup>
            <InputText
              type="text"
              v-model="customerDialog.code"
              class="w-full"
              @keyup.enter="searchNameCustomer()"
            />
            <Button
              icon="pi pi-search"
              severity="warn"
              @click="searchNameCustomer()"
            />
          </InputGroup>
        </div>
        <div class="col-2 text-right">ชื่อร้าน:</div>
        <div class="col-4">
          <InputText type="text" v-model="customerDialog.name" class="w-full" />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">ที่อยู่:</div>
        <div class="col-10">
          <InputText
            type="text"
            v-model="customerDialog.address"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div class="grid flex align-items-center mt-2">
      <div class="col-2 text-right">โทร:</div>
      <div class="col-10">
        <InputText type="text" v-model="customerDialog.tel" class="w-full" />
      </div>
    </div>

    <div class="grid flex align-items-center mt-2">
      <div class="col-2 text-right">รถ:</div>
      <div class="col-10">
        <div class="flex flex-wrap gap-4">
          <div class="flex items-center">
            <RadioButton
              v-model="carType"
              inputId="carType1"
              name="carType"
              value="1"
            />
            <label for="carType1" class="ml-2">เลือกจากระบบ</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              v-model="carType"
              inputId="carType2"
              name="carType"
              value="2"
            />
            <label for="carType2" class="ml-2">กรอกเอง</label>
          </div>
        </div>
      </div>
      <div class="col-2"></div>
      <div v-if="carType == 2" class="col-10">
        <InputText type="text" v-model="customerDialog.car" class="w-full" />
      </div>
      <div v-else class="col-10">
        <Select
          v-model="customerDialog.car"
          :options="carOptions"
          class="w-full"
          filter
          :resetFilterOnHide="true"
        />
      </div>
    </div>

    <div class="flex justify-content-center gap-2 mt-3">
      <Button
        type="button"
        label="ยกเลิก"
        class="p-button-danger"
        @click="visibleHeader = false"
      ></Button>
      <Button
        type="button"
        class="p-button-info"
        label="บันทึก"
        @click="saveHeader()"
      ></Button>
    </div>
  </Dialog>

  <!-- Dialog Items -->
  <Dialog
    v-model:visible="visibleItem"
    modal
    header="รายละเอียดสินค้า"
    :style="{ width: '70vw' }"
    v-on:update:visible="clearDialog()"
  >
    <div>
      <!-- {{ itemsList }} -->
      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">สินค้า:</div>
        <div class="col-4">
          <Select
            v-model="itemDialog.itemShow"
            :options="itemsList"
            optionLabel="itemShow"
            option-value="itemShow"
            class="w-full"
            filter
            :resetFilterOnHide="true"
            disabled
          />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">สุทธิ:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.mass"
            :disabled="true"
            class="w-full text-right"
          />
        </div>
        <div class="col-2 text-right">ราคา/หน่วย:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.price"
            class="w-full text-right"
            disabled
          />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">รวม:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.sum"
            class="w-full text-right"
            disabled
          />
        </div>
        <div class="col-2 text-right">หัก:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.minus"
            class="w-full text-right"
            @input="addSum()"
          />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">เจือปน:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.alloy.sum"
            class="w-full text-right"
            :disabled="true"
          />
        </div>
        <div class="col-2">
          <Button icon="pi pi-plus" @click="addAlloy()" />
        </div>
      </div>
      <div
        v-for="(al, i) in alloyDialog"
        :key="`alloy-${i}`"
        class="grid flex align-items-center mt-2"
      >
        <div class="col-2 text-right"></div>
        <div class="col-1 text-right">ปริมาณ:</div>
        <div class="col-3">
          <InputText
            type="text"
            v-model="al.amount"
            class="w-full text-right"
            @input="calAlloy()"
          />
        </div>
        <div class="col-2">
          <Select
            v-model="al.alloy"
            :options="alloyList"
            optionLabel="name"
            class="w-full"
          />
        </div>
        <div class="col-2" v-if="al?.alloy?.id === 0">
          <Select
            v-model="al.other"
            :options="itemsList"
            optionLabel="name"
            option-value="name"
            class="w-full"
            filter
            :resetFilterOnHide="true"
          />
        </div>
        <div class="col-2">
          <Button icon="pi pi-trash" severity="danger" @click="delAlloy(i)" />
        </div>
      </div>

      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">รวมทั้งสิ้น:</div>
        <div class="col-4">
          <InputText
            type="text"
            v-model="itemDialog.total"
            class="w-full text-right"
            :disabled="true"
          />
        </div>
      </div>
    </div>
    <div class="flex justify-content-center gap-2 mt-3">
      <Button
        type="button"
        class="p-button-danger"
        label="ยกเลิก"
        @click="cancelItem()"
      ></Button>
      <Button
        type="button"
        class="p-button-info"
        label="บันทึก"
        @click="saveItem()"
      ></Button>
    </div>
  </Dialog>

  <Dialog
    v-model:visible="visibleHP"
    modal
    header="รายละเอียดสินค้า"
    :style="{ width: '50vw' }"
    v-on:update:visible="clearDialog()"
  >
    <div>
      <div class="grid flex align-items-center mt-2">
        <div class="col-2 text-right">รหัส HP:</div>
        <div class="col-4">
          <InputGroup>
            <InputText
              type="text"
              v-model="HPCode"
              class="w-full"
              @keyup.enter="searchHP()"
            />
            <Button icon="pi pi-search" severity="warn" @click="searchHP()" />
          </InputGroup>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import html2pdf from "html2pdf.js";
import { toCommas } from "@/utils/convert-utils";
import { useStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import ThaiBahtText from "thai-baht-text";
import { db } from "@/stores/db.js";
import { computed } from "vue";
import { add } from "dexie";

const pdfContent = ref(null);

const store = useStore();
const { dataList } = storeToRefs(store);

const isPrinting = ref(false);

const customerList = ref([]);
const itemsList = ref([]);
const scaleList = ref([]);
const adList = ref([]);

const scalePer = ref([
  "Joy.scale",
  "Nat.scale",
  "Pai.scale",
  "Rong.scale",
  "Aui.scale",
  "Saw.scale",
]);
const adPer = ref([
  "Mint",
  "Fon",
  "Small",
  "Kit",
  "Nan",
  "Tang",
  "Noey",
  "Nim",
  "Bay",
  "Ram",
  "Nant",
]);

const headerReceipt = ref({
  order: null,
  startDate: null,
  endDate: null,
  person1: null,
  person2: null,
});

const headerReceiptDialog = ref({
  order: null,
  startDate: null,
  endDate: null,
  person1: null,
  person2: null,
});

const headerReceiptDefault = ref({
  order: null,
  startDate: null,
  endDate: null,
  person1: null,
  person2: null,
});

const customer = ref({
  code: null,
  name: null,
  address: null,
  tel: null,
  car: null,
});

const customerDialog = ref({
  code: null,
  name: null,
  address: null,
  tel: null,
  car: null,
});

const customerDefault = ref({
  code: "",
  name: "",
  address: "",
  tel: "",
  car: "",
});

const itemList = ref([]);

const itemDiaOpen = ref({});
const itemDialog = ref({
  code: null,
  name: null,
  itemShow: null,
  mass: null,
  price: null,
  total: null,
  sum: null,
  minus: null,
  alloy: {
    sum: null,
    detail: [],
  },
});

const itemDefault = ref({
  code: null,
  name: null,
  itemShow: null,
  mass: null,
  price: null,
  total: null,
  sum: null,
  minus: null,
  alloy: {
    sum: null,
    detail: [],
  },
});

const alloyList = ref([
  {
    id: 0,
    name: "หักเป็น...",
  },
  {
    id: 1,
    name: "เต๋า",
  },
  {
    id: 2,
    name: "ปุ๋ย",
  },
  {
    id: 3,
    name: "ลัง",
  },
  {
    id: 4,
    name: "ถุงพลาสติก",
  },
  {
    id: 5,
    name: "พลาสติก",
  },
  {
    id: 6,
    name: "น้ำ",
  },
  {
    id: 7,
    name: "เหล็กทิ้ง",
  },
  {
    id: 8,
    name: "หักคืน",
  },
  {
    id: 8,
    name: "หักเป็นสินค้าอื่น",
  },
  {
    id: 9,
    name: "หักเปอร์เซ็นต์",
  },
  {
    id: 10,
    name: "ขยะ+ฝุ่นดิน",
  },
  {
    id: 11,
    name: "สี",
  },
  {
    id: 12,
    name: "สติ๊กเกอร์",
  },
  {
    id: 13,
    name: "น้ำมัน",
  },
  {
    id: 14,
    name: "กระดาษ",
  },
]);

const alloyDialog = ref([]);

const alloyDiaOpen = ref({});
const alloyDetailDefault = ref({
  amount: null,
  alloy: null,
  other: null,
});
const alloySumOpen = ref(0);

const HPCode = ref("");
const visibleHeader = ref(false);
const visibleItem = ref(false);
const visibleHP = ref(false);
const paymentType = ref("1");
const isShowBank = ref(false);
const paymentDetail = ref({
  bank: null,
  branch: null,
  number: null,
  name: null,
});
const car = ref({
  before: null,
  after: null,
});
const carType = ref("1");
const bankType = ref("1");
const editIndex = ref();
const modeDialog = ref("add");
const bankOptions = ref([]);
const allMass = ref();
const allSum = ref();
const allTotal = ref();
const allMinus = ref();
const allAlloy = ref();
const carOptions = ref([]);

onMounted(async () => {
  customerList.value = [...dataList.value?.customers] || [];
  itemsList.value = [...dataList.value?.items] || [];

  // const purchase = await db.purchase.where("code").equals("HP680103001").first();

  // console.log("purchase >>> ", purchase);
});

const openDialogItem = (mode = "add", item = null, index = null) => {
  if (mode === "add") {
    itemDialog.value = { ...itemDefault.value };
    itemDialog.value.alloy.sum = 0;

    alloyDialog.value = [];

    modeDialog.value = "add";

    visibleItem.value = true;
  } else {
    // console.log("item >>> ", item);
    // console.log("itemDialog >>> ", itemDialog.value);
    // console.log("alloyDialog >>> ", alloyDialog.value);

    console.log("item >>> ", item);
    itemDialog.value = { ...item };
    alloyDialog.value = item?.alloy?.detailList || [];

    itemDiaOpen.value = { ...item };
    alloyDiaOpen.value = item?.alloy?.detailList || [];
    alloySumOpen.value = item?.alloy?.sum || 0;

    editIndex.value = index;
    modeDialog.value = "edit";

    visibleItem.value = true;
  }
};

const clearDialog = () => {
  console.log("clearDialog >>> ");
  itemDialog.value = { ...itemDefault.value };
  alloyDialog.value = [];
  itemDialog.value.alloy.sum = 0;

  editIndex.value = null;
  modeDialog.value = "add";

  visibleItem.value = false;
};

const cancelItem = () => {
  console.log("cancelItem >>> ");
  itemDialog.value = { ...itemDefault.value };
  alloyDialog.value = [];
  itemDialog.value.alloy.sum = 0;

  // alloyDialog.value = [];
  itemList.value[editIndex.value] = { ...itemDiaOpen.value };
  itemList.value[editIndex.value].alloy.detailList = [...alloyDiaOpen.value];
  itemList.value[editIndex.value].alloy.sum = alloySumOpen.value;

  editIndex.value = null;
  modeDialog.value = "add";

  visibleItem.value = false;
};

const saveHeader = () => {
  headerReceipt.value = { ...headerReceiptDialog.value };
  customer.value = { ...customerDialog.value };
  visibleHeader.value = false;
  // Search for Bank
  if (customer.value?.code) {
    db.bank
      .where("cusCode")
      .equals(customer.value?.code)
      .toArray()
      .then((b) => {
        if (b) {
          // console.log("bank >>> ", b);
          bankOptions.value = b.map((m) => {
            return {
              ...m,
              label: `${m.accountNumber} (${m.bankOwner})`,
            };
          });
        }
      });
  }
};

const saveItem = () => {
  console.log("saveItem >>> ");
  const detail = [];
  alloyDialog.value.forEach((ad) => {
    if (ad?.alloy?.id === 0) {
      detail.push(
        `${toCommas(parseFloat(ad?.amount || 0), 2)} (หักเป็น${ad?.other})`
      );
    } else {
      detail.push(
        `${toCommas(parseFloat(ad?.amount || 0), 2)} (${ad?.alloy?.name})`
      );
    }
  });

  if (modeDialog.value === "add") {
    itemList.value.push({
      ...itemDialog.value,
      name: itemDialog.value?.name,
      mass: parseFloat(itemDialog.value?.mass || 0),
      total: itemDialog.value?.total,
      sum: parseFloat(itemDialog.value?.sum || 0),
      minus: parseFloat(itemDialog.value?.minus || 0),
      price: parseFloat(itemDialog.value?.price || 0),
      alloy: {
        sum: itemDialog?.value?.alloy?.sum,
        detailList: alloyDialog.value?.map((m) => {
          return { ...m };
        }),
        detail: detail,
      },
    });
  } else {
    itemList.value[editIndex.value] = {
      ...itemDialog.value,
      name: itemDialog.value?.name,
      mass: parseFloat(itemDialog.value?.mass || 0),
      total: itemDialog.value?.total,
      sum: parseFloat(itemDialog.value?.sum || 0),
      minus: parseFloat(itemDialog.value?.minus || 0),
      price: parseFloat(itemDialog.value?.price || 0),
      alloy: {
        sum: itemDialog?.value?.alloy?.sum,
        detailList: alloyDialog.value?.map((m) => {
          return { ...m };
        }),
        detail: detail,
      },
    };
  }

  // console.log("itemList >>> ", itemList.value);
  calAll();
  clearDialog();
};

const clearAll = () => {
  headerReceipt.value = { ...headerReceiptDefault.value };
  headerReceiptDialog.value = { ...headerReceiptDefault.value };

  customer.value = { ...customerDefault.value };
  customerDialog.value = { ...customerDefault.value };

  itemList.value = [];
  itemDialog.value = { ...itemDefault.value };

  paymentDetail.value = {
    bank: null,
    branch: null,
    number: null,
    name: null,
  };

  car.value = {
    before: null,
    after: null,
  };

  adList.value = [];
  scaleList.value = [];

  calAll();
};

const searchNameCustomer = () => {
  const cus =
    customerList.value.filter(
      (f) => f.code === customerDialog.value?.code
    )[0] || {};

  customerDialog.value.name = cus?.customer;
  customerDialog.value.address = cus?.address;
  customerDialog.value.tel = cus?.tel;

  // carOptions.value = cus?.car?.split(",") || [];

  if (cus?.code) {
    db.car
      .where("cusCode")
      .equals(cus?.code)
      .toArray()
      .then((cars) => {
        if (cars) {
          // console.log("cars >>> ", cars);
          carOptions.value = cars.map((m) => m?.carDetail);
        }
      });
  } else {
    carOptions.value = [];
  }
  // customerDialog.value.car = cus?.car;
  // console.log("cus >> ", cus);
};

// const searchNameItem = () => {
//   const item =
//     itemsList.value.filter((f) => f.code == itemDialog.value?.code)[0] || {};

//   itemDialog.value.name = item?.name;
// };

const addAlloy = () => {
  alloyDialog.value.push({ ...alloyDetailDefault.value });
};

const delAlloy = (index) => {
  alloyDialog?.value?.splice(index, 1);
  calAlloy();
};

const delItem = (index) => {
  itemList?.value?.splice(index, 1);
  calAll();
};

const calAlloy = () => {
  let sum = 0;
  alloyDialog.value.forEach((all) => {
    sum += parseFloat(all?.amount || 0);
  });

  itemDialog.value.alloy.sum = sum;

  addSum();
  // calMass();
};

const changePayment = () => {
  if (paymentType.value === "1") {
    isShowBank.value = false;
  } else {
    isShowBank.value = true;
  }
};

const printPDF = () => {
  // console.log("print PDF");
  isPrinting.value = true;
  html2pdf(document.getElementById("print-canvas"), {
    margin: 5,
    filename: `ใบรับสินค้า_${headerReceipt.value?.order}.pdf`,
    html2canvas: { scale: 3 },
  });

  setTimeout(() => {
    isPrinting.value = false;
  }, "2000");
};

// const calMass = () => {
//   itemDialog.value.mass = (
//     parseFloat(itemDialog.value?.sum || 0) -
//     (parseFloat(itemDialog.value?.minus || 0) +
//       parseFloat(itemDialog.value?.alloy?.sum || 0))
//   ).toFixed(2);

//   calSum();
// };

const calSum = () => {
  itemDialog.value.total = (
    parseFloat(itemDialog.value?.mass || 0) *
    parseFloat(itemDialog.value?.price || 0)
  ).toFixed(2);

  // console.log("calSum >> ", itemDialog.value.total);
};

const calAll = () => {
  allMass.value = 0;
  allSum.value = 0;
  allTotal.value = 0;
  allMinus.value = 0;
  allAlloy.value = 0;

  itemList.value.forEach((item) => {
    // console.log(
    //   "parseFloat(item?.total || 0) >>> ",
    //   parseFloat(item?.total || 0)
    // );
    allMass.value += item?.mass || 0;
    allSum.value += item?.sum || 0;
    allTotal.value += parseFloat(item?.total || 0);
    allMinus.value += item?.minus || 0;
    allAlloy.value += item?.alloy?.sum || 0;
    // console.log(allTotal.value);
  });
};

const searchHP = () => {
  if (HPCode.value) {
    db.purchase
      .where("code")
      .equals(`HP${HPCode.value}`)
      .first()
      .then((purchase) => {
        if (purchase) {
          // console.log("purchase >>> ", purchase);
          itemList.value = [];
          purchase?.detail.forEach((det) => {
            itemList.value.push({
              code: det?.code,
              name: det?.name,
              itemShow: `${det?.code} - ${det?.name}`,
              mass: parseFloat(det?.mass || 0),
              price: parseFloat(det?.price || 0),
              total: parseFloat(det?.total || 0),
              sum: parseFloat(det?.sum || 0),
              minus: 0,
              alloy: {
                sum: 0,
                detail: [],
              },
            });
          });

          visibleHP.value = false;
          HPCode.value = "";
        } else {
          alert("ไม่พบข้อมูลรหัส HP นี้");
        }
      });
  }
};

const mapBankAccount = () => {
  const bank = bankOptions.value.filter(
    (f) => f.accountNumber === paymentDetail.value?.number
  )[0];

  console.log("bank >>> ", bank);

  if (bank) {
    paymentDetail.value.bank = bank?.bankName;
    paymentDetail.value.branch = bank?.branch;
    paymentDetail.value.name = bank?.bankOwner;
  }
};

const addSum = () => {
  itemDialog.value.sum = (
    parseFloat(itemDialog.value?.mass || 0) +
    parseFloat(itemDialog.value?.minus || 0) +
    parseFloat(itemDialog.value?.alloy?.sum || 0)
  ).toFixed(2);
};

const sumAll = computed(() => {
  return itemList.value.reduce((acc, item) => acc + (item.sum || 0), 0);
});

const massAll = computed(() => {
  return itemList.value.reduce(
    (acc, item) => acc + (parseFloat(item.mass || 0) || 0),
    0
  );
});

const sumMinus = computed(() => {
  return itemList.value.reduce((acc, item) => acc + (item.minus || 0), 0);
});

const sumAlloy = computed(() => {
  return itemList.value.reduce((acc, item) => acc + (item.alloy?.sum || 0), 0);
});

const totalAll = computed(() => {
  return itemList.value.reduce(
    (acc, item) => acc + (parseFloat(item.total || 0) || 0),
    0
  );
});
</script>

<style lang="scss">
.seperate-page {
  border-bottom: 1px solid black;
}

.item-break {
  break-inside: avoid !important;
}

.top-line {
  border-top: 1px solid black;
}
</style>
