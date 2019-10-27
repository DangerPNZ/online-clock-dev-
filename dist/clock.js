'use strict';

(function () {
    var clock = {
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
        MONTHS: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        WEEK_DAYS: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        settings: {
            mode: 'digital',
            format: 24,
            syncIntervalInMinutes: 5
        },
        citiesOptions: {
            optionsTemplate: '<option id="calculated-area">Мой (часовой пояс по ip)</option>',
            cities: [{ name: 'Екатеринбург', timeZone: 'Asia/Yekaterinburg' }, { name: 'Нижневартовск', timeZone: 'Asia/Yekaterinburg' }, { name: 'Омск', timeZone: 'Asia/Omsk' }, { name: 'Санкт-Петербург', timeZone: 'Europe/Moscow' }, { name: 'Якутск', timeZone: 'Asia/Yakutsk' }]
        },
        createApplicationMarkup: function createApplicationMarkup() {
            var MARKUP = '\n            <section class="clock">\n                <div class="clock__output">\n                    <div class="clock__modes">\n                        <div id="digital" class="clock__item  clock__item--digital">\n                            <div id="digital-hours" class="clock__digital-unit  clock__digital-unit--hours"></div>\n                            <div class="clock__digital-separator">:</div>\n                            <div id="digital-minutes" class="clock__digital-unit  clock__digital-unit--minutes"></div>\n                            <div class="clock__digital-separator">:</div>\n                            <div id="digital-seconds" class="clock__digital-unit  clock__digital-unit--seconds"></div>\n                            <div id="ampm-state" class="clock__digital-ampm-state"></div>\n                        </div>\n                        <div id="analog" class="clock__item  clock__item--analog">\n                            <ol class="clock__analog-hours">\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                                <li class="clock__analog-hour-item"></li>\n                            </ol>\n                            <div class="clock__arrows-container">\n                                <div id="hour-arrow" class="clock__arrow-item-container">\n                                    <div class="clock__arrow  clock__arrow--hours"></div>\n                                </div>\n                                <div id="minute-arrow" class="clock__arrow-item-container">\n                                    <div class="clock__arrow  clock__arrow--minutes"></div>\n                                </div>\n                                <div id="second-arrow" class="clock__arrow-item-container">\n                                    <div class="clock__arrow  clock__arrow--seconds"></div>\n                                </div>\n                            </div>\n                        </div>\n                        <div id="date" class="clock__date"></div>\n                    </div>\n                </div>\n                <div class="clock__settings-container">\n                    <div class="clock__parameter-wrapper" id="mode-select-btns">\n                        <div class="clock__parameter-description">\u0412\u0438\u0434:</div>\n                        <input type="radio" name="mode" id="digital-mode" class="clock__radio" value="digital">\n                        <label for="digital-mode" class="clock__parameter-label">\u0426\u0438\u0444\u0440\u043E\u0432\u044B\u0435</label>\n                        <input type="radio" name="mode" id="analog-mode" class="clock__radio" value="analog">\n                        <label for="analog-mode" class="clock__parameter-label">\u0410\u043D\u0430\u043B\u043E\u0433\u043E\u0432\u044B\u0435</label>\n                    </div>\n                    <div class="clock__parameter-wrapper" id="format-select-btns">\n                        <div class="clock__parameter-description">\u0424\u043E\u0440\u043C\u0430\u0442:</div>\n                        <input type="radio" name="format" id="full-format" class="clock__radio" value="24">\n                        <label for="full-format" class="clock__parameter-label">24 \u0447\u0430\u0441\u0430</label>\n                        <input type="radio" name="format" id="ampm-format" class="clock__radio" value="12">\n                        <label for="ampm-format" class="clock__parameter-label">12 \u0447\u0430\u0441\u043E\u0432</label>\n                    </div>\n                    <div class="clock__parameter-wrapper">\n                        <div class="clock__parameter-description">\u0413\u043E\u0440\u043E\u0434:</div>\n                        <select class="clock__city-selelect" id="area-select"></select> \n                    </div>\n                </div>\n            </section>'; /* Вообще я не сторонник использования select ввиду не до конца идентичного их вида в разных браузерах,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            и предпочитаю использовать "псевдоселект" из списка внутри блока */
            this.elements.CLOCK_CONTAINER.innerHTML = MARKUP;
            this.defineElementsAndControls();
        },
        defineElementsAndControls: function defineElementsAndControls() {
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
        setInitState: function setInitState() {
            var _this = this;

            if (this.settings.mode === 'digital') {
                this.elements.ANALOG_CLOCK.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#digital-mode').checked = true;
            } else if (this.settings.mode === 'analog') {
                this.elements.FORMAT_SETTING_CONTAINER.classList.add(this.CSS_DISPLAY_STATE_CLASSES.disabled);
                for (var i = 0; i < this.controls.FORMAT_TOGGLE_BTNS.length; i++) {
                    this.controls.FORMAT_TOGGLE_BTNS[i].setAttribute('disabled', true);
                }
                this.elements.DIGITAL_CLOCK.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#analog-mode').checked = true;
            }
            if (this.settings.format == 24) {
                this.elements.AMPM_STATE.classList.add(this.CSS_DISPLAY_STATE_CLASSES.none);
                document.querySelector('#full-format').checked = true;
            } else if (this.settings.format == 12) {
                document.querySelector('#ampm-format').checked = true;
            }
            this.citiesOptions.cities.forEach(function (item) {
                _this.citiesOptions.optionsTemplate += '<option value="' + item.timeZone + '">' + item.name + '</option>';
            });
            this.controls.AREA_SELECT.innerHTML = this.citiesOptions.optionsTemplate;
            this.elements.CALCULATED_AREA_FROM_SERVER = document.getElementById('calculated-area');
            this.setHandlers();
        },
        setHandlers: function setHandlers() {
            var _this2 = this;

            for (var i = 0; i < this.controls.MODE_TOGGLE_BTNS.length; i++) {
                // forEach не работает с коллекциями в IE
                this.controls.MODE_TOGGLE_BTNS[i].addEventListener('change', function (event) {
                    _this2.elements.DIGITAL_CLOCK.classList.toggle(_this2.CSS_DISPLAY_STATE_CLASSES.none);
                    _this2.elements.ANALOG_CLOCK.classList.toggle(_this2.CSS_DISPLAY_STATE_CLASSES.none);
                    _this2.elements.FORMAT_SETTING_CONTAINER.classList.toggle(_this2.CSS_DISPLAY_STATE_CLASSES.disabled);
                    if (_this2.elements.DIGITAL_CLOCK.classList.contains(_this2.CSS_DISPLAY_STATE_CLASSES.none)) {
                        for (var c = 0; c < _this2.controls.FORMAT_TOGGLE_BTNS.length; c++) {
                            _this2.controls.FORMAT_TOGGLE_BTNS[c].setAttribute('disabled', true);
                        }
                    } else {
                        for (var _c = 0; _c < _this2.controls.FORMAT_TOGGLE_BTNS.length; _c++) {
                            _this2.controls.FORMAT_TOGGLE_BTNS[_c].removeAttribute('disabled');
                        }
                    }
                    _this2.settings.mode = event.target.getAttribute('value');
                });
            }
            for (var j = 0; j < this.controls.FORMAT_TOGGLE_BTNS.length; j++) {
                this.controls.FORMAT_TOGGLE_BTNS[j].addEventListener('change', function (event) {
                    _this2.elements.AMPM_STATE.classList.toggle(_this2.CSS_DISPLAY_STATE_CLASSES.none);
                    _this2.settings.format = parseInt(event.target.getAttribute('value'));
                    _this2.setDiditalClockValues();
                });
            }
            this.getDateTime(true);
            this.controls.AREA_SELECT.addEventListener('change', function (event) {
                if (_this2.currentTimeZone !== event.target.value) {
                    _this2.currentTimeZone = event.target.value;
                    _this2.getDateTime();
                }
            });
            /* обработчик значения title. Вывожу значение времени только когда страница не в фокусе. 
            Ниже есть закомментированная строка для точного соответствия бонусному пункту ТЗ */
            this.elements.DOCUMENT_BODY.setAttribute('tabindex', -1);
            this.elements.DOCUMENT_BODY.focus();
            this.elements.DOCUMENT_BODY.addEventListener('focus', function () {
                clearInterval(_this2.showTimeInDocumentTitle);
                _this2.elements.DOCUMENT_TITLE.textContent = _this2.titleTextForPageInFocus;
            });
            this.elements.DOCUMENT_BODY.addEventListener('blur', function () {
                _this2.showTimeInDocumentTitle = setInterval(function () {
                    _this2.elements.DOCUMENT_TITLE.textContent = _this2.DIGITAL_CLOCK_HOURS_VALUE + ':' + _this2.DIGITAL_CLOCK_MINUTES_VALUE + ':' + _this2.DIGITAL_CLOCK_SECONDS_VALUE;
                }, 200);
            });
        },
        getDateTime: function getDateTime() {
            var _this3 = this;

            var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var requestAddress = null;
            if (init) {
                requestAddress = 'https://worldtimeapi.org/api/ip';
            } else {
                requestAddress = 'https://worldtimeapi.org/api/timezone/' + this.currentTimeZone;
            }
            fetch(requestAddress, {
                method: 'GET',
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            }).then(function (response) {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.text();
            }).then(function (data) {
                clearInterval(_this3.timeCountingInterval);
                clearTimeout(_this3.syncFromServerTimeout);
                var objectFromRequest = JSON.parse(data);
                _this3.currentTimeZone = objectFromRequest.timezone;
                var utcOffset = parseInt(objectFromRequest.utc_offset);
                _this3.dateAndTime = new Date(objectFromRequest.datetime);
                if (init) {
                    _this3.CURRENT_UTC_OFFSET = utcOffset;
                    document.getElementById('calculated-area').setAttribute('value', _this3.currentTimeZone);
                } else {
                    /* При выборе городов или автосинхронизации. Приводим часовой пояс к нулю, далее устанавливаем смещение для выбранного города */
                    if (_this3.CURRENT_UTC_OFFSET !== 0) {
                        _this3.dateAndTime.setHours(_this3.dateAndTime.getHours() + _this3.getOppositeNumber(_this3.CURRENT_UTC_OFFSET));
                    }
                    if (utcOffset !== 0) {
                        _this3.dateAndTime.setHours(_this3.dateAndTime.getHours() + utcOffset);
                    }
                }
                _this3.setValues(init);
            }).catch(function (error) {
                console.error(error);
            });
        },
        getOppositeNumber: function getOppositeNumber(num) {
            return num * -1;
        },
        defineDateAndClocksValues: function defineDateAndClocksValues() {
            this.year = this.dateAndTime.getFullYear();
            this.monthIndex = this.dateAndTime.getMonth();
            this.monthDay = this.dateAndTime.getDate();
            this.weekDay = this.dateAndTime.getDay();
            this.hours = this.dateAndTime.getHours();
            this.minutes = this.dateAndTime.getMinutes();
            this.seconds = this.dateAndTime.getSeconds();
            this.ampmCurrent = this.hours > this.settings.format ? 'pm' : 'am';
            this.elements.AMPM_STATE.textContent = this.ampmCurrent;
            this.elements.DATE.textContent = this.WEEK_DAYS[this.weekDay] + ', ' + this.monthDay + ' ' + this.MONTHS[this.monthIndex] + ' ' + this.year;
        },
        setValues: function setValues() {
            this.defineDateAndClocksValues();
            this.setDiditalClockValues();
            this.setAnalogClockArrowsPosition();
            this.runTimeCounting();
            this.runSyncCounting();
            this.elements.DATE.textContent = this.WEEK_DAYS[this.weekDay] + ', ' + this.monthDay + ' ' + this.MONTHS[this.monthIndex] + ' ' + this.year;
        },
        setDiditalClockValues: function setDiditalClockValues() {
            this.createDigitalClockDataForOutput();
            /* раскомментировать для проверки точного соответствия бонусному заданию */
            // this.elements.DOCUMENT_TITLE.textContent = `${this.DIGITAL_CLOCK_HOURS_VALUE}:${this.DIGITAL_CLOCK_MINUTES_VALUE}:${this.DIGITAL_CLOCK_SECONDS_VALUE}`;
            this.elements.DIGITAL_CLOCK_HOURS.textContent = this.DIGITAL_CLOCK_HOURS_VALUE;
            this.elements.DIGITAL_CLOCK_MINUTES.textContent = this.DIGITAL_CLOCK_MINUTES_VALUE;
            this.elements.DIGITAL_CLOCK_SECONDS.textContent = this.DIGITAL_CLOCK_SECONDS_VALUE;
        },
        setAnalogClockArrowsPosition: function setAnalogClockArrowsPosition() {
            this.createAnalogClockArrowsAngles();
            this.elements.HOUR_ARROW.style.transform = 'rotate(' + this.ANALOG_CLOCK_HOUR_ARROW_ANGLE + 'deg)';
            this.elements.MINUTE_ARROW.style.transform = 'rotate(' + this.ANALOG_CLOCK_MINUTE_ARROW_ANGLE + 'deg)';
            this.elements.SECOND_ARROW.style.transform = 'rotate(' + this.ANALOG_CLOCK_SECOND_ARROW_ANGLE + 'deg)';
        },
        createDigitalClockDataForOutput: function createDigitalClockDataForOutput() {
            var hours = null;
            if (this.settings.format == 12) {
                hours = this.hours > this.settings.format ? this.hours - this.settings.format : this.hours;
                if (this.hours > this.settings.format && this.ampmCurrent === 'am') {
                    this.ampmCurrent = 'pm';
                    this.elements.AMPM_STATE.textContent = this.ampmCurrent;
                }
            } else {
                hours = this.hours;
            }
            this.DIGITAL_CLOCK_HOURS_VALUE = this.redactValueForDigitalClock(hours);
            this.DIGITAL_CLOCK_MINUTES_VALUE = this.redactValueForDigitalClock(this.minutes);
            this.DIGITAL_CLOCK_SECONDS_VALUE = this.redactValueForDigitalClock(this.seconds);
        },
        redactValueForDigitalClock: function redactValueForDigitalClock(value) {
            var stringVal = String(value);
            if (stringVal.length === 1) {
                return '0' + stringVal;
            } else return stringVal;
        },
        createAnalogClockArrowsAngles: function createAnalogClockArrowsAngles() {
            var TOTAL_HOURS_IN_ANALOG_CLOCK = 12;
            var TOTAL_MINUTES_AND_SECONDS_POSITIONS = 60;
            var DEGREES_FOR_ONE_HOUR = this.TOTAL_DEGREES / TOTAL_HOURS_IN_ANALOG_CLOCK;
            var DEGREES_FOR_ONE_MINUTE_OR_SECOND = this.TOTAL_DEGREES / TOTAL_MINUTES_AND_SECONDS_POSITIONS;
            var hours = this.hours > TOTAL_HOURS_IN_ANALOG_CLOCK ? this.hours - TOTAL_HOURS_IN_ANALOG_CLOCK : this.hours;
            var hourArrowCeilAngle = DEGREES_FOR_ONE_HOUR * hours;
            var minuteArrowCeilAngle = DEGREES_FOR_ONE_MINUTE_OR_SECOND * this.minutes;
            var secondArrowCeilAngle = DEGREES_FOR_ONE_MINUTE_OR_SECOND * this.seconds;
            this.ANALOG_CLOCK_HOUR_ARROW_ANGLE = this.calculateIntermediateAngleForArrow(minuteArrowCeilAngle, hourArrowCeilAngle, DEGREES_FOR_ONE_HOUR);
            this.ANALOG_CLOCK_MINUTE_ARROW_ANGLE = this.calculateIntermediateAngleForArrow(secondArrowCeilAngle, minuteArrowCeilAngle, DEGREES_FOR_ONE_MINUTE_OR_SECOND);
            this.ANALOG_CLOCK_SECOND_ARROW_ANGLE = secondArrowCeilAngle;
        },
        calculateIntermediateAngleForArrow: function calculateIntermediateAngleForArrow(previousSmallerTimeUnitCeilArrowAngle, currentTimeUnitCeilArrowAngle, degreesOffsetForOneCurrentTimeUnitCeilValue) {
            var TOTAL_PERCENTS = 100;
            var percentSmallerTimeUnitArrowAngleOfTotal = previousSmallerTimeUnitCeilArrowAngle / this.TOTAL_DEGREES * TOTAL_PERCENTS;
            var onePercentOfCurrentTimeUnitArrowAngle = degreesOffsetForOneCurrentTimeUnitCeilValue / TOTAL_PERCENTS;
            var offsetForCurrentTimeUnitCeilArrowAngle = onePercentOfCurrentTimeUnitArrowAngle * percentSmallerTimeUnitArrowAngleOfTotal;
            var intermediateAngleForCurrentTimeUnitArrow = currentTimeUnitCeilArrowAngle + offsetForCurrentTimeUnitCeilArrowAngle;
            return intermediateAngleForCurrentTimeUnitArrow;
        },
        runTimeCounting: function runTimeCounting() {
            var _this4 = this;

            this.timeCountingInterval = setInterval(function () {
                _this4.dateAndTime.setSeconds(_this4.dateAndTime.getSeconds() + 1);
                _this4.defineDateAndClocksValues();
                _this4.setDiditalClockValues();
                _this4.setAnalogClockArrowsPosition();
            }, this.SECOND_IN_MILLISECONDS);
        },
        runSyncCounting: function runSyncCounting() {
            var _this5 = this;

            this.syncFromServerTimeout = setTimeout(function () {
                return _this5.getDateTime();
            }, this.settings.syncIntervalInMinutes * 60000);
        },
        init: function init(selector, userSettings, userCitiesArray) {
            this.elements.CLOCK_CONTAINER = document.querySelector(selector);
            if (userSettings) {
                if (userSettings.mode) {
                    if (userSettings.mode === 'digital' || userSettings.mode === 'analog') {
                        this.settings.mode = userSettings.mode;
                    } else {
                        console.error('\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 \u0432\u0438\u0434\u0430 \u044D\u043A\u0440\u0430\u043D\u043D\u044B\u0445 \u0447\u0430\u0441\u043E\u0432\n                         (\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 setting.mode \u0434\u043E\u043B\u0436\u0435\u043D \u0438\u043C\u0435\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 digital \u0438\u043B\u0438 analog)');
                    }
                }
                if (userSettings.format) {
                    if (userSettings.format == 24 || userSettings.format == 12) {
                        this.settings.format = parseInt(userSettings.format);
                    } else {
                        console.error('\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 \u0444\u043E\u0440\u043C\u0430\u0442\u0430 \u0432\u0440\u0435\u043C\u0435\u043D\u0438: \n                        (\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 setting.format \u0434\u043E\u043B\u0436\u0435\u043D \u0438\u043C\u0435\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 12 \u0438\u043B\u0438 24)');
                    }
                }
                if (userSettings.syncIntervalInMinutes) {
                    if (!isNaN(userSettings.syncIntervalInMinutes)) {
                        this.settings.syncIntervalInMinutes = parseInt(userSettings.syncIntervalInMinutes);
                    } else {
                        console.error('\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0430 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043E\u043C. \n                        (\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 setting.format \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0437\u0430\u0434\u0430\u043D \u0432 \u0447\u0438\u0441\u043B\u043E\u0432\u043E\u043C \u0432\u0438\u0434\u0435');
                    }
                }
            }
            if (userCitiesArray) {
                if (Array.isArray(userCitiesArray)) {
                    var checkValid = function checkValid(item) {
                        if (item.name && typeof item.name === 'string' && item.timeZone && typeof item.timeZone === 'string') {
                            return true;
                        } else return false; /* можно конечно было пойти еще дальше, и создать массив для проверки всех валидных timeZone */
                    };
                    var validResult = userCitiesArray.every(checkValid);
                    if (validResult) {
                        this.citiesOptions.cities = userCitiesArray;
                    } else console.error('\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043C\u0430\u0441\u0441\u0438\u0432 \u0433\u043E\u0440\u043E\u0434\u043E\u0432. \u041C\u0435\u0442\u043E\u0434 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u0430\u0441\u0441\u0438\u0432 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432, \u0441\u043E \u0437\u0430\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438 name(string) \u0438 timeZone(string)');
                } else console.error('\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043C\u0430\u0441\u0441\u0438\u0432 \u0433\u043E\u0440\u043E\u0434\u043E\u0432. \u041C\u0435\u0442\u043E\u0434 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u0430\u0441\u0441\u0438\u0432 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432, \u0441\u043E \u0437\u0430\u043D\u0430\u0447\u0435\u043D\u0438\u044F\u043C\u0438 name(string) \u0438 timeZone(string)');
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