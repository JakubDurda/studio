// Turns the "Slider" pattern (a group of Cover blocks) into a cross-fading slideshow:
// dots, swipe on touch screens, autoplay that pauses on hover/interaction.
;(() => {
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	document.querySelectorAll('.studio-slider').forEach((slider) => {
		const track = slider.querySelector('.studio-slider__track')
		const slides = track ? [...track.children] : []
		if (slides.length < 2) return

		const dots = document.createElement('div')
		dots.className = 'studio-slider__dots'
		slides.forEach((_, i) => {
			const b = document.createElement('button')
			b.type = 'button'
			b.setAttribute('aria-label', `Slajd ${i + 1}`)
			b.addEventListener('click', () => show(i, true))
			dots.appendChild(b)
		})
		slider.appendChild(dots)

		let current = 0
		let paused = false
		function show(i, byUser) {
			current = (i + slides.length) % slides.length
			slides.forEach((s, j) => {
				s.classList.toggle('is-active', j === current)
				s.setAttribute('aria-hidden', String(j !== current))
			})
			;[...dots.children].forEach((d, j) => d.setAttribute('aria-current', String(j === current)))
			if (byUser) paused = true
		}

		// Swipe: horizontal drags change the slide, vertical ones still scroll the page.
		let startX = null
		slider.addEventListener('pointerdown', (e) => (startX = e.clientX))
		slider.addEventListener('pointerup', (e) => {
			if (startX === null) return
			const dx = e.clientX - startX
			startX = null
			if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1), true)
		})
		slider.addEventListener('mouseenter', () => (paused = true))
		slider.addEventListener('mouseleave', () => (paused = false))

		show(0)
		slider.classList.add('is-ready')
		if (!reduceMotion) setInterval(() => !paused && !document.hidden && show(current + 1), 6000)
	})
})()
