// vite.config.ts
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "file:///Users/seongjy72/Documents/workspaces/master-admin-test/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/seongjy72/Documents/workspaces/master-admin-test/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import Components from "file:///Users/seongjy72/Documents/workspaces/master-admin-test/node_modules/unplugin-vue-components/dist/vite.js";
import { AntDesignVueResolver } from "file:///Users/seongjy72/Documents/workspaces/master-admin-test/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_import_meta_url = "file:///Users/seongjy72/Documents/workspaces/master-admin-test/vite.config.ts";
var vite_config_default = defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };
  // console.log(process.env);
  return {
    mode: process.env.VITE_USER_NODE_ENV,
    plugins: [
      vue(),
      splitVendorChunkPlugin(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      })
    ],
    resolve: {
      alias: [
        { find: "@", replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)) },
        { find: "@compositions", replacement: fileURLToPath(new URL("./src/compositions", __vite_injected_original_import_meta_url)) },
        { find: "@components", replacement: fileURLToPath(new URL("./src/components", __vite_injected_original_import_meta_url)) },
        { find: "@types", replacement: fileURLToPath(new URL("./src/types", __vite_injected_original_import_meta_url)) },
        { find: "@constants", replacement: fileURLToPath(new URL("./src/constants", __vite_injected_original_import_meta_url)) },
        { find: "@api", replacement: fileURLToPath(new URL("./src/api", __vite_injected_original_import_meta_url)) },
        { find: "@stores", replacement: fileURLToPath(new URL("./src/stores", __vite_injected_original_import_meta_url)) },
        { find: "@views", replacement: fileURLToPath(new URL("./src/views", __vite_injected_original_import_meta_url)) }
      ]
    },
    define: {
      __APP_ENV__: JSON.stringify(process.env.APP_ENV)
      // COOPERATE_API_AUTH_KEY: `cooperate_api_token_env${ApiKeyName}${serviceSectionNo}`,
      // ADMIN_API_V1_KEY: `Basic admin_api_v1_token_env${ApiKeyName}${serviceSectionNo}`,
    },
    build: {
      outDir: "build",
      sourcemap: true,
      chunkSizeWarningLimit: 300,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          chunkFileNames: "[hash:10].js",
          compact: true,
          sourcemapExcludeSources: true,
          minifyInternalExports: true
        }
      },
      modulePreload: {
        polyfill: true
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2VvbmdqeTcyL0RvY3VtZW50cy93b3Jrc3BhY2VzL21hc3Rlci1hZG1pbi10ZXN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2VvbmdqeTcyL0RvY3VtZW50cy93b3Jrc3BhY2VzL21hc3Rlci1hZG1pbi10ZXN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zZW9uZ2p5NzIvRG9jdW1lbnRzL3dvcmtzcGFjZXMvbWFzdGVyLWFkbWluLXRlc3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYsIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBBbnREZXNpZ25WdWVSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSB7IC4uLnByb2Nlc3MuZW52LCAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKSB9XG4gIGNvbnNvbGUubG9nKHByb2Nlc3MuZW52KVxuICAvKmNvbnN0IEFwaUtleU5hbWUgPVxuICAgIHtcbiAgICAgIGRldmVsb3BtZW50OiAnbG9jYWwnLFxuICAgICAgcHJvZHVjdGlvbjogJ3Byb2QnLFxuICAgIH1bcHJvY2Vzcy5lbnYuQVBQX0VOVl0gfHwgcHJvY2Vzcy5lbnYuQVBQX0VOVlxuXG4gIGNvbnN0IHNlcnZpY2VTZWN0aW9uTm8gPSAxICovXG4gIHJldHVybiB7XG4gICAgbW9kZTogcHJvY2Vzcy5lbnYuVklURV9VU0VSX05PREVfRU5WLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSgpLFxuICAgICAgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIEFudERlc2lnblZ1ZVJlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiBmYWxzZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IFtcbiAgICAgICAgeyBmaW5kOiAnQCcsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcbiAgICAgICAgeyBmaW5kOiAnQGNvbXBvc2l0aW9ucycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2NvbXBvc2l0aW9ucycsIGltcG9ydC5tZXRhLnVybCkpIH0sXG4gICAgICAgIHsgZmluZDogJ0Bjb21wb25lbnRzJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvY29tcG9uZW50cycsIGltcG9ydC5tZXRhLnVybCkpIH0sXG4gICAgICAgIHsgZmluZDogJ0B0eXBlcycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3R5cGVzJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcbiAgICAgICAgeyBmaW5kOiAnQGNvbnN0YW50cycsIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL2NvbnN0YW50cycsIGltcG9ydC5tZXRhLnVybCkpIH0sXG4gICAgICAgIHsgZmluZDogJ0BhcGknLCByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYy9hcGknLCBpbXBvcnQubWV0YS51cmwpKSB9LFxuICAgICAgICB7IGZpbmQ6ICdAc3RvcmVzJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvc3RvcmVzJywgaW1wb3J0Lm1ldGEudXJsKSkgfSxcbiAgICAgICAgeyBmaW5kOiAnQHZpZXdzJywgcmVwbGFjZW1lbnQ6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvdmlld3MnLCBpbXBvcnQubWV0YS51cmwpKSB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgX19BUFBfRU5WX186IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52LkFQUF9FTlYpLFxuICAgICAgLy8gQ09PUEVSQVRFX0FQSV9BVVRIX0tFWTogYGNvb3BlcmF0ZV9hcGlfdG9rZW5fZW52JHtBcGlLZXlOYW1lfSR7c2VydmljZVNlY3Rpb25Ob31gLFxuICAgICAgLy8gQURNSU5fQVBJX1YxX0tFWTogYEJhc2ljIGFkbWluX2FwaV92MV90b2tlbl9lbnYke0FwaUtleU5hbWV9JHtzZXJ2aWNlU2VjdGlvbk5vfWAsXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAzMDAsXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogdHJ1ZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdbaGFzaDoxMF0uanMnLFxuICAgICAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICAgICAgc291cmNlbWFwRXhjbHVkZVNvdXJjZXM6IHRydWUsXG4gICAgICAgICAgbWluaWZ5SW50ZXJuYWxFeHBvcnRzOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgICAgcG9seWZpbGw6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH1cbn0pXG4vKipcbiAqIChcdUFENkMpXHVDNUI0XHVCNERDXHVCQkZDIFVSTCBcdUI1MzBcdUI3N0NcdUFDMDggXHVBQzgzXG4gKi9cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxjQUFjLFNBQVMsOEJBQThCO0FBQ3JaLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWUsV0FBVztBQUNuQyxPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDRCQUE0QjtBQUppTCxJQUFNLDJDQUEyQztBQU92USxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxVQUFRLE1BQU0sRUFBRSxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDcEUsVUFBUSxJQUFJLFFBQVEsR0FBRztBQVF2QixTQUFPO0FBQUEsSUFDTCxNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ2xCLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLHVCQUF1QjtBQUFBLE1BQ3ZCLFdBQVc7QUFBQSxRQUNULFdBQVc7QUFBQSxVQUNULHFCQUFxQjtBQUFBLFlBQ25CLGFBQWE7QUFBQSxVQUNmLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsRUFBRSxNQUFNLEtBQUssYUFBYSxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUMsRUFBRTtBQUFBLFFBQzNFLEVBQUUsTUFBTSxpQkFBaUIsYUFBYSxjQUFjLElBQUksSUFBSSxzQkFBc0Isd0NBQWUsQ0FBQyxFQUFFO0FBQUEsUUFDcEcsRUFBRSxNQUFNLGVBQWUsYUFBYSxjQUFjLElBQUksSUFBSSxvQkFBb0Isd0NBQWUsQ0FBQyxFQUFFO0FBQUEsUUFDaEcsRUFBRSxNQUFNLFVBQVUsYUFBYSxjQUFjLElBQUksSUFBSSxlQUFlLHdDQUFlLENBQUMsRUFBRTtBQUFBLFFBQ3RGLEVBQUUsTUFBTSxjQUFjLGFBQWEsY0FBYyxJQUFJLElBQUksbUJBQW1CLHdDQUFlLENBQUMsRUFBRTtBQUFBLFFBQzlGLEVBQUUsTUFBTSxRQUFRLGFBQWEsY0FBYyxJQUFJLElBQUksYUFBYSx3Q0FBZSxDQUFDLEVBQUU7QUFBQSxRQUNsRixFQUFFLE1BQU0sV0FBVyxhQUFhLGNBQWMsSUFBSSxJQUFJLGdCQUFnQix3Q0FBZSxDQUFDLEVBQUU7QUFBQSxRQUN4RixFQUFFLE1BQU0sVUFBVSxhQUFhLGNBQWMsSUFBSSxJQUFJLGVBQWUsd0NBQWUsQ0FBQyxFQUFFO0FBQUEsTUFDeEY7QUFBQSxJQUNGO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixhQUFhLEtBQUssVUFBVSxRQUFRLElBQUksT0FBTztBQUFBO0FBQUE7QUFBQSxJQUdqRDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsdUJBQXVCO0FBQUEsTUFDdkIsc0JBQXNCO0FBQUEsTUFDdEIsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsVUFDaEIsU0FBUztBQUFBLFVBQ1QseUJBQXlCO0FBQUEsVUFDekIsdUJBQXVCO0FBQUEsUUFDekI7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
