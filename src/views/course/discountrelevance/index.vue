<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- el-form-item label="折扣表id" prop="discountId">
        <el-input
          v-model="queryParams.discountId"
          placeholder="请输入折扣表id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item -->
      <!-- el-form-item label="关联表id" prop="tableId">
        <el-input
          v-model="queryParams.tableId"
          placeholder="请输入关联表id(课程id或专题id)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item -->
      <el-form-item label="产品类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option label="课程" :value="0"/>
          <el-option label="专题" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程/专题名称" label-width="100" prop="type">
        <el-input
          v-model="queryParams.searchName"
          placeholder="课程/专题名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:discountrelevance:add']"
        >新增
        </el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:discountrelevance:edit']"
        >修改</el-button>
      </el-col -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:discountrelevance:remove']"
        >删除
        </el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:discountrelevance:export']"
        >导出</el-button>
      </el-col -->
    </el-row>

    <el-table v-loading="loading" :data="discountrelevanceList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="discountRelevanceId"/>
      <!--      <el-table-column label="折扣表id" align="center" prop="discountId" />-->
      <el-table-column label="课程/专题名称" align="center" prop="tableId">
        <template slot-scope="scope">
          <span> {{ scope.row.subjectTitle ? scope.row.subjectTitle : scope.row.specialName }} </span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span> {{scope.row.type == 0 ? "课程" : "专题" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="原价(元)" align="center" prop="price"/>
      <el-table-column label="折后价(元)" align="center" prop="discountPrice"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:discountrelevance:edit']"
          >修改
          </el-button -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:discountrelevance:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改折扣关联对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <div class="div">
        <div class="transfer">
          <p>选择课程</p>
          <el-transfer filterable v-model="courseValue" :data="courseArray" :titles="['可选课程', '已选课程']"
                       filter-placeholder="按名称搜索"></el-transfer>
        </div>
        <div class="transfer">
          <p>选择专题</p>
          <el-transfer filterable v-model="specialValue" :data="specialArray" :titles="['可选专题', '已选专题']"
                       filter-placeholder="按名称搜索"></el-transfer>
        </div>
      </div>
      <!-- el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="折扣表id" prop="discountId">
          <el-input v-model="form.discountId" placeholder="请输入折扣表id" />
        </el-form-item>
        <el-form-item label="关联表id(课程id或专题id)" prop="tableId">
          <el-input v-model="form.tableId" placeholder="请输入关联表id(课程id或专题id)" />
        </el-form-item>
        <el-form-item label="类型0-课程 1-专题">
          <el-select v-model="form.type" placeholder="请选择类型0-课程 1-专题">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
      </el-form -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addDiscountrelevance,
    delDiscountrelevance,
    exportDiscountrelevance,
    getDiscountrelevance,
    listDiscountrelevance
  } from "@/api/course/discountrelevance";

  import {queryCourseList} from '@/api/course/subject'
  import {querySpecialList} from '@/api/course/special'
  import Template from "../../certificate/template/index";


  export default {
    name: "Discountrelevance",
    components: {Template},
    data() {
      return {
        // 折扣id
        discountId: undefined,
        // 课程和专题
        courseArray: [],
        courseValue: [],
        specialArray: [],
        specialValue: [],
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 折扣关联表格数据
        discountrelevanceList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          discountId: undefined,
          tableId: undefined,
          type: undefined,
          searchName: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          discountId: [
            {required: true, message: "折扣表id不能为空", trigger: "blur"}
          ],
          tableId: [
            {required: true, message: "关联表id(课程id或专题id)不能为空", trigger: "blur"}
          ],
          type: [
            {required: true, message: "类型0-课程 1-专题不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      // 路由获取折扣id
      this.discountId = this.$route.params && this.$route.params.discountId;
      this.queryParams.discountId = this.discountId
      this.getList();
      this.getCourseList();
      this.getSpecialList();
    },
    methods: {
      /** 查询课程列表 */
      getCourseList() {
        queryCourseList().then(res => {
          let data = res.data
          const dataArr = []
          for (let i = 0; i < data.length; i++) {
            dataArr.push({
              key: data[i].id,
              label: data[i].subjectTitle
            })
          }
          this.courseArray = dataArr
          this.courseValue = []
        })
      },
      /** 查询专题列表 */
      getSpecialList() {
        querySpecialList().then(res => {
          let data = res.data
          const dataArr = []
          for (let i = 0; i < data.length; i++) {
            dataArr.push({
              key: data[i].specialId,
              label: data[i].specialName
            })
          }
          this.specialArray = dataArr
          this.specialValue = []
        })
      },
      /** 查询折扣关联列表 */
      getList() {

        this.loading = true;
        listDiscountrelevance(this.queryParams).then(response => {
          this.discountrelevanceList = response.rows;
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
          discountRelevanceId: undefined,
          discountId: undefined,
          tableId: undefined,
          type: undefined,
          createTime: undefined,
          createBy: undefined,
          updateTime: undefined,
          updateBy: undefined
        };
        this.courseValue = [];
        this.specialValue = [];
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
        this.ids = selection.map(item => item.discountRelevanceId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加折扣关联";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const discountRelevanceId = row.discountRelevanceId || this.ids
        getDiscountrelevance(discountRelevanceId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改折扣关联";
        });
      },
      /** 提交按钮 */
      submitForm: function () {
        if (!this.discountId) {
          return this.msgError("参数错误!");
        }
        if (this.courseValue.length < 1 && this.specialValue.length < 1) {
          return this.msgError("请选择课程或专题");
        }
        let data = {};
        data.discountId = this.discountId;
        data.courseIds = this.courseValue;
        data.specialIds = this.specialValue;
        // 发送请求
        addDiscountrelevance(data).then(res => {
          this.msgSuccess(res.msg);
          this.getList();
          this.open = false;
        }).catch(() => { })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const discountRelevanceIds = row.discountRelevanceId || this.ids;
        this.$confirm('是否确认删除折扣关联编号为"' + discountRelevanceIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDiscountrelevance(discountRelevanceIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function () {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有折扣关联数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportDiscountrelevance(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function () {
        });
      }
    }
  };
</script>

<style>

</style>
