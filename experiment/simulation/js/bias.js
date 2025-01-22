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
    // Add touch events for mobile
    arrow.addEventListener('touchstart', e => {
      e.preventDefault();
      const arrowType = e.target.dataset.type;
      window.currentDraggedItem = arrowType;
      console.log('Arrow touched:', arrowType);
      e.target.classList.add('dragging');
    });

    // Keep existing drag event
    arrow.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', e.target.dataset.type);
      console.log('Arrow dragged:', e.target.dataset.type);
    });

    arrow.addEventListener('touchend', e => {
      e.target.classList.remove('dragging');
    });
  });

  document.querySelectorAll('.drop-zone').forEach(zone => {
    // Add touch events for mobile
    zone.addEventListener('touchend', e => {
      e.preventDefault();
      const arrowType = window.currentDraggedItem;
      const zoneId = e.target.dataset.bias;

      if (arrowType) {
        e.target.textContent = document.querySelector(`[data-type="${arrowType}"]`).textContent;
        currentPlacements[zoneId] = arrowType;
        window.currentDraggedItem = null;
        console.log('Arrow touched and placed:', arrowType, 'in zone:', zoneId);
      }
    });

    // Keep existing dragover and drop events
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      console.log('Dragging over drop zone:', zone.dataset.bias);
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      const arrowType = e.dataTransfer.getData('text/plain');
      const zoneId = e.target.dataset.bias;

      if (arrowType) {
        e.target.textContent = document.querySelector(`[data-type="${arrowType}"]`).textContent;
        currentPlacements[zoneId] = arrowType;
        console.log('Arrow dropped:', arrowType, 'in zone:', zoneId);
      } else {
        console.error('No arrow type found for drop action.');
      }
    });

    zone.addEventListener('touchenter', e => {
      e.target.classList.add('drag-over');
    });
    
    zone.addEventListener('touchleave', e => {
      e.target.classList.remove('drag-over');
    });
    
    zone.addEventListener('touchend', e => {
      e.target.classList.remove('drag-over');
    });
  });