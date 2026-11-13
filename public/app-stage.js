(() => {
  const root = document.querySelector('.stage-app');
  if (!root) return;

  const apiUrl = root.dataset.api;
  const requestedRole = new URLSearchParams(window.location.search).get('role');
  const state = {
    role: requestedRole === 'admin' ? 'admin' : 'monitor',
    token: sessionStorage.getItem('wb-stage-token') || '',
    stages: [],
    days: [],
    participants: [],
    summary: {},
    stageId: '',
    dayId: '',
    lastVoteId: localStorage.getItem('wb-last-vote') || '',
    votePending: false,
  };

  const $ = (selector) => document.querySelector(selector);
  const loginScreen = $('#login-screen');
  const workspace = $('#workspace');
  const networkState = $('#network-state');
  const queueKey = 'wb-stage-vote-queue';

  const queuedVotes = () => JSON.parse(localStorage.getItem(queueKey) || '[]');
  const saveQueue = (queue) => localStorage.setItem(queueKey, JSON.stringify(queue));

  document.querySelectorAll('.role').forEach((button) => {
    button.classList.toggle('active', button.dataset.role === state.role);
  });

  async function callApi(action, payload = {}, useToken = true) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ action, token: useToken ? state.token : undefined, ...payload }),
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const data = await response.json();
    if (data.ok === false) throw new Error(data.message || 'Action impossible');
    return data;
  }

  function setNetworkState() {
    const online = navigator.onLine;
    networkState.classList.toggle('offline', !online);
    networkState.querySelector('strong').textContent = online ? 'En ligne' : 'Hors connexion';
    updateQueueNote();
    if (online) flushVotes();
  }

  function updateQueueNote() {
    const count = queuedVotes().length;
    $('#queue-note').textContent = count ? `${count} vote${count > 1 ? 's' : ''} en attente de synchronisation` : '';
  }

  async function flushVotes() {
    const queue = queuedVotes();
    if (!queue.length || !state.token) return;
    const remaining = [];
    for (const vote of queue) {
      try {
        await callApi('vote', { vote: { ...vote, Source: 'Hors ligne synchronise' } });
      } catch {
        remaining.push(vote);
      }
    }
    saveQueue(remaining);
    updateQueueNote();
  }

  document.querySelectorAll('.role').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.role').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      state.role = button.dataset.role;
    });
  });

  $('#login-button').addEventListener('click', async () => {
    const pin = $('#pin').value.trim();
    const message = $('#login-message');
    if (!pin) {
      message.textContent = 'Entre ton code PIN.';
      return;
    }
    message.textContent = 'Connexion…';
    try {
      const data = await callApi('login', { pin, role: state.role }, false);
      state.token = data.token;
      state.role = data.role || state.role;
      sessionStorage.setItem('wb-stage-token', state.token);
      await loadContext();
      openWorkspace();
    } catch (error) {
      message.textContent = error.message || 'Code incorrect ou service indisponible.';
    }
  });

  $('#logout-button').addEventListener('click', () => {
    sessionStorage.removeItem('wb-stage-token');
    state.token = '';
    workspace.classList.add('hidden');
    loginScreen.classList.remove('hidden');
  });

  async function loadContext() {
    const data = await callApi('context');
    state.stages = data.stages || [];
    state.summary = data.summary || {};
    renderStages();
  }

  function openWorkspace() {
    loginScreen.classList.add('hidden');
    workspace.classList.remove('hidden');
    const admin = state.role === 'admin';
    $('#monitor-tabs').classList.toggle('hidden', admin);
    ['#attendance-panel', '#vote-panel', '#debrief-panel'].forEach((id) => $(id).classList.toggle('hidden', admin || id !== '#attendance-panel'));
    $('#admin-panel').classList.toggle('hidden', !admin);
    if (admin) renderAdmin();
    flushVotes();
  }

  function renderStages() {
    const select = $('#stage-select');
    select.replaceChildren();
    state.stages.forEach((stage) => {
      const option = document.createElement('option');
      option.value = stage.id;
      option.textContent = stage.name;
      select.append(option);
    });
    state.stageId = select.value || '';
    updateSelectedStage();
  }

  function updateSelectedStage() {
    const stage = state.stages.find((item) => String(item.id) === String(state.stageId));
    state.days = stage?.days || [];
    state.participants = stage?.participants || [];
    const daySelect = $('#day-select');
    daySelect.replaceChildren();
    state.days.forEach((day) => {
      const option = document.createElement('option');
      option.value = day.id;
      option.textContent = day.label;
      daySelect.append(option);
    });
    state.dayId = daySelect.value || '';
    renderParticipants();
    if (state.role === 'admin') renderAdmin();
  }

  $('#stage-select').addEventListener('change', (event) => {
    state.stageId = event.target.value;
    updateSelectedStage();
  });

  $('#day-select').addEventListener('change', (event) => {
    state.dayId = event.target.value;
    renderParticipants();
    if (state.role === 'admin') renderAdmin();
  });

  document.querySelectorAll('.app-tabs button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.app-tabs button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      ['attendance-panel', 'vote-panel', 'debrief-panel'].forEach((id) => $(`#${id}`).classList.toggle('hidden', id !== button.dataset.panel));
    });
  });

  function renderParticipants() {
    const list = $('#participant-list');
    list.replaceChildren();
    const day = state.days.find((item) => String(item.id) === String(state.dayId));
    const attendance = day?.attendance || {};
    state.participants.forEach((participant) => {
      const row = document.createElement('div');
      row.className = 'participant';
      row.dataset.id = participant.id;
      const name = document.createElement('strong');
      name.textContent = participant.name;
      row.append(name);
      const label = document.createElement('label');
      label.className = 'attendance-toggle';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = ['Present', 'Retard'].includes(attendance[String(participant.id)]);
      checkbox.setAttribute('aria-label', `${participant.name} présent`);
      const status = document.createElement('span');
      const updateStatus = () => { status.textContent = checkbox.checked ? 'Présent' : 'Absent'; };
      checkbox.addEventListener('change', () => { updateStatus(); updateAttendanceCounter(); });
      updateStatus();
      label.append(checkbox, status);
      row.append(label);
      list.append(row);
    });
    updateAttendanceCounter();
  }

  function updateAttendanceCounter() {
    const rows = [...document.querySelectorAll('.participant')];
    const present = rows.filter((row) => row.querySelector('input[type="checkbox"]')?.checked).length;
    $('#attendance-counter').textContent = `${present} / ${rows.length}`;
  }

  $('#save-attendance').addEventListener('click', async () => {
    const button = $('#save-attendance');
    const attendance = [...document.querySelectorAll('.participant')].map((row) => ({
      participantId: row.dataset.id,
      status: row.querySelector('input[type="checkbox"]')?.checked ? 'Present' : 'Absent',
    }));
    button.disabled = true;
    button.textContent = 'Enregistrement…';
    try {
      await callApi('attendance', { stageId: state.stageId, dayId: state.dayId, attendance });
      const day = state.days.find((item) => String(item.id) === String(state.dayId));
      if (day) day.attendance = Object.fromEntries(attendance.map((item) => [String(item.participantId), item.status]));
      button.textContent = 'Présences enregistrées';
    } catch (error) {
      button.textContent = error.message || 'Réessayer';
    } finally {
      setTimeout(() => { button.disabled = false; button.textContent = 'Enregistrer les présences'; }, 1800);
    }
  });

  async function recordVote(smiley) {
    if (state.votePending || !smiley || !state.dayId) return;
    state.votePending = true;
    document.querySelectorAll('.smiley').forEach((item) => { item.disabled = true; });
    const vote = {
      Vote_ID: crypto.randomUUID(),
      Smiley: smiley,
      Vote_le: new Date().toISOString(),
      Source: navigator.onLine ? 'En ligne' : 'Hors ligne synchronise',
      dayId: state.dayId,
    };
    state.lastVoteId = vote.Vote_ID;
    localStorage.setItem('wb-last-vote', state.lastVoteId);
    if (navigator.onLine) {
      try {
        await callApi('vote', { vote });
      } catch {
        saveQueue([...queuedVotes(), vote]);
      }
    } else {
      saveQueue([...queuedVotes(), vote]);
    }
    $('#thank-you').classList.remove('hidden');
    updateQueueNote();
    setTimeout(() => {
      $('#thank-you').classList.add('hidden');
      document.querySelectorAll('.smiley').forEach((item) => { item.disabled = false; });
      state.votePending = false;
    }, 900);
  }

  document.querySelectorAll('.smiley').forEach((button) => {
    button.addEventListener('click', () => recordVote(button.dataset.smiley));
  });

  $('#undo-vote').addEventListener('click', async () => {
    if (!state.lastVoteId) return;
    const queue = queuedVotes();
    const localVote = queue.find((vote) => vote.Vote_ID === state.lastVoteId);
    if (localVote) {
      saveQueue(queue.filter((vote) => vote.Vote_ID !== state.lastVoteId));
    } else {
      try { await callApi('undoVote', { voteId: state.lastVoteId }); } catch { return; }
    }
    state.lastVoteId = '';
    localStorage.removeItem('wb-last-vote');
    updateQueueNote();
  });

  $('#debrief-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('#debrief-message');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if ((data.Depart_ecart === 'Autre' || data.Retour_ecart === 'Autre') && !String(data.Horaire_autre_detail || '').trim()) {
      message.textContent = 'Précise l’horaire lorsque tu choisis « Autre ».';
      event.currentTarget.elements.Horaire_autre_detail.focus();
      return;
    }
    message.textContent = 'Enregistrement…';
    try {
      await callApi('debrief', { stageId: state.stageId, dayId: state.dayId, debrief: data });
      message.textContent = 'Débrief enregistré. Merci.';
    } catch (error) {
      message.textContent = error.message || 'Le débrief n’a pas pu être enregistré.';
    }
  });

  document.querySelectorAll('input[name="Depart_ecart"], input[name="Retour_ecart"]').forEach((input) => {
    input.addEventListener('change', () => {
      const form = $('#debrief-form');
      const show = form.elements.Depart_ecart.value === 'Autre' || form.elements.Retour_ecart.value === 'Autre';
      $('#timing-detail').classList.toggle('hidden', !show);
    });
  });

  function renderAdmin() {
    const summary = state.summary[state.stageId] || {};
    const metrics = [
      ['Présents', summary.present ?? '–'],
      ['Réponses parents', summary.feedbacks ?? '–'],
      ['Note', summary.score ? `${summary.score}/5` : '–'],
      ['Résultat', summary.result !== undefined ? `${summary.result} €` : '–'],
    ];
    const grid = $('#metric-grid');
    grid.replaceChildren();
    metrics.forEach(([label, value]) => {
      const card = document.createElement('div');
      card.className = 'metric';
      const small = document.createElement('span');
      small.textContent = label;
      const strong = document.createElement('strong');
      strong.textContent = value;
      card.append(small, strong);
      grid.append(card);
    });
    const votes = summary.votes || {};
    const voteResults = $('#vote-results');
    voteResults.replaceChildren();
    [['☹️', votes.Triste || 0], ['🙂', votes.Bien || 0], ['🤩', votes['Tres heureux'] || 0]].forEach(([icon, count]) => {
      const card = document.createElement('div');
      card.className = 'vote-result';
      const span = document.createElement('span'); span.textContent = icon;
      const strong = document.createElement('strong'); strong.textContent = count;
      card.append(span, strong);
      voteResults.append(card);
    });
    const parents = summary.parents || {};
    const parentOverview = $('#parent-overview');
    parentOverview.replaceChildren();
    [
      ['Réponses', `${parents.responses ?? 0} / ${parents.total ?? 0}`],
      ['Note moyenne', parents.average ? `${parents.average}/5` : '–'],
      ['Recommandent', parents.recommendYes ?? 0],
    ].forEach(([label, value]) => {
      const card = document.createElement('div');
      card.className = 'parent-stat';
      const small = document.createElement('span'); small.textContent = label;
      const strong = document.createElement('strong'); strong.textContent = value;
      card.append(small, strong);
      parentOverview.append(card);
    });
    const improvementTags = $('#improvement-tags');
    improvementTags.replaceChildren();
    (parents.improvements || []).forEach(([label, count]) => {
      const tag = document.createElement('span');
      tag.className = 'improvement-tag';
      tag.textContent = `${label} · ${count}`;
      improvementTags.append(tag);
    });
    const bilan = $('#stage-bilan');
    bilan.replaceChildren();
    const decision = document.createElement('span');
    decision.className = 'decision';
    decision.textContent = summary.decision || 'Bilan en attente';
    const synthesis = document.createElement('p');
    synthesis.textContent = summary.synthesis || 'La synthèse sera générée à H+48.';
    const actions = document.createElement('p');
    const actionLabel = document.createElement('strong');
    actionLabel.textContent = 'Actions : ';
    actions.append(actionLabel, document.createTextNode(summary.actions || 'Aucune action enregistrée.'));
    bilan.append(decision, synthesis, actions);
    const alerts = $('#admin-alerts');
    alerts.replaceChildren();
    (summary.alerts || ['Aucune alerte active.']).forEach((text) => {
      const alert = document.createElement('div');
      alert.className = 'alert';
      alert.textContent = text;
      alerts.append(alert);
    });
  }

  $('#refresh-admin').addEventListener('click', async () => {
    await loadContext();
    renderAdmin();
  });

  window.addEventListener('online', setNetworkState);
  window.addEventListener('offline', setNetworkState);
  setNetworkState();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/stage-app-sw.js?v=20261104-1');
  if (state.token) {
    callApi('context').then((data) => {
      state.stages = data.stages || [];
      state.summary = data.summary || {};
      state.role = data.role || 'monitor';
      renderStages();
      openWorkspace();
    }).catch(() => sessionStorage.removeItem('wb-stage-token'));
  }
})();
