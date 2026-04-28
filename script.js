let clientes = JSON.parse(localStorage.getItem('mp_clientes') || '[]');
let funcionarios = JSON.parse(localStorage.getItem('mp_funcionarios') || '[]');
let servicos = JSON.parse(localStorage.getItem('mp_servicos') || '[]');

let editIndex = -1;
let currentSection = 'dashboard';

const pageTitles = {
  'dashboard': 'Dashboard',
  'cadastro-cliente': 'Cadastrar Cliente',
  'lista-clientes': 'Lista de Clientes',
  'cadastro-funcionario': 'Cadastrar Funcionário',
  'lista-funcionarios': 'Lista de Funcionários',
  'novo-servico': 'Novo Serviço',
  'lista-servicos': 'Lista de Serviços',
};

function navigate(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('section-' + section).classList.add('active');
  document.getElementById('page-title').textContent = pageTitles[section] || section;

  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + section + "'")) {
      n.classList.add('active');
    }
  });

  currentSection = section;

  if (section === 'lista-clientes') renderClientes();
  if (section === 'lista-funcionarios') renderFuncionarios();
  if (section === 'lista-servicos') renderServicos();
  if (section === 'dashboard') renderDashboard();
  if (section === 'novo-servico') atualizarDatalistClientes();
}

function save() {
  localStorage.setItem('mp_clientes', JSON.stringify(clientes));
  localStorage.setItem('mp_funcionarios', JSON.stringify(funcionarios));
  localStorage.setItem('mp_servicos', JSON.stringify(servicos));
}

function notify(msg, error = false) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.className = 'notification' + (error ? ' error' : '') + ' show';
  setTimeout(() => n.classList.remove('show'), 3200);
}

function salvarCliente() {
  const nome = document.getElementById('cli-nome').value.trim();
  const cpfcnpj = document.getElementById('cli-cpfcnpj').value.trim();
  const email = document.getElementById('cli-email').value.trim();
  const celular = document.getElementById('cli-celular').value.trim();
  const cidade = document.getElementById('cli-cidade').value.trim();

  if (!nome || !cpfcnpj || !celular || !cidade) {
    notify('Preencha todos os campos obrigatórios (*).', true);
    return;
  }

  clientes.push({
    nome,
    cpfcnpj,
    email,
    celular,
    cidade,
    dataCad: new Date().toLocaleDateString('pt-BR')
  });

  save();
  limparForm('cliente');
  notify('Cliente cadastrado com sucesso!');
  renderDashboard();
}

function renderClientes(dados = clientes) {
  const tbody = document.getElementById('tbody-clientes');

  if (!dados.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhum cliente cadastrado ainda.</td></tr>';
    return;
  }

  tbody.innerHTML = dados.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${c.nome}</strong></td>
      <td>${c.cpfcnpj}</td>
      <td>${c.email || '—'}</td>
      <td>${c.celular}</td>
      <td>${c.cidade}</td>
      <td>
        <div class="actions">
          <button class="btn btn-ghost btn-sm" onclick="editarCliente(${clientes.indexOf(c)})">
            <i class="bi bi-pencil-square"></i>
            Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirCliente(${clientes.indexOf(c)})">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editarCliente(i) {
  editIndex = i;
  const c = clientes[i];

  document.getElementById('edit-cli-nome').value = c.nome;
  document.getElementById('edit-cli-cpfcnpj').value = c.cpfcnpj;
  document.getElementById('edit-cli-email').value = c.email;
  document.getElementById('edit-cli-celular').value = c.celular;
  document.getElementById('edit-cli-cidade').value = c.cidade;

  openModal('modal-cliente');
}

function salvarEdicaoCliente() {
  clientes[editIndex] = {
    nome: document.getElementById('edit-cli-nome').value.trim(),
    cpfcnpj: document.getElementById('edit-cli-cpfcnpj').value.trim(),
    email: document.getElementById('edit-cli-email').value.trim(),
    celular: document.getElementById('edit-cli-celular').value.trim(),
    cidade: document.getElementById('edit-cli-cidade').value.trim(),
    dataCad: clientes[editIndex].dataCad
  };

  save();
  closeModal('modal-cliente');
  renderClientes();
  notify('Cliente atualizado!');
}

function excluirCliente(i) {
  if (confirm('Excluir este cliente?')) {
    clientes.splice(i, 1);
    save();
    renderClientes();
    renderDashboard();
    notify('Cliente excluído.');
  }
}

function salvarFuncionario() {
  const nome = document.getElementById('func-nome').value.trim();
  const cpf = document.getElementById('func-cpf').value.trim();
  const cargo = document.getElementById('func-cargo').value.trim();
  const salario = document.getElementById('func-salario').value.trim();
  const telefone = document.getElementById('func-telefone').value.trim();

  if (!nome || !cpf || !cargo || !salario || !telefone) {
    notify('Preencha todos os campos obrigatórios (*).', true);
    return;
  }

  funcionarios.push({
    nome,
    cpf,
    cargo,
    salario,
    telefone,
    dataCad: new Date().toLocaleDateString('pt-BR')
  });

  save();
  limparForm('funcionario');
  notify('Funcionário cadastrado com sucesso!');
  renderDashboard();
}

function renderFuncionarios(dados = funcionarios) {
  const tbody = document.getElementById('tbody-funcionarios');

  if (!dados.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhum funcionário cadastrado ainda.</td></tr>';
    return;
  }

  tbody.innerHTML = dados.map((f, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${f.nome}</strong></td>
      <td>${f.cpf}</td>
      <td>${f.cargo}</td>
      <td>R$ ${f.salario}</td>
      <td>${f.telefone}</td>
      <td>
        <div class="actions">
          <button class="btn btn-ghost btn-sm" onclick="editarFuncionario(${funcionarios.indexOf(f)})">
            <i class="bi bi-pencil-square"></i>
            Editar
          </button>
          <button class="btn btn-danger btn-sm" onclick="excluirFuncionario(${funcionarios.indexOf(f)})">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editarFuncionario(i) {
  editIndex = i;
  const f = funcionarios[i];

  document.getElementById('edit-func-nome').value = f.nome;
  document.getElementById('edit-func-cpf').value = f.cpf;
  document.getElementById('edit-func-cargo').value = f.cargo;
  document.getElementById('edit-func-salario').value = f.salario;
  document.getElementById('edit-func-telefone').value = f.telefone;

  openModal('modal-funcionario');
}

function salvarEdicaoFuncionario() {
  funcionarios[editIndex] = {
    nome: document.getElementById('edit-func-nome').value.trim(),
    cpf: document.getElementById('edit-func-cpf').value.trim(),
    cargo: document.getElementById('edit-func-cargo').value.trim(),
    salario: document.getElementById('edit-func-salario').value.trim(),
    telefone: document.getElementById('edit-func-telefone').value.trim(),
    dataCad: funcionarios[editIndex].dataCad
  };

  save();
  closeModal('modal-funcionario');
  renderFuncionarios();
  notify('Funcionário atualizado!');
}

function excluirFuncionario(i) {
  if (confirm('Excluir este funcionário?')) {
    funcionarios.splice(i, 1);
    save();
    renderFuncionarios();
    renderDashboard();
    notify('Funcionário excluído.');
  }
}

function atualizarDatalistClientes() {
  const dl = document.getElementById('lista-clientes-datalist');
  dl.innerHTML = clientes.map(c => `<option value="${c.nome}">`).join('');
}

function salvarServico() {
  const numero = document.getElementById('srv-numero').value.trim();
  const cliente = document.getElementById('srv-cliente').value.trim();
  const descricao = document.getElementById('srv-descricao').value.trim();
  const valor = document.getElementById('srv-valor').value.trim();
  const status = document.getElementById('srv-status').value;
  const prazo = document.getElementById('srv-prazo').value;

  if (!numero || !cliente || !descricao || !valor || !prazo) {
    notify('Preencha todos os campos obrigatórios (*).', true);
    return;
  }

  servicos.push({
    numero,
    cliente,
    descricao,
    valor,
    status,
    prazo,
    dataCad: new Date().toLocaleDateString('pt-BR')
  });

  save();
  limparForm('servico');
  notify('Serviço registrado com sucesso!');
  renderDashboard();
}

function renderServicos(dados = servicos) {
  const tbody = document.getElementById('tbody-servicos');

  if (!dados.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Nenhum serviço registrado ainda.</td></tr>';
    return;
  }

  const statusLabel = {
    andamento: 'Em Andamento',
    concluida: 'Concluída',
    cancelada: 'Cancelada'
  };

  tbody.innerHTML = dados.map((s) => {
    const prazoFmt = s.prazo ? new Date(s.prazo + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
    const desc = s.descricao.length > 40 ? s.descricao.substring(0, 40) + '...' : s.descricao;

    return `
      <tr>
        <td><strong>${s.numero}</strong></td>
        <td>${s.cliente}</td>
        <td title="${s.descricao}">${desc}</td>
        <td>R$ ${s.valor}</td>
        <td><span class="status ${s.status}">${statusLabel[s.status]}</span></td>
        <td>${prazoFmt}</td>
        <td>
          <div class="actions">
            <button class="btn btn-ghost btn-sm" onclick="editarServico(${servicos.indexOf(s)})">
              <i class="bi bi-pencil-square"></i>
              Editar
            </button>
            <button class="btn btn-danger btn-sm" onclick="excluirServico(${servicos.indexOf(s)})">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function editarServico(i) {
  editIndex = i;
  const s = servicos[i];

  document.getElementById('edit-srv-numero').value = s.numero;
  document.getElementById('edit-srv-cliente').value = s.cliente;
  document.getElementById('edit-srv-descricao').value = s.descricao;
  document.getElementById('edit-srv-valor').value = s.valor;
  document.getElementById('edit-srv-prazo').value = s.prazo;
  document.getElementById('edit-srv-status').value = s.status;

  openModal('modal-servico');
}

function salvarEdicaoServico() {
  servicos[editIndex] = {
    numero: document.getElementById('edit-srv-numero').value.trim(),
    cliente: document.getElementById('edit-srv-cliente').value.trim(),
    descricao: document.getElementById('edit-srv-descricao').value.trim(),
    valor: document.getElementById('edit-srv-valor').value.trim(),
    prazo: document.getElementById('edit-srv-prazo').value,
    status: document.getElementById('edit-srv-status').value,
    dataCad: servicos[editIndex].dataCad
  };

  save();
  closeModal('modal-servico');
  renderServicos();
  renderDashboard();
  notify('Serviço atualizado!');
}

function excluirServico(i) {
  if (confirm('Excluir este serviço?')) {
    servicos.splice(i, 1);
    save();
    renderServicos();
    renderDashboard();
    notify('Serviço excluído.');
  }
}

function renderDashboard() {
  document.getElementById('stat-clientes').textContent = clientes.length;
  document.getElementById('stat-funcionarios').textContent = funcionarios.length;
  document.getElementById('stat-concluidos').textContent = servicos.filter(s => s.status === 'concluida').length;
  document.getElementById('stat-andamento').textContent = servicos.filter(s => s.status === 'andamento').length;

  const ws = document.getElementById('widget-servicos');
  const ultServicos = [...servicos].reverse().slice(0, 5);

  if (!ultServicos.length) {
    ws.innerHTML = '<div class="empty-state">Nenhum serviço registrado.</div>';
  } else {
    const statusLabel = {
      andamento: 'Em Andamento',
      concluida: 'Concluída',
      cancelada: 'Cancelada'
    };

    ws.innerHTML = ultServicos.map(s => `
      <div class="recent-item">
        <div>
          <div class="name">${s.numero} — ${s.cliente}</div>
          <div class="sub">${s.descricao.substring(0, 35)}${s.descricao.length > 35 ? '...' : ''}</div>
        </div>
        <span class="status ${s.status}">${statusLabel[s.status]}</span>
      </div>
    `).join('');
  }

  const wc = document.getElementById('widget-clientes');
  const ultClientes = [...clientes].reverse().slice(0, 5);

  if (!ultClientes.length) {
    wc.innerHTML = '<div class="empty-state">Nenhum cliente cadastrado.</div>';
  } else {
    wc.innerHTML = ultClientes.map(c => `
      <div class="recent-item">
        <div>
          <div class="name">${c.nome}</div>
          <div class="sub">${c.cidade} · ${c.celular}</div>
        </div>
        <span style="font-size:11px;color:var(--text3);">${c.dataCad}</span>
      </div>
    `).join('');
  }
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('open');
  });
});

function filtrarTabela(tableId, query) {
  const q = query.toLowerCase();
  const rows = document.querySelectorAll('#' + tableId + ' tbody tr:not(.empty-row)');

  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function limparForm(tipo) {
  if (tipo === 'cliente') {
    ['cli-nome', 'cli-cpfcnpj', 'cli-email', 'cli-celular', 'cli-cidade'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  if (tipo === 'funcionario') {
    ['func-nome', 'func-cpf', 'func-cargo', 'func-salario', 'func-telefone'].forEach(id => {
      document.getElementById(id).value = '';
    });
  }

  if (tipo === 'servico') {
    ['srv-numero', 'srv-cliente', 'srv-descricao', 'srv-valor', 'srv-prazo'].forEach(id => {
      document.getElementById(id).value = '';
    });

    document.getElementById('srv-status').value = 'andamento';
  }
}

function maskCPFCNPJ(input) {
  let v = input.value.replace(/\D/g, '');

  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
  }

  input.value = v;
}

function maskPhone(input) {
  let v = input.value.replace(/\D/g, '');

  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else {
    v = v.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
  }

  input.value = v;
}

document.getElementById('cli-cpfcnpj').addEventListener('input', function () {
  maskCPFCNPJ(this);
});

document.getElementById('cli-celular').addEventListener('input', function () {
  maskPhone(this);
});

document.getElementById('func-cpf').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  this.value = v;
});

document.getElementById('func-telefone').addEventListener('input', function () {
  maskPhone(this);
});

function updateDate() {
  const now = new Date();

  document.getElementById('topbar-date').textContent = now.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

renderDashboard();