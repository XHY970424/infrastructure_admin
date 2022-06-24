<template>
  <div>
    <el-dialog
      title="标签配置"
      :visible.sync="openedit"
      width="1000px"
      :before-close="close"
      append-to-body
    >
      <div class="label-flex">
        <el-input class="label-input" type="text" v-model="tagName" placeholder="请输入标签" @keyup.enter.native="add" />
        <el-button type="primary" @click="add">添 加</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="item.tagClassName"
          v-for="item in classifyList"
          :key="item.id"
          :name="item.id"
        ></el-tab-pane>
      </el-tabs>
      <div class="tab-flex">
        <!-- <div class="tab-item" v-for="item in 10" :key="item"> -->
        <el-tag
          effect="plain"
          class="tab-item"
          v-for="(item, index) in tagByClassify"
          v-show="!item.delete"
          :key="item.id"
          @click="addTagByList(index)"
        >
          {{ item.tagName }}
        </el-tag>
        <!-- </div> -->
      </div>

      <div class="tab-flex" style="margin-top: 15px">
        <div class="tab-text">已添加{{ addTag.length }}个：</div>
        <div class="tab-flex" style="width: 88%">
          <el-tag
            class="tabselect"
            v-for="(item, i) in addTag"
            @close="handleDelete(i)"
            :key="i"
            closable
          >
            {{ item.tagName }}
          </el-tag>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCourseTagClass, getTagClassById } from "@/api/cms/courseTag";
export default {
  props: {
    openedit: {
      type: Boolean,
      default: false,
    },
    list:{
      type: Array,
      default: ()=>{
        return []
      },
    }
  },
  data() {
    return {
      activeName: "first",
      //标签分类列表
      classifyList: [],
      //选中的分类id
      classifyId: "",
      //分类下的便签列表
      tagByClassify: [],
      //已添加的便签列表
      addTag: [],
      //标签名称
      tagName:''
    };
  },
  created() {
    this.getClassify();
  },
  methods: {
    //添加标签
    add(){
      if(this.tagName==''){
        this.$message.error("请输入标签名称");
        return
      }
      if(this.addTag.filter(item=>item.tagName==this.tagName).length>0){
        this.$message.error("已存在标签");
        return
      }
      let tag = {
        id:null,
        tagClassId:null,
        tagName:this.tagName
      }
      this.addTag.push(tag)
      this.tagName=''
    },
    //添加列表里删除
    handleDelete(index) {
      let id = this.addTag[index].id;
      let i = this.tagByClassify.findIndex(item=>item.id == id);
      if (i != -1) {
        this.tagByClassify[i].delete = false;
      }
      this.addTag.splice(index,1)
    },
    //从分类下的标签添加进添加列表
    addTagByList(index) {
      if(this.addTag.filter(item=>item.tagName==this.tagByClassify[index].tagName).length>0){
        this.$message.error("已存在标签");
        return
      }
      this.addTag.push(this.tagByClassify[index]);
      this.tagByClassify[index].delete = true;
    },
    //选择分类
    handleClick(e) {
      this.classifyId = e.name;
      this.getTagByClass();
    },
    //关闭弹窗
    close(){
      this.$emit('update:openedit',false)
    },
    //添加
    submit() {
      if(this.addTag.length==0){
        this.$message.error("请先添加标签");
        return
      }
      this.$emit('update:openedit',false)
      this.$emit('selectTag',this.addTag)
    },
    //获取标签分类列表
    getClassify() {
      getCourseTagClass().then((res) => {
        this.classifyList = res.data;
        this.classifyId = res.data[0].id;
        this.getTagByClass();
        this.addTag = this.list
      });
    },
    //分类下的标签列表
    getTagByClass() {
      getTagClassById(this.classifyId).then((res) => {
        res.data.forEach((item) => {
          let index = this.addTag.findIndex((ite) => item.id == ite.id);
          if (index != -1) {
            item.delete = true;
          } else {
            item.delete = false;
          }
        });
        this.tagByClassify = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.label-flex {
  display: flex;
  width: 30%;
  margin-bottom: 20px;
  .label-input {
    margin-right: 10px;
  }
}
.tab-flex {
  display: flex;
  flex-wrap: wrap;
  .tab-text {
    font-size: 16px;
    margin-top: 16px;
  }
  .tab-item {
    margin: 10px;
    cursor: pointer;
    // width: 100px;
    padding: 5px 20px;
    height: auto;
    border: none;
    color: #ffffff;
    // border-radius: 10px;
    background: rgb(150, 150, 150);
  }
  .tabselect {
    margin: 10px;
    cursor: pointer;
    // width: 100px;
    padding: 5px 20px;
    height: auto;
    ::v-deep .el-icon-close {
      padding-top: 1px;
    }
    // line-height: 35px;
  }
}
</style>
