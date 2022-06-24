<template>
  <div class="progreses">
    <div
      class="progress-flex"
      v-for="(item, index) in porgress_list"
      :key="index"
      :class="{ 'flex-show': porgress_index == index }"
    >
      <div
        class="progress-line"
        :class="{ 'line-show': porgress_index == index }"
      ></div>
      <div
        class="porgress-name"
        :class="{ 'name-show': porgress_index == index }"
      >
        <span>{{ index + 1 }}</span>
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "progres",
  props: {
    cruuter: {
      type: Number,
      default: () => 0,
    },
  },
  watch: {
    cruuter(val) {
      this.porgress_index = val;
    },
  },
  data() {
    return {
      porgress_index: this.cruuter,
      porgress_list: [
        {
          name: "添加试题",
        },
        {
          name: "测评设置",
        },
        {
          name: "完成",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.progreses {
  height: 50px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: center;
  .progress-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    color: #e0e0e0;
    .progress-line {
      width: 100px;
      height: 4px;
      border-radius: 15px;
      background: #e0e0e0;
      margin-right: 20px;
    }
    span {
      border-radius: 50%;
      padding: 0px 3.5px;
      font-size: 10px;
      border: 1px solid #e0e0e0;
    }
  }
  .flex-show {
    color: #000;
    .line-show {
      background: #000;
    }
    span {
      border: 1px solid #000;
    }
  }
}
</style>
