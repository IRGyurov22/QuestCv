const revealItems = document.querySelectorAll(".reveal");
const skillButtons = document.querySelectorAll(".skill");
const filterButtons = document.querySelectorAll("[data-filter]");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const themeToggle = document.getElementById("themeToggle");
const downloadBtn = document.getElementById("downloadBtn");
const progress = document.getElementById("progress");
const backTop = document.getElementById("backTop");
const navLinks = document.querySelectorAll(".nav-links a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

if (revealItems.length > 0) {
  revealItems.forEach((item) => observer.observe(item));
}

if (skillButtons.length > 0) {
  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
    });
  });
}

if (filterButtons.length > 0 && skillButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      skillButtons.forEach((skill) => {
        if (filter === "all" || skill.dataset.level === filter) {
          skill.style.display = "block";
        } else {
          skill.style.display = "none";
        }
      });
    });
  });
}

let usesBackend = false;
if (contactForm) {
  usesBackend = contactForm.dataset.backend === "true";
  if (!usesBackend) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (formNote) {
        formNote.textContent = "Thanks! Your message is saved in your browser only.";
      }

      const formData = new FormData(contactForm);
      const stored = Object.fromEntries(formData.entries());
      localStorage.setItem("contactDraft", JSON.stringify(stored));

      contactForm.reset();
    });
  }
}

if (contactForm && !usesBackend) {
  const saved = localStorage.getItem("contactDraft");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.entries(data).forEach(([key, value]) => {
        const field = contactForm.querySelector(`[name="${key}"]`);
        if (field) {
          field.value = value;
        }
      });
    } catch (error) {
      localStorage.removeItem("contactDraft");
    }
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("focus");
    themeToggle.textContent = document.body.classList.contains("focus")
      ? "Relax Mode"
      : "Focus Mode";
  });
}

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    window.open("/cv", "_blank");
  });
}

const downloadPdf = document.getElementById("downloadPdf");
if (downloadPdf) {
  downloadPdf.addEventListener("click", () => {
    window.print();
  });
}

if (navLinks.length > 0) {
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  navLinks.forEach((link) => {
    const targetPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");
    if (targetPath === currentPath) {
      link.classList.add("active");
    }
  });
}

const updateScrollUI = () => {
  if (progress) {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progress.style.width = `${ratio}%`;
  }

  if (backTop) {
    if (window.scrollY > 400) {
      backTop.classList.add("visible");
    } else {
      backTop.classList.remove("visible");
    }
  }
};

window.addEventListener("scroll", updateScrollUI);
window.addEventListener("load", updateScrollUI);

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
