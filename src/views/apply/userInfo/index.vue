<template>
  <div class="app-container">
    <el-form ref="form" label-width="90px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="当前项目：">{{ projectName }}</el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前课题：">{{
            topicName
            }}
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="当前期次：">{{
            periodName
            }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学员姓名" prop="certName">
        <el-input
          v-model="queryParams.certName"
          placeholder="请输入学员姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option :label="dict.dictLabel" :value="dict.dictValue" v-for="dict in statusOptions"/>
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
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="multiple"
          @click="handleStatus"
          v-hasPermi="['apply:userInfo:updateStatus']"
        >更新状态
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['apply:userInfo:export']"
        >导出报表
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="exportAttachment"
          v-hasPermi="['apply:userInfo:exportAttachment']"
        >导出附件
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          v-hasPermi="['apply:userInfo:upload']"
          @click="importOpen=true,imageUploadStatus=''"
        >上传证书
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          v-hasPermi="['apply:userInfo:updateStatus']"
          @click="importUpdateOpen=true"
        >上传Excel更新状态
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userInfoList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学员姓名" align="center" prop="certName"/>
      <el-table-column label="所在单位" align="center" prop="companyName"/>
      <el-table-column label="手机号" align="center" prop="phonenumber"/>
      <el-table-column label="发证机构" align="center" prop="certifyingAuthorityName"/>
      <el-table-column label="报名时间" align="center" prop="applyTime" width="180">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.applyTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime ? formatTime(scope.row.updateTime) : ''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成率" align="center" prop="finishRate">
        <template slot-scope="scope">
          <span>{{scope.row.finishRate ? scope.row.finishRate+'%' : '0%'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试分数" align="center" prop="examScore">
        <template slot-scope="scope">
          <span>{{scope.row.examScore ? scope.row.examScore+'分' : '暂无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="结算状态" align="center" prop="settleStatus">
        <template slot-scope="scope">
          <span>{{!scope.row.settleStatus ? '未结算' : scope.row.settleStatus == 1 ? '完训可结算' : scope.row.settleStatus == 2 ? '补贴已下放' : '补贴失败'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证书" align="center" prop="certificateUrl">
        <template slot-scope="scope">
          <span v-if="!scope.row.certificateUrl">暂无证书</span>
          <a v-else :href="scope.row.certificateUrl" target="_blank" style="color: #1482f0">查看证书</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="applyDataView(scope.row)"
          >报名表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="remarkDetail(scope.row)"
            v-hasPermi="['remark:applyRemark:list']"
          >备注
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDetail(scope.row)"
            v-hasPermi="['apply:userInfo:query']"
          >查看详情
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

    <!-- 添加或修改学员报名信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联项目id" prop="projectId">
          <el-input v-model="form.projectId" placeholder="请输入关联项目id"/>
        </el-form-item>
        <el-form-item label="关联课题id" prop="topicId">
          <el-input v-model="form.topicId" placeholder="请输入关联课题id"/>
        </el-form-item>
        <el-form-item label="关联期次" prop="periodId">
          <el-input v-model="form.periodId" placeholder="请输入关联期次"/>
        </el-form-item>
        <el-form-item label="关联报名学员用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联报名学员用户id"/>
        </el-form-item>
        <el-form-item label="报名人姓名" prop="certName">
          <el-input v-model="form.certName" placeholder="请输入报名人姓名"/>
        </el-form-item>
        <el-form-item label="单位id" prop="companyId">
          <el-input v-model="form.companyId" placeholder="请输入单位id"/>
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入单位名称"/>
        </el-form-item>
        <el-form-item label="分销商等级{0:直销,1:一级分销,2:二级分销}" prop="distributorLevel">
          <el-input v-model="form.distributorLevel" placeholder="请输入分销商等级{0:直销,1:一级分销,2:二级分销}"/>
        </el-form-item>
        <el-form-item label="分销商账号id" prop="distributorId">
          <el-input v-model="form.distributorId" placeholder="请输入分销商账号id"/>
        </el-form-item>
        <el-form-item label="分销商名称" prop="distributorName">
          <el-input v-model="form.distributorName" placeholder="请输入分销商名称"/>
        </el-form-item>
        <el-form-item label="发证机构id" prop="certifyingAuthorityId">
          <el-input v-model="form.certifyingAuthorityId" placeholder="请输入发证机构id"/>
        </el-form-item>
        <el-form-item label="发证机构名称" prop="certifyingAuthorityName">
          <el-input v-model="form.certifyingAuthorityName" placeholder="请输入发证机构名称"/>
        </el-form-item>
        <el-form-item label="报名时间" prop="applyTime">
          <el-date-picker clearable size="small" style="width: 200px"
                          v-model="form.applyTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择报名时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成率 0-100" prop="finishRate">
          <el-input v-model="form.finishRate" placeholder="请输入完成率 0-100"/>
        </el-form-item>
        <el-form-item label="考试分数" prop="examScore">
          <el-input v-model="form.examScore" placeholder="请输入考试分数"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看报名信息详情 -->
    <el-dialog
      title="报名信息详情"
      :visible.sync="userInfoOpen"
      width="500px"
      append-to-body
    >
      <el-form :model="userInfo" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学员姓名：">{{
              userInfo.certName
              }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在单位：">{{
              userInfo.companyName
              }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号：">{{ userInfo.phonenumber }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构：">{{userInfo.certifyingAuthorityName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名时间：">{{ formatTime(userInfo.applyTime) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间：">{{formatTime(userInfo.updateTime)}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成率：">{{ userInfo.finishRate ? userInfo.finishRate+'%' : '0%' }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试分数：">{{userInfo.examScore ? userInfo.examScore+'分' : '暂无'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算状态：">{{ selectDictLabel(statusOptions, userInfo.status) }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userInfoOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 备注 -->
    <el-dialog
      :title="remarkTitle"
      :visible.sync="remarkOpen"
      width="800px"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="remark.remark" style="width: 80%">
          </el-input>
          <el-button icon="el-icon-chat-square" type="primary" v-hasPermi="['remark:applyRemark:add']"
                     @click="hendleRemark">备注
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="remarkList" border>
        <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
        <el-table-column label="备注信息" align="center" prop="remark"/>
        <el-table-column label="备注时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime ? formatTime(scope.row.createTime) : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="remarkTotal>0"
        :total="remarkTotal"
        :page.sync="remarkParam.pageNum"
        :limit.sync="remarkParam.pageSize"
        @pagination="listRemark"
      />
    </el-dialog>

    <!-- 报名表数据 -->
    <el-dialog
      :title="applyDataTitle"
      :visible.sync="applyDataOpen"
      width="800px"
      append-to-body
    >
      <el-table :data="applyDataList" border>
        <el-table-column label="报名信息" align="center" prop="fieldName"/>
        <el-table-column label="报名数据" align="center" prop="fieldValue">
          <template slot-scope="scope">
            <el-image
              slot="reference"
              style="max-width: 40px; max-height: 40px"
              :src="scope.row.fieldValue"
              :preview-src-list="[scope.row.fieldValue]"
              :z-index="2100"
              v-if="/^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))/.test(scope.row.fieldValue)"
            />
            <a v-else-if="/^https?:\/\/(.+\/)+.+(\.(doc|docx|xls|xlsx|pdf))/.test(scope.row.fieldValue)"
               :href="scope.row.fieldValue" target="_blank" style="color: #4AB7BD">查看附件</a>
            <span v-else>{{scope.row.fieldValue}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="applyDataTotal>0"
        :total="applyDataTotal"
        :page.sync="applyDataParam.pageNum"
        :limit.sync="applyDataParam.pageSize"
        @pagination="listApplyData"
      />
    </el-dialog>

    <!-- 更改状态弹框 -->
    <el-dialog
      title="状态更改"
      :visible.sync="statusOpen"
      width="1300px"
      append-to-body
    >
      <el-table :data="statusDataList" border>
        <el-table-column label="学员姓名" align="center" prop="certName"/>
        <el-table-column label="手机号" align="center" prop="phonenumber"/>
        <el-table-column label="发证机构" align="center" prop="certifyingAuthorityName">
          <template slot-scope="scope">
            <el-select v-model="scope.row.certifyingAuthorityName" placeholder="请选择发证机构" size="small">
              <el-option :label="dict.authorityName" :value="dict.authorityName" v-for="dict in institution"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="报名时间" align="center" prop="applyTime">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.applyTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成率" align="center" prop="finishRate">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.finishRate" controls-position="right" :min="0" :max="100" :step="1"
                             size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="考试分数" align="center" prop="examScore">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.examScore" controls-position="right" :min="0" :max="100" :step="1"
                             :precision="2" size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" placeholder="请选择状态" size="small">
              <el-option :label="dict.dictLabel" :disabled="scope.row.settleStatus!=undefined && scope.row.settleStatus > 0 &&Number(dict.dictValue)<9" :value="Number(dict.dictValue)" v-for="dict in statusOptions"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" align="center" prop="settleStatus">
          <template slot-scope="scope">
            <el-select v-model="scope.row.settleStatus" @change="changeSettleStatus" clearable placeholder="请选择结算状态" size="small">
              <el-option label="完训可结算" :disabled="scope.row.status<9||scope.row.status==10" :value="1"/>
              <el-option label="补贴已下放" :disabled="scope.row.status<9||scope.row.status==10" :value="2"/>
              <el-option label="补贴失败" :disabled="scope.row.status<9||scope.row.status==10" :value="3"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="200">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              v-model="scope.row.remark">
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitStatus">确认修改</el-button>
        <el-button @click="statusOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导出报表 -->
    <el-dialog
      title="导出报表"
      :visible.sync="excelOpen"
      width="1400px"
      append-to-body
      center
    >

      <el-form :model="userInfo" label-width="140px">
        <el-row>
          <el-col :span="24">
            <span style="color: red;position: relative;bottom: 10px">注意：请按顺序点击增加所需导出的字段</span>
          </el-col>
          <el-checkbox-group v-model="selectFieldList">
            <el-col :span="4" v-for="item in fieldList" style="margin: 10px 0">
              <el-checkbox :label="item.fieldId+':'+item.fieldKey+':'+item.fieldName" :value="item.fieldId"
                           :key="item.fieldId">
                {{ item.fieldName }}
              </el-checkbox>
            </el-col>
          </el-checkbox-group>
          <el-col :span="24" v-if="selectFieldList.length>0">
            <span style="color: #666">导出报表中列顺序如下：</span>
          </el-col>
          <el-col :span="24" v-if="selectFieldList.length>0">
            <el-tag v-for="(item,index) in selectFieldList" style="margin: 10px 10px 10px 0" :key="index">{{index+1}}:{{initName(item)}}</el-tag>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitExcel">确认导出</el-button>
        <el-button @click="excelOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 上传证书 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="证书上传"
               :visible.sync="importOpen" width="600px" append-to-body>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
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
              >导入证书图片压缩包
              </el-button>
              <div slot="tip" class="el-upload__tip">{{imageUploadStatus}}</div>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <span class="hint">注：压缩包内图片命名格式为=>用户手机号.(jpg|png)，且当前报名状态为（证书下发）才可上传</span>
          </el-col>
        </el-row>
        <el-button @click="importOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量更新状态 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" title="上传Excel更新状态"
               :visible.sync="importUpdateOpen" width="560px" append-to-body>
      <div slot="footer" class="dialog-footer" style="margin-top: -50px">
        <el-row :gutter="25" class="mb8">
          <el-col :span="1.5">
            <el-upload
              class="upload-demo"
              action=""
              accept=".xlsx, .xls"
              :http-request="excelUpload"
            >
              <el-button
                type="primary"
                icon="el-icon-upload2"
                size="mini"
                :loading="uploadExcelLoading"
              >上传Excel更新状态
              </el-button>
            </el-upload>
          </el-col>
          <el-col :span="1.5">
            <a :href="updateStatusExcelTemplate"
               style="
                color: #00afff;
                text-decoration: underline;
                position: relative;
                top: 5px;
              "> 下载Excel模板 </a>
          </el-col>
        </el-row>
        <el-button @click="importUpdateOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addUserInfo,
    delUserInfo,
    exportAttachment,
    exportUserInfo,
    fieldList,
    fileUpload,
    excelUpload,
    getApplyData,
    getUserInfo,
    listUserInfo,
    updateStatus,
    updateUserInfo,
    getTopId
  } from '@/api/apply/userInfo'
  import { addApplyRemark, listApplyRemark } from '@/api/apply/applyRemark'
  import { listApplyData } from '@/api/apply/formData'
  import { filesToRar } from '@/utils/zipdownload'
  import Template from '../../certificate/template/index'
  import { GetExcelUrl } from "@/api/base/eyUsers";

  export default {
    name: 'UserInfo',
    components: { Template },
    computed:{
      initName(){
        return (id)=>{
          console.log(id,this.fieldList)
          let index = this.fieldList.findIndex(item=>id.indexOf(item.fieldKey)!=-1)
          let name = this.fieldList[index].fieldName
          return name
        }
      }
    },
    data() {
      return {

        // 导入Excel 上传状态
        uploadExcelLoading: false,
        // 导入Excel批量更新状态弹出框
        importUpdateOpen: false,
        importOpen: false,
        imageUploadStatus: '',
        selectFieldList: [],
        excelOpen: false,
        fieldList: [],
        statusDataList: [],
        statusOpen: false,
        applyDataList: [],
        applyDataOpen: false,
        applyDataTitle: undefined,
        applyDataTotal: 0,
        applyDataParam: {
          pageNum: 1,
          pageSize: 10,
          userInfoId: undefined
        },
        remark: {},
        remarkTitle: undefined,
        remarkList: [],
        remarkOpen: false,
        remarkTotal: 0,
        remarkParam: {
          pageNum: 1,
          pageSize: 10,
          userInfoId: undefined
        },
        userInfo: {},
        userInfoOpen: false,
        projectName: undefined,
        topicName: undefined,
        periodName: undefined,
        topicId: undefined,
        statusOptions: [],
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
        // 学员报名信息表格数据
        userInfoList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          projectId: undefined,
          topicId: undefined,
          periodId: undefined,
          userId: undefined,
          certName: undefined,
          companyId: undefined,
          companyName: undefined,
          distributorLevel: undefined,
          distributorId: undefined,
          distributorName: undefined,
          certifyingAuthorityId: undefined,
          certifyingAuthorityName: undefined,
          applyTime: undefined,
          finishRate: undefined,
          examScore: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          projectId: [
            { required: true, message: '关联项目id不能为空', trigger: 'blur' }
          ],
          topicId: [
            { required: true, message: '关联课题id不能为空', trigger: 'blur' }
          ],
          periodId: [
            { required: true, message: '关联期次不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '关联报名学员用户id不能为空', trigger: 'blur' }
          ],
          certName: [
            { required: true, message: '报名人姓名不能为空', trigger: 'blur' }
          ],
          companyId: [
            { required: true, message: '单位id不能为空', trigger: 'blur' }
          ],
          companyName: [
            { required: true, message: '单位名称不能为空', trigger: 'blur' }
          ],
          distributorLevel: [
            { required: true, message: '分销商等级{0:直销,1:一级分销,2:二级分销}不能为空', trigger: 'blur' }
          ],
          distributorId: [
            { required: true, message: '分销商账号id不能为空', trigger: 'blur' }
          ],
          distributorName: [
            { required: true, message: '分销商名称不能为空', trigger: 'blur' }
          ],
          certifyingAuthorityId: [
            { required: true, message: '发证机构id不能为空', trigger: 'blur' }
          ],
          certifyingAuthorityName: [
            { required: true, message: '发证机构名称不能为空', trigger: 'blur' }
          ],
          applyTime: [
            { required: true, message: '报名时间不能为空', trigger: 'blur' }
          ],
          finishRate: [
            { required: true, message: '完成率 0-100不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'blur' }
          ]
        },
        updateStatusExcelTemplate: "",
        //发证机构
        institution:[]
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          if (
            this.$route.query &&
            this.$route.query.topicName &&
            this.$route.query.periodId &&
            this.$route.query.projectName &&
            this.$route.query.periodName &&
            this.$route.query.topicId
          ) {
            this.projectName = this.$route.query && this.$route.query.projectName
            this.topicName = this.$route.query && this.$route.query.topicName
            this.periodName = this.$route.query && this.$route.query.periodName
            this.topicId = this.$route.query && this.$route.query.topicId
            this.queryParams.periodId = this.$route.query && this.$route.query.periodId
            this.getList()
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.projectName = this.$route.query && this.$route.query.projectName
      this.topicName = this.$route.query && this.$route.query.topicName
      this.periodName = this.$route.query && this.$route.query.periodName
      this.topicId = this.$route.query && this.$route.query.topicId
      this.queryParams.periodId = this.$route.query && this.$route.query.periodId
      this.getList()
      this.getDicts('apply_status').then((response) => {
        this.statusOptions = response.data
      })
      // 导入模板
      this.getExcelUrl();
    },
    methods: {
      //获取发证机构
      getInstitution(){
        getTopId(this.topicId).then(res=>{
          this.institution = res.data
        })
      },
      // 上传Excel更新状态
      excelUpload(file) {
        this.uploadExcelLoading = true
        excelUpload(file, this.queryParams.periodId).then(res => {
          if (res.code == 200 && res.data == 200) {
            this.msgSuccess(res.msg);
            this.getList();
            this.importUpdateOpen = false
          } else {
            this.download(res.msg);
            this.$message.error("上传数据有误，请将数据修改后重新上传！");
          }
          this.uploadExcelLoading = false
        }).catch(() => {
          this.uploadExcelLoading = false
        })
      },
      // 获取下载excel地址
      getExcelUrl() {
        // let import_course = "apply_update_status_excel_template";
        GetExcelUrl("apply_update_status_excel_template").then((res) => {
          if (res.code == 200) {
            this.updateStatusExcelTemplate = res.msg;
          }
        });
      },
      /** 修改结算状态 */
      changeSettleStatus(val){
        if(val==1){
          this.$confirm('结算状态一旦设置，【状态】栏不可更改为笔试通过前状态', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {
            this.handleStatus()
          })
        }
      },
      /** 导出附件 */
      exportAttachment() {
        let param = {
          ids: this.ids,
          certName: this.queryParams.certName,
          status: this.queryParams.status,
          periodId: this.queryParams.periodId
        }
        exportAttachment(param).then(res => {
          let attachmentList = res.data
          if (attachmentList.length == 0) {
            this.$message.warning('当前导出暂无附件~')
            return
          }
          let message = '确定导出当前所选择报名信息的' + attachmentList.length + '个附件吗'
          this.$confirm(message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let sourceList = attachmentList.map(item => {
              return { name: item.fieldName, url: item.fieldValue }
            })
            // 导出附件
            filesToRar(sourceList, this.periodName + '-报名表附件包')
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消导出'
            })
          })
        })
      },
      // 用户上传身份头像压缩包
      fileUpload(file) {
        this.imageUploadStatus = '上传中...'
        fileUpload(file, this.queryParams.periodId).then(res => {
          if (res.code == 200) {
            this.imageUploadStatus = '上传成功'
            this.$message.success('上传成功~')
            this.importOpen = false
            this.getList()
          } else {
            this.imageUploadStatus = '上传失败'
            this.$message.error(res.msg)
          }
        }).catch(res => {
          this.imageUploadStatus = '上传失败'
        })
      },
      /** 确认导出报表 */
      submitExcel() {
        let fieldList = this.selectFieldList.map(item => {
          return { fieldId: item.split(':')[0], fieldKey: item.split(':')[1], fieldName: item.split(':')[2] }
        })
        if (fieldList.length == 0) {
          this.$message.warning('请勾选导出字段')
          return
        }
        let param = {
          ids: this.ids,
          fieldList: fieldList,
          certName: this.queryParams.certName,
          status: this.queryParams.status,
          periodId: this.queryParams.periodId
        }
        exportUserInfo(param).then(res => {
          const link = document.createElement('a')
          let blob = new Blob([res], {
            type: 'application/vnd.ms-excel'
          })
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.download = new Date().getTime() + '报名表.xlsx'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.excelOpen = false
        })
      },
      /** 确认修改 */
      submitStatus() {
        updateStatus(this.statusDataList).then(res => {
          if (res.code === 200) {
            this.msgSuccess('状态更新成功')
            this.statusOpen = false
            this.getList()
          } else {
            this.msgError(res.msg)
          }
        })
      },
      /** 更新状态弹框 */
      handleStatus() {
        getApplyData(this.ids).then(res => {
          this.statusDataList = res.data
          this.getInstitution()
          this.statusOpen = true
        })
      },
      /** 查看报名表弹出框 */
      applyDataView(row) {
        this.applyDataParam = {
          pageNum: 1,
          pageSize: 10,
          periodId: row.periodId,
          userInfoId: row.userInfoId
        }
        this.applyDataOpen = true
        this.applyDataTitle = row.certName + '报名表'
        this.listApplyData()
      },
      /** 获取报名表数据 */
      listApplyData() {
        listApplyData(this.applyDataParam).then(res => {
          this.applyDataList = res.rows
          this.applyDataTotal = res.total
        })
      },
      /** 备注提交 */
      hendleRemark() {
        if (!this.remark.remark) {
          this.$message.warning('请填写备注信息~')
          return
        }
        addApplyRemark(this.remark).then(res => {
          if (res.code === 200) {
            this.msgSuccess('备注成功')
            this.remarkOpen = false
          } else {
            this.msgError(res.msg)
          }
        })
      },
      /** 查询备注弹出框 */
      remarkDetail(row) {
        this.remarkParam = {
          pageNum: 1,
          pageSize: 10,
          userInfoId: row.userInfoId
        }
        this.remark = {
          remark: undefined,
          userInfoId: row.userInfoId,
          status: row.status,
          userId: row.userId
        }
        this.listRemark()
        this.remarkTitle = row.certName + '报名备注'
        this.remarkOpen = true
      },
      /** 查询备注 */
      listRemark() {
        listApplyRemark(this.remarkParam).then(res => {
          this.remarkList = res.rows
          this.remarkTotal = res.total
        })
      },
      /** 查看详情 */
      handleDetail(row) {
        getUserInfo(row.userInfoId).then(res => {
          this.userInfo = res.data
          this.userInfoOpen = true
        })
      },
      // 数据状态字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status)
      },
      /** 查询学员报名信息列表 */
      getList() {
        this.loading = true
        listUserInfo(this.queryParams).then(response => {
          this.userInfoList = response.rows
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
          userInfoId: undefined,
          projectId: undefined,
          topicId: undefined,
          periodId: undefined,
          userId: undefined,
          certName: undefined,
          companyId: undefined,
          companyName: undefined,
          distributorLevel: undefined,
          distributorId: undefined,
          distributorName: undefined,
          certifyingAuthorityId: undefined,
          certifyingAuthorityName: undefined,
          applyTime: undefined,
          finishRate: undefined,
          examScore: undefined,
          status: '0',
          remark: undefined,
          createTime: undefined,
          updateTime: undefined
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
        this.ids = selection.map(item => item.userInfoId)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset()
        this.open = true
        this.title = '添加学员报名信息'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const userInfoId = row.userInfoId || this.ids
        getUserInfo(userInfoId).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改学员报名信息'
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.userInfoId != undefined) {
              updateUserInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                } else {
                  this.msgError(response.msg)
                }
              })
            } else {
              addUserInfo(this.form).then(response => {
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
        const userInfoIds = row.userInfoId || this.ids
        this.$confirm('是否确认删除学员报名信息编号为"' + userInfoIds + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delUserInfo(userInfoIds)
        }).then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        }).catch(function() {
        })
      },
      /** 导出报表按钮操作 */
      handleExport() {
        fieldList(this.topicId).then(res => {
          this.fieldList = res.data
          this.excelOpen = true
          this.selectFieldList = []
        })
      }
    }
  }
</script>
<style scoped>
  .hint {
    color: red;
    font-size: 12px;
  }
</style>
