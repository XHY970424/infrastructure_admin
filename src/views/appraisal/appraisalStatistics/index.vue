<template>
  <div class="app-container">
    <el-tabs v-model="statisIndex" @tab-click="handleClick">
      <el-tab-pane label="统计报表" name="1" />
      <el-tab-pane label="数据详情" name="0" />
    </el-tabs>
    <div class="title">《 {{form.title}} 》</div>
    <div class="title1">数据概况</div>
    <div class="statis-flex">
      <div v-for="item in list" :key="item.name" class="statis-item">
        <div>{{ item.name }}</div>
        <div
          class="item2"
          v-if="item.name == '平均测评数'"
          v-html="timeDate(form[item.key])"
        >
          <!-- <div v-html="timeDate()"></div> -->
          <!-- {{ timeDate() }} -->
        </div>
        <div class="item2" v-else>{{ form[item.key] || 0 }}</div>
      </div>
    </div>
    <div class="title1">{{ statisIndex == 0 ? "数据" : "统计" }}详情</div>

    <dataType v-if="statisIndex == '0'"  />
    <Staties v-if="statisIndex == '1'" />
  </div>
</template>

<script>
import { getsurvey } from "../../../api/appraisal/appraisal";
import Template from "@/views/certificate/template";
import dataType from "./components/data.vue";
import Staties from "./components/Statis.vue";
export default {
  name: "TopNav",
  components: { Template, dataType, Staties },
  data() {
    return {
      statisIndex: "1", //标签下标id
      list: [
        { name: "申请企业数", key: "distributeCompanyNum" },
        { name: "分发数据总量", key: "distributeNum" },
        { name: "参评数据总量", key: "participateNum" },
        { name: "今日新增测评数", key: "todayAddNum" },
        { name: "平均测评数", key: "avgTime" },
      ],
      appraisalId: null, //id
      form: {}, //数据概况
    };
  },
  computed: {
    timeDate() {
      //秒转时分秒
      return (t) => {
        let data = this.timeFormat(t);
        let style = "font-size: 13px;color: rgb(170, 170, 170);";
        if (data.hourTime) {
          return `${data.hourTime}<span style='${style}'>时</span>${data.minuteTime}<span style='${style}'>分</span>${data.secondTime}<span style='${style}'>秒</span>`;
        } else if (data.minuteTime) {
          return `${data.minuteTime}<span style='${style}'>分</span>${data.secondTime}<span style='${style}'>秒</span>`;
        } else {
          return `${data.secondTime || 0}<span style='${style}'>秒</span>`;
        }
      };
    },
  },
  mounted() {
    this.appraisalId = this.$route.query.appraisalId;
    getsurvey(this.appraisalId).then((res) => {
      if (res.code == 200) {
        this.form = res.data;
      }
    });
  },
  methods: {
    //秒数转换为时分秒(hh:mm:ss)
    timeFormat(time) {
      let timeStr = {};
      let minuteTime = 0;
      let secondTime = 0;
      let hourTime = 0;
      if (time < 60) {
        timeStr = { secondTime: time };
      } else if (time >= 60 && time < 3600) {
        minuteTime = parseInt(time / 60);
        secondTime = parseInt(time % 60);
        timeStr = {
          minuteTime: minuteTime,
          secondTime: secondTime,
        };
      } else if (time >= 3600) {
        let _t = parseInt(time % 3600);
        hourTime = parseInt(time / 3600);
        minuteTime = parseInt(_t / 60);
        secondTime = parseInt(_t % 60);
        timeStr = {
          hourTime: hourTime,
          minuteTime: minuteTime,
          secondTime: secondTime,
        };
      }
      return timeStr;
    },
    //标签切换
    handleClick(tab, event) {},
  },
};
</script>
<style scoped lang="scss">
.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
}
.title1 {
  display: flex;
  align-items: end;
  font-weight: bold;
  height: 40px;
  margin-bottom: 20px;
  &::before {
    content: "";
    background: #1890ff;
    width: 5px;
    height: 25px;

    margin-right: 5px;
    display: block;
  }
}
.statis-flex {
  display: flex;
  .statis-item {
    text-align: center;
    width: 25%;
    color: rgb(170, 170, 170);
    // height: 80px;
    font-size: 15px;
    .item2 {
      font-size: 19px;
      color: #000;
      line-height: 50px;
      span {
      }
    }
  }
}
</style>
