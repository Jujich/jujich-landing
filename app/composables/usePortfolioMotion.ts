import { nextTick, onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

/** Progressive enhancement: the server-rendered page stays readable without motion. */
export function usePortfolioMotion(root: Ref<HTMLElement | null>, locale: Readonly<Ref<string>>) {
  let dispose = () => {}
  let mounted = false
  let generation = 0

  const refresh = async () => {
    const currentGeneration = ++generation
    dispose()
    dispose = () => {}
    if (!mounted) return
    await nextTick()
    if (!mounted || currentGeneration !== generation || !root.value) return

    const page = root.value
    const html = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(hover: hover) and (min-width: 861px)')
    const targets = [...page.querySelectorAll<HTMLElement>('[data-reveal], [data-split], .motto, .lens-block')]
    const removals: Array<() => void> = []
    const addedReveal: HTMLElement[] = []
    const originalStyles = new Map<HTMLElement, Map<string, string>>()
    const hadJs = html.classList.contains('js')
    const hadScrolled = html.classList.contains('scrolled')
    let observer: IntersectionObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    let frame = 0
    let alive = true

    const setVariable = (element: HTMLElement, property: string, value: string) => {
      let properties = originalStyles.get(element)
      if (!properties) originalStyles.set(element, properties = new Map())
      if (!properties.has(property)) properties.set(property, element.style.getPropertyValue(property))
      element.style.setProperty(property, value)
    }
    const reveal = (element: Element) => {
      element.classList.add('in')
      // Headings are animated as intact Vue-rendered nodes, never rewritten into words.
      if (element.hasAttribute('data-split')) element.classList.add('done')
      observer?.unobserve(element)
    }
    const revealVisible = () => {
      for (const element of targets) {
        if (element.classList.contains('in')) continue
        const bounds = element.getBoundingClientRect()
        if (bounds.top < window.innerHeight && bounds.bottom > 0) reveal(element)
      }
    }

    dispose = () => {
      alive = false
      observer?.disconnect()
      resizeObserver?.disconnect()
      cancelAnimationFrame(frame)
      removals.forEach(remove => remove())
      targets.forEach(reveal)
      addedReveal.forEach(element => element.removeAttribute('data-reveal'))
      for (const [element, properties] of originalStyles) {
        for (const [property, value] of properties) {
          if (value) element.style.setProperty(property, value)
          else element.style.removeProperty(property)
        }
      }
      html.classList.toggle('js', hadJs)
      html.classList.toggle('scrolled', hadScrolled)
    }

    reduced.addEventListener('change', refresh)
    desktop.addEventListener('change', refresh)
    removals.push(() => reduced.removeEventListener('change', refresh), () => desktop.removeEventListener('change', refresh))

    if (!reduced.matches && 'IntersectionObserver' in window) {
      // Reuse the reference's reveal styles without replacing text owned by Vue.
      page.querySelectorAll<HTMLElement>('[data-split]:not([data-reveal])').forEach(element => {
        element.setAttribute('data-reveal', '')
        addedReveal.push(element)
      })
      const siblings = new Map<Element | null, number>()
      page.querySelectorAll<HTMLElement>('[data-reveal="folder"]').forEach(element => {
        const index = siblings.get(element.parentElement) ?? 0
        siblings.set(element.parentElement, index + 1)
        setVariable(element, '--d', `${Math.min(index, 4) * 0.12}s`)
      })
      page.querySelectorAll<HTMLElement>('.motto .ln').forEach((element, index) => setVariable(element, '--li', String(index)))
      observer = new IntersectionObserver(entries => {
        if (!alive) return
        entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target) })
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })
      targets.forEach(element => {
        element.classList.remove('in', 'done')
        observer!.observe(element)
      })
      // Do not hide above-the-fold content while waiting for the first observer callback.
      revealVisible()
      html.classList.add('js')
    } else {
      targets.forEach(reveal)
    }

    const parallax = !reduced.matches && desktop.matches ? [...page.querySelectorAll<HTMLElement>('[data-parallax]')] : []
    const marquees = !reduced.matches ? [...page.querySelectorAll<HTMLElement>('[data-marquee]')] : []
    const update = () => {
      frame = 0
      if (!alive) return
      if (window.scrollY > 60) html.classList.add('scrolled')
      else if (window.scrollY < 10) html.classList.remove('scrolled')
      // Also reveal on scrolling/focus if an observer notification arrives late.
      revealVisible()
      const height = window.innerHeight
      for (const element of parallax) {
        const bounds = element.getBoundingClientRect()
        const speed = Number.parseFloat(element.dataset.parallax ?? '')
        if (!Number.isFinite(speed) || bounds.bottom < -200 || bounds.top > height + 200) continue
        const previous = Number.parseFloat(element.style.getPropertyValue('--py')) || 0
        const centre = bounds.top - previous + bounds.height / 2 - height / 2
        setVariable(element, '--py', `${(-centre * speed).toFixed(1)}px`)
      }
      for (const element of marquees) {
        if (!element.parentElement) continue
        const bounds = element.parentElement.getBoundingClientRect()
        const progress = (height - bounds.top) / (height + bounds.height)
        const speed = Number.parseFloat(element.dataset.marquee ?? '')
        if (!Number.isFinite(speed) || progress < -0.2 || progress > 1.2) continue
        setVariable(element, '--mx', `${((progress - 0.5) * speed * window.innerWidth).toFixed(1)}px`)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      targets.filter(element => element.contains(event.target as Element)).forEach(reveal)
      schedule()
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    page.addEventListener('focusin', onFocus)
    removals.push(() => window.removeEventListener('scroll', schedule), () => window.removeEventListener('resize', schedule), () => page.removeEventListener('focusin', onFocus))

    // Optional outline SVGs are declared in Vue; only their geometry is enhanced here.
    const folders = [...page.querySelectorAll<HTMLElement>('.project-folder, .supporting-project')]
    const drawOutline = (folder: HTMLElement) => {
      const body = folder.querySelector<HTMLElement>('.folder-body')
      const notch = folder.querySelector<SVGElement>('.folder-notch')
      const label = folder.querySelector<HTMLElement>('.folder-label')
      const svg = folder.querySelector<SVGSVGElement>(':scope > .folder-outline')
      const path = svg?.querySelector('path')
      if (!body || !notch || !label || !svg || !path) return
      const f = folder.getBoundingClientRect(), b = body.getBoundingClientRect(), n = notch.getBoundingClientRect(), l = label.getBoundingClientRect()
      if (!f.width || !f.height) return
      const radius = Number.parseFloat(getComputedStyle(body).borderTopLeftRadius) || 0
      const labelRadius = Number.parseFloat(getComputedStyle(label).borderBottomRightRadius) || 0
      const width = b.width, height = b.bottom - f.top, top = b.top - f.top, tabBottom = l.bottom - f.top
      const notchX = n.left - f.left, labelX = l.left - f.left, labelRight = l.right - f.left
      svg.setAttribute('viewBox', `0 0 ${f.width} ${f.height}`)
      path.setAttribute('pathLength', '1')
      path.setAttribute('d', `M${radius},${top} H${width - radius} A${radius},${radius} 0 0 1 ${width},${top + radius} V${tabBottom - labelRadius} A${labelRadius},${labelRadius} 0 0 1 ${labelRight - labelRadius},${tabBottom} H${labelX} C${notchX + n.width / 2},${tabBottom} ${notchX + n.width / 2},${height} ${notchX},${height} H${radius} A${radius},${radius} 0 0 1 0,${height - radius} V${top + radius} A${radius},${radius} 0 0 1 ${radius},${top} Z`)
    }
    if (!reduced.matches && desktop.matches && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => { if (alive) folders.forEach(drawOutline) })
      folders.forEach(folder => resizeObserver!.observe(folder))
    }
    update()
  }

  watch([root, locale], refresh, { flush: 'post' })
  onMounted(() => { mounted = true; void refresh() })
  onBeforeUnmount(() => { mounted = false; generation++; dispose() })
  return { refresh }
}
