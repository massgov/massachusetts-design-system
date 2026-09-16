// url=https://www.figma.com/design/D5Ju48AoqIXmdCopPwBr6N/Core-Components?node-id=924-22414&t=TD9KWAqxGi8t9BmU-0
import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Fill: 'fill',
  Outline: 'outline',
  Ghost: 'ghost'
})
const color = instance.getEnum('Color', {
  Primary: 'primary',
  Secondary: 'secondary',
  White: 'white',
  Danger: 'danger'
})
const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'hover',
  Active: 'active',
  Disabled: 'disabled',
  Loading: 'loading'
})

// The Figma component does not expose text or size as component properties.
// `md` is the public-code default, and hover/active are CSS pseudo-states.
const disabled = state === 'disabled'

export default {
  id: 'massds-button',
  example: figma.html`
<link rel="stylesheet" href="@massds/mds-components/button.css">

<button
  class="mds-button mds-button--type-${type} mds-button--color-${color} mds-button--size-md"
  type="button"
  data-mds-button${disabled ? ' disabled' : ''}
>
  <span class="mds-button__label">Button</span>
</button>
`
}
