<template>
  <div>
    <el-tabs v-model="tab" type="border-card" class="tab">
      <el-tab-pane name="0">
        <span slot="label"><i class="el-icon-s-order"></i> 进度详情</span>
      </el-tab-pane>
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-s-data"></i> 汇总</span>
      </el-tab-pane>
      <el-tab-pane name="2" v-if="isHistory==1">
        <span slot="label"><i class="el-icon-s-operation"></i> 历史</span>
      </el-tab-pane>
    </el-tabs>
    <div class="app-container">
      <div v-show="tab == 0">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
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
        <table>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>课题名称</th>
              <th>发证机构</th>
              <th>最新状态</th>
              <th>课题价格</th>
              <th>招生价</th>
              <th>已绑二级分销商数</th>
              <th>操作</th>
              <th>推送</th>
            </tr>
          </thead>
          <tbody v-for="item in projectList">
            <tr v-for="(item1, index) in item.eyApplyTopicVos">
              <td v-if="!index" :rowspan="item.eyApplyTopicVos.length">
                {{ item.projectName }}
              </td>
              <td>{{ item1.topicName }}</td>
              <td>{{ item1.authorityName }}</td>
              <td v-if="item1.periodNum > 0" style="color: rgb(245, 154, 35)">
                有招生期次
              </td>
              <td v-else>当前无招生期次</td>
              <td>{{ item1.price }}</td>
              <td>{{ item1.admissionPrice }}</td>
              <td>{{ item1.distributorNum }}</td>
              <td>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="goProject(item, item1)"
                  >期次管理
                </el-button>
                <el-button
                  v-if="item1.periodNum > 0"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-hasPermi="['apply:distributorTopicRel:add']"
                  @click="bindingDistributor(item, item1)"
                  >绑定二级分销商
                </el-button>
                <el-button
                  icon="el-icon-s-promotion"
                  type="primary"
                  round
                  v-hasPermi="['apply:pushCompany:pushCompany']"
                  @click="pushCompany(item1)"
                  v-if="item1.periodNum > 0"
                  >推送到企业
                </el-button>
              <td v-if="!index" :rowspan="item.eyApplyTopicVos.length">
              <el-button
                icon="el-icon-s-promotion"
                type="primary"
                round
                v-hasPermi="['apply:pushCompany:pushCompany']"
                @click="pushUser(item)"
                v-if="item1.periodNum > 0"
              >推送到个人
              </el-button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="tab == 1">
        <div class="title">数据统计</div>
        <div class="statis-flex">
          <div v-for="item in dataList" :key="item.name" class="statis-item">
            <div>{{ item.name }}</div>
            <div class="item2">{{ dataForm[item.key] || 0 }}</div>
          </div>
        </div>
        <div class="title">统计详情</div>
        <el-form
          :model="collectQueryParams"
          ref="collectQueryForm"
          :inline="true"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="collectQueryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              size="small"
              @keyup.enter.native="getCollectList"
            />
          </el-form-item>
          <el-form-item label="课题名称" prop="topicName">
            <el-input
              v-model="collectQueryParams.topicName"
              placeholder="请输入课题名称"
              clearable
              size="small"
              @keyup.enter.native="getCollectList"
            />
          </el-form-item>
          <el-form-item label="机构名称" prop="authorityName">
            <el-input
              v-model="collectQueryParams.authorityName"
              placeholder="请输入机构名称"
              clearable
              size="small"
              @keyup.enter.native="getCollectList"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getCollectList"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetCollectQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <table>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>课题名称</th>
              <th>发证机构</th>
              <th>预报名人数</th>
              <th>报名成功人数</th>
              <th>报名成功率</th>
              <th>下放证书人数</th>
              <th>证书下放率</th>
              <th>下放补贴/完训结算人数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody v-for="(item, i) in collectProjectList" :key="i">
            <tr v-for="(item1, index) in item.eyApplyTopicVos" :key="index">
              <td v-if="!index" :rowspan="item.eyApplyTopicVos.length">
                {{ item.projectName }}
              </td>
              <td>{{ item1.topicName }}</td>
              <td>{{ item1.authorityName }}</td>
              <td>{{ item1.perApplyNum }}</td>
              <td>{{ item1.applyNum }}</td>
              <td>
                {{
                  item1.perApplyNum == 0
                    ? 0.0
                    : ((item1.applyNum / item1.perApplyNum) * 100).toFixed(1)
                }}%
              </td>
              <td>{{ item1.certificateNum }}</td>
              <td>
                {{
                  item1.perApplyNum == 0
                    ? 0.0
                    : (
                        (item1.certificateNum / item1.perApplyNum) *
                        100
                      ).toFixed(1)
                }}%
              </td>
              <td>{{ item1.subsidyNum }}</td>
              <td>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="goProject(item, item1)"
                  >期次管理
                </el-button>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td colspan="3" style="text-algin: right">合计</td>
              <td style="color: #1890ff">{{ dataTotal.perApplyNum }}</td>
              <td style="color: #1890ff">{{ dataTotal.applyNum }}</td>
              <td style="color: #1890ff">{{ dataTotal.successRate }}</td>
              <td style="color: #1890ff">{{ dataTotal.certificateNum }}</td>
              <td style="color: #1890ff">{{ dataTotal.accessRate }}</td>
              <td style="color: #1890ff">{{ dataTotal.subsidyNum }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-show="tab == 2">
        <div class="title">数据统计</div>
        <div class="statis-flex">
          <div v-for="item in dataList" :key="item.name" class="statis-item">
            <div>{{ item.name }}</div>
            <div class="item2">{{ historyForm[item.key] || 0 }}</div>
          </div>
        </div>
        <div class="title">统计详情</div>
        <el-form
          :model="historyQueryParams"
          ref="historyQueryParams"
          :inline="true"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="historyQueryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              size="small"
              @keyup.enter.native="getHistoryCollectList"
            />
          </el-form-item>
          <el-form-item label="课题名称" prop="topicName">
            <el-input
              v-model="historyQueryParams.topicName"
              placeholder="请输入课题名称"
              clearable
              size="small"
              @keyup.enter.native="getHistoryCollectList"
            />
          </el-form-item>
          <el-form-item label="机构名称" prop="authorityName">
            <el-input
              v-model="historyQueryParams.authorityName"
              placeholder="请输入机构名称"
              clearable
              size="small"
              @keyup.enter.native="getHistoryCollectList"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="getHistoryCollectList"
            >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetHistoryCollectQuery"
            >重置</el-button
            >
          </el-form-item>
        </el-form>
        <table>
          <thead>
          <tr>
            <th>项目名称</th>
            <th>课题名称</th>
            <th>发证机构</th>
            <th>预报名人数</th>
            <th>报名成功人数</th>
            <th>报名成功率</th>
            <th>下放证书人数</th>
            <th>证书下放率</th>
            <th>下放补贴/完训结算人数</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody v-for="(item, i) in history" :key="i">
          <tr v-for="(item1, index) in item.eyApplyTopicVos" :key="index">
            <td v-if="!index" :rowspan="item.eyApplyTopicVos.length">
              {{ item.projectName }}
            </td>
            <td>{{ item1.topicName }}</td>
            <td>{{ item1.authorityName }}</td>
            <td>{{ item1.perApplyNum }}</td>
            <td>{{ item1.applyNum }}</td>
            <td>
              {{
              item1.perApplyNum == 0
              ? 0.0
              : ((item1.applyNum / item1.perApplyNum) * 100).toFixed(1)
              }}%
            </td>
            <td>{{ item1.certificateNum }}</td>
            <td>
              {{
              item1.perApplyNum == 0
              ? 0.0
              : (
              (item1.certificateNum / item1.perApplyNum) *
              100
              ).toFixed(1)
              }}%
            </td>
            <td>{{ item1.subsidyNum }}</td>
            <td>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="goProject(item, item1,1)"
              >期次管理
              </el-button>
            </td>
          </tr>
          </tbody>
          <tbody>
          <tr>
            <td colspan="3" style="text-algin: right">合计</td>
            <td style="color: #1890ff">{{ historyTotal.perApplyNum }}</td>
            <td style="color: #1890ff">{{ historyTotal.applyNum }}</td>
            <td style="color: #1890ff">{{ historyTotal.successRate }}</td>
            <td style="color: #1890ff">{{ historyTotal.certificateNum }}</td>
            <td style="color: #1890ff">{{ historyTotal.accessRate }}</td>
            <td style="color: #1890ff">{{ historyTotal.subsidyNum }}</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 绑定一级分销商对话框 -->
      <el-dialog
        title="绑定分销商"
        :visible.sync="open"
        width="700px"
        append-to-body
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="分销商" prop="distributorId">
            <el-row>
              <el-col :span="9">
                <el-select
                  v-model="form.distributorId"
                  placeholder="请选择分销商"
                  filterable
                  @change="selectDistributor"
                >
                  <el-option
                    v-for="item in distributionList"
                    :key="item.distributorId"
                    :label="item.distributorName"
                    :value="item.distributorId"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <add-dialog
                  btnText="新增分销商"
                  :rules="rules"
                  :form="addForm"
                  :formList="addFormList"
                  :porp="porp"
                  @cancel="addCancel"
                ></add-dialog>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="发证机构" prop="authorityName">
            <el-select
              v-model="form.authorityName"
              placeholder="请选择发证机构"
              filterable
              clearable
            >
              <el-option
                v-for="item in authorityList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分销比例" prop="distributionProportion">
            <el-input-number
              v-model="form.distributionProportion"
              :min="0"
              :step="1"
              :max="100"
              step-strictly
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定绑定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
        <el-table :data="distributorRelList" border>
          <el-table-column
            label="分销商"
            align="center"
            prop="distributorName"
          />
          <el-table-column
            label="发证机构"
            align="center"
            prop="authorityName"
          />
          <el-table-column
            label="分销比例"
            align="center"
            prop="distributionProportion"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.distributionProportion + "%" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="推送次数" align="center" prop="pushNum" />
          <el-table-column label="报名人数" align="center" prop="applyNum" />
        </el-table>
      </el-dialog>

      <!-- 推送企业弹出框 -->
      <el-dialog
        title="推送企业"
        :visible.sync="pushOpen"
        width="700px"
        append-to-body
      >
        <el-form
          :model="queryCompanyParams"
          ref="queryForm"
          :inline="true"
          label-width="90px"
          @submit.native.prevent
        >
          <el-form-item label="企业名称" prop="platformUserName">
            <el-input
              v-model="queryCompanyParams.nickName"
              placeholder="请输入企业名称"
              clearable
              size="small"
              @keyup.enter.native="queryCompanyList"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="queryCompanyList"
              >搜索</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          v-loading="pushLoading"
          :data="companyList"
          @selection-change="handleSelectionChange"
          border
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="企业名称" align="center" prop="nickName" />
          <el-table-column label="企业昵称" align="center" prop="customName" />
          <el-table-column label="手机号码" align="center" prop="phonenumber" />
        </el-table>
        <pagination
          v-show="companyTotal > 0"
          :total="companyTotal"
          :page.sync="queryCompanyParams.pageNum"
          :limit.sync="queryCompanyParams.pageSize"
          @pagination="queryCompanyList"
        />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="pushSubmit">确定推送</el-button>
          <el-button @click="pushOpen = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 推送个人 -->
    <push-dialog
      :openSend="isShow"
      :projectId="projectId"
      @close="close"
    ></push-dialog>
  </div>
</template>

<script>
import {
  listScheduleDistribution,
  dCollectList,
  dCollect,
  hasHistory,
  historyCollect,
  historyCollectList
} from "@/api/apply/schedule";
import { distributorList } from "@/api/apply/distributorOne";
import { addDistributorTwo } from "@/api/apply/distributorTwo";
import {
  addDistributorRel,
  listDistributorRel,
} from "@/api/apply/distributorTopicRel";
import { companyList } from "@/api/apply/sign";
import { pushCompany } from "@/api/apply/pushCompany";
import Template from "../../certificate/template/index";
import addDialog from "../components/addDialog.vue";
import pushDialog from "@/components/apply/pushDialog.vue"; //推送

export default {
  name: "index",
  components: { Template, addDialog,pushDialog },
  data() {
    return {
      //是否显示个人推送
      isShow:false,
      //项目id
      projectId:'',
      isHistory:0,//是否有历史数据
      history:[],//历史数据
      //历史数据统计数据
      historyForm: {},
      //历史数据合计
      historyTotal: {},
      //历史汇总查询参数
      historyQueryParams: {
        projectName: undefined,
        topicName: undefined,
        authorityName: undefined,
      },
      //tab
      tab: "0",
      //数据统计列表
      dataList: [
        { name: "项目总数", key: "projectNum" },
        { name: "课题总数", key: "topicNum" },
        { name: "期次总数", key: "periodNum" },
        { name: "预报名总人次", key: "perApplyNum" },
        { name: "报名成功总人次", key: "applyPassNum" },
        { name: "下放证书总人次", key: "certificateNum" },
        { name: "下放补贴/完训结算总人次", key: "subsidyNum" },
      ],
      //数据统计数据
      dataForm: {},
      //数据合计
      dataTotal: {},
      //汇总查询参数
      collectQueryParams: {
        projectName: undefined,
        topicName: undefined,
        authorityName: undefined,
      },
      collectProjectList: [],
      //添加分销商回调
      porp: {
        callback: (formData, resolve) => {
          addDistributorTwo(formData).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              // 查询二级分销商
              let param = {
                level: "2",
              };
              distributorList(param).then((res) => {
                this.distributionList = res.data;
              });
              resolve(true);
            } else {
              this.msgError(response.msg);
              resolve(false);
            }
          });
        },
      },
      //添加分销商表单
      addForm: {
        distributorName: "",
        nickName: "",
        phonenumber: "",
        status: 0,
      },
      //添加分销商表单渲染
      addFormList: [
        {
          name: "分销商名称",
          key: "distributorName",
          maxlength: 30,
        },
        {
          name: "用户名",
          key: "nickName",
        },
        {
          name: "手机号",
          key: "phonenumber",
        },
        {
          name: "状态",
          key: "status",
          isSelect: true,
          isStatus: true,
        },
      ],
      queryCompanyParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
      },
      // 签约企业总条数
      companyTotal: 0,
      // 选中企业数组
      companys: [],
      // 非单个禁用
      single: true,
      pushLoading: true,
      // 非多个禁用
      multiple: true,
      pushOpen: false,
      companyList: [],
      pushTopicId: undefined,
      distributorRelList: [],
      distributionList: [],
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      authorityList: [],
      // 查询参数
      queryParams: {
        projectName: undefined,
      },
      projectList: [],
      // 遮罩层
      loading: true,
      // 表单校验
      rules: {
        distributorId: [
          { required: true, message: "分销商不能为空", trigger: "blur" },
        ],
        // authorityName: [
        //   { required: true, message: "发证机构不能为空", trigger: "blur" },
        // ],
        distributionProportion: [
          { required: true, message: "分销比例不能为空", trigger: "blur" },
        ],
        distributorName: [
          { required: true, message: "分销商名称不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
        ],
        status: [
          {
            required: true,
            message: "状态{0:禁用,1:启用}不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    tab(newVal, oldVal) {
      if (newVal == 0) {
        this.getList();
      } else if(newVal == 1) {
        this.getCollect();
        this.getCollectList();
      }else {
        this.getHistoryCollect()
        this.getHistoryCollectList()
      }
    },
  },
  created() {
    this.getList();
    this.getHasgetHistory()
  },
  methods: {
    //关闭弹窗
    close() {
      this.isShow = false;
    },
    pushUser(item){
      this.projectId = item.projectId
      this.isShow = true;
    },
    //获取是否有历史数据
    getHasgetHistory(){
      hasHistory().then(res=>{
        this.isHistory = res.data
      })
    },
    resetCollectQuery() {
      this.resetForm("collectQueryForm");
      this.getCollectList();
    },
    resetHistoryCollectQuery() {
      this.resetForm("historyQueryParams");
      this.getCollectList();
    },
    //获取历史汇总数据详情列表
    getHistoryCollectList(){
      let dataTotal = {
        perApplyNum: 0,
        applyNum: 0,
        successRate: "0%",
        certificateNum: 0,
        accessRate: "0%",
        subsidyNum: 0,
      };
      historyCollectList(this.collectQueryParams).then((res) => {
        res.data.forEach((item) => {
          item.eyApplyTopicVos.forEach((ite) => {
            dataTotal.perApplyNum += ite.perApplyNum;
            dataTotal.applyNum += ite.applyNum;
            dataTotal.certificateNum += ite.certificateNum;
            dataTotal.subsidyNum += ite.subsidyNum;
          });
        });
        dataTotal.successRate =
          dataTotal.perApplyNum == 0
            ? "0.0%"
            : `${((dataTotal.applyNum / dataTotal.perApplyNum) * 100).toFixed(
            1
            )}%`;
        dataTotal.accessRate =
          dataTotal.perApplyNum == 0
            ? "0.0%"
            : `${(
              (dataTotal.certificateNum / dataTotal.perApplyNum) *
              100
            ).toFixed(1)}%`;
        this.historyTotal = dataTotal;
        this.history = res.data;
      });
    },
    //获取汇总数据详情列表
    getCollectList() {
      let dataTotal = {
        perApplyNum: 0,
        applyNum: 0,
        successRate: "0%",
        certificateNum: 0,
        accessRate: "0%",
        subsidyNum: 0,
      };
      dCollectList(this.collectQueryParams).then((res) => {
        res.data.forEach((item) => {
          item.eyApplyTopicVos.forEach((ite) => {
            dataTotal.perApplyNum += ite.perApplyNum;
            dataTotal.applyNum += ite.applyNum;
            dataTotal.certificateNum += ite.certificateNum;
            dataTotal.subsidyNum += ite.subsidyNum;
          });
        });
        dataTotal.successRate =
          dataTotal.perApplyNum == 0
            ? "0.0%"
            : `${((dataTotal.applyNum / dataTotal.perApplyNum) * 100).toFixed(
                1
              )}%`;
        dataTotal.accessRate =
          dataTotal.perApplyNum == 0
            ? "0.0%"
            : `${(
                (dataTotal.certificateNum / dataTotal.perApplyNum) *
                100
              ).toFixed(1)}%`;
        this.dataTotal = dataTotal;
        this.collectProjectList = res.data;
      });
    },
    //获取历史汇总数据
    getHistoryCollect() {
      historyCollect().then((res) => {
        if (res.code == 200) {
          this.historyForm = res.data;
        }
      });
    },
    //获取汇总数据
    getCollect() {
      dCollect().then((res) => {
        if (res.code == 200) {
          this.dataForm = res.data;
        }
      });
    },
    //初始化新增分销商弹窗
    addCancel() {
      this.addForm = {
        distributorName: "",
        nickName: "",
        phonenumber: "",
        status: 0,
      };
    },
    /** 跳转分销期次列表 */
    goProject(project, topic,history=0) {
      let projectName = project.projectName;
      let topicId = topic.topicId;
      let topicName = topic.topicName;
      this.$router.push({
        path: "/train/periodDistribution",
        query: { projectName, topicId, topicName ,history:history==1?history:undefined},
      });
    },
    /** 推送提交 */
    pushSubmit() {
      // 判断是否选择企业
      if (this.companys.length == 0) {
        this.$message.warning("请选择要推送的企业~");
        return;
      }
      let param = {
        topicIds: [this.pushTopicId],
        companys: this.companys,
      };
      pushCompany(param).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("推送成功");
          this.pushOpen = false;
          this.getList();
        } else {
          this.msgError(res.msg);
        }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.companys = selection.map((item) => ({
        companyId: item.userId,
        companyName: item.nickName,
      }));
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 推送课题至企业 */
    pushCompany(item) {
      this.pushTopicId = item.topicId;
      this.queryCompanyList();
    },
    /** 查询已签约企业列表 */
    queryCompanyList() {
      // 查询已签约企业列表
      this.pushLoading = true;
      companyList(this.queryCompanyParams).then((response) => {
        this.companyList = response.rows;
        this.companyTotal = response.total;
        this.pushOpen = true;
        this.pushLoading = false;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.level = "2";
          addDistributorRel(this.form).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 选择分销商改变 */
    selectDistributor(distributorId) {
      let obj = this.distributionList.find((item) => {
        return item.distributorId === distributorId;
      });
      this.form.distributorId = obj.distributorId;
      this.form.distributorName = obj.distributorName;
    },
    /** 绑定分销商 */
    bindingDistributor(project, topic) {
      this.authorityList = topic.authorityName.split(",");
      this.form = {
        projectId: project.projectId,
        projectName: project.projectName,
        topicId: topic.topicId,
        topicName: topic.topicName,
        distributionProportion: 0,
        authorityId: undefined,
        authorityName: undefined,
        distributorId: undefined,
        distributorName: undefined,
        status: 1,
      };
      // 查询一级分销商
      let param = {
        level: "2",
      };
      distributorList(param).then((res) => {
        this.distributionList = res.data;
        this.open = true;
        this.addCancel();
      });
      // 查询已绑定信息
      let data = {
        topicId: topic.topicId,
        level: "2",
      };
      listDistributorRel(data).then((res) => {
        this.distributorRelList = res.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if(this.tab==0){
        this.getList();
      }else if(this.tab==1){
        this.getCollectList();
      }else{
        this.getHistoryCollectList()
      }
    },
    /** 项目列表列表 */
    getList() {
      this.loading = true;
      listScheduleDistribution(this.queryParams).then((response) => {
        this.projectList = response.data;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  height: 27px;
  line-height: 27px;
  margin-bottom: 20px;
  color: #333;
  padding-left: 10px;
  position: relative;
  &::before {
    content: "";
    background: #2a91ed;
    width: 6px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 5px;
    border-radius: 8px;
  }
}
.statis-flex {
  display: flex;
  .statis-item {
    text-align: center;
    width: 25%;
    color: rgb(170, 170, 170);
    // height: 80px;
    font-size: 15px;
    .item2 {
      font-size: 19px;
      color: #333;
      line-height: 50px;
      span {
      }
    }
  }
}
.tab {
  /deep/ .el-tabs__content {
    display: none;
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px #dfe6ec solid;
}

table caption {
  height: 30px;
  line-height: 30px;
  font-weight: 700;
}

table thead th,
table tbody td {
  padding: 8px;
  height: 19px;
  line-height: 19px;
  font-weight: 400;
  border: 1px #dfe6ec solid;
  text-align: center;
  font-size: 13px;
}

table thead th {
  color: #515a6e;
  font-weight: bold;
  background-color: #f8f8f9;
  line-height: 23px;
  text-align: center;
  font-size: 13px;
}

table tbody tr {
  background-color: #fefefe;
  color: #686868;
}
</style>
