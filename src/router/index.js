import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: resolve => require(["@/views/redirect"], resolve)
      }
    ]
  },
  {
    path: "/login",
    component: resolve => require(["@/views/login"], resolve),
    hidden: true
  },
  {
    path: "/404",
    component: resolve => require(["@/views/error/404"], resolve),
    hidden: true
  },
  {
    path: "/401",
    component: resolve => require(["@/views/error/401"], resolve),
    hidden: true
  },
  {
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: resolve => require(["@/views/index"], resolve),
        name: "首页",
        meta: { title: "首页", icon: "dashboard", noCache: true, affix: true }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    hidden: true,
    redirect: "noredirect",
    children: [
      {
        path: "profile",
        component: resolve =>
          require(["@/views/system/user/profile/index"], resolve),
        name: "Profile",
        meta: { title: "个人中心", icon: "user" }
      }
    ]
  },
  {
    path: "/dict",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "type/data/:dictId(\\d+)",
        component: resolve => require(["@/views/system/dict/data"], resolve),
        name: "Data",
        meta: { title: "字典数据", icon: "" }
      }
    ]
  },
  {
    path: "/questions",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "questions/:prefaceId(\\d+)/:pid(\\d+)/:examinationPid(\\d+)",
        component: resolve =>
          require(["@/views/exam/questions/index"], resolve),
        name: "Questions",
        meta: { title: "试题管理", icon: "" }
      }
    ]
  },
  {
    path: "/zhangjie",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "examination/:prefaceId(\\d+)",
        component: resolve =>
          require(["@/views/exam/examination/index"], resolve),
        name: "Zhangjie",
        meta: { title: "章节管理", icon: "" }
      }
    ]
  },
  {
    path: "/xiaojie",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "questions/:prefaceId(\\d+)/:pid(\\d+)",
        component: resolve =>
          require(["@/views/exam/examination/sindex"], resolve),
        name: "Xiaojie",
        meta: { title: "小节管理", icon: "" }
      }
    ]
  },
  {
    path: "/apply",
    component: Layout,
    hidden: true,
    children: [
      {
        component: resolve => require(["@/views/apply/topic/index"], resolve),
        hidden: false,
        meta: { title: "课题管理", icon: "dict" },
        name: "Topic",
        path: "topic"
      }
    ]
  },
  {
    path: "/apply",
    component: Layout,
    hidden: true,
    children: [
      {
        component: resolve => require(["@/views/apply/period/index"], resolve),
        hidden: false,
        meta: { title: "期次管理", icon: "dict" },
        name: "Period",
        path: "period"
      }
    ]
  },
  {
    path: "/train",
    component: Layout,
    hidden: true,
    children: [
      {
        component: resolve =>
          require(["@/views/apply/periodDistribution/index"], resolve),
        hidden: false,
        meta: { title: "分销期次列表", icon: "" },
        name: "PeriodDistribution",
        path: "periodDistribution"
      },
      {
        component: resolve =>
          require(["@/views/apply/periodTenant/index"], resolve),
        hidden: false,
        meta: { title: "租户期次列表", icon: "" },
        name: "PeriodTenant",
        path: "periodTenant"
      },
      {
        component: resolve =>
          require(["@/views/apply/userInfo/index"], resolve),
        hidden: false,
        meta: { title: "租户人员管理", icon: "" },
        name: "UserInfo",
        path: "userInfo"
      },
      {
        component: resolve =>
          require(["@/views/apply/distributionUserInfo/index"], resolve),
        hidden: false,
        meta: { title: "分销商人员管理", icon: "" },
        name: "DistributionUserInfo",
        path: "distributionUserInfo"
      }
    ]
  },
  {
    path: "/finance",
    component: Layout,
    hidden: true,
    children: [
      {
        component: resolve =>
          require(["@/views/apply/distributorAccount/index"], resolve),
        hidden: false,
        meta: { title: "结算管理", icon: "" },
        name: "DistributorAccount",
        path: "distributorAccount"
      }
    ]
  },
  {
    path: "/problem",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "problem/:problemId(\\d+)",
        component: resolve =>
          require(["@/views/exam/questions/index"], resolve),
        name: "Problem",
        meta: { title: "案例小题管理", icon: "" }
      }
    ]
  },
  {
    path: "/monitor/job-log",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index",
        component: resolve => require(["@/views/monitor/job/log"], resolve),
        name: "JobLog",
        meta: { title: "调度日志", activeMenu: "/monitor/job" }
      }
    ]
  },
  {
    path: "/tool/gen-edit",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "index/:tableId(\\d+)",
        component: resolve => require(["@/views/tool/gen/editTable"], resolve),
        name: "GenEdit",
        meta: { title: "修改生成配置", activeMenu: "/tool/gen" }
      }
    ]
  },

  {
    path: "/courseSection",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "section/:chapterId(\\d+)",
        component: resolve =>
          require(["@/views/course/section/index"], resolve),
        name: "sectionData",
        meta: { title: "小节", icon: "" }
      }
    ]
  },

  {
    path: "/subjectClass",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "class/:subjectId(\\d+)",
        component: resolve => require(["@/views/course/class/index"], resolve),
        name: "classData",
        meta: { title: "所属班级", icon: "" }
      }
    ]
  },

  {
    path: "/specialClass",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "class/:specialId(\\d+)",
        component: resolve =>
          require(["@/views/course/special/specialClass"], resolve),
        name: "classData",
        meta: { title: "专题班级", icon: "" }
      }
    ]
  },

  {
    path: "/chapter",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "chapter/:subjectId(\\d+)",
        component: resolve =>
          require(["@/views/course/chapter/index"], resolve),
        name: "Chapter",
        meta: { title: "课程章节", icon: "" }
      }
    ]
  },

  {
    path: "/subjectUser",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "subjectUser/:subjectId(\\d+)",
        component: resolve =>
          require(["@/views/course/subjectUser/index"], resolve),
        name: "subjectUserData",
        meta: { title: "人员管理", icon: "" }
      }
    ]
  },

  {
    path: "/specialUser",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "specialUser/:specialId(\\d+)",
        component: resolve =>
          require(["@/views/course/specialUser/index"], resolve),
        name: "specialUserData",
        meta: { title: "人员管理", icon: "" }
      }
    ]
  },

  {
    path: "/audit",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "auditlog/:id",
        component: resolve =>
          require(["@/views/course/auditlog/detail"], resolve),
        name: "audit",
        meta: { title: "审核学习记录", icon: "" }
      }
    ]
  },

  {
    path: "/audit/details",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "details/:id",
        component: resolve =>
          require(["@/views/course/auditlog/details"], resolve),
        name: "details",
        meta: { title: "作弊记录", icon: "" }
      }
    ]
  },
  {
    path: "/discountrelevance",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "discountrelevance/:discountId(\\d+)",
        component: resolve =>
          require(["@/views/course/discountrelevance/index"], resolve),
        name: "Discountrelevance",
        meta: { title: "关联产品", icon: "" }
      }
    ]
  }
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});
