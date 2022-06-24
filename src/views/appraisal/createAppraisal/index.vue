<template>
  <div class="app-container">
    <progres :cruuter="cruuter"></progres>
    <div class="create">
      <!-- <div class="create-item1"> -->
      <!-- 只有量表题 所有暂时隐藏 -->
      <!-- <createside></createside> -->
      <!-- </div> -->
      <div class="create-item2">
        <createmain
          @target="target"
          v-if="cruuter == 0"
          :appraisalId="appraisalId"
        />
        <setting
          v-else-if="cruuter == 1"
          @target="target"
          :appraisalId="appraisalId"
        />
        <success v-else-if="cruuter == 2" />
      </div>
    </div>
  </div>
</template>
<script>
// 添加试题 测评设置 完成 做成组件
import progres from "./components/progres.vue"; //进度
import createside from "./components/createside.vue"; //侧边
import createmain from "./components/createmain.vue"; //内容
import setting from "./components/setting.vue"; //设置测评
import success from "./components/success.vue"; //成功
export default {
  components: {
    progres,
    createside,
    createmain,
    setting,
    success,
  },
  data() {
    return {
      cruuter: localStorage.getItem("Setting_cruuter")
        ? JSON.parse(localStorage.getItem("Setting_cruuter")).index
        : 0,
      appraisalId: localStorage.getItem("Setting_cruuter")
        ? JSON.parse(localStorage.getItem("Setting_cruuter")).data
        : null, //1466956914685452289
    };
  },
  beforeDestroy() {
    //销毁之前
    localStorage.removeItem("Setting_cruuter");
  },
  mounted() {
    this.appraisalId = this.$route.query.appraisalId;
  },
  methods: {
    target(e) {
      localStorage.setItem("Setting_cruuter", JSON.stringify(e));
      this.cruuter = e.index; //切换组件
      this.appraisalId = e.data; //新增成功生成id
    },
  },
};
</script>
<style scoped lang="scss">
.create {
  display: flex;
  margin-top: 20px;
  .create-item1 {
    width: 15%;
    text-align: center;
    border: 1px solid #e0e0e0;
    padding: 10px;
    background: #fbfafa;
    margin-right: 15px;
    .create-text {
      font-size: 15px;
      color: #999;
    }
  }
  .create-item2 {
    width: 100%; //85
  }
}
</style>
