const container = document.querySelector('.container');
const handle = document.querySelector('.handle');
const trigger = document.getElementById('comment');
const bottomSheet = document.getElementById('bottom-sheet');
const loginDiv = document.getElementById('login-form');
const btmFooter = document.getElementById('footer');

let startY;
let currentY;
let isDragging = false;

handle.addEventListener('click', toggleBottomSheet);
trigger.addEventListener('click', toggleBottomSheet);
bottomSheet.addEventListener('touchstart', touchStart);
bottomSheet.addEventListener('touchmove', touchMove);
bottomSheet.addEventListener('touchend', touchEnd);
handle.addEventListener('touchstart', touchStart);
handle.addEventListener('touchmove', touchMove);
handle.addEventListener('touchend', touchEnd);


function toggleLogin() {
  if (container.classList.contains('active-x') && loginDiv.classList.contains('hidden-form')) {
    loginDiv.classList.remove('hidden-form');
    loginDiv.style.bottom='30vh';
    
  } else if (container.classList.contains('active') && loginDiv.classList.contains('hidden-form') ){
    loginDiv.classList.remove('hidden-form');    
    loginDiv.style.bottom='10vh';
  }
  container.classList.toggle('active');
  loginDiv.classList.remove('hidden-form');
  
}

function toggleBottomSheet() {
  container.classList.toggle('active');
}

function touchStart(e) {
  startY = e.touches[0].clientY;
  isDragging = true;
}


function touchMove(e) {
  if (!isDragging) return;

  currentY = e.touches[0].clientY;
  const diffY = startY - currentY;

  if (diffY < 0) {
    e.preventDefault();
    container.style.transform = `translateY(-${diffY}px)`;

    // If .active-x is toggled, remove it and toggle .active
    if (container.classList.contains('active-x')) {
      container.classList.remove('active-x');
      container.classList.toggle('active');
    }
  } else if (diffY > 0 && !container.classList.contains('active-x')) {
    // If .active is toggled and we swipe up, toggle .active-x
    container.classList.add('active-x');
    container.classList.toggle('active');
  }
}

function touchEnd() {
  if (!isDragging) return;

  isDragging = false;

  if (currentY - startY < -100) {
    // If swiping up and .active is toggled, remove .active
    if (container.classList.contains('active')) {
      container.classList.remove('active');
    }
  } else if (currentY - startY > 100) {
    // If swiping down
    if (container.classList.contains('active-x')) {
      // If .active-x is toggled, remove it
      container.classList.remove('active-x');
    } else if (container.classList.contains('active')) {
      // If only .active is toggled and we swipe down, remove .active
      container.classList.remove('active');
    }
  }

  container.style.transform = '';
}

// Get the input field element
const newCommentInput = document.getElementById("new-comment");

// Add a click event listener to the input field
newCommentInput.addEventListener("click", handleInputFieldClick);

// Function to handle the input field click
function handleInputFieldClick() {
  // Get the container element
  const container = document.querySelector(".container");

  // Check if the "active" class is not already toggled
  if (!container.classList.contains("active")) {
    // Toggle the "active" class
    container.classList.toggle("active");
  }
}
