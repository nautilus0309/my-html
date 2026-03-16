// 注册全局指令 v-marquee (从左到右连续循环)
Vue.directive('marquee', {
  inserted(el) {
    const container = el;

    const applyMarquee = () => {
      // 每次都重新获取内容元素，避免 DOM 更新后引用丢失
      const content = container.querySelector('.CAROUSELPRO');
      if (!content) return;

      const isOverflow = content.scrollWidth > container.clientWidth;
      const isActive = container.classList.contains('marquee-active');

      if (isOverflow && !isActive) {
        // 保存原始 HTML，便于恢复
        container._originalHTML = content.outerHTML;

        // 克隆两份内容，并强制设为行内块，使它们水平并排
        const clone1 = content.cloneNode(true);
        const clone2 = content.cloneNode(true);
        clone1.style.display = 'inline-block';
        clone2.style.display = 'inline-block';
        clone1.style.whiteSpace = 'pre';
        clone2.style.whiteSpace = 'pre';

        // 创建滚动包装器
        const wrapper = document.createElement('div');
        wrapper.style.display = 'inline-block';   // 包装器行内块，宽度由内容撑开
        wrapper.style.whiteSpace = 'nowrap';      // 禁止换行
        // 关键：使用 reverse 使动画方向相反，实现从左到右滚动（即从 -50% 到 0）
        wrapper.style.animation = 'marquee 10s linear infinite';
        wrapper.appendChild(clone1);
        wrapper.appendChild(clone2);

        // 替换容器内容
        container.innerHTML = '';
        container.appendChild(wrapper);
        container.classList.add('marquee-active');
        container.style.overflow = 'hidden';
      } else if (!isOverflow && isActive) {
        // 恢复原始内容
        if (container._originalHTML) {
          container.innerHTML = container._originalHTML;
        } else {
          // 保底：用文本重建（会丢失原有样式，建议确保 _originalHTML 存在）
          const text = content.innerText;
          container.innerHTML = `<a class="CAROUSELPRO" style="color: #202020; font-size: 100px; font-weight: 400; line-height: 116px; letter-spacing: 0.2em;">${text}</a>`;
        }
        container.classList.remove('marquee-active');
        container.style.overflow = 'hidden';
      }
    };

    // 初始检测
    applyMarquee();

    // 监听窗口大小变化
    window.addEventListener('resize', applyMarquee);
    el._marqueeResize = applyMarquee;
  },
  unbind(el) {
    window.removeEventListener('resize', el._marqueeResize);
  }
});