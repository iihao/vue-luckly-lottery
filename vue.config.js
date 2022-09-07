/* eslint-disable no-undef */

const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// eslint-disable-next-line no-undef
module.exports = defineConfig({
	transpileDependencies: true,
	//其他配置....
	configureWebpack: {
		plugins: [
			AutoImport({
				resolvers: [ElementPlusResolver()],
			}),
			Components({
				resolvers: [ElementPlusResolver()],
			}),
		],
		
	}
})
