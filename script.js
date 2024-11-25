let currentCardIndex = null;
let cards = [];

// Funções para gerenciamento de cards
function limpaCamposAddItem() {
  document.getElementById("add-name").value = "";
  document.getElementById("add-type").value = "Anime";
  document.getElementById("add-thumbnail").value = "";
  document.getElementById("add-url").value = "";
  document.getElementById("add-episode").value = "";
}
async function addItem() {
  const name = document.getElementById("add-name").value;
  const type = document.getElementById("add-type").value;
  const thumbnail = document.getElementById("add-thumbnail").value;
  const url = document.getElementById("add-url").value;
  const lastEpisode = document.getElementById("add-episode").value;

  const newCard = {
    name,
    type,
    thumbnail,
    url,
    lastEpisode,
    updatedAt: new Date().toISOString(), // Adiciona a data de atualização
  };
  cards.push(newCard);

  const response = await fetch("save_data.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, items: cards }),
  });
  const result = await response.json();

  if (result.success) {
    limpaCamposAddItem();
    closeAddModal();
    filterCards();
  } else {
    alert("Erro ao salvar item: " + result.message);
  }
}

async function updateItem() {
  const name = document.getElementById("edit-name").value;
  const type = document.getElementById("edit-type").value;
  const thumbnail = document.getElementById("edit-thumbnail").value;
  const url = document.getElementById("edit-url").value;
  const lastEpisode = document.getElementById("edit-episode").value;

  const updatedCard = {
    name,
    type,
    thumbnail,
    url,
    lastEpisode,
    updatedAt: new Date().toISOString(), // Atualiza a data de atualização
  };
  cards[currentCardIndex] = updatedCard;

  const response = await fetch("save_data.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, items: cards }),
  });
  const result = await response.json();

  if (result.success) {
    closeEditModal();
    filterCards();
  } else {
    alert("Erro ao atualizar item: " + result.message);
  }
}

function filterCards() {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const showAnime = document.getElementById("filter-anime").checked;
  const showManga = document.getElementById("filter-manga").checked;

  const container = document.getElementById("container");
  container.textContent = "";

  if (!showAnime && !showManga) {
    container.textContent = "Nenhuma categoria marcada.";
    return;
  }

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery);
    const matchesType =
      (showAnime && card.type === "Anime") ||
      (showManga && card.type === "Manga");
    return matchesSearch && matchesType;
  });

  // Ordena os cards pela data de atualização
  filteredCards.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  if (filteredCards.length === 0) {
    container.textContent = "Nenhum resultado"; // Mensagem se não houver resultados
    return;
  }

  filteredCards.forEach((card, index) => {
    const originalIndex = cards.findIndex(
      (c) => c.name === card.name && c.type === card.type
    );
    const thumbnailContainer = document.createElement("div");
    thumbnailContainer.setAttribute("class", "thumbnailContainer");
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const cardElementimgThumbnail = document.createElement("img");
    cardElementimgThumbnail.setAttribute("src", card.thumbnail);
    cardElementimgThumbnail.setAttribute(
      "onclick",
      `openCardAndEdit(${originalIndex})`
    );
    cardElementimgThumbnail.setAttribute("class", "thumbnail");
    cardElementimgThumbnail.setAttribute(
      "onerror",
      "this.onerror=null;this.src='404.jpg';"
    );
    const cardElementspan = document.createElement("span");
    cardElementspan.setAttribute(
      "onclick",
      `openCardAndEdit(${originalIndex})`
    );
    cardElementspan.setAttribute("style", `font-weight:bold`);
    cardElementspan.textContent = `${card.name}`;

    const cardElementdiv = document.createElement("div");
    cardElementdiv.textContent = `Tipo: ${card.type}`;

    const cardElementdiv2 = document.createElement("div");
    cardElementdiv2.textContent = `${
      card.type == "Manga" ? "capitulo" : "episodio"
    }: ${card.lastEpisode}`;
    const cardElementButton = document.createElement("button");
    cardElementButton.setAttribute(
      "onclick",
      `openEditModal(${originalIndex})`
    );
    cardElementButton.textContent = `Editar`;
    thumbnailContainer.appendChild(cardElementimgThumbnail);
    cardElement.appendChild(thumbnailContainer);
    cardElement.appendChild(cardElementspan);
    cardElement.appendChild(cardElementdiv);
    cardElement.appendChild(cardElementdiv2);
    cardElement.appendChild(cardElementButton);
    container.appendChild(cardElement);
  });
}

// Função para abrir o modal de adicionar um novo item
function openAddModal() {
  document.getElementById("add-modal").style.display = "flex";
}

// Função para fechar o modal de adicionar item
function closeAddModal() {
  document.getElementById("add-modal").style.display = "none";
}

// Função para abrir o modal específico para editar URL e Capítulo assistido
function openCardAndEdit(index) {
  currentCardIndex = index;
  const card = cards[index];
  document.getElementById("edit-specific-url").value = card.url;
  document.getElementById("edit-specific-episode").value = card.lastEpisode;

  window.open(card.url, "_blank");

  document.getElementById("edit-specific-modal").style.display = "flex";
}

// Função para fechar o modal específico
function closeEditSpecificModal() {
  document.getElementById("edit-specific-modal").style.display = "none";
}

// Função para atualizar apenas o URL e Capítulo assistido
async function updateSpecificItem() {
  const url = document.getElementById("edit-specific-url").value;
  const lastEpisode = document.getElementById("edit-specific-episode").value;

  cards[currentCardIndex].url = url;
  cards[currentCardIndex].lastEpisode = lastEpisode;
  cards[currentCardIndex].updatedAt = new Date().toISOString(); // Atualiza a data de atualização

  const response = await fetch("save_data.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, items: cards }),
  });
  const result = await response.json();

  if (result.success) {
    closeEditSpecificModal();
    filterCards();
  } else {
    alert("Erro ao atualizar item: " + result.message);
  }
}

// Função para abrir o modal de edição geral
function openEditModal(index) {
  currentCardIndex = index;
  const card = cards[index];
  document.getElementById("edit-name").value = card.name;
  document.getElementById("edit-type").value = card.type;
  document.getElementById("edit-thumbnail").value = card.thumbnail;
  document.getElementById("edit-url").value = card.url;
  document.getElementById("edit-episode").value = card.lastEpisode;
  document.getElementById("edit-modal").style.display = "flex";
}

// Função para fechar o modal de edição
function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none";
}

// Função para excluir um item e salvar a alteração no backend
async function deleteItem() {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    cards.splice(currentCardIndex, 1);

    const response = await fetch("save_data.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, items: cards }),
    });
    const result = await response.json();

    if (result.success) {
      closeEditModal();
      filterCards();
    } else {
      alert("Erro ao excluir item: " + result.message);
    }
  }
}

async function fetchCards() {
  try {
    const response = await fetch(`load_data.php?username=${username}`);
    if (response.ok) {
      cards = await response.json();

      // Adiciona updatedAt para cards que não têm
      cards.forEach((card) => {
        if (!card.updatedAt) {
          card.updatedAt = new Date().toISOString(); // Define a data atual se não existir
        }
      });

      filterCards(); // Chame a função de filtragem após buscar os dados
    } else {
      console.error("Erro ao buscar cards:", response.status);
      cards = [];
      filterCards();
    }
  } catch (error) {
    console.error("Erro ao buscar cards:", error);
    cards = [];
    filterCards();
  }
}

// Adicionando event listeners para os checkboxes e a barra de pesquisa
document
  .getElementById("search-bar")
  .addEventListener("input", filterCards, { passive: true });
document
  .getElementById("filter-anime")
  .addEventListener("change", filterCards, { passive: true });
document
  .getElementById("filter-manga")
  .addEventListener("change", filterCards, { passive: true });

// Chame `fetchCards` quando a página carregar
window.addEventListener(
  "load",
  function () {
    checkLogin(); // Verifica login e carrega os cards
  },
  { passive: true }
);

// Função para abrir o modal de configurações
function openSettingsModal() {
  document.getElementById("settings-modal").style.display = "flex";
}

// Função para fechar o modal de configurações
function closeSettingsModal() {
  document.getElementById("settings-modal").style.display = "none";
}

// Função para exportar a lista
function exportList() {
  const blob = new Blob([JSON.stringify(cards, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const dataAtual = new Date();
  const data = `${dataAtual.getHours()}h${dataAtual.getMinutes()}_${dataAtual.getDate()}-${dataAtual.getMonth()}-${dataAtual.getFullYear()}`;
  const nomeArquivoExportado = `animangator_listaBK_${data}`;
  a.download = nomeArquivoExportado;
  a.click();
  URL.revokeObjectURL(url);
}

// Função para importar a lista
function importList() {
  const fileInput = document.getElementById("import-file");
  fileInput.click();

  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const importedCards = JSON.parse(e.target.result);
        cards = importedCards;
        await saveImportedList();
      } catch (error) {
        alert("Erro ao importar lista: " + error.message);
      }
    };

    reader.readAsText(file);
  };
}

// Função para salvar a lista importada no backend
async function saveImportedList() {
  const response = await fetch("save_data.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, items: cards }),
  });
  const result = await response.json();

  if (result.success) {
    alert("Lista importada com sucesso!");
    filterCards();
    closeSettingsModal();
  } else {
    alert("Erro ao importar lista: " + result.message);
  }
}

function addEventoPesquisaImg(objeto, tipoAcao) {
  objeto.addEventListener("input", async function () {
    const query = this.value;

    if (query.length < 3) {
      document.getElementById(`suggestions-${tipoAcao}`).style.display = "none";
      return; // Não busca se a consulta tiver menos de 3 caracteres
    }

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
        {
          Page {
            media(search: "${query}", type: ANIME) {
              id
              title {
                romaji
              }
              coverImage {
                medium
              }
            }
          }
        }
      `,
      }),
    });

    const result = await response.json();
    const suggestions = result.data.Page.media;

    const suggestionsContainer = document.getElementById(
      `suggestions-${tipoAcao}`
    );
    suggestionsContainer.innerHTML = ""; // Limpa sugestões anteriores

    if (suggestions.length > 0) {
      suggestions.forEach((media) => {
        const item = document.createElement("div");
        const itemSmallThumbnail = document.createElement("img");
        const itemText = document.createElement("span");
        itemSmallThumbnail.className = "suggestion-itemSmallThumbnail";
        itemSmallThumbnail.src = media.coverImage.medium;
        item.className = "suggestion-item";
        itemText.textContent = media.title.romaji;
        item.onclick = () => {
          objeto.value = media.title.romaji;

          const novaImgCover = media.coverImage.medium.replace(
            "/small/",
            "/medium/"
          );
          document.getElementById(`${tipoAcao}-thumbnail`).value = novaImgCover; // Preenche a thumbnail
          suggestionsContainer.style.display = "none"; // Fecha sugestões
        };
        suggestionsContainer.appendChild(item);
        item.appendChild(itemSmallThumbnail);
        item.appendChild(itemText);
      });
      suggestionsContainer.style.display = "block"; // Mostra sugestões
    } else {
      suggestionsContainer.style.display = "none"; // Oculta se não houver resultados
    }
  });
}

addEventoPesquisaImg(document.getElementById("add-name"), "add");
addEventoPesquisaImg(document.getElementById("edit-name"), "edit");

document.addEventListener("click", function (event) {
  const suggestionsContainer = document.getElementById(`suggestions-add`);
  if (
    !suggestionsContainer.contains(event.target) &&
    event.target.id !== "add-name"
  ) {
    suggestionsContainer.style.display = "none"; // Oculta se clicar fora
  }

  const suggestionsContainer2 = document.getElementById(`suggestions-edit`);
  if (
    !suggestionsContainer2.contains(event.target) &&
    event.target.id !== "edit-name"
  ) {
    suggestionsContainer2.style.display = "none"; // Oculta se clicar fora
  }
});

function somaSubtraiNumero(operacao, elemento) {
  const elem = document.getElementById(elemento);
  const valorAnterior = parseInt(elem.value) || 0;
  elem.value = operacao === "+" ? valorAnterior + 1 : valorAnterior - 1;
}

function buttonTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

document.addEventListener("contextmenu", function (event) {
  event.preventDefault(); // Desabilita o menu de contexto
});
