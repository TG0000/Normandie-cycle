"""Cache the actual public Specialized photographs locally with TLS verification."""
from pathlib import Path
import subprocess, io
from PIL import Image
root=Path(__file__).resolve().parents[1]
# URLs match the photographed model and views on the manufacturer product page.
base='https://resources.specialized.com/image/94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM'
views={'sl9-side':'HERO-PDP','sl9-front':'FDSQ','sl9-rear':'RDSQ','sl9-cockpit':'D1-POV','sl9-head':'D3-HT','sl9-frame':'D4-STTT'}
urls={k:f'{base}_{v}_DARK?w=2000&h=1125&fit=fill&crop=focalpoint' for k,v in views.items()}
urls['sl9-racing']='https://resources.specialized.com/images/b451zfdu/production/09d5fa96ec01fe7a866a72dcb03edeb8afc11bae-3000x1267.webp?w=2400&h=1013&fit=fill&crop=focalpoint'
urls['sl9-red']='https://resources.specialized.com/image/94927-07_TARMAC-SL9-SW-AXS-RBYMET-METWHTSIL_HERO-PDP_DARK?w=2000&h=1125&fit=fill&crop=focalpoint'
urls['diverge']='https://resources.specialized.com/image/95427-00_DIVERGE-SW-WRMSMKMET-CARB-SILDST_HERO-PDP_DARK?w=1600&h=900&fit=fill&crop=focalpoint'
urls['levo']='https://resources.specialized.com/image/95226-08_LEVO-X-SW-G4-FRYRED-BLK_HERO-PDP_DARK?w=1600&h=900&fit=fill&crop=focalpoint'
failures=[]
for name,url in urls.items():
 try:
  data=subprocess.run(['curl','--fail','--silent','--show-error','--location','--max-time','25',url],check=True,capture_output=True).stdout
  im=Image.open(io.BytesIO(data));im.save(root/'src'/'assets'/f'{name}.webp',quality=91)
  print(f'{name}: {im.size}, vérifié et enregistré')
 except Exception as e:
  failures.append(name); print(f'{name}: {type(e).__name__}: {e}')
if failures:raise SystemExit(1)
