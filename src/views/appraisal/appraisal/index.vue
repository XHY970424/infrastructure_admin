<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="" prop="status">
        <el-select
          v-model="queryParams.publishStatus"
          placeholder="发布状态"
          clearable
          size="small"
        >
          <el-option label="已发布" :value="1" />
          <el-option label="未发布" :value="0" />
          <el-option label="已下架" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label-width="50" label="" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="输入测评关键词"
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
          v-hasPermi="['appraisal:appraisal:list']"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-if="recoveryValue == 0"
          @click="handleAdd"
          v-hasPermi="['appraisal:appraisal:add']"
          >新增测评</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          v-if="recoveryValue == 0"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete('delect')"
          v-hasPermi="['appraisal:appraisal:remove']"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          v-if="recoveryValue == 0"
          icon="el-icon-right"
          size="mini"
          @click="release(1)"
          v-hasPermi="['appraisal:appraisal:publish']"
          >发 布</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          v-if="recoveryValue == 0"
          icon="el-icon-right"
          size="mini"
          @click="release(2)"
          v-hasPermi="['appraisal:appraisal:publish']"
          >下 架</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="recovery"
          >{{ recoveryValue ? "退出回收站" : "回收站" }}</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          v-if="recoveryValue != 0"
          @click="reduction('batch')"
          v-hasPermi="['appraisal:appraisal:recover']"
          >批量还原</el-button
        >
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="posterList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="测评名称" align="center" prop="title" />
      <el-table-column label="封面图片" align="center" prop="coverPicture">
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.coverPicture"
            :preview-src-list="[scope.row.coverPicture]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="当前状态" align="center" prop="publishStatus">
        <template slot-scope="scope">
          <!-- rgb(112, 182, 3) -->
          <div
            :style="{
              color:
                scope.row.publishStatus == 0
                  ? 'rgb(2, 167, 240)'
                  : scope.row.publishStatus == 1
                  ? 'rgb(112, 182, 3)'
                  : '#999',
            }"
          >
            {{ Status[scope.row.publishStatus] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请企业数" align="center" prop="companyNum">
        <template slot-scope="scope">
          {{ scope.row.companyNum != 0 ? scope.row.companyNum : "全部" }}
        </template>
      </el-table-column>
      <el-table-column label="参评人数" align="center" prop="userNum">
        <template slot-scope="scope"
          ><div>{{ scope.row.userNum || 0 }}</div></template
        >
      </el-table-column>
      <el-table-column
        width="340"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <div v-if="recoveryValue == 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['appraisal:appraisal:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-copy-document"
              @click="Copy(scope.row)"
              v-hasPermi="['appraisal:appraisal:copy']"
              >复制</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-magic-stick"
              @click="preview(scope.row)"
              >预览</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="Statis(scope.row)"
              :disabled="scope.row.publishStatus == 0"
              >统计&分析</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['appraisal:appraisal:remove']"
              >删除</el-button
            >
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-refresh"
              @click="reduction(scope.row)"
              >还原</el-button
            >
          </div>
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
    <Preview
      :dialogVisible="dialogVisible"
      :appraisalId="previewList"
      @colse="colse"
    />
  </div>
</template>

<script>
import Preview from "../../../components/Preview/index.vue";
import {
  getlist,
  updStatus,
  delStatus,
  recover,
  getcopy,
} from "@/api/appraisal/appraisal";

export default {
  name: "Poster",
  components: { Preview },
  data() {
    return {
      formInline: {
        user: "",
        region: "",
      },
      dialogVisible: false, //预览模态窗
      previewList: "", //预览数据
      Status: ["未发布", "已发布", "已下架"],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 总条数
      total: 0,
      // 数据
      posterList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        publishStatus: undefined,
      },
      // 表单参数
      form: {},
      //回收站
      recoveryValue: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //预览模态窗
    colse(e) {
      this.dialogVisible = e;
    },
    //回收站
    recovery(e) {
      if (this.recoveryValue == 0) {
        this.recoveryValue = 1;
      } else {
        this.recoveryValue = 0;
      }
      this.getList();
    },
    // 统计与分析
    Statis(item) {
      this.$router.push({
        path: "appraisalStatistics",
        query: { appraisalId: item.appraisalId },
      });
    },
    //创建测评
    handleAdd() {
      this.$router.push("./createAppraisal");
      localStorage.removeItem("Setting_cruuter");//删除缓存
    },
    //1发布2下架
    release(e) {
      let request = {
        publishStatus: e,
        appraisalIds: this.ids,
      };
      updStatus(request).then((res) => {
        if ((res.code = "200")) {
          this.getList();
        }
      });
    },
    //复制
    Copy(item) {
      getcopy(item.appraisalId).then((res) => {
        if (res.code == 200) {
          this.$message.success("复制成功");
          this.getList();
        }
      });
    },
    //预览
    preview(item) {
      this.previewList = item.appraisalId;
      this.dialogVisible = true;
      console.log("预览", item);
    },
    //修改
    handleUpdate(e) {
      this.$router.push({
        path: "createAppraisal",
        query: { appraisalId: e.appraisalId },
      });
    },
    //删除
    handleDelete(item) {
      if (item == "delect" && !this.ids.length) {
        return this.$message.warning("请先选择您要删除的选项");
      }
      let request = item == "delect" ? this.ids : item.appraisalId;
      delStatus(request).then((res) => {
        if ((res.code = "200")) {
          this.getList();
        }
      });
    },
    //还原
    reduction(item) {
      if (item == "batch" && !this.ids.length) {
        return this.$message.warning("请先选择您要还原的选项");
      }
      let request = item == "batch" ? this.ids : [item.appraisalId];
      recover({ appraisalIds: request }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          this.getList();
        }
      });
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getlist({ ...this.queryParams, deleteFlag: this.recoveryValue }).then(
        (res) => {
          this.posterList = res.rows;
          this.total = Number(res.total);
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.appraisalId);
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
  }
  .dialog-show {
    background: rgb(2, 167, 240);
  }
}
/deep/.el-dialog__body {
  padding: 0px 0px;
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
.dialog-option {
  margin: 0px 20px;
  padding: 20px 10px;
  .option-title {
    font-size: 15px;
    color: #606266;
    padding-bottom: 15px;
  }
  .dialog-item {
    padding-bottom: 30px;
  }
  .option-radio + .option-radio {
    padding-top: 10px;
  }
}
</style>
