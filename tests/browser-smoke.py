import asyncio,json,os
from pathlib import Path
ARTIFACTS=Path(os.environ.get("ARTIFACT_DIR","/tmp/normandie-cycles-check"))
ARTIFACTS.mkdir(parents=True,exist_ok=True)
BASE_URL=os.environ.get("BASE_URL","http://127.0.0.1:4173/")
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=await b.new_page(viewport={'width':1440,'height':1000})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(BASE_URL,wait_until='networkidle')
  await page.wait_for_timeout(800)
  assert await page.locator('.product-view.active').evaluate('(el)=>el.complete && el.naturalWidth>=1500')
  await page.screenshot(path=str(ARTIFACTS/'v2-hero.png'))
  await page.get_by_role('button',name='Profil',exact=True).click()
  assert await page.get_by_role('button',name='Profil',exact=True).get_attribute('aria-pressed')=='true'
  await page.get_by_role('button',name='Vue suivante du Tarmac SL9').click()
  assert await page.get_by_role('button',name='Trois-quarts avant',exact=True).get_attribute('aria-pressed')=='true'
  await page.get_by_role('button',name='Agrandir la photographie du Tarmac SL9').click()
  assert await page.locator('.image-dialog').is_visible()
  await page.keyboard.press('Escape')
  assert await page.locator('.image-dialog').count()==0
  await page.get_by_role('button',name='Découvrir mon projet gravel').click()
  assert await page.locator('select[name=interest]').input_value()=='Gravel'
  await page.get_by_label('Votre prénom').fill('Camille')
  await page.get_by_label('Votre e-mail').fill('camille@example.fr')
  await page.get_by_label('Un peu plus sur votre envie').fill('Je souhaite découvrir votre gamme gravel en magasin.')
  await page.get_by_label('J’accepte').check()
  await page.route('**/api/contact',lambda route:route.fulfill(status=503,content_type='application/json',body='{}'))
  await page.get_by_role('button',name='Envoyer mon message').click()
  await page.get_by_role('alert').wait_for()
  assert await page.get_by_role('alert').get_by_role('link',name='Appeler le magasin').get_attribute('href')=='tel:+33973588211'
  await page.keyboard.press('Escape')
  await page.get_by_role('button',name='Le S-Works Tarmac SL9 est-il disponible au magasin ?').click()
  assert await page.get_by_text('Les photos présentées sont les vues officielles',exact=False).is_visible()
  for y in range(0,await page.evaluate('document.body.scrollHeight'),650):
   await page.evaluate('(y)=>window.scrollTo(0,y)',y);await page.wait_for_timeout(100)
  await page.evaluate('window.scrollTo(0,0)');await page.wait_for_timeout(800)
  await page.screenshot(path=str(ARTIFACTS/'v2-desktop.png'),full_page=True)
  assert await page.evaluate('document.documentElement.scrollWidth')==1440
  assert await page.locator('img').evaluate_all('(imgs)=>imgs.every(img=>img.complete && img.naturalWidth>0)')
  for width in [390,320,768]:
   await page.set_viewport_size({'width':width,'height':844});await page.evaluate('window.scrollTo(0,0)');await page.wait_for_timeout(400)
   assert await page.evaluate('document.documentElement.scrollWidth')==width,f'overflow {width}'
   if width==390:
    await page.get_by_role('button',name='Ouvrir le menu').click()
    await page.get_by_role('navigation',name='Navigation mobile').get_by_role('link',name='Le magasin').click()
    assert await page.get_by_role('navigation',name='Navigation mobile').count()==0
    await page.evaluate('window.scrollTo(0,0)');await page.wait_for_timeout(800)
    await page.screenshot(path=str(ARTIFACTS/'v2-mobile.png'),full_page=True)
  await page.emulate_media(reduced_motion='reduce')
  assert await page.locator('.reveal').first.evaluate('(el)=>getComputedStyle(el).opacity')=='1'
  assert not errors,errors
  print(json.dumps({'checks':'photos locales chargées, vues interactives, zoom, clavier, formulaire et secours téléphone, FAQ, mobile 320/390/768 px, desktop 1440 px, mouvement réduit','errors':errors},ensure_ascii=False))
  await b.close()
asyncio.run(main())
