<template>
  <div class="result">
    <div class="position">
      <el-button plain @click="download">下载报告</el-button>
    </div>
    <div class="results">
      <div class="title">

        《 {{this.title}} 》
      </div>
      <div class="result-flex">
        <div v-for="(item,index) in list_title" :key="index " class="result-item">
          <div class="result-text1">{{form[item.key] || item.score ||"无"}} {{form[item.key] ?item.text:''}}</div>
          <div class="result-text2">{{item.content}}</div>
        </div>
      </div>
      <div class="Radar">
        <div class="Radar-title">{{title}}雷达图</div>
<!--        <span class="Radar-text">这是通过测评得出的能力总结</span>-->
      </div>
      <div class="echarts">
        <div id="Radar" style="width: 65%; height: 500px"></div>
      </div>

    </div>
    <div class="subjects">
      <div class="Radar" style="margin-bottom: 10px">
        <div class="Radar-title">全部题目</div>
      </div>
      <div class="subjects-title">第一轮</div>
      <div class="overflow">
      <div class="overflow-item">
        <div class="subject" v-for="(item,index) in questionList.questionList" :key="index">
        <div style="width: 90%">
          <!-- {{item}} -->
          <div class="subject-title">{{index+1}}、<div v-html="item.questionTitle"></div></div>
          <el-radio-group v-model="item.chooseItemId" >
            <el-radio :label="items.itemId" disabled v-for="(items,indexs) in item.questionItemList" :key="indexs">{{items.content}}</el-radio>
          </el-radio-group>
        </div>
        <div class="subject-type">{{item.dimensionName}}</div>
      </div>
      </div>
      </div>
    </div>
    <div class="subjectsm" >
      <div class="subjects-title" >第二轮</div>
      <div class="subject-scroll">
      <div class="subject" v-for="(item,index) in questionList.secondQuestionList" :key="index">
        <div style="width: 90%">
          <!-- {{item}} -->
          <div class="subject-title">{{index+1}}、<div  v-html="item.questionTitle"></div></div>
          <el-radio-group v-model="item.chooseItemId" >
            <el-radio :label="items.itemId" disabled v-for="(items,indexs) in item.questionItemList" :key="indexs">{{items.content}}</el-radio>
          </el-radio-group>
        </div>
        <div class="subject-type">{{item.dimensionName}}</div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { personReport } from "../../../api/appraisal/appraisal";
import echarts from "echarts";
import { radar } from "../line";
import html2PDF from "jspdf-html2canvas";
require("echarts/theme/macarons");
export default {
  data() {
    return {
      title: "企业员工能力测评",
      list_title:[
        {"content": "名称",key:"userName"},
        {"content": "单位",key:"companyName"},
        {"content": "部门",key:"sectionName"},
        {"content": "岗位",key:"postsName"},
        {"content": "年龄",key:"age"},
        {"content": "测评用途",key:"useDesc"},
        {"content": "提交时间",key:"submitTime"},
        {"content": "测试用时",key:"useTime",text:"秒"},
      ],
      form:{},
      questionList:{
        questionItemList:[],
        secondQuestionList:[],
      }
     };
  },
  mounted() {
    personReport(this.$route.query.relevanceId).then(res=>{
      let data=res.data
      this.title = data.title
      for(let item of this.list_title){
        this.form[item.key]=data[item.key]
      }
      this.list_title.push(...res.data.dimensionList)
      // 雷达图
      let radarChart=this.chartFun(res.data.dimensionList)
      this.chart1 = echarts.init(document.getElementById("Radar"));
      var option1 = radar(radarChart); //雷达图
      this.chart1.setOption(option1);
      this.questionList={
        questionList:res.data.questionList,
        secondQuestionList:res.data.secondQuestionList,
      }
    })
  },
  methods: {
    chartFun(arr){//雷达图 数据处理
      var sum=0,count=[],value=[]//最大值 数据 名称
       arr.forEach((ele)=> {//遍历拿到最大值
       if(sum<ele.score){
         sum=ele.score
       }

      })
      arr.forEach((ele)=> {//遍历拿到最大值
         count.push(ele.score)
         value.push({name:ele.content,max:sum})
      })
      return {count,value}
    },
    //下载pdf
    download() {
      let page = document.querySelector(".results");
      // page 元素背景设成#FFF，解决打印处理黑边问题
      html2PDF(page, {
        jsPDF: {
          unit: "pt",
          format: "a4",
        },
        imageType: "image/jpeg",
        success: (pdf)=>{
          window.scrollTo(0, document.body.scrollHeight);
          pdf.save(`${this.form.userName}个人报告` + ".pdf");
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  width: 100%;
  font-size: 22px;
  font-weight: bold;
  line-height: 100px;
  display: flex;
  align-content: center;
  justify-content: center;
  padding-top: 20px;

}
.position {
  position: absolute;
  right: 60px;
  margin-top: 55px;
  /deep/ .el-button--medium {
    border: 1px solid rgba(99, 0, 191, 0.498039215686275);
    color: rgba(99, 0, 191, 0.498039215686275);
  }
  /deep/ .el-button--medium:hover {
    opacity: 0.8;
  }
}
.result {
  padding: 0px 50px;
  .result-flex {
    border-left: 1px solid #e0e0e0;
    border-top: 1px solid #e0e0e0;
    margin: 0px 100px;
    .result-item {
      display: inline-block;
      // line-height: 60px;
      padding: 10px 0px;
      text-align: center;
      width: 25%;
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      .result-text1 {
        line-height: 35px;
        padding-bottom: 10px;
        font-size: 20px;
        font-weight: bold;
      }
      .result-text2 {
        // line-height: 35px;
        color: #999;
        font-size: 12px;
      }
    }
  }
}
// 雷达图
.Radar {
  width: 100%;
  font-size: 22px;
  font-weight: bold;
  line-height: 30px;
  text-align: center;
  margin-top: 30px;
  .Radar-title {
    line-height: 50px;
  }
  .Radar-text {
    font-weight: 400;
    font-size: 18px;
    color: #999999;
  }
}
// 题目
.subjectsm{
  margin-bottom: 50px;
}
.subjects {
  margin: 20px 0px 40px;

  }
  .subject-scroll{
    margin: 0px 120px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    // overflow-y: scroll;
    // height: 500px;
  }
  .subjects-title{
    padding: 20px 120px;
    font-weight: bold;
    font-size: 20px;
  }
  .subject {
    padding: 0px 20px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .subject-title {
      line-height: 40px;
      font-size: 16px;
      word-wrap: break-word;
      display: flex;
      align-items:center;
    }
    /deep/ .el-radio-group{
      margin-left: 20px;
    }
    /deep/ .el-radio__label {
      font-size: 14px;
    }
    .subject-type {
      background: rgba(0, 157, 255, 1);
      height: 25px;
      padding: 6px 20px;
      color: #fff;
      border-radius: 12px;
      font-size: 13px;
      // line-height: 30px;
    }
  }

.echarts {
  display: flex;
  justify-content: center;
}
.overflow {
  // width: 90%;
  height: 500px;
  position: relative;
  overflow: hidden;
  // margin-top: 20px;
  margin: 0px 120px 0px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;

  .overflow-item {
    padding-top: 10px;
    position: absolute;
    left: 0;
    top: 0;
    right: -17px;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
