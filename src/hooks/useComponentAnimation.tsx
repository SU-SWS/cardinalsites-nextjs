import {useSessionStorage} from "usehooks-ts"

export type ComponentAnimationSettings = {
  statCard: boolean
}

export const useComponentAnimation = () => {
  const [settings] = useSessionStorage<ComponentAnimationSettings>("component-animations", {statCard: true})

  const isEnabled = (component: keyof ComponentAnimationSettings) => {
    return settings[component]
  }

  return {
    isEnabled,
    settings,
  }
}
