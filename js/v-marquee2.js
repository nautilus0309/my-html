// 注册全局指令 v-marquee (从左到右连续循环)
Vue.directive('marquee2', {
  inserted(el) {
    const container = el;

    const applyMarquee = () => {
      // 每次都重新获取内容元素，避免 DOM 更新后引用丢失
      const content = container.querySelector('.FZMSTFW');
      if (!content) return;
      console.log(content);
      console.log(content.scrollHeight);
      const isOverflow = content.scrollWidth > 300;
      const isActive = container.classList.contains('marquee2-active');

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
        wrapper.style.animation = 'marquee2 10s linear infinite';
        wrapper.appendChild(clone1);
        wrapper.appendChild(clone2);

        // 替换容器内容
        container.innerHTML = '';
        container.appendChild(wrapper);
        container.classList.add('marquee2-active');
        container.style.overflow = 'hidden';
      } else if (!isOverflow && isActive) {
        // 恢复原始内容
        if (container._originalHTML) {
          container.innerHTML = container._originalHTML;
        } else {
          // 保底：用文本重建（会丢失原有样式，建议确保 _originalHTML 存在）
          const text = content.innerText;
          container.innerHTML = `<a class="FZMSTFW" style="font-size: 35px; margin: 5px 0px 0 19px;
                                    text-decoration: underline;
                                    text-decoration-style: solid;
                                    text-underline-offset: 10px;
                                    font-weight: 400;
                                    font-style: Regular;
                                    line-height: 100%;
                                    letter-spacing: 20%;
                                    text-decoration-thickness: 2px;
                                    color: #F3E6DA;
                                    ">${text}</a>`;
        }
        container.classList.remove('marquee2-active');
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