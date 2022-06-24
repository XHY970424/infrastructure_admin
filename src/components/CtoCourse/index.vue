<template>
  <el-dialog :title="title" v-loading="loading" :visible.sync="open" width="900px"
             :close-on-click-modal="false" append-to-body :before-close="cancel">
    <!--  筛选课程条件  -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="82px">
      <el-form-item label="课程分类">
        <el-cascader
          ref="categoryRef"
          v-model="queryParams.categoryId"
          :options="category"
          :props="{ checkStrictly: true, value: 'id', label: 'categoryName' }"
          @change="categoryChange"
          clearable></el-cascader>
      </el-form-item >
      <el-form-item label="课程名称" prop="subjectTitle">
        <el-input v-model="queryParams.subjectTitle" placeholder="课程名称" clearable size="small"
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  课程列表  -->
    <el-table v-loading="loading"
              :data="courseList"
              @selection-change="handleSelectionChange" border>
<!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column type="index" label="单选" align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="currentRowId" :label="scope.row.id" @change="changeRadio($event,scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" width="140"/>
      <el-table-column label="课程名称" align="center" prop="subjectTitle"/>
      <el-table-column label="讲师" align="center" prop="teacher"/>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getCategory, getSubject} from '@/api/cms/newconstruction'

  export default {
    name: "CtoCourse",
    props: {
      title: {
        type: String,
        default: "选择课程",
      },
      open: {
        type: Boolean,
        default: false,
      },
    },
    created() {
      getCategory().then(res => {
        this.category = res.data;
        this.getChildren(this.category)
      });
      this.getList();
      this.subjectInfo = {};
      this.currentRowId = undefined;
    },
    data() {
      return {
        // 总条数
        total: 0,
        courseList: [],
        loading: false,
        category: [],
        queryParams: {
          categoryId: undefined,
          pageNum: 1,
          pageSize: 10,
          level: undefined,
          subjectTitle: "",
        },
        currentRowId: undefined,
        // 选中的课程数据
        subjectInfo: {},
      }
    },
    methods: {
      // 获取课程列表
      getList() {
        this.loading = true
        getSubject(this.queryParams).then(res => {
          this.courseList = res.rows;
          this.total = res.total;
          this.loading = false;
        })
      },
      // 切换单选框  methods 中
      changeRadio(event,row){
        this.currentRowId = event;
        this.subjectInfo = row;
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.indexCourseId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      // 分类选中后操作
      categoryChange(value) {
        if (value && value.length !== 0) {
          let chooseData = this.$refs['categoryRef'].getCheckedNodes()[0].data;
          this.queryParams.categoryId = chooseData.id;
          this.queryParams.level = chooseData.level;
        } else {
          this.queryParams.categoryId = undefined;
          this.queryParams.level = undefined;
        }
      },
      // 处理课程分类
      getChildren(categoryList) {
        // 去除第一条全部
        categoryList.splice(0, 1);
        for (let j = 0, len = categoryList.length; j < len; j++) {
          if (categoryList[j].children !== undefined && categoryList[j].children.length > 0) {
            this.getChildren(categoryList[j].children);
          } else {
            // 子分类为空 去除该字段
            delete categoryList[j].children;
          }
        }
      },
      cancel() {
        this.$emit('cancelCtoCourse')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.categoryId = undefined
        this.handleQuery();
      },
      submitForm() {
        this.$emit('choose-subject', this.subjectInfo)
        this.$emit('cancelCtoCourse')
      },
    }
  }

</script>

<style scoped>

</style>
