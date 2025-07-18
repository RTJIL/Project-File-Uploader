document.querySelectorAll(".share-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const folderId = btn.dataset.folderId;

    try {
      const res = await fetch(`/share/${folderId}/share`, {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json();
        return alert(error.message || "Error generating share link");
      }

      const data = await res.json();
      const msg = `🔗 Share URL:\n${data.shareUrl}\n\n⏳ Expires: ${new Date(data.expiresAt).toLocaleString()}`;
      navigator.clipboard.writeText(data.shareUrl);
      alert(msg + "\n\n✅ Copied to clipboard!");
    } catch (err) {
      console.error("Share error:", err);
      alert("Something went wrong sharing this folder.");
    }
  });
});
