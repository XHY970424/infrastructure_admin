<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="证书类型" prop="type">
        <el-select v-model="queryParams.categoryId" placeholder="请选择证书类型" clearable size="small">
          <el-option :label="item.name" :value="item.id" v-for="item in categoryList"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模板状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="模板状态" clearable size="small">
          <el-option label="未发布" :value="0"/>
          <el-option label="已发布" :value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称 " prop="title">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入模板名称 "
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
          v-hasPermi="['certificate:template:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange" border>
      <el-table-column label="模板名称" align="center" prop="name"/>
      <el-table-column label="证书类型" align="center" prop="categoryName"/>
      <el-table-column label="创建人 " align="center" prop="createBy"/>
      <el-table-column label="创建时间 " align="center" prop="createTime"/>
      <el-table-column label="模板状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-show="scope.row.status == 0">未发布</span>
          <span v-show="scope.row.status == 1" style="color:forestgreen;">已发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="statusUpl(scope.row)"
            v-hasPermi="['certificate:template:updateStatus']"
          >状态
          </el-button>
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['certificate:template:edit']"
          >模板设置
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
    <el-dialog :close-on-click-modal="false" title="模板状态修改" :visible.sync="statusOpen" width="300px" append-to-body>
      <el-radio-group v-model="template.status">
        <el-radio :label="0">关闭</el-radio>
        <el-radio :label="1">启用</el-radio>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="statusChange">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改证书模板对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入模板名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书类型" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择证书类型">
                <el-option :label="item.name" :value="item.id" v-for="item in categoryList"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="横版/竖版" prop="horiz">
              <el-radio-group v-model="form.horiz">
                <el-radio :label="0">竖版</el-radio>
                <el-radio :label="1">横版</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证书底图" prop="background">
              <el-upload
                class="avatar-uploader"
                :action="uploadInvoiceImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleBackgroundUploadSuccess"
                accept="image/png,image/jpeg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.background]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.background" :src="form.background"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 30px;text-align: right;font-size: 12px;color: #8c939d">请上传jpg、png格式的证书底图，建议尺寸为 3600 × 2600 px，文件大小不超过 2 MB</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="form.seal ? 6 : 12">
            <el-form-item label="证书印章" prop="seal">
              <el-upload
                class="avatar-uploader"
                :action="uploadInvoiceImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleSealUploadSuccess"
                accept="image/png,image/jpeg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.seal]"
                      style="max-width: 100px;max-height: 100px" :z-index="2200"
                      v-show="form.seal" :src="form.seal"/>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书标题 " prop="title">
              <el-input v-model="form.title" placeholder="请输入证书标题 "/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div style="line-height: 30px;text-align: left;font-size: 12px;color: #8c939d">请上png、jpg等格式透明背景的印章图片，建议尺寸为 650 × 650 px，文件大小不超过 2 MB</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="被授予人" prop="userInfo">
              <el-input v-model="form.userInfo" placeholder="请输入被授予人信息，如：{nickName}同学："/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="证书正文" prop="content">
              <el-input v-model="form.content" type="textarea" placeholder="请输入内容，如：在{projectPlanName}课程中学习表现优秀，完成课程并通过考核，特发此证。"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;color: #8c939d;line-height: 20px">
          <el-col :span="24">
            <span>可选填,被授予人与证书正文中支持添加占位符=>
              专题/课程名称：<span class="placeholder">{projectPlanName}</span>
              专题下课程名称：<span class="placeholder">{childCourse}</span>
              学时：<span class="placeholder">{hours}</span>
              昵称：<span class="placeholder">{nickName}</span>
              用户名：<span class="placeholder">{userName}</span>
              身份证：<span class="placeholder">{idCard}</span>
              开始学习日期：<span class="placeholder">{projectPlanStartDate}</span>
              完成日期：<span class="placeholder">{projectPlanEndDate}</span>
            </span>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="发证机构" prop="organization">
              <el-input v-model="form.organization" placeholder="请输入发证机构名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="11" style="margin-left: 5px;position: relative;top: 5px">
            <el-switch
              v-model="form.qrCodeFlag"
              inactive-text="证书验证二维码">
            </el-switch>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="info" @click="previewAdd">预 览</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="证书模板预览" :visible.sync="previewOpen" width="1000px" append-to-body>
<!--      <iframe-->
<!--        frameborder="0"-->
<!--        scrolling="auto"-->
<!--        :src="imageUrl"-->
<!--        type="application/x-google-chrome-pdf"-->
<!--        width="100%"-->
<!--        height="622px"-->
<!--      />-->
      <el-image :preview-src-list="[imageUrl]" fit="contain"
                :z-index="2200"
                v-show="imageUrl" :src="imageUrl"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addTemplate,
    delTemplate,
    exportTemplate,
    getTemplate,
    listTemplate,
    pdfPreview,
    updateTemplate,
    updateTemplateStatus
  } from '@/api/certificate/template'
  import { listCategory } from '@/api/certificate/category'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'Template',
    data() {
      return {
        previewOpen: false,
        imageUrl: '',
        // 请求头
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        // 上传图片地址
        uploadInvoiceImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
        template: {
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
        // 证书模板表格数据
        templateList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: undefined,
          status: undefined,
          categoryId: undefined
        },
        // 表单参数
        form: {
          name: undefined,
          categoryId: undefined,
          horiz: 0,
          background: undefined,
          seal: undefined,
          title: undefined,
          userInfo: undefined,
          content: undefined,
          organization: undefined,
          qrCodeFlag: 1
        },
        // 表单校验
        rules: {
          name: [
            { required: true, message: '模板名称不能为空', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '证书类型不能为空', trigger: 'blur' }
          ],
          background: [
            { required: true, message: '证书底图不能为空', trigger: 'blur' }
          ],
          seal: [
            { required: true, message: '证书印章不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '证书标题不能为空', trigger: 'blur' }
          ],
          userInfo: [
            { required: true, message: '被授予人信息不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '证书正文不能为空', trigger: 'blur' }
          ],
          organization: [
            { required: true, message: '发证机构名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getCategory()
      this.getList()
    },
    methods: {
      /** 新增修改时预览 */
      previewAdd() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let param = {
              'name': this.form.name,
              'categoryId': this.form.categoryId,
              'horiz': this.form.horiz,
              'background': this.form.background,
              'seal': this.form.seal,
              'title': this.form.title,
              'userInfo': this.form.userInfo,
              'content': this.form.content,
              'organization': this.form.organization,
              'qrCodeFlag': this.form.qrCodeFlag ? 1 : 0
            }
            pdfPreview(param).then(res => {
              const data = res
              let blob = new Blob([data]);   // 返回的文件流数据
              this.imageUrl = window.URL.createObjectURL(blob);  // 将他转化为路径
              this.previewOpen = true
            })
          }
        })
      },
      /** 证书模板预览 */
      preview(data) {
        pdfPreview(data).then(res => {
          const data = res
          let blob = new Blob([data]);   // 返回的文件流数据
          this.imageUrl = window.URL.createObjectURL(blob);  // 将他转化为路径
          // /* 兼容ie内核，360浏览器的兼容模式 */
          // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //   const blob = new Blob([data], {
          //     type: 'application/pdf;charset=utf-8'
          //   })
          //   window.navigator.msSaveOrOpenBlob(blob, '证书模板预览.pdf')
          // } else {
          //   /* 火狐谷歌的文件下载方式 */
          //   var blob = new Blob([data], {
          //     type: 'application/pdf;charset=utf-8'
          //   })
          //   var href = window.URL.createObjectURL(blob)
          //   this.imageUrl = href
          // }
          this.previewOpen = true
        })
      },
      // 上传证书印章成功
      handleSealUploadSuccess(res) {
        if (res.code == 200) {
          this.form.seal = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      // 上传证书底图成功
      handleBackgroundUploadSuccess(res) {
        if (res.code == 200) {
          this.form.background = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      /** 状态更改确认 */
      statusChange() {
        updateTemplateStatus(this.template).then(res => {
          if (res.code == 200) {
            this.$message.success('状态修改成功')
            this.statusOpen = false
            this.getList()
          }
        })
      },
      /** 模板状态修改弹出框 */
      statusUpl(data) {
        this.template.id = data.id
        this.template.status = data.status
        this.statusOpen = true
      },
      /** 查询证书分类列表 */
      getCategory() {
        listCategory().then(response => {
          this.categoryList = response.data
        })
      },
      /** 查询证书模板列表 */
      getList() {
        this.loading = true
        listTemplate(this.queryParams).then(response => {
          this.templateList = response.rows
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
          categoryId: undefined,
          horiz: 0,
          background: 'https://vo.bbazxw.com/bbazxw/file/pdf/default_horizontal_basemap.jpg',
          seal: 'https://vo.bbazxw.com/bbazxw/file/pdf/default_stamp.png',
          title: undefined,
          userInfo: undefined,
          content: undefined,
          organization: undefined,
          qrCodeFlag: 1
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
        this.title = '添加证书模板'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getTemplate(id).then(response => {
          this.form = response.data
          this.form.qrCodeFlag = response.data.qrCodeFlag == 0 ? false : true
          this.open = true
          this.title = '修改证书模板'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let param = {
              'id': this.form.id,
              'name': this.form.name,
              'categoryId': this.form.categoryId,
              'horiz': this.form.horiz,
              'background': this.form.background,
              'seal': this.form.seal,
              'title': this.form.title,
              'userInfo': this.form.userInfo,
              'content': this.form.content,
              'organization': this.form.organization,
              'qrCodeFlag': this.form.qrCodeFlag ? 1 : 0
            }
            if (param.id != undefined) {
              updateTemplate(param).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addTemplate(param).then(response => {
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
        this.$confirm('是否确认删除证书模板编号为"' + ids + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delTemplate(ids)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有证书模板数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportTemplate(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
<style>
  .placeholder {
    color: green;
  }
</style>
