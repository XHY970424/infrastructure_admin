<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
        <treeselect v-model="queryParams.deptId" :options="sxdeptOptions" placeholder="请选择归属部门" style="width: 240px" />
      </el-form-item>
      <el-form-item label="试卷标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入试卷标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否收费" prop="isPremium">
        <el-select v-model="queryParams.isPremium" placeholder="请选择是否收费" clearable size="small">
          <el-option
            v-for="dict in isPremiumOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['exam:preface:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="deleteTime"
          v-hasPermi="['exam:preface:deleteTime']"
        >{{recycleBin}}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload
          class="upload-demo"
          action=""
          :on-remove="handleRemove"
          accept=".xlsx"
          :http-request="httpRequestQuestion"
        >
          <el-button
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            :loading="excelLoading"
            v-hasPermi="['exam:questions:import']"
          >批量题库导入
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="1.5">
        <a :href="questionExcelUrl" style="color: #00afff;text-decoration: underline;position: relative;top: 5px;font-size: 12px">下载导入模板</a>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="prefaceList" @selection-change="handleSelectionChange" border>
<!--      <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="图片" align="center" prop="imageUrl" >
         <template slot-scope="scope">
           <el-image
             style="width: 50px;"
             :src="scope.row.imageUrl"
             :preview-src-list="[scope.row.imageUrl]">
           </el-image >
         </template>
       </el-table-column>
      <el-table-column label="题库标题" align="center" prop="title" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="是否收费" align="center" prop="isPremium" :formatter="isPremiumFormat" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order" @click="toChdas(scope.row)">
                        <span>章节管理</span>
                    </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:preface:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteTime(scope.row)"
            v-hasPermi="['exam:preface:deleteTime']"
          >{{deorhf}}</el-button>
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

    <!-- 添加或修改题库管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片" prop="imageUrl">
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
                            :cutWidth="350"
                            :cutHeight="350"
                            :sizeChange="false"
                            :moveAble="true"
                            :originalGraph="false"
                            :tool="false"
                            rate="16:9"
                            WatermarkText="大湾区职训网"
                            WatermarkTextFont="12px Sans-serif"
                            WatermarkTextColor="#fff"
                            :WatermarkTextX="0.95"
                            :WatermarkTextY="0.95"
                            :DoNotDisplayCopyright="true"
                            @cutDown="cfxDown">
                            <el-button size="small" type="primary" icon="el-icon-upload" slot="open" >上传(比例16:9)</el-button>
                          </ImgCutter>
                        </el-form-item>
          </el-col>


          <el-col :span="12" style="margin-bottom: 22px;">
            <el-image v-if="form.imageUrl!=null && form.imageUrl!=''" width="100%" :z-index="2100"
              :src="form.imageUrl"
              :preview-src-list="[form.imageUrl]">
            </el-image >
            <el-input v-model="form.imageUrl" v-show="false" />
          </el-col>


          <el-col :span="24">
            <el-form-item label="题库标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入题库标题" />
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="是否收费">
              <el-radio-group v-model="form.isPremium">
                <el-radio
                  v-for="dict in isPremiumOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>


          <el-col :span="24" v-if="form.isPremium==1">
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入价格" />
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>


        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPreface, getPreface, delPreface, addPreface, updatePreface, exportPreface, deleteTime } from "@/api/exam/preface";
import ImgCutter from 'vue-img-cutter';
import {fileUpload } from "@/api/craftsman/artisan";
import { fileUpload2 } from '@/api/course/order'
import { GetExcelUrl } from '@/api/base/eyUsers'
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { importExam } from '@/api/exam/questions'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Preface",
  components: {ImgCutter,Treeselect},
  data() {
    return {
      excelLoading: false,
      questionExcelUrl: '',
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
      // 题库管理表格数据
      prefaceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否收费字典
      isPremiumOptions: [],
      // 状态字典
      statusOptions: [],
      // 部门列表
      sxdeptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        imageUrl: undefined,
        title: undefined,
        isPremium: undefined,
        status: undefined,
        deleteTime: undefined,
        deptId: undefined,
      },
      //回收站按钮名称
      recycleBin:'回收站',
      deorhf:'删除',
      hsz:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        imageUrl: [
          { required: true, message: "图片不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "试卷标题不能为空", trigger: "blur" }
        ],
        isPremium: [
          { required: true, message: "是否收费（0免费1收费）不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("subject_price").then(response => {
      this.isPremiumOptions = response.data;
    });
    this.getDicts("putway_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDeptTreeselect();
    this.getExcelUrl();
  },
  methods: {
    /**
     * 上传文件:批量题库
     */
    async httpRequestQuestion(params) {
      this.excelLoading = true;
      // 上传文件获取url 地址
      let fileUrl = ''
      await fileUpload2(params).then(response => {
        fileUrl = response.url
      }).catch(res => {
        this.excelLoading = false;
      })
      // 获取url地址后再讲文件传给后端
      const requestData = {
        url: fileUrl,
        excel: true
      }
      importExam(requestData).then(response => {
        if (response.data == 200) {
          this.$message.success('题库批量文件上传成功~')
          this.getList();
          this.excelLoading= false;
        }else{
          this.download(response.msg);
          this.$message.error('上传数据有误，请将数据修改后重新上传！')
          this.excelLoading = false;
        }
      }).catch(res => {
        this.excelLoading = false;
      })
    },
    handleRemove(file, fileList) {
      this.length = 0
    },
    // 获取下载excel地址
    getExcelUrl() {
      let import_question = 'import_questions'
      GetExcelUrl(import_question).then(response => {
        if (response.code == 200) {
          this.questionExcelUrl = response.msg
        }
      })
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.sxdeptOptions = response.data;
      });
    },
    /** 查询题库管理列表 */
    getList() {
      this.loading = true;
      listPreface(this.queryParams).then(response => {
        this.prefaceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否收费字典翻译
    isPremiumFormat(row, column) {
      return this.selectDictLabel(this.isPremiumOptions, row.isPremium);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        imageUrl: undefined,
        title: undefined,
        price: undefined,
        isPremium: "0",
        status: "1",
        createTime: undefined,
        createBy: undefined
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
      this.title = "添加题库管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPreface(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改题库管理";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePreface(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPreface(this.form).then(response => {
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
      this.$confirm('是否确认删除题库管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPreface(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 回收站 */
    deleteTime(){
      this.hsz=!this.hsz
      if(this.hsz){
        this.recycleBin="退出回收站";
        this.queryParams.deleteTime=1;
        this.deorhf='恢复';
      }else{
         this.recycleBin="回收站";
         this.queryParams.deleteTime=undefined;
         this.deorhf='删除';
      }
      this.handleQuery();
    },
    /** 逻辑(删除/恢复）按钮操作 */
    handleDeleteTime(row) {
      if(this.hsz){
        this.$confirm('是否确认恢复题库:"' + row.id + '、' + row.title + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return updatePreface({id:row.id,deleteTime:0});
          }).then(() => {
            this.getList();
            this.msgSuccess("恢复成功");
          }).catch(function() {});
      }else{
        const ids ={id: row.id };
        this.$confirm('是否确认删除题库:"' + row.id + '、' + row.title + '"的数据项?', "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function() {
            return deleteTime(ids);
          }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          }).catch(function() {});
          }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有题库管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPreface(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 截图16：9确定按钮事件 */
    	cfxDown:function(res){
    	  fileUpload(res).then(res => {
    	    if(res.code==200){
    	      /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
    	      this.form.imageUrl = res.url;
    	    }else{
    	      this.$message.error('上传图片异常')
          }
        });
      },
      //带参数跳转小节
      toChdas(row){
        this.$router.push({
          name:'Zhangjie',
          params:{
            prefaceId:row.id,//题库ID
          }
        })
      }
  }
};
</script>
