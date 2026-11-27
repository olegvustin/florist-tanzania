#!/usr/bin/env python3
"""Apply material-aware seating only when one of the three presets is applied."""
from pathlib import Path
p=Path('index.html')
s=p.read_text('utf-8')
needle='function ftz215SeatHarmony('
if needle in s:
    raise SystemExit(0)
def once(old,new):
    global s
    assert s.count(old)==1,old
    s=s.replace(old,new,1)
once('(function installFTZ193(){',
     Path('features/harmony-seating-v215.js').read_text('utf-8')+'\n(function installFTZ193(){')
once('      return result;\n    }catch(err){console.warn(\'FTZ195 solve:',
     '''      return !isb&&style>=0&&style<=2
        ? ftz215SeatHarmony(result,chosen(),$('wrap')?.value)
        : result;
    }catch(err){console.warn('FTZ195 solve:''')
once('    if(!enabled||solving||!ready())return original.harmony(variant);',
     '''    if(solving||!ready())return original.harmony(variant);
    if(!enabled){
      const preset=original.harmony(variant);
      return !basket()&&variant>=0&&variant<=2
        ? ftz215SeatHarmony(preset,chosen(),$('wrap')?.value)
        : preset;
    }''')
once('Цветы Африки v0.15.206 · исправлена сцена вручения корзины</title>','Цветы Африки v0.15.215</title>')
p.write_text(s,'utf-8')
