/* Campus Fácil — comportamento das telas
   Projeto acadêmico: JavaScript puro, sem backend. */

document.addEventListener('DOMContentLoaded', () => {
  iniciarNavegacao();
  iniciarBuscaInicial();
  iniciarResultados();
  iniciarLogin();
  iniciarDetalhes();
  iniciarPerfil();
  iniciarAdministracao();
});

function mostrarMensagem(texto, tipo = 'sucesso') {
  const anterior = document.querySelector('.toast');
  if (anterior) anterior.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.setAttribute('role', 'status');
  toast.textContent = texto;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-visible'));
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function iniciarNavegacao() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      mostrarMensagem('Esta opção é apenas demonstrativa neste protótipo.', 'info');
    });
  });
}

function iniciarBuscaInicial() {
  const formulario = document.querySelector('.search-box');
  if (!formulario) return;

  const campo = formulario.querySelector('input');
  formulario.addEventListener('submit', event => {
    event.preventDefault();
    const termo = campo.value.trim();

    if (termo.length < 2) {
      campo.classList.add('input-error');
      campo.focus();
      mostrarMensagem('Digite pelo menos 2 caracteres para pesquisar.', 'erro');
      return;
    }

    window.location.href = `resultados.html?q=${encodeURIComponent(termo)}`;
  });

  campo.addEventListener('input', () => campo.classList.remove('input-error'));
}

function iniciarResultados() {
  const formulario = document.querySelector('.compact-search');
  const lista = document.querySelector('.result-list');
  if (!formulario || !lista) return;

  const campo = formulario.querySelector('input');
  const titulo = document.querySelector('.page-title-row h1');
  const contador = document.querySelector('.result-toolbar strong');
  const parametros = new URLSearchParams(window.location.search);
  const termoRecebido = parametros.get('q');

  if (termoRecebido) campo.value = termoRecebido;

  const normalizar = texto => texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  function filtrarResultados() {
    const termo = normalizar(campo.value.trim());
    const categorias = [...document.querySelectorAll('[data-filter="categoria"]:checked')].map(item => item.value);
    const blocos = [...document.querySelectorAll('[data-filter="bloco"]:checked')].map(item => item.value);
    const atendimentos = [...document.querySelectorAll('[data-filter="atendimento"]:checked')].map(item => item.value);
    let visiveis = 0;

    lista.querySelectorAll('.result-card').forEach(card => {
      const texto = normalizar(card.textContent);
      const categoriaOk = categorias.length === 0 || categorias.includes(card.dataset.categoria);
      const blocoOk = blocos.length === 0 || blocos.includes(card.dataset.bloco);
      const atendimentoOk = atendimentos.length === 0 || atendimentos.every(valor => card.dataset[valor] === 'true');
      const termoOk = termo.length === 0 || texto.includes(termo);
      const exibir = categoriaOk && blocoOk && atendimentoOk && termoOk;

      card.hidden = !exibir;
      if (exibir) visiveis += 1;
    });

    titulo.textContent = termo ? `Resultados para “${campo.value.trim()}”` : 'Todos os locais e serviços';
    contador.textContent = `${visiveis} resultado${visiveis === 1 ? '' : 's'}`;

    let vazio = lista.querySelector('.empty-results');
    if (visiveis === 0 && !vazio) {
      vazio = document.createElement('div');
      vazio.className = 'empty-results';
      vazio.innerHTML = '<strong>Nenhum resultado encontrado</strong><span>Tente alterar o termo ou limpar os filtros.</span>';
      lista.appendChild(vazio);
    } else if (visiveis > 0 && vazio) {
      vazio.remove();
    }
  }

  formulario.addEventListener('submit', event => {
    event.preventDefault();
    if (campo.value.trim().length < 2) {
      campo.classList.add('input-error');
      mostrarMensagem('Digite pelo menos 2 caracteres para pesquisar.', 'erro');
      campo.focus();
      return;
    }
    campo.classList.remove('input-error');
    history.replaceState(null, '', `?q=${encodeURIComponent(campo.value.trim())}`);
    filtrarResultados();
  });

  document.querySelectorAll('.filter-panel input').forEach(input => input.addEventListener('change', filtrarResultados));

  const limpar = document.querySelector('.filter-title a');
  limpar?.addEventListener('click', event => {
    event.preventDefault();
    document.querySelectorAll('.filter-panel input').forEach(input => { input.checked = false; });
    campo.value = '';
    history.replaceState(null, '', 'resultados.html');
    filtrarResultados();
    mostrarMensagem('Filtros removidos.', 'info');
  });

  filtrarResultados();
}

function iniciarLogin() {
  const formulario = document.querySelector('[data-login-form]');
  if (!formulario) return;

  const email = formulario.querySelector('#email');
  const senha = formulario.querySelector('#senha');

  formulario.addEventListener('submit', event => {
    event.preventDefault();
    limparErros(formulario);
    let valido = true;

    if (!email.value.trim()) {
      adicionarErro(email, 'Informe seu e-mail.');
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      adicionarErro(email, 'Digite um e-mail válido.');
      valido = false;
    }

    if (!senha.value) {
      adicionarErro(senha, 'Informe sua senha.');
      valido = false;
    } else if (senha.value.length < 6) {
      adicionarErro(senha, 'A senha deve ter pelo menos 6 caracteres.');
      valido = false;
    }

    if (!valido) {
      formulario.querySelector('.input-error')?.focus();
      mostrarMensagem('Revise os campos destacados.', 'erro');
      return;
    }

    localStorage.setItem('campusFacilUsuario', email.value.trim());
    mostrarMensagem('Login validado! Redirecionando para o perfil.');
    setTimeout(() => { window.location.href = 'perfil.html'; }, 800);
  });

  formulario.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => removerErro(input));
  });
}

function adicionarErro(campo, mensagem) {
  campo.classList.add('input-error');
  campo.setAttribute('aria-invalid', 'true');
  const erro = document.createElement('small');
  erro.className = 'field-error';
  erro.textContent = mensagem;
  campo.insertAdjacentElement('afterend', erro);
}

function removerErro(campo) {
  campo.classList.remove('input-error');
  campo.removeAttribute('aria-invalid');
  const erro = campo.parentElement.querySelector('.field-error');
  if (erro) erro.remove();
}

function limparErros(formulario) {
  formulario.querySelectorAll('.field-error').forEach(erro => erro.remove());
  formulario.querySelectorAll('.input-error').forEach(campo => {
    campo.classList.remove('input-error');
    campo.removeAttribute('aria-invalid');
  });
}

function iniciarDetalhes() {
  const favoritar = document.querySelector('[data-favoritar]');
  const sugerir = document.querySelector('[data-sugerir]');
  if (!favoritar && !sugerir) return;

  const chave = 'campusFacilBibliotecaFavorita';
  const atualizarFavorito = () => {
    const ativo = localStorage.getItem(chave) === 'true';
    favoritar?.classList.toggle('favorite-active', ativo);
    if (favoritar) favoritar.lastChild.textContent = ativo ? ' Favoritado' : ' Favoritar';
  };

  favoritar?.addEventListener('click', event => {
    event.preventDefault();
    const novoEstado = localStorage.getItem(chave) !== 'true';
    localStorage.setItem(chave, String(novoEstado));
    atualizarFavorito();
    mostrarMensagem(novoEstado ? 'Biblioteca adicionada aos favoritos.' : 'Biblioteca removida dos favoritos.');
  });

  sugerir?.addEventListener('click', () => abrirModalSugestao());
  atualizarFavorito();
}

function abrirModalSugestao() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="titulo-sugestao">
      <button class="modal-close" type="button" aria-label="Fechar">×</button>
      <span class="eyebrow">Colabore com o campus</span>
      <h2 id="titulo-sugestao">Sugerir uma correção</h2>
      <p>Explique qual informação da Biblioteca Central precisa ser atualizada.</p>
      <form data-suggestion-form novalidate>
        <div class="form-group"><label for="tipo-correcao">Tipo da correção</label><select class="form-control" id="tipo-correcao" required><option value="">Selecione</option><option>Localização</option><option>Horário</option><option>Contato</option><option>Acessibilidade</option><option>Outra informação</option></select></div>
        <div class="form-group"><label for="descricao-correcao">Descrição</label><textarea class="form-control" id="descricao-correcao" placeholder="Descreva a correção..." required></textarea></div>
        <div class="modal-actions"><button class="btn btn-secondary modal-cancel" type="button">Cancelar</button><button class="btn btn-primary" type="submit">Enviar sugestão</button></div>
      </form>
    </section>`;
  document.body.appendChild(modal);
  modal.querySelector('select').focus();

  const fechar = () => modal.remove();
  modal.querySelector('.modal-close').addEventListener('click', fechar);
  modal.querySelector('.modal-cancel').addEventListener('click', fechar);
  modal.addEventListener('click', event => { if (event.target === modal) fechar(); });

  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const tipo = modal.querySelector('select');
    const descricao = modal.querySelector('textarea');
    limparErros(event.currentTarget);
    let valido = true;
    if (!tipo.value) { adicionarErro(tipo, 'Selecione o tipo da correção.'); valido = false; }
    if (descricao.value.trim().length < 10) { adicionarErro(descricao, 'Descreva a correção com pelo menos 10 caracteres.'); valido = false; }
    if (!valido) return;
    fechar();
    mostrarMensagem('Sugestão enviada para análise.');
  });
}

function iniciarPerfil() {
  const lista = document.querySelector('.favorite-list');
  if (!lista) return;

  const contador = document.querySelector('.profile-stats .stat-box strong');
  const atualizarContador = () => {
    const total = lista.querySelectorAll('.favorite-row').length;
    if (contador) contador.textContent = total;
    const etiqueta = document.querySelector('.section-heading .status');
    if (etiqueta) etiqueta.textContent = `${total} salvo${total === 1 ? '' : 's'}`;
  };

  lista.querySelectorAll('.favorite-row .icon-button').forEach(botao => {
    botao.addEventListener('click', () => {
      const item = botao.closest('.favorite-row');
      const nome = item.querySelector('h3').textContent;
      if (!window.confirm(`Remover “${nome}” dos favoritos?`)) return;
      item.remove();
      atualizarContador();
      mostrarMensagem('Local removido dos favoritos.', 'info');
    });
  });

  document.querySelectorAll('.tabs .tab').forEach((tab, indice) => {
    tab.addEventListener('click', event => {
      event.preventDefault();
      document.querySelectorAll('.tabs .tab').forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      if (indice > 0) mostrarMensagem('Seção selecionada para demonstração.', 'info');
    });
  });

  atualizarContador();
}

function iniciarAdministracao() {
  const tabela = document.querySelector('.data-table');
  if (!tabela) return;

  const campoBusca = document.querySelector('.admin-card-head input');
  campoBusca?.addEventListener('input', () => {
    const termo = campoBusca.value.trim().toLowerCase();
    tabela.querySelectorAll('tbody tr').forEach(linha => {
      linha.hidden = !linha.textContent.toLowerCase().includes(termo);
    });
  });

  document.querySelectorAll('.admin-link').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelectorAll('.admin-link').forEach(item => item.classList.remove('active'));
      link.classList.add('active');
      mostrarMensagem(`${link.textContent.trim()}: seção selecionada.`, 'info');
    });
  });

  const adicionar = document.querySelector('[data-add-local]');
  adicionar?.addEventListener('click', abrirModalLocal);

  tabela.querySelectorAll('.table-btn:not(.danger)').forEach(botao => {
    botao.addEventListener('click', () => mostrarMensagem('Registro aberto para edição.', 'info'));
  });

  tabela.querySelectorAll('.table-btn.danger').forEach(botao => {
    botao.addEventListener('click', () => {
      const linha = botao.closest('tr');
      const nome = linha.querySelector('strong').textContent;
      const status = linha.querySelector('.status');
      if (!window.confirm(`Alterar o status de “${nome}”?`)) return;
      const inativo = status.classList.contains('closed');
      status.className = `status ${inativo ? 'open' : 'closed'}`;
      status.textContent = inativo ? 'Ativo' : 'Inativo';
      mostrarMensagem(`Status de “${nome}” atualizado.`);
    });
  });
}

function abrirModalLocal() {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="titulo-local">
      <button class="modal-close" type="button" aria-label="Fechar">×</button>
      <span class="eyebrow">Cadastro administrativo</span>
      <h2 id="titulo-local">Adicionar novo local</h2>
      <form data-local-form novalidate>
        <div class="form-group"><label for="local-nome">Nome do local</label><input class="form-control" id="local-nome" placeholder="Ex.: Sala de reuniões"></div>
        <div class="form-group"><label for="local-categoria">Categoria</label><select class="form-control" id="local-categoria"><option value="">Selecione</option><option>Administrativo</option><option>Biblioteca</option><option>Laboratório</option><option>Serviço</option></select></div>
        <div class="form-group"><label for="local-endereco">Localização interna</label><input class="form-control" id="local-endereco" placeholder="Ex.: Bloco B • Sala 105"></div>
        <div class="modal-actions"><button class="btn btn-secondary modal-cancel" type="button">Cancelar</button><button class="btn btn-primary" type="submit">Cadastrar local</button></div>
      </form>
    </section>`;
  document.body.appendChild(modal);
  modal.querySelector('input').focus();

  const fechar = () => modal.remove();
  modal.querySelector('.modal-close').addEventListener('click', fechar);
  modal.querySelector('.modal-cancel').addEventListener('click', fechar);

  modal.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const campos = [...event.currentTarget.querySelectorAll('.form-control')];
    limparErros(event.currentTarget);
    let valido = true;
    campos.forEach(campo => {
      if (!campo.value.trim()) { adicionarErro(campo, 'Este campo é obrigatório.'); valido = false; }
    });
    if (!valido) return;
    fechar();
    mostrarMensagem('Local cadastrado no protótipo com sucesso.');
  });
}
