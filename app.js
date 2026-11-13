const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const tg=window.Telegram?.WebApp; if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#061512');tg.setBackgroundColor('#061512')}catch(e){}}
const demoMissions=[
 {id:'official',name:'Join Official Channel',reward:0.010,desc:'Join the project announcement channel'},
 {id:'payout',name:'Join Payout Updates',reward:0.010,desc:'Follow payout and maintenance updates'},
 {id:'partner1',name:'Visit Partner Community',reward:0.015,desc:'Discover a community partner'},
 {id:'daily',name:'Daily Check-in',reward:0.005,desc:'Claim your daily demo check-in'}
];
const state={balance:0,done:[],withdrawals:[],referrals:0};
try{Object.assign(state,JSON.parse(localStorage.getItem('uepro-demo')||'{}'))}catch(e){}
function save(){localStorage.setItem('uepro-demo',JSON.stringify(state));render()}
function money(n){return Number(n||0).toFixed(3)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function render(){
 $('#balance').textContent=money(state.balance);$('#statBalance').textContent=money(state.balance);$('#walletBalance').textContent=money(state.balance)+' USDT';$('#usdValue').textContent='$'+Number(state.balance||0).toFixed(2);$('#walletUsd').textContent='$'+Number(state.balance||0).toFixed(2);
 $('#missionCount').textContent=state.done.length;$('#missionProgress').textContent=state.done.length+'/'+demoMissions.length+' Done';$('#progressBar').style.width=(state.done.length/demoMissions.length*100)+'%';
 $('#refCount').textContent=state.referrals||0;$('#joinedCount').textContent=state.referrals||0;
 $('#missionList').innerHTML=demoMissions.map(m=>{let done=state.done.includes(m.id);return `<div class="mission-row"><div class="mission-icon">➤</div><div class="mission-info"><b>${m.name}</b><small>+${money(m.reward)} USDT · ${m.desc}</small></div><button class="${done?'done':''}" data-mission="${m.id}" ${done?'disabled':''}>${done?'✓ Done':'Start'}</button></div>`}).join('');
 $('#withdrawList').className=state.withdrawals.length?'':'empty-state';
 $('#withdrawList').innerHTML=state.withdrawals.length?state.withdrawals.map(w=>`<div class="mission-row"><div class="mission-icon">◷</div><div class="mission-info"><b>${money(w.amount)} USDT</b><small>${w.address.slice(0,8)}…${w.address.slice(-5)} · ${w.status}</small></div></div>`).join(''):'<div class="empty-icon">◷</div><h3>No withdrawals recorded</h3><p>Your withdrawal requests will appear here.</p>';
 const uname=tg?.initDataUnsafe?.user?.first_name||'Guest Explorer';$('#userName').textContent=uname;$('#avatar').textContent=uname.charAt(0).toUpperCase();
 const botUsername='EarnUSDTProBot';const uid=tg?.initDataUnsafe?.user?.id||'demo';const link=`https://t.me/${botUsername}?start=${uid}`;$('#refLink').textContent=link;
}
function go(tab){$$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+tab));$$('.nav-item').forEach(b=>b.classList.toggle('selected',b.dataset.tab===tab));window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.tab)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$('#missionList').addEventListener('click',e=>{const b=e.target.closest('[data-mission]');if(!b)return;const id=b.dataset.mission;const m=demoMissions.find(x=>x.id===id);if(state.done.includes(id))return;state.done.push(id);state.balance=(state.balance||0)+m.reward;save();toast('Demo reward added: +'+money(m.reward)+' USDT')});
$('#watchAd').addEventListener('click',()=>toast('Ad provider is not connected yet. No reward was added.'));
function openModal(){$('#withdrawModal').classList.add('open')}
function closeModal(){$('#withdrawModal').classList.remove('open')}
$('#openWithdraw').onclick=openModal;$('#newCashout').onclick=openModal;$$('[data-close]').forEach(b=>b.onclick=closeModal);$('#withdrawModal').addEventListener('click',e=>{if(e.target.id==='withdrawModal')closeModal()});
$('#submitWithdraw').onclick=()=>{const address=$('#walletAddress').value.trim(),amount=Number($('#withdrawAmount').value);if(!/^0x[a-fA-F0-9]{40}$/.test(address)){toast('Enter a valid 42-character BEP-20 address');return}if(!Number.isFinite(amount)||amount<=0||amount>state.balance){toast('Enter an amount within your available demo balance');return}state.withdrawals.unshift({address,amount,status:'Demo request · not paid'});state.balance-=amount;save();closeModal();$('#walletAddress').value='';$('#withdrawAmount').value='';toast('Demo withdrawal request saved locally')};
$('#showHistory').onclick=()=>toast(state.withdrawals.length?`${state.withdrawals.length} demo request(s) recorded`:'No activity yet');
$('#copyLink').onclick=async()=>{try{await navigator.clipboard.writeText($('#refLink').textContent);toast('Invite link copied')}catch(e){toast('Copy is unavailable in this preview')}};
$('#shareLink').onclick=()=>{const url=$('#refLink').textContent; if(tg?.openTelegramLink)tg.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent(url));else if(navigator.share)navigator.share({url});else toast('Open this app in Telegram to share your invite link')};
$('#soundBtn').onclick=()=>toast('Sound notifications are not enabled');
render();