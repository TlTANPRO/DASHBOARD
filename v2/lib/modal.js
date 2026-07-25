// lib/modal.js — reusable modal (focus trap, esc close, restore focus)

let activeModal = null;
let previousFocus = null;

export function openModal({ title, body, actions = [], onClose = null, className = "" }) {
  closeModal(); // close any open

  previousFocus = document.activeElement;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-labelledby", `modal-title-${Date.now()}`);

  const modal = document.createElement("div");
  modal.className = `modal ${className}`;
  modal.innerHTML = `
    <h2 class="modal-title" id="${backdrop.getAttribute("aria-labelledby")}">${escapeHTML(title)}</h2>
    <div class="modal-body"></div>
    <div class="modal-actions"></div>
  `;

  // body can be string, HTMLElement, or function returning either
  const bodyEl = modal.querySelector(".modal-body");
  if (typeof body === "string") {
    bodyEl.innerHTML = body;
  } else if (body instanceof HTMLElement) {
    bodyEl.appendChild(body);
  } else if (typeof body === "function") {
    const result = body(bodyEl);
    if (result instanceof HTMLElement) bodyEl.appendChild(result);
    else if (typeof result === "string") bodyEl.innerHTML = result;
  }

  // actions
  const actionsEl = modal.querySelector(".modal-actions");
  if (actions.length === 0) {
    const closeBtn = document.createElement("button");
    closeBtn.className = "btn btn-ghost";
    closeBtn.textContent = "Tutup";
    closeBtn.addEventListener("click", closeModal);
    actionsEl.appendChild(closeBtn);
  } else {
    actions.forEach((a) => {
      const btn = document.createElement("button");
      btn.className = `btn ${a.variant || "btn-outline"}`;
      btn.textContent = a.label;
      if (a.disabled) btn.disabled = true;
      btn.addEventListener("click", async () => {
        if (a.onClick) {
          const result = await a.onClick(modal);
          if (result !== false) closeModal();
        } else {
          closeModal();
        }
      });
      actionsEl.appendChild(btn);
    });
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  document.body.style.overflow = "hidden";

  // Focus trap
  const focusable = () =>
    modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  const first = focusable()[0];
  if (first) setTimeout(() => first.focus(), 50);

  // Esc to close, backdrop click to close
  const keyHandler = (e) => {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "Tab") {
      const items = Array.from(focusable());
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }
  };
  document.addEventListener("keydown", keyHandler);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  activeModal = { backdrop, onClose, keyHandler };
}

export function closeModal() {
  if (!activeModal) return;
  const { backdrop, onClose, keyHandler } = activeModal;
  document.removeEventListener("keydown", keyHandler);
  document.body.style.overflow = "";
  backdrop.style.opacity = "0";
  setTimeout(() => {
    backdrop.remove();
    if (previousFocus && previousFocus.focus) previousFocus.focus();
    if (onClose) onClose();
  }, 200);
  activeModal = null;
}

export function confirmDialog({ title, body, danger = false, confirmLabel = "Konfirmasi", cancelLabel = "Batal" }) {
  return new Promise((resolve) => {
    openModal({
      title,
      body: `<p>${escapeHTML(body)}</p>`,
      className: danger ? "modal-danger" : "",
      actions: [
        { label: cancelLabel, variant: "btn-ghost", onClick: () => resolve(false) },
        {
          label: confirmLabel,
          variant: danger ? "btn-danger" : "btn-primary",
          onClick: () => resolve(true),
        },
      ],
    });
  });
}

function escapeHTML(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
