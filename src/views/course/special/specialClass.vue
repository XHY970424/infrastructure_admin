<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="" prop="classId">
        <el-input
          v-model="queryParams.classId"
          placeholder="id/班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
        <treeselect v-model="queryParams.deptId" :options="sxdeptOptions" placeholder="请选择归属部门" style="width: 240px" />
      </el-form-item> -->
      <el-form-item label="开班时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="班级开始时间"
          end-placeholder="班级结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-if="queryParams.specialId != null"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:class:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-if="queryParams.specialId == null"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:class:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="classList" @selection-change="handleSelectionChange">
      <el-table-column label="ID" align="center" prop="id" />
      <!-- <el-table-column label="班级编号" header-align="center" prop="classId" /> -->
      <el-table-column label="班级名称" header-align="center" width="140" prop="className" :show-overflow-tooltip="true" v-if="queryParams.subjectId == null">
        <!-- <template slot-scope="scope"> -->
          <!-- <el-button  type="text" size="small" @click="handleDetailsAudit(scope.row)">{{scope.row.className}}</el-button> -->
          <!-- <el-button  type="text" size="small">{{scope.row.className}}</el-button> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="班级名称" align="center" prop="className"  :show-overflow-tooltip="true" v-if="queryParams.subjectId != null"/>
      <el-table-column label="对应专题" header-align="center" align="center" prop="specialName"  :show-overflow-tooltip="true" width="130px"/>
      <el-table-column label="计划人数" align="center" prop="number" />
      <el-table-column label="招生人数" align="center" prop="gnumber" />
      <!-- <el-table-column label="授课人" align="center" prop="teacherName" /> -->
      <!-- <el-table-column label="授课地点" header-align="center" width="180" prop="region"  :show-overflow-tooltip="true" /> -->
      <!-- <el-table-column label="审核状态" align="center" prop="audit" :formatter="auditFormat" /> -->
      <!-- <el-table-column label="审核时间" align="center" prop="auditTime" :show-overflow-tooltip="true" width="180"/> -->
      <!-- <el-table-column label="审核人" header-align="center" prop="auditPeople" /> -->
      <!-- <el-table-column label="审核内容" header-align="center" prop="auditCause" :show-overflow-tooltip="true"/> -->
      <el-table-column label="班级开始时间" align="center" prop="classBeginTime" width="170"/>
      <el-table-column label="班级结束时间" align="center" prop="classEndTime" width="170" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:class:edit']"
          >修改</el-button>
          <el-button v-if="queryParams.subjectId == null"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:class:remove']"
          >删除</el-button>

<!--          <el-button-->
<!--                     size="mini"-->
<!--                     type="text"-->
<!--                     icon="el-icon-delete"-->
<!--                     @click="handleDeleteStatus(scope.row)"-->
<!--                     v-hasPermi="['eycode:class:remove']"-->
<!--          >删除</el-button>-->

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

    <!-- 添加或修改班级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="班级编号" prop="classId">
              <el-input v-model="form.classId" placeholder="请输入班级编号" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="班级名称" prop="className">
              <el-input v-model="form.className" placeholder="请输入班级名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划人数" prop="number">
              <el-input-number v-model="form.number" controls-position="right" :min="0" :max="500"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="招生人数" prop="gnumber">
              <el-input-number v-model="form.gnumber" controls-position="right" :min="0" :max="500"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="授课人" prop="teacherId" >
              <el-select v-model="form.teacherId" filterable @change="change()"  placeholder="请选择授课人" >
                <el-option
                  v-for="item in teacherOptions"
                  :key="item.teacherId"
                  :label="item.name"
                  :value="item.teacherId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="授课地点" prop="region">
              <el-input v-model="form.region" placeholder="请输入授课地点" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="起始时间" prop="classBeginTime">
              <!-- <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form.classBeginTime"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择班级开始时间">
              </el-date-picker> -->
              <el-date-picker
                    v-model="timeQuantum"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="是否需防挂机" prop="isNeedPre" >
              <el-radio-group v-model="classConfig.isNeedPre">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
<!--          <el-col :span="12">
            <el-form-item label="结束时间" prop="classEndTime">
              <el-date-picker clearable size="small" style="width: 200px"
                              v-model="form.classEndTime"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="选择班级结束时间"
                              >
              </el-date-picker>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24" v-if="editButton==false">
            <el-form-item label="审核内容" prop="auditCause"  >
              <el-input v-model="form.auditCause" type="textarea" placeholder="请输入审核通过或者不通过原因" />
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-row>
          <el-col :span="24">
            <span style="font-size: 16px;">班级配置</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否解锁模式" prop="isLock" >
              <el-radio-group v-model="classConfig.isLock">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需实名认证" prop="realNameAuth" >
              <el-radio-group v-model="classConfig.realNameAuth">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="防挂机配置" prop="videoOnHook" >
              <el-radio-group v-model="classConfig.videoOnHook">
                <el-radio :label="0">不需要</el-radio>
                <el-radio :label="1">弹验证码</el-radio>
                <el-radio :label="2">人脸识别</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="classConfig.videoOnHook != 0">
            <el-form-item label="触发方式" prop="triggerType" >
              <el-radio-group v-model="classConfig.triggerType">
                <el-radio :label="0">固定次数</el-radio>
                <el-radio :label="1">固定时间</el-radio>
                <el-radio :label="2">每次递增</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="classConfig.videoOnHook != 0">
            <el-form-item  prop="triggerValue" >
              <span slot="label">
                触发的值
                <el-tooltip placement="top">
                  <div slot="content">触发的值,根据触发方式来设置: <br/>当触发方式为固定次数时,表示是按照次数来<br/>当触发方式为固定时间或者每次递增时,表示时按照分钟来</div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input-number :min="0" v-model="classConfig.triggerValue" />
            </el-form-item>
            <span></span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首次需人脸识别" prop="videoStartFace" >
              <el-radio-group v-model="classConfig.videoStartFace">
                <el-radio :label="0">不需要</el-radio>
                <el-radio :label="1">需要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录制视频" prop="videoPlayRecord" >
              <el-radio-group v-model="classConfig.videoPlayRecord">
                <el-radio :label="0">不需要</el-radio>
                <el-radio :label="1">需要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="classConfig.videoPlayRecord == 1">
            <el-form-item label="录制方式" prop="recordVideoState" >
              <el-select v-model="classConfig.recordVideoState" filterable placeholder="录制方式" >
                <el-option :value="1" label="视频开始后" >视频开始后</el-option>
                <el-option :value="2" label="视频1/4处" >视频1/4处</el-option>
                <el-option :value="3" label="视频1/3处" >视频1/3处</el-option>
                <el-option :value="4" label="视频1/2处" >视频1/2处</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="classConfig.videoPlayRecord == 1">
            <el-form-item label="录制时长" prop="recordVideoTime" >
              <el-input-number :min="1" v-model="classConfig.recordVideoTime"  />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="editButton">确 定</el-button>
        <el-button type="primary" @click="auditForm(1)" v-if="opeAudit">审核通过</el-button>
        <el-button type="danger" @click="auditForm(2)" v-if="opeAudit">审核不通过</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listBySpecial, getClass, delClass, addClass, updateClass, exportClass ,auditContContents ,getTeacherList ,getClassBySubjectId} from "@/api/course/class";
  import { treeselect as deptTreeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: "SpecialClass",
    components: { Treeselect },
    data() {
      return {
        // 起始时间段
        timeQuantum:undefined,
        // 专题id
        specialId: undefined,
        // 审核内容判断显示
        opeAudit: false,
        // 编辑保存按钮是否显示
        editButton: true,
        // 讲师下拉
        teacherOptions: [],
        // 日期范围
        dateRange: [],
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
        // 班级表格数据
        classList: [],
        // 搜索归属部门列表
        sxdeptOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          classId: undefined,
          className: undefined,
          number: undefined,
          audit: undefined,
          auditTime: undefined,
          auditPeople: undefined,
          auditCause: undefined,
          classBeginTime: undefined,
          classEndTime: undefined,
          deptId:undefined,
          specialId: undefined,
        },
        // 班级配置
        classConfig: {},
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          // classId: [
          //   { required: true, message: "班级编号不能为空", trigger: "blur" }
          // ],
          className: [
            { required: true, message: "班级名称不能为空", trigger: "blur" }
          ],
          // number: [
          //   { required: true, message: "计划人数不能为空", trigger: "blur" }
          // ],
          // gnumber: [
          //   { required: true, message: "计划人数不能为空", trigger: "blur" }
          // ],
          classBeginTime: [
            { required: true, message: "班级起始时间不能为空", trigger: "blur" }
          ],
          classEndTime: [
            { required: true, message: "班级结束时间不能为空", trigger: "blur" }
          ],
          // auditCause: [
          //   { required: true, message: "审核通过或者不通过原因不能为空", trigger: "blur" }
          // ],
          // teacherId: [
          //   { required: true, message: "授课人不能为空", trigger: "blur" }
          // ],
          // region: [
          //   { required: true, message: "授课地点不能为空", trigger: "blur" }
          // ],
        }
      };
    },
    created() {
      // 路由获取专题id
      const specialId = this.$route.params && this.$route.params.specialId;
      // 复制给列表的查询条件专题id
      this.queryParams.specialId = specialId;
      // 表单赋值专题id
      this.specialId = specialId;

      this.getList();
      this.getTeacher();
      // 获取租户列表
      // deptTreeselect().then(response => {
      //   this.sxdeptOptions = response.data;
      // });
    },
    methods: {

      // 0-未审核   1-审核通过  2-审核不通过字典翻译
      // auditFormat(row, column) {
      //   return this.selectDictLabel(this.auditOptions, row.audit);
      // },

      /** 查询班级列表 */
      getList() {
        this.loading = true;
        listBySpecial(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.classList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.opeAudit = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          classId: undefined,
          className: undefined,
          number: undefined,
          gnumber: undefined,
          subjectId: this.subjectId,
          audit: undefined,
          auditTime: undefined,
          auditPeople: undefined,
          auditCause: undefined,
          classBeginTime: undefined,
          classEndTime: undefined,
          createTime: undefined,
          createBy: undefined,
          updateTime: undefined,
          updateBy: undefined,
          isNeedPre: undefined,
          eyCourseClassConfig: undefined,
        };
        this.classConfig = {
          // 是否需实名认证 0-不需要 1-需要
          realNameAuth: 0,
          // 防挂机配置 0-不需要 1-需要
          videoOnHook: 0,
          // 触发方式 0-固定次数 1-固定时间 2-每次递增
          triggerType: 0,
          // 触发的值
          triggerValue: undefined,
          // 视频首次观看是否需人脸识别 0-不需要 1-需要
          videoStartFace: 0,
          // 视频播放中是否需录制视频 0-不需要 1-需要
          videoPlayRecord: 0,
          // 视频录制方式 1=视频开始后 2=视频 1/4处  3=视频 1/3处 4=视频 1/2处
          recordVideoState: 1,
          // 视频录制时长
          recordVideoTime: undefined,
          // 是否解锁模式
          isLock: 1,
        }
        this.timeQuantum = [];
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.dateRange = [];
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
        this.editButton = true;
        this.open = true;
        this.opeAudit = false;
        this.title = "添加班级";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.editButton = true;
        const id = row.id || this.ids
        getClass(id).then(response => {
          this.form = response.data;
          if (this.form.eyCourseClassConfig != null){
            this.classConfig = this.form.eyCourseClassConfig
          }
          if(this.form.classBeginTime == null){
            this.timeQuantum = ["",""];
          }else{
            this.timeQuantum = [this.form.classBeginTime,this.form.classEndTime];
          }

          console.log(this.timeQuantum);
          // return;
          this.open = true;
          this.opeAudit = false;
          this.title = "修改班级";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        console.log(this.timeQuantum);
        if(this.timeQuantum != null && this.timeQuantum.length==2){
          this.form.classBeginTime = this.timeQuantum[0];
          this.form.classEndTime   = this.timeQuantum[1];
        }
        this.form.eyCourseClassConfig = this.classConfig
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateClass(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              this.form.specialId = this.queryParams.specialId
              addClass(this.form).then(response => {
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

      getTeacher(){
        getTeacherList().then(response => {
          this.teacherOptions = response.rows;
        });
      },

      /** 详情或审核按钮操作 */
      handleDetailsAudit(row) {
        this.reset();
        this.editButton = false;
        const id = row.id || this.ids;
        getClass(id).then(response => {
          this.form = response.data;
          this.timeQuantum = [this.form.classBeginTime,this.form.classEndTime];
          this.open = true;
          this.opeAudit = true;
          this.title = "审核班级";
        });
      },
      change(){
        this.$forceUpdate()
      },

      /** 审核按钮 */
      auditForm: function(type) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (type == 1) this.form.audit = 1; //审核通过
            if (type == 2) this.form.audit = 2; //审核不通过
            if(this.form.classBeginTime>this.form.classEndTime){
              this.msgError("开始时间不能大于结束时间");
              return false;
            }
            if (this.form.id != undefined) {
              auditContContents(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("审核成功");
                  this.opeAudit = false;
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
        // TODO
        if(row.subjectName != null && row.subjectName != ""){
          return this.$message.error("已关联课程/专题的班级不允许删除");
        }
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除班级编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delClass(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      /*逻辑删除操作*/
      handleDeleteStatus(){

      },



      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有班级数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportClass(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
