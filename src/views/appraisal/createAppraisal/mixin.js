import {
  getExcelConfig,
} from "../../../api/appraisal/appraisal.js";
const miNode={
  data(){
    return{
      topicCheck:[]
    }
  },
  methods:{
    //导出文件
    file(){
      getExcelConfig().then(res=>{
        location.href=res.data//文件上传链接
      })
    },
    //预览模态窗
    colse(e) {
      this.dialogPreview = e;
    },
    //维度提交
    Submit() {
      if (this.tableData.length == 1) {
        this.$message.warning("维度不能为空");
        return;
      }
      for (let item of this.tableData) {
        if (!item.content && !item.check) {
          this.$message.warning("维度不能为空");
          return;
        }
      }
      if(!this.repeat()) return;
      this.dimension()////维度修改和删除后 题型维度的修改
      this.visible.show=false;//关闭维度设置弹窗
      // this.$refs.popoverRef.doClose();
      this.tableDatas=JSON.parse(JSON.stringify(this.tableData))
      //删除最后一条新增的空数据
      this.tableDrop = this.tableData.slice(0, this.tableData.length - 1);//最新维度数据
    },
    repeat(){
      let obj = {};
      let peon = this.tableData.reduce((cur,next) => {
          obj[next.content] ? "" : obj[next.content] = true && cur.push(next);
          return cur;
      },[]) //设置cur默认类型为数组，并且初始值为空的数组
      if(peon.length!=this.tableData.length){
        this.$message.warning("维度设置内容有重复，请重新修改");
          return false;
      }
      return true;
    },
    dimension(){//维度修改和删除后 题型维度的修改
      if(!this.tabletopic.length) return;//题目数据为空就不需要操作
      for(let item of this.tabletopic){//题目数据
        let del=false;//维度被删除 dimensionSign没有找到相同的
        for(let items of this.tableData){//维度绑定
          if(item.dimensionSign==items.dimensionSign){
            del=true
            item.dimensionName=items.content
          }
        }
        if(!del){
          item.dimensionName=this.tableDrop[0].content; //维度
          item.dimensionSign=this.tableDrop[0].dimensionSign; //维度id
        }
      }
    },
    //删除题目
    Delect(e){
      for(let i=0;i<this.tabletopic.length;i++){
        if(this.tabletopic[i].check){//删除题目
          if(this.tabletopic[i].appraisalId){//已有编辑数据
            this.tabletopic[i].deleteFlag=true
          }else{
            this.tabletopic.splice(i,1)
          }
          
        }
      }
      this.resetForm()// 重置题目表单
    },
    //维度设置点击显示
    popoveShow(){
      if(this.visible.data){//删除维度提示框 导致模态窗关闭
        this.visible.data=false
      }else{
        this.tableData = JSON.parse(JSON.stringify(this.tableDatas))//页面展示数据
      }
      
    },
    // 维度绑定
    handleCommand(e){
      for(let i=0;i<this.tabletopic.length;i++){
        if(this.tabletopic[i].check){//绑定维度
          this.tabletopic[i].dimensionName=e.content
          this.tabletopic[i].dimensionSign=e.dimensionSign
          this.tabletopic[i].check=false
        }
      }
      this.resetForm()// 重置题目表单
    },
    // 重置题目表单
    resetForm(){
      //防止点到编辑 将其清空
      this.tableCreate = this.tableCreate.splice(
        this.tableCreate.length - 1,
        1
      );
      this.$refs['ruleForms'].resetFields();
      this.ruleForms.edito = false;
      //防止点到编辑 将其清空
      this.$forceUpdate()
    },
  }
}
export {miNode}
