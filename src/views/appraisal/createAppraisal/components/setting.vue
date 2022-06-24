<template>
  <div class="setting">
    <div class="setting-title">
      <div class="titles">测评设置</div>
      <div class="title1">
        <el-button
          class="preservation"
          icon="el-icon-tickets"
          @click="submitForm"
          :loading="loading"
          >发 布</el-button
        >
      </div>
    </div>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      class="formwidth"
      :label-position="labelPosition"
    >
      <el-form-item label="定时开始">
        <el-col :span="16">
          <el-checkbox v-model="form.timerStart" class="marginRigth"
            >考试开始时间</el-checkbox
          >
          <el-date-picker
            :disabled="!form.timerStart"
            v-model="form.startTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="定时结束">
        <el-col :span="16">
          <el-checkbox v-model="form.timerEnd" class="marginRigth"
            >考试结束时间</el-checkbox
          >
          <el-date-picker
            :disabled="!form.timerEnd"
            v-model="form.endTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="答题时间限制">
        <el-checkbox v-model="checkbox.Time">需要在</el-checkbox>
        <el-input
          :disabled="!checkbox.Time"
          v-model="form.astrictAnswerTime"
          class="margin"
        ></el-input
        >分 内完成答题
      </el-form-item>
      <el-form-item label="防作弊设置">
        <el-checkbox v-model="checkbox.Screen">是否切屏</el-checkbox>
        <!-- <el-input
          :disabled="!checkbox.Screen"
          v-model="form.astrictScreen"
          class="screen"
        ></el-input> -->
        <!-- 次 超出该次数就强制交卷 -->
      </el-form-item>
      <el-form-item label="测评报告">
        <el-checkbox v-model="checkbox.showReport"
          >是否展示测评报告</el-checkbox
        >
      </el-form-item>
      <el-form-item label="出题设置">
        <el-radio-group v-model="form.appraisalNum" style="width: 100%">
          <el-radio :label="0">单轮测试</el-radio>
          <el-radio :label="1" style="margin-left: 4%">多轮测试</el-radio>
        </el-radio-group>
        <div class="frequency">
          <div class="frequency-flex">
            <div class="frequency-item">第一轮:</div>
            <el-radio-group v-model="radio.submit1">
              <el-radio :label="0">按循序出题</el-radio>
              <el-radio :label="1">随机乱序出题</el-radio>
            </el-radio-group>
          </div>
          <!-- 多轮 -->
          <div class="frequency-flex" v-if="form.appraisalNum != 0">
            <div class="frequency-item">第二轮:</div>
            <el-radio-group v-model="radio.submit2">
              <el-radio :label="0">自定义规则</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="分值设置">
        <div class="frequency">
          <div class="frequency-flex">
            <div class="frequency-item">第一轮:</div>
            <el-radio-group v-model="radio.fraction1">
              <el-radio :label="0">按选项值为分值</el-radio>
            </el-radio-group>
          </div>
          <div class="frequency-flex" v-if="form.appraisalNum != 0">
            <div class="frequency-item">第二轮:</div>
            <el-radio-group v-model="radio.fraction2">
              <el-radio :label="0">所选项增加分值至10分</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="成绩设置" prop="ConfigDTOList">
        <div class="position">*</div>
        <el-table
          :data="ConfigDTOList"
          border
          style="width: 100%"
          max-height="400"
        >
          <el-table-column
            prop="content"
            label="成绩范围"
            width="900"
            :show-overflow-tooltip="true"
            style="text-align: center"
          >
            <template slot-scope="scope">
              <el-input
                class="education-input"
                :disabled="scope.row.check ? true : false"
                v-model="scope.row.minScore"
                placeholder="请输入成绩"
              ></el-input>
              ~
              <el-input
                class="education-input"
                :disabled="scope.row.check ? true : false"
                v-model="scope.row.maxScore"
                placeholder="请输入成绩"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="配置颜色">
            <template slot-scope="scope">
              <el-color-picker
                v-model="scope.row.color"
                :disabled="scope.row.check ? true : false"
              ></el-color-picker>
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
                @click="formDelete(scope.row, scope.$index)"
                >删 除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="提交后设置">
        <div class="frequency">
          <div class="radio-flex">
            <el-radio-group v-model="form.submittedShow" class="radio-item">
              <el-radio :label="0">显示成绩单</el-radio>
            </el-radio-group>
            <div class="settings" @click="dialogVisible = true">成绩单设置</div>
          </div>
          <div class="radio-flex">
            <el-radio-group v-model="form.submittedShow" class="radio-item" >
              <el-radio :label="1">显示感谢语句</el-radio>
            </el-radio-group>
            <div style="width: 86%">
              <el-input
                v-if="form.submittedShow != 2"
                v-model="form.submittedShowContent"
                placeholder="默认显示 (可自定义修改)：您已完成本次测评，感谢您的参与"
              ></el-input>
            </div>
          </div>
          <div class="radio-flex">
            <el-radio-group v-model="form.submittedShow" class="radio-item">
              <el-radio :label="2">跳转到指定页面</el-radio>
            </el-radio-group>
            <div style="width: 86%">
              <el-input
                v-if="form.submittedShow == 2"
                v-model="form.href"
                placeholder="请输入指定跳转链接"
              ></el-input>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="setting-title">权限设置</div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      class="formwidth"
      :label-position="labelPosition"
    >
      <el-form-item label="同步限制">
        <el-radio-group v-model="form.permissionType" style="width: 100%">
          <el-radio :label="0" @click.native.prevent="changeRadio(0)"
            >全部企业用户</el-radio
          >
          <el-radio
            :label="1"
            @click.native.prevent="changeRadio(1)"
            style="margin-left: 4%"
            >指定企业用户</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 成绩单设置 -->
    <el-dialog title="成绩单设置" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-form-item label="基础显示" style="margin: auto">
          <div>
            <el-checkbox v-model="ScoreCheck.Basics1"
              >显示答题人和总得分</el-checkbox
            >
          </div>
          <!-- <div>
            <el-checkbox v-model="ScoreCheck.Basics2"
              >显示正确答案和答案解析</el-checkbox
            >
          </div> -->
        </el-form-item>
        <el-form-item label="评语设置" style="margin: auto"> </el-form-item>
        <!-- 内容表单 -->
        <el-table
          :data="tableScore"
          border
          style="width: 100%"
          max-height="200"
        >
          <el-table-column
            prop="date"
            label="得分范围"
            :show-overflow-tooltip="true"
            width="75"
          >
            <template slot-scope="scope">
              {{ scope.row.minScore }}~{{ scope.row.maxScore }}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="评语"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column prop="name" width="150" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row, scope.$index)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-form-item
          label="+添加/编辑评语"
          style="margin: auto"
          class="pushclass"
        >
        </el-form-item>
        <div class="todo">
          <div class="todo-flex">
            <div class="todo-item">得分范围</div>
            <el-input v-model="editObj.minScore"></el-input> ~
            <el-input v-model="editObj.maxScore"></el-input>
          </div>
          <div class="todo-flex">
            <div class="todo-item">评语内容</div>
            <el-input
              type="textarea"
              v-model="editObj.remark"
              placeholder="请输入评语内容"
            ></el-input>
          </div>
          <div class="dialog-btn">
            <el-button size="mini" @click="success('0')">重置</el-button>
            <el-button size="mini" type="primary" @click="success('1')"
              >完成</el-button
            >
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 成绩单设置 -->
    <!-- 指定企业用户 -->
    <el-dialog
      title="指定企业用户"
      :visible.sync="enterprise"
      width="30%"
      :show-close="true"
    >
      <el-form
        class="enterprises"
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        label-width="70px"
      >
        <el-form-item label="" prop="title" class="enterprises-item">
          <el-input
            v-model="enterOpinter.title"
            placeholder="企业名称/手机号/自定义昵称"
            clearable
            size="small"
            @keyup.enter.native="GetCompanys"
          />
        </el-form-item>
        <el-form-item label="是否关联" prop="status" class="enterprises-item">
          <el-select
            v-model="enterOpinter.status"
            placeholder="请选择状态"
            clearable
            size="small"
          >
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="GetCompanys"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="posterList"
        ref="multipleTable"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
          :selectable="checkboxSelect"
        />
        <el-table-column
          label="企业名称"
          :show-overflow-tooltip="true"
          align="center"
          prop="nickName"
        />
        <el-table-column
          label="企业昵称"
          :show-overflow-tooltip="true"
          align="center"
          prop="customName"
        />
        <el-table-column
          label="手机号"
          :show-overflow-tooltip="true"
          align="center"
          prop="phonenumber"
        />
      </el-table>

      <pagination
        v-show="queryParams.total > 0"
        :total="queryParams.total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        layout="prev, pager, next"
        @pagination="GetCompanys"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="enterprise = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 指定企业用户 -->
  </div>
</template>

<script>
import {
  getCompany,
  appraisalConfig,
  getConfig,
  putConfig,
} from "../../../../api/appraisal/appraisal.js";
export default {
  props: {
    appraisalId: {
      type: String,
    },
  },
  data() {
    return {
      ConfigDTOList: [
        {
          minScore: null,
          maxScore: null,
          color: "",
          check: true,
        },
      ], //设置题目选项
      loading: false, //发布发抖
      //指定企业参数
      posterList: [], //企业数据
      handleSelec: [], //选中企业
      handleunSelec: [], //判断企业有没有修改
      handleunSelec: [], //选中企业
      enterOpinter: {
        //指定公司的标题和关联
        title: null,
        status: null,
      },
      queryParams: {
        //页数
        pageNum: 1,
        pageSize: 8,
        total: 20,
      },
      enterprise: false, //指定企业模态窗
      //指定企业参数

      dialogVisible: false, //成绩单设置模态窗
      labelPosition: "left",
      form: {
        timerStart: false, //是否定时开始
        startTime: "", //开始时间
        timerEnd: false, //是否定时结束
        endTime: "", //结束时间
        astrictAnswerTime: 0, //限制分钟
        astrictScreen: 0, //允许切屏0 不允许切屏
        showReport: 0,
        appraisalNum: 0, //0-单轮测试 1-多轮测试
        extractQuestionRule: "", //单轮多轮选择类型
        scoreRule: "", //分值设置
        submittedShow: 0, //0显示成绩单 1-显示感谢语句 2-跳转到指定页面
        submittedShowContent: "", //感谢语句
        href:"",//跳转页面地址
        permissionType: 0, //0-全部企业用户 1-指定企业用户
      },
      checkbox: {
        Time: false, //限制时间
        Screen: true, //限制切屏
        showReport: true,
      },
      radio: {
        //分值设置
        fraction1: 0,
        fraction2: 0,
        //单轮多轮选择类型
        submit1: 0,
        submit2: 0,
      },

      // 成绩单设置
      reportCardId: "", //编辑提交需携带id
      //基础显示
      ScoreCheck: {
        Basics1: 0,
        Basics2: 0,
      },
      // 新增编辑数据
      editObj: {
        minScore: null, //最小
        maxScore: null, //最大
        index: null, //是否为编辑
        remark: "", //内容
      },

      //评语设置
      tableScore: [],
      // 成绩单设置
      configId: null, //新增还是编辑
    };
  },
  mounted() {
    this.GetCompanys(); //指定企业
    getConfig(this.appraisalId).then((res) => {
      if (res.data) {
        this.configId = res.data.configId; //新增还是编辑
        let data = res.data;
        for (let item in this.form) {
          this.form[item] = data[item];
        }
        if(this.form.submittedShow==2){//判断是不是跳转到指定页面
          this.form.href=this.form.submittedShowContent
          this.form.submittedShowContent=null
        }
        if (this.form.appraisalNum == 0) {
          //单轮测试
          this.radio.fraction1 = Number(res.data.scoreRule); //分值
          this.radio.submit1 = Number(res.data.extractQuestionRule); //出题设置
        } else {
          //多轮测试
          this.radio.fraction1 = Number(res.data.scoreRule.split(",")[0]);
          this.radio.fraction2 = Number(res.data.scoreRule.split(",")[1]); //分值
          this.radio.submit1 = Number(
            Number(res.data.extractQuestionRule.split(",")[0])
          );
          this.radio.submit2 = Number(
            Number(res.data.extractQuestionRule.split(",")[1])
          ); //出题设置
        }
        this.reportCardId = res.data.eyReportCard.reportCardId;
        this.checkbox.Time = this.form.astrictAnswerTime ? true : false; //答题时间限制
        this.checkbox.Screen = this.form.astrictScreen ? true : false; //防作弊设置
        this.checkbox.showReport = this.form.showReport ? true : false; //是否展示测评报告
        this.form.timerStart = res.data.timerStart ? true : false; //定时开始checkbox
        this.form.timerEnd = res.data.timerEnd ? true : false; //定时结束checkbox
        this.handleSelec = res.data.companyIdList || []; //指定企业id
        this.handleunSelec = res.data.companyIdList || []; //判断企业有没有被修改指定企业id

        this.tableScore = JSON.parse(res.data.eyReportCard.comment) || []; // 成绩单设置
        this.ScoreCheck = {
          // 成绩单基础设置
          Basics1: res.data.eyReportCard.showScoreUser ? true : false,
          Basics2: res.data.eyReportCard.showAnswerAnalysis ? true : false,
        };
        this.ConfigDTOList.unshift(...res.data.eyAppraisalChartConfigDTOList);
      }
    });
  },
  methods: {
    //删除成绩设置
    formDelete(item, index, type) {
      //设置题型
      if (this.ConfigDTOList.length <= 2) {
        this.$message.warning("成绩不能为空");
        return;
      }
      this.ConfigDTOList.splice(index, 1);
    },
    //新增成绩单
    handleAdd(item, index) {
      let obj = {
        minScore: null,
        maxScore: null,
        color: "#ffffff",
      };
      this.ConfigDTOList.splice(this.ConfigDTOList.length - 1, 0, obj);
    },
    //禁止选中已选择页面
    checkboxSelect(row, rowIndex) {
      if (row.status == 1) {
        return false; // 禁用
      } else {
        return true; // 不禁用
      }
    },
    binding() {
      //绑定企业
      for (let i = 0; i < this.posterList.length; i++) {
        if (this.handleSelec.includes(this.posterList[i].userId)) {
          //获取已编辑获企业
          this.posterList[i].status = 1;
        }
      }
    },
    //关闭企业模态窗
    cancel() {
      this.enterprise = false;
      this.handleSelec = [];
      this.$refs.multipleTable.clearSelection();
    },
    //选择指定企业
    handleSelectionChange(val) {
      this.handleSelec = [];
      val.map((ele) => {
        if (ele.status != 1) {
          this.handleSelec.push(ele.userId);
        }
      }); //获取选中企业
    },

    //指定企业数据
    GetCompanys() {
      let request = {
        pageNum: this.queryParams.pageNum, //页码
        pageSize: this.queryParams.pageSize, //页数
        userName: this.enterOpinter.title, //标题
        status: this.enterOpinter.status, //关联
        appraisalId: this.appraisalId, //测评id
      };
      getCompany(request).then((res) => {
        if (res.code == "200") {
          this.posterList = res.rows;
          this.queryParams.total = Number(res.total);
          this.binding(); //设置已绑定企业
        }
      });
    },
    //编辑成绩
    handleEdit(item, index) {
      item.index = index; //开启编辑
      this.editObj = JSON.parse(JSON.stringify(item));
    },
    //删除成绩评语
    handleDelete(item, index) {
      this.tableScore.splice(index, 1);
    },
    changeRadio(e) {
      this.form.permissionType = e;
      if (e == 1) {
        //指定企业弹窗
        this.enterprise = true;
        if (this.configId) {
          //编辑
          setTimeout(() => {
            this.binding(); //绑定企业
          });
        }
      }
    },
    //成绩设置添加评语
    success(type) {
      //0 重置 1 添加
      if (type == "0") {
        if (this.editObj.index != null) {
          return this.$message.warning("当前处于编辑状态，不能重置数据");
        }
        this.repeat(); //重置
      } else {
        if (
          !this.editObj.minScore ||
          !this.editObj.maxScore ||
          !this.editObj.remark
        ) {
          return this.$message.warning("请先填写完内容");
        } else if (
          Number(this.editObj.minScore) >= Number(this.editObj.maxScore)
        ) {
          return this.$message.warning("最小值不能大于等于最大值");
        }

        if (this.editObj.index != null) {
          this.tableScore[this.editObj.index].minScore = this.editObj.minScore; //最小
          this.tableScore[this.editObj.index].maxScore = this.editObj.maxScore; //最大
          this.tableScore[this.editObj.index].index = this.editObj.index; //下标
          this.tableScore[this.editObj.index].remark = this.editObj.remark; //内容
          //编辑
        } else {
          //新增
          this.tableScore.push(this.editObj);
        }
        this.repeat(); //重置
      }
    },
    //成绩单重置
    repeat() {
      this.editObj = {
        minScore: null,
        maxScore: null,
        check: null,
        remark: "",
      };
    },
    gmt(GMT, type) {
      if (type) {
        if (!GMT) return false;
      }
      if (!GMT) return null;
      var data = new Date(GMT); //这里将GMT转换成Date类型以便调用Date类的函数方法,不转换的话，虽然控制台打印出来的格式一样，但却无法调用Date类的函数方法
      return (
        data.getFullYear() +
        "-" +
        String(data.getMonth() + 1).padStart(2, "0") +
        "-" + //此处+1是因为js当初设计的缺陷：它用0-11表示1-12月份。
        String(data.getDate()).padStart(2, "0") +
        " " +
        String(data.getHours()).padStart(2, "0") +
        ":" +
        String(data.getMinutes()).padStart(2, "0") +
        ":" +
        String(data.getSeconds()).padStart(2, "0")
      );
    },
    submitForm() {
      //时间设置和判断
      let startTime = this.gmt(this.form.startTime, this.form.timerStart);
      let endTime = this.gmt(this.form.endTime, this.form.timerEnd);
      if (startTime == false || endTime == false) {
        return this.$message.warning("请先选择时间");
      } else if (this.checkbox.Time && !this.form.astrictAnswerTime) {
        return this.$message.warning("请先设置答题时间");
      } else if (
        this.form.permissionType == 1 &&
        !this.handleSelec.length &&
        !this.configId
      ) {
        //新增判断 编辑不需要
        return this.$message.warning("指定企业用户不能为空");
      } else if (this.ConfigDTOList.length < 2) {
        return this.$message.warning("成绩设置不能为空");
      }
      let time = {
        startTime,
        endTime,
        timerStart: this.form.timerStart ? 1 : 0,
        timerEnd: this.form.timerEnd ? 1 : 0,
      };
      if (this.form.appraisalNum == 0) {
        //单轮测试
        this.form.scoreRule = this.radio.fraction1; //分值
        this.extractQuestionRule = this.radio.submit1; //出题设置
      } else {
        //多轮测试
        this.form.scoreRule = this.radio.fraction1 + "," + this.radio.fraction2; //分值
        this.extractQuestionRule =
          this.radio.submit1 + "," + this.radio.submit2; //出题设置
      }
      let ScoreValue = {
        //成绩单基础设置
        showScoreUser: this.ScoreCheck.Basics1 ? 1 : 0, //是否显示答题人和总得分
        showAnswerAnalysis: this.ScoreCheck.Basics2 ? 1 : 0, //是否显示正确答案和解析

        remarkDTOList: this.tableScore, //评语配置
      };
      this.form.astrictScreen = this.checkbox.Screen ? 1 : 0; //切屏限制
      this.form.showReport = this.checkbox.showReport ? 1 : 0; //是否展示测评公告
      if(this.form.submittedShow==0){//提交后设置成绩 将评语和链接清空
        this.form.submittedShowContent=null
      }else if(this.form.submittedShow==2){//提交后设置链接 将href付给submittedShowContent
        this.form.submittedShowContent=this.form.href
        delete this.form.href
      }
      
      let request = {
        appraisalId: this.appraisalId, //测评id
        ...this.form,
        ...time,
        // scoreRule: this.scoreRule, //分值
        extractQuestionRule: this.extractQuestionRule, ////出题设置
        eyReportCard: {
          ...ScoreValue, //基础答题配置
          reportCardId: this.reportCardId,
        },
        companyIdList: this.handleSelec, //指定企业
        eyAppraisalChartConfigDTOList: this.ConfigDTOList.slice(
          0,
          this.ConfigDTOList.length - 1
        ), //成绩设置
      };
      this.loading = true;
      if (this.configId) {
        //编辑
        request.configId = this.configId;
        request.companyIdList =
          JSON.stringify(this.handleunSelec) == JSON.stringify(this.handleSelec)
            ? []
            : this.handleSelec; //企业没有修改[] 修改了拿this.handleSelec
      }
      let row = this.configId ? putConfig : appraisalConfig; //新增还是编辑
      row(request)
        .then((res) => {
          this.loading = false;
          if (res.code == "200") {
            //新增

            this.$emit("target", {
              index: 2,
              // data: this.appraisalId,
            });
            // this.$router.push("./success.vue");
          }
        })
        .catch((e) => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss">
.setting {
  padding: 20px;
  border: 1px solid #e0e0e0;
}
.setting-title {
  font-weight: bold;
  display: flex;
  align-items: end;
  font-size: 16px;
  margin-bottom: 20px;
  justify-content: space-between;
  .titles {
    display: flex;
    align-items: end;
    &::before {
      content: "";
      background: #1890ff;
      width: 5px;
      height: 25px;
      margin-right: 5px;
      display: block;
    }
  }
}
.formwidth {
  width: 80%;
  margin-left: 20px;
}
.marginLeft {
  margin-left: 20px;
}
.marginRigth {
  width: 20%;
}
.margin {
  width: 18.5%;
  margin: 0px 20px 0px 7.8%;
}
.screen {
  width: 18.5%;
  margin: 0px 20px 0px 6.6%;
}
.frequency {
  // margin: 1% 0px;
  .frequency-flex {
    display: flex;
    align-items: center;

    .frequency-item {
      font-weight: bold;
      margin: 0px 5.3% 0px 4%;
      color: #000;
    }
  }
  .radio-flex {
    display: flex;
    align-items: center;
    height: 40px;
    .radio-item {
      width: 13%;
      margin-right: 10px;
    }
    .settings {
      color: #1890ff;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.preservation {
  background: darkmagenta;
  color: #fff;
}
/deep/ .el-form-item__content {
  color: #606266;
}
.pushclass {
  /deep/ .el-form-item__label {
    font-size: 12px;
    font-weight: 100;
    color: #606266;
    width: 100% !important;
    &::after {
      content: "(请注意每条评语分数范围内不能有并集)";
      margin-left: 10px;
      color: red;
    }
  }
}
.todo {
  background: rgb(248, 248, 248);
  border-radius: 12px;
  padding: 10px 20px 20px;
  .todo-flex {
    display: flex;
    line-height: 60px;
    align-items: center;
    .todo-item {
      margin-right: 5%;
    }
    /deep/ .el-input {
      width: 25%;
      margin-right: 10px;
    }
    /deep/ .el-input + .el-input {
      margin-left: 10px;
    }
    /deep/ .el-textarea {
      width: 80%;
    }
  }
}
.dialog-btn {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}
.enterprises {
  .enterprises-item {
    /deep/ .el-form-item__content {
      width: 175px;
    }
  }
}
.education-input {
  width: 49% !important;
}
.position {
  position: absolute;
  z-index: 1;
  color: red;
  margin-left: -9%;
}
</style>
