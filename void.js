// ==UserScript==
// @name         VOID
// @namespace    https://void.security
// @version      12.1
// @description  VOID – Shimmer + Neon + Drag Fix + 12 Lang Positive
// @author       VOID Security
// @match        https://plus.soroush-app.ir/*
// @match        https://web.soroush-app.ir/*
// @grant        window.open
// @grant        window.close
// ==/UserScript==

(async function() {
    'use strict';

    // ═══════════ STEALTH SHA-256 LOCK ═══════════
    async function _sha256(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input.trim());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    const _REAL_HASH = "94f77f89cb4aa3a844ccab8a182866e42355efada795eac540ed542b2a5121a8";
    
    async function _verify(input) {
        const hash = await _sha256(input);
        return hash === _REAL_HASH;
    }
    
    const lockOverlay = document.createElement('div');
    lockOverlay.id = 'void-demon-lock';
    lockOverlay.innerHTML = `
    <style>
        #void-demon-lock{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:2147483647;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;}
        #void-demon-lock .box{text-align:center;border:3px solid #f00;padding:50px 40px;border-radius:25px;background:#050000;box-shadow:0 0 60px #f006;animation:neonPulse 2s infinite alternate;}
        #void-demon-lock h1{color:#f00;font-size:32px;margin-bottom:25px;text-shadow:0 0 30px #f00;letter-spacing:8px;}
        #void-demon-lock .demon{font-size:50px;display:block;margin-bottom:10px;animation:floatDemon 2s ease-in-out infinite;}
        #void-demon-lock input{background:#000;border:2px solid #f00;color:#f00;font-size:22px;padding:12px 20px;text-align:center;border-radius:12px;outline:none;letter-spacing:5px;width:280px;font-family:'Orbitron',sans-serif;text-shadow:0 0 15px #f00;}
        #void-demon-lock .err{color:#f44;font-size:13px;margin-top:15px;}
        @keyframes neonPulse{0%{border-color:#f00;box-shadow:0 0 60px #f006}100%{border-color:#f44;box-shadow:0 0 80px #f44}}
        @keyframes floatDemon{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    </style>
    <div class="box">
        <span class="demon">😈</span>
        <h1>V O I D</h1>
        <input type="password" id="vp" placeholder="••••••••" maxlength="50" autofocus>
        <div class="err" id="ve"></div>
    </div>`;
    document.body.appendChild(lockOverlay);

    await new Promise(async (resolve) => {
        const input = document.getElementById('vp');
        const error = document.getElementById('ve');
        let tries = 0, locked = false;
        input.addEventListener('keydown', async (e) => {
            if (e.key !== 'Enter' || locked) return;
            if (await _verify(input.value)) {
                lockOverlay.style.opacity = '0';
                lockOverlay.style.transition = '0.5s';
                setTimeout(() => { lockOverlay.remove(); resolve(true); }, 500);
            } else {
                tries++;
                if (tries >= 5) {
                    locked = true;
                    error.textContent = '⛔ LOCKED 30s';
                    input.disabled = true;
                    setTimeout(() => { locked = false; tries = 0; input.disabled = false; input.value = ''; error.textContent = ''; }, 30000);
                } else {
                    error.textContent = '❌ WRONG (' + (5-tries) + ' left)';
                    input.value = '';
                }
            }
        });
    });

    console.log('😈 VOID – DEMON X READY');

    // ═══════════ GHOST WINDOW ═══════════
    let ghostWindow = null, ghostActive = false;
    function openGhostWindow() {
        if (ghostWindow && !ghostWindow.closed) return true;
        try {
            ghostWindow = window.open('about:blank','void_ghost_'+Date.now(),'width=1,height=1,left=-9999,top=-9999');
            if(!ghostWindow) return false;
            const gH = '<!DOCTYPE html><html><head><title>.</title></head><body><script>setInterval(()=>{document.title=Date.now()},5000);let c=new AudioContext(),o=c.createOscillator(),g=c.createGain();g.gain.value=0.001;o.connect(g);g.connect(c.destination);o.start();setInterval(()=>{window.opener&&window.opener.postMessage("ghost","*")},30000)</'+'script></body></html>';
            ghostWindow.document.write(gH);
            ghostWindow.document.close();
            ghostActive = true;
            return true;
        } catch(e) { return false; }
    }
    function closeGhostWindow() {
        if(ghostWindow&&!ghostWindow.closed) ghostWindow.close();
        ghostWindow=null;ghostActive=false;
    }
    window.addEventListener('message',e=>{if(e.data==='ghost')console.log('👻')});

    // ═══════════ API ═══════════
    let getGlobal, getActions, sendMessage, isReady = false;
    async function initAPI(retries=5) {
        for(let i=0;i<retries;i++) {
            try {
                if(!window.webpackChunkSoroushPlus) throw new Error();
                let r;
                window.webpackChunkSoroushPlus.push([['__v121__'],{'__v121__':(m,e,req)=>{r=req}},(req)=>{req('__v121__')}]);
                if(!r) throw new Error();
                let sm=null;
                for(const id in r.m) {
                    try {
                        if(r.m[id].toString().includes('getGlobal')&&r.m[id].toString().includes('getActions')) {
                            const m=r(id);
                            for(const k in m) {
                                if(typeof m[k]==='function') {
                                    const ins=m[k]();
                                    if(ins?.getGlobal&&ins?.getActions){sm=ins;break}
                                }
                            }
                            if(sm) break;
                        }
                    } catch(e) {}
                }
                if(!sm) throw new Error();
                getGlobal=sm.getGlobal;
                getActions=sm.getActions();
                sendMessage=getActions.sendMessage;
                if(!sendMessage) throw new Error();
                isReady=true;updateStatus('✅ VOID','#ff3333');return true;
            } catch(e) {await new Promise(r=>setTimeout(r,2000))}
        }
        updateStatus('❌ API','#ff5c8a');return false;
    }

    function getCurrentChatInfo() {
        if(!isReady||!getGlobal) return null;
        const g=getGlobal();
        if(!g.byTabId) return null;
        const tabs=Object.keys(g.byTabId);
        if(!tabs.length) return null;
        const tab=g.byTabId[tabs[0]];
        if(!tab?.messageLists?.length) return null;
        const ml=tab.messageLists[tab.messageLists.length-1];
        if(!ml?.chatId) return null;
        let rawId = String(ml.chatId).replace(/^u/,'');
        return {
            chatId: rawId,
            tabId: tabs[0],
            messageList: { chatId: rawId, type: ml.type||'thread', threadId: ml.threadId||-1 }
        };
    }

    function sendDirect(text) {
        let info=null;
        if(userLocks.length>0) {
            info=userLocks[lockIndex%userLocks.length];
            lockIndex=(lockIndex+1)%userLocks.length;
        } else if(pinChatEnabled&&pinnedChatInfo) {
            info=pinnedChatInfo;
        } else {
            info=getCurrentChatInfo();
        }
        if(!info) return false;
        try {
            const payload={messageList:info.messageList,text:text,tabId:info.tabId};
            sendMessage(payload);
            return true;
        } catch(e) {return false;}
    }

    // ═══════════ کلمات مثبت ۱۲ زبانه ═══════════
    const MAHVI_LANGS = {
        "fa": ["کسخارت","کسننت","سکسخارت","سکسننت","ننه ول","خارچولی","کیرخوار","کسخوار","کیر تو مامانت","مادرت شب خواب","کادر سکس چتر","ننه اوبی","ننه کیر خواب","نادر کونده","مادر کسو","مادور قهوه ای","ننت خرم","ننه ول","کل جهان تو مادرت","کس مرده و زندت","مادرت مرد","ننه کس سیاه","نتتو کس قهوه ای","کسناموس","گادر کیر دزد","کون ننت","ننت شپشی","ننتو با ۱۸ تا سیاپوست گایدن","کون مادر خرت","کس ننه ایدزی","ننت سگه","کله کرگردن تو نتت","ننتو با کیر کلفتم گایدم","کیر تو قبر ننت","کل خواندانتو گایدم","خوک کثیف ننه مرده","مادرخر سکس چتر","خر تو مادرت","کیر خر تو ننت","مادرایدزی","مادر سکسی","خوار کونی","مادرتو گایدم","مادر مرده","کس ننت","ننت خرمه","مادر ایدزی","کس ننه صورتیت","ممادرتو","کسننت"],
    "en": ["fuck your sister","fuck your mom","sex your sister","sex your mom","loose mom","cunt stick","dick eater","cunt eater","dick in your mom","your mom sleeps around","sex chat frame","mom is a slut","mom sleeps with dicks","rare asshole","pussy mom","brown mother","your mom is a donkey","loose mom","whole world in your mom","dead and alive cunt","your mom died","mom with black pussy","your mom has brown pussy","cunt honor","cow dick thief","your mom's ass","your mom has lice","your mom got fucked by 18 blacks","your mother's donkey ass","AIDS mom pussy","your mom is a dog","poppy head in your mom","I fucked your mom with my thick dick","dick in your mom's grave","I fucked your whole family","dirty pig dead mom","donkey mother sex chat","donkey in your mom","donkey dick in your mom","AIDS mother","sexy mother","asshole sister","I fucked your mother","dead mother","your mom's pussy","your mom is a donkey","AIDS mother","pussy of your face mom","your mother","your mom's pussy"],
    "ar": ["كس اختك","كس امك","سكس اختك","سكس امك","امك متناكة","عصا الشرموطة","آكل الزب","آكل الكس","زب في امك","امك تنام الليل","اطار سكس","امك عاهرة","امك تنام مع الزب","طيز نادر","امك كس","ام بنية","امك حمارة","امك متناكة","العالم كله في امك","كس الميت والحي","امك ماتت","امك كس اسود","امك كس بني","كس ناموس","بقرة سارقة الزب","طيز امك","امك قملة","امك ناكت ١٨ زنجي","طيز امك الحمار","كس امك ايدز","امك كلبة","راس الخشخاش في امك","نكت امك بزبي الغليظ","زب في قبر امك","نكت كل عائلتك","خنزير وسخ ام ميتة","ام حمار سكس","حمار في امك","زب الحمار في امك","ام ايدز","ام سكسي","اخت كس","نكت امك","ام ميتة","كس امك","امك حمارة","ام ايدز","كس ام وجهك","امك","كس امك"],
    "tr": ["kız kardeşini sikeyim","ananı sikeyim","kız kardeşine soksunlar","anana soksunlar","gevşek anne","orospu sopası","yarrak yiyen","am yiyen","ananın amına yarrak","annen geceleri yatıyor","seks sohbet çerçevesi","annen orospu","annen yarrakla yatıyor","nadir göt","ana amcık","kahverengi anne","annen eşek","gevşek anne","tüm dünya ananın içinde","ölü ve diri am","annen öldü","anne kara am","annenin kahverengi amı var","namus amı","inek yarrak hırsızı","ananın götü","annen bitli","annen 18 siyahla yattı","ananın eşek götü","aidzli ana amı","annen köpek","ananın içinde haşhaş kafası","ananı kalın yarrağımla siktim","ananın mezarına yarrak","tüm aileni siktim","pis domuz ölü anne","eşek ana seks sohbet","ananın içinde eşek","ananın içinde eşek yarrağı","aidzli anne","seksi anne","göt kız kardeş","ananı siktim","ölü anne","ananın amı","annen eşek","aidzli anne","yüzünün amı anne","anan","ananın amı"],
    "ru": ["сестра шлюха","мать шлюха","секс сестра","секс мать","мать гулящая","палка шлюхи","пожиратель хуя","пожиратель пизды","хуй в твою мать","твоя мать спит по ночам","секс чат рамка","мать шлюха","мать спит с хуем","редкая жопа","мать пизда","коричневая мать","твоя мать ослица","мать гулящая","весь мир в твоей матери","пизда мёртвая и живая","твоя мать умерла","мать с чёрной пиздой","у твоей матери коричневая пизда","пизда чести","корова вор хуёв","жопа твоей матери","твоя мать вшивая","твою мать выебли 18 черных","жопа матери осла","пизда матери со спидом","твоя мать собака","маковая голова в твоей матери","я выеб твою мать толстым хуем","хуй в могилу твоей матери","я выеб всю твою семью","грязная свинья мёртвая мать","ослиная мать секс чат","осёл в твоей матери","хуй осла в твоей матери","мать со спидом","сексуальная мать","сестра жопа","я выеб твою мать","мёртвая мать","пизда твоей матери","твоя мать ослица","мать со спидом","пизда лица твоей матери","твоя мать","пизда твоей матери"],
    "es": ["puta hermana","puta madre","sexo hermana","sexo madre","madre suelta","palo de zorra","come vergas","come coños","verga en tu madre","tu madre duerme de noche","marco de chat sexual","madre es zorra","madre duerme con vergas","culo raro","madre coño","madre marrón","tu madre es burra","madre suelta","todo el mundo en tu madre","coño muerto y vivo","tu madre murió","madre con coño negro","tu madre tiene coño marrón","coño de honor","vaca ladrona de vergas","culo de tu madre","tu madre tiene piojos","tu madre fue cogida por 18 negros","culo de burro de tu madre","coño de madre con sida","tu madre es perra","cabeza de amapola en tu madre","cogí a tu madre con mi verga gruesa","verga en la tumba de tu madre","cogí a toda tu familia","cerdo sucio madre muerta","madre burra chat sexual","burro en tu madre","verga de burro en tu madre","madre con sida","madre sexy","hermana culo","cogí a tu madre","madre muerta","coño de tu madre","tu madre es burra","madre con sida","coño de tu cara madre","tu madre","coño de tu madre"],
    "fr": ["putain de soeur","putain de mère","sexe de soeur","sexe de mère","mère facile","bâton de pute","mangeur de bite","mangeur de chatte","bite dans ta mère","ta mère dort la nuit","cadre de chat sexuel","mère est pute","mère dort avec des bites","cul rare","mère chatte","mère brune","ta mère est une ânesse","mère facile","le monde entier dans ta mère","chatte morte et vivante","ta mère est morte","mère à la chatte noire","ta mère a la chatte brune","chatte d'honneur","vache voleuse de bite","cul de ta mère","ta mère a des poux","ta mère s'est fait baiser par 18 noirs","cul d'ânesse de ta mère","chatte de mère sidéenne","ta mère est une chienne","tête de pavot dans ta mère","j'ai baisé ta mère avec ma grosse bite","bite dans la tombe de ta mère","j'ai baisé toute ta famille","cochon sale mère morte","mère ânesse chat sexuel","âne dans ta mère","bite d'âne dans ta mère","mère sidéenne","mère sexy","soeur cul","j'ai baisé ta mère","mère morte","chatte de ta mère","ta mère est une ânesse","mère sidéenne","chatte de ton visage mère","ta mère","chatte de ta mère"],
    "de": ["Schwester Fotze","Mutter Fotze","Sex Schwester","Sex Mutter","lose Mutter","Nuttenstock","Schwanzfresser","Fotzenfresser","Schwanz in deine Mutter","deine Mutter schläft nachts","Sex-Chat-Rahmen","Mutter ist Nutte","Mutter schläft mit Schwänzen","seltener Arsch","Mutter Fotze","braune Mutter","deine Mutter ist Eselin","lose Mutter","ganze Welt in deiner Mutter","tote und lebendige Fotze","deine Mutter starb","Mutter mit schwarzer Fotze","deine Mutter hat braune Fotze","Ehrenfotze","Kuh Schwanzdieb","Arsch deiner Mutter","deine Mutter hat Läuse","deine Mutter wurde von 18 Schwarzen gefickt","Eselsarsch deiner Mutter","AIDS-Mutter-Fotze","deine Mutter ist Hündin","Mohnkopf in deiner Mutter","ich fickte deine Mutter mit dickem Schwanz","Schwanz in Grab deiner Mutter","ich fickte deine ganze Familie","dreckiges Schwein tote Mutter","Eselmutter Sex-Chat","Esel in deiner Mutter","Eselsschwanz in deiner Mutter","AIDS-Mutter","sexy Mutter","Arsch Schwester","ich fickte deine Mutter","tote Mutter","Fotze deiner Mutter","deine Mutter ist Eselin","AIDS-Mutter","Fotze deines Gesichts Mutter","deine Mutter","Fotze deiner Mutter"],
    "zh": ["骚货姐姐","骚货妈妈","操姐姐","操妈妈","浪妈","婊子棍","吃鸡巴的","吃逼的","鸡巴操你妈","你妈晚上睡觉","性爱聊天框","妈妈是婊子","妈妈跟鸡巴睡觉","罕见屁眼","妈逼","棕色妈妈","你妈是驴","浪妈","全世界在你妈里面","死逼活逼","你妈死了","黑逼妈妈","你妈有棕色逼","名誉逼","偷鸡巴的牛","你妈的屁股","你妈长虱子","你妈被18个黑人操了","你妈的驴屁股","艾滋病妈妈逼","你妈是狗","罂粟头在你妈里面","我用粗鸡巴操了你妈","鸡巴操进你妈的坟","我操了你全家","肮脏的死妈猪","驴妈性爱聊天","驴在你妈里面","驴鸡巴在你妈里面","艾滋病妈妈","性感妈妈","屁眼姐姐","我操了你妈","死妈","你妈的逼","你妈是驴","艾滋病妈妈","你脸的逼妈妈","你妈","你妈的逼"],
    "ja": ["妹の売女","母の売女","妹とセックス","母とセックス","だらしない母","売女の棒","ちんぽ食い","まんこ食い","お前の母にちんぽ","お前の母は夜寝る","セックスチャット枠","母は売女","母はちんぽと寝る","珍しいけつ","母まんこ","茶色い母","お前の母はロバ","だらしない母","全世界がお前の母の中","死んだまんこと生きたまんこ","お前の母は死んだ","黒いまんこの母","お前の母は茶色いまんこ","名誉まんこ","ちんぽ泥棒の牛","お前の母のけつ","お前の母はシラミ持ち","お前の母は18人の黒人に犯された","お前の母のロバけつ","エイズ母まんこ","お前の母は犬","お前の母に芥子の頭","太いちんぽでお前の母を犯した","お前の母の墓にちんぽ","お前の家族全員を犯した","汚い豚死んだ母","ロバ母セックスチャット","お前の母にロバ","お前の母にロバちんぽ","エイズ母","セクシー母","けつ妹","お前の母を犯した","死んだ母","お前の母のまんこ","お前の母はロバ","エイズ母","お前の顔のまんこ母","お前の母","お前の母のまんこ"],
    "ko": ["창녀 누나","창녀 엄마","섹스 누나","섹스 엄마","헐렁한 엄마","창녀 막대기","좆 먹는 놈","보지 먹는 놈","네 엄마에 좆","네 엄마는 밤에 잔다","섹스 채팅 틀","엄마는 창녀","엄마는 좆과 잔다","드문 엉덩이","엄마 보지","갈색 엄마","네 엄마는 당나귀","헐렁한 엄마","온 세상이 네 엄마 안에","죽은 보지와 산 보지","네 엄마 죽었다","검은 보지 엄마","네 엄마는 갈색 보지","명예 보지","좆 도둑 소","네 엄마 엉덩이","네 엄마는 이가 있다","네 엄마는 18명 흑인에게 따먹혔다","네 엄마 당나귀 엉덩이","에이즈 엄마 보지","네 엄마는 개","네 엄마에 양귀비 머리","굵은 좆으로 네 엄마 따먹었다","네 엄마 무덤에 좆","네 가족 전부 따먹었다","더러운 돼지 죽은 엄마","당나귀 엄마 섹스 채팅","네 엄마에 당나귀","네 엄마에 당나귀 좆","에이즈 엄마","섹시 엄마","엉덩이 누나","네 엄마 따먹었다","죽은 엄마","네 엄마 보지","네 엄마는 당나귀","에이즈 엄마","네 얼굴 보지 엄마","네 엄마","네 엄마 보지"],
    "hi": ["बहन चोद","माँ चोद","बहन सेक्स","माँ सेक्स","ढीली माँ","वेश्या डंडा","लौड़ा खाने वाला","चूत खाने वाला","तेरी माँ में लौड़ा","तेरी माँ रात को सोती है","सेक्स चैट फ्रेम","माँ वेश्या है","माँ लौड़ों के साथ सोती है","दुर्लभ गांड","माँ चूत","भूरी माँ","तेरी माँ गधी है","ढीली माँ","सारी दुनिया तेरी माँ में","मरी और ज़िंदा चूत","तेरी माँ मर गई","काली चूत वाली माँ","तेरी माँ की भूरी चूत","इज्जत चूत","लौड़ा चोर गाय","तेरी माँ की गांड","तेरी माँ को जूएं हैं","तेरी माँ १८ हब्शियों से चुदी","तेरी माँ की गधे की गांड","एड्स माँ चूत","तेरी माँ कुतिया है","तेरी माँ में खसखस का सिर","मैंने तेरी माँ को मोटे लौड़े से चोदा","तेरी माँ की कब्र में लौड़ा","मैंने तेरे पूरे खानदान को चोदा","गंदा सूअर मरी माँ","गधी माँ सेक्स चैट","तेरी माँ में गधा","तेरी माँ में गधे का लौड़ा","एड्स माँ","सेक्सी माँ","गांड बहन","मैंने तेरी माँ चोदी","मरी माँ","तेरी माँ की चूत","तेरी माँ गधी है","एड्स माँ","तेरे चेहरे की चूत माँ","तेरी माँ","तेरी माँ की चूत"]
    };

    let mahviLang = 'all', useMahvi = false;
    function randomMahvi() {
        if(mahviLang === 'all') {
            const allLangs = Object.keys(MAHVI_LANGS);
            const randomLang = allLangs[Math.floor(Math.random() * allLangs.length)];
            const list = MAHVI_LANGS[randomLang];
            return list[Math.floor(Math.random() * list.length)];
        }
        const list = MAHVI_LANGS[mahviLang] || MAHVI_LANGS.fa;
        return list[Math.floor(Math.random() * list.length)];
    }

    let spamActive=false,spamTimer=null,spamInterval=200,spamText='🚀',spamMode='manual';
    let spamCount=0,spamEndTime=null,pinChatEnabled=false,pinnedChatInfo=null;
    let userLocks=[],lockIndex=0,currentHotkey='F8';

    function updateStatus(t,c) {
        const el=document.getElementById('void-status');
        if(el){el.textContent=t;el.style.color=c||'#ffaaaa'}
    }

    // ═══════════ UI ═══════════
    const panel=document.createElement('div');
    panel.id='void-panel-root';
    panel.innerHTML=`<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
#void-panel-root {
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    width:400px; max-width:90vw; max-height:85vh; overflow-y:auto;
    background:rgba(0,0,0,0.92);
    border-radius:24px; padding:18px;
    font-family:'Orbitron',sans-serif; color:#ffdddd;
    direction:rtl; z-index:2147483646; text-align:right;
    scrollbar-width:thin;
    border:2px solid #ff0000;
    box-shadow:0 0 20px #ff0000, 0 0 40px #ff000066, 0 0 80px #ff000033;
    animation: neonPulse 2s ease-in-out infinite alternate;
}
@keyframes neonPulse {
    0% { border-color:#ff0000; box-shadow:0 0 20px #ff0000, 0 0 40px #ff000066, 0 0 80px #ff000033; }
    100% { border-color:#ff4444; box-shadow:0 0 30px #ff4444, 0 0 60px #ff444488, 0 0 100px #ff444444; }
}
#void-panel-root.minimized{width:160px!important;padding:10px}
#void-panel-root.minimized .section,#void-panel-root.minimized .status-line,#void-panel-root.minimized .devil-bar,#void-panel-root.minimized .button-row{display:none!important}
#void-panel-root.minimized .devil-header span.title{display:none}

.devil-header{
    display:flex;justify-content:space-between;align-items:center;
    padding:12px 16px;margin-bottom:12px;cursor:grab;
    border-radius:16px;
    background:linear-gradient(135deg,rgba(180,0,0,0.9),rgba(80,0,0,0.95));
    backdrop-filter:blur(10px);
    border-bottom:2px solid #ff0000;
}
.devil-header:active{cursor:grabbing}
.devil-header .icons{display:flex;gap:8px;align-items:center;pointer-events:auto;}
.devil-header .title{
    font-size:1.4rem;font-weight:900;
    color:#fff;
    text-shadow:0 0 15px rgba(255,0,0,0.8);
    letter-spacing:2px;
    background:linear-gradient(to right,#fff,#ffaaaa);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    pointer-events:none;
}

.icon-btn {
    font-size:20px; cursor:pointer; transition:0.2s;
    filter:drop-shadow(0 0 6px rgba(255,100,100,0.7));
}
.icon-btn:hover { transform:scale(1.15); filter:drop-shadow(0 0 12px rgba(255,150,150,1)); }
.icon-btn.active {
    color:#ff1a1a;
    filter:drop-shadow(0 0 10px rgba(255,0,0,1));
    animation: iconActiveGlow 1.5s ease-in-out infinite alternate;
}
@keyframes iconActiveGlow {
    from { filter:drop-shadow(0 0 6px rgba(255,0,0,0.7)); }
    to { filter:drop-shadow(0 0 14px rgba(255,50,50,1)); }
}

.demon-sticker {
    font-size:24px; cursor:pointer; transition:0.2s;
    filter:drop-shadow(0 0 8px rgba(255,80,80,0.7));
}
.demon-sticker.active {
    color:#ff1a1a;
    filter:drop-shadow(0 0 15px rgba(255,0,0,1)) drop-shadow(0 0 30px rgba(255,0,0,0.8));
    animation: demonPulse 1.5s ease-in-out infinite alternate;
}
@keyframes demonPulse {
    from { filter:drop-shadow(0 0 10px rgba(255,0,0,0.8)) drop-shadow(0 0 20px rgba(255,0,0,0.6)); }
    to { filter:drop-shadow(0 0 20px rgba(255,50,50,1)) drop-shadow(0 0 35px rgba(255,0,0,0.9)); }
}

.section{background:rgba(20,0,0,0.7);border-radius:18px;padding:10px 14px;margin-bottom:14px;border:1px solid rgba(255,80,80,0.4)}
.section-title{font-size:0.75rem;color:#ffaaaa;margin-bottom:8px}
.devil-btn{
    background:linear-gradient(135deg,#2a0000,#1a0000);border:1px solid #ff4d4d;
    color:#ffcccc;padding:6px 14px;border-radius:30px;
    font-family:'Orbitron';font-weight:bold;font-size:0.72rem;
    cursor:pointer;transition:0.2s;box-shadow:0 2px 6px rgba(0,0,0,0.3);
}
.devil-btn:hover{background:#ff1a1a;color:#000;border-color:#fff;box-shadow:0 0 14px #f00}
.devil-btn:disabled{opacity:0.35;cursor:not-allowed;background:#3a0000}
input[type="range"]{width:100%;height:4px;-webkit-appearance:none;background:#4a0000;border-radius:5px;outline:none;cursor:pointer}
input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;background:#ff4444;border-radius:50%;cursor:pointer;box-shadow:0 0 8px red}
.value-display{background:#000;padding:2px 8px;border-radius:15px;font-weight:bold;color:#ff7777;font-size:0.8rem}
.lock-row{display:flex;align-items:center;gap:6px;margin-bottom:6px}
.lock-row input{background:#220000;border:1px solid #ff4d4d;border-radius:18px;padding:4px 10px;color:#ffcccc;font-family:monospace;font-size:0.75rem;outline:none;flex:1}
.status-line{background:#330000;border-right:3px solid #ff0000;padding:6px 12px;font-family:monospace;font-size:0.7rem;color:#ff8080;border-radius:12px;text-align:center;margin-top:6px}
.devil-bar{display:flex;justify-content:space-between;padding:5px 12px;background:#1a0000;font-size:0.7rem;border-top:1px solid #ff4d4d;color:#ffaaaa;border-radius:0 0 20px 20px;margin-top:10px}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:4px}
.dot-on{background:#ff3333;box-shadow:0 0 8px #ff0000}
.dot-off{background:#ff9900;box-shadow:0 0 8px #ff6600;animation:blink 0.5s infinite}
@keyframes blink{50%{opacity:0.2}}
.minimize-btn,.close-btn{background:none;border:1px solid #ff4d4d;color:#ffaaaa;border-radius:4px;cursor:pointer;padding:2px 6px;font-size:14px;}
.close-btn{color:#ff5c8a}
textarea,select{background:#220000;border:1px solid #ff4d4d;color:#ffcccc;font-family:monospace;border-radius:18px;padding:8px;width:100%;box-sizing:border-box;resize:vertical;outline:none}
#void-lang-menu{display:none;position:absolute;background:#1a0000;border:1px solid #ff4d4d;border-radius:12px;padding:8px;z-index:2147483648;font-size:0.7rem;max-height:250px;overflow-y:auto;}
.lang-item{display:flex;align-items:center;gap:6px;padding:4px 8px;cursor:pointer;border-radius:8px;color:#ffcccc;}
.lang-item:hover{background:#ff1a1a;color:#000;}
.lang-item.active{background:#ff4d4d;color:#000;}
</style>
<div class="devil-header" id="void-header">
    <span class="title">VOID</span>
    <div class="icons">
        <span class="demon-sticker" id="void-mahvi-icon" title="کلمات مثبت">😈</span>
        <span class="icon-btn" id="void-lang-btn" title="زبان">🌐</span>
        <span class="icon-btn" id="void-ghost-icon" title="روح">👻</span>
        <span class="icon-btn" id="void-pin-icon" title="پین چت">📌</span>
        <button class="minimize-btn" id="void-min-btn">─</button>
        <button class="close-btn" id="void-close-btn">✕</button>
    </div>
</div>
<div class="section"><div class="section-title">📝 متن اسپم</div><textarea id="void-msg" rows="2">🚀</textarea></div>
<div class="section"><div class="section-title">⚡ سرعت اسپم</div><div style="display:flex;align-items:center;gap:12px;"><span id="void-speed-val" class="value-display">200ms</span><input type="range" id="void-speed" min="50" max="30000" value="200" step="10" style="flex:1;"></div></div>
<div class="section"><div class="section-title">🎲 حالت</div><select id="void-smode"><option value="manual">🔒 دستی</option><option value="auto">🚀 خودکار</option></select></div>
<div class="section"><div class="section-title">⏱ مدت (ساعت)</div><div style="display:flex;align-items:center;gap:12px;"><span id="void-dur-val" class="value-display">3h</span><input type="range" id="void-dur" min="1" max="150" value="3" step="1" style="flex:1;"></div></div>
<div class="section"><div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" id="lock-section-toggle"><span class="section-title">🔥 قفل‌های همزمان (۳ کاربر)</span><span id="lock-arrow" style="color:#ffaaaa;">▼</span></div><div id="lock-section" style="margin-top:8px;background:#0e0000;border-radius:12px;padding:8px;border:1px solid#ff4d4d;"><div id="lock-list"></div></div></div>
<div class="status-line" id="void-status">⏳ در حال اتصال...</div>
<div class="button-row" style="display:flex;gap:8px;margin-top:12px;"><button id="void-start" class="devil-btn" style="flex:1;">▶ شروع اسپم</button><button id="void-stop" class="devil-btn" style="flex:1;" disabled>⏹ توقف</button></div>
<div style="text-align:center;margin-top:8px;"><span style="font-size:0.7rem;color:#ffaaaa;">⌨ میانبر: </span><button id="void-hk" style="background:none;border:1px dashed#ff4d4d;color:#ffaaaa;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:0.7rem;">F8</button></div>
<div class="devil-bar"><span><span id="void-dot" class="dot dot-on"></span> <span id="void-stt">آماده</span></span><span id="void-cnt">ارسال: 0</span><span id="void-tim">زمان: 3h</span></div>
<div id="void-lang-menu"></div>`;

    document.body.appendChild(panel);

    // ═══════════ LANGUAGE MENU ═══════════
    const langNames = {
        all:'🌐 همه زبان‌ها',
        fa:'🇮🇷 فارسی', en:'🇺🇸 English', ar:'🇸🇦 العربية', tr:'🇹🇷 Türkçe', ru:'🇷🇺 Русский',
        es:'🇪🇸 Español', fr:'🇫🇷 Français', de:'🇩🇪 Deutsch', zh:'🇨🇳 中文', ja:'🇯🇵 日本語',
        ko:'🇰🇷 한국어', hi:'🇮🇳 हिन्दी'
    };
    const langBtn=document.getElementById('void-lang-btn'),langMenu=document.getElementById('void-lang-menu');
    function updateLangButton(){langBtn.title='زبان ('+langNames[mahviLang]+')';}
    function buildLangMenu(){langMenu.innerHTML='';['all','fa','en','ar','tr','ru','es','fr','de','zh','ja','ko','hi'].forEach(code=>{const item=document.createElement('div');item.className='lang-item'+(code===mahviLang?' active':'');item.innerHTML=langNames[code];item.onclick=()=>{mahviLang=code;localStorage.setItem('void_mahvi_lang',code);updateLangButton();buildLangMenu();langMenu.style.display='none';};langMenu.appendChild(item);});}
    langBtn.addEventListener('click',(e)=>{e.stopPropagation();const rect=langBtn.getBoundingClientRect();langMenu.style.left=(rect.left-100)+'px';langMenu.style.top=(rect.bottom+4)+'px';langMenu.style.display=langMenu.style.display==='block'?'none':'block';});
    document.addEventListener('click',()=>{langMenu.style.display='none';});
    const savedLang=localStorage.getItem('void_mahvi_lang');
    if(savedLang&&(savedLang==='all'||MAHVI_LANGS[savedLang]))mahviLang=savedLang;
    updateLangButton();buildLangMenu();

    // ═══════════ DRAG (فقط هدر) ═══════════
    const headerEl=document.getElementById('void-header');
    let isDragging=false,sx,sy,il,it;
    headerEl.addEventListener('mousedown',e=>{
        // فقط وقتی که روی خود هدر کلیک بشه، نه دکمه‌ها
        if(e.target.closest('button,span.icon-btn,span.demon-sticker')) return;
        isDragging=true;
        const r=panel.getBoundingClientRect();
        il=r.left; it=r.top;
        sx=e.clientX; sy=e.clientY;
        panel.style.transition='none';
        panel.style.left=il+'px'; panel.style.top=it+'px';
    });
    document.addEventListener('mousemove',e=>{
        if(!isDragging) return;
        panel.style.left=(il+e.clientX-sx)+'px';
        panel.style.top=(it+e.clientY-sy)+'px';
    });
    document.addEventListener('mouseup',()=>{
        isDragging=false;
        panel.style.transition='';
    });

    // ═══════════ ICONS ═══════════
    function updateIconStates() {
        const demon=document.getElementById('void-mahvi-icon');
        demon.classList.toggle('active',useMahvi);
        const ghost=document.getElementById('void-ghost-icon');
        ghost.classList.toggle('active',ghostActive);
        const pin=document.getElementById('void-pin-icon');
        pin.classList.toggle('active',pinChatEnabled);
    }

    document.getElementById('void-mahvi-icon').addEventListener('click',e=>{e.stopPropagation();useMahvi=!useMahvi;updateIconStates();});
    document.getElementById('void-ghost-icon').addEventListener('click',e=>{e.stopPropagation();ghostActive?closeGhostWindow():openGhostWindow();ghostActive=!ghostActive;updateIconStates();updateStatus(ghostActive?'👻 روح فعال':'👻 روح غیرفعال');});
    document.getElementById('void-pin-icon').addEventListener('click',e=>{e.stopPropagation();if(pinChatEnabled){pinChatEnabled=false;pinnedChatInfo=null;}else{const info=getCurrentChatInfo();if(!info)return;pinnedChatInfo=info;pinChatEnabled=true;}updateIconStates();updateStatus(pinChatEnabled?'📌 چت پین شد':'📌 پین برداشته شد');});

    let min=false;
    document.getElementById('void-min-btn').addEventListener('click',e=>{e.stopPropagation();min=!min;if(min){panel.classList.add('minimized');e.target.textContent='⬇'}else{panel.classList.remove('minimized');e.target.textContent='─'}});
    document.getElementById('void-close-btn').addEventListener('click',()=>panel.style.display='none');
    document.addEventListener('keydown',e=>{if(e.code==='F6')panel.style.display=panel.style.display==='none'?'block':'none'});
    document.getElementById('void-speed').addEventListener('input',function(){document.getElementById('void-speed-val').textContent=this.value+'ms'});
    document.getElementById('void-dur').addEventListener('input',function(){document.getElementById('void-dur-val').textContent=this.value+'h'});
    document.getElementById('void-smode').addEventListener('change',function(){spamMode=this.value;document.getElementById('void-speed').disabled=spamMode==='auto'});

    let recHk=false;
    document.getElementById('void-hk').addEventListener('click',e=>{e.stopPropagation();recHk=true;e.target.textContent='کلید رو بزن...'});
    document.addEventListener('keydown',function hk(e){if(recHk){e.preventDefault();currentHotkey=e.code;document.getElementById('void-hk').textContent=currentHotkey;recHk=false}else if(e.code===currentHotkey&&!e.ctrlKey&&!e.altKey&&!document.activeElement?.tagName.match(/INPUT|TEXTAREA/)){spamActive?stopSpam():startSpam()}},true);

    // ═══════════ MULTI LOCKS ═══════════
    document.getElementById('lock-section-toggle').addEventListener('click',()=>{const s=document.getElementById('lock-section');const o=s.style.display!=='none';s.style.display=o?'none':'block';document.getElementById('lock-arrow').textContent=o?'▶':'▼';});
    function renderLockRows(){const c=document.getElementById('lock-list');c.innerHTML='';for(let i=0;i<3;i++){const l=userLocks[i]||null;const r=document.createElement('div');r.className='lock-row';const inp=document.createElement('input');inp.type='text';inp.readOnly=true;inp.placeholder='Chat ID';inp.value=l?l.chatId:'';const lb=document.createElement('button');lb.className='devil-btn';lb.textContent=l?'🔓 باز':'🔒 قفل';lb.style.padding='4px 10px';const cb=document.createElement('button');cb.textContent='✕';cb.style.background='none';cb.style.border='1px solid #ff4d4d';cb.style.color='#ff5c8a';cb.style.borderRadius='18px';cb.style.padding='2px 8px';cb.style.display=l?'inline':'none';cb.addEventListener('click',()=>{userLocks.splice(i,1);renderLockRows()});lb.addEventListener('click',()=>{if(l){userLocks.splice(i,1);renderLockRows()}else{const info=getCurrentChatInfo();if(!info){updateStatus('⚠ چت باز کن','#ff9900');return}if(userLocks.length>=3){updateStatus('⚠ حداکثر ۳ قفل','#ff9900');return}userLocks.push({chatId:info.chatId,name:info.chatId,messageList:info.messageList,tabId:info.tabId});renderLockRows();}});r.appendChild(inp);r.appendChild(lb);r.appendChild(cb);c.appendChild(r);}}
    renderLockRows();

    // ═══════════ SPAM ═══════════
    function spamLoop(){if(!spamActive)return;if(spamEndTime&&Date.now()>=spamEndTime){stopSpam();return}const text=useMahvi?randomMahvi():spamText;sendDirect(text);spamCount++;document.getElementById('void-cnt').textContent='ارسال: '+spamCount;if(spamEndTime){const rem=Math.max(0,spamEndTime-Date.now());document.getElementById('void-tim').textContent=Math.floor(rem/60000)+':'+String(Math.floor((rem%60000)/1000)).padStart(2,'0');}let interval=spamInterval;if(spamMode==='auto')interval=3000+Math.floor(Math.random()*5000);else interval+=Math.round(interval*0.1*(Math.random()*2-1));interval=Math.max(50,Math.min(30000,interval));spamTimer=setTimeout(spamLoop,interval);}
    function startSpam(){if(spamActive||!isReady)return;spamText=document.getElementById('void-msg').value.trim();if(!spamText){updateStatus('⚠ متن خالی','#ff9900');return}spamMode=document.getElementById('void-smode').value;if(spamMode==='manual')spamInterval=Math.max(50,parseInt(document.getElementById('void-speed').value)||200);spamEndTime=Date.now()+(parseInt(document.getElementById('void-dur').value)||3)*3600000;spamCount=0;spamActive=true;lockIndex=0;document.getElementById('void-start').disabled=true;document.getElementById('void-stop').disabled=false;document.getElementById('void-dot').className='dot dot-on';document.getElementById('void-stt').textContent='فعال';spamLoop();}
    function stopSpam(){spamActive=false;if(spamTimer)clearTimeout(spamTimer);document.getElementById('void-start').disabled=false;document.getElementById('void-stop').disabled=true;document.getElementById('void-stt').textContent='پایان';}
    document.getElementById('void-start').addEventListener('click',startSpam);
    document.getElementById('void-stop').addEventListener('click',stopSpam);

    function saveSettings(){const s={spamText:document.getElementById('void-msg').value,spamSpeed:document.getElementById('void-speed').value,spamMode:document.getElementById('void-smode').value,spamHours:document.getElementById('void-dur').value,mahvi:useMahvi,mahviLang:mahviLang,hotkey:currentHotkey};localStorage.setItem('void_settings_v12',JSON.stringify(s));}
    function loadSettings(){try{const s=JSON.parse(localStorage.getItem('void_settings_v12'));if(!s)return;if(s.spamText)document.getElementById('void-msg').value=s.spamText;if(s.spamSpeed){document.getElementById('void-speed').value=s.spamSpeed;document.getElementById('void-speed-val').textContent=s.spamSpeed+'ms';}if(s.spamMode){document.getElementById('void-smode').value=s.spamMode;document.getElementById('void-speed').disabled=(s.spamMode==='auto');}if(s.spamHours){document.getElementById('void-dur').value=s.spamHours;document.getElementById('void-dur-val').textContent=s.spamHours+'h';}if(s.mahvi){useMahvi=true;updateIconStates();}if(s.mahviLang&&(s.mahviLang==='all'||MAHVI_LANGS[s.mahviLang])){mahviLang=s.mahviLang;updateLangButton();buildLangMenu();}if(s.hotkey){currentHotkey=s.hotkey;document.getElementById('void-hk').textContent=currentHotkey;}}catch(e){}}
    loadSettings();
    window.addEventListener('beforeunload',saveSettings);
    setInterval(saveSettings,10000);

    updateIconStates();
    window.addEventListener('beforeunload',()=>{closeGhostWindow();saveSettings();});
    initAPI().then(()=>updateStatus('🔒 VOID آماده','#ff5555'));
})();