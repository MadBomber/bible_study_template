// --- Storage helpers (mirrors progress.js key scheme) ---

function getStudyProgress(prefix) {
  try {
    const data = localStorage.getItem(`${prefix}_progress`)
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

// --- Progress key helpers (must match progress.js) ---

function sectionKey(s)      { return `s${s}` }
function weekOverviewKey(w) { return `w${w}overview` }
function dayKey(w, d)       { return `w${w}d${d}` }
function discussionKey(w)   { return `w${w}discussion` }

// --- Find next incomplete item in this study ---

function findNextItem(progress, studyConfig, studySlug, basePath) {
  const sections = studyConfig.sections || []

  for (const section of sections) {
    if (!progress[sectionKey(section.number)]) {
      return {
        url: `${basePath}/${studySlug}/${section.slug}/`,
        label: `Section ${section.number} Overview`,
      }
    }

    for (let w = section.weeks_start; w <= section.weeks_end; w++) {
      const wk = String(w).padStart(2, "0")
      const weekBase = `${basePath}/${studySlug}/${section.slug}/week-${wk}`

      if (!progress[weekOverviewKey(w)]) {
        return { url: `${weekBase}/overview/`, label: `Week ${w} Overview` }
      }
      for (let d = 1; d <= 5; d++) {
        if (!progress[dayKey(w, d)]) {
          return { url: `${weekBase}/day-${d}/`, label: `Week ${w}, Day ${d}` }
        }
      }
      if (!progress[discussionKey(w)]) {
        return { url: `${weekBase}/discussion/`, label: `Week ${w} Discussion` }
      }
    }
  }

  return null // study complete
}

// --- Count helpers ---

function completedCount(progress) {
  return Object.keys(progress).length
}

function totalItems(studyConfig) {
  const sections = studyConfig.sections || []
  const totalWeeks = studyConfig.total_weeks || 0
  return sections.length + (totalWeeks * 7)
}

// --- Hydrate study cards ---

document.addEventListener("DOMContentLoaded", () => {
  const basePath = (document.body?.dataset?.basePath || "").replace(/\/$/, "")

  document.querySelectorAll(".study-card[data-study-slug]").forEach(card => {
    const studySlug = card.dataset.studySlug
    const prefix    = card.dataset.storagePrefix

    let studyConfig = {}
    try { studyConfig = JSON.parse(card.dataset.config) } catch {}

    const progress = getStudyProgress(prefix)
    const count    = completedCount(progress)
    const total    = totalItems(studyConfig)

    if (count === 0) return

    // Has progress — render progress bar
    const pct        = total > 0 ? Math.round((count / total) * 100) : 0
    const progressEl = card.querySelector(".study-card-progress")
    if (progressEl) {
      progressEl.innerHTML =
        `<div class="study-progress-info">${count} of ${total} steps complete (${pct}%)</div>` +
        `<div class="study-progress-track">` +
        `<div class="study-progress-fill" style="width:${pct}%"></div>` +
        `</div>`
    }
  })
})
