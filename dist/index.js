var createSequence=(function(){'use strict';const getElementById = (id) => document.getElementById(id);
const getElement = (selector) => document.querySelector(selector);const backdropHTML = `<div id="tooltip-helper-backdrop" class="tooltip-helper-backdrop"></div>`;

const confirmationHTML = `<div id="tooltip-helper-confirmation" class="tooltip-helper-confirmation">
  <div id="tour-desc" class="tour-desc"></div>
  <div class="tour-buttons">
    <button id="tooltip-helper-confirmation-yes" class="tooltip-helper-confirmation-yes">Yes</button>
    <button id="tooltip-helper-confirmation-no" class="tooltip-helper-confirmation-no">No</button>
  </div>
</div>`;

const prevButtonHTML = `<button id="tooltip-helper-prev-sequence" class="tooltip-helper-prev-sequence mt-2">Previous</button>`;

const nextButtonHTML = `<button id="tooltip-helper-next-sequence" class="tooltip-helper-next-sequence mt-2 ml-2">Next</button>`;

const closeButtonHTML = `<button id="tooltip-helper-end-sequence" class="tooltip-helper-end-sequence">Quit</button>`;const offset = 10;
var sequenceIndex = 0;

const createStage = (sequence, originalSequence) => {
  const { element, description } = sequence;
  const backdrop = getElementById("tooltip-helper-backdrop");

  let elem = getElement(element);
  if (!elem) return endSequence();
  getElement('body').classList.add('stop-scroll');
  elem.scrollIntoView({ behaviour: 'smooth', block: 'center' });
  let styles = getComputedStyle(elem);
  let elemBoundaries = elem.getBoundingClientRect();
  let position = {
    x: elemBoundaries.left,
    y: elemBoundaries.top + elemBoundaries.height + offset
  };

  let activeElement = getElement("#tooltip-helper-backdrop .tooltip-helper-active");
  if (!activeElement) {
    activeElement = document.createElement("div");
    activeElement.classList.add("tooltip-helper-active");
    backdrop.append(activeElement);
  }
  activeElement.style.top = elemBoundaries.top + "px";
  activeElement.style.left = elemBoundaries.left + "px";
  activeElement.style.height = elemBoundaries.height + "px";
  activeElement.style.width = elemBoundaries.width + "px";
  activeElement.style.borderRadius = styles.borderRadius;

  let descriptionElement = getElement("#tooltip-helper-backdrop .tooltip-helper-active-description");
  if (!descriptionElement) {
    descriptionElement = document.createElement("div");
    descriptionElement.classList.add("tooltip-helper-active-description");
    descriptionElement.innerHTML += closeButtonHTML;
    descriptionElement.innerHTML += "<p id='tooltip-helper-active-description-text' class='mt-2 mb-2'>" + description + "</p>";
    descriptionElement.innerHTML += prevButtonHTML;
    descriptionElement.innerHTML += nextButtonHTML;
    backdrop.append(descriptionElement);
  }
  const prevBtn = getElementById("tooltip-helper-prev-sequence");
  const nextBtn = getElementById("tooltip-helper-next-sequence");
  if (sequenceIndex === 0) { 
    prevBtn.setAttribute('disabled', true);
    prevBtn.classList.add("tooltip-disabled-btn");
    nextBtn.innerText = "Next";
  } else {
    prevBtn.removeAttribute('disabled', true);
    prevBtn.classList.remove("tooltip-disabled-btn");
    if (sequenceIndex === originalSequence.length - 1) {
      nextBtn.innerText = "Finish";
    } else {
      nextBtn.innerText = "Next";
    }
  }
  descriptionElement.style.transform = "translateX(" + position.x + "px) translateY(" + position.y + "px)";
  getElementById("tooltip-helper-active-description-text").innerHTML = description;
};

const startSequence = (sequence) => {
  let currentSequence = sequence[sequenceIndex];
  const backdrop = getElementById("tooltip-helper-backdrop");
  backdrop.style.background = "transparent";
  backdrop.removeChild(backdrop.firstChild);
  return createStage(currentSequence, sequence);
};

const endSequence = () => {
  getElement('body').classList.remove('stop-scroll');
  getElementById("tooltip-helper-backdrop").style.background = "transparent";
  const element = getElementById("tooltip-helper-backdrop");
  element.parentNode.removeChild(element);
};

const next = (sequence) => {
  sequenceIndex += 1;
  if (sequenceIndex <= sequence.length - 1) {
    return createStage(sequence[sequenceIndex], sequence);
  } else {
    getElement(sequence[sequenceIndex - 1].element).classList.remove("tooltip-helper-active-element");
    getElementById("tooltip-helper-backdrop").removeEventListener("click", function(e) {});
    endSequence();
    return;
  }
};

const prev = (sequence) => {
  sequenceIndex -= 1;
  if (sequenceIndex >= 0) {
    return createStage(sequence[sequenceIndex], sequence);
  } else {
    getElement(sequence[sequenceIndex + 1].element).classList.remove("tooltip-helper-active-element");
    getElementById("tooltip-helper-backdrop").removeEventListener("click", function(e) {});
    endSequence();
    return;
  }
};

const createSequence = (data) => {
  const { welcomeText, confirmText, cancelText, sequence } = data;

  getElement("body").innerHTML += backdropHTML;
  getElementById("tooltip-helper-backdrop").innerHTML = confirmationHTML;
  getElementById("tour-desc").innerText = welcomeText;
  getElementById("tooltip-helper-confirmation-yes").innerText = confirmText;
  getElementById("tooltip-helper-confirmation-no").innerText = cancelText;
  getElementById("tooltip-helper-backdrop").addEventListener("click", (e) => {
    switch(e.target.id) {
      case 'tooltip-helper-confirmation-yes': return startSequence(sequence);
      case 'tooltip-helper-next-sequence': return next(sequence);
      case 'tooltip-helper-prev-sequence': return prev(sequence);
      case 'tooltip-helper-end-sequence': return endSequence();
      case 'tooltip-helper-confirmation-no': return endSequence();
      default: return;
    }
  });
};return createSequence;}());