<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg,
    }"
  >
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <!--        <img v-if="userTitle.logo" :src="userTitle.logo" class="sidebar-logo">-->
        <!--        <h1 v-else class="sidebar-title">{{userTitle.logoTitle}} aaaa </h1>-->
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ userTitle.logoTitle }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!--        <img v-if="userTitle.logo" :src="userTitle.logo" class="sidebar-logo">-->
        <!--        <h1 class="sidebar-title">{{userTitle.logoTitle}}bbb</h1>-->
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ userTitle.logoTitle }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from "@/assets/logo/logo.png";
import { getInfo } from "@/api/system/info";
import variables from "@/assets/styles/variables.scss";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    userTitle() {
      let { title, icon } = this.$store.state.user.title;
      document.title = title;
      this.href(icon);
      return this.$store.state.user.title;
    },
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    },
  },
  mounted() {
    // 获取icon和标题
    getInfo().then((response) => {
      if (response.data) {
        let { logoTitle, logo, title, icon } = response.data;
        this.$store.state.user.title = { logoTitle, logo, title, icon };
        // console.log( response.data,response.data.logo)
        this.title = response.data.logoTitle;
        this.logo = response.data.logo;
      }
    });
  },
  data() {
    return {
      title: "后台管理系统",
      logo: "https://vo.bbazxw.com/bbazxw/file/image/%E7%B2%A4%E4%B8%BA%E7%A7%91%E6%8A%80logo%E5%9B%BE%E6%A0%87%EF%BC%88%E7%99%BD%E5%BA%95%EF%BC%89.png",
    };
  },
  methods: {
    href(url) {
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      // link.type = "image/x-icon";
      link.rel = "icon";
      link.href = url; //icon图标
      // console.log(document.getElementsByTagName("head")[0], '===========');
      // document.getElementsByTagName("head")[0].appendChild(link);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
