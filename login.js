let username = "";
let rememberMe = false;

// Função para mostrar a tela de login
function showLogin() {
  document.getElementById("register-container").style.display = "none";
  document.getElementById("login-container").style.display = "block";
}

// Função para mostrar a tela de cadastro
function showRegister() {
  document.getElementById("login-container").style.display = "none";
  document.getElementById("register-container").style.display = "block";
}

// Função para verificar se o usuário está logado automaticamente
function checkLogin() {
  const cookies = document.cookie.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.split("=").map((c) => c.trim());
    cookies[name] = value;
    return cookies;
  }, {});

  if (cookies.username) {
    username = cookies.username;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app").style.display = "block";
    fetchCards();
  }
}

// Função para efetuar login
document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    rememberMe = document.getElementById("remember-me").checked;

    const response = await fetch("login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (result.success) {
      if (rememberMe) {
        document.cookie = `username=${username}; path=/; max-age=${
          60 * 60 * 24 * 30
        }`; // 30 dias de cookie
      }
      document.getElementById("login-container").style.display = "none";
      document.getElementById("app").style.display = "block";
      fetchCards();
    } else {
      alert("Login ou senha incorretos");
    }
  });

// Função para cadastrar novo usuário
document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const registerUsername = document.getElementById("register-username").value;
    const registerPassword = document.getElementById("register-password").value;

    const response = await fetch("register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: registerUsername,
        password: registerPassword,
      }),
    });
    const result = await response.json();

    if (result.success) {
      alert("Usuário cadastrado com sucesso! Faça login.");
      showLogin();
    } else {
      alert("Erro ao cadastrar usuário: " + result.message);
    }
  });


  // Função para logoff
function logoff() {
  document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  location.reload();
}

// Função para atualizar a senha
async function updatePassword() {
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem.");
    return;
  }

  const response = await fetch("update_password.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, newPassword }),
  });
  const result = await response.json();

  if (result.success) {
    alert("Senha atualizada com sucesso!");
    closeSettingsModal();
  } else {
    alert("Erro ao atualizar a senha: " + result.message);
  }
}