const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const modalBg = document.getElementById('modal-bg');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

loginBtn.onclick = () => {
  modalBg.classList.remove('hidden');
  loginModal.classList.remove('hidden');
  signupModal.classList.add('hidden');
};

signupBtn.onclick = () => {
  modalBg.classList.remove('hidden');
  signupModal.classList.remove('hidden');
  loginModal.classList.add('hidden');
};

modalBg.onclick = (e) => {
  if (e.target === modalBg) {
    modalBg.classList.add('hidden');
    loginModal.classList.add('hidden');
    signupModal.classList.add('hidden');
  }
};



