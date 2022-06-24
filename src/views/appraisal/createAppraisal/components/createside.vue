<template>
  <div>
    <div class="unside">选择题型进行编辑</div>
    <div v-for="(item, index) in side_list" :key="index">
      <!-- 标题 -->
      <div class="side-title">
        <i class="side-icon" :class="item.icon"></i>
        <div>{{ item.title }}</div>
      </div>
      <!-- 内容 -->
      <div v-for="(item, index) in item.child" :key="index">
        <div
          class="side-content"
          :class="{ 'content-show': side_index == item.name }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "createside",
  data() {
    return {
      side_list: [
        {
          title: "选择题",
          icon: "el-icon-caret-bottom",
          child: [
            {
              name: "量表题",
            },
          ],
        },
      ],
      side_index: "量表题",
    };
  },
};
</script>

<style lang="scss">
.unside {
  color: #e0e0e0;
  font-size: 15px;
  margin-top: 10px;
  margin-bottom: 40px;
}
.side-title {
  display: flex;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 15px;
  .side-icon {
    margin-right: 5px;
  }
}
.side-content {
  font-weight: bolder;
  font-size: 15px;
  background: #fff;
  line-height: 30px;
  border-radius: 12rpx;
}
.content-show {
  color: red;
}
</style>
