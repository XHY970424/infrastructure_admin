<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="主标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入主标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="副标题" prop="subhead">
        <el-input
          v-model="queryParams.subhead"
          placeholder="请输入副标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="栏目类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择栏目类型">
          <el-option label="课程" value="COURSE"></el-option>
          <el-option label="面授课程" value="MSCOURSE"></el-option>
          <el-option label="精选课程" value="JXCOURSE"></el-option>
          <el-option label="推荐专题" value="TJSPECIAL"></el-option>
          <el-option label="专题" value="SPECIAL"></el-option>
          <el-option label="讲师" value="TEACHER"></el-option>
          <el-option label="业务场景" value="BIZ"></el-option>
          <el-option label="平台特色" value="FEATURE"></el-option>
          <el-option label="新闻资讯" value="NEWS"></el-option>
          <el-option label="友情链接" value="LINK"></el-option>
          <el-option label="新基建" v-if="showCto" value="NEW_CONSTRUCTION"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="停用" :value="0"/>
          <el-option label="启用" :value="1"/>
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
          v-hasPermi="['cms:indexColumn:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cms:indexColumn:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cms:indexColumn:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cms:indexColumn:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="columnList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"  />
      <el-table-column label="主标题" align="center" prop="title" width="150px" :show-overflow-tooltip="true"/>
      <el-table-column label="副标题" align="center" prop="subhead" width="150px" :show-overflow-tooltip="true"/>
      <el-table-column label="栏目类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'COURSE'">课程</span>
          <span v-if="scope.row.type == 'MSCOURSE'">面授课程</span>
          <span v-if="scope.row.type=='TJSPECIAL'">推荐专题</span>
          <span v-if="scope.row.type == 'SPECIAL'">专题</span>
          <span v-if="scope.row.type == 'TEACHER'">讲师</span>
          <span v-if="scope.row.type == 'BIZ'">业务场景</span>
          <span v-if="scope.row.type == 'FEATURE'">平台特色</span>
          <span v-if="scope.row.type == 'NEWS'">新闻资讯</span>
          <span v-if="scope.row.type == 'LINK'">友情链接</span>
          <span v-if="scope.row.type == 'JXCOURSE'">精选课程</span>
          <span v-if="scope.row.type == 'NEW_CONSTRUCTION'">新基建</span>
        </template>
      </el-table-column>
      <el-table-column label="栏目跳转链接" align="center" prop="url" :show-overflow-tooltip="true"/>
      <el-table-column label="背景" align="center" prop="background" :show-overflow-tooltip="true"/>

      <el-table-column label="主标字体大小" align="center" prop="titleSize"/>
      <el-table-column label="副标字体大小" align="center" prop="subheadSize"/>
      <el-table-column label="主标颜色" align="center" prop="titleColor"/>
      <el-table-column label="副标颜色" align="center" prop="subheadColor"/>
      <el-table-column label="侧边栏" align="center" prop="navFlag">
        <template slot-scope="scope">
          <span :style="{color: (scope.row.navFlag == 0? 'red' : 'green')}">{{
              scope.row.navFlag == 0 ? '停用' : '启用'
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span :style="{color: (scope.row.status == 0? 'red' : 'green')}">{{
              scope.row.status == 0 ? '停用' : '启用'
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="侧边栏" align="center">
        <el-table-column label="主题" align="center" prop="navTitle"/>
        <el-table-column label="主题颜色" align="center" prop="navTitleColor"/>
        <el-table-column label="内容" align="center" prop="navContent" :show-overflow-tooltip="true"/>
        <el-table-column label="内容颜色" align="center" prop="navContentColor"/>
        <el-table-column label="背景颜色" align="center" prop="navBgColor"/>
        <el-table-column label="图片" align="center" prop="navImg" :show-overflow-tooltip="true"/>
      </el-table-column>

      <el-table-column  fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="320px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="statusUpdate(scope.row)"
            v-hasPermi="['cms:indexColumn:edit']"
          >状态变更
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cms:indexColumn:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cms:indexColumn:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-date"
            @click="toColumnList(scope.row)"
          >栏目管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改主页栏目对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="1100px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="主标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入主标"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题" prop="subhead">
              <el-input v-model="form.subhead" placeholder="请输入副标"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">

            <el-form-item label="栏目类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择栏目类型" @change="typeChange">
                <el-option label="课程" value="COURSE"></el-option>
                <el-option label="面授课程" value="MSCOURSE"></el-option>
                <el-option label="精选课程" value="JXCOURSE"></el-option>
                <el-option label="推荐专题" value="TJSPECIAL"></el-option>
                <el-option label="专题" value="SPECIAL"></el-option>
                <el-option label="讲师" value="TEACHER"></el-option>
                <el-option label="业务场景" value="BIZ"></el-option>
                <el-option label="平台特色" value="FEATURE"></el-option>
                <el-option label="新闻资讯" value="NEWS"></el-option>
                <el-option label="友情链接" value="LINK"></el-option>
                <el-option label="新基建" v-if="showCto" value="NEW_CONSTRUCTION"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="跳转链接" prop="url">
              <el-input v-model="form.url" placeholder="请输入跳转链接"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">停用</el-radio>
                <el-radio :label="1">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="主标题颜色" prop="titleColor" label-width="85px">-->
<!--              <div class="block">-->
<!--                <el-color-picker v-model="form.titleColor"></el-color-picker>-->
<!--              </div>-->
<!--              &lt;!&ndash;              <el-input v-model="form.titleColor" placeholder="请输入主标题颜色"/>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="副标题颜色" prop="subheadSize" label-width="85px">-->
<!--              <div class="block">-->
<!--                <el-color-picker v-model="form.subheadColor"></el-color-picker>-->
<!--              </div>-->
<!--              &lt;!&ndash;              <el-input v-model="form.subheadColor" placeholder="请输入副标题颜色"/>&ndash;&gt;-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="主标题字体大小" prop="titleSize" label-width="110px">-->
<!--              <el-input-number v-model="form.titleSize" :step="2" step-strictly :min="12"></el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="副标题字体大小" prop="subheadColor" label-width="110px">-->
<!--              <el-input-number v-model="form.subheadSize" :step="2" step-strictly :min="12"></el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-row>
          <el-col :span="4">
            <el-form-item label="背景" prop="background">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgorundImgUrl"
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
            <el-image :preview-src-list="[form.background]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.background" :src="form.background"
            />
          </el-col>
        </el-row>
<!--        <el-divider v-if="form.navFlag === 1" content-position="center">侧边栏</el-divider>-->
<!--        <el-row type="flex" justify="center">-->
<!--          <el-col :span="6">-->
<!--            <el-form-item label="侧边栏" sebt prop="navFlag">-->
<!--              <el-radio-group v-model="form.navFlag" :disabled="navDisable">-->
<!--                <el-radio :label="0">停用</el-radio>-->
<!--                <el-radio :label="1">启用</el-radio>-->
<!--              </el-radio-group>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->

        <!--       侧边栏 -->
<!--        <el-row type="flex" justify="left" v-if="form.navFlag === 1">-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="主题" prop="navTitle">-->
<!--              <el-input v-model="form.navTitle" placeholder="请输入主题"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="主题颜色" prop="navTitleColor">-->
<!--              <div class="block">-->
<!--                <el-color-picker v-model="form.navTitleColor"></el-color-picker>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row type="flex" justify="left" v-if="form.navFlag === 1">-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="内容" prop="navContent">-->
<!--              <el-input v-model="form.navContent" placeholder="请输入内容"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="内容颜色" prop="navContentColor">-->
<!--              <el-color-picker v-model="form.navContentColor"></el-color-picker>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row type="flex" justify="left" v-if="form.navFlag === 1">-->
<!--          <el-col :span="6">-->
<!--            <div style="margin-left: 36px; color: red"><span>图片尺寸建议为196px*230</span></div>-->
<!--            <el-form-item label="侧边栏图片" prop="navImg" label-width="120px">-->
<!--              <el-upload-->
<!--                class="avatar-uploader"-->
<!--                :action="uploadBackgorundImgUrl"-->
<!--                :show-file-list="false"-->
<!--                :headers="headers"-->
<!--                :on-success="handleNavImgUploadSuccess"-->
<!--                accept="image/png,image/jpeg"-->
<!--              >-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-image :preview-src-list="[form.navImg]" :z-index="2200"-->
<!--                      style="max-width: 100px;max-height: 100px"-->
<!--                      v-show="form.navImg" :src="form.navImg"-->
<!--            />-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="背景色" prop="navBgColor">-->
<!--              <div class="block">-->
<!--                <el-color-picker v-model="form.navBgColor"></el-color-picker>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listColumn, getColumn, delColumn, addColumn, updateColumn, exportColumn } from '@/api/cms/indexColumn'
import { getToken } from '@/utils/auth'
import Template from '../../certificate/template/index'

export default {
  name: 'Column',
  components: { Template },
  data() {
    return {
      // 是否启用
      navDisable: false,
      // 是否显示新基建选项
      showCto: false,
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      // 上传图片地址
      uploadBackgorundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg', // 上传的图片服务器地址
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
      // 主页栏目表格数据
      columnList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        subhead: undefined,
        type: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: '主标题不能为空', trigger: 'blur' }
        ],
        subhead: [
          { required: true, message: '副标题不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '栏目类型不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.hasCto();
  },
  methods: {
    // 选择类型事件
    typeChange() {
      // 不是课程类型,专题类型和新基建类型的不允许有侧边栏
      if (this.form.type !='COURSE' && this.form.type !='SPECIAL' && this.form.type !='NEW_CONSTRUCTION') {
        // 设置 侧边栏禁用
        this.navDisable = true
        // 设置 侧边栏为 停用
        this.form.navFlag = 0
      }else {
        this.navDisable = false
      }
    },
    // 是否可以添加新基建类型
    hasCto() {
      if (this.$store.state.user.tenant === '1') {
        this.showCto = true
      }
    },
    // 跳转栏目管理列表
    toColumnList(row) {
      let path = ''
      let queryData = {}
      queryData.indexColumnId = row.indexColumnId
      switch (row.type) {
        case 'COURSE':
          // 课程
          path = '/cms/course'
          break
        case 'TJSPECIAL':
          //推荐专题
          path = '/cms/tjspecial'
          break
          //面授课程
        case 'MSCOURSE':
          path = '/cms/mscourse'
          break
        case 'SPECIAL':
          // 专题
          path = '/cms/special'
          break
        case 'TEACHER':
          // 讲师
          path = '/cms/teacher'
          break
        case "JXCOURSE":
          //精选课程
          path = '/cms/jxcourse'
          break
        case 'BIZ':
          // 业务场景
          path = '/cms/biz'
          break
        case 'FEATURE':
          // 平台特色
          path = '/cms/feature'
          break
        case 'NEWS':
          // 新闻资讯
          path = '/cms/content'
          break
        case 'LINK':
          // 友情链接
          path = '/cms/link'
          break
        case 'NEW_CONSTRUCTION':
          // 新基建
          path = '/cms/construction'
          break
      }
      this.$router.push({
        path: path,
        query: queryData
      })
    },
    // 上传背景图片成功
    handleSealUploadSuccess(res) {
      if (res.code == 200) {
        this.form.background = res.url
      } else {
        this.$message.error(res.msg)
      }
    }, handleNavImgUploadSuccess(res) {
      if (res.code == 200) {
        this.form.navImg = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    /** 查询主页栏目列表 */
    getList() {
      this.loading = true
      listColumn(this.queryParams).then(response => {
        this.columnList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        indexColumnId: undefined,
        title: undefined,
        subhead: undefined,
        type: undefined,
        url: undefined,
        background: undefined,
        extraData: undefined,
        status: 0,
        titleSize: 30,
        subheadSize: 20,
        titleColor: undefined,
        subheadColor: undefined,
        sort: 0,
        navFlag: 0
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
      this.ids = selection.map(item => item.indexColumnId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加主页栏目'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const indexColumnId = row.indexColumnId || this.ids
      getColumn(indexColumnId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改主页栏目'
        this.typeChange()
      })
    },
    /** 状态变更 */
    statusUpdate(row) {
      let statusTxt = row.status == 0 ? '启用' : '停用'
      this.$confirm('是否' + statusTxt + '当前栏目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          indexColumnId: row.indexColumnId,
          status: row.status == 0 ? 1 : 0
        }
        updateColumn(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.indexColumnId != undefined) {
            updateColumn(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addColumn(this.form).then(response => {
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
      const indexColumnIds = row.indexColumnId || this.ids
      this.$confirm('是否确认删除主页栏目编号为"' + indexColumnIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delColumn(indexColumnIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有主页栏目数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportColumn(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {
      })
    }
  }
}
</script>
