<template>
  <div>
    <el-dialog
      title="课程配置"
      :visible.sync="openconfig"
      width="1200px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="价格显示：">
          <el-radio-group v-model="form.showPrice">
            <el-radio :label="0">不显示</el-radio>
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加入学习方式：">
          <el-radio-group v-model="form.flowOnline">
            <el-radio :label="1">自主支付</el-radio>
            <el-radio :label="0">联系业务人员</el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实名认证：">
          <el-radio-group v-model="form.isAuth">
            <el-radio :label="1">需要</el-radio>
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报名时间：">
          <el-radio-group v-model="form.applyTimeType">
            <el-radio :label="0">不限时间</el-radio>
            <el-radio :label="1"
              >自定义
              <el-date-picker
                class="date-picker"
                :disabled="form.applyTimeType == 1 ? false : true"
                v-model="form.onlineEndtime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
            /></el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学习有效期：">
          <el-radio-group v-model="form.studyDeadline">
            <el-radio :label="0">长期有效</el-radio>
            <el-radio :label="1"
              >截止日期<el-date-picker
                class="date-picker"
                :disabled="form.studyDeadline == 1 ? false : true"
                v-model="form.studyEndTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
            /></el-radio>
            <el-radio :label="2"
              >有效天数
              <el-input
                class="date-picker"
                :disabled="form.studyDeadline == 2 ? false : true"
                v-model="form.onlineIndate"
                style="width: 180px"
                placeholder="请输入天数"
              ></el-input>
            </el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上架设定：">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">立即上架</el-radio>
            <el-radio :label="3"
              >定时上架<el-date-picker
                class="date-picker"
                :disabled="form.status == 3 ? false : true"
                v-model="form.onUpTime"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
            /></el-radio>
            <el-radio :label="4">隐藏</el-radio>
            <el-radio :label="1">下架</el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐：">
          <el-radio-group v-model="form.recommend">
            <el-radio :label="1">推荐</el-radio>
            <el-radio :label="1">不推荐</el-radio>
            <el-radio :label="8">不改变原有配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置常见问题：">
          <el-button
            icon="el-icon-circle-plus-outline"
            @click="configshow = true"
            >问题配置</el-button
          >
          <div class="problem" v-if="helpOption.length">
            <div
              class="problem-grouy"
              v-for="(item, index) in helpOption"
              :key="index"
            >
              <div>Q：{{ item.title }}</div>
              <div class="flex flex-center">
                A：<span v-html="item.content"></span>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="configSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="课程配置"
      :visible.sync="configshow"
      width="1200px"
      :before-close="configClose"
    >
      <div class="class-flex">
        <div class="class-grouy1">
          <div class="grouy-title">问题总类</div>

          <div class="grouy-scroll">
            <div
              class="grouy-item"
              v-for="(item, index) in helplist1"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                @change="checkChange($event, item, 1)"
                ><div class="grouy-text">{{ item.title }}</div></el-checkbox
              >
            </div>
          </div>
        </div>
        <img
          class="class-img"
          src="https://vo.bbazxw.com/pc_infrastructure/show_02.png"
        />
        <div class="class-grouy1">
          <div class="grouy-title">问题归类</div>

          <div class="grouy-scroll">
            <div
              class="grouy-item"
              v-for="(item, index) in helplist2"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                :disabled="
                  helplist2index.length <= 1 && item.checked ? true : false
                "
                @change="checkChange($event, item, 2)"
                ><div class="grouy-text">
                  {{ item.title }}-{{ item.checked }}
                </div></el-checkbox
              >
            </div>
          </div>
        </div>
        <img
          class="class-img"
          src="https://vo.bbazxw.com/pc_infrastructure/show_02.png"
        />
        <div class="class-grouy1">
          <div class="grouy-title">问题详情</div>

          <div class="grouy-scroll">
            <div
              class="grouy-item"
              v-for="(item, index) in helplist3"
              :key="index"
            >
              <el-checkbox
                v-model="item.checked"
                @change="checkChange($event, item, 3)"
                ><div class="grouy-text">
                  {{ item.title }}
                </div></el-checkbox
              >
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="suBproblem">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  helpContent,
  helpCategory,
  getconfig,
} from "@/api/resource/courseSubject";
export default {
  model: {
    prop: "openconfig",
    event: "openevnet",
  },
  props: {
    openconfig: {
      type: Boolean,
      default: false,
    },
    ids: {
      type: Array,
      default: () => [],
    },
    statusType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      configshow: false, //常见问题弹窗
      form: {
        showPrice: 8, //是否展示价格 0-不展示1-展示 8-不改变原有配置
        flowOnline: 8, //加入学习方式 0-联系业务员 1-自主支付 8-不改变原有配置
        isAuth: 8, //是否需要实名认证0-不需要 1-需要 8-不改变原有配置
        applyTimeType: 8, //报名时间类型 0-不限时间 1-自定义 8-不改变原有配置
        onlineEndtime: null, //报名类型为自定义时的报名截止时间
        studyDeadline: 8, //学习有效期限制类型0-长期有效 1-截止日期 2-有效天数 8-不改变原有配置
        studyEndTime: null, //学习有效期限制 截止日期
        onlineIndate: null, //线上使用时长(天)
        status: 8, //上架设定 0上架，1下架 0定时发布中, 4-隐藏 8-不改变原有配置
        onUpTime: null, //定时上架时间
        recommend: 8, //	是否推荐(0否1是) 8-不改变原有配置
        helpContentIds: 0, //关联的常见问题id
      },

      helplist1: [], //一级问题
      helplist2: [], //二级问题
      helplist3: [], //三级问题
      helplist2index: [], //二级问题选中的index
      helpOption: [], //选中常见问题
    };
  },
  watch: {
    helplist2(val) {
      if (!val.length) {
        this.helplist3 = [];
      }
    },
  },
  mounted() {
    helpCategory().then((res) => {
      this.helplist1 = res.data;
      this.helplist1[0].checked = true; //一级问题默认第一个选中
      this.helplist2 = res.data[0].children;
      this.helplist2[0].checked = true; //二级问题默认第一个选中
      this.helplist2index.push(this.helplist2[0].helpCategoryId);
      this.Selectproblem();
    });
  },
  methods: {
    //课程配置保存
    configSubmit() {
      // this.dialogVisible = false
      if (this.form.applyTimeType == 1 && !this.form.onlineEndtime) {
        return this.$message.warning("报名时间自定义时间不能为空");
      } else if (this.form.studyDeadline == 1 && !this.form.studyEndTime) {
        return this.$message.warning("学习有效期截止日期不能为空");
      } else if (this.form.studyDeadline == 2 && !this.form.onlineIndate) {
        return this.$message.warning("学习有效期有效天数不能为空");
      } else if (this.form.status == 3 && !this.form.onUpTime) {
        return this.$message.warning("上架设定定时上架不能为空");
      }
      //常见问题id
      let id = this.helpOption.map((ele) => ele.helpContentId);
      getconfig({
        ...this.form,
        subjectIds: this.ids,
        helpContentIds: id,
        draftSign: this.statusType == 0 ? 0 : 1,
      }).then((res) => {
        if (res.code == 200) {
          this.reset(); //重置
          this.$message.success("配置成功");
          this.$emit("success", true);
          this.$emit("openevnet", false);
        }
      });
    },
    //关闭常见问题弹窗
    suBproblem() {
      let row = [];
      for (let item of this.helplist2) {
        this.helplist3.map((ele) => {
          //获取选中的二级和三级问题
          console.log(
            ele.helpCategoryId,
            item.helpCategoryId,
            ele.checked,
            ele
          );
          if (ele.helpCategoryId == item.helpCategoryId && ele.checked) {
            ele.name = item.title;
            ele.id = item.helpCategoryId;
            row.push(ele);
            console.log(row);
          }
        });
      }
      this.helpOption = row;
      this.configshow = false;
    },
    Selectproblem(e) {
      helpContent(this.helplist2index.join()).then((res) => {
        let row = [];
        for (let item of res.data) {
          let rows = this.helplist3.find(
            (element) => item.helpCategoryId == element.helpCategoryId
          );
          item.checked = false; //防止选中了 重新调用接口 状态是选择其实是null
          row.push(rows || item);
        }
        this.helplist3 = row;
      });
    },
    checkChange(e, item, type) {
      // console.log(e, item, type);
      if (type == 1) {
        //一级
        if (e) {
          //选中添加
          this.helplist2 = [...this.helplist2, ...item.children];
        } else {
          //取消选中删除
          this.helplist2 = this.helplist2.filter((ele) => {
            if (item.helpCategoryId != ele.pid) {
              //返回没重复的值
              return ele;
            } else {
              //取消选中 状态为空
              ele.checked = false;
            }
          });
        }
      } else if (type == 2) {
        if (e) {
          //选中添加
          this.helplist2index.push(item.helpCategoryId);
        } else {
          //取消选中删除
          this.helplist2index = this.helplist2index.filter(
            (ele) => ele != item.helpCategoryId
          );
        }
        this.Selectproblem();
        //二级
      }
    },
    // 常见问题弹窗
    configClose() {
      this.configshow = false;
    },
    //关闭弹窗
    handleClose() {
      this.reset(); //重置
      this.$emit("openevnet", false);
    },
    reset() {
      this.form = {
        showPrice: 8, //是否展示价格 0-不展示1-展示 8-不改变原有配置
        flowOnline: 8, //加入学习方式 0-联系业务员 1-自主支付 8-不改变原有配置
        isAuth: 8, //是否需要实名认证0-不需要 1-需要 8-不改变原有配置
        applyTimeType: 8, //报名时间类型 0-不限时间 1-自定义 8-不改变原有配置
        onlineEndtime: null, //报名类型为自定义时的报名截止时间
        studyDeadline: 8, //学习有效期限制类型0-长期有效 1-截止日期 2-有效天数 8-不改变原有配置
        studyEndTime: null, //学习有效期限制 截止日期
        onlineIndate: null, //线上使用时长(天)
        status: 8, //上架设定 0上架，1下架 0定时发布中, 4-隐藏 8-不改变原有配置
        onUpTime: null, //定时上架时间
        recommend: 8, //	是否推荐(0否1是) 8-不改变原有配置
        helpContentIds: 0, //关联的常见问题id
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-start {
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-align: flex-start;
  -moz-box-align: flex-start;
  -webkit-box-align: flex-start;
}

.flex-end {
  align-items: flex-end;
  -webkit-align-items: flex-end;
  box-align: flex-end;
  -moz-box-align: flex-end;
  -webkit-box-align: flex-end;
}

.flex-center {
  align-items: center;
  -webkit-align-items: center;
  box-align: center;
  -moz-box-align: center;
  -webkit-box-align: center;
}
.dialog-footer {
  text-align: center;
  margin: 0px auto;
  margin-top: 30px;
  ::v-deep .el-button--primary {
    width: 150px;
    height: 40px;
  }
}
.class-flex {
  display: flex;
  align-items: center;
  margin-top: 0px;
  .class-img {
    width: 40px;
    height: 40px;
    transform: rotate(270deg);
    margin: 0px 12px;
  }
  .grouy-title {
    font-size: 18px;
    padding: 5px 20px 0px;
    border-bottom: 1px solid #e0e0e0;
    line-height: 45px;
  }
  .grouy-scroll {
    height: 400px;
    overflow-y: auto;
    padding: 5px 0px;
  }
  .class-grouy1 {
    border: 1px solid #e0e0e0;
    width: 350px;
    height: 450px;
    .grouy-item {
      padding: 10px 20px;
      .grouy-text {
        font-size: 14px;
        width: 280px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1; /* 这里是超出几行省略 */
        overflow: hidden;
        display: block;
        // padding-top: 15px;
      }
    }
    .grouy-item:hover {
      background-color: #f5f5f5;
    }
  }
  ::v-deep .el-checkbox {
    display: flex;
    align-items: center;
  }
}
.problem {
  border: 1px solid #e0e0e0;
  padding: 10px 20px;
  margin-top: 20px;
  max-height: 450px;
  overflow-y: auto;
  .problem-grouy {
    border-bottom: 1px solid #e0e0e0;
    padding: 10px 0px;
    div {
      line-height: 25px;
    }
  }
}
.date-picker {
  margin-left: 10px;
}
</style>
