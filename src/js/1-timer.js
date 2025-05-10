import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Елементи інтерфейсу
const startBtn = document.querySelector('button[data-start]');
const input = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

// Конфігурація flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];
    if (pickedDate <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        message: 'Будь ласка, виберіть дату в майбутньому',
        position: 'topRight',
      });
    } else {
      userSelectedDate = pickedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

// Функція конвертації часу
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Форматування значень
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Оновлення інтерфейсу таймера
function updateTimerUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Запуск таймера
function startTimer() {
  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      input.disabled = false;
      return;
    }

    const timeData = convertMs(diff);
    updateTimerUI(timeData);
  }, 1000);
}

// Обробка натискання кнопки Start
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;
  startTimer();
});
