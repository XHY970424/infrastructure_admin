<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="82px"
    >
      <el-form-item label="" prop="subjectTitle">
        <el-input
          v-model="queryParams.subjectTitle"
          placeholder="id/课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归属部门" prop="deptId" v-hasRole="['admin']">
        <treeselect
          v-model="queryParams.deptId"
          :options="sxdeptOptions"
          placeholder="请选择归属部门"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryId">
        <treeselect
          v-model="queryParams.categoryId"
          :options="CourseCategoryOptions"
          :show-count="true"
          placeholder="请选择分类"
          style="width: 250px"
        />
      </el-form-item>
      <el-form-item label="是否上线" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="recommend">
        <el-select
          v-model="queryParams.recommend"
          placeholder="请选择是否推荐"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in recommendOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="监管平台" prop="isSupervise">
        <el-select
          v-model="queryParams.isSupervise"
          placeholder="请选择是否推荐"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in isSuperviseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否已推送" prop="isPush">
        <el-select
          v-model="queryParams.isPush"
          placeholder="请选择是否已推送"
          clearable
          size="small"
        >
          <el-option label="已推送" value="1" />
          <el-option label="未推送" value="0" />
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['eycode:subject:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="multiple"
          size="mini"
          @click="pushSubject"
          v-hasPermi="['eycode:subject:push']"
          >(选中项)推送到监管平台
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="pushAllSubject"
          v-hasPermi="['eycode:subject:push']"
          >推送所有未推送的课程至监管平台
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="deleteTime"
          v-hasPermi="['eycode:subject:deleteTime']"
          >{{ recycleBin }}
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          type="warning"
          icon="el-icon-upload2"
          size="mini"
          v-hasPermi="['eycode:subject:importCourse']"
          @click="
            (importCourseOpen = true),
              (courseUploadStatus = ''),
              (imageUploadStatus = '')
          "
          >批量课程导入
        </el-button>
        <div slot="tip" class="el-upload__tip"></div>
      </el-col>

      <el-col :span="1.5" v-show="!hsz">
        <el-button
          icon="el-icon-position"
          v-hasPermi="['eycode:subject:updateStatus']"
          type="primary"
          :disabled="multiple"
          size="mini"
          @click="
            (courseOperationTitle = '课程上线'),
              (courseOperationOpen = true),
              (courseOperation = 0)
          "
          >是否上线
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          icon="el-icon-position"
          v-hasPermi="['eycode:subject:updateStatus']"
          type="primary"
          :disabled="multiple"
          size="mini"
          @click="
            (courseOperationTitle = '课程推荐'),
              (courseOperationOpen = true),
              (courseOperation = 1)
          "
          >是否推荐
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="!hsz">
        <el-button
          icon="el-icon-position"
          v-hasPermi="['eycode:subject:updateStatus']"
          type="primary"
          :disabled="multiple"
          size="mini"
          @click="
            (courseOperationTitle = '课程展示'),
              (courseOperationOpen = true),
              (courseOperation = 2)
          "
          >是否展示
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="subjectList"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column
        label="ID"
        align="center"
        width="55"
        prop="id"
        fixed="left"
      />
      <el-table-column
        label="排序"
        align="center"
        prop="sort"
        width="95"
        type="number"
      >

        <template slot-scope="scope">
          <el-input
            :min="0"
            type="number"
            v-model="scope.row.sort"
            @change="updateSort(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="课程类型"
        header-align="center"
        prop="isSpecialRelevance"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.isSpecialRelevance > 0 ? "专题课程" : "普通课程"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属分类"
        header-align="center"
        prop="categoryName"
        width="120px"
      />
      <el-table-column
        label="课程名称"
        header-align="center"
        prop="subjectTitle"
        show-overflow-tooltip
        width="200px"
      />
      <el-table-column
        label="封面图"
        align="center"
        prop="subjectImageUrl"
        :show-overflow-tooltip="true"
      >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover" width="40">
            <el-image
              slot="reference"
              style="max-width: 40px; max-height: 40px"
              :src="scope.row.subjectImageUrl"
            />
            <el-image :src="scope.row.subjectImageUrl"></el-image>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="授课方式"
        align="center"
        prop="method"
        width="100px"
        :formatter="methodFormat"
      />
      <el-table-column
        label="课程价格"
        align="center"
        prop="price"
        width="100px"
      />
      <el-table-column
        label="总学时"
        align="center"
        prop="subjectHours"
        width="100"
      />
      <el-table-column
        label="购买人数"
        align="center"
        prop="userCount"
        width="80"
      />
      <el-table-column
        label="是否推荐"
        align="center"
        prop="recommend"
        :formatter="recommendFormat"
        width="80"
      />
      <el-table-column
        label="是否上线"
        align="center"
        prop="status"
        :formatter="statusFormat"
        width="80"
      />
      <el-table-column
        label="是否展示"
        align="center"
        prop="isHomeShow"
        width="80"
      >
        <template scope="scope">
          <span v-if="scope.row.isHomeShow == 0"> 不展示 </span>
          <span v-if="scope.row.isHomeShow == 1"> 展示 </span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="预览次数" align="center" prop="previewNumber" width="100" /> -->
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="100px"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="400px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="toChdas(scope.row)"
            v-hasPermi="['eycode:user:list']"
          >
            <span>人员管理</span>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            v-hasPermi="['eycode:class:list']"
          >
            <router-link
              :to="'/subjectClass/class/' + scope.row.id"
              class="link-type"
            >
              <span>班级管理</span>
            </router-link>
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-s-order">
            <router-link
              :to="'/chapter/chapter/' + scope.row.id"
              class="link-type"
            >
              <span>章节列表</span>
            </router-link>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['eycode:subject:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDeleteTime(scope.row)"
            v-hasPermi="['eycode:subject:deleteTime']"
            >{{ deorhf }}
          </el-button>
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

    <!-- 添加或修改课程主题 对话框 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="1160px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <hr style="margin-top: -20px; margin-bottom: 20px" />
        <!--课程基本信息-->
        <el-row>
          <el-col :span="22">
            <el-form-item label="课程分类" prop="categoryId">
              <treeselect
                v-model="form.categoryId"
                :options="CourseCategoryOptions"
                placeholder="请选择课程分类类型"
                :show-count="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button round size="mini" class="but" @click="categoryAdd"
              >新增分类</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="课程名称" prop="subjectTitle">
              <el-input
                v-model="form.subjectTitle"
                placeholder="请输入课程名称"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="授课老师" prop="onlineTeacherId">
              <el-select
                multiple
                collapse-tags
                v-model="selectedArray"
                filterable
                placeholder="请选择授课人"
                @change="selectTeacher"
              >
                <el-option
                  v-for="item in teacherOptions"
                  :key="item.teacherId"
                  :label="item.name"
                  :value="item.teacherId"
                ></el-option>
              </el-select>
              <el-button round size="mini" @click="addTeacherData"
                >新增讲师</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
                :max="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col :span="form.subjectImageUrl ? 8 : 12">
              <el-form-item label="封面图" prop="subjectImageUrl">
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
                  :cutWidth="250"
                  :cutHeight="250"
                  :sizeChange="true"
                  :moveAble="true"
                  :originalGraph="false"
                  :tool="false"
                  :rate="rate"
                  WatermarkText=""
                  WatermarkTextFont="12px Sans-serif"
                  WatermarkTextColor="#fff"
                  :WatermarkTextX="0.95"
                  :WatermarkTextY="0.95"
                  :DoNotDisplayCopyright="true"
                  @cutDown="cutDownSubject"
                >
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-upload"
                    slot="open"
                    @click="oneTOone"
                    >上传(比例1:1)
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-upload"
                    slot="open"
                    @click="sixtTOnine"
                  >
                    上传(比例16:9)
                  </el-button>
                </ImgCutter>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-image
                v-if="
                  form.subjectImageUrl != null && form.subjectImageUrl != ''
                "
                :z-index="2100"
                style="max-width: 100px; max-height: 100px"
                :src="form.subjectImageUrl"
                :preview-src-list="[form.subjectImageUrl]"
              >
              </el-image>
              <el-input v-model="form.subjectImageUrl" v-show="false" />
            </el-col>
            <el-col :span="11">
              <el-form-item label="截止时间" prop="entryEndtime">
                <el-date-picker
                  clearable
                  size="small"
                  style="width: 200px"
                  v-model="form.onlineEndtime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择截止时间"
                >
                </el-date-picker>
                <span class="spanlan">(选填)——不填代表永久可报名</span>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否展示" prop="isHomeShow">
              <el-radio-group v-model="form.isHomeShow">
                <el-radio
                  v-for="dict in isHomeShowOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="recommend">
              <el-radio-group v-model="form.recommend">
                <el-radio
                  v-for="dict in recommendOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="课程介绍"
              prop="subjectIntroduction"
              style="margin-bottom: 60px"
            >
              <EditorTow
                id="contentEditor"
                v-if="open"
                v-model="form.subjectIntroduction"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--课程配置参数-->
        <el-row>
          <el-col :span="12">
            <div class="divTitle">
              配置课程参数<span style="color: red; font-size: 12px"
                >（提示：课程发布上线后，下列参数配置不可修改）</span
              >
            </div>
          </el-col>
        </el-row>
        <hr style="margin-top: -15px" />
        <el-row>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="课程价格" prop="price">
                <el-input-number
                  v-model="form.price"
                  :min="0"
                  :controls="false"
                  :precision="2"
                  placeholder="请输入课程价格"
                  style="align: right !important"
                  :disabled="form.id && form.status != 2"
                />
                <span class="spanlan">(元)——设置0元时免费</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否显示价格"
                prop="showPrice"
                label-width="120"
              >
                <el-radio-group
                  v-model="form.showPrice"
                  @change="showPriceFun"
                  :disabled="form.id && form.status != 2"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否走订单流程"
                prop="showPrice"
                label-width="120"
              >
                <el-radio-group
                  v-model="form.flowOnline"
                  :disabled="flowDisabled || (form.id && form.status != 2)"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col :span="10">
              <el-form-item label="总学时" prop="subjectHours">
                <el-input-number
                  v-model="form.subjectHours"
                  placeholder="请输入课程总学时"
                  maxlength="20"
                  show-word-limit
                  :min="1"
                  :disabled="form.id && form.status != 2"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="是否需要实名认证"
                prop="isAuth"
                label-width="120"
              >
                <el-radio-group
                  v-model="form.isAuth"
                  :disabled="form.id && form.status != 2"
                >
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="授课方式" prop="method">
              <el-radio-group
                v-model="form.method"
                :disabled="form.id && form.status != 2"
              >
                <el-radio
                  v-for="dict in methodOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-show="form.flowOnline == 0">
            <el-form-item
              label="提示语"
              prop="hint"
              style="margin-bottom: 60px"
            >
              <!-- <Editor id="contentEditor" v-model="form.subjectIntroduction"/> -->
              <EditorTow id="hintEditor" v-if="open" v-model="form.hint" />
              <!-- <el-input v-model="form.subjectIntroduction" type="textarea" placeholder="请输入内容" maxlength="200"
                show-word-limit class="textareaclass" /> -->
            </el-form-item>
          </el-col>
        </el-row>
        <!--线上课程-->
        <div class="onlineCourse">
          <el-row>
            <el-col :span="12">
              <div class="divTitle" style="margin-top: 5px">线上课程</div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="测试试卷">
                <div
                  v-for="(item, index) in paperInfo"
                  style="margin-bottom: 10px"
                >
                  <el-select
                    v-model="item.paperId"
                    filterable
                    clearable
                    :disabled="form.id && form.status != 2"
                  >
                    <el-option
                      v-for="item in paperOptions"
                      :key="item.id"
                      :label="item.examName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                  <!-- <el-input-number v-model="item.sort" :min="0" :max="10000"/> -->
                  <!-- <el-button type="danger" @click="deleteElement(item,index)">-</el-button> -->
                </div>
                <!-- <el-button type="primary" @click="addElement">+</el-button> -->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="监管平台" prop="isSupervise">
                <el-radio-group
                  v-model="form.isSupervise"
                  :disabled="form.id && form.status != 2"
                >
                  <el-radio
                    v-for="dict in isSuperviseOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                  >
                    {{ dict.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="工种"
                prop="craftId"
                v-if="form.isSupervise == 1"
              >
                <el-select
                  v-model="form.craftId"
                  filterable
                  placeholder="请选择工种"
                  style="width: 100%"
                  :disabled="form.id && form.status != 2"
                >
                  <el-option
                    v-for="item in craftOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-col :span="24"> -->

          <!-- <el-col :span="12">
             <el-form-item label="课程岗位" prop="postName">
               <el-select v-model="form.postId" clearable filterable placeholder="请选择课程岗位">
                 <el-option v-for="item in postOptions" :key="item.id" :label="item.name" :value="item.id">
                 </el-option>
               </el-select>
             </el-form-item>
           </el-col> -->
          <!-- </el-col> -->
          <el-row>
            <el-col :span="24">
              <!-- <el-col :span="12">
                <el-form-item label="教材管理">
                  <el-button @click="addDomain" size="small" type="primary" icon="el-icon-circle-plus-outline">新增教材</el-button>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item
                  label="教材是否可选"
                  prop="isEvidence"
                  label-width="100px"
                  v-show="bookDate.length > 0"
                >
                  <el-radio-group v-model="form.isEvidence">
                    <el-radio
                      v-for="dict in onlineExercisesOptions"
                      :key="dict.dictValue"
                      :label="parseInt(dict.dictValue)"
                      >{{ dict.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-for="(value, key) in bookDate" :key="key">

              <el-col :span="8">
                <el-form-item :label="'教材(' + (key + 1) + ')'">
                  <el-select
                    v-model="book.bookList[key]"
                    clearable
                    filterable
                    placeholder="请选择教材"
                    @change="setBooklist(key)"
                  >
                    <el-option
                      v-for="item in bookOptions"
                      :key="item.bookId"
                      :label="item.title + '（原价:' + item.price + '元）'"
                      :value="item.bookId"
                    >
                    </el-option>
                  </el-select>
                  <el-button @click.prevent="removeDomain(value, key)"
                    >删除</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="实际售价">
                  <el-input-number
                    v-model="book.price[key]"
                    :min="0"
                    :controls="false"
                    :precision="0"
                    placeholder="请输入价格"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="折扣">
                  <el-input-number
                    v-model="book.bookDiscount[key]"
                    :min="0"
                    :max="1"
                    :controls="false"
                    :precision="2"
                    placeholder="折扣(格式如八折:0.80)"
                    style="align: right !important"
                  />
                  <span class="spanlan">选填（对实际进行打折）</span>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>

          <el-col v-show="bookDate.length > 0">
            <el-form-item
              label="教材领取地址"
              prop="bookAddress"
              label-width="100px"
              v-if="form.categoryId != 10026"
            >
              <el-input
                v-model="form.bookAddress"
                placeholder="请输入教材领取地址"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
          <el-form-item label="建筑工种" prop="craftName">
            <el-select v-model="craftId" filterable multiple placeholder="请选择建筑工种" style="width: 100%;">
              <el-option
                v-for="item in craftOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          </el-col> -->
          <!--        <el-col :span="24">-->
          <!--          <el-form-item label="excel模板URL" prop="excelUrl" label-width="120px">-->
          <!--            <el-input v-model="form.excelUrl" placeholder="请输入文件路径链接"/>-->
          <!--            <el-upload ref="sectionVideoUrl" :file-list="fileExcelList" action="" :http-request="fileUploadExcel" :before-upload="fileExcelBeforeUpload" :limit="1" :auto-upload="true"-->
          <!--                           list-type="xls" accept="xls/*" name="excel_file">-->
          <!--                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>-->
          <!--            </el-upload>-->
          <!--          </el-form-item>-->
          <!--        </el-col>-->

          <el-col :span="24" v-show="form.method == 0 || form.method == 2 || 1">
            <!-- <el-col :span="12">
              <el-form-item label="考勤抓拍" prop="onlineProof">
                <el-input-number v-model="form.onlineProof" :min="0" :controls="false" :precision="0" placeholder="请输入考勤抓拍 次/课时"
                  style="align:right !important" />
                <span class="spanlan">次/课时——输入0时，不进行考勤抓拍</span>
              </el-form-item>
            </el-col> -->

            <!-- <el-col :span="6">
              <el-form-item label="是否测试" prop="onlineExercises">
                <el-radio-group v-model="form.onlineExercises">
                  <el-radio v-for="dict in onlineExercisesOptions" :key="dict.dictValue" :label="parseInt(dict.dictValue)">{{dict.dictLabel}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->

            <el-col :span="12">
              <transition name="el-zoom-in-top">
                <el-form-item
                  label="试题规则"
                  v-show="form.onlineExercises == 1"
                  prop="onlineSpecificationId"
                >
                  <el-select
                    v-model="form.onlineSpecificationId"
                    filterable
                    clearable
                    placeholder="请选择试题测试"
                  >
                    <el-option-group
                      v-for="group in specifications"
                      :key="group.label"
                      :label="group.label"
                    >
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </transition>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试题库" v-show="form.onlineExercises == 1">
                <el-select
                  v-model="form.prefaceId"
                  placeholder="请选择题库"
                  filterable
                >
                  <el-option
                    v-for="dict in selectCategory"
                    :key="dict.id"
                    :label="dict.title"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
             <el-form-item label="学时" prop="onlineHours">
               <el-input-number v-model="form.onlineHours" :min="0" :controls="false" placeholder="请输入学时" />
               <span class="spanlan" >(选填)——不填或0代表无学时</span>
             </el-form-item>
           </el-col> -->

            <el-col :span="12">
              <el-form-item label="有效期" prop="onlineIndate">
                <el-input-number
                  v-model="form.onlineIndate"
                  :min="0"
                  :controls="false"
                  placeholder="选填"
                  :disabled="form.id && form.status != 2"
                />
                <span class="spanlan"
                  >(天)自购买日起算,不填或填0课程永久有效</span
                >
              </el-form-item>
            </el-col>
          </el-col>

          <el-col
            :span="24"
            v-show="(form.method == 1 || form.method == 2) && 0"
          >
            <div class="xssk">线下授课</div>
            <el-col :span="24">
              <el-form-item label="地级市" prop="offlineRegion">
                <v-distpicker
                  hide-area
                  v-if="form.offlineRegion"
                  :province="select.province"
                  :city="select.city"
                  @selected="onSelected"
                ></v-distpicker>
                <v-distpicker
                  hide-area
                  v-if="!form.offlineRegion"
                  @selected="onSelected"
                ></v-distpicker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考勤方式" prop="offlineProof">
                <el-radio-group v-model="form.offlineProof">
                  <el-radio
                    v-for="dict in offlineProofOptions"
                    :key="dict.dictValue"
                    :label="parseInt(dict.dictValue)"
                  >
                    {{ dict.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="考核方式" prop="offlineType">
                <el-radio-group v-model="form.offlineType">
                  <el-radio
                    v-for="dict in offlineTypeOptions"
                    :key="dict.dictValue"
                    :label="parseInt(dict.dictValue)"
                  >
                    {{ dict.dictLabel }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="学时" prop="offlineHours">
                <el-input-number
                  v-model="form.offlineHours"
                  :min="0"
                  :controls="false"
                  placeholder="请输入学时"
                />
                <span class="spanlan">(选填)——不填或0代表无学时</span>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="班级">
                <el-transfer
                  filterable
                  filter-placeholder="搜索"
                  v-model="classTT"
                  :titles="['可选班级', '已选班级']"
                  :data="classOptions"
                ></el-transfer>
              </el-form-item>
            </el-col>
          </el-col>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="info"
          @click="submitForm"
          v-show="!form.id || form.status == 2"
          >保存草稿</el-button
        >
        <el-button
          type="primary"
          @click="confirmForm"
          v-show="form.id && form.status != 2"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量导入课程面板 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="批量课程导入"
      :visible.sync="importCourseOpen"
      width="700px"
      append-to-body
    >
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
          <el-col :span="1.5">
            <a
              :href="courseExampleExcelUrl"
              style="color: red; position: relative; top: 5px"
              >课程导入示例</a
            >
          </el-col>
          <el-col :span="1.5">
            <a
              :href="courseExcelUrl"
              style="
                color: #00afff;
                text-decoration: underline;
                position: relative;
                top: 5px;
              "
              >下载excel模板</a
            >
          </el-col>
          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              accept=".xlsx"
              :http-request="httpRequestCourse"
            >
              <el-button
                type="warning"
                icon="el-icon-upload2"
                size="mini"
                v-hasPermi="['eycode:subject:importCourse']"
                >批量课程导入
              </el-button>
              <div slot="tip" class="el-upload__tip">
                {{ courseUploadStatus }}
              </div>
            </el-upload>
          </el-col>

          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              accept=".zip"
              :http-request="fileUpload"
            >
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                v-hasPermi="['eycode:subject:uploadImgFile']"
                >导入课程封面图片压缩包
              </el-button>
              <div slot="tip" class="el-upload__tip">
                {{ imageUploadStatus }}
              </div>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <span class="hint"
              >（压缩包内图片名格式 => 一级分类,二级分类_课程名称
              (注:多级分类以英文逗号隔开,相同分类下课程名会进行覆盖)）</span
            >
          </el-col>
        </el-row>
        <el-button type="primary" @click="(importCourseOpen = false), getList()"
          >确 定</el-button
        >
        <el-button @click="importCourseOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 课程展示操作弹出框 -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="courseOperationTitle"
      :visible.sync="courseOperationOpen"
      width="500px"
      append-to-body
    >
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
          <el-col :span="1.5" v-show="courseOperation == 0">
            <el-radio-group v-model="courseOperationStatus">
              <el-radio :label="0">上线</el-radio>
              <el-radio :label="1">下线</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="1.5" v-show="courseOperation == 0">
            <span
              style="color: red; font-size: 12px; position: relative; top: 5px"
              >(课程发布上线后，部分参数配置不可修改，是否进行上线确认)</span
            >
          </el-col>
          <el-col :span="1.5" v-show="courseOperation == 1">
            <el-radio-group v-model="courseOperationStatus">
              <el-radio :label="0">不推荐</el-radio>
              <el-radio :label="1">推荐</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="1.5" v-show="courseOperation == 2">
            <el-radio-group v-model="courseOperationStatus">
              <el-radio :label="0">不展示</el-radio>
              <el-radio :label="1">展示</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-button type="primary" @click="courseOperat">确 定</el-button>
        <el-button @click="courseOperationOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加课程分类弹框 -->
    <CourseCategory
      @cancelCourseCategory="categoryOpen = false"
      @getList="getTreeselect"
      categoryTitle="添加课程分类"
      :categoryOpen="categoryOpen"
      :dataForm="categoryForm"
      v-if="categoryOpen"
    ></CourseCategory>
    <!-- 添加或修改讲师对话框 -->
    <CourseTeacher
      @cancelCourseTeacher="teacherOpen = false"
      @getList="queryTeacherList"
      categoryTitle="添加讲师信息"
      :categoryOpen="teacherOpen"
      :dataForm="teacherForm"
      v-if="teacherOpen"
    ></CourseTeacher>
  </div>
</template>

<script>
import {
  addSubject,
  apiPushAllSubject,
  apiPushSubject,
  deleteTime,
  delSubject,
  editBookList,
  exportSubject,
  fileImgUpload,
  fileUpload2,
  getCategoryList,
  getClassList,
  getPreface,
  getSubject,
  getTeacherList,
  imgBase64Upload,
  importCourseData,
  listSubject,
  specification,
  updateCourseStatus,
  updateSubject,
  updateSubjectSort,
} from "@/api/course/subject";
import { GetExcelUrl } from "@/api/base/eyUsers";
// import { getShort } from '@/api/craftschool/short'
// import { listPost } from '@/api/craftschool/eyPost'
import { optionselect } from '@/api/craftschool/craft'
import ImgCutter from "vue-img-cutter";
import { treeselect } from "@/api/course/courseCategory";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
// import { getBook } from '@/api/course/book'
import { selectCategory } from "@/api/exam/examination";
import { treeselect as deptTreeselect } from "@/api/system/dept";
// import { postServices } from '@/api/eycode/services'
import Editor from "@/components/Editor";
import EditorTow from "@/components/Tinymce";
import CourseCategory from "@/components/CourseCategory";
import CourseTeacher from "@/components/CourseTeacher";

export default {
  name: "Subject",
  components: {
    ImgCutter,
    Treeselect,
    Editor,
    EditorTow,
    CourseCategory,
    CourseTeacher,
  },
  data() {
    return {
      teacherOpen: false,
      teacherForm: {},
      categoryOpen: false,
      categoryForm: {},
      paperDisabled: false,
      flowDisabled: false,
      courseOperationStatus: 0,
      courseOperationTitle: "",
      courseOperation: 0,
      courseOperationOpen: false,
      imageUploadStatus: "",
      courseUploadStatus: "",
      courseExampleExcelUrl: "",
      courseExcelUrl: "",
      importCourseOpen: false,
      selectedArray: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 搜索归属部门列表
      sxdeptOptions: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      //回收站按钮名称
      recycleBin: "回收站",
      deorhf: "删除",
      hsz: false,
      CourseCategoryOptions: [],
      // 课程主题 表格数据
      subjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      //题库下拉参数
      selectCategory: undefined,
      // 支付方式字典
      paymentOptions: [],
      // 是否推荐字典
      recommendOptions: [],
      // 线上是否考核(0否1是)字典
      onlineExercisesOptions: [],
      // 线下考勤方式字典
      offlineProofOptions: [],
      // 线下考核方式字典
      offlineTypeOptions: [],
      //渠道（线上，线下）
      methodOptions: [],
      //课程分类
      categoryOptions: [],
      //教材数据
      bookOptions: [],
      //授课老师
      teacherOptions: [],
      // pdf的url
      excelUrl: undefined,
      //试题规则
      specifications: [],
      //工种下拉
      craftOptions: [],
      //工种选中数组
      craftId: [],
      // 岗位下拉
      postOptions: [],
      //增值套餐
      postServics: [],
      services: [],
      book: {
        //教材ID
        bookList: [],
        //教材价格
        price: [],
        //教材折扣
        bookDiscount: [],
      },
      //班级选中
      classTT: [],
      price: undefined,
      //教材组
      bookDate: [],
      // 截图比例
      rate: "16:9",
      //支付方式选中初始数据
      checkedCities: ["0", "1", "2", "3"],
      //班级
      classOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deleteTime: 0,
        subjectTitle: undefined,
        status: undefined,
        categoryId: undefined,
        recommend: undefined,
        deptId: undefined,
        isSupervise: undefined,
        isPush: undefined,
      },
      //地图默认值
      select: {
        province: "",
        city: "",
      },
      // 表单参数
      form: {},
      // 基础表单校验
      rules: {
        categoryId: [
          {
            required: true,
            message: "课程分类ID不能为空",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "状态不能为空",
            trigger: "blur",
          },
        ],
        recommend: [
          {
            required: true,
            message: "是否推荐不能为空",
            trigger: "blur",
          },
        ],
        subjectTitle: [
          {
            required: true,
            message: "课程名称不能为空",
            trigger: "blur",
          },
        ],
        subjectHours: [
          {
            required: true,
            message: "请输入总学时",
            trigger: "blur",
          },
        ],
        subjectImageUrl: [
          {
            required: true,
            message: "课程封面图不能为空",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "课程价钱不能为空",
            trigger: "blur",
          },
        ],
        payment: [
          {
            required: true,
            message: "支付方式不能为空",
            trigger: "blur",
          },
        ],
        method: [
          {
            required: true,
            message: "授课方式不能为空",
            trigger: "blur",
          },
        ],
        isSupervise: [
          {
            required: true,
            message: "请选择是否需要接入监管平台",
            trigger: "blur",
          },
        ],
        isHomeShow: [
          {
            required: true,
            message: "请选择是否在前台课程列表页显示",
            trigger: "blur",
          },
        ],
        craftId: [
          {
            required: true,
            message: "请选择工种",
            trigger: "blur",
          },
        ],
        showPrice: [
          {
            required: true,
            message: "请选择是否显示价格",
            trigger: "blur",
          },
        ],
        flowOnline: [
          {
            required: true,
            message: "请选择是否走订单流程",
            trigger: "blur",
          },
        ],
        isAuth: [
          {
            required: true,
            message: "请选择是否需要实名认证",
            trigger: "blur",
          },
        ],
      },
      // excel文件数组
      fileExcelList: [],
      // 是否接入监管平台
      isSuperviseOptions: [],
      // 是否在课程列表页展示
      isHomeShowOptions: [],
      // 多选试卷数据
      paperInfo: [
        {
          paperId: undefined,
          sort: 100,
        },
      ],
      // 试卷选项数据
      paperOptions: [],
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("is_home_show").then((response) => {
      this.isHomeShowOptions = response.data;
    });
    this.getDicts("is_supervise").then((response) => {
      this.isSuperviseOptions = response.data;
    });
    this.getDicts("putway_status").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("pay_ways").then((response) => {
      this.paymentOptions = response.data;
    });
    this.getDicts("recommend").then((response) => {
      this.recommendOptions = response.data;
    });
    this.getDicts("subject_test").then((response) => {
      this.onlineExercisesOptions = response.data;
    });
    this.getDicts("offlineProof").then((response) => {
      this.offlineProofOptions = response.data;
    });
    this.getDicts("offlineType").then((response) => {
      this.offlineTypeOptions = response.data;
    });
    this.getDicts("teaching_method").then((response) => {
      this.methodOptions = response.data;
    });
    //课程分类
    getCategoryList().then((response) => {
      this.categoryOptions = response.data;
    });
    //教材
    // bookList().then(response => {
    //   this.bookOptions = response.data
    // })
    //试题规则列表
    specification().then((response) => {
      this.specifications = response.data;
    });
    // 工种
    optionselect().then(res => {
      console.log(res);
      this.craftOptions = res.data
    })
    // //工种
    // getShort().then(response => {
    //   this.craftOptions = response.craftName
    // })
    //获取岗位
    // listPost().then(response => {
    //   this.postOptions = response.rows
    // })
    // //获取增值服务套餐
    // postServices({ 'type': '0' }).then(response => {
    //   this.postServics = response.data
    // })
    //题库
    selectCategory().then((response) => {
      this.selectCategory = response.data;
    });
    //获取租户列表
    deptTreeselect().then((response) => {
      this.sxdeptOptions = response.data;
    });
    // 导入模板
    this.getExcelUrl();
  },
  methods: {
    /** 讲师添加按钮 */
    addTeacherData() {
      this.teacherForm = {
        teacherId: undefined,
        name: undefined,
        sex: undefined,
        detail: undefined,
        domain: undefined,
        introduction: undefined,
        imageUrl: undefined,
        post: undefined,
        idCard: undefined,
        company: undefined,
        honor: undefined,
        createTime: undefined,
        createBy: undefined,
        updateTime: undefined,
        updateBy: undefined,
        homeShow: 0,
        sort: 0,
        status: 0,
      };
      this.resetForm("teacherForm");
      this.teacherOpen = true;
    },
    /** 分类添加按钮 */
    categoryAdd() {
      this.categoryForm = {
        id: undefined,
        pid: undefined,
        categoryName: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        sort: 0,
        status: "1",
      };
      this.resetForm("categoryForm");
      this.categoryOpen = true;
    },
    showPriceFun(value) {
      if (value == 0) {
        this.form.flowOnline = 0;
        this.flowDisabled = true;
      } else {
        this.flowDisabled = false;
      }
    },
    // 课程展示状态改变
    courseOperat() {
      let param = {
        ids: this.ids,
        status: this.courseOperation == 0 ? this.courseOperationStatus : null,
        recommend:
          this.courseOperation == 1 ? this.courseOperationStatus : null,
        isHomeShow:
          this.courseOperation == 2 ? this.courseOperationStatus : null,
      };
      updateCourseStatus(param).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("修改成功");
          this.courseOperationOpen = false;
          this.getList();
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 上传课程封面图压缩包
    fileUpload(file) {
      this.imageUploadStatus = "上传中...";
      fileImgUpload(file)
        .then((res) => {
          if (res.code == 200) {
            this.imageUploadStatus = "上传成功";
            this.$message.success("上传成功~");
          } else {
            this.imageUploadStatus = "上传失败";
            this.$message.error(res.msg);
          }
        })
        .catch((res) => {
          this.imageUploadStatus = "上传失败";
        });
    },
    /**
     * 上传文件:批量课程
     */
    async httpRequestCourse(params) {
      this.courseUploadStatus = "上传中...";
      // 上传文件获取url 地址
      let fileUrl = "";
      await fileUpload2(params).then((response) => {
        fileUrl = response.url;
      });

      // 获取url地址后再讲文件传给后端
      const requestData = {
        url: fileUrl,
        excel: true,
      };
      importCourseData(requestData)
        .then((response) => {
          if (response.data == 200) {
            this.courseUploadStatus = "上传成功";
            this.$message.success("课程批量文件上传成功~");
          } else {
            this.courseUploadStatus = "上传失败";
            this.download(response.msg);
            this.$message.error("上传数据有误，请将数据修改后重新上传！");
          }
        })
        .catch((res) => {
          this.courseUploadStatus = "上传失败";
        });
    },
    // 获取下载excel地址
    getExcelUrl() {
      let import_course = "import_course";
      GetExcelUrl(import_course).then((response) => {
        if (response.code == 200) {
          this.courseExcelUrl = response.msg;
        }
      });
      let import_course_example = "import_course_example";
      GetExcelUrl(import_course_example).then((response) => {
        if (response.code == 200) {
          this.courseExampleExcelUrl = response.msg;
        }
      });
    },
    selectTeacher() {
      this.selectedArray = this.selectedArray.filter((item) => {
        return item !== "全选";
      });
    },
    /** 查询课程主题 列表 */
    getList() {
      this.loading = true;
      listSubject(this.queryParams).then((response) => {
        this.subjectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 删除一个试卷组
    deleteElement(item, index) {
      if (this.paperInfo.length <= 1) {
        //如果只有一个输入框则不可以删除
        return false;
      }
      this.paperInfo.splice(index, 1); //删除了数组中对应的数据也就将这个位置的输入框删除
    },
    // 添加一个试卷组
    addElement(item) {
      this.paperInfo.push({
        paperId: undefined,
        sort: 100,
      });
    },
    // 获取试卷数据
    getPaperPreface() {
      getPreface().then((res) => {
        if (res.code == 200) {
          this.paperOptions = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.CourseCategoryOptions = response.data;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 支付方式字典翻译
    paymentFormat(row, column) {
      return this.selectDictLabel(this.paymentOptions, row.payment);
    },
    // 是否推荐字典翻译
    recommendFormat(row, column) {
      return this.selectDictLabel(this.recommendOptions, row.recommend);
    },
    // 线上是否考核(0否1是)字典翻译
    onlineExercisesFormat(row, column) {
      return this.selectDictLabel(
        this.onlineExercisesOptions,
        row.onlineExercises
      );
    },
    // 线下考勤方式字典翻译
    offlineProofFormat(row, column) {
      return this.selectDictLabel(this.offlineProofOptions, row.offlineProof);
    },
    // 线下考核方式字典翻译
    offlineTypeFormat(row, column) {
      return this.selectDictLabel(this.offlineTypeOptions, row.offlineType);
    },
    // 渠道翻译
    methodFormat(row, column) {
      return this.selectDictLabel(this.methodOptions, row.method);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        appendToBody: false,
        id: undefined,
        subjectTitle: undefined,
        subjectIntroduction: undefined,
        bookAddress: undefined,
        subjectImageUrl: undefined,
        status: "1",
        sort: 0,
        categoryId: undefined,
        payment: undefined,
        price: 0,
        bookId: undefined,
        bookDiscount: 0,
        method: "0",
        checkWork: undefined,
        checkExam: undefined,
        hours: undefined,
        entryEndtime: undefined,
        isExercises: undefined,
        isEvidence: 0,
        recommend: "0",
        learnNumber: undefined,
        teacherId: undefined,
        classId: undefined,
        startTime: undefined,
        author: undefined,
        authorImageUrl: undefined,
        authorIntroduction: undefined,
        postId: undefined,
        onlineProof: 0,
        onlineExercises: 0,
        onlineHours: 0,
        onlineIndate: undefined,
        onlineTeacherId: undefined,
        onlineEndtime: undefined,
        onlineSpecificationId: undefined,
        offlineProof: "0",
        offlineType: "0",
        offlineClassId: undefined,
        offlineHours: undefined,
        isSupervise: "0",
        isHomeShow: "1",
        craftId: undefined,
        selectedArray: [],
        showPrice: 1,
        flowOnline: 1,
        hint: undefined,
        isAuth: 0,
      };
      this.book = {
        //教材ID
        bookList: [],
        //教材价格
        price: [],
        //教材折扣
        bookDiscount: [],
      };
      this.excelUrl = undefined;
      this.craftId = [];
      this.services = [];
      this.classTT = [];
      this.bookDate = [];
      checkedCities: ["0", "1", "2", "3"],
        (this.select = {
          province: "",
          city: "",
        }),
        this.resetForm("form");
      this.paperInfo = [
        {
          paperId: undefined,
          sort: 100,
        },
      ];
      this.selectedArray = [];
      //授课老师列表
      this.queryTeacherList();
      this.flowDisabled = false;
    },
    /** 获得讲师 */
    queryTeacherList() {
      getTeacherList().then((response) => {
        this.teacherOptions = response.rows;
      });
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getPaperPreface();
      this.reset();
      this.open = true;
      this.getClass();
      this.fileExcelList = [];
      this.title = "添加课程信息 ";
      this.select = {
        province: "",
        city: "",
      };
      this.paperDisabled = false;
    },
    // 推送到监管平台
    pushSubject() {
      this.$confirm(
        "确定推送选中的课程? 不需要对接监管平台的课程不会推送",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          apiPushSubject(this.ids).then((res) => {
            if (res.code == 200) {
              this.loading = false;
              this.$message.success("操作成功");
              this.getList();
            } else {
              this.loading = false;
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    // 推送到监管平台
    pushAllSubject() {
      this.$confirm("确定推送所有未推送的课程?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          apiPushAllSubject().then((res) => {
            if (res.code == 200) {
              this.loading = false;
              this.$message.success("操作成功");
              this.getList();
            } else {
              this.loading = false;
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getPaperPreface();
      this.reset();
      const id = row.id || this.ids;
      this.getClass(id);
      getSubject(id).then((response) => {
        this.form = response.data;
        this.checkedCities = this.form.payment.split(",");
        this.classTT = response.data.classTT;
        this.form.isEvidence = parseInt(this.form.isEvidence);
        this.selectedArray = this.form.teacherArray;
        this.excelUrl = this.form.sectionVideoUrl;
        this.showPriceFun(this.form.showPrice);
        if (this.form.offlineRegion) {
          var region = this.form.offlineRegion.split(",");
          this.select = {
            province: region[0],
            city: region[1],
          };
        }
        if (response.data.papersVos.length > 0) {
          this.paperInfo = response.data.papersVos;
          this.paperDisabled = true;
        } else {
          this.paperDisabled = false;
        }
      });
      this.open = true;
      this.title = "修改课程信息 ";
      // editBookList({
      //   'subjectId': id
      // }).then(response => {
      //   for (var i = 0; i < response.data.length; i++) {
      //     this.addDomain()
      //     this.$set(this.book.bookList, i, response.data[i].bookId)
      //     this.$set(this.book.price, i, response.data[i].bookPrice)
      //     this.$set(this.book.bookDiscount, i, response.data[i].bookDiscount)
      //   }
      //   this.open = true
      //   this.title = '修改课程信息 '
      // })
    },

    /** 上传excel文件, 入参一定要添加file默认参数 */
    fileUploadExcel(file) {
      fileUpload2(file).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.excelUrl = res.url;
          this.fileExcelList = [];
        } else {
          this.$message.error("上传excel文件异常");
        }
      });
    },

    /*上传pdf文件前校验*/
    fileExcelBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 20;
      if (!isRightSize) {
        this.$message.error("文件大小超过 20M");
      }

      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      // const extension2 = testmsg === 'xlsx'
      if (!extension) {
        this.$message.error("应该选择.xls/*类型的文件");
      }

      this.fileExcelList = [];
      return isRightSize && (extension || extension2);
    },

    /** 提交保存草稿按钮 */
    submitForm: function () {
      if (this.form.price == 0) {
        this.form.payment = "0,1,2,3";
      } else {
        this.form.payment = this.checkedCities.join(",");
      }
      this.form.book = this.book;
      if (this.form.classTT != undefined && this.form.classTT.length > 0) {
        this.form.classIds = [];
        for (var i = 0; i < this.classTT.length; i++) {
          if (this.form.classTT.indexOf(this.classTT[i]) < 0) {
            this.form.classIds.push(this.classTT[i]);
          }
        }
      } else {
        this.form.classIds = this.classTT;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.method == 0) {
            var resd = this.xssk();
            if (resd.code != 1) {
              this.msgError(resd.message);
              return false;
            }
          } else if (this.form.method == 1) {
            var resd = this.xxsk();
            if (resd.code != 1) {
              this.msgError(resd.message);
              return false;
            }
          } else {
            var resd = this.xxsk();
            if (resd.code != 1) {
              this.msgError(resd.message);
              return false;
            }
            resd = this.xssk();
            if (resd.code != 1) {
              this.msgError(resd.message);
              return false;
            }
          }
          // 处理试卷数据
          this.form.papersVos = this.paperInfo;
          // 讲师数组
          this.form.teacherArray = this.selectedArray;
          if (this.form.id != undefined) {
            updateSubject(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.form.status = 2;
            addSubject(this.form).then((response) => {
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
    /** 提交确定按钮 */
    confirmForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let param = {
            id: this.form.id,
            categoryId: this.form.categoryId,
            subjectTitle: this.form.subjectTitle,
            teacherArray: this.selectedArray,
            recommend: this.form.recommend,
            sort: this.form.sort,
            subjectImageUrl: this.form.subjectImageUrl,
            onlineEndtime: this.form.onlineEndtime,
            subjectIntroduction: this.form.subjectIntroduction,
            isHomeShow: this.form.isHomeShow,
            status: this.form.status,
          };
          updateSubject(param).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 验证线上授课数据 */
    xssk() {
      var test = {};
      test.code = 1;
      test.message = "";
      // if (this.form.onlineProof == undefined) {
      //   test.code = 0
      //   test.message = '考勤抓拍不能为空'
      // } else if (this.form.onlineHours == undefined) {
      //   test.code = 0
      //   test.message = '线上学时不能为空'
      // } else if (this.selectedArray.length == 0) {
      //   test.code = 0
      //   test.message = '请选择授课老师'
      // } else if (this.form.onlineExercises == 1) {
      //   if (!this.form.onlineSpecificationId) {
      //     test.code = 0
      //     test.message = '请选择试题规则'
      //   }
      // }
      return test;
    },
    /** 验证线下授课数据 */
    xxsk() {
      var test = {};
      test.code = 1;
      test.message = "";
      // if (this.classTT.length < 1) {
      //   test.code = 0
      //   test.message = '线下班级不能为空'
      // }
      // /*以下代码先注释  当前业务：一门课程可以对应多个班级*/
      // // else if(this.classTT.length>1){
      // //   test.code=0;
      // //   test.message="线下班级暂时只能选择一个";
      // // }
      // if (this.form.offlineRegion == undefined) {
      //   test.code = 0
      //   test.message = '地级市不能为空或没有选择完整'
      // }
      // if (this.form.offlineProof == undefined) {
      //   test.code = 0
      //   test.message = '请选择考勤方式'
      // }
      // if (this.form.offlineType == undefined) {
      //   test.code = 0
      //   test.message = '请选择考勤方式'
      // }
      return test;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(
        '是否确认删除课程主题 编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delSubject(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    //更新排序
    updateSort(data) {
      updateSubjectSort(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 回收站 */
    deleteTime() {
      this.hsz = !this.hsz;
      if (this.hsz) {
        this.recycleBin = "退出回收站";
        this.queryParams.deleteTime = 1;
        this.deorhf = "恢复";
      } else {
        this.recycleBin = "回收站";
        this.queryParams.deleteTime = 0;
        this.deorhf = "删除";
      }
      this.handleQuery();
    },
    /** 逻辑(删除/恢复）按钮操作 */
    handleDeleteTime(row) {
      const data = {
        id: row.id,
      };
      if (this.hsz) {
        this.$confirm('是否确认恢复课程:"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            data.deleteTime = 0;
            return deleteTime(data);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("恢复成功");
          })
          .catch(function () {});
      } else {
        this.$confirm('是否确认删除课程:"' + row.id + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            data.deleteTime = 1;
            return deleteTime(data);
          })
          .then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          })
          .catch(function () {});
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有课程主题 数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportSubject(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /**上传(比例1:1) */
    oneTOone: function (res) {
      this.rate = "1:1";
    },
    /**上传(比例16:9) */
    sixtTOnine: function (res) {
      this.rate = "16:9";
    },
    cutDownSubject: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.subjectImageUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    cutDownAuthor: function (res) {
      imgBase64Upload(res.dataURL).then((res) => {
        if (res.code == 200) {
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.authorImageUrl = res.url;
        } else {
          this.$message.error("上传图片异常");
        }
      });
    },
    //获取班级
    getClass(id) {
      getClassList({
        id: id,
      }).then((response) => {
        this.classOptions = response.data;
      });
    },
    //增加教材
    addDomain() {
      this.bookDate.push({
        value: "",
        key: Date.now(),
      });
    },
    //删除教材
    removeDomain(item, key) {
      var index = this.bookDate.indexOf(item);
      if (index !== -1) {
        this.bookDate.splice(index, 1);
        this.book.bookList.splice(key, 1);
        this.book.bookDiscount.splice(key, 1);
        this.book.price.splice(key, 1);
      }
      this.book.bookList.splice(key, 1);
    },
    //教材选中事件
    // setBooklist(key) {
    //   var id = this.book.bookList[key]
    //   if (id == '' || id == undefined) {
    //     this.$set(this.book.bookList, key, undefined)
    //     this.$set(this.book.price, key, undefined)
    //     this.$set(this.book.bookDiscount, key, undefined)
    //     return false
    //   }
    //   var sum = 0
    //   for (var i = 0; i < this.book.bookList.length; i++) {
    //     if (this.book.bookList[i] == id) {
    //       sum++
    //     }
    //   }
    //   if (sum <= 1) {
    //     getBook(id).then(response => {
    //       this.$set(this.book.price, key, response.data.price)
    //     })
    //   } else {
    //     this.$set(this.book.bookList, key, undefined)
    //     this.$set(this.book.price, key, undefined)
    //     this.$set(this.book.bookDiscount, key, undefined)
    //     this.$message.error('教材不能重复！')
    //   }
    // },
    /** 地图联动 */
    onSelected(data) {
      this.form.offlineRegion = data.province.value + "," + data.city.value;
      this.form.offlineRegionNumber = data.city.code;
      this.form.regionId = data.city.code;
    },
    //跳转人员管理带参数
    toChdas(row) {
      var data = JSON.stringify(row);
      this.$router.push({
        name: "subjectUserData",
        params: {
          subjectId: row.id,
          subjectTitle: row.subjectTitle,
          categoryName: row.categoryName,
          totalSection: row.totalSection,
        },
      });
    },
  },
};
</script>

<style scoped>
.textareaclass textarea {
  height: 90px;
}

.xssk {
  font-size: 16px;
  padding: 15px 0;
  font-weight: 600;
}

.spanlan {
  color: #00afff;
}

.hint {
  color: red;
  font-size: 12px;
}

.divTitle {
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: -20px;
  color: black;
}

.onlineCourse {
  padding: 5px;
  height: 170px;
  border: 1px solid #dadada;
  box-shadow: darkgrey 0px 0px 5px 0px;
}

.but {
  position: relative;
  top: 5px;
  left: 5px;
}
</style>
