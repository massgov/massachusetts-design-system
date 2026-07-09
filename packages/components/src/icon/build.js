import { readIconSvgMap } from '../../scripts/icon-registry.js';

export async function getRendererOptions() {
  return {
    iconSvgMap: await readIconSvgMap()
  };
}
