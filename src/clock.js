(() => {
    let clock = {
        SECOND_IN_MILLISECONDS: 1000,
        TOTAL_DEGREES: 360,
        titleTextForPageInFocus: 'Онлайн часы',
        elements: {},
        controls: {},
        CSS_DISPLAY_STATE_CLASSES: {
            none: 'display-none',
            hidden: 'hidden',
            disabled: 'disabled'
        },
        MONTHS: [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря',
        ],
        WEEK_DAYS: [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота'
        ],
        settings:{
            mode: 'digital',
            format: 24,
            syncIntervalInMinutes: 5
        },
        citiesOptions: {
            optionsTemplate: '<option id="calculated-area">Мой (часовой пояс по ip)</option>',
            cities: [ 
                {name: 'Екатеринбург', timeZone: 'Asia/Yekaterinburg'}, 
                {name: 'Нижневартовск', timeZone: 'Asia/Yekaterinburg'}, 
                {name: 'Омск', timeZone: 'Asia/Omsk'},
                {name: 'Санкт-Петербург', timeZone: 'Europe/Moscow'},
                {name: 'Якутск', timeZone: 'Asia/Yakutsk'}
            ]
        },
        createApplicationMarkup: function () {
            const MARKUP = `
            <section class="clock">
                <div class="clock__output">
                    <div class="clock__modes">
                        <div id="digital" class="clock__item  clock__item--digital">
                            <div id="digital-hours" class="clock__digital-unit  clock__digital-unit--hours"></div>
                            <div class="clock__digital-separator">:</div>
                            <div id="digital-minutes" class="clock__digital-unit  clock__digital-unit--minutes"></div>
                            <div class="clock__digital-separator">:</div>
                            <div id="digital-seconds" class="clock__digital-unit  clock__digital-unit--seconds"></div>
                            <div id="ampm-state" class="clock__digital-ampm-state"></div>
                        </div>
                        <div id="analog" class="clock__item  clock__item--analog">
                            <ol class="clock__analog-hours">
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                                <li class="clock__analog-hour-item"></li>
                            </ol>
                            <div class="clock__arrows-container">
                                <div id="hour-arrow" class="clock__arrow-item-container">
                                    <div class="clock__arrow  clock__arrow--hours"></div>
                                </div>
                                <div id="minute-arrow" class="clock__arrow-item-container">
                                    <div class="clock__arrow  clock__arrow--minutes"></div>
                                </div>
                                <div id="second-arrow" class="clock__arrow-item-container">
                                    <div class="clock__arrow  clock__arrow--seconds"></div>
                                </div>
                            </div>
                        </div>
                        <div id="date" class="clock__date"></div>
                    </div>
                </div>
                <div class="clock__settings-container">
                    <div class="clock__parameter-wrapper" id="mode-select-btns">
                        <div class="clock__parameter-description">Вид:</div>
                        <input type="radio" name="mode" id="digital-mode" class="clock__radio" value="digital">
                        <label for="digital-mode" class="clock__parameter-label">Цифровые</label>
                        <input type="radio" name="mode" id="analog-mode" class="clock__radio" value="analog">
                        <label for="analog-mode" class="clock__parameter-label">Аналоговые</label>
                    </div>
                    <div class="clock__parameter-wrapper" id="format-select-btns">
                        <div class="clock__parameter-description">Формат:</div>
                        <input type="radio" name="format" id="full-format" class="clock__radio" value="24">
                        <label for="full-format" class="clock__parameter-label">24 часа</label>
                        <input type="radio" name="format" id="ampm-format" class="clock__radio" value="12">
                        <label for="ampm-format" class="clock__parameter-label">12 часов</label>
                    </div>
                    <div class="clock__parameter-wrapper">
                        <div class="clock__parameter-description">Город:</div>
                        <select class="clock__city-selelect" id="area-select"></select> 
                    </div>
                </div>
            </section>`; /* Вообще я не сторонник использования select ввиду не до конца идентичного их вида в разных браузерах,
            и предпочитаю использовать "псевдоселект" из списка внутри блока */
            this.elements.CLOCK_CONTAINER.innerHTML = MARKUP;
            this.defineElementsAndControls();
        },
        defineElementsAndControls: function () {
            this.elements.DOCUMENT_TITLE = document.querySelector('title');
            this.elements.DOCUMENT_BODY = document.querySelector('body');
            this.elements.DIGITAL_CLOCK = document.getElementById('digital');
            this.elements.ANALOG_CLOCK = document.getElementById('analog');
            this.elements.DIGITAL_CLOCK_HOURS = document.getElementById('digital-hours');
            this.elements.DIGITAL_CLOCK_MINUTES = document.getElementById('digital-minutes');
            this.elements.DIGITAL_CLOCK_SECONDS = document.getElementById('digital-seconds');
            this.elements.HOUR_ARROW = document.getElementById('hour-arrow');
            this.elements.MINUTE_ARROW = document.getElementById('minute-arrow');
            this.elements.SECOND_ARROW = document.getElementById('second-arrow');
            this.elements.FORMAT_SETTING_CONTAINER = document.getElementById('format-select-btns');
            this.elements.AMPM_STATE = document.getElementById('ampm-state');
            this.elements.DATE = document.getElementById('date');
            this.controls.MODE_TOGGLE_BTNS = document.querySelectorAll('#mode-select-btns input[name="mode"]');
            this.controls.FORMAT_TOGGLE_BTNS = document.querySelectorAll('#format-select-btns input[name="format"]');
            this.controls.AREA_SELECT = document.getElementById('area-select');
            this.setInitState();
        },
        setInitState: function () {
            if(this.settings.mode === 'digital') {
                this.elements.ANALOG_CLOCK.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#digital-mode').checked = true;
            } else if (this.settings.mode === 'analog') {
                this.elements.FORMAT_SETTING_CONTAINER.classList.add(this.CSS_DISPLAY_STATE_CLASSES.disabled);
                for(let i = 0; i < this.controls.FORMAT_TOGGLE_BTNS.length; i++) {
                    this.controls.FORMAT_TOGGLE_BTNS[i].setAttribute('disabled', true);
                }
                this.elements.DIGITAL_CLOCK.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#analog-mode').checked = true;
            }
            if(this.settings.format == 24) {
                this.elements.AMPM_STATE.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#full-format').checked = true;
            } else if (this.settings.format == 12) {
                document.querySelector('#ampm-format').checked = true;
            }
            this.citiesOptions.cities.forEach((item) => {
                this.citiesOptions.optionsTemplate += `<option value="${item.timeZone}">${item.name}</option>`;
            });
            this.controls.AREA_SELECT.innerHTML = this.citiesOptions.optionsTemplate;
            this.elements.CALCULATED_AREA_FROM_SERVER = document.getElementById('calculated-area');
            this.setHandlers();
        },
        setHandlers: function () { 
            for(let i = 0; i < this.controls.MODE_TOGGLE_BTNS.length; i++) { // forEach не работает с коллекциями в IE
                this.controls.MODE_TOGGLE_BTNS[i].addEventListener('change', (event) => {
                    this.elements.DIGITAL_CLOCK.classList.toggle(this.CSS_DISPLAY_STATE_CLASSES.none);
                    this.elements.ANALOG_CLOCK.classList.toggle(this.CSS_DISPLAY_STATE_CLASSES.none);
                    this.elements.FORMAT_SETTING_CONTAINER.classList.toggle(this.CSS_DISPLAY_STATE_CLASSES.disabled);
                    if(this.elements.DIGITAL_CLOCK.classList.contains(this.CSS_DISPLAY_STATE_CLASSES.none)) {
                        for(let c = 0; c < this.controls.FORMAT_TOGGLE_BTNS.length; c++) {
                            this.controls.FORMAT_TOGGLE_BTNS[c].setAttribute('disabled', true);
                        }
                    } else {
                        for(let c = 0; c < this.controls.FORMAT_TOGGLE_BTNS.length; c++) {
                            this.controls.FORMAT_TOGGLE_BTNS[c].removeAttribute('disabled');
                        }
                    }
                    this.settings.mode = event.target.getAttribute('value');
                });
            }
            for (let j = 0; j < this.controls.FORMAT_TOGGLE_BTNS.length; j++) {
                this.controls.FORMAT_TOGGLE_BTNS[j].addEventListener('change', (event) => {
                    this.elements.AMPM_STATE.classList.toggle(this.CSS_DISPLAY_STATE_CLASSES.none);
                    this.settings.format = parseInt(event.target.getAttribute('value'));
                    this.setDiditalClockValues();
                });
            }
            this.getDateTime(true);
            this.controls.AREA_SELECT.addEventListener('change', (event) => {
                if (this.currentTimeZone !== event.target.value) {
                    this.currentTimeZone = event.target.value;
                    this.getDateTime();
                }
            });
            /* обработчик значения title. Вывожу значение времени только когда страница не в фокусе. 
            Ниже есть закомментированная строка для точного соответствия бонусному пункту ТЗ */
            this.elements.DOCUMENT_BODY.setAttribute('tabindex', -1);
            this.elements.DOCUMENT_BODY.focus();
            this.elements.DOCUMENT_BODY.addEventListener('focus', () => {
                clearInterval(this.showTimeInDocumentTitle);
                this.elements.DOCUMENT_TITLE.textContent = this.titleTextForPageInFocus
            });
            this.elements.DOCUMENT_BODY.addEventListener('blur', () => {
                this.showTimeInDocumentTitle = setInterval(() => {
                    this.elements.DOCUMENT_TITLE.textContent = `${this.DIGITAL_CLOCK_HOURS_VALUE}:${this.DIGITAL_CLOCK_MINUTES_VALUE}:${this.DIGITAL_CLOCK_SECONDS_VALUE}`;
                }, 200);
            }); 
        },
        getDateTime: function (init = null) {
            let requestAddress = null;
            if (init) {
                requestAddress = 'https://worldtimeapi.org/api/ip';
            } else {
                requestAddress = `https://worldtimeapi.org/api/timezone/${this.currentTimeZone}`; 
            }
            fetch(requestAddress, { 
                method: 'GET',  
                headers:{'content-type':'application/x-www-form-urlencoded'} 
            })
            .then((response) => {
                if (!response.ok) {           
                    return Promise.reject();
                }
                return response.text();
            })
            .then((data) => {
                clearInterval(this.timeCountingInterval);
                clearTimeout(this.syncFromServerTimeout);
                let objectFromRequest = JSON.parse(data);
                this.currentTimeZone = objectFromRequest.timezone;
                let utcOffset = parseInt(objectFromRequest.utc_offset);
                this.dateAndTime = new Date(objectFromRequest.datetime);
                if(init) {
                    this.CURRENT_UTC_OFFSET = utcOffset;
                    document.getElementById('calculated-area').setAttribute('value', this.currentTimeZone);
                } else { /* При выборе городов или автосинхронизации. Приводим часовой пояс к нулю, далее устанавливаем смещение для выбранного города */
                    if (this.CURRENT_UTC_OFFSET !== 0) {
                        this.dateAndTime.setHours(this.dateAndTime.getHours() + this.getOppositeNumber(this.CURRENT_UTC_OFFSET));
                    }
                    if (utcOffset !== 0) {
                        this.dateAndTime.setHours(this.dateAndTime.getHours() + utcOffset);
                    }
                }
                this.setValues(init);
            })
            .catch((error) => {
                console.error(error);
            });
        },
        getOppositeNumber : function (num) {
            return num * (-1);
        },
        defineDateAndClocksValues: function () {
            this.year = this.dateAndTime.getFullYear();
            this.monthIndex = this.dateAndTime.getMonth();
            this.monthDay = this.dateAndTime.getDate();
            this.weekDay = this.dateAndTime.getDay();
            this.hours = this.dateAndTime.getHours();
            this.minutes = this.dateAndTime.getMinutes();
            this.seconds = this.dateAndTime.getSeconds();
            this.ampmCurrent = (this.hours > this.settings.format) ? 'pm' : 'am';
            this.elements.AMPM_STATE.textContent = this.ampmCurrent;
            this.elements.DATE.textContent = `${this.WEEK_DAYS[this.weekDay]}, ${this.monthDay} ${this.MONTHS[this.monthIndex]} ${this.year}`;
        },
        setValues: function () {
            this.defineDateAndClocksValues();
            this.setDiditalClockValues();
            this.setAnalogClockArrowsPosition();
            this.runTimeCounting();
            this.runSyncCounting();
            this.elements.DATE.textContent = `${this.WEEK_DAYS[this.weekDay]}, ${this.monthDay} ${this.MONTHS[this.monthIndex]} ${this.year}`;
        },
        setDiditalClockValues: function () {
            this.createDigitalClockDataForOutput();
            /* раскомментировать для проверки точного соответствия бонусному заданию */
            // this.elements.DOCUMENT_TITLE.textContent = `${this.DIGITAL_CLOCK_HOURS_VALUE}:${this.DIGITAL_CLOCK_MINUTES_VALUE}:${this.DIGITAL_CLOCK_SECONDS_VALUE}`;
            this.elements.DIGITAL_CLOCK_HOURS.textContent = this.DIGITAL_CLOCK_HOURS_VALUE;
            this.elements.DIGITAL_CLOCK_MINUTES.textContent = this.DIGITAL_CLOCK_MINUTES_VALUE;
            this.elements.DIGITAL_CLOCK_SECONDS.textContent = this.DIGITAL_CLOCK_SECONDS_VALUE;
        },
        setAnalogClockArrowsPosition: function () {
            this.createAnalogClockArrowsAngles();
            this.elements.HOUR_ARROW.style.transform = `rotate(${this.ANALOG_CLOCK_HOUR_ARROW_ANGLE}deg)`;
            this.elements.MINUTE_ARROW.style.transform = `rotate(${this.ANALOG_CLOCK_MINUTE_ARROW_ANGLE}deg)`;
            this.elements.SECOND_ARROW.style.transform = `rotate(${this.ANALOG_CLOCK_SECOND_ARROW_ANGLE}deg)`;
        },
        createDigitalClockDataForOutput: function () {
            let hours = null;
            if (this.settings.format == 12) {
                hours = (this.hours > this.settings.format) ? (this.hours - this.settings.format) : this.hours;
                if(this.hours > this.settings.format && this.ampmCurrent === 'am') {
                    this.ampmCurrent = 'pm';
                    this.elements.AMPM_STATE.textContent = this.ampmCurrent;
                }       
            } else {
                hours = this.hours
            }
            this.DIGITAL_CLOCK_HOURS_VALUE = this.redactValueForDigitalClock(hours);
            this.DIGITAL_CLOCK_MINUTES_VALUE = this.redactValueForDigitalClock(this.minutes);
            this.DIGITAL_CLOCK_SECONDS_VALUE = this.redactValueForDigitalClock(this.seconds);
        },
        redactValueForDigitalClock: function (value) {
            let stringVal = String(value);
            if (stringVal.length === 1) {
                return `0${stringVal}`;
            } else return stringVal;
        },
        createAnalogClockArrowsAngles: function () {
            const TOTAL_HOURS_IN_ANALOG_CLOCK = 12;
            const TOTAL_MINUTES_AND_SECONDS_POSITIONS = 60;
            const DEGREES_FOR_ONE_HOUR = this.TOTAL_DEGREES / TOTAL_HOURS_IN_ANALOG_CLOCK;
            const DEGREES_FOR_ONE_MINUTE_OR_SECOND = this.TOTAL_DEGREES / TOTAL_MINUTES_AND_SECONDS_POSITIONS;
            let hours = (this.hours > TOTAL_HOURS_IN_ANALOG_CLOCK) ? (this.hours - TOTAL_HOURS_IN_ANALOG_CLOCK) : this.hours;
            let hourArrowCeilAngle = DEGREES_FOR_ONE_HOUR * hours;
            let minuteArrowCeilAngle = DEGREES_FOR_ONE_MINUTE_OR_SECOND * this.minutes;
            let secondArrowCeilAngle = DEGREES_FOR_ONE_MINUTE_OR_SECOND * this.seconds;
            this.ANALOG_CLOCK_HOUR_ARROW_ANGLE = this.calculateIntermediateAngleForArrow(minuteArrowCeilAngle, hourArrowCeilAngle, DEGREES_FOR_ONE_HOUR);
            this.ANALOG_CLOCK_MINUTE_ARROW_ANGLE = this.calculateIntermediateAngleForArrow(secondArrowCeilAngle, minuteArrowCeilAngle, DEGREES_FOR_ONE_MINUTE_OR_SECOND);
            this.ANALOG_CLOCK_SECOND_ARROW_ANGLE = secondArrowCeilAngle;
        },
        calculateIntermediateAngleForArrow: function (previousSmallerTimeUnitCeilArrowAngle, currentTimeUnitCeilArrowAngle, degreesOffsetForOneCurrentTimeUnitCeilValue) {
            let TOTAL_PERCENTS = 100;
            let percentSmallerTimeUnitArrowAngleOfTotal = (previousSmallerTimeUnitCeilArrowAngle / this.TOTAL_DEGREES) * TOTAL_PERCENTS;
            let onePercentOfCurrentTimeUnitArrowAngle = degreesOffsetForOneCurrentTimeUnitCeilValue / TOTAL_PERCENTS;
            let offsetForCurrentTimeUnitCeilArrowAngle = (onePercentOfCurrentTimeUnitArrowAngle * percentSmallerTimeUnitArrowAngleOfTotal);
            let intermediateAngleForCurrentTimeUnitArrow = currentTimeUnitCeilArrowAngle + offsetForCurrentTimeUnitCeilArrowAngle;
            return intermediateAngleForCurrentTimeUnitArrow;

        },
        runTimeCounting: function () {
            this.timeCountingInterval = setInterval(() => {
                this.dateAndTime.setSeconds(this.dateAndTime.getSeconds() + 1);
                this.defineDateAndClocksValues();
                this.setDiditalClockValues();
                this.setAnalogClockArrowsPosition();
            }, this.SECOND_IN_MILLISECONDS);
        },
        runSyncCounting: function () {
            this.syncFromServerTimeout = setTimeout(() => this.getDateTime(), this.settings.syncIntervalInMinutes * 60000); 
        },
        init: function (selector, userSettings, userCitiesArray) {
            this.elements.CLOCK_CONTAINER = document.querySelector(selector);
            if(userSettings) {
                if (userSettings.mode) {
                    if (userSettings.mode === 'digital' || userSettings.mode === 'analog') {
                        this.settings.mode = userSettings.mode;
                    } else {
                        console.error(`Неправильный параметр вида экранных часов
                         (Параметр setting.mode должен иметь значение digital или analog)`);
                    }
                }
                if (userSettings.format) {
                    if (userSettings.format == 24 || userSettings.format == 12) {
                        this.settings.format = parseInt(userSettings.format); 
                    } else {
                        console.error(`Некорректное значение параметра формата времени: 
                        (Параметр setting.format должен иметь значение 12 или 24)`);
                    }
                }
                if (userSettings.syncIntervalInMinutes) {
                    if (!isNaN(userSettings.syncIntervalInMinutes)) { 
                        this.settings.syncIntervalInMinutes = parseInt(userSettings.syncIntervalInMinutes);
                    } else {
                        console.error(`Некорректное значение параметра интервала синхронизации с сервером. 
                        (Параметр setting.format должен быть задан в числовом виде`);
                    }
                }
            }
            if (userCitiesArray) {
                if (Array.isArray(userCitiesArray)) {
                    let checkValid = (item) => {
                        if(item.name && typeof(item.name) === 'string' && item.timeZone && typeof(item.timeZone) === 'string') {
                            return true; 
                        } else return false; /* можно конечно было пойти еще дальше, и создать массив для проверки всех валидных timeZone */
                    };
                    let validResult = userCitiesArray.every(checkValid);
                    if (validResult) {
                        this.citiesOptions.cities = userCitiesArray;
                    } else console.error(`Некорректный массив городов. Метод принимает массив объектов, со заначениями name(string) и timeZone(string)`);
                } else console.error(`Некорректный массив городов. Метод принимает массив объектов, со заначениями name(string) и timeZone(string)`);
            }
            this.createApplicationMarkup();
        }
    };

    clock.init('#clock');
    /* обязательным является только параметр селектора, в котором проинициализируются часы */
    /* второй параметр (предустановки вида приложения). Не обязателен */
    // {
    //     mode: 'analog', /* digital / analog */
    //     format: 12, /* 24 / 12 */
    //     syncIntervalInMinutes: 20 /* интервал синхронизаций в минутах */
    // }
     /* третий параметр (города) - массив объектов со свойствами name и timeZone. Не обязателен */
})();