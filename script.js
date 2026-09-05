document.getElementById('btnDownload').addEventListener('click', async () => {
  let url = document.getElementById('tiktokUrl').value.trim();
  const resultDiv = document.getElementById('result');

  if (!url) {
    resultDiv.innerHTML = '<p style="color:red">Masukkan link TikTok dulu!</p>';
    return;
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
