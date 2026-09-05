document.getElementById('btnDownload').addEventListener('click', async () => {
  const url = document.getElementById('tiktokUrl').value.trim();
  const resultDiv = document.getElementById('result');

  if (!url) {
    resultDiv.innerHTML = '<p style="color:red">Masukkan link TikTok dulu!</p>';
    return;
  }

  resultDiv.innerHTML = '<p style="color:white">Loading...</p>';

  try {
    // Pake endpoint /api/ biar stabil + tambahin mode cors
    const apiUrl = `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl, { mode: 'cors' });
    const data = await res.json();

    if (data.code === 0 && data.data && data.data.music) {
      const mp3Link = data.data.music.play; 
      const title = data.data.title || "Audio TikTok";
      resultDiv.innerHTML = `
        <p style="color:white; font-size:13px; margin-bottom:5px;">${title}</p>
        <a href="${mp3Link}" download target="_blank">Download MP3 Sekarang</a>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red">Gagal: ${data.msg || 'Link tidak valid'}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = '<p style="color:red">Error: Gagal konek ke server. Coba link lain.</p>';
    console.log(err);
  }
});