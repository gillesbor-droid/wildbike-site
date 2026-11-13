(() => {
  const root = document.querySelector('.feedback-page');
  if (!root) return;
  const apiUrl = root.dataset.api;
  const token = new URLSearchParams(location.search).get('token');
  const form = document.querySelector('#feedback-form');
  const message = document.querySelector('#feedback-message');

  async function callApi(action, payload = {}) {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ action, token, ...payload }),
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const data = await response.json();
    if (data.ok === false) throw new Error(data.message || 'Action impossible');
    return data;
  }

  if (!token) {
    form.classList.add('hidden');
    message.textContent = 'Ce lien de questionnaire est incomplet.';
    return;
  }

  callApi('context').then((data) => {
    if (data.stageName) document.querySelector('#feedback-title').textContent = `Votre retour sur ${data.stageName}`;
    if (data.childName) document.querySelector('#feedback-intro').textContent = `Le retour de ${data.childName} nous aide à améliorer les prochaines aventures Wild Bike.`;
  }).catch((error) => {
    message.textContent = error.message || 'Ce questionnaire n’est plus disponible.';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);
    payload.Ameliorations = formData.getAll('Ameliorations');
    payload.Autorisation_temoignage = formData.has('Autorisation_temoignage');
    message.textContent = 'Envoi…';
    try {
      const data = await callApi('submit', { feedback: payload });
      document.querySelector('#feedback-card').classList.add('hidden');
      const thanks = document.querySelector('#thanks');
      document.querySelector('#google-review').href = data.googleReviewUrl || 'https://www.google.com/search?q=Wild+Bike+Toulon+avis';
      document.querySelector('#facebook-review').href = data.facebookReviewUrl || 'https://www.facebook.com/wildbike83/';
      thanks.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      message.textContent = error.message || 'Votre réponse n’a pas pu être envoyée.';
    }
  });
})();
