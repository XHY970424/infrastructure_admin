<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="证书类型" prop="type">
        <el-select v-model="queryParams.categoryId" placeholder="请选择证书类型" clearable size="small">
          <el-option :label="item.name" :value="item.id" v-for="item in categoryList"/>
        </el-select>
      </el-form-item>
      <el-form-item label="证书状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="模板状态" clearable size="small">
          <el-option label="未发布" :value="0"/>
          <el-option label="已发布" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="证书名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入证书名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['certificate:certificate:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="certificateList" @selection-change="handleSelectionChange" border>
      <el-table-column label="证书名称" align="center" prop="name"/>
      <el-table-column label="证书类型" align="center" prop="categoryName"/>
      <el-table-column label="创建人" align="center" prop="createByName"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="证书状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 0">未发布</span>
          <span v-show="scope.row.status == 1" style="color:forestgreen;">已发布</span>
        </template>
      </el-table-column>
      <el-table-column label="已生成证书数" align="center" prop="createNum"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="statusUpl(scope.row)"
            v-hasPermi="['certificate:certificate:updateCertificateStatus']"
          >状态
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['certificate:certificate:edit']"
          >证书编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-grid"
            @click="toUserCertificate(scope.row)"
          >证书管理
          </el-button>
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

    <!-- 状态修改 -->
    <el-dialog :close-on-click-modal="false" title="证书状态修改" :visible.sync="statusOpen" width="300px" append-to-body>
      <el-radio-group v-model="certificate.status">
        <el-radio :label="0">关闭</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statusChange">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改证书对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="证书名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入证书名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书类型" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择证书类型" clearable size="small">
                <el-option :label="item.name" :value="item.id" v-for="item in categoryList"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="证书模板" prop="templateId">
              <span>{{form.templateName}}</span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="templateQueryParams.pageNum=1,templateQueryParams.pageSize= 10,templateQueryParams.name= undefined,getTemplateList()"
              >证书模板
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="培训课程" prop="typeId">
              <span v-for="item in form.typeName">{{item}} </span>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="curriculumQueryParams.pageNum=1,curriculumQueryParams.pageSize= 10,curriculumQueryParams.name= undefined,curriculumQueryParams.categoryId= undefined,curriculumType=0,curriculumTitle='选择课程',getCurriculumList(),getCurriculumCategoryList()"
              >选择课程
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="curriculumQueryParams.pageNum=1,curriculumQueryParams.pageSize= 10,curriculumQueryParams.name= undefined,curriculumQueryParams.categoryId= undefined,curriculumType=1,curriculumTitle='选择专题',getCurriculumList(),getCurriculumCategoryList()"
              >选择专题
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="证书描述" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请填写证书描述"
                v-model="form.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="证书编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入自定义英文字母"/>
              <span style="color: #8c939d">证书编号生成为：可自定义英文字母+YYYYMMDD日期编号+NNN三维数序号</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期" prop="expire">
              <el-input v-model="form.expire"/>
              <span style="color: #8c939d">说明：空值或-1为长期有效</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放条件" prop="publishType">
              <el-radio-group v-model="form.publishType">
                <el-radio :label="0">完成课程自动通过</el-radio>
                <el-radio :label="1">人工审核</el-radio>
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

    <!-- 模板列表弹出框 -->
    <el-dialog :close-on-click-modal="false" title="选择模板" :visible.sync="selectTemplateOpen" width="800px"
               append-to-body>
      <el-form :model="templateQueryParams" :inline="true" label-width="68px" @submit.native.prevent>
        <el-form-item label="模板名称 " prop="title">
          <el-input
            v-model="templateQueryParams.name"
            placeholder="请输入模板名称 "
            clearable
            size="small"
            @keyup.enter.native="getTemplateList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getTemplateList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="templateLoading" :data="templateList" border>
        <el-table-column label="模板名称" align="center" prop="name"/>
        <el-table-column label="证书类型" align="center" prop="categoryName"/>
        <el-table-column label="创建人 " align="center" prop="createBy"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="preview(scope.row)"
            >预览
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectTemplate(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="templateTotal>0"
        :total="templateTotal"
        :page.sync="templateQueryParams.pageNum"
        :limit.sync="templateQueryParams.pageSize"
        @pagination="getTemplateList"
      />
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="证书模板预览" :visible.sync="previewOpen" width="1000px" append-to-body>
      <el-image :preview-src-list="[imageUrl]" fit="contain"
                :z-index="2200"
                v-show="imageUrl" :src="imageUrl"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 课程专题列表弹出框 -->
    <el-dialog :close-on-click-modal="false" :title="curriculumTitle" :visible.sync="curriculumOpen" width="1000px"
               append-to-body>
      <el-form :model="curriculumQueryParams" :inline="true" label-width="68px">
        <el-form-item label="课程分类" v-show="curriculumType == 0">
          <treeselect v-model="curriculumQueryParams.categoryId" :options="curriculumCategoryList"
                      :disable-branch-nodes="true"
                      :show-count="true" placeholder="请选择分类" style="width: 220px"/>
        </el-form-item>
        <el-form-item label="专题分类" prop="categoryId" v-show="curriculumType == 1">
          <treeselect v-model="curriculumQueryParams.categoryId" :options="curriculumCategoryList"
                      :normalizer="normalizer" :disable-branch-nodes="true"
                      placeholder="请选择分类" style="width: 250px"/>
        </el-form-item>
        <el-form-item :label="curriculumType == 0 ? '课程名称' : '专题名称'">
          <el-input v-model="curriculumQueryParams.name" placeholder="请输入名称" clearable size="small"
                    @keyup.enter.native="getCurriculumList"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getCurriculumList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="curriculumLoading" :data="curriculumList" border v-show="curriculumType==0">
        <el-table-column label="课程名称" align="center" prop="subjectTitle"/>
        <el-table-column label="封面图片" align="center" prop="subjectImageUrl">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title=""
              trigger="hover" width="40">
              <el-image slot="reference" style="max-width: 80px;max-height: 80px" :src="scope.row.subjectImageUrl"/>
              <el-image :src="scope.row.subjectImageUrl"></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center" prop="categoryName"/>
        <el-table-column label="创建人 " align="center" prop="createBy"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectCurriculum(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-loading="curriculumLoading" :data="curriculumList" border v-show="curriculumType==1">
        <el-table-column label="专题名称" align="center" prop="specialName"/>
        <el-table-column label="封面图片" align="center" prop="imgUrl">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              title=""
              trigger="hover" width="40">
              <el-image slot="reference" style="max-width: 80px;max-height: 80px" :src="scope.row.imgUrl"/>
              <el-image :src="scope.row.imgUrl"></el-image>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center" prop="categoryName"/>
        <el-table-column label="创建人 " align="center" prop="createBy"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-thumb"
              @click="selectCurriculum(scope.row)"
            >选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="curriculumTotal>0"
        :total="curriculumTotal"
        :page.sync="curriculumQueryParams.pageNum"
        :limit.sync="curriculumQueryParams.pageSize"
        @pagination="getCurriculumList()"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCertificate,
    getCertificate,
    listCertificate,
    updateCertificate,
    updateCertificateStatus
  } from '@/api/certificate/certificate'
  import { listTemplate, pdfPreview } from '@/api/certificate/template'
  import { listCategory } from '@/api/certificate/category'
  import { listSubject } from '@/api/course/subject'
  import { treeselect } from '@/api/course/courseCategory'
  import { listSpecial, queryCourseList, treeselect as specialTreeselect } from '@/api/course/special'
  import Template from '../template/index'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Certificate',
    components: { Template, Treeselect },
    data() {
      return {
        /** ===========课程选择start========== */
        curriculumTitle: '',
        curriculumType: 0,
        curriculumOpen: false,
        curriculumLoading: true,
        curriculumList: [],
        curriculumTotal:0,
        curriculumCategoryList: [],
        curriculumQueryParams: {
          pageNum: 1,
          pageSize: 10,
          categoryId: undefined,
          name: undefined
        },
        /** ===========课程选择end========== */
        /** =========模板选择start======== */
        previewOpen: false,
        imageUrl: '',
        templateLoading: true,
        templateTotal:0,
        templateQueryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          status: 1
        },
        templateList: [],
        // 选择模板弹出框
        selectTemplateOpen: false,
        /** =========模板选择end======== */
        certificate: {
          id: undefined,
          status: undefined
        },
        statusOpen: false,
        categoryList: [],
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
        // 证书表格数据
        certificateList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          categoryId: undefined,
          name: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: '证书名称不能为空', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '证书类型不能为空', trigger: 'blur' }
          ],
          templateId: [
            { required: true, message: '证书模板不能为空', trigger: 'blur' }
          ],
          typeId: [
            { required: true, message: '证书对应培训不能为空', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '证书编号规则不能为空', trigger: 'blur' }
          ],
          publishType: [
            { required: true, message: '证书发放条件不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getList()
      this.getCategory()
    },
    methods: {
      /** 跳转用户证书界面 */
      toUserCertificate(item) {
        this.$router.push({
          path: '/certificate/userCertificate',
          query: {
            id: item.id,
            certCategoryName: item.categoryName
          }
        })
      },
      /** 选择课程 */
      selectCurriculum(item) {
        this.form.type = this.curriculumType == 0 ? 1 : 2
        if (this.curriculumType == 0) {
          this.form.typeId = item.id
          this.form.typeName = [item.subjectTitle]
        } else {
          this.form.typeId = item.specialId
          // 查询专题下课程
          queryCourseList(item.specialId).then(res => {
            this.form.typeName = res.data.map(obj => {
              return obj.subjectTitle
            })
            this.$forceUpdate()
          })
        }
        this.curriculumOpen = false
      },
      /** 转换部门数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children
        }
        return {
          id: node.id,
          label: node.categoryName,
          children: node.children
        }
      },
      /** 查询分类 */
      getCurriculumCategoryList() {
        if (this.curriculumType == 0) {
          //课程分类
          treeselect().then(response => {
            this.curriculumCategoryList = response.data
          })
        } else {
          // 专题分类
          specialTreeselect().then(response => {
            this.curriculumCategoryList = this.handleTree(response.data, 'id', 'pid')
          })
        }
      },
      /** 查询课程以及分类集合 0-课程 1-专题 */
      getCurriculumList() {
        this.curriculumOpen = true
        if (this.curriculumType == 0) {
          let queryParams = {
            pageNum: this.curriculumQueryParams.pageNum,
            pageSize: this.curriculumQueryParams.pageSize,
            categoryId: this.curriculumQueryParams.categoryId,
            subjectTitle: this.curriculumQueryParams.name,
            deleteTime: 0
          }
          // 查询课程
          this.curriculumLoading = true
          listSubject(queryParams).then(response => {
            this.curriculumList = response.rows
            this.curriculumTotal = response.total
            this.curriculumLoading = false
          })
        } else {
          // 查询专题
          let queryParams = {
            pageNum: this.curriculumQueryParams.pageNum,
            pageSize: this.curriculumQueryParams.pageSize,
            categoryId: this.curriculumQueryParams.categoryId,
            specialName: this.curriculumQueryParams.name,
            deleteSign: 0
          }
          this.curriculumLoading = true
          listSpecial(queryParams).then(response => {
            this.curriculumList = response.rows
            this.curriculumTotal = response.total
            this.curriculumLoading = false
          })
        }
      },
      /** 选择模板 */
      selectTemplate(data) {
        this.selectTemplateOpen = false
        this.form.templateName = data.name
        this.form.templateId = data.id
      },
      /** 证书模板预览 */
      preview(data) {
        pdfPreview(data).then(res => {
          const data = res
          let blob = new Blob([data]);   // 返回的文件流数据
          this.imageUrl = window.URL.createObjectURL(blob);  // 将他转化为路径
          this.previewOpen = true
        })
      },
      /** 查询模板列表 */
      getTemplateList() {
        this.templateLoading = true
        this.templateQueryParams.categoryId = this.form.categoryId;
        listTemplate(this.templateQueryParams).then(response => {
          this.templateList = response.rows
          this.templateTotal = response.total
          this.selectTemplateOpen = true
          this.templateLoading = false
        })
      },
      /** 模板状态修改弹出框 */
      statusUpl(data) {
        this.certificate.id = data.id
        this.certificate.status = data.status
        this.statusOpen = true
      },
      /** 状态更改确认 */
      statusChange() {
        updateCertificateStatus(this.certificate).then(res => {
          if (res.code == 200) {
            this.$message.success('状态修改成功')
            this.statusOpen = false
            this.getList()
          }
        })
      },
      /** 查询证书分类列表 */
      getCategory() {
        listCategory().then(response => {
          this.categoryList = response.data
        })
      },
      /** 查询证书列表 */
      getList() {
        this.loading = true
        listCertificate(this.queryParams).then(response => {
          this.certificateList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.statusOpen = false
        this.open = false
        this.previewOpen = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          name: undefined,
          remark: undefined,
          categoryId: undefined,
          templateId: undefined,
          typeId: undefined,
          expire: undefined,
          code: undefined,
          publishType: 0
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加证书'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getCertificate(id).then(response => {
          this.form = {
            id: response.data.id,
            name: response.data.name,
            remark: response.data.remark,
            categoryId: response.data.categoryId,
            templateId: response.data.templateId,
            templateName: response.data.templateName,
            typeId: response.data.typeId,
            expire: response.data.expire,
            code: '',
            publishType: response.data.publishType
          }
          this.form.typeName = response.data.courseSubjects.map(item => {
            return item.subjectTitle
          })
          response.data.ruleWrapper.data.forEach(item => {
            if (item.sort == 1) {
              this.form.code = item.categoryData
            }
          })
          this.open = true
          this.title = '修改证书'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let ruleList = [
              {
                'ruleCode': 'CUSTOM_TEXT',
                'categoryData': this.form.code,
                'sort': '1'
              },
              {
                'ruleCode': 'DATE_FORMAT',
                'categoryData': 'yyyyMMdd',
                'sort': '2'
              },
              {
                'ruleCode': 'RANDOM_NUMBER',
                'categoryData': '{ \'max\': 999, \'min\': 100 }',
                'sort': '3'
              }
            ]
            this.form.ruleWrapper = {
              'data': ruleList
            }
            if (this.form.id != undefined) {
              updateCertificate(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addCertificate(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除证书编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delCertificate(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有证书数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportCertificate(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
