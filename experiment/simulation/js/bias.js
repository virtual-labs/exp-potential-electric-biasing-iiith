const correctAnswers1 = {
    'forward-diffusion': 'diffusion-thick-right',
    'forward-drift': 'drift-thin-left',
    'reverse-diffusion': 'diffusion-thin-right',
    'reverse-drift': 'drift-thick-left'
  };

  let currentPlacements = {
    'forward-diffusion': null,
    'forward-drift': null,
    'reverse-diffusion': null,
    'reverse-drift': null
  };

  function checkAnswers() {
    const feedback = document.getElementById('feedback');
    feedback.innerHTML = '';

    let correctCount = 0;
    let feedbackText = '';

    Object.entries(currentPlacements).forEach(([zone, arrow]) => {
      if (!arrow) {
        feedbackText += `<div>❌ Missing placement for ${zone.replace('-', ' ')}</div>`;
        return;
      }

      if (correctAnswers1[zone] === arrow) {
        correctCount++;
        feedbackText += `<div>✅ ${zone.replace('-', ' ')}: Correct!</div>`;
      } else {
        feedbackText += `<div>❌ ${zone.replace('-', ' ')}: Incorrect. Try again!</div>`;
      }
    });

    feedback.className = `feedback ${correctCount === Object.keys(correctAnswers1).length ? 'success' : 'error'}`;
    feedback.innerHTML = `${correctCount === Object.keys(correctAnswers1).length ? '🎉 Perfect!' : '🔁 Review your answers.'}<br>${feedbackText}`;
  }

  document.querySelectorAll('.arrow').forEach(arrow => {
  arrow.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.dataset.type);
    console.log('Arrow dragged:', e.target.dataset.type); // Debugging log
  });
});

document.querySelectorAll('.drop-zone').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault(); // Allow dropping
    console.log('Dragging over drop zone:', zone.dataset.bias); // Debugging log
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    const arrowType = e.dataTransfer.getData('text/plain');
    const zoneId = e.target.dataset.bias;

    if (arrowType) {
      e.target.textContent = document.querySelector(`[data-type="${arrowType}"]`).textContent;
      currentPlacements[zoneId] = arrowType;

      console.log('Arrow dropped:', arrowType, 'in zone:', zoneId); // Debugging log
    } else {
      console.error('No arrow type found for drop action.');
    }
  });
});