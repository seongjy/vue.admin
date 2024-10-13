// https://ko.vitejs.dev/guide/features.html#glob-import 참고
const modules = import.meta.glob("@/components/icons/**.vue", { eager: true });

const components = (function () {
  const components = {};
  for (const path in modules) {
    const componentName = path.split("/").at(-1).split(".")[0];
    components[componentName] = modules[path].default;
  }
  return components;
})();

export default components;
/**
 * 파일명 그대로 컴포넌트명으로 쓰기 때문에 명시적인 이름을 사용하는 것이 좋습니다.
 * [ 사용 예시 ]
 * import Icon from "@/components/icons";
 * <Icon.Logo />
 */
