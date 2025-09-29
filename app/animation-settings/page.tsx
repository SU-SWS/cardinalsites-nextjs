"use client"

import Button from "@components/elements/button"
import {H1, H2} from "@components/elements/headers"
import clsx from "clsx"
import {useSessionStorage} from "usehooks-ts"
import {ComponentAnimationSettings} from "@hooks/useComponentAnimation"

// Default settings
const defaultSettings: ComponentAnimationSettings = {
  statCard: true,
}

const componentCategories = {
  Content: ["statCard"],
} as const

const ComponentToggle = ({
  enabled,
  onToggle,
  componentName,
  description,
  id,
}: {
  enabled: boolean
  onToggle: () => void
  componentName: string
  description: string
  id: string
}) => (
  <div className="flex items-center justify-between rounded-lg bg-fog-light p-6">
    <div>
      <label htmlFor={id} className="mb-0 cursor-pointer font-medium capitalize">
        {componentName}
      </label>
      <div id={`${id}-description`} className="mb-0 text-stone-dark">
        {description}
      </div>
    </div>
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={enabled}
        onChange={onToggle}
        aria-describedby={`${id}-description`}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={clsx(
          "relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full transition-colors",
          "peer-focus:ring-2 peer-focus:ring-digital-blue peer-focus:ring-offset-2",
          {
            "bg-digital-blue": enabled,
            "bg-stone-dark": !enabled,
          }
        )}
      >
        <span className="sr-only">
          {enabled ? "Disable" : "Enable"} {componentName}
        </span>
        <span
          className={clsx("inline-block h-6 w-6 transform rounded-full bg-white transition-transform", {
            "translate-x-7": enabled,
            "translate-x-1": !enabled,
          })}
          aria-hidden="true"
        />
      </label>
    </div>
  </div>
)

export default function ComponentAnimationPage() {
  const [componentSettings, setComponentSettings] = useSessionStorage<ComponentAnimationSettings>(
    "component-animations",
    defaultSettings
  )

  const toggleComponent = (component: keyof ComponentAnimationSettings) => {
    setComponentSettings(prev => ({
      ...prev,
      [component]: !prev[component],
    }))
  }

  const enableAll = () => {
    const allEnabled = Object.keys(defaultSettings).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {} as ComponentAnimationSettings
    )
    setComponentSettings(allEnabled)
  }

  const disableAll = () => {
    const allDisabled = Object.keys(defaultSettings).reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {} as ComponentAnimationSettings
    )
    setComponentSettings(allDisabled)
  }

  const resetToDefaults = () => {
    setComponentSettings(defaultSettings)
  }

  const componentDescriptions: Record<keyof ComponentAnimationSettings, string> = {
    statCard: "Stat number count-up animations",
  }

  // Count enabled components
  const enabledCount = Object.values(componentSettings).filter(Boolean).length
  const totalCount = Object.keys(componentSettings).length

  return (
    <div className="cc min-h-screen">
      <div>
        <H1 className="type-4 centered mt-32">Component Animations</H1>
        <p>Toggle animations for individual components.</p>

        <div className="mb-8 inline-flex items-center rounded-full bg-digital-blue/20 px-8 py-4 text-21 text-black">
          <span className="mr-3 h-5 w-5 rounded-full bg-digital-blue"></span>
          {enabledCount} of {totalCount} components have animations enabled
        </div>
      </div>

      <div className="rs-mb-1 flex items-center gap-20">
        <H2 className="mb-0">Quick Actions</H2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={enableAll} className="rounded-lg">
            Enable All Components
          </Button>
          <Button onClick={disableAll} secondary className="rounded-lg">
            Disable All Components
          </Button>
          <Button onClick={resetToDefaults} className="rounded-lg bg-gray-600 hover:bg-gray-700">
            Reset to Defaults
          </Button>
        </div>
      </div>

      {Object.entries(componentCategories).map(([category, components]) => (
        <div key={category} className="mb-6 rounded-lg">
          <H2 className="font-semibold text-gray-900">{category} Components</H2>
          <div>
            {components.map(component => (
              <ComponentToggle
                key={component}
                enabled={componentSettings[component]}
                onToggle={() => toggleComponent(component)}
                componentName={component}
                description={componentDescriptions[component]}
                id={`toggle-${component}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
