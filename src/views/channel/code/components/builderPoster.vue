<template>
  <el-dialog title="生成海报" :v-loading="loading" :visible.sync="posterOpen" width="1000px" append-to-body
             :close-on-click-modal="false" :before-close="cancel">
    <div class="swiper-container">
      <div class="swiper-wrapper" style="width: 400px">
        <div
          class="swiper-slide"
          v-for="(item, index) in list"
          :key="index"
          :class="[index == listindex ? 'active' : '']"
          @click="listindex = index"
        >
          <img class="goodsImg" :class="'goodsImg' + index" :src="item.imgUrl"/>
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
      <!-- 如果需要滚动条 -->
      <!--    <div class="swiper-scrollbar"></div>-->
    </div>
    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev" @click="nextButton"></div>
    <div class="swiper-button-next"></div>
    <canvas id="mycanvas" ref="mycanvas" class="mycanvas position" :width="w" :height="h"/>

    <div style="text-align: center; margin-top: 20px">
      <el-button @click="createPoster" type="primary" round>生成海报</el-button>
    </div>
  </el-dialog>
</template>

<script>
  // import Swiper from "swiper";
  import qr from "qr-image";
  import {getPoster} from '@/api/channel/info';

  export default {
    name: "builderPoster",
    props: {
      posterOpen: Boolean,
      row: Object,
    },
    watch: {
      listindex() {

      },
    },
    data() {
      return {
        loading: false,
        w: 650,
        h: 1000,
        list: [
        ],
        listindex: null,
        Url: "",
        base64: '',
      }
    },
    mounted() {
      getPoster().then(res => {
        this.list = res.data;
        this.$nextTick(() => {
          new Swiper(".swiper-container", {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 18,
            loop: false,
            loopFillGroupWithBlank: true,
            // 如果需要前进后退按钮
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
          });
        })
      })
    },
    methods: {
      // 生成海报
      createPoster() {
        this.changeCanvas(this.list[this.listindex]);
        this.base(this.list[this.listindex]);
        setTimeout(() => {
          this.fnInvite();
        }, 500)
      },
      // 获取当前选择的图片宽高并改变canvas宽高
      changeCanvas(row) {
        let img = new Image();
        img.src = row.imgUrl;
        img.onload = () => {
          this.h = img.height;
          this.w = img.width;
        }
      },
      // 获取二维码携带的url地址
      getQrUrl() {
        return "https://pxht.bbazxw.com?sourceCode=" + this.row.sourceCode + "&sign=" + this.row.sign;
      },
      base(e) {
        let base64 = "";
        let img = new Image();
        img.src = e.imgUrl
        img.setAttribute("crossOrigin", '*')
        img.onload = () => {
          this.base64 = this.image2Base64(img);
        }
      },
      image2Base64(img) {
        let canvas = document.createElement("canvas");
        canvas.width = this.w;
        canvas.height = this.h;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, this.w, this.h);
        let dataURL = canvas.toDataURL("image/png");
        return dataURL;
      },
      // 关闭弹窗
      cancel() {
        this.$emit('cancelCreatePoster')
      },
      nextButton() {
      },
      async fnInvite() {
        let dataurl =
          "data:image/png;base64," +
          this.arrayBufferToBase64(qr.imageSync(this.getQrUrl(), {margin: 2}));
        let qrImg = new Image(); // 背景图片对象
        qrImg.src = this.base64; // 背景 base64 链接码
        let qrImgs = new Image(); // 创建二维码图片对象
        qrImgs.src = dataurl; // 二维码 base64 链接码
        let goodsImg = "";
        goodsImg = document.querySelector(".goodsImg" + this.listindex);
        goodsImg.src = this.base64; // 网络图片地址
        // 开始绘制
        goodsImg.onload = () => {
          setTimeout(() => {
            let canvas = document.getElementById("mycanvas");
            let ctx = canvas.getContext("2d", {
              antialias: true, // 是画质更清晰  其他配置可以参考文档
            });
            let rowData = this.list[this.listindex]
            ctx.drawImage(qrImg, 0, 0, this.w, this.h); // 绘制商品图片
            ctx.drawImage(qrImgs, rowData.offsetX, rowData.offsetY, rowData.qrcodeWidth, rowData.qrcodeHeight); // 绘制二维码
            this.Url = document.getElementById("mycanvas").toDataURL(); // 转base64
            // 下载
            let dload = document.createElement("a");
            dload.href = this.Url;
            dload.download = ""; // 设置下载的文件名，默认是'下载'
            document.body.appendChild(dload);
            dload.click();
            dload.remove();
          }, 100);
        };
      },
      arrayBufferToBase64(array) {
        var binary = "";
        for (var len = array.byteLength, i = 0; i < len; i++) {
          binary += String.fromCharCode(array[i]);
        }
        return window.btoa(binary).replace(/=/g, "");
      },
    },
  }
</script>

<style>
  /*@import url("swiper/dist/css/swiper.min.css");*/
  /*@import url("swiper/dist/js/swiper.min");*/

  .swiper-container {
    height: 360px;
    width: 920px;
  }

  .swiper-slide {

    width: 100%;
    height: 100%;
    /*background-color: #42b983;*/
    text-align: center;
    line-height: 500px;
  }

  .active {
    /*border: 6px solid #4ec7ff;*/
    background-color: #4ec7ff;
  }

  .position {
    position: fixed;
    bottom: -1800px;
    left: -1800px;
  }

  .goodsImg {
    padding: 6px;
    width: 94%;
    height: 96%;
  }
</style>
