class Carousel {
    constructor(p) {
        let settings = (() => ({ ...{ containerID: '#carousel', slideID: '.slide', interval: 5000, isPlaying: true }, ...p }))();

        this.container = document.querySelector(settings.containerID);
        this.slides = this.container.querySelectorAll(settings.slideID);

        this.interval = settings.interval;
        this.isPlaying = settings.isPlaying;
    }

    _initProps() {
        this.CODE_SPACE = 'Space';
        this.CODE_ARROW_LEFT = 'ArrowLeft';
        this.CODE_ARROW_RIGHT = 'ArrowRight';

        this.FA_PAUSE = '<i class="far fa-pause-circle fa-4x"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle fa-4x"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left fa-4x"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right fa-4x"></i>';


        this.slidesCount = this.slides.length;
        this.currentSlide = 0;
        this.timerID = null;
    }

    _initControls() {
        const controls = document.createElement('div');
        const PAUSE = `<div id="pause" class="control">${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}</div>`;
        const PREV = `<div id="prev" class="control">${this.FA_PREV}</div>`;
        const NEXT = `<div id="next" class="control">${this.FA_NEXT}</div>`;

        controls.setAttribute('class', 'controls');
        controls.innerHTML = PREV + PAUSE + NEXT;


        this.container.appendChild(controls);

        this.pauseBtn = this.container.querySelector('#pause');
        this.prevBtn = this.container.querySelector('#prev');
        this.nextBtn = this.container.querySelector('#next');
    }

    _initIndicators() {
        const indicators = document.createElement('div');

        indicators.setAttribute('class', 'indicators');

        for (let i = 0, n = this.slidesCount; i < n; i++) {
            const indicator = document.createElement('div');

            indicator.setAttribute('class', 'indicator');
            indicator.dataset.slideTo = `${i}`;
            i === 0 && indicator.classList.add('active');

            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);

        this.indicatorsContainer = this.container.querySelector('.indicators');
        this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    }

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
    }

    gotoSlide(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.indicators[this.currentSlide].classList.toggle('active');
        this.slides[this.currentSlide].classList.toggle('active');
    }

    prevSlide() {
        this.gotoSlide(this.currentSlide - 1);
    }

    nextSlide() {
        this.gotoSlide(this.currentSlide + 1);
    }

    prev() {
        this.pause();
        this.prevSlide();
    }

    next() {
        this.pause();
        this.nextSlide();
    }

    pause() {
        if (this.isPlaying) {
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaying = false;
            clearInterval(this.timerID);
        }
    }

    play() {
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaying = true;
        this.timerID = setInterval(() => this.nextSlide(), this.interval);
    }

    pausePlay() {
        this.isPlaying ? this.pause() : this.play();
    }

    indicate(e) {
        const target = e.target;

        if (target && target.classList.contains('indicator')) {
            this.pause();
            this.gotoSlide(+target.dataset.slideTo);
        }
    }

    pressKey(e) {
        if (e.code === this.CODE_ARROW_LEFT) this.prev();
        if (e.code === this.CODE_ARROW_RIGHT) this.next();
        if (e.code === this.CODE_SPACE) this.pausePlay();
    }

    init() {
        this._initProps();
        this._initIndicators();
        this._initControls();
        this._initListeners();
        // this.timerID = setInterval(this.nextSlide.bind(this), 2000); - / как вариант /
        if (this.isPlaying) this.timerID = setInterval(() => this.nextSlide(), this.interval);
    }
}

class SwipeCarousel extends Carousel {
    _initListeners() {
        super._initListeners();
        this.container.addEventListener('touchstart', this.swipeStart.bind(this));
        this.container.addEventListener('touchend', this.swipeEnd.bind(this));
    }

    swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].clientX;
    }
пше  
    swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].clientX;
        this.swipeStartX - this.swipeEndX > 100 && this.next();
        this.swipeStartX - this.swipeEndX < -100 && this.prev();
    }
}








