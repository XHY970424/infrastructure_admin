<template>
  <div class="success">
    <div class="success-item">
      <img src="../../../../assets/image/success.png" alt="" srcset="" />
      <div class="conten">测评创建成功</div>
      <div>
        <el-button type="success" plain @click="returns()">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    returns() {
      this.$router.push("appraisal");
    },
  },
};
</script>

<style scoped lang="scss">
.success {
  margin: 10px auto;
  width: 100%;
  display: flex;
  justify-content: center;
  img {
    width: 100px;
    height: 100px;
  }
  .conten {
    font-weight: bold;
    font-size: 20px;
    line-height: 90px;
  }
}
.success-item {
  text-align: center;
}
</style>
