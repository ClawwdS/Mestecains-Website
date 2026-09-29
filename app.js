'use strict';

const places = [
  {
    id: 'riverside',
    title: 'Take the scenic route',
    category: 'outdoors',
    label: 'OUTDOORS & OPEN SKIES',
    image: 'countryside.jpg',
    time: '1–2 hours · Easy walking',
    description:
      'Breathe in the mountain air on quiet lanes and meadow paths beneath the Bucovina hills.',
    detail:
      'Set out from the village on a relaxed walk through open meadows, with views towards the Carpathian foothills. Routes and conditions vary by season; ask a local host about the best path for the day and wear sturdy shoes.',
  },
  {
    id: 'old-town',
    title: 'Wander a little further back',
    category: 'culture',
    label: 'HISTORY & HIDDEN CORNERS',
    image: 'village.jpg',
    time: '45–60 minutes · Village lanes',
    description:
      'Wander past gardens, wooden gates and familiar Bucovinian details at the village’s own pace.',
    detail:
      'Take an unhurried walk through Mestecanis and notice the details of everyday village life, from timber gates to mountain gardens. Ask before photographing homes or residents, and check locally for places open to visitors.',
  },
  {
    id: 'market',
    title: 'A taste of the local life',
    category: 'food',
    label: 'GOOD FOOD & INDEPENDENT SPIRIT',
    image: 'street.jpg',
    time: '1–2 hours · Taste & unwind',
    description:
      'Get a taste of Bucovina with local cheese, fresh bread, seasonal preserves and warm hospitality.',
    detail:
      'Look for regional dishes and seasonal produce, and ask local hosts what is available nearby. Village services may be limited or seasonal, so plan ahead if you have a particular stop in mind.',
  },
];

const events = [
  {
    id: 'harvest',
    day: '10',
    month: 'OCT',
    title: 'Bucovina harvest gathering',
    category: 'community',
    tag: 'Seasonal food & community',
    meta: 'Village square · 10:00–15:00 · Free entry',
    description:
      'Celebrate the harvest with seasonal food, local crafts and neighbours gathering in the village. Check locally for this year’s programme and weather updates.',
    start: '20261010T100000',
    end: '20261010T150000',
    location: 'Village square, Mestecanis',
  },
  {
    id: 'music',
    day: '17',
    month: 'OCT',
    title: 'An evening of Bucovinian music',
    category: 'arts',
    tag: 'Folk music & local stories',
    meta: 'Village community hall · 19:00–21:00 · Free entry',
    description:
      'Spend an evening with regional music and stories from Bucovina. Confirm the programme, venue and access arrangements with local organisers before travelling.',
    start: '20261017T190000',
    end: '20261017T210000',
    location: 'Village community hall, Mestecanis',
  },
  {
    id: 'walk',
    day: '24',
    month: 'OCT',
    title: 'A walk in the Carpathian foothills',
    category: 'community',
    tag: 'Mountain air & local company',
    meta: 'Village trailhead · 10:00–12:00 · Free entry',
    description:
      'Join a guided walk on village paths with views towards the Carpathians. Bring water and sturdy shoes; routes may be uneven or muddy, and children should be accompanied by an adult.',
    start: '20261024T100000',
    end: '20261024T120000',
    location: 'Village trailhead, Mestecanis',
  },
];

const $ = (selector) => document.querySelector(selector);

let saved = [];
let storageAvailable = true;

try {
  const raw = JSON.parse(localStorage.getItem('alderwick-day') || '[]');
  saved = Array.isArray(raw)
    ? raw.filter((id) => places.some((place) => place.id === id))
    : [];
} catch {
  storageAvailable = false;
}

let placeFilter = 'all';
let eventFilter = 'all';
let toastTimer;

function notify(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2800);
}

function persist() {
  try {
    localStorage.setItem('alderwick-day', JSON.stringify(saved));
  } catch {
    storageAvailable = false;
  }

  $('.plan-count').textContent = saved.length;
  renderPlaces();
  renderPlanner();
}

function togglePlace(id) {
  if (!places.some((place) => place.id === id)) {
    return;
  }

  const exists = saved.includes(id);
  saved = exists ? saved.filter((item) => item !== id) : [...saved, id];

  persist();
  notify(
    exists
      ? 'Removed from your day.'
      : storageAvailable
        ? 'Added to your day.'
        : 'Added for this visit. Device storage is unavailable.'
  );

  document
    .querySelectorAll('[data-detail-save]')
    .forEach((button) => {
      button.textContent = saved.includes(id) ? 'Remove from my day' : 'Add to my day';
    });
}

function renderPlaces() {
  const term = $('#place-search').value.trim().toLowerCase();
  const shown = places.filter(
    (place) =>
      (placeFilter === 'all' || place.category === placeFilter) &&
      `${place.title} ${place.description} ${place.label}`
        .toLowerCase()
        .includes(term)
  );

  $('#place-grid').innerHTML = shown
    .map(
      (place) => `
        <article class="place-card">
          <button
            class="card-image"
            data-place-detail="${place.id}"
            aria-label="Read about ${place.title}"
          >
            <img
              src="assets/${place.image}"
              alt="${
                place.category === 'outdoors'
                  ? 'A footpath winding through green meadows'
                  : place.category === 'culture'
                    ? 'Historic stone cottages lining a village lane'
                    : 'Traditional shops and buildings around a market square'
              }"
              loading="lazy"
            />
            <span class="image-label">${place.label}</span>
          </button>
          <div class="card-info">
            <h3>${place.title}</h3>
            <p>${place.description}</p>
            <div class="card-bottom">
              <span>${place.time}</span>
              <button class="save-place" data-save="${place.id}" aria-pressed="${saved.includes(place.id)}">
                ${saved.includes(place.id) ? '✓ Saved' : '+ My day'}
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  $('#place-empty').hidden = shown.length > 0;
  $('#place-count').textContent = `${shown.length} ${shown.length === 1 ? 'discovery' : 'discoveries'} to make your own`;
}

function renderEvents() {
  $('#event-list').innerHTML = events
    .filter((event) => eventFilter === 'all' || event.category === eventFilter)
    .map(
      (event) => `
        <article class="event-row">
          <div class="event-date">
            <strong>${event.day}</strong>${event.month} 2026
          </div>
          <div>
            <span class="event-tag">${event.tag}</span>
            <h3>${event.title}</h3>
            <p>${event.meta}</p>
          </div>
          <button data-event="${event.id}" aria-label="Details for ${event.title}">
            Event details
          </button>
        </article>
      `
    )
    .join('');
}

function renderPlanner() {
  $('#planner-items').innerHTML = saved.length
    ? saved
        .map((id, index) => {
          const place = places.find((item) => item.id === id);
          return `
            <div class="planner-item">
              <div>
                <strong>${index + 1}. ${place.title}</strong>
                <small>${place.time}</small>
              </div>
              <button data-save="${id}" aria-label="Remove ${place.title}">
                Remove
              </button>
            </div>
          `;
        })
        .join('')
    : `
        <p style="padding:25px 0">
          Your day is wide open. Add a discovery from the village guide, or start with all three.
        </p>
        <button class="button green" id="suggest-day">Add a leisurely town day</button>
      `;

  $('#download-plan').disabled = !saved.length;
  $('#download-plan').style.opacity = saved.length ? '1' : '.45';
  $('#clear-plan').hidden = !saved.length;
  $('#planner-status').textContent = storageAvailable
    ? ''
    : 'Your browser cannot save this list permanently. Download it to keep a copy.';
}

function openDialog(id) {
  $(id).showModal();
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) {
      return;
    }

    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      dialog.close();
    }
  });
});

function download(filename, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const escapeICS = (value) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

function downloadEvent(id) {
  const event = events.find((item) => item.id === id);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mestecanis//Village Guide//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}-2026@mestecanis.example`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${event.start}`,
    `DTEND:${event.end}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.description)} (Local Mestecanis time.)`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  download(
    `mestecanis-${event.id}.ics`,
    `${lines.join('\r\n')}\r\n`,
    'text/calendar;charset=utf-8'
  );

  notify('Calendar file downloaded.');
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }

  if (button.matches('[data-close]')) {
    button.closest('dialog').close();
  }

  if (button.matches('[data-save]')) {
    togglePlace(button.dataset.save);
  }

  if (button.matches('[data-planner]')) {
    renderPlanner();
    openDialog('#planner-dialog');
  }

  if (button.matches('[data-place-filter]')) {
    placeFilter = button.dataset.placeFilter;
    document.querySelectorAll('[data-place-filter]').forEach((control) => {
      control.classList.toggle('active', control === button);
      control.setAttribute('aria-pressed', String(control === button));
    });
    renderPlaces();
  }

  if (button.matches('[data-event-filter]')) {
    eventFilter = button.dataset.eventFilter;
    document.querySelectorAll('[data-event-filter]').forEach((control) => {
      control.classList.toggle('active', control === button);
      control.setAttribute('aria-pressed', String(control === button));
    });
    renderEvents();
  }

  if (button.matches('[data-place-detail]')) {
    const place = places.find((item) => item.id === button.dataset.placeDetail);
    $('#detail-content').innerHTML = `
      <img class="detail-photo" src="assets/${place.image}" alt="${place.title}" />
      <p class="eyebrow">${place.label}</p>
      <h2 id="detail-title">${place.title}</h2>
      <p>${place.detail}</p>
      <p class="detail-meta">${place.time}</p>
      <button class="button green" data-save="${place.id}" data-detail-save>
        ${saved.includes(place.id) ? 'Remove from my day' : 'Add to my day'}
      </button>
    `;
    openDialog('#detail-dialog');
  }

  if (button.matches('[data-event]')) {
    const event = events.find((item) => item.id === button.dataset.event);
    $('#detail-content').innerHTML = `
      <p class="eyebrow">${event.day} ${event.month} 2026 · ${event.tag}</p>
      <h2 id="detail-title">${event.title}</h2>
      <p>${event.description}</p>
      <p class="detail-meta">${event.meta}</p>
      <button class="button green" data-calendar="${event.id}">Add to calendar</button>
      <p class="detail-meta" style="margin-top:15px">
        Downloads an .ics file. Times are local to Mestecanis.
      </p>
    `;
    openDialog('#detail-dialog');
  }

  if (button.matches('[data-calendar]')) {
    downloadEvent(button.dataset.calendar);
  }

  if (button.id === 'suggest-day') {
    saved = places.map((place) => place.id);
    persist();
    notify('A lovely little day, ready to go.');
  }

  if (button.matches('[data-gallery]')) {
    galleryIndex = Number(button.dataset.gallery);
    renderGallery();
    openDialog('#gallery-dialog');
  }
});

$('#place-search').addEventListener('input', renderPlaces);

$('.menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('open');
  $('.menu-toggle').setAttribute('aria-expanded', open);
});

$('#navigation').addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    $('#navigation').classList.remove('open');
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    $('#navigation').classList.remove('open');
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
  }

  if ($('#gallery-dialog').open && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    galleryIndex = (galleryIndex + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
    renderGallery();
  }
});

$('#clear-plan').addEventListener('click', () => {
  saved = [];
  persist();
  notify('Your day planner is clear.');
});

$('#download-plan').addEventListener('click', () => {
  if (!saved.length) {
    return;
  }

  download(
    'my-day-in-mestecanis.txt',
    `MY DAY IN MESTECANIS\n\n${saved
      .map((id, index) => {
        const place = places.find((item) => item.id === id);
        return `${index + 1}. ${place.title}\n${place.time}\n${place.detail}`;
      })
      .join('\n\n')}\n\nBring comfortable shoes and leave a little room for discovery.\n`,
    'text/plain;charset=utf-8'
  );

  $('#planner-status').textContent = 'Your day plan has been downloaded.';
});

const gallery = [
  {
    file: 'village.jpg',
    caption: 'The quiet corners · Photograph by Rob Farrow',
    alt: 'Honey-coloured cottages on West Street in Castle Combe',
  },
  {
    file: 'countryside.jpg',
    caption: 'A breath of fresh air · Photograph by Ian Capper',
    alt: 'A winding footpath through green countryside on the South Downs Way',
  },
  {
    file: 'street.jpg',
    caption: 'Stories in every stone · Photograph by Colin Smith',
    alt: 'Historic market place in Chipping Norton',
  },
];

let galleryIndex = 0;

function renderGallery() {
  const item = gallery[galleryIndex];
  $('#gallery-image').src = `assets/${item.file}`;
  $('#gallery-image').alt = item.alt;
  $('#gallery-caption').textContent = `${item.caption} · ${galleryIndex + 1}/3`;
}

$('#gallery-prev').addEventListener('click', () => {
  galleryIndex = (galleryIndex + 2) % 3;
  renderGallery();
});

$('#gallery-next').addEventListener('click', () => {
  galleryIndex = (galleryIndex + 1) % 3;
  renderGallery();
});

$('#year').textContent = new Date().getFullYear();
$('.plan-count').textContent = saved.length;
renderPlaces();
renderEvents();
renderPlanner();

$('#open-credits').addEventListener('click', () => openDialog('#credits-dialog'));
