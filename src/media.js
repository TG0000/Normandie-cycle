const root = "https://resources.specialized.com";
const base = "94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM";
export const sources = {
  diverge: `${root}/image/95427-00_DIVERGE-SW-WRMSMKMET-CARB-SILDST_HERO-PDP_DARK?w=1600&h=900&fit=fill&crop=focalpoint`,
  levo: `${root}/image/95226-08_LEVO-X-SW-G4-FRYRED-BLK_HERO-PDP_DARK?w=1600&h=900&fit=fill&crop=focalpoint`,
  "sl9-side": `${root}/image/${base}_HERO-PDP_DARK?w=2400&h=1350&fit=fill&crop=focalpoint`,
  "sl9-front": `${root}/image/${base}_FDSQ_DARK?w=2000&h=1125&fit=fill&crop=focalpoint`,
  "sl9-rear": `${root}/image/${base}_RDSQ_DARK?w=2000&h=1125&fit=fill&crop=focalpoint`,
  "sl9-cockpit": `${root}/image/${base}_D1-POV_DARK?w=1600&h=900&fit=fill&crop=focalpoint`,
  "sl9-head": `${root}/image/${base}_D3-HT_DARK?w=1600&h=900&fit=fill&crop=focalpoint`,
  "sl9-frame": `${root}/image/${base}_D4-STTT_DARK?w=1600&h=900&fit=fill&crop=focalpoint`,
  "sl9-racing": `${root}/images/b451zfdu/production/09d5fa96ec01fe7a866a72dcb03edeb8afc11bae-3000x1267.webp?w=2400&h=1013&fit=fill&crop=focalpoint`,
  "sl9-red": `${root}/image/94927-07_TARMAC-SL9-SW-AXS-RBYMET-METWHTSIL_HERO-PDP_DARK?w=2000&h=1125&fit=fill&crop=focalpoint`,
};
const local = import.meta.glob("./assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
export const media = (name) => local[`./assets/${name}.webp`] || sources[name];
export const sl9Url =
  "https://www.specialized.com/fr/fr/s-works-tarmac-sl9-sram-red-axs/p/4293533";
