<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属类别" prop="helpCategoryId">
        <treeselect v-model="queryParams.helpCategoryId" style="width: 240px" :options="categoryList" :normalizer="normalizer" placeholder="请选择所属类别"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="草稿" :value="0"/>
          <el-option label="上架" :value="1"/>
          <el-option label="下架" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select v-model="queryParams.isRecommend" placeholder="请选择是否推荐" clearable size="small">
          <el-option label="不推荐" :value="0"/>
          <el-option label="推荐" :value="1"/>
        </el-select>
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
          v-hasPermi="['help:helpcontent:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['help:helpcontent:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['help:helpcontent:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="upDownOpen=true"
          v-hasPermi="['help:helpcontent:updown']"
        >上架下架</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="helpcontentList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="helpContentId" />
      <el-table-column label="所属类别" align="center" prop="categoryTitle" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color: #1ab394">上架</span>
          <span v-if="scope.row.status === 0">草稿</span>
          <span v-if="scope.row.status === 2" style="color: #f00208">下架</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend" >
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend === 1" style="color: #00AFFF">推荐</span>
          <span v-if="scope.row.isRecommend === 0">不推荐</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="issueTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="previewDetails(scope.row.helpContentId)"
          >预览</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['help:helpcontent:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['help:helpcontent:remove']"
          >删除</el-button>
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

    <!-- 添加或修改帮助中心内容对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属类别" prop="helpCategoryId">
<!--          <el-select v-model="form.helpCategoryId" placeholder="请选择所属类别" clearable size="small">-->
<!--            <el-option v-for="item in categoryList" :label="item.title" :value="item.helpCategoryId"/>-->
<!--          </el-select>-->
          <treeselect v-model="form.helpCategoryId" :options="categoryList" :disable-branch-nodes="true" :normalizer="normalizer" placeholder="请选择所属类别"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="是否推荐" prop="isRecommend">
          <el-radio-group v-model="form.isRecommend">
            <el-radio :label="0">不推荐</el-radio>
            <el-radio :label="1">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <EditorTow id="contentEditor" v-if="open" height="450" v-model="form.content"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  是否上架  -->
    <el-dialog title="上架下架" :visible.sync="upDownOpen" width="400px" append-to-body>
      <el-row :gutter="25" class="mb8">
        <el-col :span="12">
          <el-radio-group v-model="chooseStatus">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="confirmStatus">确 定</el-button>
        <el-button @click="upDownOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listHelpcontent,
  getHelpcontent,
  delHelpcontent,
  addHelpcontent,
  updateHelpcontent,
  exportHelpcontent,
  getHelpCategory,
  upDownData } from "@/api/help/helpcontent";
import EditorTow from "@/components/Tinymce";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "Helpcontent",
  components: {EditorTow, Treeselect},
  data() {
    return {
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
      // 帮助中心内容表格数据
      helpcontentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        helpCategoryId: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        status: undefined,
        isRecommend: undefined,
        issueTime: undefined,
        issueBy: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        helpCategoryId: [
          { required: true, message: "所属类别不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        isRecommend: [
          { required: true, message: "是否推荐不能为空", trigger: "blur" }
        ],
      },
      categoryList: [],
      // 上架下架选中值
      chooseStatus: 1,
      // 上架下架弹出层状态
      upDownOpen: false,
    };
  },
  created() {
    getHelpCategory().then(res => {
      // this.categoryList = res.data;
      this.categoryList = this.handleTree(res.data, 'helpCategoryId', 'pid');
    });
    this.getList();
  },
  methods: {
    /** 转换专题分类 数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.helpCategoryId,
        label: node.title,
        children: node.children
      }
    },
    /** 详情预览 */
    previewDetails(row) {
      const domain = this.$store.state.user.tenantUrl
      let url;
      if (domain) {
        url = 'https://' + domain + '/helpCenter/helpDetils?helpContentId=' + row + '&sign=1';
      }else {
        url = 'https://www.bbazxw.com/helpCenter/helpDetils?helpContentId=' + row + '&sign=1';
      }
      window.open(url);
    },
    // 上架下架
    confirmStatus() {
      let data = {};
      data.status = this.chooseStatus;
      data.ids = this.ids;
      upDownData(data).then(res => {
        this.getList();
        this.upDownOpen = false;
      })
    },
    /** 查询帮助中心内容列表 */
    getList() {
      this.loading = true;
      listHelpcontent(this.queryParams).then(response => {
        this.helpcontentList = response.rows;
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
        helpContentId: undefined,
        helpCategoryId: undefined,
        title: undefined,
        summary: undefined,
        content: undefined,
        status: 0,
        isRecommend: 0,
        issueTime: undefined,
        issueBy: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined
      };
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
      this.ids = selection.map(item => item.helpContentId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加帮助中心内容";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const helpContentId = row.helpContentId || this.ids
      getHelpcontent(helpContentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改帮助中心内容";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.helpContentId != undefined) {
            updateHelpcontent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addHelpcontent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const helpContentIds = row.helpContentId || this.ids;
      this.$confirm('是否确认删除帮助中心内容编号为"' + helpContentIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delHelpcontent(helpContentIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有帮助中心内容数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHelpcontent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
