<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="55%"
      :before-close="close"
    >
      <div class="dialog">
        <div
          v-for="item in 2"
          :key="item"
          class="dialog-item"
          :class="{ 'dialog-show': item == dialogIndex }"
        >
          {{ item == 1 ? "手机预览" : "电脑预览" }}
        </div>
      </div>
      <div class="dialog-title">{{ PreviewTitle.title }}</div>
      <div class="dialog-conten">{{ PreviewTitle.remark }}</div>
      <el-form :inline="true" v-model="labelPosition" class="demo-form-inline">
        <el-form-item
          :label="item"
          class="form-inline"
          v-for="(item, index) in labelForm"
          :key="index"
        >
          <el-input />
        </el-form-item>
      </el-form>
      <div class="scroll">
        <div class="dialog-option">
          <div
            v-for="(item, index) in PreviewList"
            :key="index"
            class="dialog-item"
          >
            <div class="option-title">
              {{ index + 1 }}、<span v-html="item.questionTitle"></span>
            </div>
            <div
              class="option-radio"
              v-for="(items, indexs) in item.questionItemList"
              :key="indexs"
            >
              <!-- {{ item.questionItemList }} -->
              <el-radio label="0">{{ items.content }}</el-radio>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getappraisal } from "../../api/appraisal/appraisal";
export default {
  name: "Preview",
  props: {
    dialogVisible: {
      //模态窗
      type: Boolean,
    },
    appraisalId: {
      //列表首页进入
      //测评id
      type: String,
    },
    //设置测评里面
    title: {
      type: Object,
    },
    conten: {
      type: Array,
    },
  },
  watch: {
    appraisalId(val) {
      //首页列表
      getappraisal(val).then((res) => {
        if (res.code == 200) {
          console.log(res.data, this.PreviewList);
          this.PreviewTitle = res.data; //标题内容
          this.PreviewList = res.data.questionList; //题目
          console.log(res.data, this.PreviewList);
        }
      });
    },
    title(val) {
      // this.PreviewTitle = val;
    },
    conten(val) {
      this.PreviewList = val;
    },
    dialogVisible(val) {
      // this.PreviewShow = val;
    },
  },
  data() {
    return {
      //预览模态窗
      dialogIndex: 2,
      labelPosition: "top", //模态窗
      labelForm: ["单位", "姓名", "部门", "单位"],
      PreviewList: this.PreviewTitle || [],
      PreviewTitle: this.title || {},
    };
  },
  methods: {
    close(e) {
      this.$emit("colse", false);
    },
  },
};
</script>

<style scoped lang="scss">
.dialog {
  line-height: 30px;
  box-shadow: 0px 5px 5px #60b7dd70;
  display: flex;
  justify-content: center;

  .dialog-item {
    line-height: 60px;
    width: 25%;
    text-align: center;
    color: #999;
    border: 1px solid #e0e0e0;
  }
  .dialog-show {
    background: rgb(2, 167, 240);
    color: #fff;
  }
}
/deep/.el-dialog__body {
  padding: 0px 0px;
  height: 700px;
  background: #fff;
}
.demo-form-inline {
  padding: 10px 0px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin: 0px 20px;
  .form-inline {
    text-align: left;
    width: 48% !important;
    margin-bottom: 10px !important;
  }
  /deep/ .el-form-item__content {
    width: 100%;
  }
}
.dialog-title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  // line-height: 60px;
  padding: 30px 0px 15px;
}
.dialog-conten {
  text-align: center;
  color: #999;
  font-size: 15px;
  padding-bottom: 20px;
  word-wrap: normal;
  width: 80%;
  margin: 0px auto;
}
.scroll {
  width: 99%;
  height: 280px;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
  // margin-bottom: 50px;
  // border: 1px solid #e0e0e0;
  // border-radius: 12px;
}
.dialog-option {
  position: absolute;
  left: 0;
  top: 0;
  right: -50px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0px 20px;
  padding: 20px 10px;
  .option-title {
    font-size: 15px;
    color: #606266;
    padding-bottom: 15px;
    display: flex;
    width: 100%;
  }
  .dialog-item {
    padding-bottom: 30px;
  }
  .option-radio + .option-radio {
    padding-top: 10px;
  }
}
/deep/ p {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h1 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h2 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h3 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h4 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h5 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/deep/ h6 {
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
}
/* for Chrome */
.inner-container::-webkit-scrollbar {
  display: none;
}
.element::-webkit-scrollbar {
  display: none;
}
</style>
