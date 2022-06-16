const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '雪球的大书库',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Datahub',
        link: '/datahub/',
      },
      {
        text: 'Ttmall项目实战',
        link: '/ttmall/',
      },
    ],
    sidebar: {
      '/datahub/': [
        {
          title: 'Datahub',
          collapsable: false,
          children: [
            '',
            'Datahub入门',
            '元数据摄入',
            'Modeling - 建造模型',
          ]
        }
      ],
      '/ttmall/': [
        {
          title: 'Ttmall项目实战',
          collapsable: true,
          children: [
            '',
            '00',
            '1.环境',
            '2.前端基础',
            '3.配置网关路由与路径重写',
            '4.跨域',
            '5.文件存储',
            '6.前端校验',
            '7.后端校验（JSR303）',
            '8.商品服务-[概念]SPU&SKU&规格参数&销售属性',
            '9.分页-MyBatis Plus分页插件',
            '10.Object划分',
            '11.分层逻辑',
            '12.会员服务接口调试-ttmall-member',
            '13.开启远程调用product - coupon',
            '14.Elasticsearch - 全文检索',
            '15.Feign执行流程',
            '16.项目微服务',
            '17.Nginx+Widowns搭建域名访问环境',
            '18.压力测试',
            '19.缓存',
            '20.异步&线程池',
            '21.商城业务 - 商品详情',
            '22.RabbitMQ',
            '23.视图映射',
            '24.订单服务',
            '25.分布式事务',
            '26.内网穿透',
            '27.秒杀 - Sentinel',
            '28.定时任务',
            '29.集群部署 - kubernaters',
            '30.集群部署 - kubersphere',
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
