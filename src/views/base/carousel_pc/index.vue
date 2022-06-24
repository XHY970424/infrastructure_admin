<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!-- <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
        <treeselect v-model="queryParams.deptId" :options="sxdeptOptions" placeholder="请选择归属部门" style="width: 240px" />
      </el-form-item> -->
      <el-form-item label="启用状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="链接方式" prop="target">
        <el-select v-model="queryParams.target" placeholder="请选择链接方式" clearable size="small">
          <el-option :value="0" label="路由" />
          <el-option :value="1" label="外链" />
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
          v-hasPermi="['base:carouselpc:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['base:carouselpc:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['base:carouselpc:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['base:carouselpc:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="pcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="pictureId"  width="40"/>
      <el-table-column label="轮播图片" align="center" prop="url" >
        <template slot-scope="scope">
          <el-image
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.url"
            :preview-src-list="[scope.row.url]">
          </el-image >
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true"/>
      <el-table-column label="链接" align="center" prop="link" :show-overflow-tooltip="true"/>
      <el-table-column label="链接方式" align="center" prop="target" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span> {{scope.row.target == 0 ? '路由' : '外链'}} </span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="摘要" align="center" prop="summary" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['base:carouselpc:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['base:carouselpc:remove']"
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

    <!-- 添加或修改pc端轮播图对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="660px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div style="color: red; margin-left: 10px"><span>轮播图建议尺寸为1903px*446px</span></div>
        <el-form-item label="选择图片" prop="url">
          <el-upload ref="url" :file-list="imgfileList" action="" :http-request="fileUpload" :before-upload="logoBeforeUpload" :limit="1" :auto-upload="true"
                     list-type="picture" accept="image/*" name="img_file">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传轮播图</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="链接方式" prop="target">
          <el-radio-group v-model="form.target">
            <el-radio :label="0">路由</el-radio>
            <el-radio :label="1">外链</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="请输入轮播顺序" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input type="textarea" v-model="form.summary" placeholder="请输入摘要"></el-input>
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
import { imgBase64Upload,fileUpload,listPc, getPc, delPc, addPc, updatePc, exportPc } from "@/api/base/pc";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImgCutter from "vue-img-cutter";
import Template from "../../certificate/template/index";

export default {
  name: "Pc",
  components: {Template, ImgCutter,Treeselect},
  data() {
    return {
      // 图片文件数组
      imgfileList: [],
      // 状态数据字典
      statusOptions: [],
      // 截图比例
      rate: '1920：500',
      // 部门列表
      sxdeptOptions: [],
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
      // pc端轮播图表格数据
      pcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        url: undefined,
        title: undefined,
        link: undefined,
        orderNum: undefined,
        status: undefined,
        summary: undefined,
        target: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        url: [
          { required: true, message: "请选择图片", trigger: "blur" }
        ],
        title: [
            { required: true, message: "请输入标题", trigger: "blur" }
        ],
        link: [
          { required: true, message: "请输入链接", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "请输入轮播顺", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        target: [
          { required: true, message: "请选择链接方式", trigger: "blur" }
        ],
        // summary: [
        //     { required: true, message: "请输入文字摘要", trigger: "blur" }
        //   ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("putway_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDeptTreeselect();
  },
  methods: {
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.sxdeptOptions = response.data;
      });
    },
    /** 图片路径格式化函数 */
    formatterImg(imgUrl){
      return process.env.VUE_APP_BASE_API+imgUrl;
    },

    /** 上传轮播图片, 入参一定要添加file默认参数 */
    fileUpload(file) {
      fileUpload(file).then(res => {
        if(res.code==200){
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.url = res.url;
        }else{
          this.$message.error('上传图片异常')
        }
      });
    },

    /** 上传图片前的校验 */
    logoBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 5
      if (!isRightSize) {
        this.$message.error('文件大小超过 5MB')
      }
      let isAccept = new RegExp('image/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择image/*类型的文件')
      }

      // 图片文件大小限制，限制宽高分别为1920px和500px
               // if(this.form.url != 0) {
               //      let _this = this;
               //      let imgWidth="";
               //      let imgHight="";
               //      const isSize = new Promise(function (resolve, reject) {
               //          let width = 1200;
               //          // let height = 500;
               //          let _URL = window.URL || window.webkitURL;
               //          let img = new Image();
               //          img.onload = function () {
               //              imgWidth = img.width;
               //              // imgHight = img.height;
               //              // let valid = img.width == width && img.height == height;
               //               let valid = img.width == width;
               //              valid ? resolve() : reject();
               //          }
               //          img.src = _URL.createObjectURL(file);
               //   }).then(() => {
               //     return file;
               //         }, () => {
               //           _this.$message.warning({message: '上传文件的图片大小不合符标准,宽需要为1200px。当前上传图片的宽高分别为：'+imgWidth+'px和'+imgHight+'px', btn: false})
               //           return Promise.reject();
               //         });
               //       console.log(isSize);
               //       return isSize;
               //     }else {
               //       return true;
               //     }

      /*return isRightSize && isAccept*/
    },

    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },

    /** 查询pc端轮播图列表 */
    getList() {
      this.loading = true;
      listPc(this.queryParams).then(response => {
        this.pcList = response.rows;
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
        pictureId: undefined,
        url: undefined,
        title: undefined,
        link: undefined,
        orderNum: undefined,
        status: "0",
        summary: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        target: 0
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
      this.ids = selection.map(item => item.pictureId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.imgfileList=[];
      this.open = true;
      this.title = "添加pc端轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pictureId = row.pictureId || this.ids
      getPc(pictureId).then(response => {
        this.form = response.data;
        this.imgfileList = [{
          url:this.form.url
        }];
        this.open = true;
        this.title = "修改pc端轮播图";

      });

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.pictureId != undefined) {
            updatePc(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPc(this.form).then(response => {
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
      const pictureIds = row.pictureId || this.ids;
      this.$confirm('是否确认删除pc端轮播图编号为"' + pictureIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPc(pictureIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },

    /**上传(比例1:1) */
    oneTOone:function(res){
      this.rate = "1:1";
    },

    /**上传(比例16:9) */
    sixtTOnine:function(res){
      this.rate = "1920:500";
    },

    /** 截图确定按钮事件 */
    cutDown:function(res){
      imgBase64Upload(res.dataURL).then(res => {
        if(res.code==200){
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.url = res.url;
        }else{
          this.$message.error('上传图片异常')
        }
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有pc端轮播图数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPc(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .el-upload-list--picture .el-upload-list__item-thumbnail{
      width: 100%;
      height: 100%;
  }
</style>
