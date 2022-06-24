<template>
  <div class="app-container">
    <SceneUploadVideo ></SceneUploadVideo>
  </div>
</template>

<script>
  import {
    addSection,
  } from '@/api/course/section'
  import SceneUploadVideo from '@/components/HdSceneUploadVideo/index'

  export default {
    name: 'Scene',
    components: { SceneUploadVideo },
    data() {
      return {
        paperDisabled: false,
        courseStatus: 2,
        statusText: '',
        id: undefined,
        // 遮罩层
        loading: true,
        // PDF类型显示
        filePDF: false,
        // 视频的url
        videoUrl: undefined,
        // 试看视频的url
        tryVideoUrl: undefined,
        // pdf的url
        pdfUrl: undefined,
        // pdf观看时长
        durationStrImput: undefined,
        // 截图比例
        rate: '16:9',
        // 视频文件数组
        videofileList: [],
        // 试看视频文件数组
        tryVideofileList: [],
        // 视频loading状态
        loadingVideo: false,

      }
    },
    created() {
    },
    methods: {
      /** 查询课程章节 列表 */
      getList() {
        this.loading = true
        listSection(this.queryParams).then(response => {
          this.sectionList = response.rows
          this.total = response.total
          if(this.total > 0){
            this.courseStatus = response.rows[0].courseStatus;
          }
          this.loading = false
        })
      },
    }
  }
</script>
<style>

</style>
