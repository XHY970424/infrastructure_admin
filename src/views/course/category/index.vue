<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">


      <el-form-item label=""   prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          placeholder="请输入课程类名"
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
          v-hasPermi="['eycode:category:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:category:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:category:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:category:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
<!--      <el-table-column label="父ID" align="center" prop="pid" />-->
      <el-table-column label="课程类名" align="center" prop="categoryName" />
      <el-table-column label="课程类别封面" align="center" prop="image" :show-overflow-tooltip="true">
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]">
          </el-image >
        </template>
      </el-table-column>
      <el-table-column label="路径"   align="center" prop="path" />
      <el-table-column label="排序"   align="center" prop="sort" />

      <el-table-column label="是否显示"  prop="status" :formatter="statusFormat" align="center"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:category:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:category:remove']"
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

    <!-- 添加或修改课程分类 对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
<!--        <el-form-item label="父ID" prop="pid">-->
<!--          <el-input v-model="form.pid" placeholder="请输入父ID" />-->
<!--        </el-form-item>-->
        <el-form-item label="课程类名" prop="categoryName">
          <el-input v-model="form.categoryName" :maxlength="8" placeholder="请输入课程分类名" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入跳转路径" />
        </el-form-item>


          <el-form-item label="封面" prop="image">
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
              :cutWidth="250"
              :cutHeight="250"
              :sizeChange="true"
              :moveAble="true"
              :originalGraph="false"
              :tool="false"
              :rate="rate"
              WatermarkText="大湾区职训网"
              WatermarkTextFont="12px Sans-serif"
              WatermarkTextColor="#fff"
              :WatermarkTextX="0.95"
              :WatermarkTextY="0.95"
              :DoNotDisplayCopyright="true"
              @cutDown="cutDownAuthor">
              <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="oneTOone">上传(比例1:1)</el-button>
              <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="sixtTOnine">上传(比例16:9)</el-button>
            </ImgCutter>

            <el-image v-if="form.image!=null && form.image!=''" style="max-width: 80px;max-height: 80px"
                      :src="form.image"
                      :preview-src-list="[form.image]">
            </el-image >

            <el-input v-model="form.image" v-show="false" />

          </el-form-item>




        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" :max="100" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in isPutwayOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { imgBase64Upload, listCategory, getCategory, delCategory, addCategory, updateCategory, exportCategory } from "@/api/course/category";
  import ImgCutter from "vue-img-cutter";

  export default {
    name: "Category",
    components: {ImgCutter},
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
        // 课程分类 表格数据
        categoryList: [],

        // 截图比例
        rate: '16:9',

        //是否上架数据字典
        isPutwayOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          pid: undefined,
          categoryName: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          pid: [
            { required: true, message: "父ID不能为空", trigger: "blur" }
          ],
          categoryName: [
            { required: true, message: "课程分类名不能为空", trigger: "blur" }
          ],
          image: [
            { required: true, message: "封面不能为空", trigger: "blur" }
          ],
          path: [
            { required: true, message: "路径不能为空", trigger: "blur" }
          ],
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("is_status").then(response => {
        this.isPutwayOptions = response.data;
      });
    },
    methods: {
      /** 查询课程分类 列表 */
      getList() {
        this.loading = true;
        listCategory(this.queryParams).then(response => {
          this.categoryList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      // 字典状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.isPutwayOptions, row.status);
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
          pid: undefined,
          categoryName: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined
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
        this.ids = selection.map(item => item.id)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加课程分类 ";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getCategory(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改课程分类 ";
        });
      },

      /**上传(比例1:1) */
      oneTOone:function(res){
        this.rate = "1:1";
      },

      /**上传(比例16:9) */
      sixtTOnine:function(res){
        this.rate = "16:9";
      },

      cutDownAuthor:function(res){
        imgBase64Upload(res.dataURL).then(res => {
          if(res.code==200){
            /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
            this.form.image = res.url;
          }else{
            this.$message.error('上传图片异常')
          }
        });
      },

      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateCategory(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addCategory(this.form).then(response => {
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
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除课程分类 编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCategory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有课程分类 数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCategory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
