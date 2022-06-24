<template>
  <div class="">
    <div class="statis">
      <div class="statis-width1">
        <div class="statis-flex">
          <div
            v-for="(item, index) in list"
            :key="index"
            class="statis-item"
            :class="{ 'statis-show': list_index == index }"
            @click="changType(index)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="statis-select">
          <el-select v-model="select.value" placeholder="请选择" @change="change">
            <el-option
              v-for="item in dimension.dimensionArr"
              :key="item.dimensionSign"
              :label="item.content"
              :value="item.dimensionSign"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="statis-width2">
        <!-- 柱状图 -->
        <div
          id="main"
          :class="list_index == 1 ? 'unposition' : 'position'"
          style="width: 50%; height: 400px"
        ></div>
        <!-- 环状图 -->
        <div
          id="main1"
          :class="list_index == 0 ? 'unpositions' : 'position'"
          style="width: 65%; height: 450px"
        ></div>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      border
      :class="list_index == 0 ? 'table' : 'tables'"
      @sort-change="sort"
      
    >
    <!-- :default-sort="{ prop: 'distributeNum', order: 'descending' }" -->
      <el-table-column align="center" prop="nickName" label="企业" width="350">
      </el-table-column>
      <el-table-column align="center" prop="distributeNum" label="分发总量" sortable >
      </el-table-column>
      <el-table-column align="center" prop="participateNum" label="完成数" sortable>
      </el-table-column>
      <el-table-column align="center" prop="address" label="占比" width="600">
        <template slot-scope="scope">
          <div style="margin: 0px 120px">
             <!-- :show-text="false" -->
            <el-progress 
              :text-inside="true"
              :stroke-width="15"
              :percentage="countNum(scope.row.participateNum,scope.row.distributeNum)"
            ></el-progress>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="pagination"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import echarts from "echarts";
import { Columnar, pie } from "../../line";
require("echarts/theme/macarons");
import { companyStatistics ,statisticsMap} from "../../../../api/appraisal/appraisal";
export default {
  data() {
    return {
      dimension:{},//图表数据
      loading: false, //表格懒加载
      tableData: [], //表格数据
      list_index: 0,
      list: [{ name: "环状图" }, { name: "柱状图" }],
      select:{value:'',label:''},//选中下拉选项
      chart1: null,//环形
      chart: null,//柱形图
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appraisalId:this.$route.query.appraisalId,
        orderField:'',//排序字段 distributeNum-分发总量排序 participateNum-
        orderType:'',//1-倒序
      },
    };
  },
  computed:{
    countNum(){
      return (min,max)=> {
        if(max==0) return 0
        return parseInt(min/max*100) 
      }
    }
  },
  methods: {
    //表格排序
    sort(row) {
      this.queryParams.pageNum=1
      this.queryParams.orderField=row.order?row.prop:''//order 为空默认 否则就是升序
      this.queryParams.orderType=row.order=='descending'?1:''//row.order=='descending' 为降序
      this.getList()
    },
    getList() {//表格数据
      companyStatistics(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    //环形图 柱状图切换
    changType(index){
      this.list_index = index
       if(this.list_index==0){//环型
        var option = this.chart1.getOption();
        option.series[0].data = this.chartFun(this.dimension.totalScoreMap).objChart//获取数据
         option.title[0].text=this.select.label//获取标题
        this.chart1.setOption(option);
      }else{//柱形图
       var option = this.chart.getOption();
        option.series[0].data = this.chartFun(this.dimension.totalScoreMap).objChart//获取数据
         option.title[0].text=this.select.label//获取标题
        this.chart.setOption(option);
      }
    },
    //下拉菜单选中数据
    change(e) {
      //动态更新数据
       let data=this.chartFun(this.dimension.dimensionMap[e]).objChart//处理下图标的数据格式
       this.dimension.totalScoreMap=this.dimension.dimensionMap[e]//将当前选中表格数据给到数组this.dimension
       let type=this.dimension.dimensionArr.filter(ele=>ele.dimensionSign==e)//获取当前选中的类型数据
       this.select.value=type[0].dimensionSign//获取类型标识
       this.select.label=type[0].content//获取类型标题
      if(this.list_index==0){//环型
        var option = this.chart1.getOption();
        option.series[0].data = data//数据
        option.title[0].text=this.select.label//标题
        this.chart1.setOption(option);
      }else{//柱形图
       var option = this.chart.getOption();
        option.series[0].data = data//数据
         option.title[0].text=this.select.label//标题
        this.chart.setOption(option);
      }
      
    },
    chartFun(arr){//后端返回数据进行处理
      let objChart=[]//名称和值
      let colorChart=[]//颜色
      for(let item of arr){
        colorChart.push(item.color)
        let name=''
        if(item.maxScore){//判断有没有最大值
           name=item.minScore+'~'+item.maxScore
        }else{
          name=item.minScore
        }
        objChart.push({name,value:item.count})
      }
      return {title:this.select.label,objChart,colorChart}
    },
  },
  mounted() {
    this.getList();
    statisticsMap(this.$route.query.appraisalId).then(res=>{
      this.dimension=res.data
      this.select.value=res.data.dimensionArr[0].dimensionSign//下拉的标识
      this.select.label=res.data.dimensionArr[0].content//下拉的标题
      // content
     
      let dataChart=this.chartFun(res.data.totalScoreMap)
       //环型图
      this.chart1 = echarts.init(document.getElementById("main1"));
      var option1 = pie(dataChart);
      this.chart1.setOption(option1);
       //环型图
      // 柱形图
      let count={title:this.select.label,name:[],value:[]}
     for(let item of dataChart.objChart){
       count.name.push(item.name)
       count.value.push(item.value)
     }
      this.chart = echarts.init(document.getElementById("main"));
      var option = Columnar(count);
      this.chart.setOption(option);
      // 柱形图
    })
  },
};
</script>

<style lang="scss" scoped>
.statis {
  display: flex;
  width: 100%;
}
.statis-flex {
  display: flex;
  .statis-item {
    cursor: pointer;
    border: 1px solid rgba(170, 170, 170, 1);
    color: rgba(170, 170, 170, 1);
    font-size: 14px;
    padding: 5px 14px;
    border-radius: 4px;
  }
  .statis-item + .statis-item {
    margin-left: 15px;
  }
  .statis-show {
    border: 1px solid #3793d7;
    color: #3793d7;
  }
}
.statis-select {
  margin: 30px 0px;
}
.statis-width1 {
  width: 20%;
  padding-left: 15px;
}
.statis-width2 {
  width: 80%;
}
.position {
  // display: none;
  position: absolute !important;
  top: -1000px;
  width: 100%;
}
.unposition {
  margin-left: 5%;
  padding: 8px;
  width: 100%;
}
.unpositions {
  position: absolute;
  left: 17%;
  // margin-top: -28%;
  padding: 8px;
  width: 100%;
}
.table {
  width: 100%;
  margin: 300px 0px 20px;
  /deep/ th.el-table__cell.is-leaf {
    background-color: #fafafa !important;
  }
}
.tables {
  width: 95%;
  margin: 50px 50px 20px;
  /deep/ th.el-table__cell.is-leaf {
    background-color: #fafafa !important;
  }
}
.pagination {
  width: 95%;
  margin: 0px 50px 20px;
}
</style>
