<template>
  <!-- 添加或修改专题分类 对话框 -->
  <el-dialog :title="categoryTitle" v-loading="loading" :visible.sync="categoryOpen" width="500px"
             :close-on-click-modal="false"
             append-to-body :before-close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级分类" prop="pid">
        <treeselect v-model="form.pid" :options="categoryOptions" :normalizer="normalizer" placeholder="请选择父ID"/>
      </el-form-item>
      <el-form-item label="分类名" prop="categoryName">
        <el-input v-model="form.categoryName" placeholder="请输入专题分类名"/>
      </el-form-item>
      <el-form-item label="显示排序" prop="sort">
        <el-input-number v-model="form.sort" :max="100" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { addSpecialcategory, listSpecialcategory, updateSpecialcategory } from '@/api/course/specialcategory'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'index',
    components: { Treeselect },
    props: {
      categoryTitle: String,
      categoryOpen: Boolean,
      dataForm: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        loading: false,
        // 表单参数
        form: this.dataForm,
        // 表单校验
        rules: {
          pid: [
            { required: true, message: '父ID不能为空', trigger: 'blur' }
          ],
          categoryName: [
            { required: true, message: '专题分类名不能为空', trigger: 'blur' }
          ]
        },
        // 专题分类 树选项
        categoryOptions: []
      }
    },
    created() {
      this.getTreeselect()
    },
    methods: {
      cancel() {
        this.$emit('cancelCourseCategory')
      },
      /** 转换专题分类 数据结构 */
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
      /** 查询专题下拉树结构 */
      getTreeselect() {
        this.loading = true
        listSpecialcategory().then(response => {
          this.categoryOptions = []
          const data = { id: 0, categoryName: '顶级节点', children: [] }
          data.children = this.handleTree(response.data, 'id', 'pid')
          this.categoryOptions.push(data)
          this.loading = false
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateSpecialcategory(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.$emit('cancelCourseCategory')
                  this.$emit('getList')
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addSpecialcategory(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.$emit('cancelCourseCategory')
                  this.$emit('getList')
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          }
        })
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
          updateTime: undefined,
          status: 0,
          sort: 0
        }
        this.resetForm('form')
      }
    }
  }
</script>

<style scoped>

</style>
