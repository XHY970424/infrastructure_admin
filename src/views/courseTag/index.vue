<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="标签名称" prop="tagName">
        <el-input
          v-model="queryParams.tagName"
          placeholder="请输入标签名称"
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
          v-hasPermi="['resource:courseTag:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-menu"
          size="mini"
          @click="handleClassify"
          v-hasPermi="['resource:courseTag:add']"
          >标签分类
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
          v-hasPermi="['resource:courseTag:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['resource:courseTag:export']"
          >导出
        </el-button>
      </el-col>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table
      v-loading="loading"
      :data="courseTagList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" type="index" width="50" align="center" />
      <el-table-column
        label="课程标签主键id"
        align="center"
        prop="id"
        v-if="false"
      />
      <el-table-column label="标签名称" align="center" prop="tagName" />
      <el-table-column label="搜索量" align="center" prop="tagSearches" />
      <el-table-column label="匹配度" align="center" prop="tagMatch" />
      <el-table-column label="标签类型" align="center" prop="tagClassName">
        <template slot-scope="scope">
          <span>{{
            scope.row.tagClassId == 0 ? "普通" : scope.row.tagClassName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
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
            v-hasPermi="['resource:courseTag:edit']"
            >修改
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

    <!-- 添加或修改2022-04-24课程标签对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="form.tagName" :maxlength="10" placeholder="请输入标签名称" />
        </el-form-item>
        <!--        <el-form-item label="创建时间" prop="createTime">-->
        <!--          <el-date-picker clearable size="small"-->
        <!--                          v-model="form.createTime"-->
        <!--                          type="datetime"-->
        <!--                          value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                          placeholder="选择创建时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="创建人" prop="createBy">-->
        <!--          <el-input v-model="form.tagName" placeholder="请输入创建人"/>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 标签分类对话框 -->
    <el-dialog
      title="标签分类"
      :visible.sync="openClassify"
      width="1200px"
      append-to-body
    >
      <div class="classify-box flex flex-center flex-between">
        <div class="classify">
          <el-scrollbar style="height: 100%" ref="scrollbar" v-if="anew">
            <div class="flex flex-center">
              <div
                class="item flex flex-center"
                :class="classifyId == item.id ? 'item-on' : ''"
                v-for="(item, index) in classifyList"
                :key="index"
                @click.stop="selectClassify(item.id)"
              >
                <div v-show="!manage">
                  {{ item.tagClassName }}
                </div>
                <el-input
                  v-model="item.tagClassName"
                  placeholder="请输入分类名称"
                  v-show="manage"
                  clearable
                  size="small"
                  class="item-name"
                  :maxlength="8"
                  @blur.stop="updateClassify(item.tagClassName, item.id)"
                />
                <i
                  class="el-icon-close close-btn"
                  @click.stop="delClassify(item.id, index)"
                  v-show="manage"
                ></i>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="flex flex-center">
          <el-button
            type="primary"
            v-show="!isAdd"
            @click="isAdd = true"
            style="margin-right: 20px"
            round
            >新增</el-button
          >
          <div class="add-box" v-show="isAdd">
            <el-input
              v-model="classify"
              placeholder="请输入分类名称"
              clearable
              size="small"
              class="item-name"
              :maxlength="8"
              @blur="addClassify"
            />
          </div>
          <el-button
            type="primary"
            v-show="!manage"
            @click="manageClassify"
            round
            :plain="!manage"
            >管理标签分类</el-button
          >
          <el-button
            type="primary"
            v-show="manage"
            @click="submitClassify"
            round
            >确定</el-button
          >
        </div>
      </div>

      <div class="classify-tag">
        <el-tag
          :key="index"
          class="tag-item"
          v-for="(tag, index) in tagByClassify"
          closable
          :disable-transitions="false"
          @close="handleClose(tag,index)"
        >
          {{tag.tagName}}
        </el-tag>
      </div>

      <el-form
        :model="tagParams"
        ref="tagForm"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="标签名称" prop="tagName">
          <el-input
            v-model="tagParams.tagName"
            placeholder="请输入标签名称"
            clearable
            size="small"
            @keyup.enter.native="getTag"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getTag"
            >搜索</el-button
          >
          <el-button icon="el-icon-plus" size="mini" @click="handleAddTag"
            >加入分类</el-button
          >
        </el-form-item>
      </el-form>
      <div class="tag-list">
        <el-scrollbar style="height: 100%">
          <el-tag
            :key="index"
            class="tag-item"
            v-for="(tag, index) in tagList"
            @click="tag.isSelect = !tag.isSelect"
            :effect="tag.isSelect ? 'dark' : 'plain'"
          >
            {{ tag.tagName }}
          </el-tag>
        </el-scrollbar>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCourseTag,
  getCourseTag,
  delCourseTag,
  addCourseTag,
  updateCourseTag,
  getCourseTagClass,
  addCourseTagClass,
  updateCourseTagClass,
  delCourseTagClass,
  getTagClassById,
  getTagClassList,
  tagAddClass,
  delTagClassById
} from "@/api/cms/courseTag";
import { downLoadExcel } from "../../utils/download";
export default {
  name: "CourseTag",
  data() {
    return {
      //是否选中标签
      isSelect: "",
      //重新渲染
      anew: true,
      //是否新增分类
      isAdd: false,
      //新增分类
      classify: "",
      //标签分类列表
      classifyList: [],
      //未分配的普通标签
      tagList: [],
      //未分配的普通标签参数
      tagParams: {
        tagName: "",
      },
      //选中的分类id
      classifyId: "",
      //分类下的标签列表
      tagByClassify: [],
      //是否管理标签
      manage: false,
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
      // 4课程标签表格数据
      courseTagList: [],
      // 弹出层标题
      title: "",
      //课程标签类型字典
      courseTagOptions: [],
      // 是否显示弹出层
      open: false,
      //是否显示标签分类弹出层
      openClassify: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        tagName: undefined,
        createTime: undefined,
        tagSearches: undefined,
        tagMatch: undefined,
        tagType: undefined,
        tenantId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        tagName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" },
        ],
        updateBy: [
          { required: true, message: "更新人不能为空", trigger: "blur" },
        ],
        tenantId: [
          { required: true, message: "正式租户id不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("course_tag_type").then((response) => {
      this.courseTagOptions = response.data;
    });
  },
  methods: {
    //删除分类下的标签
    handleClose(tag,index){
      delTagClassById(tag.id).then(res=>{
        this.tagByClassify.splice(index, 1);
        this.getTag()
        this.getList()
      })
    },
    //选择分类-获取分类下的标签列表
    selectClassify(id){
      this.classifyId = id
      this.getTagByClass()
    },
    //分类下的标签列表
    getTagByClass() {
      getTagClassById(this.classifyId).then((res) => {
        this.tagByClassify = res.data
      });
    },
    //加入分类
    handleAddTag() {
      let id = []
      if(this.tagList.filter(item=>item.isSelect).length==0){//遍历列表看看是否有选中的
        this.msgError("请先选择标签");
        return;
      }
      this.tagList.forEach(item=>{
        if(item.isSelect){//把选中的push进id数组
          id.push(item.id)
        }
      })
      tagAddClass({
        tagClassIds:this.classifyId,
        id
      }).then(res=>{
        this.getTag()
        this.getTagByClass()
        this.getList()
      })
    },
    //删除标签分类
    delClassify(id, index) {
      delCourseTagClass(id).then((res) => {
        this.classifyList.splice(index, 1);
      });
    },
    //修改标签
    updateClassify(name, id) {
      if (name == "") {
        this.msgError("标签名称不能为空");
        return;
      }
      updateCourseTagClass({
        id,
        tagClassName: name,
      });
    },
    //管理标签分类
    manageClassify() {
      this.manage = true;
      this.anew = false;
      setTimeout(() => {
        this.anew = true;
      });
    },
    //获取标签分类列表
    getClassify(isLast) {
      getCourseTagClass().then((res) => {
        this.classifyList = res.data;
        if (isLast) {
          this.anew = false;
          setTimeout(() => {
            this.anew = true;
            this.$nextTick(() => {
              let height = this.$refs.scrollbar.wrap.scrollWidth;
              this.$refs.scrollbar.wrap.scrollTo(height, 0);
            });
          });
          this.classifyId = res.data[Number(res.data.length-1)].id
          this.getTagByClass()
        }else{
          this.classifyId = res.data[0].id
          this.getTagByClass()
        }
      });
    },
    //获取未分配的标签列表
    getTag() {
      getTagClassList(this.tagParams).then((res) => {
        res.data.forEach((item) => {
          item.isSelect = false;
        });
        this.tagList = res.data;
      });
    },
    //提交管理标签分类
    submitClassify() {
      this.manage = false;
      this.getClassify();
      this.anew = false;
      setTimeout(() => {
        this.anew = true;
      });
    },
    //新增分类标签
    addClassify() {
      if (this.classify == "") {
        this.msgError("标签名称不能为空");
        return;
      }
      if (this.classifyList.length >= 20) {
        this.msgError("标签分类最多20个");
        return;
      }
      addCourseTagClass(this.classify).then((res) => {
        this.isAdd = false;
        this.getClassify(true);
      });
    },
    //打开标签分类
    handleClassify() {
      this.openClassify = true;
      this.getClassify();
      this.getTag();
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.courseTagOptions, row.tagType);
    },
    /** 查询课程标签列表 */
    getList() {
      this.loading = true;
      listCourseTag(this.queryParams).then((response) => {
        this.courseTagList = response.rows;
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
        tagName: undefined,
        createTime: undefined,
        tagSearches: undefined,
        tagMatch: undefined,
        updateTime: undefined,
        createBy: undefined,
        updateBy: undefined,
        tenantId: undefined,
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
      this.title = "添加课程标签";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getCourseTag(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改课程标签";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCourseTag(this.form)
              .then((response) => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addCourseTag(this.form)
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
        '是否确认删除2022-04-24课程标签编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          return delCourseTag(ids);
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
      downLoadExcel("/resource/courseTag/export", this.queryParams);
    },
  },
};
</script>
<style lang="scss" scoped>
.add-box {
  height: 48px;
  line-height: 48px;
  border: 1px solid #e4e7ed;
  font-size: 18px;
  color: #333;
  text-align: center;
  padding: 0 10px;
  margin-right: 10px;
  input {
    width: 160px;
    border: none;
  }
}
.classify {
  width: 70%;
  height: 48px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  /deep/.el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
    white-space: nowrap;
  }

  .item {
    cursor: pointer;
    padding: 0 20px;
    height: 48px;
    border: 1px solid #e4e7ed;
    border-right: none;
    font-size: 18px;
    color: #333;
    &:last-child {
      border-right: 1px solid #e4e7ed;
    }

    .close-btn {
      margin-left: 20px;
    }

    .item-name {
      width: 160px;
      border: none;
    }

    &:hover {
      color: #409eff;
    }
  }

  .item-on {
    color: #409eff;
    border-bottom-color: transparent;
  }
}

.classify-tag {
  width: 100%;
  padding-top: 20px;
  height: 260px;
  overflow: hidden;
  .tag-item {
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
.tag-list {
  width: 100%;
  height: 160px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .tag-item {
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
  }
}
.flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-start {
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-align: flex-start;
  -moz-box-align: flex-start;
  -webkit-box-align: flex-start;
}

.flex-end {
  align-items: flex-end;
  -webkit-align-items: flex-end;
  box-align: flex-end;
  -moz-box-align: flex-end;
  -webkit-box-align: flex-end;
}

.flex-center {
  align-items: center;
  -webkit-align-items: center;
  box-align: center;
  -moz-box-align: center;
  -webkit-box-align: center;
}

.flex-jend {
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -moz-box-pack: flex-end;
  -webkit--moz-box-pack: flex-end;
  box-pack: flex-end;
}

.flex-jcenter {
  -webkit-justify-content: center;
  justify-content: center;
  -moz-box-pack: center;
  -webkit--moz-box-pack: center;
  box-pack: center;
}

.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -moz-box-pack: space-between;
  -webkit--moz-box-pack: space-between;
  box-pack: space-between;
}

.flex-column {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
}

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -webkit-box-lines: multiple;
  -moz-flex-wrap: wrap;
  flex-wrap: wrap;
}
</style>
