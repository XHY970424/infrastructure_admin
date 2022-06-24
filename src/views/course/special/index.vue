<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
      <el-form-item label="专题名称" prop="specialName">
        <el-input
          v-model="queryParams.specialName"
          placeholder="请输入专题名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="分类" prop="categoryId">
        <treeselect v-model="queryParams.categoryId" :options="specialCategoryOptions"
                    placeholder="请选择分类" style="width: 250px"/>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="下架" :value=0></el-option>
          <el-option label="上架" :value=1></el-option>
          <el-option label="草稿" :value=2></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select v-model="queryParams.isRecommend" placeholder="是否推荐" clearable size="small">
          <el-option label="不推荐" :value=0></el-option>
          <el-option label="推荐" :value=1></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否展示" prop="homeShow">
        <el-select v-model="queryParams.homeShow" placeholder="是否展示" clearable size="small">
          <el-option label="不展示" :value=0></el-option>
          <el-option label="展示" :value=1></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.startDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止时间" prop="endDate">
        <el-date-picker clearable size="small" style="width: 200px"
                        v-model="queryParams.endDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择截止时间">
        </el-date-picker>
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
          v-hasPermi="['eycode:special:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['eycode:special:edit']"
        >修改
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['eycode:special:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['eycode:special:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTime"
                   v-hasPermi="['eycode:subject:deleteTime']">{{recycleBin}}
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button icon="el-icon-position" v-hasPermi="['eycode:special:updateStatus']" type="primary"
                   :disabled="multiple" size="mini"
                   @click="specialOperationTitle='专题上线',specialOperationOpen=true,specialOperation=0">是否上架
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button icon="el-icon-position" v-hasPermi="['eycode:special:updateStatus']" type="primary"
                   :disabled="multiple" size="mini"
                   @click="specialOperationTitle='专题推荐',specialOperationOpen=true,specialOperation=1">是否推荐
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="specialList" border="" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="排序" align="center" prop="sort" width="95" type="number">
        <template slot-scope="scope">
          <el-input :min="0" type="number" v-model="scope.row.sort" @change="updateSort(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="specialId" width="60"/>
      <el-table-column label="专题名称" align="center" prop="specialName" width="180px" :show-overflow-tooltip="true"/>
      <el-table-column label="分类名称" align="center" prop="categoryName" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">下架</span>
          <span v-if="scope.row.status == 1">上架</span>
          <span v-if="scope.row.status == 2">草稿</span>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend == 0">不推荐</span>
          <span v-if="scope.row.isRecommend == 1">推荐</span>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" align="center" prop="homeShow">
        <template slot-scope="scope">
          <span>{{scope.row.homeShow == 0 ? '不展示' : '展示'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="专题介绍" align="center" prop="description" /> -->
      <el-table-column label="价格" align="center" prop="price"/>
      <!-- <el-table-column label="折扣价" align="center" prop="discountPrice" /> -->
      <el-table-column label="总学时" align="center" prop="hours"/>
      <el-table-column label="购买人数" align="center" prop="buyCount">
        <template slot-scope="scope">
          <span>{{scope.row.buyCount > 0 ? scope.row.buyCount+'人' : '暂无'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开始时间" align="center" prop="startDate" width="180"> -->
      <!-- <template slot-scope="scope">
        <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
      </template> -->
      <el-table-column label="截止时间" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span v-show="scope.row.endDate">{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
          <span v-show="!scope.row.endDate">长期</span>
        </template>
      </el-table-column>
      <el-table-column label="专题封面图" align="center" prop="imgUrl">
        <!--显示图片-->
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="hover" width="40">
            <el-image slot="reference" style="max-width: 40px;max-height: 40px" :src="scope.row.imgUrl"/>
            <el-image :src="scope.row.imgUrl"></el-image>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" width="100px"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160px"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="400px" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-order" v-hasPermi="['eycode:specialuser:list']">
            <router-link :to="'/specialUser/specialUser/' + scope.row.specialId" class="link-type">
              <span>学员管理</span>
            </router-link>
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-s-order" v-hasPermi="['eycode:class:list']">
            <router-link :to="'/specialClass/class/' + scope.row.specialId" class="link-type">
              <span>班级管理</span>
            </router-link>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:special:edit']"
          >修改
          </el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['eycode:special:remove']"
          >删除</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteTime(scope.row)"
                     v-hasPermi="['eycode:subject:deleteTime']">{{deorhf}}
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

    <!-- 添加或修改专题对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="所属分类" prop="categoryId">
              <treeselect v-model="form.categoryId" :options="specialCategoryOptions"
                          placeholder="请选择分类"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button round size="mini" class="but" @click="categoryAdd">新增分类</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专题名称" prop="specialName">
              <el-input v-model="form.specialName" placeholder="请输入专题名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否展示" prop="homeShow">
              <el-radio-group v-model="form.homeShow">
                <el-radio :label="1"> 展示 </el-radio>
                <el-radio :label="0"> 不展示 </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="报名截止时间" prop="endDate" label-width="120">
              <el-date-picker clearable size="small" style="width: 200px" v-model="form.endDate" type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择截止时间">
              </el-date-picker>
              <span class="spanlan">(选填)——不填代表永久可报名</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number :min="0" v-model="form.sort" placeholder="请输入排序,不填默认为100"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="form.imgUrl ?10:12">
            <el-form-item label="封面图" prop="imgUrl">
              <ImgCutter ref="imgCutterModal" label="点击上传" :crossOrigin="true" crossOriginHeader="*" toolBgc="none"
                         :isModal="true" :showChooseBtn="true" :lockScroll="false" :boxWidth="775" :boxHeight="458"
                         :cutWidth="250"
                         :cutHeight="250" :sizeChange="true" :moveAble="true" :originalGraph="false" :tool="false"
                         :rate="rate"
                         WatermarkText="" WatermarkTextFont="12px Sans-serif" WatermarkTextColor="#fff"
                         :WatermarkTextX="0.95"
                         :WatermarkTextY="0.95" :DoNotDisplayCopyright="true" @cutDown="cutDownSubject">
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="oneTOone">上传(比例1:1)
                </el-button>
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="sixtTOnine">
                  上传(比例16:9)
                </el-button>
              </ImgCutter>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-image v-if="form.imgUrl!=null && form.imgUrl!=''" style="max-width: 100px;max-height: 100px"
                      :z-index="2100"
                      :src="form.imgUrl" :preview-src-list="[form.imgUrl]">
            </el-image>
            <el-input v-model="form.imgUrl" v-show="false"/>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-radio-group v-model="form.isRecommend">
                <el-radio :label="1">推荐</el-radio>
                <el-radio :label="0">不推荐</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="专题介绍" prop="description">
            <EditorTow id="contentEditor" v-if="open" v-model="form.description"/>
          </el-form-item>
        </el-row>
        <!--专题配置参数-->
        <el-row>
          <el-col :span="12">
            <div class="divTitle">配置专题参数<span style="color: red;font-size: 12px">（提示：专题发布上线后，下列参数配置不可修改）</span></div>
          </el-col>
        </el-row>
        <hr style="margin-top: -15px;margin-bottom: 15px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="专题价格" prop="price">
              <el-input-number v-model="form.price" :min="0" :controls="false" :precision="2" placeholder="请输入课程价格"
                               style="align:right !important" :disabled="form.specialId && form.status!=2"/>
              <span class="spanlan">(元)——设置0元时免费</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否显示价格" prop="showPrice" label-width="100">
              <el-radio-group v-model="form.showPrice" @change="showPriceFun"
                              :disabled="form.specialId && form.status!=2">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否走订单流程" prop="showPrice" label-width="120">
              <el-radio-group v-model="form.flowOnline" :disabled="flowDisabled || (form.specialId && form.status!=2)">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否需要实名认证" prop="isAuth" label-width="120">
              <el-radio-group v-model="form.isAuth" :disabled="form.specialId && form.status!=2">
                <el-radio :label="1">需要</el-radio>
                <el-radio :label="0">不需要</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择课程" prop="subjectIds">
              <el-select v-model="form.subjectIds" filterable multiple placeholder="请选择课程" style="width: 100%;"
                         :disabled="form.specialId && form.status!=2">
                <el-option
                  v-for="item in courseSubjectOptions"
                  :key="item.id"
                  :label="item.subjectTitle"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择试卷" prop="examPaperIds">
              <el-select v-model="form.examPaperIds" filterable multiple placeholder="请选择试卷" style="width: 100%;"
                         :disabled="form.specialId && form.status!=2">
                <el-option
                  v-for="item in examPaperOptions"
                  :key="item.id"
                  :label="item.examName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="有效期" prop="usefulLife">
              <el-input-number v-model="form.usefulLife" :min="0" :controls="false" placeholder="选填"
                               :disabled="form.specialId && form.status!=2"/>
              <span class="spanlan">(天)—自购买日起算,填0时课程永久有效</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-show="form.flowOnline == 0">
            <el-form-item label="提示语" prop="hint" style="margin-bottom: 60px;">
              <EditorTow id="hintEditor" v-if="open" v-model="form.hint"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="info" @click="submitForm" v-show="!form.specialId || form.status==2">保存草稿</el-button>
        <el-button type="primary" @click="confirmForm" v-show="form.specialId && form.status!=2">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 专题展示操作弹出框 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :title="specialOperationTitle"
               :visible.sync="specialOperationOpen" width="500px" append-to-body>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
          <el-col :span="1.5" v-show="specialOperation==0">
            <el-radio-group v-model="specialOperationStatus">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="1.5" v-show="specialOperation==0">
            <span style="color: red;font-size: 12px;position: relative;top: 5px">(专题发布上架后，部分参数配置不可修改，是否进行上线确认)</span>
          </el-col>
          <el-col :span="1.5" v-show="specialOperation==1">
            <el-radio-group v-model="specialOperationStatus">
              <el-radio :label="0">不推荐</el-radio>
              <el-radio :label="1">推荐</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-button type="primary" @click="specialOperat">确 定</el-button>
        <el-button @click="specialOperationOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加专题分类 对话框 -->
<!--    <SpecialCategory @cancelCourseCategory="categoryOpen=false" @getList="getTreeselect" categoryTitle="添加专题分类"-->
<!--                     :categoryOpen="categoryOpen"-->
<!--                     :dataForm="categoryForm"-->
<!--                     v-if="categoryOpen"></SpecialCategory>-->
    <!-- 添加课程分类弹框 -->
    <CourseCategory
      @cancelCourseCategory="categoryOpen = false"
      @getList="getTreeselect"
      categoryTitle="添加课程分类"
      :categoryOpen="categoryOpen"
      :dataForm="categoryForm"
      v-if="categoryOpen"
    ></CourseCategory>
  </div>
</template>

<script>
  import {
    addSpecial,
    delSpecial,
    delSpecialByData,
    exportSpecial,
    getExamPaper,
    getSpecial,
    getSubject,
    getTeacherList,
    getWork,
    imgBase64Upload,
    listSpecial,
    specification,
    updateSpecial,
    updateSpecialSort,
    updateSpecialStatus
  } from '@/api/course/special'
  import { treeselect } from "@/api/course/courseCategory";
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import ImgCutter from 'vue-img-cutter'
  import Editor from '@/components/Editor'
  import EditorTow from '@/components/Tinymce'
  import SpecialCategory from '@/components/SpecialCategory'
  import CourseCategory from "@/components/CourseCategory";


  export default {
    name: 'Special',
    components: {
      ImgCutter,
      Treeselect,
      Editor,
      EditorTow,
      SpecialCategory,
      CourseCategory
    },
    data() {
      return {
        categoryOpen: false,
        categoryForm: {},
        specialOperationStatus: 0,
        specialOperationTitle: '',
        specialOperation: 0,
        specialOperationOpen: false,
        flowDisabled: false,
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
        //回收站按钮名称
        recycleBin: '回收站',
        deorhf: '删除',
        // 是否是回收站
        hsz: false,
        // 专题表格数据
        specialList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          specialCode: undefined,
          specialName: undefined,
          categoryId: undefined,
          status: undefined,
          isRecommend: undefined,
          description: undefined,
          price: undefined,
          discountPrice: undefined,
          allHourse: undefined,
          startDate: undefined,
          endDate: undefined,
          isSupervise: undefined,
          isPush: undefined,
          imgUrl: undefined,
          sort: undefined,
          workId: undefined,
          subjectIds: undefined,
          deleteSign: 0,
          homeShow: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          specialName: [
            { required: true, message: '专题名称不能为空', trigger: 'blur' }
          ],
          categoryId: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'blur' }
          ],
          isRecommend: [
            { required: true, message: '请选择是否推荐', trigger: 'blur' }
          ],
          // price: [
          //   { required: true, message: "价格不能为空", trigger: "blur" },
          //   { type: "number", message: "价格必须为数字", trigger: "blur"}
          // ],
          price: [{
            required: true,
            message: '课程价钱不能为空',
            trigger: 'blur'
          }],
          isSupervise: [
            { required: true, message: '请选择是否需对接监管平台', trigger: 'blur' }
          ],
          imgUrl: [
            { required: true, message: '专题封面图不能为空', trigger: 'blur' }
          ],
          startDate: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          // endDate: [
          //   { required: true, message: "请选择截止时间", trigger: "blur" }
          // ],
          // workId: [
          //   { required: true, message: "请选择工种", trigger: "blur" }
          // ],
          subjectIds: [
            { required: true, message: '请选择课程', trigger: 'blur' }
          ],
          showPrice: [
            { required: true, message: '请选择是否显示价格', trigger: 'blur' }
          ],
          flowOnline: [
            { required: true, message: '请选择是否走订单流程', trigger: 'blur' }
          ],
          isAuth: [
            { required: true, message: '请选择是否需要实名认证', trigger: 'blur' }
          ]
        },
        // 分类选择
        specialCategoryOptions: [],
        // 课程选择
        courseSubjectOptions: [],
        // 截图比例
        rate: '16:9',
        // 试题规则选项
        specifications: [],
        // 教师选项
        teacherOptions: [],
        // 工种选项
        workOptions: [],
        // 试卷选项
        examPaperOptions: []
      }
    },
    created() {
      this.getList()
      this.getTreeselect()

      // //试题规则列表
      // specification().then(response => {
      //   this.specifications = response.data
      // })
      // //授课老师列表
      // getTeacherList().then(response => {
      //   this.teacherOptions = response.rows
      // })
      // // 工种列表
      // getWork().then(res => {
      //   this.workOptions = res.data
      // })
    },
    methods: {
      /** 添加专题分类 */
      categoryAdd() {
        this.categoryForm = {
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
        this.resetForm('categoryForm')
        this.categoryOpen = true
      },
      // 专题展示状态改变
      specialOperat() {
        let param = {
          ids: this.ids,
          status: this.specialOperation == 0 ? this.specialOperationStatus : null,
          isRecommend: this.specialOperation == 1 ? this.specialOperationStatus : null
        }
        updateSpecialStatus(param).then(res => {
          if (res.code === 200) {
            this.msgSuccess('修改成功')
            this.specialOperationOpen = false
            this.getList()
          } else {
            this.msgError(res.msg)
          }
        })
      },
      // 是否展示价格值更改事件
      showPriceFun(value) {
        if (value == 0) {
          this.form.flowOnline = 0
          this.flowDisabled = true
        } else {
          this.flowDisabled = false
        }
      },
      /**上传(比例1:1) */
      oneTOone: function(res) {
        this.rate = '1:1'
      },

      /**上传(比例16:9) */
      sixtTOnine: function(res) {
        this.rate = '16:9'
      },
      cutDownSubject: function(res) {
        imgBase64Upload(res.dataURL).then(res => {
          if (res.code == 200) {
            /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
            this.form.imgUrl = res.url
          } else {
            this.$message.error('上传图片异常')
          }
        })
      },
      // 获取课程选项
      getSubjectData(specialId) {
        getSubject(specialId).then(response => {
          this.courseSubjectOptions = response.data
        })
      },
      //更新排序
      updateSort(data) {
        updateSpecialSort(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      },
      /** 查询分类下拉树结构 */
      getTreeselect() {
        // 课程分类
        treeselect().then(response => {
          // this.specialCategoryOptions = this.handleTree(response.data, 'id', 'pid')
          this.specialCategoryOptions = response.data;
        })
      },
      /** 查询专题列表 */
      getList() {
        this.loading = true
        listSpecial(this.queryParams).then(response => {
          this.specialList = response.rows
          this.total = response.total
          this.loading = false
        })
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
      /** 回收站 */
      deleteTime() {
        this.hsz = !this.hsz
        if (this.hsz) {
          this.recycleBin = '退出回收站'
          this.queryParams.deleteSign = 1
          this.deorhf = '恢复'
        } else {
          this.recycleBin = '回收站'
          this.queryParams.deleteSign = 0
          this.deorhf = '删除'
        }
        this.handleQuery()
      },
      /** 逻辑(删除/恢复）按钮操作 */
      handleDeleteTime(row) {
        const data = {
          id: row.specialId
        }
        if (this.hsz) {
          this.$confirm('是否确认恢复专题:"' + row.specialId + '"的数据项?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            data.deleteSign = 0
            return delSpecialByData(data)
          }).then(() => {
            this.getList()
            this.msgSuccess('恢复成功')
          }).catch(function() {
          })
        } else {
          this.$confirm('是否确认删除专题:"' + row.specialId + '"的数据项?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            data.deleteSign = 1
            return delSpecialByData(data)
          }).then(() => {
            this.getList()
            this.msgSuccess('删除成功')
          }).catch(function() {
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          specialId: undefined,
          specialCode: undefined,
          specialName: undefined,
          categoryId: undefined,
          status: 1,
          isRecommend: 1,
          description: undefined,
          price: 0.00,
          discountPrice: undefined,
          allHourse: undefined,
          startDate: undefined,
          endDate: undefined,
          isSupervise: 1,
          imgUrl: undefined,
          sort: 100,
          createTime: undefined,
          updateTime: undefined,
          workId: undefined,
          subjectIds: undefined,
          usefulLife: undefined,
          showPrice: 1,
          flowOnline: 1,
          hint: undefined,
          isAuth: 0,
          homeShow: 1,
        }
        this.resetForm('form')
        // 试卷列表
        getExamPaper().then(res => {
          this.examPaperOptions = res.data
        })
        this.flowDisabled = false
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
        this.ids = selection.map(item => item.specialId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.getSubjectData();
        this.open = true
        this.title = '添加专题信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const specialId = row.specialId || this.ids
        this.getSubjectData(specialId);
        getSpecial(specialId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改专题信息'
          this.showPriceFun(this.form.showPrice)
        })
      },
      /** 草稿提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.specialId != undefined) {
              updateSpecial(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              this.form.status = 2
              addSpecial(this.form).then(response => {
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
      /** 正式确定按钮 */
      confirmForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let param = {
              specialId: this.form.specialId,
              categoryId: this.form.categoryId,
              specialName: this.form.specialName,
              endDate: this.form.endDate,
              sort: this.form.sort,
              imgUrl: this.form.imgUrl,
              isRecommend: this.form.isRecommend,
              description: this.form.description,
              hint: this.form.hint,
              status: this.form.status,
              homeShow: this.form.homeShow
            }
            updateSpecial(param).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const specialIds = row.specialId || this.ids
        this.$confirm('是否确认删除专题编号为"' + specialIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delSpecial(specialIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams
        this.$confirm('是否确认导出所有专题数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return exportSpecial(queryParams)
        }).then(response => {
          this.download(response.msg)
        }).catch(function() {
        })
      }
    }
  }
</script>
<style scoped>
  #contentEditor .editor {
    line-height: normal !important;
    height: 342px;
  }

  .divTitle {
    font-weight: bold;
    margin-bottom: 20px;
    color: black;
  }

  .spanlan {
    color: #00afff;
    font-size: 12px;
  }

  .but {
    position: relative;
    top: 5px;
    left: 5px;
  }
</style>
