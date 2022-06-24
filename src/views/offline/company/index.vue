<template>
  <div class="app-container">
    <div class="userBut">
      <el-select
        v-model="userParams.companyId"
        :disabled="users.length > 0 || tableData.length > 0"
        placeholder="请选择企业"
      >
        <el-option
          v-for="item in companyList"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        :disabled="!userParams.companyId"
        @click="addSelectUser(), getUserList()"
        >选择企业下学员
      </el-button>
      <el-button type="text" @click="users = []">清空已选学员</el-button>
    </div>
    <div
      v-show="users.length > 0"
      style="line-height: 50px; color: red; font-size: 14px"
    >
      <span>已选学员列表：</span>
      <span v-for="(item, index) in users" :key="index"
        >{{ item.userName ? item.userName : item.phonenumber }}
      </span>
    </div>
    <div class="div">
      <div class="transfer">
        <p>选择课程</p>
        <div class="select-box">
          <div class="lable">课程分类：</div>
          <treeselect
            class="treeselect"
            v-model="categoryId"
            :options="courseCategory"
            placeholder="请选择课程分类类型"
            :show-count="true"
            @select="selectCourseCategory"
          />
        </div>
        <el-transfer
          filterable
          v-model="courseValue"
          :data="courseArray"
          :titles="['可选课程', '已选课程']"
          filter-placeholder="按名称搜索"
        ></el-transfer>
      </div>
      <div class="transfer">
        <p>选择专题</p>
        <div class="select-box">
          <div class="lable">专题分类：</div>
          <treeselect
            class="treeselect"
            v-model="specialCategoryId"
            :options="courseCategory"
            placeholder="请选择专题分类类型"
            :show-count="true"
            @select="selectSpecialCategory"
          />
        </div>

        <el-transfer
          filterable
          v-model="specialValue"
          :data="specialArray"
          :titles="['可选专题', '已选专题']"
          filter-placeholder="按名称搜索"
        ></el-transfer>
      </div>
    </div>
    <div class="addBut">
      <el-button type="primary" @click="affirmSelect">确认选择</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="stuData" label="学员">
          <template slot-scope="scope">
            <span>{{
              scope.row.stuData.userName
                ? scope.row.stuData.userName
                : scope.row.stuData.phonenumber
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseData" label="课程">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.courseData" :key="index"
              >{{ item.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="specialData" label="专题">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.specialData" :key="index"
              >{{ item.label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-delete"
              @click="removeData(scope.$index)"
              >移除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="priceDiv">
      <el-form :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="实付金额" prop="price">
          <el-input
            v-model="price"
            placeholder="请输入本次开通实付金额"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="addBut">
      <el-button
        type="success"
        @click="openCourse"
        :loading="courseLoading"
        v-hasPermi="['offline:company:batchApply']"
        >批量开通
      </el-button>
      <el-button @click="clearData">清空已选列表</el-button>
    </div>

    <!-- 学员列表弹出框 -->
    <el-dialog
      :close-on-click-modal="false"
      title="选择学员"
      :visible.sync="userOpen"
      width="1000px"
      append-to-body
    >
      <el-form
        :model="userParams"
        :inline="true"
        label-width="68px"
        @submit.native.prevent
      >
        <el-form-item label="">
          <el-input
            v-model="userParams.userName"
            placeholder="请输入学员名称/手机号/邮箱/身份证查询"
            clearable
            size="small"
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="getUserList"
            >搜索</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-success"
            size="mini"
            @click="confirmSelect"
            >确认选择</el-button
          >
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        已选学员:
        <span v-for="(item, index) in userArray" :key="index"
          >{{ item.userName ? item.userName : item.phonenumber }}
        </span>
      </div>
      <el-table v-loading="userLoading" :data="userList" border>
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="用户姓名" align="center" prop="nickName" />
        <el-table-column label="手机号" align="center" prop="phonenumber" />
        <el-table-column label="邮箱" align="center" prop="email" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectUser(scope.row)"
              >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="userTotal > 0"
        :total="userTotal"
        :page.sync="userParams.pageNum"
        :limit.sync="userParams.pageSize"
        @pagination="getUserList()"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getCourseSubject,
  openSubjectAndSpecial,
  queryCompanyList,
  queryUserList,
} from "@/api/offline/company";
import { queryCourseList } from "@/api/course/subject";
import { querySpecialList } from "@/api/course/special";
import { treeselect } from "@/api/course/courseCategory";
import { treeselect as specialTreeselect } from "@/api/course/special";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "index.vue",
  components: {
    Treeselect,
  },
  data() {
    return {
      price: undefined,
      courseLoading: false,
      courseArray: [],
      courseValue: [],
      specialArray: [],
      specialValue: [],
      /** 学员列表弹出框start */
      userArray: [],
      users: [],
      userOpen: false,
      userLoading: true,
      userList: [],
      companyList: [],
      userTotal: 0,
      userParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        companyId: undefined,
        userType: 1,
      },
      tableData: [],
      courseCategory: [
        {
          id: "",
          label: "全部",
        },
      ],
      categoryId: "",
      specialCategory: [
        {
          id: "",
          categoryName: "全部",
        },
      ],
      specialCategoryId: "",
    };
  },
  methods: {
    /** 清空列表数据 */
    clearData() {
      this.$confirm("是否清空已选列表数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableData = [];
        this.$message.success("清空列表成功!");
      });
    },
    /** 移除数据 */
    removeData(index) {
      this.$confirm("是否移除当前行数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableData.splice(index, 1);
        this.$message.success("移除当列成功!");
      });
    },
    /** 确认选择 */
    affirmSelect() {
      if (this.users.length == 0) {
        this.$message.warning("请选择学员");
      } else if (
        this.courseValue.length == 0 &&
        this.specialValue.length == 0
      ) {
        this.$message.warning("请选择课程或专题");
      } else {
        // 得到课程选择数据
        let courseData = [];
        this.courseValue.forEach((val) => {
          //选中的课程数据
          this.courseArray.map((value) => {
            if (val == value.key) {
              courseData.push(value);
            }
          });
        });
        // 得到专题数据
        let specialData = [];
        this.specialValue.forEach((val) => {
          //选中的课程数据
          this.specialArray.map((value) => {
            if (val == value.key) {
              specialData.push(value);
            }
          });
        });
        // 装载数据
        this.users.forEach((item) => {
          this.tableData.push({
            stuData: item,
            courseData: courseData,
            specialData: specialData,
          });
        });
        // 清空数组
        this.users = [];
        this.courseValue = [];
        this.specialValue = [];
      }
    },
    /** 选择学员弹出框 */
    addSelectUser() {
      this.userParams.pageNum = 1;
      this.userParams.pageSize = 10;
      this.userParams.userName = undefined;
      this.userArray = JSON.parse(JSON.stringify(this.users));
    },
    /** 确认选择 */
    confirmSelect() {
      this.users = JSON.parse(JSON.stringify(this.userArray));
      this.userOpen = false;
    },
    /** 选择学员 */
    selectUser(item) {
      const found = this.userArray.some((el) => el.userId === item.userId);
      if (!found)
        this.userArray.push({
          userId: item.userId,
          userName: item.nickName,
          phonenumber: item.phonenumber,
        });
    },
    /** 查询学员列表 */
    getUserList() {
      this.userLoading = true;
      queryUserList(this.userParams).then((response) => {
        this.userList = response.rows;
        this.userTotal = response.total;
        this.userOpen = true;
        this.userLoading = false;
      });
    },
    /** 查询企业列表 */
    getCompanyList() {
      queryCompanyList().then((response) => {
        this.companyList = response.data;
      });
    },
    /** 查询课程列表 */
    getCourseList() {
      queryCourseList({
        categoryId: this.categoryId,
      }).then((res) => {
        let data = res.data;
        const dataArr = [];
        for (let i = 0; i < data.length; i++) {
          dataArr.push({
            key: data[i].id,
            label: data[i].subjectTitle,
          });
        }
        this.courseArray = dataArr;
        this.courseValue = [];
      });
    },
    /** 查询专题列表 */
    getSpecialList() {
      querySpecialList({
        categoryId: this.specialCategoryId,
      }).then((res) => {
        let data = res.data;
        const dataArr = [];
        for (let i = 0; i < data.length; i++) {
          dataArr.push({
            key: data[i].specialId,
            label: data[i].specialName,
          });
        }
        this.specialArray = dataArr;
        this.specialValue = [];
      });
    },
    /**选择课程分类*/
    selectCourseCategory(node) {
      this.categoryId = node.id;
      this.getCourseList();
    },
    /**选择专题分类*/
    selectSpecialCategory(node) {
      this.specialCategoryId = node.id;
      this.getSpecialList();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.courseCategory = this.courseCategory.concat(response.data);
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.categoryName,
        children: node.children,
      };
    },
    /** 查询部门下专题的拉树结构 */
    getSpecialTreeselect() {
      specialTreeselect().then((res) => {
        this.specialCategory = this.specialCategory.concat(this.handleTree(res.data,'id','pid'));
      });
    },
    /** 批量开通课程 */
    openCourse() {
      this.courseLoading = true;
      if (this.tableData.length == 0) {
        this.$message.error("请选择开课学员和课程!");
        this.courseLoading = false;
      } else if (this.price == undefined || this.price == null) {
        this.$message.error("请填写本次开通线下实付金额!");
        this.courseLoading = false;
      } else {
        let param = [];
        this.tableData.forEach((item) => {
          let courseIdArray = item.courseData.map((item) => {
            return item.key;
          });
          let specialIdArray = item.specialData.map((item) => {
            return item.key;
          });
          param.push({
            userId: item.stuData.userId,
            subjectIds: courseIdArray,
            specialIds: specialIdArray,
            companyId: this.userParams.companyId,
            price: this.price,
          });
        });
        openSubjectAndSpecial(param)
          .then((res) => {
            if (res.code == 200) {
              this.tableData = [];
              this.$message.success("批量开课成功~~");
              this.courseLoading = false;
            } else {
              this.$message.error(res.msg);
              this.courseLoading = false;
            }
          })
          .catch((res) => {
            this.courseLoading = false;
          });
      }
    },
  },
  created() {
    // 查询已审核企业列表
    this.getCompanyList();
    // 查询专题和课程列表
    this.getCourseList();
    this.getSpecialList();
    //查询分类
    this.getTreeselect();
    this.getSpecialTreeselect();
  },
};
</script>

<style scoped>
.userBut {
  height: 40px;
}

.div {
  display: flex;
}

.transfer {
  flex: 1;
  display: inline-block;
}

.addBut {
  line-height: 80px;
  text-align: center;
}

.priceDiv {
  margin-top: 20px;
  /*width: 200px;*/
}

.select-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 69%;
}

.select-box .lable {
  margin-right: 10px;
}

.select-box .treeselect {
  flex: 1;
}
</style>
