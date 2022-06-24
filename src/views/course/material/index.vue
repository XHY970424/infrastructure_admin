<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="资料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入资料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
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
          v-hasPermi="['course:courseMaterial:add']"
          >上传课件资料</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['course:courseMaterial:remove']"
          >删除</el-button
        >
      </el-col>
      <!--      排序-->
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="sort"
          v-hasPermi="['course:courseMaterial:sort']"
          >排序</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="courseMaterialList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" v-if="true" />
      <!--      <el-table-column label="课程主键id" align="center" prop="courseId" />-->
      <el-table-column label="资料名称" align="center" prop="materialName" />
      <el-table-column label="文件类型" align="center" prop="type" />
      <el-table-column label="文件大小" align="center" prop="materialSize" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 上传课程资料 -->
    <el-dialog
      title="上传资料"
      :visible.sync="open"
      width="1100px"
      append-to-body
    >
      <div class="dialog-flex">
        <!-- 上传文件 -->
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          :multiple="true"
          :http-request="importFile"
          :on-change="fileChange"
          :file-list="fileList"
          :accept="allowVideoTypes"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            <!-- 只能上传jpg/png文件，且不超过500kb -->
          </div>
        </el-upload>
        <!-- 上传文件 -->
        <div class="dialog-grouy">
          <div
            class="dialog-item"
            v-for="(item, index) in uploadList"
            :key="index"
          >
            <div class="dialog-flex">
              <el-image
                style="width: 23px; height: 23px"
                :src="`https://vo.bbazxw.com/pc_infrastructure/file/${item.type}.png`"
              ></el-image>
              <div class="dialog-text">{{ item.materialName }}</div>
            </div>
            <div class="dialog-flex">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="deleteItem(item.id, index)"
                >删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="排序"
      :visible.sync="openSort"
      width="1100px"
      append-to-body
    >
      <draggable
        :list="vueList"
        tag="transition-group"
        item-key="name"
        class="display"
        @end="datagragEnd"
      >
        <div
          class="dialog-display"
          v-for="(item, index) in dragList"
          :key="index"
        >
          <div class="dialog-title">
            <el-image
              style="width: 23px; height: 23px"
              :src="`https://vo.bbazxw.com/pc_infrastructure/file/${item.type}.png`"
            />
            <div>{{ item.materialName }}</div>
          </div>
          <el-image
            style="width: 23px; height: 23px"
            src="https://vo.bbazxw.com/pc_infrastructure/latuo.png"
          />
        </div>
      </draggable>
      <div
        class="flooer-btn"
        style="width: 100%; margin-top: 29px; text-align: center"
      >
        <el-button type="primary" @click="dragSubmit">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCourseMaterial,
  getCourseMaterial,
  delCourseMaterial,
  addCourseMaterial,
  updateCourseMaterial,
  getSortCourseMaterial,
  uploadFileLimit,
  courseMaterialSort,
} from "@/api/course/courseMaterial";
import draggable from "vuedraggable";
export default {
  name: "CourseMaterial",
  components: {
    draggable,
  },
  data() {
    return {
      //文件列表
      fileList: [],
      //上传的文件列表
      uploadList: [],
      vueList:[],
      //限制
      allowVideoTypes:
        ".doc,.gif,.pdf,.png,.ppt,.pptx,.rar,.text,.xls,.xlsx,.docx,.zip",
      // 排序
      openSort: false,
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
      // 2022-05-12课程资料上传记录表格数据
      courseMaterialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseId: undefined,
        materialName: undefined,
        type: undefined,
        materialSize: undefined,
        createTime: undefined,
        tenantId: undefined,
        url: undefined,
      },
      // 表单参数
      form: {},
      options: [
        { id: 0, name: "mp4" },
        { id: 1, name: "gif" },
        { id: 2, name: "jpg" },
        { id: 3, name: "pdf" },
        { id: 4, name: "png" },
        { id: 5, name: "ppt" },
        { id: 6, name: "rar" },
        { id: 7, name: "txt" },
        { id: 8, name: "xls" },
        { id: 9, name: "zip" },
        { id: 10, name: "doc" },
      ],
      dragList: [],
    };
  },
  created() {
    this.queryParams.courseId = this.$route.query.id || undefined;
    this.getList();
  },
  methods: {
    //删除文件
    deleteItem(id, index) {
      delCourseMaterial(id).then((res) => {
        this.uploadList.splice(index, 1);
      });
    },
    importFile() {},
    // 选中文件后的事件
    fileChange(fileObj, fileList) {
      let file = fileObj.raw;
      let formData = new FormData();
      formData.append("file", file);
      uploadFileLimit(formData).then((res) => {
        addCourseMaterial({
          materialName: res.filename,
          materialSize: res.fileSize,
          type: res.extension,
          url: res.url,
          courseId: this.queryParams.courseId,
        }).then((reslove) => {
          this.uploadList.push({
            materialName: res.filename,
            type: res.extension.toUpperCase(),
            id: reslove.data.data,
          });
        });
      });
      this.fileList = fileList;
    },
    //获取排序列表
    getSortList() {
      getSortCourseMaterial(this.queryParams.courseId).then((res) => {
        res.data.forEach((item) => {
          item.type = item.type.toUpperCase();
        });
        this.dragList = res.data;
      });
    },
    //提交排序
    dragSubmit() {
      let list = [];
      this.dragList.forEach((item, index) => {
        list.push({
          id: item.id,
          sort: index,
        });
      });
      courseMaterialSort(list).then((res) => {
        this.msgSuccess("排序成功");
        this.openSort = false;
        this.getList()
      });
    },
    //数组替换
    datagragEnd(e) {
      let { oldIndex, newIndex } = e;
      let arr = JSON.parse(JSON.stringify(this.dragList));
      if (oldIndex > newIndex) {
        arr.splice(newIndex, 0, this.dragList[oldIndex]);
        arr.splice(oldIndex + 1, 1);
      } else {
        arr.splice(newIndex + 1, 0, this.dragList[oldIndex]);
        arr.splice(oldIndex, 1);
      }
      this.dragList = arr;
    },
    /** 查询2022-05-12课程资料上传记录列表 */
    getList() {
      this.loading = true;
      listCourseMaterial(this.queryParams).then((response) => {
        this.courseMaterialList = response.rows;
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
        courseId: undefined,
        materialName: undefined,
        type: undefined,
        materialSize: undefined,
        createTime: undefined,
        tenantId: undefined,
        url: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "上传资料";
    },
    /**
     * 排序按钮
     */
    sort() {
      this.openSort = true;
      this.getSortList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getCourseMaterial(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改2022-05-12课程资料上传记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.open = false;
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除2022-05-12课程资料上传记录编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          return delCourseMaterial(ids);
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
      this.downLoadExcel("/system/courseMaterial/export", this.queryParams);
    },
  },
};
</script>
<style scoped lang="scss">
.flooer-btn {
  ::v-deep .el-button--primary {
    width: 150px;
    line-height: 18px;
  }
}
.dialog-display + .dialog-display {
  border-top: 1px solid #e0e0e0;
}
.display {
  border: 1px solid #e0e0e0;
  max-height: 550px;
  overflow-y: auto;
  display: block;
  ::v-deep .sortable-ghost {
    background: #e0e0e0 !important;
    color: #000 !important;
  }
}
.dialog-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  line-height: 50px;
  padding: 0px 20px;
  .dialog-title {
    display: flex;
    align-items: center;
    div {
      margin-left: 8px;
    }
  }
}
.dialog-flex {
  display: flex;
  .dialog-grouy {
    // padding: 10px 0px;
    width: 800px;
    margin-left: 20px;
    border: 1px solid #e0e0e0;
    max-height: 500px;
    border-radius: 10px;
    overflow-y: auto;
    .dialog-item + .dialog-item {
      border-top: 1px solid #e0e0e0;
    }
    .dialog-item {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      padding: 0px 20px;
      line-height: 50px;

      .dialog-flex {
        display: flex;
        align-items: center;
        .close {
          font-size: 16px;
          color: rgba(24, 146, 255, 1);
          font-style: normal;
          letter-spacing: 0px;
          line-height: 20px;
          text-decoration: none;
          margin-left: 10px;
        }
      }
    }
  }
}
.dialog-footer {
  margin: 0px auto;
  text-align: center;
  margin-top: 40px;
  ::v-deep .el-button--primary {
    width: 150px;
    line-height: 18px;
  }
}
</style>
