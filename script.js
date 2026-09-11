.getElementById('btnDownload').addEventListener('click', async () => {
  let url = document.getElementById('tiktokUrl').value.trim();
  const resultDiv = document.getElementById('result');

  if (!url) {
    resultDiv.innerHTML = '<p style="color:red">Masukkan link TikTok dulu!</p>';
    return;document
  }

  resultDiv.innerHTML = '<p style="color:white">Loading...</p>';

  try {
    // 1. Kalau link pendek vt.tiktok, kita expand dulu pake proxy
    if(url.includes('vt.tiktok.com')){
      const expandRes = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const html = await expandRes.text();
      const match = html.match(/https:\/\/www\.tiktok\.com\/@[^"]+\/video\/\d+/);
      if(match) url = match[0]; // ambil link panjangnya
    }

    // 2. Baru tembak ke API
    const apiUrl = `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`;
    
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (data.code === 0 && data.data && data.data.music) {
      const mp3Link = data.data.music.play; 
      const title = data.data.title || "Audio TikTok";
      resultDiv.innerHTML = `
        <p style="color:white; font-size:13px; margin-bottom:5px;">${title}</p>
        <a href="${mp3Link}" download target="_blank">Download MP3 Sekarang</a>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red">Gagal: ${data.msg || 'Link tidak valid/privat'}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = '<p style="color:red">Error: Gagal konek ke server. Coba link lain.</p>';
    console.log(err);
  }
});
}  
lucide.createIcons();

// === SYSTEM PREMIUM + TIMER ===
let timeLeft = 60; // 1 menit
let isPremium = localStorage.getItem('scarlett_premium') === 'true';
let adWatched = 0;
const timerEl = document.getElementById('timer');
const adPopup = document.getElementById('ad-popup');

if(isPremium){
  document.getElementById('premium-badge').classList.remove('hidden');
  document.getElementById('timer-box').classList.add('hidden');
}else{
  startTimer();
}

function startTimer(){
  const interval = setInterval(()=>{
    if(isPremium) clearInterval(interval);
    timeLeft--;
    let m = String(Math.floor(timeLeft/60)).padStart(2,'0');
    let s = String(timeLeft%60).padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
    
    if(timeLeft <= 0){
      clearInterval(interval);
      showAds();
    }
  },1000);
}

function showAds(){
  adPopup.classList.remove('hidden');
  const ads = [
    {name: "Sponsor TikTok Shop", link: "https://www.tiktok.com"},
    {name: "Sponsor Scarlett Skincare", link: "#"},
    {name: "Sponsor Game Mobile", link: "#"}
  ];
  const adList = document.getElementById('ad-list');
  adList.innerHTML = '';
  adWatched = 0;
  
  ads.forEach((ad,i)=>{
    const div = document.createElement('div');
    div.className = 'ad-item';
    div.innerHTML = `<i data-lucide="play-circle"></i> ${ad.name} - Klik untuk tonton`;
    div.onclick = () => {
      window.open(ad.link, '_blank');
      div.style.opacity = '0.5';
      div.innerHTML = `<i data-lucide="check-circle"></i> ${ad.name} - Selesai`;
      adWatched++;
      if(adWatched >= 3){
        document.getElementById('btn-close-ad').classList.remove('hidden');
      }
      lucide.createIcons();
    }
    adList.appendChild(div);
  });
  lucide.createIcons();
}

document.getElementById('btn-close-ad').onclick = () => {
  adPopup.classList.add('hidden');
  timeLeft = 60; // reset 1 menit lagi
  startTimer();
}

document.getElementById('btn-premium').onclick = () => {
  alert("Beli Premium Rp10.000/bulan\nFitur: Unlimited Download + No Iklan");
  // Simulasi bayar
  localStorage.setItem('scarlett_premium', 'true');
  location.reload();
}

// === LOGIC DOWNLOAD TIKTOK ===
const btnDownload = document.getElementById('btn-download');
btnDownload.onclick = async () => {
  if(!isPremium && timeLeft <= 0) return showAds();
  
  const url = document.getElementById('url-input').value.trim();
  if(!url) return showError("Masukkan link TikTok");
  
  document.getElementById('loading').classList.remove('hidden');
  // API contoh. Ganti dengan API kamu
  setTimeout(()=>{
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('result').innerHTML = `<a href="#" class="btn btn-primary">Download MP3 Sekarang</a>`;
    document.getElementById('result').classList.remove('hidden');
  },2000);
}

function showError(msg){
  const err = document.getElementById('error');
  err.textContent = msg; err.classList.remove('hidden');
  setTimeout(()=>err.classList.add('hidden'),3000);
  }
