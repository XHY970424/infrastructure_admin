<template>
  <div class="app-container">
    <div style="width: 40%; margin-left: 20px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" >
        <el-row>
          <el-col :span="17">
            <div style="margin-left: 12px; color: red">图标比例建议为1:1,尺寸建议为32px*32px,图片大小不超过200kb</div>
            <el-form-item label="icon图标" prop="icon"  label-width="80px">
              <el-upload
                class="avatar-uploader"
                :action="uploadBackgroundImgUrl"
                :show-file-list="false"
                :headers="headers"
                :on-success="iconUploadSuccess"
                :before-upload="handleBeforeUpload"
                accept="image/png,image/jpeg,image/jpg"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-image :preview-src-list="[form.icon]" :z-index="2200"
                      style="max-width: 100px;max-height: 100px"
                      v-show="form.icon" :src="form.icon"/>
          </el-col>
        </el-row>
        <el-form-item label="标签标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标签标题" />
        </el-form-item>
<!--        <el-row>-->
<!--          <el-col :span="17">-->
<!--            <div style="margin-left: 12px; color: red">logo图片比例建议为1:1,尺寸建议为32px*32px,图片大小不超过200kb</div>-->
<!--            <el-form-item label="logo图片" prop="icon"  label-width="80px">-->
<!--              <el-upload-->
<!--                class="avatar-uploader"-->
<!--                :action="uploadBackgroundImgUrl"-->
<!--                :show-file-list="false"-->
<!--                :headers="headers"-->
<!--                :on-success="logoUploadSuccess"-->
<!--                :before-upload="handleBeforeUpload"-->
<!--                accept="image/png,image/jpeg,image/jpg"-->
<!--              >-->
<!--                <el-button size="small" type="primary">点击上传</el-button>-->
<!--              </el-upload>-->

<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-image :preview-src-list="[form.logo]" :z-index="2200"-->
<!--                      style="max-width: 100px;max-height: 100px"-->
<!--                      v-show="form.logo" :src="form.logo"/>-->
<!--          </el-col>-->
<!--        </el-row>-->
        <el-form-item label="logo标题" prop="logoTitle">
          <el-input v-model="form.logoTitle" placeholder="请输入logo标题"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {getInfo, updateInfo} from "@/api/system/info";
  import { getToken } from '@/utils/auth'

  export default {
    name: "Info",
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
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          icon: [
            {required: true, message: "icon图标不能为空", trigger: "blur"}
          ],
          title: [
            {required: true, message: "标签标题不能为空", trigger: "blur"}
          ],
          // logo: [
          //   {required: true, message: "logo图片不能为空", trigger: "blur"}
          // ],
          logoTitle: [
            {required: true, message: "logo标题不能为空", trigger: "blur"}
          ],
        }
      };
    },
    created() {
      this.getBaseInfo();
    },
    methods: {
      /** 查询后台logo配置列表 */
      getBaseInfo() {
        this.loading = true;
        getInfo().then(response => {
          if (!response.data) {
            this.reset();
          } else {
            let {logoTitle, logo, title, icon}=response.data
            this.$store.state.user.title ={logoTitle, logo, title, icon}
            this.form = response.data;
          }
          this.loading = false;
        });
      },
      // 上传图片前校验
      handleBeforeUpload(file) {
        const isLt2M = file.size / 1024  <= 200;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 200kb!");
        }
        return isLt2M;
      },
      // icon图标上传成功
      iconUploadSuccess(res) {
        if (res.code == 200) {
          this.form.icon = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      // logo图标上传成功
      logoUploadSuccess(res) {
        if (res.code == 200) {
          this.form.logo = res.url
        } else {
          this.$message.error(res.msg)
        }
      },
      // 表单重置
      reset() {
        this.form = {
          adminInfoId: undefined,
          icon: undefined,
          title: undefined,
          logo: undefined,
          logoTitle: undefined,
          createTime: undefined,
          createBy: undefined,
          updateTime: undefined,
          updateBy: undefined
        };
        this.resetForm("form");
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("操作成功");
                this.getBaseInfo();

              } else {
                this.msgError(response.msg);
              }
            });
          }
        });
      },
    }
  };
</script>
