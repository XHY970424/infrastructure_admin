  <template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="班级名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班级状态" prop="classStatus">
        <el-select
          v-model="queryParams.classStatus"
          placeholder="请选择在学或已毕业"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in recommendOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班主任" prop="salesmanName">
        <!-- <el-input
          v-model="queryParams.salesmanName"
          placeholder="请输入班主任"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
        <el-select
          v-model="queryParams.salesmanName"
          filterable
          placeholder="班主任"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.salesmanName"
            :value="item.salesmanName"
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

    <el-row :gutter="10" class="mb8" v-if="type != null">
      <el-col :span="1.5">
        <el-button
          v-if="queryParams.subjectId !== null"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:class:add']"
          >增加班级</el-button
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
          v-hasPermi="['eycode:class:remove']"
          >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="AssignClass"
          >分配班级
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      border
      :data="classList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="100" />
      <!-- <el-table-column label="班级编号" header-align="center" prop="classId" /> -->
      <el-table-column
        label="班级名称"
        header-align="center"
        align="center"
        prop="className"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="班主任"
        header-align="center"
        align="center "
        prop="teacherName"
      ></el-table-column>
      <el-table-column
      v-if="type >= 2"
        label="限定人数"
        align="center"
        prop="number"
        width="100px"
      />
      <el-table-column
        label="现有人数"
        align="center"
        prop="isDefault"
        width="100px"
      />
      <el-table-column
        label="班级状态"
        align="center"
        prop="classStatus"
        width="100px"
      >
        <template slot-scope="scope">
          <el-switch
            @change="SwitchChange(scope.row)"
            :value="scope.row.classStatus == 0 ? true : false"
            active-color="#13ce66"
            inactive-color="#e0e0e0"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="授课地点"
        align="center"
        prop="venue"
        width="170"
        v-if="type > 1"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="170"
      />
      <!--      <el-table-column label="班级结束时间" align="center" prop="classEndTime" width="170" />-->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="170"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:class:edit']"
            >修改</el-button
          >
          <el-button
            v-if="queryParams.subjectId"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="tosubjectUser(scope.row)"
            v-hasPermi="['eycode:class:remove']"
            >学员管理</el-button
          >
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

    <!-- 添加班级对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-table
        class="tables"
        :data="tableData"
        border
        style="width: 100%; max-height: 600px"
      >
        <el-table-column align="center" prop="date" label="班级名称">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.className"
              placeholder="班级名称"
              clearable
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="限定人数" v-if="type >= 2">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.number"
              placeholder="限定人数"
              clearable
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="address" label="班主任">
          <template slot-scope="scope">
            <el-select v-model="scope.row.salesmanName" placeholder="班主任">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.salesmanName"
                :value="item.salesmanName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="address"
          label="课程表地址"
          v-if="type >= 2"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.venue" placeholder="课程表地址">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="tableDelete(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tableAdd">
        <el-button plain class="el-icon-plus" @click="tableAdd"
          >添加课程</el-button
        >
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="submit">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 修改班级对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openedit"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="班级名称" prop="className">
          <el-input
            v-model="ruleForm.className"
            placeholder="请输入班级名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="班主任" prop="salesmanId">
          <el-select v-model="ruleForm.salesmanId" placeholder="班主任">
            <el-option
              v-for="item in options"
              :key="item.tenantId"
              :label="item.salesmanName"
              :value="item.tenantId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="限定人数" prop="number">
          <el-input
            v-model="ruleForm.number"
            placeholder="请选择上限人数"
          ></el-input>
        </el-form-item>
        <el-form-item label="班级状态" prop="name">
          <el-radio-group v-model="ruleForm.classStatus">
            <el-radio :label="0">在学</el-radio>
            <el-radio :label="1">毕业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授课地址" prop="venue" v-if="type > 1">
          <el-input
            v-model="ruleForm.venue"
            placeholder="请输入授课地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >保 存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分配班级 -->
    <el-dialog
      title="分配班级"
      :visible.sync="openClass"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <div>
        <el-button
          type="primary"
          class="el-icon-coin"
          @click="openstudent = true"
        >
          分 配</el-button
        >
        <span style="padding-left: 15px"
          >已选择{{ SelectLeng.length }}名学员</span
        >
      </div>
      <div class="class-flex">
        <div class="class-grouy1">
          <div class="grouy-title">班级</div>
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="classInput"
            @keyup.enter.native="getAllotClasses"
          />
          <div style="height: 370px; overflow-y: auto">
            <div
              class="grouy-item"
              v-for="(item, index) in classLists"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                @change="checkChange($event, item)"
                ><div class="grouy-text">
                  {{ item.className }}
                </div></el-checkbox
              >
            </div>
          </div>
        </div>
        <img
          class="class-img"
          src="https://vo.bbazxw.com/pc_infrastructure/show_02.png"
        />
        <div class="class-grouy2">
          <div class="grouy-title">学员</div>
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            v-model="classInput1"
            @keyup.enter.native="getClassUser"
          />
          <el-table
            :data="tableDatas"
            style="width: 100%"
            ref="table"
            height="370"
            @selection-change="SelectionChange"
          >
            <el-table-column type="selection" width="50" align="center">
            </el-table-column>
            <el-table-column prop="userName" label="姓名" align="center">
            </el-table-column>
            <el-table-column
              prop="phonenumber"
              label="手机号"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="idCard"
              width="180"
              label="身份证号"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="sex" label="性别" align="center">
              <template slot-scope="scope">
                {{ scope.row.sex == 0 ? "男" : "女" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <!-- 学员分配班级 -->
    <el-dialog
      title="学员分配"
      :visible.sync="openstudent"
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
      :destroy-on-close="true"
      :before-close="dialogClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="已选学员：">
          <el-tag
            v-for="(item, index) in SelectLeng"
            :key="index"
            closable
            style="margin-right: 10px"
            @close="handleClose(item, index)"
          >
            {{ item.userName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="分配班级：">
          <el-select
            v-model="Classvalue"
            placeholder="请选择分配班级"
            style="width: 780px"
          >
            <el-option
              v-for="item in classLists"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button
            style="margin-top: 20px"
            type="primary"
            @click="SucDivision"
            >保 存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

  <script>
import {
  listClass,
  getClass,
  NewEdit,
  getNew,
  delClass,
  exportClass,
  getTeacherList,
  getTeacher,
  setaddClass,
  getAllotClass,
  updateAllotClass,
  getClassUsers,
} from "@/api/course/class";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Class",
  components: { Treeselect },
  data() {
    return {
      Classvalue: "", //选择分班班级
      classid: "", //选中班级id
      SelectLeng: [], //选中的学员长度
      tableDatas: [],
      classLists: [], //获取分配班级数据
      classInput: null, //分配班级搜索
      classInput1: null, //分配学员搜索
      studentInput: null, //分配学员搜索
      openstudent: false, //分配学员
      openClass: false, //班级分配弹窗
      openedit: false, //编辑弹窗
      recommendOptions: [
        {
          value: "1",
          label: "毕业",
        },
        {
          value: "0",
          label: "在学",
        },
      ],
      value: "",
      options: [], //班主任数据
      tableData: [], //新增班级数据
      //起始时间段
      timeQuantum: undefined,
      //课程id
      subjectId: undefined,
      // 审核内容判断显示
      opeAudit: false,
      // 编辑保存按钮是否显示
      editButton: true,
      // 0-未审核   1-审核通过  2-审核不通过字典
      auditOptions: [],
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
        classStatus: undefined,
        audit: undefined,
        auditTime: undefined,
        auditPeople: undefined,
        auditCause: undefined,
        classBeginTime: undefined,
        classEndTime: undefined,
        deptId: undefined,
      },
      // 班级配置
      classConfig: {},
      // 表单参数
      form: {},
      ruleForm: {
        className: "", //班级名称
        id: null, //班级id
        number: null, //上限人数
        classStatus: 1, //状态
        salesmanId: null, //业务人员id
        venue: "", //授课地点
      },
      rules: {
        className: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
        ],
        number: [
          { required: true, message: "请选择上限人数", trigger: "change" },
        ],
        salesmanId: [
          { required: true, message: "请选择班主任", trigger: "change" },
        ],
        venue: [
          { required: true, message: "请选择授课地点", trigger: "change" },
        ],
      },
      type: null, //0 录播 1 直播 2 面授 3专题
    };
  },
  computed: {
    compchange() {
      return (t) => {
        return t == 0 ? true : false;
      };
    },
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.path != "/resource/class") return;
        this.type = this.$route.query.type;
        // 路由获取课程id
        const subjectId = this.$route.query && this.$route.query.id;
        // 复制给列表的查询条件课程id
        this.queryParams.subjectId = subjectId;
        // 表单赋值课程id
        this.subjectId = subjectId;

        this.getList();
        this.getTeachers(); //获取班主任下拉框
        this.getDicts("order_detail_status").then((response) => {
          this.auditOptions = response.data;
        });
        this.getTeacher();
        //获取租户列表
        deptTreeselect().then((response) => {
          this.sxdeptOptions = response.data;
        });
      },
      deep: true, // 深度监听
      immediate: true, // 第一次初始化渲染就可以监听到
    },
  },
  mounted() {},
  methods: {
    //关闭学员分配
    dialogClose() {
      this.Classvalue = null;
      this.openstudent = false;
    },
    //提交分配学员
    SucDivision() {
      let ids = this.SelectLeng.map((ele) => ele.userId);
      // 保存;
      updateAllotClass({
        classId: this.Classvalue, //班级id
        subjectId: this.subjectId, //课程id
        userIds: ids, //用户id (数组形式)
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success("分配成功");
          this.getList(); //刷新列表
          this.openClass = false; //关闭添加班级弹窗
          this.dialogClose(); //关闭分配弹窗
        }
      });
    },
    // 获取班级列表
    getAllotClasses() {
      getAllotClass({
        subjectId: this.subjectId, //课程id
        className: this.classInput, //班级名称
      }).then((res) => {
        this.classLists = res.data;
      });
    },
    //选中需要分配的班级
    checkChange(e, item) {
      this.classid = [];
      this.classLists.forEach((ele) => {
        //选中班级id
        if (ele.checked) {
          this.classid.push(ele.id);
        }
      });
      this.getClassUser(); //获取班级下的学员
    },
    //获取班级下的学员
    getClassUser() {
      getClassUsers({
        subjectId: this.subjectId,
        classIds: this.classid,
        userName: this.classInput1,
      }).then((res) => {
        this.tableDatas = res.data;
      });
    },
    // 删除指定学员
    handleClose(item, index) {
      this.SelectLeng.splice(index, 1);
      this.$refs.table.toggleRowSelection(item);
    },
    // 获取选中分配学员
    SelectionChange(e) {
      this.SelectLeng = e;
    },
    //修改成功
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          NewEdit(this.ruleForm).then((res) => {
            if (res.code == 200) {
              this.$message.success("操作成功");
              this.getList();
              this.openedit = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    //班级状态进行修改在读 毕业
    SwitchChange(val) {
      let obj = {};
      for (let key in this.ruleForm) {
        obj[key] = val[key];
      }
      obj.classStatus = obj.classStatus == 1 ? 0 : 1;
      NewEdit(obj).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getList();
          this.openedit = false;
        }
      });
    },
    submit() {
      let row = null;
      for (let item of this.tableData) {
        //遍历新增班级数据是否有空数据
        for (let key in item) {
          if (!item[key]) {
            row = true; //row为true表示有空数据
          } else {
            item["subjectId"] = this.subjectId;
          }
        }
      }
      if (row) {
        //row为true表示有空数据
        this.$message.warning("请填写完整信息");
        return;
      }
      setaddClass(this.tableData).then((res) => {
        if (res.code == 200) {
          this.$message.success("添加成功");
          this.open = false;
          this.getList();
        }
      });
    },
    // 获取班主任数据
    getTeachers() {
      getTeacher().then((response) => {
        this.options = response.data;
      });
    },
    //添加班级列表
    tableAdd() {
      let obj = {
        className: null,

        salesmanName: null,
      };
      if (this.type >= 2) {
        obj.venue = null;
        obj.number= null;
      }
      this.tableData.push(obj);
    },
    // 删除班级列表
    tableDelete(index) {
      if (this.tableData.length == 1) {
        this.$message.warning("至少保留一个班级");
        return;
      }
      this.$confirm("是否确认删除班级编号为的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
          this.$message.success("删除成功");
        })
        .catch(function () {});
    },
    //跳转学员管理
    tosubjectUser(item) {
      this.$router.push("/subjectUser/subjectUser/" + item.id);
    },
    // 0-未审核   1-审核通过  2-审核不通过字典翻译
    auditFormat(row, column) {
      return this.selectDictLabel(this.auditOptions, row.audit);
    },

    /** 查询班级列表 */
    getList() {
      this.loading = true;
      listClass(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.classList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        classId: undefined,
        className: undefined,
        number: undefined,
        newNumber: undefined,
        classStatus: undefined,
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
      };
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.tableData = []; //清空班级列表
      // this.opeAudit = false;
      this.title = "添加班级";
      let obj = {
        className: null,

        salesmanName: null,
      };
      if (this.type >= 2) {
        obj.venue = null;
        obj.number= null;
      }
      this.tableData.push(obj);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.editButton = true;
      const id = row.id || this.ids;
      getNew(id).then((response) => {
        for (let key in this.ruleForm) {
          this.ruleForm[key] = response.data[key];
        }
        this.openedit = true;
        this.opeAudit = false;
        this.title = "修改班级";
      });
    },

    getTeacher() {
      getTeacherList().then((response) => {
        this.teacherOptions = response.rows;
      });
    },

    /** 详情或审核按钮操作 */
    handleDetailsAudit(row) {
      this.reset();
      this.editButton = false;
      const id = row.id || this.ids;
      getClass(id).then((response) => {
        this.form = response.data;
        this.timeQuantum = [this.form.classBeginTime, this.form.classEndTime];
        this.open = true;
        this.opeAudit = true;
        this.title = "审核班级";
      });
    },
    change() {
      this.$forceUpdate();
    },
    // 分配班级 弹窗
    AssignClass() {
      this.openClass = true;
      this.tableDatas = []; //清空学员列表
      this.classInput = null; //清空班级输入框
      this.classInput1 = null; //清空学员输入框
      this.getAllotClasses(); //获取分配班级
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // TODO
      if (row.subjectName != null || row.specialName != null) {
        return this.$message.error("已关联课程/专题的班级不允许删除");
      }
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除班级编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delClass(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },

    /*逻辑删除操作*/
    handleDeleteStatus() {},

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有班级数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportClass(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
<style scoped lang="scss">
.tableAdd {
  margin-top: 10px;
  text-align: right;
}
.dialog-footer {
  text-align: center;
}
::v-deep .el-table__body-wrapper {
  max-height: 650px;
  overflow-y: auto;
}
.class-flex {
  display: flex;
  align-items: center;
  margin-top: 30px;
  .class-img {
    width: 40px;
    height: 40px;
    transform: rotate(270deg);
    margin: 0px 20px;
  }
  .grouy-title {
    font-size: 18px;
    padding: 10px 20px;
  }
  .class-grouy1 {
    border: 1px solid #e0e0e0;
    width: 350px;
    height: 450px;
    .grouy-item {
      padding: 10px 20px;
      .grouy-text {
        font-size: 16px;
        width: 280px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 这里是超出几行省略 */
        overflow: hidden;
        display: block;
        // padding-top: 15px;
      }
    }
    .grouy-item:hover {
      background-color: #f5f5f5;
    }
  }
  .class-grouy2 {
    width: 550px;
    height: 450px;
    border: 1px solid #e0e0e0;
  }
  ::v-deep .el-checkbox {
    display: flex;
    align-items: center;
  }
}
</style>
