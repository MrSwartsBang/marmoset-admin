(function (window, document, undefined) {
	'use strict';

	setTimeout(function () {
		console.log("==========================================================");
		/*==============================
		Header
		==============================*/
		if (document.querySelector('.header')) {
			var headerBtn = document.querySelector('.header__btn');
			var headerNav = document.querySelector('.header__nav');
			var header = document.querySelector('.header');

			headerBtn.addEventListener('click', function () {
				headerBtn.classList.toggle('header__btn--active');
				headerNav.classList.toggle('header__nav--active');

				if (window.scrollY === 0) {
					header.classList.toggle('header--active');
				}
			});

			window.addEventListener('scroll', function () {
				var header = document.querySelector('.header');
				if (window.scrollY > 0) {
					header.classList.add('header--active');
				} else {
					header.classList.remove('header--active');
				}
			});
			window.dispatchEvent(new Event('scroll'));
		}

		/*==============================
		Filter
		==============================*/
		if (document.querySelector('.mfilter')) {
			var mfilterBtn = document.querySelector('.filter__menu');
			var mfilterClose = document.querySelector('.mfilter__close');
			var mfilter = document.querySelector('.mfilter');

			function toggleMfilter() {
				mfilter.classList.toggle('mfilter--active');
			}

			mfilterBtn.addEventListener('click', toggleMfilter);
			mfilterClose.addEventListener('click', toggleMfilter);
		}

		/*==============================
		Carousel
		==============================*/
		if (document.querySelector('.hero__slider')) {
			new Splide('.hero__slider', {
				type: 'loop',
				perPage: 1,
				drag: true,
				pagination: true,
				speed: 1600,
				gap: 24,
				arrows: false,
				focus: 0,
				autoplay: true,
				interval: 6000,
				autoHeight: true,
				breakpoints: {
					767: {
						gap: 20,
					}
				}
			}).mount();
		}

		if (document.querySelector('.section__carousel--content')) {
			var elms = document.getElementsByClassName('section__carousel--content');

			for (var i = 0; i < elms.length; i++) {
				new Splide(elms[i], {
					type: 'loop',
					perPage: 3,
					drag: true,
					pagination: false,
					autoWidth: false,
					autoHeight: false,
					speed: 800,
					gap: 24,
					arrows: false,
					focus: 0,
					breakpoints: {
						767: {
							gap: 20,
							autoHeight: true,
							pagination: true,
							arrows: false,
							perPage: 1,
						},
						991: {
							autoHeight: true,
							pagination: true,
							arrows: false,
							perPage: 2,
						},
						1199: {
							autoHeight: true,
							pagination: true,
							arrows: false,
							perPage: 2,
						},
					}
				}).mount();
			}
		}

		if (document.querySelector('.section__carousel--block')) {
			var elms = document.getElementsByClassName('section__carousel--block');

			for (var i = 0; i < elms.length; i++) {
				new Splide(elms[i], {
					type: 'loop',
					perPage: 3,
					drag: true,
					pagination: false,
					autoWidth: false,
					autoHeight: true,
					speed: 800,
					gap: 30,
					arrows: false,
					focus: 0,
					breakpoints: {
						767: {
							gap: 20,
							pagination: true,
							arrows: false,
							perPage: 1,
						},
						991: {
							pagination: true,
							arrows: false,
							perPage: 2,
						},
						1199: {
							pagination: true,
							arrows: false,
							perPage: 3,
						},
					}
				}).mount();
			}
		}

		/*==============================
		Game details
		==============================*/
		if (document.querySelector('.details__slider')) {
			var details = new Splide('.details__slider', {
				type: 'loop',
				drag: true,
				pagination: false,
				speed: 800,
				gap: 15,
				arrows: false,
				focus: 0,
			});

			var thumbnails = document.getElementsByClassName("thumbnail");
			var current;

			for (var i = 0; i < thumbnails.length; i++) {
				initThumbnail(thumbnails[i], i);
			}

			function initThumbnail(thumbnail, index) {
				thumbnail.addEventListener("click", function () {
					details.go(index);
				});
			}

			details.on("mounted move", function () {
				var thumbnail = thumbnails[details.index];

				if (thumbnail) {
					if (current) {
						current.classList.remove("is-active");
					}

					thumbnail.classList.add("is-active");
					current = thumbnail;
				}
			});

			details.mount();
		}

		/*==============================
		Chart
		==============================*/
		if (document.querySelector('#myChart')) {
			const data = {
				labels: ['Liquidity', 'Public Sale', 'Strategic', 'Private', 'Seed', 'Team', 'Strategic Reserve', 'Advisors', 'Community'],
				datasets: [{
					data: [10, 6, 9, 12, 9, 10, 19, 5, 20],
					backgroundColor: [
						'rgba(232, 193, 137, 0.9)',
						'rgba(140, 122, 209, 0.9)',
						'rgba(243, 239, 189, 0.9)',
						'rgba(34, 127, 158, 0.9)',
						'rgba(99, 120, 214, 0.9)',
						'rgba(224, 118, 182, 0.9)',
						'rgba(232, 209, 137, 0.9)',
						'rgba(121, 220, 155, 0.9)',
						'rgba(170, 114, 206, 0.9)',
					],
					borderWidth: 0
				}]
			};

			const getOrCreateTooltip = (chart) => {
				let tooltipEl = chart.canvas.parentNode.querySelector('div');

				if (!tooltipEl) {
					tooltipEl = document.createElement('div');
					tooltipEl.style.background = 'rgba(20, 26, 42, 0.7)';
					tooltipEl.style.borderRadius = '12px';
					tooltipEl.style.color = 'white';
					tooltipEl.style.opacity = 1;
					tooltipEl.style.pointerEvents = 'none';
					tooltipEl.style.position = 'absolute';
					tooltipEl.style.transform = 'translate(-50%, 0)';
					tooltipEl.style.transition = 'all .4s ease';

					const table = document.createElement('table');
					table.style.margin = '0px';

					tooltipEl.appendChild(table);
					chart.canvas.parentNode.appendChild(tooltipEl);
				}

				return tooltipEl;
			};

			const externalTooltipHandler = (context) => {
				// Tooltip Element
				const { chart, tooltip } = context;
				const tooltipEl = getOrCreateTooltip(chart);

				// Hide if no tooltip
				if (tooltip.opacity === 0) {
					tooltipEl.style.opacity = 0;
					return;
				}

				// Set Text
				if (tooltip.body) {
					const titleLines = tooltip.title || [];
					const bodyLines = tooltip.body.map(b => b.lines);

					const tableHead = document.createElement('thead');

					titleLines.forEach(title => {
						const tr = document.createElement('tr');
						tr.style.borderWidth = 0;

						const th = document.createElement('th');
						th.style.borderWidth = 0;
						const text = document.createTextNode(title);

						th.appendChild(text);
						tr.appendChild(th);
						tableHead.appendChild(tr);
					});

					const tableBody = document.createElement('tbody');
					bodyLines.forEach((body, i) => {
						const colors = tooltip.labelColors[i];

						const span = document.createElement('span');
						span.style.background = colors.backgroundColor;
						span.style.borderColor = colors.borderColor;
						span.style.borderWidth = '0px';
						span.style.marginRight = '6px';
						span.style.height = '12px';
						span.style.width = '12px';
						span.style.borderRadius = '50%';
						span.style.display = 'inline-block';
						span.style.lineHeight = '100%';

						const tr = document.createElement('tr');
						tr.style.backgroundColor = 'inherit';
						tr.style.borderWidth = 0;

						const td = document.createElement('td');
						td.style.borderWidth = 0;

						const text = document.createTextNode(body);

						td.appendChild(span);
						td.appendChild(text);
						tr.appendChild(td);
						tableBody.appendChild(tr);
					});

					const tableRoot = tooltipEl.querySelector('table');

					// Remove old children
					while (tableRoot.firstChild) {
						tableRoot.firstChild.remove();
					}

					// Add new children
					tableRoot.appendChild(tableHead);
					tableRoot.appendChild(tableBody);
				}

				const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

				// Display, position, and set styles for font
				tooltipEl.style.opacity = 1;
				tooltipEl.style.left = positionX + tooltip.caretX + 'px';
				tooltipEl.style.top = positionY + tooltip.caretY + 'px';
				tooltipEl.style.font = tooltip.options.bodyFont.string;
				tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
			};

			const config = {
				type: 'doughnut',
				data: data,
				options: {
					responsive: true,
					plugins: {
						legend: false,
						tooltip: {
							enabled: false,
							position: 'nearest',
							external: externalTooltipHandler
						}
					},
				},
			};

			const myChart = new Chart(
				document.getElementById('myChart'),
				config
			);
		}

		/*==============================
		Canvas
		==============================*/
		if (document.querySelector('.hero__canvas')) {
			VANTA.CELLS({
				el: "#canvas",
				mouseControls: false,
				touchControls: false,
				gyroControls: false,
				minHeight: 200.00,
				minWidth: 200.00,
				scale: 1.00,
				color1: 0x227f9e,
				color2: 0xaa72ce,
				size: 4.00,
				speed: 1.00
			})
		}

		if (document.querySelector('.section__canvas')) {
			VANTA.CELLS({
				el: "#canvas2",
				mouseControls: false,
				touchControls: false,
				gyroControls: false,
				minHeight: 200.00,
				minWidth: 200.00,
				scale: 1.00,
				color1: 0x227f9e,
				color2: 0xaa72ce,
				size: 3.00,
				speed: 1.00
			})
		}

		/*==============================
		Scrollbar
		==============================*/
		var Scrollbar = window.Scrollbar;

		if (document.querySelector('.ranking')) {
			Scrollbar.init(document.querySelector('.ranking'), {
				damping: 0.1,
				renderByPixels: true,
				alwaysShowTracks: true,
				continuousScrolling: true
			});
		}

		if (document.querySelector('.play__text')) {
			Scrollbar.init(document.querySelector('.play__text'), {
				damping: 0.1,
				renderByPixels: true,
				alwaysShowTracks: true,
				continuousScrolling: true
			});
		}

		/*==============================
		Gallery
		==============================*/
		if (document.querySelector('#gallery')) {
			document.getElementById('gallery').onclick = function (event) {
				event = event || window.event
				var target = event.target || event.srcElement
				var link = target.src ? target.parentNode : target
				var options = {
					index: link,
					event: event,
					titleElement: 'h4',
					transitionDuration: 500,
					onopen: function () {
						if (window.innerWidth > 1200) {
							var body = document.querySelector('body');
							var header = document.querySelector('.header');
							var scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
							body.style.paddingRight = scrollBarWidth + "px";
							header.style.paddingRight = scrollBarWidth + "px";
						}
					},
					onclosed: function () {
						if (window.innerWidth > 1200) {
							var body = document.querySelector('body');
							var header = document.querySelector('.header');
							body.style.paddingRight = '';
							header.style.paddingRight = '';
						}
					},
				}
				var links = this.getElementsByTagName('a')
				blueimp.Gallery(links, options)
			}
		}

		/*==============================
		Modal
		==============================*/
		if (document.querySelector('#modal-wallet')) {
			const myModalEl = document.getElementById('modal-wallet');

			myModalEl.addEventListener('show.bs.modal', event => {
				if (window.innerWidth > 1200) {
					var header = document.querySelector('.header');
					var scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
					header.style.paddingRight = scrollBarWidth + "px";
				}
			});

			myModalEl.addEventListener('hidden.bs.modal', event => {
				if (window.innerWidth > 1200) {
					var header = document.querySelector('.header');
					header.style.paddingRight = '';
				}
			});
		}

		/*==============================
		Select
		==============================*/
		if (document.querySelector('#filter__status')) {
			new SlimSelect({
				select: '#filter__status',
				settings: {
					showSearch: false,
				}
			});
		}

		if (document.querySelector('#filter__category')) {
			new SlimSelect({
				select: '#filter__category'
			});
		}

		if (document.querySelector('#filter__devices')) {
			new SlimSelect({
				select: '#filter__devices'
			});
		}

		if (document.querySelector('#filter__blockchain')) {
			new SlimSelect({
				select: '#filter__blockchain'
			});
		}

		if (document.querySelector('#mfilter__status')) {
			new SlimSelect({
				select: '#mfilter__status',
				settings: {
					showSearch: false,
				}
			});
		}

		if (document.querySelector('#mfilter__category')) {
			new SlimSelect({
				select: '#mfilter__category'
			});
		}

		if (document.querySelector('#mfilter__devices')) {
			new SlimSelect({
				select: '#mfilter__devices'
			});
		}

		if (document.querySelector('#mfilter__blockchain')) {
			new SlimSelect({
				select: '#mfilter__blockchain'
			});
		}

		/* add page */
		if (document.querySelector('#form__status')) {
			new SlimSelect({
				select: '#form__status',
				settings: {
					showSearch: false,
				}
			});
		}

		if (document.querySelector('#form__blockchain')) {
			new SlimSelect({
				select: '#form__blockchain',
				settings: {
					placeholderText: 'Select blockchains',
				}
			});
		}

		if (document.querySelector('#form__devices')) {
			new SlimSelect({
				select: '#form__devices',
				settings: {
					placeholderText: 'Select devices',
				}
			});
		}

		if (document.querySelector('#form__ftp')) {
			new SlimSelect({
				select: '#form__ftp',
				settings: {
					showSearch: false,
				}
			});
		}

		if (document.querySelector('#form__pte')) {
			new SlimSelect({
				select: '#form__pte',
				settings: {
					showSearch: false,
				}
			});
		}

		if (document.querySelector('#form__genres')) {
			new SlimSelect({
				select: '#form__genres',
				settings: {
					placeholderText: 'Select genres',
				}
			});
		}

		/*==============================
		Upload gallery
		==============================*/
		if (document.querySelector('.form__gallery-upload')) {
			var galleryUpload = document.querySelector('.form__gallery-upload');

			galleryUpload.addEventListener('change', function (event) {
				var length = event.target.files.length;
				var galleryLabel = galleryUpload.getAttribute('data-name');
				var label = document.querySelector(galleryLabel);

				if (length > 1) {
					label.textContent = length + " files selected";
				} else {
					label.textContent = event.target.files[0].name;
				}
			});
		}

		/*==============================
		Tooltip
		==============================*/
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
	}, 1000);

})(window, document);