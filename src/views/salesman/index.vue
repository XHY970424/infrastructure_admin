<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="salesmanName">
        <el-input
          v-model="queryParams.salesmanName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['course:salesman:add']"
          >新增业务人员
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['course:salesman:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5"> </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="salesmanList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true" />
      <el-table-column label="名称" align="center" prop="salesmanName" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="微信号" align="center" prop="weixinNo" />
      <el-table-column label="工作时间" align="center" prop="workDays">
        <template slot-scope="scope">
          {{ scope.row.workDays }}&nbsp;&nbsp;{{ scope.row.workStartTime }}~{{
            scope.row.workEndTime
          }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="工作开始时间(小时)" align="center" prop="workStartTime"/>-->
      <!--      <el-table-column label="工作结束时间(小时)" align="center" prop="workEndTime"/>-->
      <el-table-column
        label="业务类型"
        align="center"
        :formatter="statusFormat"
        prop="type"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['course:salesman:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['course:salesman:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改2022-05-07业务人员记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="720px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="业务类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择业务人员类型">
            <el-option
              v-for="dict in courseTagOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="Number(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="salesmanName">
          <el-input v-model="form.salesmanName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="微信号" prop="weixinNo">
          <el-input v-model="form.weixinNo" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="工作时间" prop="workDays">
          <el-row :gutter="10">
            <el-col :span="9">
              <el-select v-model="workDays" multiple placeholder="请选择工作日">
                <el-option
                  v-for="item in dateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="14">
              <el-time-picker
                is-range
                v-model="workDate"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="微信二维码" prop="weixinUrl">
          <el-image
            style="width: 100px; height: 100px"
            :src="form.weixinUrl"
            v-if="form.weixinUrl"
          ></el-image>
          <ImgCutter
            ref="imgCutterModal"
            label="点击上传"
            :crossOrigin="true"
            crossOriginHeader="*"
            toolBgc="none"
            :isModal="true"
            :showChooseBtn="true"
            :lockScroll="false"
            :boxWidth="775"
            :boxHeight="458"
            :cutWidth="80"
            :cutHeight="80"
            :sizeChange="true"
            :moveAble="true"
            :originalGraph="false"
            :tool="false"
            rate="1:1"
            WatermarkText=""
            WatermarkTextFont="12px Sans-serif"
            WatermarkTextColor="#fff"
            :WatermarkTextX="0.95"
            :WatermarkTextY="0.95"
            :DoNotDisplayCopyright="true"
            @cutDown="cutDownSubject"
            v-else
          >
            <el-button
              size="small"
              type="primary"
              icon="el-icon-upload"
              slot="open"
              >上传
            </el-button>
          </ImgCutter>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSalesman,
  getSalesman,
  delSalesman,
  addSalesman,
  updateSalesman,
  uploadWxImg,
} from "@/api/course/salesman";
import Template from "@/views/certificate/template";
import ImgCutter from "vue-img-cutter";
export default {
  name: "Salesman",
  components: { Template, ImgCutter },
  watch: {
    workDays: {
      handler(newVal) {
        if (newVal.indexOf(0) != -1 && newVal.length > 1) {
          this.workDays = [0];
          return;
        } else {
          let list = [
            {
              name: "每天",
              workDays: [1, 2, 3, 4, 5, 6, 7],
            },
            {
              name: "周一至周五",
              workDays: [1, 2, 3, 4, 5],
            },
            {
              name: "周一至周六",
              workDays: [1, 2, 3, 4, 5, 6],
            },
          ];
          let index = list.findIndex(
            (item) =>
              item.workDays.filter((it) => newVal.indexOf(it) != -1).length ==
              item.workDays.length
          );
          if (index != -1) {
            this.form.workDays = list[index].name;
          } else {
            let workDayList = [1, 2, 3, 4, 5, 6];
            let name = "周";
            workDayList.forEach((item) => {
              if (newVal.indexOf(item) != -1) {
                name += `${this.convertToChinaNum(item)}`;
              }
            });
            this.form.workDays = name == "周" ? "" : name;
          }
        }
        if (newVal.indexOf(0) != -1) {
          this.form.workDays = "每天";
        }
      },
      deep: true,
    },
    workDate(newVal) {
      console.log(newVal);
    },
  },
  data() {
    return {
      //工作日
      workDays: [],
      //工作时间
      workDate: [new Date(2022, 9, 10, 9, 0), new Date(2022, 9, 10, 17, 30)],
      //工作日列表
      dateList: [
        {
          label: "每天",
          value: 0,
        },
        {
          label: "星期一",
          value: 1,
        },
        {
          label: "星期二",
          value: 2,
        },
        {
          label: "星期三",
          value: 3,
        },
        {
          label: "星期四",
          value: 4,
        },
        {
          label: "星期五",
          value: 5,
        },
        {
          label: "星期六",
          value: 6,
        },
        {
          label: "星期天",
          value: 7,
        },
      ],
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 2022-05-07业务人员记录表格数据
      salesmanList: [],
      // 弹出层标题
      title: "",
      //课程标签类型字典
      courseTagOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        salesmanName: undefined,
        phone: undefined,
        weixinNo: undefined,
        workDays: undefined,
        workStartTime: undefined,
        workEndTime: undefined,
        weixinUrl: undefined,
        tenantId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          {
            required: true,
            message: "业务人员类型",
            trigger: "change",
          },
        ],
        tenantId: [
          { required: true, message: "正式租户id不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    //数字转文字
    convertToChinaNum() {
      return (num) => {
        var arr1 = new Array(
          "零",
          "一",
          "二",
          "三",
          "四",
          "五",
          "六",
          "七",
          "八",
          "九"
        );

        var arr2 = new Array(
          "",
          "十",
          "百",
          "千",
          "万",
          "十",
          "百",
          "千",
          "亿",
          "十",
          "百",
          "千",
          "万",
          "十",
          "百",
          "千",
          "亿"
        ); //可继续追加更高位转换值

        if (!num || isNaN(num)) {
          return "零";
        }

        var english = num.toString().split("");

        var result = "";

        for (var i = 0; i < english.length; i++) {
          var des_i = english.length - 1 - i; //倒序排列设值

          result = arr2[i] + result;

          var arr1_index = english[des_i];

          result = arr1[arr1_index] + result;
        }

        //将【零千、零百】换成【零】 【十零】换成【十】

        result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十");

        //合并中间多个零为一个零

        result = result.replace(/零+/g, "零");

        //将【零亿】换成【亿】【零万】换成【万】

        result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");

        //将【亿万】换成【亿】

        result = result.replace(/亿万/g, "亿");

        //移除末尾的零

        result = result.replace(/零+$/, "");

        //将【零一十】换成【零十】

        //result = result.replace(/零一十/g, '零十');

        //貌似正规读法是零一十

        //将【一十】换成【十】

        result = result.replace(/^一十/g, "十");

        return result;
      };
    },
    initTime() {
      return (time) => {
        var hour = time.getHours();
        var minute = time.getMinutes();
        return `${hour}:${minute<10?`0${minute}`:minute}`
      };
    },
  },
  created() {
    this.getList();
    this.getDicts("type").then((response) => {
      this.courseTagOptions = response.data;
    });
  },
  methods: {
    cutDownSubject: function (res) {
      let formData = new FormData();
      formData.append("file", res.file);
      uploadWxImg(formData).then((resolve) => {
        if (resolve.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.weixinUrl = resolve.url;
          console.log(this.form);
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.courseTagOptions, row.type);
    },
    /** 查询2022-05-07业务人员记录列表 */
    getList() {
      this.loading = true;
      listSalesman(this.queryParams).then((response) => {
        this.salesmanList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        salesmanName: undefined,
        phone: undefined,
        weixinNo: undefined,
        workDays: undefined,
        workStartTime: undefined,
        workEndTime: undefined,
        weixinUrl: undefined,
        createTime: undefined,
        tenantId: undefined,
      };
      this.workDays= []
      this.workDate=[new Date(2022, 9, 10, 9, 0), new Date(2022, 9, 10, 17, 30)]
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加业务人员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSalesman(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改业务人员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if(this.workDate.length==2){
        this.form.workStartTime = this.initTime(this.workDate[0])
        this.form.workEndTime = this.initTime(this.workDate[1])
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateSalesman(this.form)
              .then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addSalesman(this.form)
              .then((response) => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除业务人员编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          return delSalesman(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.msgSuccess("删除成功");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.downLoadExcel("/course/salesman/export", this.queryParams);
    },
  },
};
</script>
