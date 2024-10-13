import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  console.log('VITE_ADMIN_API_V2', process.env.VITE_ADMIN_API_V2)
  /*const ApiKeyName =
    {
      development: 'local',
      production: 'prod',
    }[process.env.APP_ENV] || process.env.APP_ENV

  const serviceSectionNo = 1 */
  return {
    mode: process.env.VITE_USER_NODE_ENV,
    plugins: [
      vue(),
      splitVendorChunkPlugin(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
          }),
        ],
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        { find: '@compositions', replacement: fileURLToPath(new URL('./src/compositions', import.meta.url)) },
        { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
        { find: '@types', replacement: fileURLToPath(new URL('./src/types', import.meta.url)) },
        { find: '@constants', replacement: fileURLToPath(new URL('./src/constants', import.meta.url)) },
        { find: '@api', replacement: fileURLToPath(new URL('./src/api', import.meta.url)) },
        { find: '@stores', replacement: fileURLToPath(new URL('./src/stores', import.meta.url)) },
        { find: '@views', replacement: fileURLToPath(new URL('./src/views', import.meta.url)) },
      ],
    },
    define: {
      __APP_ENV__: JSON.stringify(process.env.APP_ENV),
      // COOPERATE_API_AUTH_KEY: `cooperate_api_token_env${ApiKeyName}${serviceSectionNo}`,
      // ADMIN_API_V1_KEY: `Basic admin_api_v1_token_env${ApiKeyName}${serviceSectionNo}`,
    },
    build: {
      outDir: 'build',
      sourcemap: true,
      chunkSizeWarningLimit: 300,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          chunkFileNames: '[hash:10].js',
          compact: true,
          sourcemapExcludeSources: true,
          minifyInternalExports: true,
        },
      },
      modulePreload: {
        polyfill: true,
      },
    },
  }
})
/**
 * (구)어드민 URL 따라갈 것
 */
