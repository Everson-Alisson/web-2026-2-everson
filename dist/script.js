/* Campus Fácil — aplicação de página única, responsiva e sem backend. */

const GOOGLE_CLIENT_ID = '356291206967-sf8r4u443du72kgvurd0f7dhmre0qdaf.apps.googleusercontent.com';

const locais = [
  { id: 'biblioteca', nome: 'Biblioteca Central', categoria: 'biblioteca', categoriaNome: 'Biblioteca', bloco: 'a', localizacao: 'Bloco A • Térreo', descricao: 'Acervo geral, espaços de estudo, empréstimos e orientação para pesquisas acadêmicas.', horario: 'Seg–Sex, 7h às 21h', status: 'Aberto agora', statusClasse: 'open', aberto: true, acessivel: true, setor: 'Coordenação de Bibliotecas', contato: 'biblioteca@campus.edu.br', icone: '📚', acessibilidade: ['Entrada com rampa', 'Banheiro acessível', 'Balcão rebaixado', 'Rota sem degraus'] },
  { id: 'secretaria', nome: 'Secretaria Acadêmica', categoria: 'administrativo', categoriaNome: 'Administrativo', bloco: 'b', localizacao: 'Bloco B • Sala 104', descricao: 'Matrículas, históricos, declarações e atendimento acadêmico ao estudante.', horario: 'Seg–Sex, 8h às 18h', status: 'Aberto agora', statusClasse: 'open', aberto: true, acessivel: true, setor: 'Pró-Reitoria de Graduação', contato: 'secretaria@campus.edu.br', icone: '🏛️', acessibilidade: ['Entrada com rampa', 'Atendimento prioritário', 'Rota sem degraus'] },
  { id: 'laboratorio', nome: 'Laboratório de Informática', categoria: 'laboratorio', categoriaNome: 'Laboratório', bloco: 'c', localizacao: 'Bloco C • Sala 203', descricao: 'Computadores, internet, suporte técnico e ambiente para atividades práticas.', horario: 'Seg–Sex, 8h às 18h', status: 'Abre às 8h', statusClasse: 'pending', aberto: false, acessivel: true, setor: 'Departamento de Computação', contato: 'laboratorio@campus.edu.br', icone: '💻', acessibilidade: ['Elevador próximo', 'Mesa adaptada', 'Rota sem degraus'] },
  { id: 'restaurante', nome: 'Restaurante Universitário', categoria: 'alimentacao', categoriaNome: 'Alimentação', bloco: 'central', localizacao: 'Prédio Central • Térreo', descricao: 'Refeições subsidiadas para estudantes e atendimento à comunidade acadêmica.', horario: 'Seg–Sex, 11h às 14h', status: 'Abre às 11h', statusClasse: 'pending', aberto: false, acessivel: true, setor: 'Assistência Estudantil', contato: 'ru@campus.edu.br', icone: '🍽️', acessibilidade: ['Entrada com rampa', 'Mesas acessíveis', 'Banheiro acessível'] },
  { id: 'biblioteca-tecnologia', nome: 'Biblioteca Setorial de Tecnologia', categoria: 'biblioteca', categoriaNome: 'Biblioteca', bloco: 'c', localizacao: 'Bloco C • 1º piso', descricao: 'Acervo especializado em computação, engenharias e inovação.', horario: 'Seg–Sex, 8h às 18h', status: 'Fechado', statusClasse: 'closed', aberto: false, acessivel: false, setor: 'Coordenação de Bibliotecas', contato: 'bibliotecatec@campus.edu.br', icone: '📖', acessibilidade: ['Acesso por escada', 'Atendimento no térreo sob solicitação'] },
  { id: 'atendimento', nome: 'Atendimento Bibliográfico', categoria: 'servico', categoriaNome: 'Serviço', bloco: 'a', localizacao: 'Biblioteca Central • Sala 4', descricao: 'Orientação para pesquisas, normas acadêmicas e bases de dados.', horario: 'Seg–Sex, 9h às 17h', status: 'Aberto agora', statusClasse: 'open', aberto: true, acessivel: true, setor: 'Biblioteca Central', contato: 'referencia@campus.edu.br', icone: '🔎', acessibilidade: ['Rota sem degraus', 'Atendimento prioritário'] }
];

let localAtual = 'biblioteca';
let googlePronto = false;

document.addEventListener('DOMContentLoaded', () => {
  iniciarRotas();
  iniciarMenuMovel();
  iniciarBusca();
  iniciarDetalhes();
  iniciarFavoritos();
  iniciarLogin();
  iniciarSugestoes();
  iniciarAdministracao();
  atualizarUsuario();
  renderizarResultados();
  aplicarRotaInicial();
});

function iniciarRotas() {
  document.addEventListener('click', event => {
    const botaoRota = event.target.closest('[data-route]');
    if (botaoRota) {
      event.preventDefault();
      navegar(botaoRota.dataset.route);
      return;
    }

    const botaoLocal = event.target.closest('[data-open-place]');
    if (botaoLocal) abrirDetalhes(botaoLocal.dataset.openPlace);
  });
  window.addEventListener('hashchange', aplicarRotaInicial);
  window.addEventListener('popstate', aplicarRotaInicial);
}

function aplicarRotaInicial() {
  const rota = location.hash.replace('#', '') || 'inicio';
  if (rota === 'login') {
    exibirView('inicio');
    abrirLogin();
    return;
  }
  exibirView(['inicio', 'buscar', 'detalhes', 'favoritos', 'admin'].includes(rota) ? rota : 'inicio');
}

function navegar(rota) {
  if (rota === 'login') {
    abrirLogin();
    return;
  }
  if (location.hash !== `#${rota}`) history.pushState(null, '', `#${rota}`);
  exibirView(rota);
}

function exibirView(rota) {
  document.querySelectorAll('[data-view]').forEach(view => {
    const ativa = view.dataset.view === rota;
    view.hidden = !ativa;
    view.classList.toggle('active', ativa);
  });
  const rotaMenu = rota === 'detalhes' ? 'buscar' : rota;
  document.querySelectorAll('.app-nav-link').forEach(link => link.classList.toggle('active', link.dataset.route === rotaMenu));
  document.querySelector('[data-main-nav]')?.classList.remove('open');
  const menu = document.querySelector('[data-menu-toggle]');
  menu?.setAttribute('aria-expanded', 'false');
  if (rota === 'favoritos') renderizarFavoritos();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function iniciarMenuMovel() {
  const botao = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  botao?.addEventListener('click', () => {
    const aberto = nav.classList.toggle('open');
    botao.setAttribute('aria-expanded', String(aberto));
  });
}

function iniciarBusca() {
  const buscaInicial = document.querySelector('[data-global-search]');
  const buscaResultados = document.querySelector('[data-search-form]');
  const campoInicial = document.querySelector('#busca-inicial');
  const campoResultados = document.querySelector('#busca-resultados');

  buscaInicial?.addEventListener('submit', event => {
    event.preventDefault();
    const termo = campoInicial.value.trim();
    if (termo.length < 2) return erroNoCampo(campoInicial, 'Digite pelo menos 2 caracteres.');
    campoResultados.value = termo;
    renderizarResultados();
    navegar('buscar');
  });

  buscaResultados?.addEventListener('submit', event => {
    event.preventDefault();
    if (campoResultados.value.trim() && campoResultados.value.trim().length < 2) return erroNoCampo(campoResultados, 'Digite pelo menos 2 caracteres.');
    renderizarResultados();
  });

  document.querySelectorAll('#filtro-categoria, #filtro-bloco, #filtro-aberto, #filtro-acessivel, #ordenacao').forEach(campo => campo.addEventListener('change', renderizarResultados));
  campoResultados?.addEventListener('input', renderizarResultados);

  document.querySelector('[data-clear-filters]')?.addEventListener('click', () => {
    campoResultados.value = '';
    document.querySelector('#filtro-categoria').value = '';
    document.querySelector('#filtro-bloco').value = '';
    document.querySelector('#filtro-aberto').checked = false;
    document.querySelector('#filtro-acessivel').checked = false;
    renderizarResultados();
  });

  document.querySelectorAll('[data-category-shortcut]').forEach(botao => botao.addEventListener('click', () => {
    document.querySelector('#filtro-categoria').value = botao.dataset.categoryShortcut;
    campoResultados.value = '';
    renderizarResultados();
    navegar('buscar');
  }));

  const alternarFiltros = document.querySelector('[data-filter-toggle]');
  alternarFiltros?.addEventListener('click', () => {
    const painel = document.querySelector('[data-filter-panel]');
    const aberto = painel.classList.toggle('open');
    alternarFiltros.setAttribute('aria-expanded', String(aberto));
    alternarFiltros.textContent = aberto ? '× Ocultar filtros' : '☰ Mostrar filtros';
  });
}

function renderizarResultados() {
  const lista = document.querySelector('[data-result-list]');
  if (!lista) return;
  const termo = normalizar(document.querySelector('#busca-resultados')?.value || '');
  const categoria = document.querySelector('#filtro-categoria')?.value || '';
  const bloco = document.querySelector('#filtro-bloco')?.value || '';
  const aberto = document.querySelector('#filtro-aberto')?.checked;
  const acessivel = document.querySelector('#filtro-acessivel')?.checked;
  const ordenacao = document.querySelector('#ordenacao')?.value;

  let resultados = locais.filter(local => {
    const correspondeTermo = !termo || normalizar(`${local.nome} ${local.descricao} ${local.localizacao} ${local.categoriaNome}`).includes(termo);
    return correspondeTermo && (!categoria || local.categoria === categoria) && (!bloco || local.bloco === bloco) && (!aberto || local.aberto) && (!acessivel || local.acessivel);
  });
  if (ordenacao === 'az') resultados = [...resultados].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  document.querySelector('[data-result-count]').textContent = `${resultados.length} ${resultados.length === 1 ? 'local encontrado' : 'locais encontrados'}`;
  if (!resultados.length) {
    lista.innerHTML = '<div class="empty-results"><strong>Nenhum resultado encontrado</strong><span>Tente alterar a busca ou limpar os filtros.</span></div>';
    return;
  }

  lista.innerHTML = resultados.map(local => `<article class="app-result-card"><span class="app-result-icon">${local.icone}</span><div><div class="app-result-title"><h3>${local.nome}</h3><span class="status ${local.statusClasse}">${local.status}</span></div><p>${local.descricao}</p><div class="app-place-meta"><span>${local.localizacao}</span><span>${local.horario}</span>${local.acessivel ? '<span class="chip">Rota acessível</span>' : ''}</div></div><button class="btn btn-soft" type="button" data-open-place="${local.id}">Ver detalhes</button></article>`).join('');
}

function abrirDetalhes(id) {
  if (!locais.some(local => local.id === id)) return;
  localAtual = id;
  preencherDetalhes();
  navegar('detalhes');
}

function iniciarDetalhes() {
  document.querySelector('[data-favorite-toggle]')?.addEventListener('click', () => alternarFavorito(localAtual));
  document.querySelector('[data-scroll-map]')?.addEventListener('click', () => document.querySelector('#mapa')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  preencherDetalhes();
}

function preencherDetalhes() {
  const local = locais.find(item => item.id === localAtual) || locais[0];
  definirTexto('[data-detail-name]', local.nome);
  definirTexto('[data-detail-description]', local.descricao);
  definirTexto('[data-detail-location]', local.localizacao);
  definirTexto('[data-info-location]', local.localizacao);
  definirTexto('[data-info-sector]', local.setor);
  definirTexto('[data-info-contact]', local.contato);
  definirTexto('[data-info-hours]', local.horario);
  definirTexto('[data-detail-hours]', `Atendimento regular: ${local.horario}. Consulte avisos de indisponibilidade antes de se deslocar.`);
  definirTexto('[data-map-label]', local.nome);
  const status = document.querySelector('[data-detail-status]');
  if (status) { status.textContent = local.status; status.className = `status ${local.statusClasse}`; }
  const acessibilidade = document.querySelector('[data-access-list]');
  if (acessibilidade) acessibilidade.innerHTML = local.acessibilidade.map(item => `<span class="access-item">✓ ${item}</span>`).join('');
  atualizarBotaoFavorito();
}

function obterFavoritos() {
  try {
    const dados = JSON.parse(localStorage.getItem('campusFacilFavoritos'));
    return Array.isArray(dados) ? dados : ['biblioteca', 'secretaria'];
  } catch { return ['biblioteca', 'secretaria']; }
}

function salvarFavoritos(ids) {
  localStorage.setItem('campusFacilFavoritos', JSON.stringify(ids));
}

function alternarFavorito(id) {
  const favoritos = obterFavoritos();
  const existe = favoritos.includes(id);
  const atualizados = existe ? favoritos.filter(item => item !== id) : [...favoritos, id];
  salvarFavoritos(atualizados);
  atualizarBotaoFavorito();
  renderizarFavoritos();
  mostrarMensagem(existe ? 'Local removido dos favoritos.' : 'Local adicionado aos favoritos.', existe ? 'info' : 'sucesso');
}

function atualizarBotaoFavorito() {
  const botao = document.querySelector('[data-favorite-toggle]');
  if (!botao) return;
  const ativo = obterFavoritos().includes(localAtual);
  botao.textContent = ativo ? '♥ Favoritado' : '♡ Favoritar';
  botao.classList.toggle('favorite-active', ativo);
}

function iniciarFavoritos() {
  document.querySelector('[data-favorite-list]')?.addEventListener('click', event => {
    const remover = event.target.closest('[data-remove-favorite]');
    if (remover) alternarFavorito(remover.dataset.removeFavorite);
  });
  renderizarFavoritos();
}

function renderizarFavoritos() {
  const lista = document.querySelector('[data-favorite-list]');
  if (!lista) return;
  const ids = obterFavoritos();
  const favoritos = ids.map(id => locais.find(local => local.id === id)).filter(Boolean);
  definirTexto('[data-favorite-count]', `${favoritos.length} ${favoritos.length === 1 ? 'salvo' : 'salvos'}`);
  definirTexto('[data-profile-favorites]', favoritos.length);
  if (!favoritos.length) {
    lista.innerHTML = '<div class="empty-results"><strong>Nenhum favorito ainda</strong><span>Explore os locais e use o botão Favoritar.</span></div>';
    return;
  }
  lista.innerHTML = favoritos.map(local => `<article class="favorite-row"><span class="place-icon">${local.icone}</span><div><h3>${local.nome}</h3><p>${local.localizacao} • ${local.status}</p></div><div class="app-favorite-actions"><button class="btn btn-soft" type="button" data-open-place="${local.id}">Ver detalhes</button><button class="icon-button" type="button" data-remove-favorite="${local.id}" aria-label="Remover ${local.nome}">×</button></div></article>`).join('');
}

function iniciarLogin() {
  document.querySelector('[data-login-open]')?.addEventListener('click', abrirLogin);
  document.querySelector('[data-modal-close]')?.addEventListener('click', fecharLogin);
  document.querySelector('[data-login-modal]')?.addEventListener('click', event => { if (event.target === event.currentTarget) fecharLogin(); });
  document.querySelector('[data-login-modal]')?.addEventListener('click', event => { if (event.target.closest('[data-login-continue]')) fecharLogin(); });
  document.querySelector('[data-login-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#login-email');
    const senha = document.querySelector('#login-senha');
    limparErros(event.currentTarget);
    let valido = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { adicionarErro(email, 'Informe um e-mail válido.'); valido = false; }
    if (senha.value.length < 6) { adicionarErro(senha, 'A senha deve ter pelo menos 6 caracteres.'); valido = false; }
    if (!valido) return mostrarMensagem('Revise os campos destacados.', 'erro');
    const nome = email.value.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, letra => letra.toUpperCase());
    salvarUsuario({ nome, email: email.value.trim(), emissor: 'Login acadêmico' });
    fecharLogin();
    navegar('favoritos');
    mostrarMensagem('Login realizado com sucesso.');
  });
  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    localStorage.removeItem('campusFacilPerfil');
    atualizarUsuario();
    navegar('inicio');
    mostrarMensagem('Você saiu da sua conta.', 'info');
  });
}

function abrirLogin() {
  const modal = document.querySelector('[data-login-modal]');
  modal.hidden = false;
  document.body.classList.add('modal-open');
  setTimeout(renderizarBotaoGoogle, 60);
  modal.querySelector('input')?.focus();
}

function fecharLogin() {
  document.querySelector('[data-login-modal]').hidden = true;
  document.body.classList.remove('modal-open');
  if (location.hash === '#login') history.replaceState(null, '', '#inicio');
}

window.inicializarGoogleSignIn = function inicializarGoogleSignIn() {
  if (!window.google?.accounts?.id) return;
  google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: window.handleGoogleCredential, ux_mode: 'popup' });
  googlePronto = true;
  if (!document.querySelector('[data-login-modal]')?.hidden) renderizarBotaoGoogle();
};

function renderizarBotaoGoogle() {
  const container = document.querySelector('#google-signin-button');
  if (!googlePronto || !container) return;
  container.replaceChildren();
  const largura = Math.max(240, Math.min(360, container.clientWidth || 360));
  google.accounts.id.renderButton(container, { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', logo_alignment: 'left', width: largura, locale: 'pt-BR' });
}

window.handleGoogleCredential = function handleGoogleCredential(response) {
  if (!response?.credential) return mostrarMensagem('O Google não retornou o token.', 'erro');
  try {
    const payload = decodificarPayloadJwt(response.credential);
    const emissorValido = ['https://accounts.google.com', 'accounts.google.com'].includes(payload.iss);
    if (!emissorValido || payload.aud !== GOOGLE_CLIENT_ID || Number(payload.exp) * 1000 <= Date.now()) throw new Error('Token incompatível com este aplicativo.');

    console.group('Campus Fácil — autenticação federada Google');
    console.log('GOOGLE_ID_TOKEN_JWT:', response.credential);
    console.log('Payload decodificado:', payload);
    console.table({ emissor: payload.iss, audiencia: payload.aud, email: payload.email, expiracao: new Date(Number(payload.exp) * 1000).toLocaleString('pt-BR') });
    console.groupEnd();

    salvarUsuario({ nome: payload.name || 'Usuário Google', email: payload.email || '', emissor: payload.iss });
    const resultado = document.querySelector('#google-login-result');
    resultado.hidden = false;
    resultado.innerHTML = `<strong>Login com Google realizado!</strong><span>${escaparHtml(payload.name || payload.email)}</span><small>O JWT foi exibido no Console do navegador.</small><button class="btn btn-primary btn-block" type="button" data-login-continue>Continuar no aplicativo</button>`;
    mostrarMensagem('Conta Google autenticada com sucesso.');
  } catch (erro) {
    console.error('Falha ao processar o token do Google:', erro);
    mostrarMensagem('Não foi possível validar o login Google.', 'erro');
  }
};

function decodificarPayloadJwt(token) {
  const parte = token.split('.')[1];
  if (!parte) throw new Error('Token JWT inválido.');
  const base64 = parte.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parte.length / 4) * 4, '=');
  const bytes = Uint8Array.from(atob(base64), caractere => caractere.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function salvarUsuario(perfil) {
  localStorage.setItem('campusFacilPerfil', JSON.stringify(perfil));
  atualizarUsuario();
}

function obterUsuario() {
  try { return JSON.parse(localStorage.getItem('campusFacilPerfil')); } catch { return null; }
}

function atualizarUsuario() {
  const perfil = obterUsuario();
  const entrar = document.querySelector('[data-login-open]');
  const avatar = document.querySelector('.app-user-avatar');
  entrar.hidden = Boolean(perfil);
  avatar.hidden = !perfil;
  if (!perfil) return;
  const iniciais = obterIniciais(perfil.nome);
  avatar.textContent = iniciais;
  definirTexto('[data-profile-initials]', iniciais);
  definirTexto('[data-profile-name]', perfil.nome);
  definirTexto('[data-profile-email]', perfil.email || 'Conta autenticada');
}

function iniciarSugestoes() {
  const modal = document.querySelector('[data-suggestion-modal]');
  document.querySelector('[data-suggestion-open]')?.addEventListener('click', () => { modal.hidden = false; document.body.classList.add('modal-open'); });
  document.querySelector('[data-suggestion-close]')?.addEventListener('click', fecharSugestao);
  modal?.addEventListener('click', event => { if (event.target === modal) fecharSugestao(); });
  document.querySelector('[data-suggestion-form]')?.addEventListener('submit', event => {
    event.preventDefault();
    const tipo = document.querySelector('#tipo-correcao');
    const descricao = document.querySelector('#descricao-correcao');
    limparErros(event.currentTarget);
    let valido = true;
    if (!tipo.value) { adicionarErro(tipo, 'Selecione o tipo da correção.'); valido = false; }
    if (descricao.value.trim().length < 10) { adicionarErro(descricao, 'Escreva pelo menos 10 caracteres.'); valido = false; }
    if (!valido) return;
    event.currentTarget.reset();
    fecharSugestao();
    mostrarMensagem('Sugestão enviada para análise.');
  });
}

function fecharSugestao() {
  document.querySelector('[data-suggestion-modal]').hidden = true;
  document.body.classList.remove('modal-open');
}

function iniciarAdministracao() {
  const tabela = document.querySelector('[data-admin-table]');
  document.querySelector('[data-admin-search]')?.addEventListener('input', event => {
    const termo = normalizar(event.target.value);
    tabela.querySelectorAll('tbody tr').forEach(linha => { linha.hidden = !normalizar(linha.textContent).includes(termo); });
  });
  tabela?.addEventListener('click', event => {
    if (event.target.closest('[data-admin-edit]')) mostrarMensagem('Modo de edição aberto para demonstração.', 'info');
    const alternar = event.target.closest('[data-admin-toggle]');
    if (alternar) {
      const status = alternar.closest('tr').querySelector('.status');
      const ativo = status.textContent.trim() === 'Ativo';
      status.textContent = ativo ? 'Inativo' : 'Ativo';
      status.className = `status ${ativo ? 'closed' : 'open'}`;
      mostrarMensagem(ativo ? 'Local desativado.' : 'Local ativado.', 'info');
    }
  });
  document.querySelector('[data-add-local]')?.addEventListener('click', () => {
    const nome = window.prompt('Nome do novo local:');
    if (!nome?.trim()) return;
    const linha = document.createElement('tr');
    linha.innerHTML = `<td><strong>${escaparHtml(nome.trim())}</strong><small>Adicionado agora</small></td><td>Local</td><td>A definir</td><td>Administrador</td><td><span class="status open">Ativo</span></td><td><button class="table-btn" type="button" data-admin-edit>✎</button><button class="table-btn danger" type="button" data-admin-toggle>⊘</button></td>`;
    tabela.querySelector('tbody').prepend(linha);
    mostrarMensagem('Local adicionado ao protótipo.');
  });
}

function mostrarMensagem(texto, tipo = 'sucesso') {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.setAttribute('role', 'status');
  toast.textContent = texto;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => { toast.classList.remove('toast-visible'); setTimeout(() => toast.remove(), 250); }, 3200);
}

function erroNoCampo(campo, mensagem) {
  campo.classList.add('input-error');
  campo.focus();
  mostrarMensagem(mensagem, 'erro');
}

function adicionarErro(campo, mensagem) {
  campo.classList.add('input-error');
  campo.setAttribute('aria-invalid', 'true');
  const erro = document.createElement('small');
  erro.className = 'field-error';
  erro.textContent = mensagem;
  campo.insertAdjacentElement('afterend', erro);
}

function limparErros(formulario) {
  formulario.querySelectorAll('.field-error').forEach(item => item.remove());
  formulario.querySelectorAll('.input-error').forEach(item => { item.classList.remove('input-error'); item.removeAttribute('aria-invalid'); });
}

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function definirTexto(seletor, texto) {
  const elemento = document.querySelector(seletor);
  if (elemento) elemento.textContent = texto;
}

function obterIniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return `${partes[0]?.[0] || 'U'}${partes.length > 1 ? partes.at(-1)[0] : ''}`.toUpperCase();
}

function escaparHtml(valor) {
  const elemento = document.createElement('span');
  elemento.textContent = String(valor ?? '');
  return elemento.innerHTML;
}
