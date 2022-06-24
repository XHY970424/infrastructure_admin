<template>
  <div>
    <!-- 维度 保存按钮 -->
    <div class="main-drop">
      <div>
        <!-- 维度设置 -->
        <el-popover
          ref="popoverRef"
          v-model="visible.show"
          class="popover"
          placement="bottom"
          width="400"
          trigger="click"
          @show="popoveShow"
        >
          <!-- 头部 -->
          <div class="popover-title">维度设置</div>
          <!-- 内容表单 -->
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            max-height="400"
          >
            <el-table-column
              prop="content"
              label="维度"
              width="280"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.check ? true : false"
                  v-model="scope.row.content"
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  v-if="scope.row.check"
                  size="mini"
                  @click="handleAdd(scope.$index, scope.row)"
                  >新 增</el-button
                >
                <el-button
                  v-else
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row, scope.$index)"
                  >删 除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 提交按钮 -->
          <div class="popover-btn">
            <el-button type="primary" size="mini" @click="Submit"
              >提 交</el-button
            >
          </div>
          <el-button type="primary" slot="reference"
            >维度设置 <i class="el-icon-arrow-down"></i
          ></el-button>
        </el-popover>
        <!-- 维度设置 -->
        <!-- 维度绑定 -->
        <el-dropdown
          type="primary"
          trigger="click"
          style="margin: 0px 10px"
          @command="handleCommand"
        >
          <el-button type="primary"
            >维度绑定 <i class="el-icon-arrow-down"></i
          ></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in tableDrop"
              :key="index"
              :command="item"
              >{{ item.content }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" @click="file"
          >导出文件 <i class="el-icon-s-finance"></i
        ></el-button>
        <el-button type="danger" @click="Delect"
          >删 除 <i class="el-icon-delete-solid"></i
        ></el-button>
        <!-- 维度绑定 -->
      </div>
      <div>
        <el-button
          type="warning"
          icon="el-icon-magic-stick"
          @click="dialogPreview = true"
          >预 览</el-button
        >
        <el-button
          class="preservation"
          icon="el-icon-tickets"
          :loading="loadingbtn"
          @click="submitForm('ruleForm')"
          >保存并下一步</el-button
        >
      </div>
    </div>
    <!-- 维度 保存按钮 -->
    <!-- 封面图 -->
    <div class="main-index">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="测评名称" prop="title">
          <el-input
            v-model="ruleForm.title"
            placeholder="请输入测评名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="测评内容" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请填写测评内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="coverPicture">
          <div style="display: flex">
            <el-upload
              ref="icon"
              :show-file-list="false"
              action=""
              :http-request="fileUploadIcon"
              :auto-upload="true"
              list-type="picture"
              accept="image/*"
              name="logo_file"
            >
            <div slot="tip" style="line-height: 2;font-size: 11px;color: #999">(建议图片大小370*170)</div>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-upload"
                :loading="loading.file"
                >点击上传</el-button
              >

            </el-upload>
            <!-- 图片显示 -->
            <el-image
              v-if="ruleForm.coverPicture"
              :z-index="2100"
              ref="iconImg"
              style="max-width: 100px; max-height: 100px; margin-left: 20px"
              :src="ruleForm.coverPicture"
              :preview-src-list="[ruleForm.coverPicture]"
            >
            </el-image>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 封面图 -->
    <!-- 题目数据 -->
    <div class="main-data" v-if="tabletopic.length">
      <div
        v-for="(item, index) in tabletopic"
        :key="index"
        :class="{ 'main-flex': !item.deleteFlag }"
      >
        <template v-if="!item.deleteFlag">
          <div>
            <el-checkbox v-model="item.check">
              题目{{ index + 1 }}:</el-checkbox
            >
          </div>
          <div class="data-title" @click="Edito(item, index)">
            <div class="data-item1" v-html="item.questionTitle"></div>
            <div class="data-item2">
              <el-radio-group>
                <el-radio
                  :label="items.content"
                  v-for="items in item.questionItemList"
                  :key="items.content"
                  >{{ items.content }}</el-radio
                >
              </el-radio-group>
            </div>
          </div>
          <div class="data-type" @click="Edito(item, index)">
            <div class="type-item">{{ item.dimensionName }}</div>
          </div>
        </template>
      </div>
    </div>
    <!-- 题目数据 -->
    <!-- 设置题目 -->
    <div class="main-indexs">
      <el-form
        :model="ruleForms"
        :rules="rule"
        ref="ruleForms"
        label-width="100px"
      >
        <el-form-item label="题目" prop="questionTitle">
          <EditorTow
            height="150"
            id="hintEditor"
            v-model="ruleForms.questionTitle"
          />
        </el-form-item>

        <el-form-item label="提示语" prop="tips">
          <el-input
            type="textarea"
            v-model="ruleForms.tips"
            placeholder="请填写测评内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="选项文字" prop="optional">
          <el-table
            :data="tableCreate"
            border
            style="width: 100%"
            max-height="400"
          >
            <el-table-column
              prop="content"
              label="选项文字"
              width="1080"
              :show-overflow-tooltip="true"
              style="text-align: center"
            >
              <template slot-scope="scope">
                <el-input
                  :disabled="scope.row.check ? true : false"
                  v-model="scope.row.content"
                  placeholder="请输入内容"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  v-if="scope.row.check"
                  size="mini"
                  @click="handleAdd(scope.$index, scope.row, 'optional')"
                  >新 增</el-button
                >
                <el-button
                  v-else
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row, scope.$index, 'optional')"
                  >删 除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="warning"
            style="width: 100%"
            size="medium"
            @click="submitForm('ruleForms', 'optional')"
            >完成编辑</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 设置题目 -->
    <div class="foolter-document">
      <el-upload
        action=""
        class="upload-demo"
        accept=".xls,.xlsx,.doc,.docx,.txt"
        ref="upload"
        :on-change="handleChange"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em><br />
          <div class="el-upload__tip" slot="tip">只能上传.xls,.xlsx文件</div>
        </div>
      </el-upload>
    </div>
    <Preview
      :dialogVisible="dialogPreview"
      :title="ruleForm"
      :conten="tabletopic"
      @colse="colse"
    />
  </div>
</template>

<script>
import XLSX from "xlsx"; //读取xlse文件内容
import * as mammoth from "mammoth"; //读取word文件内容
// 维度设置 维度绑定 删除方法都在mixin里面
import { miNode } from "../mixin.js";
import EditorTow from "@/components/Tinymce";
import { fileUpload } from "@/api/base/website";
import {
  appraisal,
  getappraisal,
  putappraisal,
} from "../../../../api/appraisal/appraisal.js";
import Preview from "@/components/Preview/index.vue";
export default {
  components: { EditorTow, Preview },
  mixins: [miNode],
  props: {
    appraisalId: {
      //编辑是测评id
      type: String,
    },
  },
  data() {
    return {
      loadingbtn:false,//提交懒加载
      dialogPreview: false, //预览模态窗
      visible: {
        show: false, //维度模态窗
        data: false, //删除时模态窗会关闭 导致真实数据覆盖了临时数据 没有删除到
      },
      loading: {
        //上传图片加载
        file: false,
      },
      ruleForm: {
        //设置题目
        title: "", //名称
        remark: "", //内容
        coverPicture: "", //封面
      },
      ruleForms: {
        //首页设置
        dimensionName: "", //维度名称
        questionTitle: "", //题目
        tips: "", //提示语
        optional: "", //选项文字
        index: null, //编辑下标
        edito: false, //false 新增 true 编辑
      },
      rules: {
        title: [{ required: true, message: "请输入测评名称", trigger: "blur" }],
        remark: [
          { required: true, message: "请填写测评封面图", trigger: "blur" },
        ],
        coverPicture: [
          { required: true, message: "请选择网站icon图片", trigger: "blur" },
        ],
      },
      rule: {
        questionTitle: [
          { required: true, message: "请输入题目", trigger: "blur" },
        ],
        optional: [
          { required: true, message: "请填写选项文字", trigger: "blur" },
        ],
      },
      tableData: [
        {
          content: "",
          check: true,
        },
      ], //维度表单临时数据
      tableDatas: [
        {
          content: "",
          check: true,
        },
      ], //维度表单真实数据
      tableDrop: [], //维度下拉菜单数据
      tableCreate: [
        {
          name: "",
          check: true,
        },
      ], //设置题目选项
      tabletopic: [], //题目数据
    };
  },
  watch: {
    tableCreate(val) {
      if (val.length == 1) {
        //点击提交 选项文字数据没有添加 会有提示
        this.ruleForms.optional = null;
      } else {
        this.ruleForms.optional = val.length;
      }
    },
    appraisalId(val) {
      if (val) {
        getappraisal(this.appraisalId).then((res) => {
          //编辑获取数据
          if (res.code == "200") {
            // this.appraisalId = res.data.appraisalId;
            this.ruleForm.title = res.data.title; //测评名称
            this.ruleForm.remark = res.data.remark; //测评内容
            this.ruleForm.coverPicture = res.data.coverPicture; //封面图
            this.tabletopic = res.data.questionList; //题目数据
            this.tableDrop = JSON.parse(res.data.dimensionArr);
            this.tableData.unshift(...JSON.parse(res.data.dimensionArr)); //维度临时数据
            this.tableDatas.unshift(...JSON.parse(res.data.dimensionArr)); //维度真实数据
          }
        });
      }
    },
  },
  methods: {
    //excel文件识别
    handleChange(file, fileList) {
      //文本txt
      // let reader = new FileReader();
      // if (typeof FileReader === "undefined") {
      //   this.$message({
      //     type: "info",
      //     message: "您的浏览器不支持文件读取。",
      //   });
      //   return;
      // }
      // reader.readAsText(file.raw, "utf8");
      // reader.onload = (e) => {
      // };
      //文本txt
      // 读取excel
      if (!this.tableData.length) {
        this.$message.warning("维度不能为空");
        return false;
      }
      let files = { 0: file.raw };
      this.readExcel1(files);
      // 读取worde
      // const reader = new FileReader();
      // reader.readAsArrayBuffer(file.raw);
      // reader.onload = (e) => {
      //   const data = reader.result;
      //   mammoth.extractRawText({ arrayBuffer: data }).then((r) => {
      //   });
      // };
      // 读取worde
    },
    readExcel1(files) {
      //表格导入
      var that = this;
      if (files.length <= 0) {
        //如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }else if(this.tableDrop.length==0){
        this.$message.warning('请先设置维度后再操作');
      }

      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容

          let tabletopic = [];
          for (let i = 0; i < ws.length; i++) {
            console.log(ws.length, this.tableDrop.length)
            let obj = {
              questionItemList: [], //选项
              deleteFlag: false,
              dimensionName: this.tableDrop[0].content, //维度
              dimensionSign: this.tableDrop[0].dimensionSign, //维度idthis.tableDrop[0].dimensionSign
              questionTitle: `<p>${ws[i]["*测评题目标题"]}</p>`, //题目
              tips: ws[i]["提示语"], //提示语
            };

            for (let j = 1; j < 11; j++) {
              //设置选项
              console.log(ws[i]["*题目选项" + j] )
              if (ws[i]["*题目选项" + j] || ws[i]["题目选项" + j]) {
                obj.questionItemList.push({
                  content: Number(
                    ws[i]["*题目选项" + j] || ws[i]["题目选项" + j]
                  ),
                });
              }
            }
            console.log(obj)
            tabletopic.push(obj);
          }
          this.tabletopic.push(...tabletopic);
          //重写数据

          this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },

    //点击题目编辑
    Edito(item, index) {
      this.ruleForms.questionTitle = item.questionTitle; //标题
      this.ruleForms.tips = item.tips; //提示语
      this.ruleForms.optional = item.questionItemList.length;
      this.ruleForms.index = index; //修改下标
      let arr = [
        ...item.questionItemList,
        ...this.tableCreate.splice(this.tableCreate.length - 1, 1),
      ];
      this.tableCreate = JSON.parse(JSON.stringify(arr)); //选线
      this.ruleForms.edito = true; //开启编辑
    },
    //上传封面
    fileUploadIcon(file) {
      this.loading.file = true;
      fileUpload(file).then((res) => {
        if (res.code == 200) {
          this.ruleForm.coverPicture = res.url;
          this.$forceUpdate();
        } else {
          this.$message.error("上传图片异常");
        }
        this.loading.file = false;
      });
    },
    //完成编辑和保存
    submitForm(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type == "optional") {
            //完成编辑
            if (!this.tableDrop.length) {
              this.$message.warning("请先设置维度后再操作");
              return;
            }
            if (!this.ruleForms.edito) {
              //新增
              let obj = {
                questionTitle: this.ruleForms.questionTitle, //标题
                tips: this.ruleForms.tips, //提示语
                dimensionName: this.tableDrop[0].content, //维度
                dimensionSign: this.tableDrop[0].dimensionSign, //维度id
                check: false, //复选框
                deleteFlag: false, //true为删除
                questionItemList: this.tableCreate.slice(
                  0,
                  this.tableCreate.length - 1
                ), //选项
              };
              this.tabletopic.push(obj);
            } else {
              //编辑
              this.tabletopic[this.ruleForms.index].questionTitle =
                this.ruleForms.questionTitle; //标题
              this.tabletopic[this.ruleForms.index].tips = this.ruleForms.tips; //提示语
              this.tabletopic[this.ruleForms.index].questionItemList =
                this.tableCreate.slice(0, this.tableCreate.length - 1); //选项
            }
            //删除最后一条新增空数据
            this.tableCreate = this.tableCreate.splice(
              this.tableCreate.length - 1,
              1
            );
            //选项数据清空
            this.ruleForms.edito = false;
            this.$refs[formName].resetFields();
          } else {
            //保存并下一步
            let row = JSON.parse(JSON.stringify(this.tabletopic));
            for (let i = 0; i < row.length; i++) {
              row[i].deleteFlag = row[i].deleteFlag ? 1 : 0;
              row[i].questionType = "1";
              // delete row[i].check;
            }
            let obj = {
              ...this.ruleForm,
              dimensionArr: JSON.stringify(this.tableDrop),
              questionList: row,
            };
            if (this.appraisalId) {
              //编辑加上id
              obj.appraisalId = this.appraisalId; //编辑id
            }
            //create true修改 否则 新增
            let col = this.appraisalId ? putappraisal : appraisal;
            this.loadingbtn=true
            col(obj).then((res) => {
              if (res.code == "200") {
                this.$message.success("保存成功");
                this.$refs[formName].resetFields();
                this.$emit("target", {
                  index: 1,
                  data: res.data || this.appraisalId,
                });
              }
              this.loadingbtn=false
            });
          }
        } else {
          return false;
        }
      });
    },
    //维度新增
    handleAdd(item, index, type) {
      let obj = {
        content: "",
        dimensionSign: Date.now(), //微秒时间戳当id
      };
      if (type == "optional") {
        //设置题目
        if(this.tableCreate.length>10) return this.$message.warning('选项不能超过十条数据');
        this.tableCreate.splice(this.tableCreate.length - 1, 0, obj);
      } else {
        //设置维度
        this.tableData.splice(this.tableData.length - 1, 0, obj);
      }
    },
    //维度删除
    handleDelete(item, index, type) {
      if (type == "optional") {
        //设置题型
        this.tableCreate.splice(index, 1);
      } else {
        //维度删除
        if (this.tableData.length <= 2) {
          this.$message.warning("维度不能为空");
          return;
        }
        this.$confirm("确定删除此条维度数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            //删除
            this.visible.data = true; //删除导致模态窗关闭
            this.visible.show = true; //重新打开模态窗
            this.tableData.splice(index, 1);
            this.dimension(); //维度修改和删除后 题型维度的修改
            this.$forceUpdate();
          })
          .catch(() => {
            //取消
            this.visible.data = true; //删除导致模态窗关闭
            this.visible.show = true; //重新打开模态窗
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-drop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px 40px;
  line-height: 60px;
  border-bottom: 1px solid #e0e0e0;
}
.preservation {
  background: darkmagenta;
  color: #fff;
}
.popover-title {
  position: relative;
  top: -12px;
  left: -12px;
  width: 106.5%;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  line-height: 30px;
  color: #fff;
  padding-left: 15px;
  background: #1890ff;
}
.popover-btn {
  margin-top: 10px;
  display: flex;
  justify-content: end;
}
//首页封面
.main-index {
  background: #fbfafa;
  padding: 20px 20px 10px;
  border-radius: 12px;
}
.main-indexs {
  padding: 20px 20px 10px;
  border-radius: 12px;
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}
::v-deep .el-checkbox__label {
  font-size: 15px;
  font-weight: bold;
  color: #606266;
}
.main-data {
  // padding: 10px 0px 0px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-top: 20px;
  font-size: 15px;
  font-weight: bold;
  color: #606266;
  .main-flex:hover {
    background: rgb(250, 248, 248);
    cursor: pointer;
  }
  .main-flex {
    display: flex;
    padding: 25px 45px;
    .data-title {
      padding-left: 10px;
      width: 85%;
      font-weight: 400;
      .data-item1 {
        -webkit-margin-before: 0em;
        -webkit-margin-after: 0em;
        margin-bottom: 20px;
        width: 90%;
        overflow: hidden;
        white-space: normal;
        word-break: break-all;
        ::v-deep p,
        h2 {
          -webkit-margin-before: 0em;
          -webkit-margin-after: 0em;
        }
      }
      .data-item2 {
        font-weight: 100;
      }
    }
  }
  .data-type {
    color: #fff;
    margin-left: 20px;

    .type-item {
      font-weight: 400;
      background: #1890ff;
      border-radius: 12px;
      padding: 5px 10px;
    }
  }
}
.foolter-document {
  margin-top: 20px;
  width: 100%;
  ::v-deep .el-upload {
    width: 100%;
  }
}
::v-deep .el-upload-dragger {
  width: 100%;
}
::v-deep .el-table__cell {
  text-align: center !important;
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
</style>
