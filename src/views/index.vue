<template>
  <div class="dashboard-editor-container">
    <panel-group v-show="user.admin" />

    <el-row
      v-show="user.admin"
      style="
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
        width: 100%;
      "
    >
      <div class="block">
        <el-date-picker
          v-model="dateTime"
          :clearable="false"
          type="month"
          :editable="false"
          @change="queryRiseData(dateTime)"
        >
        </el-date-picker>
      </div>
      <line-chart :chart-data="lineChartData" name="增长客户数" />
      <line-chart :chart-data="userLineChartData" name="增长订单数" />
    </el-row>

    <el-row v-show="user.admin" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart
            titleName="课程分类统计"
            :chart-data="courseCategoryData"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart
            titleName="专题分类统计"
            :chart-data="specialCategoryData"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <div v-if="!user.admin && !isShow">
      <img :src="imgUrl" />
    </div>
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import { orderRiseData, userRiseData, classifyStatistics } from "@/api/index";
import { getInfo } from "@/api/login";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      isShow: true,
      imgUrl:
        "https://vo.bbazxw.com/bbazxw/file/image/%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F-%E9%A6%96%E9%A1%B5%E5%9B%BE.png",
      user: {
        admin: true,
      },
      dateTime: "",
      lineChartData: {},
      userLineChartData: {},
      courseCategoryData: [],
      specialCategoryData: [],
    };
  },
  methods: {
    queryRiseData(dateTime) {
      let queryParam = {
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
      };
      orderRiseData(queryParam).then((res) => {
        this.lineChartData = res.data;
      });
      userRiseData(queryParam).then((res) => {
        this.userLineChartData = res.data;
      });
    },
    queryCategoryData() {
      classifyStatistics().then((res) => {
        this.courseCategoryData = res.data.courseCategoryList;
        this.specialCategoryData = res.data.specialCategoryList;
      });
    },
  },
  mounted() {
    // 获取当前用户数据
    getInfo().then((res) => {
      if (res.code == 200) {
        this.user = res.user;
        if (!res.user.admin) {
          this.isShow = false;
        } else {
          // 获得当前年月
          this.dateTime = new Date();
          this.queryRiseData(this.dateTime);
          // 获得分类数据
          this.queryCategoryData();
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
