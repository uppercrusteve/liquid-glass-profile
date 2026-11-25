// 液态玻璃的两个动态来源：指针位置驱动折射高光，卡片轻微倾斜。
// 只写 CSS 变量，不碰布局，指针移动不引起重排。
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function track(host) {
  let frame = 0;
  let px = 0.5;
  let py = 0.5;

  function paint() {
    frame = 0;
    host.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
    host.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
  }

  host.addEventListener("pointermove", (event) => {
    const box = host.getBoundingClientRect();
    px = (event.clientX - box.left) / box.width;
    py = (event.clientY - box.top) / box.height;
    if (!frame) frame = requestAnimationFrame(paint);
  });

  host.addEventListener("pointerleave", () => {
    px = 0.5;
    py = 0.5;
    if (!frame) frame = requestAnimationFrame(paint);
  });
}

document.querySelectorAll(".glass").forEach(track);

if (!reduce) {
  // 倾斜幅度很小，只够让边缘高光移动，不追求 3D 感
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const dx = (event.clientX - box.left) / box.width - 0.5;
      const dy = (event.clientY - box.top) / box.height - 0.5;
      card.style.transform =
        `translateY(-4px) scale(1.012) rotateX(${(-dy * 3).toFixed(2)}deg) rotateY(${(dx * 3).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
