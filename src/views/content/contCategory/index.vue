<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['content:contCategory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['content:contCategory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['content:contCategory:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['content:contCategory:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="contCategoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="categoryId" />
      <el-table-column label="类型名称" align="center" prop="name" />
      <el-table-column label="类型名称" align="center" prop="imageUrl" >
        <!--显示图片-->
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl != undefined && scope.row.imageUrl != '' "
            style="max-width: 40px; max-height: 40px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="显示状态" align="center" prop="status" :formatter="statusFormat" />
      <!-- <el-table-column label="显示首页" align="center" prop="isIndex" :formatter="isIndexFormat" /> -->
      <!-- <el-table-column label="首页位置" align="center" prop="isIndex" :formatter="isIndexFormat">
        <template slot-scope="scope">
          <span v-if="scope.row.indexWz == 0">下面</span>
          <span v-if="scope.row.indexWz == 1">上面</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['content:contCategory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['content:contCategory:remove']"
          >删除</el-button>
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

    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose">
      <video-player class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions">
      </video-player>
    </el-drawer>

    <!-- 添加或修改文章内容分类对话框 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="open" width="800px" append-to-body v-loading="loadingVideo" element-loading-text="视频上传中">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入类型名称" maxlength="8" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签名称" prop="label">
              <el-input v-model="form.label" placeholder="请输入标签名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="分类图片" prop="imageUrl"  label-width="80px">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgroundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="handleUploadSuccess"
                :before-upload="handleBeforeUpload"
                accept="image/png,image/jpeg,image/jpg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.imageUrl]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.imageUrl" :src="form.imageUrl"/>
          </el-col>

          <!-- <el-col :span="16">
            <el-form-item label="显示首页" prop="isIndex">
              <el-select v-model="form.isIndex" placeholder="请选择">
                <el-option
                  v-for="dict in isIndexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="首页位置" prop="indexWz">
              <el-select v-model="form.indexWz" placeholder="请选择">
                <el-option value="0" label="下面"/>
                <el-option value="1" label="上面"/>
              </el-select>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="12">
            <el-form-item label="视频封面" prop="imageUrl">
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
                WatermarkText="大湾区职训网"
                WatermarkTextFont="12px Sans-serif"
                WatermarkTextColor="#fff"
                :WatermarkTextX="0.95"
                :WatermarkTextY="0.95"
                :DoNotDisplayCopyright="true"
                @cutDown="cutDown">
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="oneTOone">上传(比例1:1)</el-button>
                <el-button size="small" type="primary" icon="el-icon-upload" slot="open" @click="sixtTOnine">上传(比例16:9)</el-button>
              </ImgCutter>
              <el-image v-if="form.imageUrl!=null && form.imageUrl!=''" style="max-width: 80px;max-height: 80px"
                        :src="form.imageUrl"
                        :preview-src-list="[form.imageUrl]">
              </el-image >
              <el-input v-model="form.imageUrl" v-show="false" />
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="17">
            <el-form-item label="视频URL" prop="sectionVideoUrl">
              <el-input v-model="form.videoUrl" placeholder="请输入文件路径链接"/>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="6" style="margin-left: 5px">
            <div>
              <div style="float: left">
                <el-upload :file-list="videofileList" :http-request="fileUpload"
                           :before-upload="videoBeforeUpload" :limit="1" :auto-upload="true" list-type="video" accept="video/*" name="video_file">
                  <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                </el-upload>
              </div>
              <div style="float: left;margin-left: 5px">
                <el-button size="small" v-if="form.videoUrl!=null && form.videoUrl!=''" @click="openvideo(form.videoUrl)">播放</el-button>
              </div>
            </div>
            <el-input v-model="form.videoUrl" v-show="false" />
          </el-col> -->

          <el-col :span="24">
            <el-form-item label="说明">
              <el-input v-model="form.introduce" type="textarea" rows="8" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listContCategory, getContCategory, imgBase64Upload, fileUploadVideo, delContCategory, addContCategory, updateContCategory, exportContCategory } from "@/api/content/contCategory";
import ImgCutter from 'vue-img-cutter';
import { getToken } from '@/utils/auth'
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "ContCategory",
  components: {ImgCutter},

  data() {
    return {
      // 上传图片地址 上传的图片服务器地址
      uploadBackgroundImgUrl: process.env.VUE_APP_BASE_API + '/file/uploadImg',
      // 请求头
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
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
      // 文章内容分类表格数据
      contCategoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 图片比例
      rate: '16:9',
      // 视频文件数组
      videofileList: [],
      // 类别编码字典
      typeCodeOptions: [],
      // 状态字典
      statusOptions: [],
      // 是否显示在首页(0=否,1=是)字典
      isIndexOptions: [],
      // 上传视频loading
      loadingVideo: false,
      // 视频播放插件参数
      drawer: false,
      // 视频播放插件参数
      direction: 'rtl',
      // 视频播放
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{
          //类型
          type: "video/mp4",
          //url地址
          src: ''
        }],
        rate: '16:9',
        //你的封面地址
        poster: '',
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        typeCode: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        label: [
          { required: true, message: "标签不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "显示状态不能为空", trigger: "blur" }
        ],
        // isIndex: [
        //   { required: true, message: "显示首页不能为空", trigger: "blur" }
        // ],
        imageUrl: [
          { required: true, message: "请上传分类图片", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("content_type").then(response => {
      this.typeCodeOptions = response.data;
    });
    this.getDicts("sys_show_hide").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("cust_yes_no").then(response => {
      this.isIndexOptions = response.data;
    });
  },
  methods: {
    // 图标上传成功
    handleUploadSuccess(res) {
      if (res.code == 200) {
        this.form.imageUrl = res.url
      } else {
        this.$message.error(res.msg)
      }
    },
    // 上传图片前校验
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传分类图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    /** 查询文章内容分类列表 */
    getList() {
      this.loading = true;
      listContCategory(this.queryParams).then(response => {
        this.contCategoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 类别编码字典翻译
    typeCodeFormat(row, column) {
      return this.selectDictLabel(this.typeCodeOptions, row.typeCode);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 是否显示在首页(0=否,1=是)字典翻译
    isIndexFormat(row, column) {
      return this.selectDictLabel(this.isIndexOptions, row.isIndex);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        categoryId: undefined,
        name: undefined,
        label: undefined,
        typeCode: undefined,
        orderNum: '100',
        status: '1',
        isIndex: '0',
        indexWz: '0',
        imageUrl: undefined,
        videoUrl: undefined,
        introduce: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.categoryId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章内容分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const categoryId = row.categoryId || this.ids
      getContCategory(categoryId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章内容分类";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.categoryId != undefined) {
            updateContCategory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addContCategory(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const categoryIds = row.categoryId || this.ids;
      this.$confirm('是否确认删除文章内容分类编号为"' + categoryIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delContCategory(categoryIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有文章内容分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportContCategory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    /**上传(比例1:1) */
    oneTOone:function(res){
      this.rate = "1:1";
    },

    /**上传(比例16:9) */
    sixtTOnine:function(res){
      this.rate = "16:9";
    },

    /** 截图确定按钮事件 */
    cutDown:function(res){
      imgBase64Upload(res.dataURL).then(res => {
        if(res.code==200){
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.imageUrl = res.url;
        }else{
          this.$message.error('上传图片异常')
        }
      });
    },

    //入参一定要添加file默认参数
    fileUpload(file) {
      this.loadingVideo = true;
      //上传短视频图片
      fileUploadVideo(file).then(res => {
        //alert(JSON.stringify(res));
        if(res.code==200){
          /** 回填上传之后返回的路径到表单中，绑定到form表单，提交的时候一并带回后台*/
          this.form.videoUrl = res.url;
          this.loadingVideo = false;
          this.videofileList = [];
        }else{
          this.$message.error('上传视频异常');
          this.loadingVideo = false;
        }
      });
    },

    /** 上传视频前的校验 */
    videoBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 1024
      if (!isRightSize) {
        this.$message.error('文件大小超过 1G')
      }
      let isAccept = new RegExp('video/*').test(file.type)
      if (!isAccept) {
        this.$message.error('应该选择video/*类型的文件')
      }

      let url = URL.createObjectURL(file);
      var audioElement = new Audio(url);
      var ele = this.$refs.playTime;
      audioElement.addEventListener('loadedmetadata',function(){
        let playTime = audioElement.duration; //playTime就是当前视频长度
        ele.value = parseInt(playTime); //目前使用这种方式解决js与vue之间的传值问题
        console.info("时长："+playTime);
      });
      this.videofileList = [];
      return isRightSize && isAccept
    },

    /** 打开视频弹窗 */
    openvideo(video){
      this.drawer = true;
      this.playerOptions['sources'][0]['src'] = video;
    },

    /** 视频关闭 */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>
