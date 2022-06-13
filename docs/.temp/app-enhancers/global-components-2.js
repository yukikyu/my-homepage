import Vue from 'vue'
Vue.component("demo-component", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\src\\.vuepress\\components\\demo-component"))
Vue.component("OtherComponent", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\src\\.vuepress\\components\\OtherComponent"))
Vue.component("Foo-Bar", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\src\\.vuepress\\components\\Foo\\Bar"))
Vue.component("Badge", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\node_modules\\@vuepress\\theme-default\\global-components\\Badge"))
Vue.component("CodeBlock", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\node_modules\\@vuepress\\theme-default\\global-components\\CodeBlock"))
Vue.component("CodeGroup", () => import("E:\\Documents\\GitHub\\my-homepage\\docs\\node_modules\\@vuepress\\theme-default\\global-components\\CodeGroup"))


export default {}